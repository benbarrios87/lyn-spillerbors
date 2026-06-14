export const players = [
  {
    id: "pedersen",
    name: "Alexander Pedersen",
    short: "Pedersen",
    image: "../bilder/pedersen.png",
    position: "KEEPER",
    order: 1,
    aliases: ["Pedersen", "Alexander Pedersen"]
  },
  {
    id: "trige",
    name: "Mats Trige",
    short: "Trige",
    image: "../bilder/trige.png",
    position: "KEEPER",
    order: 9999,
    aliases: ["Trige", "Mats Trige"]
  },

  {
    id: "sah",
    name: "Sander Amble Haugen",
    short: "SAH",
    image: "../bilder/sah.png",
    position: "FORS",
    order: 2,
    aliases: ["SAH", "Sander Amble Haugen"]
  },
  {
    id: "sell",
    name: "William Sell",
    short: "Sell",
    image: "../bilder/sell.png",
    position: "FORS",
      order: 3,
    aliases: ["Sell", "William Sell"]
  },
  {
    id: "midtskogen",
    name: "Ådne Midtskogen",
    short: "Midtskogen",
    image: "../bilder/midtskogen.png",
    position: "FORS",
      order: 4,
    aliases: ["Midtskogen", "Ådne Midtskogen"]
  },
  {
    id: "hsn",
    name: "Herman Solberg Nilsen",
    short: "HSN",
    image: "../bilder/hsn.png",
    position: "FORS",
      order: 5,
    aliases: ["HSN", "Herman Solberg Nilsen"]
  },
  {
    id: "barnett",
    name: "Isaac Barnett",
    short: "Barnett",
    image: "../bilder/barnett.png",
    position: "FORS",
    aliases: ["Barnett", "Isaac Barnett"]
  },
  {
    id: "vik",
    name: "Isak Vik",
    short: "Vik",
    image: "../bilder/vik.png",
    position: "FORS",
    aliases: ["Vik", "Isak Vik"]
  },
  {
    id: "gueye",
    name: "Ousmane Gueye",
    short: "Gueye",
    image: "../bilder/gueye.png",
    position: "FORS",
    aliases: ["Gueye", "Ousmane Gueye"]
  },

  {
    id: "fredriksen",
    name: "Didrik Fredriksen",
    short: "Fredriksen",
    image: "../bilder/fredriksen.png",
    position: "MID",
      order: 6,
    aliases: ["Fredriksen", "Didrik Fredriksen"]
  },
  {
    id: "isufi",
    name: "Eron Isufi",
    short: "Isufi",
    image: "../bilder/isufi.png",
    position: "MID",
    aliases: ["Isufi", "Eron Isufi"]
  },
  {
    id: "skaug",
    name: "Julius Skaug",
    short: "Skaug",
    image: "../bilder/skaug.png",
    position: "MID",
    aliases: ["Skaug", "Julius Skaug"]
  },
  {
    id: "kurtovic",
    name: "William Kurtovic",
    short: "Kurtovic",
    image: "../bilder/kurtovic.png",
    position: "MID",
      order: 7,
    aliases: ["Kurtovic", "William Kurtovic"]
  },
  {
    id: "monglo",
    name: "Isaac Monglo",
    short: "Monglo",
    image: "../bilder/monglo.png",
    position: "MID",
      order: 8,
    aliases: ["Monglo", "Isaac Monglo"]
  },
   {
  id: "nøis",
  name: "Johan Solstad-Nøis",
  short: "Nøis",
  image: "../bilder/nois.png",
  position: "MID",
  order: 12,
  aliases: ["nois", "Nøis", "Johan Solstad-Nøis", "Solstad-Nøis", "Solstad Nois"]
},
  {
    id: "waehler",
    name: "William Wæhler",
    short: "Wæhler",
    image: "../bilder/wæhler.png",
    position: "MID",
    aliases: ["Wæhler", "Wæhler", "William Wæhler", "Waehler", "William Waehler"]
  },
  {
    id: "andersen",
    name: "Marcus Andersen",
    short: "Andersen",
    image: "../bilder/andersen.png",
    position: "KEEPER",
    order: 9999,
    aliases: ["Andersen", "Marcus Andersen"]
  },
  {
    id: "aadland",
    name: "Magnus Aadland",
    short: "Aadland",
    image: "../bilder/aadland.png",
    position: "MID",
    order: 9998,
    aliases: ["Aadland", "Magnus Aadland", "Ådland", "Magnus Ådland"]
  },

  {
    id: "abo",
    name: "Anders Bjørntvedt Olsen",
    short: "ABO",
    image: "../bilder/abo.png",
    position: "ANG",
      order: 9,
    aliases: ["ABO", "Anders Bjørntvedt Olsen"]
  },
  {
    id: "mj",
    name: "Matias Johansen",
    short: "MJ",
    image: "../bilder/mj.png",
    position: "ANG",
      order: 10,
    aliases: ["MJ", "Matias Johansen"]
  },
  {
    id: "hellum",
    name: "Andreas Hellum",
    short: "Hellum",
    image: "../bilder/hellum.png",
    position: "ANG",
      order: 11,
    aliases: ["Hellum", "Andreas Hellum"]
  },
  {
    id: "sawaneh",
    name: "Ibrahim Sawaneh",
    short: "Sawaneh",
    image: "../bilder/sawaneh.png",
    position: "ANG",
    aliases: ["Sawaneh", "Ibrahim Sawaneh"]
  },
  {
    id: "sock",
    name: "Fallou Sock",
    short: "Sock",
    image: "../bilder/sock.png",
    position: "ANG",
    aliases: ["Sock", "Fallou Sock"]
  }
];

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ø", "o")
    .replaceAll("æ", "ae")
    .replaceAll("ü", "u")
    .replaceAll("é", "e");
}

export function findPlayer(value) {
  const wanted = normalize(value);

  return players.find(player => {
    if (normalize(player.id) === wanted) return true;
    if (normalize(player.short) === wanted) return true;
    if (normalize(player.name) === wanted) return true;

    return player.aliases.some(alias =>
      normalize(alias) === wanted
    );
  }) || null;
}

export function getPlayer(value) {
  return findPlayer(value);
}

export function getPlayerId(value) {
  return findPlayer(value)?.id || null;
}

export function getPlayerShort(value) {
  return findPlayer(value)?.short || value;
}

export function getPlayerDisplayName(value) {
  return findPlayer(value)?.name || value;
}

export function getPlayerImage(value) {
  return findPlayer(value)?.image || "../lblogoen.png";
}

export function getPlayerPosition(value) {
  return findPlayer(value)?.position || "";
}

export function getAllPlayers() {
  return players;
}

export function getPlayersByPosition(position) {
  return players.filter(player => player.position === position);
}
