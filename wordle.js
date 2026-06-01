import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

function normalize(str) {
  return String(str || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Æ/g, "AE")
    .replace(/Ø/g, "O")
    .replace(/Å/g, "A")
    .replace(/[^A-Z]/g, "");
}

const startDate =
  new Date("2026-01-01");

const today =
  new Date();

const diffDays =
  Math.floor(
    (today - startDate) /
    (1000 * 60 * 60 * 24)
  );

const rawAnswer =
  players[diffDays % players.length];

const answer =
  normalize(rawAnswer);

const challengeId =
  `wordle-${diffDays}-${answer}`;
const maxGuesses = 6;
let guesses = [];
let finished = false;
let scoreSaved = false;

const board =
  document.getElementById("board");

const statusBox =
  document.getElementById("status");

const message =
  document.getElementById("message");

const guessInput =
  document.getElementById("guessInput");

async function initPlayedCheck() {
  const alreadyPlayed =
    await hasPlayedToday("wordle", challengeId);

  if (!alreadyPlayed) return;

  finished = true;
guessInput.disabled = true;

const btn = document.querySelector(".guess-box button");
if (btn) btn.disabled = true;

message.innerHTML =
  "🏆 Du har allerede spilt dagens Lyn Wordle";
}

function calculateWordleScore(won = false) {
  if (!won) return 0;

  const attempts =
    guesses.length;

  const scores = {
    1: 100,
    2: 85,
    3: 70,
    4: 55,
    5: 40,
    6: 25
  };

  return scores[attempts] || 0;
}

function saveWordleScore(won = false) {
  if (scoreSaved) return;

  scoreSaved = true;

  const finalScore =
    calculateWordleScore(won);

  saveGameScore({
    game: "wordle",
    challengeId,
    score: finalScore,
    maxScore: 100,
    attempts: guesses.length,
    details: {
      answer,
      guesses,
      won,
      user: getGameUser()
    }
  }).then(result => {
    console.log("Wordle score lagret:", result, finalScore);
  });
}

function renderBoard() {
  board.innerHTML = "";

  statusBox.innerHTML =
    `Dagens navn har ${answer.length} bokstaver`;

  for (let r = 0; r < maxGuesses; r++) {
    const row =
      document.createElement("div");

    row.className = "word-row";

    const guess =
      guesses[r] || "";

    for (let i = 0; i < answer.length; i++) {
      const tile =
        document.createElement("div");

      tile.className = "tile";

      const letter =
        guess[i] || "";

      tile.textContent = letter;

      if (guess) {
        if (letter === answer[i]) {
          tile.classList.add("correct");
        } else if (answer.includes(letter)) {
          tile.classList.add("present");
        } else {
          tile.classList.add("absent");
        }
      }

      row.appendChild(tile);
    }

    board.appendChild(row);
  }
}

function submitGuess() {
  if (finished) return;

  const guess =
    normalize(guessInput.value);

  guessInput.value = "";
  guessInput.focus();

  if (!guess) return;

  if (guess.length !== answer.length) {
    message.innerHTML =
      `Navnet må ha ${answer.length} bokstaver`;
    return;
  }

  guesses.push(guess);

  if (guess === answer) {
    finished = true;

    saveWordleScore(true);

    message.innerHTML =
      `🏆 Riktig! ${rawAnswer} · ${calculateWordleScore(true)} poeng`;

    guessInput.disabled = true;
    const btn = document.querySelector(".guess-box button");
if (btn) btn.disabled = true;

  } else if (guesses.length >= maxGuesses) {
    finished = true;

    saveWordleScore(false);

    message.innerHTML =
      `💀 Ferdig! Svaret var ${rawAnswer}`;

    guessInput.disabled = true;

  } else {
    message.innerHTML =
      "Ikke riktig";
  }

  renderBoard();
}

guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    submitGuess();
  }
});

window.submitGuess = submitGuess;

renderBoard();
initPlayedCheck();
