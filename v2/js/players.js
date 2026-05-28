export const players = [
  { name: "Alexander Pedersen", short: "Pedersen", position: "KEEPER", image: "../bilder/pedersen.png" },
  { name: "Sander Amble Haugen", short: "SAH", position: "FORS", image: "../bilder/sah.png" },
  { name: "William Sell", short: "Sell", position: "FORS", image: "../bilder/sell.png" },
  { name: "Ådne Midtskogen", short: "Midtskogen", position: "FORS", image: "../bilder/midtskogen.png" },
  { name: "Herman Solberg Nilsen", short: "HSN", position: "FORS", image: "../bilder/hsn.png" },
  { name: "Isaac Barnett", short: "Barnett", position: "FORS", image: "../bilder/barnett.png" },

  { name: "Didrik Fredriksen", short: "Fredriksen", position: "MID", image: "../bilder/fredriksen.png" },
  { name: "Eron Isufi", short: "Isufi", position: "MID", image: "../bilder/isufi.png" },
  { name: "Julius Skaug", short: "Skaug", position: "MID", image: "../bilder/skaug.png" },
  { name: "William Kurtovic", short: "Kurtovic", position: "MID", image: "../bilder/kurtovic.png" },
  { name: "Isaac Monglo", short: "Monglo", position: "MID", image: "../bilder/monglo.png" },
  { name: "William Wæhler", short: "Wæhler", position: "MID", image: "../bilder/wæhler.png" },
  { name: "Marcus Andersen", short: "Andersen", position: "MID", image: "../bilder/andersen.png" },
  { name: "Magnus Aadland", short: "Aadland", position: "MID", image: "../bilder/aadland.png" },

  { name: "Anders Bjørntvedt Olsen", short: "ABO", position: "ANG", image: "../bilder/abo.png" },
  { name: "Matias Johansen", short: "MJ", position: "ANG", image: "../bilder/mj.png" },
  { name: "Andreas Hellum", short: "Hellum", position: "ANG", image: "../bilder/hellum.png" },
  { name: "Ibrahim Sawaneh", short: "Sawaneh", position: "ANG", image: "../bilder/sawaneh.png" },
  { name: "Fallou Sock", short: "Sock", position: "ANG", image: "../bilder/sock.png" },

  { name: "Isak Vik", short: "Vik", position: "KEEPER", image: "../bilder/vik.png" },
  { name: "Mats Trige", short: "Trige", position: "KEEPER", image: "../bilder/trige.png" },

  { name: "Mamadou Gueye", short: "Gueye", position: "MID", image: "../bilder/gueye.png" }
];

export function findPlayer(name) {
  const wanted = String(name || "").trim().toLowerCase();

  return players.find(p =>
    p.short.toLowerCase() === wanted ||
    p.name.toLowerCase() === wanted
  ) || null;
}

export function getPlayerPosition(name) {
  return findPlayer(name)?.position || "";
}
