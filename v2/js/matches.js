import { supabaseClient } from "./supabase.js";
import { TABLES } from "./config.js";
import { normalizeMatchId } from "./utils.js";

let cachedMatches = [];

export async function fetchMatches({ activeOnly = false } = {}) {
  let query = supabaseClient
    .from(TABLES.matches)
    .select("*")
    .order("date", { ascending: true });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Kunne ikke hente kamper:", error);
    return [];
  }

  cachedMatches = data || [];
  return cachedMatches;
}

export function getCachedMatches() {
  return cachedMatches;
}

export function findMatch(matchId) {
  const wanted = normalizeMatchId(matchId);

  return cachedMatches.find(match =>
    normalizeMatchId(match.id) === wanted
  ) || null;
}
