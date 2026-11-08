import { supabaseClient } from "./supabase.js";
import { TABLES, SPECIAL_PLAYERS } from "./config.js";
import { cleanName, normalizeMatchId } from "./utils.js";
import { findMatch } from "./matches.js";

export async function fetchVotes() {
  const { data, error } = await supabaseClient
    .from(TABLES.votes)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("Kunne ikke hente stemmer:", error);
    return [];
  }

  return data || [];
}

export function isPredictionVote(vote) {
  return (
    vote?.player === SPECIAL_PLAYERS.tipHome ||
    vote?.player === SPECIAL_PLAYERS.tipAway
  );
}

export function isAwayFansVote(vote) {
  return vote?.player === SPECIAL_PLAYERS.awayFans;
}

export function isPlayerRatingVote(vote) {
  return (
    vote &&
    vote.match_id &&
    vote.match_id !== "TEST" &&
    !isPredictionVote(vote) &&
    !isAwayFansVote(vote)
  );
}

export function getPlayerVotes(votes) {
  return (votes || []).filter(isPlayerRatingVote);
}

export function buildPlayerRatingStats(votes) {
  const stats = {};

  getPlayerVotes(votes).forEach(vote => {
    const player = String(vote.player || "").trim();
    const rating = Number(vote.rating);

    if (!player || Number.isNaN(rating)) return;

    if (!stats[player]) {
      stats[player] = {
        player,
        votes: 0,
        total: 0,
        average: 0,
        matches: {},
        bestMatch: null,
        worstMatch: null
      };
    }

    stats[player].votes += 1;
    stats[player].total += rating;

    const matchId = normalizeMatchId(vote.match_id);

    if (!stats[player].matches[matchId]) {
      stats[player].matches[matchId] = {
        match_id: matchId,
        votes: 0,
        total: 0,
        average: 0
      };
    }

    stats[player].matches[matchId].votes += 1;
    stats[player].matches[matchId].total += rating;
  });

  Object.values(stats).forEach(playerStats => {
    playerStats.average = round(playerStats.total / playerStats.votes);

    Object.values(playerStats.matches).forEach(matchStats => {
      matchStats.average = round(matchStats.total / matchStats.votes);
    });

    const matchList = Object.values(playerStats.matches);

    playerStats.bestMatch =
      matchList.length
        ? [...matchList].sort((a, b) => b.average - a.average)[0]
        : null;

    playerStats.worstMatch =
      matchList.length
        ? [...matchList].sort((a, b) => a.average - b.average)[0]
        : null;
  });

  return stats;
}

export function buildMatchRatingStats(votes) {
  const matchMap = {};

  getPlayerVotes(votes).forEach(vote => {
    const matchId = normalizeMatchId(vote.match_id);
    const player = String(vote.player || "").trim();
    const rating = Number(vote.rating);

    if (!matchId || !player || Number.isNaN(rating)) return;

    if (!matchMap[matchId]) {
      matchMap[matchId] = {
        match_id: matchId,
        players: {},
        totalVotes: 0
      };
    }

    if (!matchMap[matchId].players[player]) {
      matchMap[matchId].players[player] = {
        player,
        votes: 0,
        total: 0,
        average: 0
      };
    }

    matchMap[matchId].players[player].votes += 1;
    matchMap[matchId].players[player].total += rating;
    matchMap[matchId].totalVotes += 1;
  });

  Object.values(matchMap).forEach(matchStats => {
    Object.values(matchStats.players).forEach(playerStats => {
      playerStats.average = round(playerStats.total / playerStats.votes);
    });

    matchStats.ranking = Object.values(matchStats.players)
      .filter(p => p.votes >= 1)
      .sort((a, b) => b.average - a.average);

    matchStats.bestPlayer = matchStats.ranking[0] || null;
  });

  return matchMap;
}

export function getSeasonRanking(votes, { minVotes = 1 } = {}) {
  const stats = buildPlayerRatingStats(votes);

  return Object.values(stats)
    .filter(player => player.votes >= minVotes)
    .sort((a, b) => b.average - a.average);
}

export function getMatchRanking(votes, matchId, { minVotes = 1 } = {}) {
  const matchStats = buildMatchRatingStats(votes);
  const wanted = normalizeMatchId(matchId);

  return (matchStats[wanted]?.ranking || [])
    .filter(player => player.votes >= minVotes);
}

