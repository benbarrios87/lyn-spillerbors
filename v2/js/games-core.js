import { supabaseClient } from "./supabase.js";

export function getGameUser() {
  return (
    localStorage.getItem("lynbors_voter") ||
    localStorage.getItem("lynBorsUsername") ||
    localStorage.getItem("username") ||
    localStorage.getItem("voter") ||
    localStorage.getItem("forumName") ||
    ""
  ).trim();
}

export async function saveGameScore({
  game,
  challengeId,
  score,
  maxScore = 100,
  attempts = 1,
  details = {}
}) {
  const voter = getGameUser();

  if (!voter) {
    alert("Sett forumnavn på forsiden først.");
    return false;
  }

  const cleanGame = String(game || "").trim();
  const cleanChallengeId = String(challengeId || "daily").trim();
  const cleanScore = Number(score || 0);
  const cleanMaxScore = Number(maxScore || 100);
  const cleanAttempts = Number(attempts || 1);

  if (!cleanGame) {
    console.error("Mangler game-id ved lagring.");
    alert("Klarte ikke å lagre score. Mangler game-id.");
    return false;
  }

  const { error } = await supabaseClient
    .from("game_scores")
    .upsert({
      game: cleanGame,
      challenge_id: cleanChallengeId,
      voter,
      score: cleanScore,
      max_score: cleanMaxScore,
      attempts: cleanAttempts,
      details
    }, {
      onConflict: "game,challenge_id,voter"
    });

  if (error) {
    console.error("Kunne ikke lagre game score:", error);
    alert("Klarte ikke å lagre score. Sjekk Console.");
    return false;
  }

  return true;
}

export async function getGameLeaderboard(game) {
  const cleanGame = String(game || "").trim();

  if (!cleanGame) return [];

  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("*")
    .eq("game", cleanGame)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Kunne ikke hente leaderboard:", error);
    return [];
  }

  return data || [];
}

export async function hasPlayedToday(game, challengeId) {
  const voter = getGameUser();

  if (!voter) return false;

  const cleanGame = String(game || "").trim();
  const cleanChallengeId = String(challengeId || "daily").trim();

  if (!cleanGame) return false;

  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("id")
    .eq("game", cleanGame)
    .eq("challenge_id", cleanChallengeId)
    .eq("voter", voter)
    .maybeSingle();

  if (error) {
    console.error("Kunne ikke sjekke om game er spilt:", error);
    return false;
  }

  return !!data;
}
