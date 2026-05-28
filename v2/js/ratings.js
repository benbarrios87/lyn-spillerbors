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
export function calculateMVPScore(playerStats, fantasyStats = {}) {

  const fantasy = fantasyStats[playerStats.player] || {};

  const goals = Number(fantasy.goals || 0);
  const assists = Number(fantasy.assists || 0);
  const cleanSheets = Number(fantasy.clean_sheets || 0);

  return round(
    (playerStats.average * 10) +
    (goals * 2) +
    (assists * 1.5) +
    (cleanSheets * 1)
  , 2);
}

export function buildMVPRanking(votes, fantasyStatsRows = []) {

  const ranking = getSeasonRanking(votes, {
    minVotes: 5
  });

  const fantasyTotals = {};

  fantasyStatsRows.forEach(row => {

    const player = String(row.player || "").trim();

    if (!player) return;

    if (!fantasyTotals[player]) {
      fantasyTotals[player] = {
        goals: 0,
        assists: 0,
        clean_sheets: 0
      };
    }

    fantasyTotals[player].goals += Number(row.goals || 0);
    fantasyTotals[player].assists += Number(row.assists || 0);

    if (row.clean_sheet) {
      fantasyTotals[player].clean_sheets += 1;
    }
  });

  return ranking.map(playerStats => ({
    ...playerStats,
    mvpScore: calculateMVPScore(playerStats, fantasyTotals)
  }))
  .sort((a, b) => b.mvpScore - a.mvpScore);
}
