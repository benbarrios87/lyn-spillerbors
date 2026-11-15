// ⚠️ PROTOTYPE-DATA for "Sesongtips 2027".
//
// Status pr. nå (ifølge Ben):
//  - Raufoss og Åsane er rykket ned fra OBOS-ligaen – fjernet fra lista.
//  - Strømsgodset og Haugesund er rykket opp til Eliteserien – fjernet fra lista.
//  - Stabæk og Kongsvinger kjemper om opprykkskvalik-plassen (3. plass, som
//    møter Eliteserien i kvalifisering) – begge står fortsatt i lista siden
//    verste utfall for dem er å bli værende i OBOS-ligaen uansett.
//  - Sogndal har nedrykkskvalik mot Bjarg (fra 2. divisjon) – Sogndal står
//    fortsatt i lista inntil det er avgjort. Taper Sogndal, bytt Sogndal ut
//    med Bjarg.
//  - MANGLER: lag opprykket fra 2. divisjon som erstatning for
//    Strømsgodset/Haugesund er ikke kjent ennå – legg dem til når det er klart.
//
// Oppdater denne lista etter hvert som resten blir avgjort.

export const SEASON_YEAR = 2027;

// PLASSHOLDER: sett til faktisk tidspunkt for runde 1 i 2027 når kampoppsettet
// er sluppet. Tippingen låses automatisk når dette tidspunktet passeres.
export const LOCK_AT = "2027-03-01T00:00:00+01:00";

// id må være stabil (brukes til lagring). name er det som vises.
// color brukes til den genererte lag-"logoen" (sirkel med initialer) som
// vises når det ikke finnes en ekte logofil i bilder/klubber/{id}.png.
export const TEAMS_2027 = [
  { id: "bryne", name: "Bryne", color: "#1d4ed8" },
  { id: "egersund", name: "Egersund", color: "#0d9488" },
  { id: "hodd", name: "Hødd", color: "#2563eb" },
  { id: "kongsvinger", name: "Kongsvinger", color: "#1f2937" },
  { id: "lyn", name: "Lyn", color: "#d71920" },
  { id: "moss", name: "Moss", color: "#0ea5e9" },
  { id: "odd", name: "Odd", color: "#15803d" },
  { id: "ranheim", name: "Ranheim", color: "#7c3aed" },
  { id: "sandnesulf", name: "Sandnes Ulf", color: "#ca8a04" },
  { id: "sogndal", name: "Sogndal", color: "#dc2626" },
  { id: "stabaek", name: "Stabæk", color: "#3b82f6" },
  { id: "strommen", name: "Strømmen", color: "#334155" }
  // TODO: legg til lag opprykket fra 2. divisjon (og evt. Bjarg hvis Sogndal
  // taper kvalik) når det er avgjort, slik at lista igjen blir 16 lag.
];

export function getTeam(id) {
  return TEAMS_2027.find(team => team.id === id) || null;
}

export function teamInitials(name) {
  const cleaned = String(name || "").replace(/[^\p{L}\s]/gu, "");
  const words = cleaned.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return cleaned.slice(0, 2).toUpperCase();
}

// Prøver en ekte klubblogo fra bilder/klubber/{id}.png først. Finnes ikke
// filen, forsvinner <img> via onerror og initial-bokstavene vises i stedet.
// Initialene er skjult (display:none) så lenge en ekte logo vises, så de
// ikke skinner gjennom gjennomsiktige hjørner på skjold-formede logoer.
export function teamCrestHtml(team, size = 34) {
  return `
    <span class="team-crest" style="width:${size}px;height:${size}px;background:${team.color}">
      <img src="../bilder/klubber/${team.id}.png" alt="" loading="lazy"
           onerror="var p=this.parentElement; this.remove(); p.querySelector('.crest-fallback').style.display='inline';">
      <span class="crest-fallback" style="display:none;">${teamInitials(team.name)}</span>
    </span>
  `;
}

export function isLocked() {
  return new Date() >= new Date(LOCK_AT);
}

