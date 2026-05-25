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
  <div>${challenge.title}</div>
  <div>${challenge.date}</div>
  <div>${challenge.result}</div>
  <div>${challenge.formation}</div>
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

function renderPitch() {

  const pitch =
    document.getElementById("pitch");

  pitch.innerHTML =
    challenge.lineup.map(player => {

      const isGuessed =
        guessed.includes(player);

      return `
        <div class="
          player
          ${isGuessed ? "correct" : "empty"}
        ">
          ${isGuessed ? player : "?"}
        </div>
      `;

    }).join("");

}

function renderLives() {

  document.getElementById(
    "lives"
  ).innerText =
    "❤️".repeat(lives);

}

function endGame(text) {

  document.getElementById(
    "message"
  ).innerText = text;

  document.getElementById(
    "guessInput"
  ).disabled = true;

}

function submitGuess() {

  const input =
    document.getElementById(
      "guessInput"
    );

  const guess =
    normalize(input.value);

  input.value = "";

  if(!guess) return;

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

  if(found) {

    if(guessed.includes(found)) {

      document.getElementById(
        "message"
      ).innerText =
        "⚠️ Allerede gjettet";

      return;

    }

    guessed.push(found);

    renderPitch();

    document.getElementById(
      "message"
    ).innerText =
      "✅ Riktig!";

    if(
      guessed.length ===
      challenge.lineup.length
    ) {

      endGame(
        "🏆 DU KLARTE DAGENS LYN XI"
      );

    }

  }

  else {

    lives--;

    renderLives();

    document.getElementById(
      "message"
    ).innerText =
      "❌ Feil";

    if(lives <= 0) {

      endGame(
        "💀 Game over"
      );

    }

  }

}

document
  .getElementById("guessInput")
  .addEventListener("keydown", e => {

    if(e.key === "Enter") {
      submitGuess();
    }

});

renderPitch();
