let lives = 5;

import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

const startDate = new Date("2026-01-01");
const today = new Date();

const diffDays = Math.floor(
  (today - startDate) /
  (1000 * 60 * 60 * 24)
);

const challenge =
  window.tenableChallenges[
    diffDays % window.tenableChallenges.length
  ];

  const livesBox =
  document.getElementById("livesBox");
 
const challengeId =
  `tenable-${diffDays}-${challenge.id}`;

let found = [];
let finished = false;
let scoreSaved = false;

const titleBox = document.getElementById("titleBox");
const statSlots = document.getElementById("statSlots");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const finishBtn = document.getElementById("finishBtn");
const message = document.getElementById("message");
const foundBox = document.getElementById("foundBox");
const resultBox = document.getElementById("resultBox");

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
}

function isFound(answer) {
  return found.includes(answer.label);
}

function renderTitle() {
  titleBox.innerHTML = `
    <h2>${challenge.title}</h2>
    <p>${challenge.intro}</p>
  `;
}

function renderSlots() {
  statSlots.className = "stat-slots";

  statSlots.innerHTML = challenge.answers
    .map(answer => `
      <div class="slot ${isFound(answer) ? "found" : ""}">
        ${answer.value}
        <small>${isFound(answer) ? answer.label : "?"}</small>
      </div>
    `)
    .join("");
}

function renderFound() {
  foundBox.innerHTML = found
    .map(name => `<div class="found-row">✅ ${name}</div>`)
    .join("");
}

function findAnswer(value) {
  const guess = normalize(value);

  if (!guess) return null;

  return challenge.answers.find(answer =>
    answer.aliases.some(alias =>
      normalize(alias) === guess
    )
  );
}

function addGuess() {
  if (finished) return;

  const value = guessInput.value;
  const answer = findAnswer(value);

  guessInput.value = "";
  guessInput.focus();

  if (!value.trim()) return;

  if (!answer) {
  lives--;

  renderLives();

  message.innerHTML =
    `❌ Ikke på lista. ${lives} liv igjen.`;

  if (lives <= 0) {
    finishGame();
  }

  return;
}

  if (isFound(answer)) {
    message.innerHTML = "Du har allerede tatt den.";
    return;
  }

  found.push(answer.label);

  message.innerHTML =
    `✅ ${answer.label} (${answer.value})`;

  renderSlots();
  renderFound();

  if (found.length === challenge.answers.length) {
    finishGame();
  }
}

function renderLives() {
  livesBox.innerHTML =
    `❤️`.repeat(lives) +
    `🖤`.repeat(5 - lives);
}

function calculateScore() {
  const findScore =
    (found.length / challenge.answers.length) * 80;

  const lifeScore =
    (lives / 5) * 20;

  return Math.round(
    findScore + lifeScore
  );
}

function lockGame() {
  finished = true;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  finishBtn.disabled = true;
}

function saveTenableScore(score) {
  if (scoreSaved) return;

  scoreSaved = true;

  saveGameScore({
    game: "tenable",
    challengeId,
    score,
    maxScore: 100,
    attempts: 1,
    details: {
      title: challenge.title,
      found,
      total: challenge.answers.length,
      missing: challenge.answers
        .filter(answer => !isFound(answer))
        .map(answer => answer.label),
      user: getGameUser()
    }
  }).then(result => {
    console.log("Tenable score lagret:", result, score);
  });
}

function finishGame() {
  lockGame();

  const score = calculateScore();

  saveTenableScore(score);

  const missing = challenge.answers
    .filter(answer => !isFound(answer));

  resultBox.innerHTML = `
    <div class="result-title">
      Ferdig! Du fant ${found.length} av ${challenge.answers.length}.
    </div>

    <div>
      Score: <strong>${score} poeng</strong>
    </div>

    ${
      missing.length
        ? `
          <div class="result-title">Du manglet:</div>
          ${missing.map(answer => `
            <div class="missing-row">
              ❌ ${answer.label} (${answer.value})
            </div>
          `).join("")}
        `
        : `
          <div class="result-title">
            Full pott. Obskur Lyn-hjerne.
          </div>
        `
    }
  `;

  message.innerHTML = "";
}

async function initPlayedCheck() {
  const alreadyPlayed =
    await hasPlayedToday("tenable", challengeId);

  if (!alreadyPlayed) return;

  lockGame();

  message.innerHTML =
    "🏆 Du har allerede spilt dagens Lyn Tenable.";
}

guessBtn.addEventListener("click", addGuess);
finishBtn.addEventListener("click", finishGame);

guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    addGuess();
  }
});

renderTitle();
renderSlots();
renderFound();
renderLives();
initPlayedCheck();
