const challenge = {

  title: "Lyn vs Fram",

  date: "11.11.2023",

  result: "10-1",

  formation: "4-3-3",

  lineup: [
    "Alexander Pedersen",
    "Herman Solberg Nilsen",
    "Schneider",
    "William Sell",
    "Meinseth",
    "Even Bydal",
    "Henrik Elvevold",
    "Kristiansen",
    "Ole Breistøl",
    "Hellum",
    "Olsen"
  ]

};

document.getElementById("info").innerHTML = `
  <p>${challenge.title}</p>
  <p>${challenge.date}</p>
  <p>${challenge.result}</p>
  <p>${challenge.formation}</p>
`;

let guessed = [];

let lives = 3;

function normalize(str) {

  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

}

function submitGuess() {

  const input =
    document.getElementById("guessInput");

  const guess =
    normalize(input.value);

  input.value = "";

  const found =
    challenge.lineup.find(player => {

      const full =
        normalize(player);

      const last =
        normalize(
          player.split(" ").slice(-1)[0]
        );

      return (
        guess === full ||
        guess === last
      );

    });

  if(found && !guessed.includes(found)) {

    guessed.push(found);

    renderPlayers();

    document.getElementById(
      "message"
    ).innerText = "✅ Riktig!";

  }

  else {

    lives--;

    renderLives();

    document.getElementById(
      "message"
    ).innerText = "❌ Feil";

  }

}

function renderPlayers() {

  const div =
    document.getElementById(
      "guessedPlayers"
    );

  div.innerHTML =
    guessed.map(player => `
      <div class="player">
        ${player}
      </div>
    `).join("");

}

function renderLives() {

  document.getElementById(
    "lives"
  ).innerText =
    "❤️".repeat(lives);

}
