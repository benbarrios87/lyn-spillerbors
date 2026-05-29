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

  const { error } = await supabaseClient
    .from("game_scores")
    .upsert({
      game,
      challenge_id: challengeId,
      voter,
      score,
      max_score: maxScore,
      attempts,
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
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("*")
    .eq("game", game)
    .order("score", { ascending:false })
    .order("created_at", { ascending:true });

  if (error) {
    console.error("Kunne ikke hente leaderboard:", error);
    return [];
  }

  return data || [];
}
