const TIP_HOME_PLAYER = "TIP_HOME_GOALS";
const TIP_AWAY_PLAYER = "TIP_AWAY_GOALS";

function cleanVoterName(name) {
  return String(name || "").trim().toLowerCase();
}

function decodeGoals(value) {
  return Number(value) - 1;
}

function getActual(match) {
  if (!match) return null;

  const home = Number(match.actual_home ?? match.actual?.home);
  const away = Number(match.actual_away ?? match.actual?.away);

  if (Number.isNaN(home) || Number.isNaN(away)) return null;

  return { home, away };
}

function getOutcome(home, away) {
  home = Number(home);
  away = Number(away);

  if (home > away) return "H";
  if (home < away) return "B";
  return "U";
}

function scorePrediction(tipHome, tipAway, actualHome, actualAway) {
  tipHome = Number(tipHome);
  tipAway = Number(tipAway);
  actualHome = Number(actualHome);
  actualAway = Number(actualAway);

  if (tipHome === actualHome && tipAway === actualAway) return 3;

  const sameOutcome =
    getOutcome(tipHome, tipAway) === getOutcome(actualHome, actualAway);

  const sameGoalDiff =
    (tipHome - tipAway) === (actualHome - actualAway);

  if (sameOutcome && sameGoalDiff) return 2;
  if (sameOutcome) return 1;
  return 0;
}

function isPredictionVote(v) {
  return (
    v &&
    v.match_id &&
    v.match_id !== "TEST" &&
    (v.player === TIP_HOME_PLAYER || v.player === TIP_AWAY_PLAYER)
  );
}

function buildPredictions(votes) {
  const map = {};

  (votes || []).filter(isPredictionVote).forEach(v => {
    const voter = cleanVoterName(v.voter);
    const key = `${v.match_id}|||${voter}`;

    if (!map[key]) {
      map[key] = {
        match_id: v.match_id,
        voter,
        home: null,
        away: null
      };
    }

    if (v.player === TIP_HOME_PLAYER) map[key].home = decodeGoals(v.rating);
    if (v.player === TIP_AWAY_PLAYER) map[key].away = decodeGoals(v.rating);
  });

  return Object.values(map).filter(p => p.home !== null && p.away !== null);
}

function buildTipRows(votes, matches) {
  const matchesById = {};

  (matches || []).forEach(match => {
    matchesById[match.id] = match;
  });

  return buildPredictions(votes)
    .map(prediction => {
      const match = matchesById[prediction.match_id];
      const actual = getActual(match);

      if (!match || !actual) return null;

      const points = scorePrediction(
        prediction.home,
        prediction.away,
        actual.home,
        actual.away
      );

      return {
        ...prediction,
        match,
        actual,
        points
      };
    })
    .filter(Boolean);
}
