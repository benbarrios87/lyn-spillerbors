export const players = [

  {
    id: "pedersen",
    name: "Alexander Pedersen",
    short: "Pedersen",
    image: "../bilder/pedersen.png",
    position: "KEEPER",
    aliases: [
      "Pedersen",
      "Alexander Pedersen"
    ]
  },

  {
    id: "hellum",
    name: "Andreas Hellum",
    short: "Hellum",
    image: "../bilder/hellum.png",
    position: "ANG",
    aliases: [
      "Hellum",
      "Andreas Hellum"
    ]
  },

  {
    id: "monglo",
    name: "Isaac Monglo",
    short: "Monglo",
    image: "../bilder/monglo.png",
    position: "MID",
    aliases: [
      "Monglo",
      "Isaac Monglo"
    ]
  },

  {
    id: "mj",
    name: "Matias Johansen",
    short: "MJ",
    image: "../bilder/mj.png",
    position: "ANG",
    aliases: [
      "MJ",
      "Matias Johansen"
    ]
  },

  {
    id: "midtskogen",
    name: "Ådne Midtskogen",
    short: "Midtskogen",
    image: "../bilder/midtskogen.png",
    position: "FORS",
    aliases: [
      "Midtskogen",
      "Ådne Midtskogen"
    ]
  }

];

export function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function findPlayer(name) {

  const wanted = normalizeName(name);

  return players.find(player =>
    player.aliases.some(alias =>
      normalizeName(alias) === wanted
    )
  ) || null;
}

export function getPlayerImage(name) {
  return findPlayer(name)?.image || "../lblogoen.png";
}

export function getPlayerPosition(name) {
  return findPlayer(name)?.position || "";
}

export function getPlayerDisplayName(name) {
  return findPlayer(name)?.name || name;
}

export function getPlayerId(name) {
  return findPlayer(name)?.id || null;
}