export function getBestPlayersByMatch(votes, { minVotes = 1 } = {}) {
  const matchStats = buildMatchRatingStats(votes);

  return Object.values(matchStats)
    .map(match => ({
      match_id: match.match_id,
      match: findMatch(match.match_id),
      bestPlayer: match.ranking.find(player => player.votes >= minVotes) || null
    }))
    .filter(row => row.bestPlayer);
}

export function getUserRatingStats(votes, username) {
  const wantedUser = cleanName(username);

  const userVotes = getPlayerVotes(votes).filter(vote =>
    cleanName(vote.voter) === wantedUser
  );

  const ratings = userVotes.map(vote => Number(vote.rating))
    .filter(rating => !Number.isNaN(rating));

  if (!ratings.length) {
    return {
      username: wantedUser,
      votes: 0,
      averageGiven: 0,
      highestGiven: null,
      lowestGiven: null
    };
  }

  return {
    username: wantedUser,
    votes: ratings.length,
    averageGiven: round(sum(ratings) / ratings.length),
    highestGiven: Math.max(...ratings),
    lowestGiven: Math.min(...ratings)
  };
}

export function round(number, decimals = 2) {
  return Number(Number(number || 0).toFixed(decimals));
}

function sum(numbers) {
  return numbers.reduce((total, number) => total + Number(number || 0), 0);
}

// Sesongens "awards": en håndfull morsomme kategorier utenom selve børssnittet
// (som er den ene offisielle "Årets Lynspiller"-rangeringen, via getSeasonRanking).
// Delt mellom historikk.html og lynligaen.html slik at begge viser samme tall.
export function buildPlayerAwards(votes, fantasyStatsRows = [], {
  minMatches = 5,
  previousVotes = null,
  previousMinMatches = 3
} = {}) {
  function matchesCount(playerStats) {
    return Object.keys(playerStats.matches).length;
  }

  const fullRanking = getSeasonRanking(votes, { minVotes: 1 });
  const ranking = fullRanking.filter(player => matchesCount(player) >= minMatches);

  const fantasyTotals = {};

  (fantasyStatsRows || []).forEach(row => {
    const player = String(row.player || "").trim();
    if (!player || row.match_id === "TEST") return;

    if (!fantasyTotals[player]) {
      fantasyTotals[player] = { goals: 0, assists: 0, cleanSheets: 0 };
    }

    fantasyTotals[player].goals += Number(row.goals || 0);
    fantasyTotals[player].assists += Number(row.assists || 0);

    if (row.clean_sheet) {
      fantasyTotals[player].cleanSheets += 1;
    }
  });

  function topFantasyStat(key) {
    const rows = Object.entries(fantasyTotals)
      .map(([player, totals]) => ({ player, value: totals[key] }))
      .filter(row => row.value > 0)
      .sort((a, b) => b.value - a.value);

    return rows[0] || null;
  }

  const topGoals = topFantasyStat("goals");
  const topAssists = topFantasyStat("assists");
  const topCleanSheets = topFantasyStat("cleanSheets");

  const ironManCandidates = fullRanking
    .map(player => ({ player: player.player, value: matchesCount(player) }))
    .sort((a, b) => b.value - a.value);

  const ironMan = ironManCandidates[0] || null;

  function stdDev(playerStats) {
    const matchAverages = Object.values(playerStats.matches).map(m => m.average);
    if (matchAverages.length < 2) return null;

    const mean = matchAverages.reduce((a, b) => a + b, 0) / matchAverages.length;
    const variance = matchAverages.reduce((a, b) => a + (b - mean) ** 2, 0) / matchAverages.length;

    return Math.sqrt(variance);
  }

  const mostStableCandidates = ranking
    .map(player => ({ player: player.player, value: stdDev(player) }))
    .filter(row => row.value !== null)
    .sort((a, b) => a.value - b.value);

  const mostStable = mostStableCandidates[0]
    ? { player: mostStableCandidates[0].player, value: round(mostStableCandidates[0].value, 2) }
    : null;

  let mostImproved = null;

  if (previousVotes && previousVotes.length) {
    const previousFullRanking = getSeasonRanking(previousVotes, { minVotes: 1 });
    const previousMap = {};

    previousFullRanking
      .filter(player => matchesCount(player) >= previousMinMatches)
      .forEach(player => { previousMap[player.player] = player.average; });

    const improved = ranking
      .filter(player => previousMap[player.player] !== undefined)
      .map(player => ({ player: player.player, value: round(player.average - previousMap[player.player], 2) }))
      .filter(row => row.value > 0)
      .sort((a, b) => b.value - a.value);

    mostImproved = improved[0] || null;
  }

  return { topGoals, topAssists, topCleanSheets, ironMan, mostStable, mostImproved };
}
