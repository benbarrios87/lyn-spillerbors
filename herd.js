import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

const MODE = "herd";
const QUESTION_COUNT = 5;
const startDate = new Date("2026-01-01");
const today = new Date();
const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

const userBox = document.getElementById("userBox");
const questionsBox = document.getElementById("questions");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

const challengeId = `${MODE}-${diffDays}`;
const DEADLINE_HOUR = 22;

function isClosed() {
  return new Date().getHours() >= DEADLINE_HOUR;
}

function lockInputs() {
  submitBtn.disabled = true;
  document.querySelectorAll("input").forEach(input => {
    input.disabled = true;
  });
}

let selectedQuestions = [];
let alreadyPlayed = false;

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickQuestions() {
  const pool = mentalityQuestions
    .filter(q => q.mode.includes(MODE))
    .map((q, index) => ({
      ...q,
      sortValue: seededRandom(diffDays * 1000 + index * 17)
    }))
    .sort((a, b) => a.sortValue - b.sortValue);

  return pool.slice(0, QUESTION_COUNT);
}

function renderUser() {
  const user = getGameUser();

  userBox.innerHTML = user
    ? `<div class="user-pill">Spiller som <strong>${user}</strong></div>`
    : `<div class="user-pill warning">Sett forumnavn på forsiden først.</div>`;
}

function renderQuestions() {
  selectedQuestions = pickQuestions();

  questionsBox.innerHTML = selectedQuestions.map((q, index) => {
    if (q.type === "choice") {
      return `
        <div class="question-card">
          <div class="question-number">Spørsmål ${index + 1}</div>
          <h2>${q.question}</h2>

          <div class="options">
            ${q.options.map(option => `
              <label class="option">
                <input type="radio" name="${q.id}" value="${option}">
                <span>${option}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="question-card">
        <div class="question-number">Spørsmål ${index + 1}</div>
        <h2>${q.question}</h2>
        <input class="text-answer" id="answer-${q.id}" type="text" placeholder="Skriv svar...">
      </div>
    `;
  }).join("");
}

function getAnswers() {
  return selectedQuestions.map(q => {
    let answer = "";

    if (q.type === "choice") {
      const checked = document.querySelector(`input[name="${q.id}"]:checked`);
      answer = checked ? checked.value : "";
    } else {
      const input = document.getElementById(`answer-${q.id}`);
      answer = input ? input.value.trim() : "";
    }

    return {
      question_id: q.id,
      question: q.question,
      type: q.type,
      category: q.category,
      answer
    };
  });
}

async function submitAnswers() {
  if (alreadyPlayed) return;

  if (isClosed()) {
    lockInputs();
    message.innerHTML =
      "⏰ Dagens Mentality er stengt. Resultatene åpner kl. 22.";
    return;
  }

  const answers = getAnswers();

  if (answers.some(a => !a.answer)) {
    message.innerHTML = "Svar på alle spørsmål først.";
    return;
  }

  const result = await saveGameScore({
    game: MODE,
    challengeId,
    score: 0,
    maxScore: 100,
    attempts: 1,
    details: {
      mode: MODE,
      answers
    }
  });

  if (!result) {
    message.innerHTML = "Kunne ikke lagre. Har du allerede spilt?";
    return;
  }

  alreadyPlayed = true;
submitBtn.disabled = true;
document.querySelectorAll("input").forEach(input => input.disabled = true);

message.innerHTML = "🐑 Svar levert! Poeng regnes når resultatene samles.";
}

async function initPlayedCheck() {
  alreadyPlayed = await hasPlayedToday("herd", challengeId);

  if (alreadyPlayed) {
    lockInputs();
    message.innerHTML = "🏆 Du har allerede spilt dagens Herd Mentality.";
    return;
  }

  if (isClosed()) {
    lockInputs();
    message.innerHTML =
      "⏰ Dagens Herd Mentality er stengt. Resultatene er klare.";
  }
}

renderUser();
renderQuestions();
initPlayedCheck();

submitBtn.addEventListener("click", submitAnswers);
