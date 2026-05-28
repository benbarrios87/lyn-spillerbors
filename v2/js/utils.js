export function cleanName(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeMatchId(id) {
  return String(id || "")
    .trim()
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ");
}

export function formatDate(dateString) {
  if (!dateString) return "";

  const d = new Date(dateString);

  if (Number.isNaN(d.getTime())) return String(dateString);

  return d.toLocaleDateString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export function formatShortDate(dateString) {
  if (!dateString) return "";

  const d = new Date(dateString);

  if (Number.isNaN(d.getTime())) return String(dateString).slice(0, 5);

  return d.toLocaleDateString("no-NO", {
    day: "2-digit",
    month: "2-digit"
  });
}

export function getActualScore(match) {
  if (!match) return null;

  const home = Number(match.actual_home);
  const away = Number(match.actual_away);

  if (Number.isNaN(home) || Number.isNaN(away)) return null;

  return { home, away };
}