// Lyns 2027-kamper, utledet automatisk fra laglisten (dobbel serie, alle mot
// alle, hjemme og borte) – de faktiske datoene/rundene er ikke kjent før
// kampoppsettet slippes, men MOTSTANDERNE er kjent så snart laglisten er satt.
export function getLynFixtures() {
  return TEAMS_2027
    .filter(team => team.id !== "lyn")
    .flatMap(team => [
      { id: `${team.id}_h`, opponent: team, venue: "hjemme", label: `Lyn – ${team.name}` },
      { id: `${team.id}_b`, opponent: team, venue: "borte", label: `${team.name} – Lyn` }
    ]);
}

// --- Poengberegning tabelltipping -----------------------------------------
//
// Grunnpoeng: n poeng per lag hvis helt riktig plass, færre poeng jo lenger
// unna du bommer (n = antall lag). Det er langt mer rettferdig enn "alt
// eller ingenting", siden nesten ingen treffer en 16-lags tabell eksakt.
//
// Pluss to bonuser på toppen, siden dette er en Lyn-side og ikke et generelt
// tippespill:
//  - LYN_EXACT_BONUS: egen bonus for å treffe Lyn sin eksakte sluttplassering
//    (det er plasseringen de fleste faktisk bryr seg mest om).
//  - ZONE_BONUS: bonus per lag du plasserer riktig i opprykks- eller
//    nedrykkssonen, selv om rekkefølgen internt i sonen ikke stemmer. Å vite
//    HVEM som rykker opp/ned er ofte viktigere enn eksakt rekkefølge der.
//
// PROMOTION_ZONE_SIZE/RELEGATION_ZONE_SIZE er satt til vanlige størrelser for
// OBOS-ligaen, men formatet (antall kvalik-/nedrykksplasser) kan variere fra
// sesong til sesong – juster disse to tallene når 2027-formatet er bekreftet.

export const LYN_EXACT_BONUS = 10;
export const ZONE_BONUS_PER_TEAM = 5;
export const PROMOTION_ZONE_SIZE = 3; // f.eks. plass 1-3 (direkte opprykk + kvalik)
export const RELEGATION_ZONE_SIZE = 2; // f.eks. de 2 nederste plassene

export function scoreTablePrediction(predictedIds, actualIds) {
  const actualPos = {};
  actualIds.forEach((id, i) => { actualPos[id] = i; });

  const n = actualIds.length;
  let total = 0;

  predictedIds.forEach((id, i) => {
    if (actualPos[id] === undefined) return;
    const diff = Math.abs(i - actualPos[id]);
    total += Math.max(0, n - diff);
  });

  const lynActual = actualPos["lyn"];
  const lynPredicted = predictedIds.indexOf("lyn");
  if (lynActual !== undefined && lynPredicted === lynActual) {
    total += LYN_EXACT_BONUS;
  }

  const promotedActual = new Set(actualIds.slice(0, PROMOTION_ZONE_SIZE));
  const relegatedActual = new Set(actualIds.slice(n - RELEGATION_ZONE_SIZE));

  predictedIds.slice(0, PROMOTION_ZONE_SIZE).forEach(id => {
    if (promotedActual.has(id)) total += ZONE_BONUS_PER_TEAM;
  });

  predictedIds.slice(n - RELEGATION_ZONE_SIZE).forEach(id => {
    if (relegatedActual.has(id)) total += ZONE_BONUS_PER_TEAM;
  });

  return total;
}

// --- Poengberegning kamptipping --------------------------------------------
//
// Uavgjort gir mer enn seier/tap, fordi uavgjort statistisk er mye
// vanskeligere å gjette riktig (samme logikk som i vanlige tippekonkurranser).

export const POINTS_WIN_OR_LOSS = 3;
export const POINTS_DRAW = 5;

export function scoreMatchPrediction(pick, actualOutcome) {
  if (pick !== actualOutcome) return 0;
  return pick === "uavgjort" ? POINTS_DRAW : POINTS_WIN_OR_LOSS;
}
