import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

const startDate =
  new Date("2026-01-01");

const today =
  new Date();

const diffDays =
  Math.floor(
    (today - startDate) /
    (1000 * 60 * 60 * 24)
  );

const careerIndex =
  diffDays % careers.length;

const career = careers[careerIndex];

let revealed = 1;
let score = 100;
let finished = false;

const careerList =
  document.getElementById("careerList");

const progressText =
  document.getElementById("progressText");

const scoreText =
  document.getElementById("scoreText");

const message =
  document.getElementById("message");

const guessInput =
  document.getElementById("guessInput");

function renderCareer() {

  careerList.innerHTML = "";

  progressText.innerHTML =
    `Reveal ${revealed} / ${career.clubs.length}`;

  scoreText.innerHTML =
    `⭐ ${score} poeng`;

  career.clubs
    .slice(0, revealed)
    .forEach(club => {

      const row =
        document.createElement("div");

      row.className = "career-row";

      row.innerHTML = `
        <div class="career-years">
          ${club.years}
        </div>

        <div class="career-club">
          ${club.club}
        </div>

        <div class="career-apps">
          ${
            club.apps !== null
              ? `${club.apps} kamper`
              : "?"
          }
        </div>
      `;

      careerList.appendChild(row);

    });

}

function revealNextClub() {

  if (finished) return;

  if (revealed < career.clubs.length) {

  revealed++;
  score = Math.max(0, score - 10);

  renderCareer();

} else {

  finished = true;

  revealed = career.clubs.length;

  renderCareer();

  message.innerHTML =
    `💀 Ingen flere klubber! Det var ${career.answer}`;

}

}
function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]/g, "");
}
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => []);

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }

  return matrix[a.length][b.length];
}

function isCareerMatch(guessValue, answerValue) {
  const guess = normalize(guessValue);
  const answer = normalize(answerValue);
  const last = normalize(answerValue.split(" ").slice(-1)[0]);

  if (!guess) return false;

  return (
    guess === answer ||
    guess === last ||
    answer.includes(guess) && guess.length >= 5 ||
    last.includes(guess) && guess.length >= 4 ||
    levenshtein(guess, last) <= 1 && guess.length >= 5 ||
    levenshtein(guess, answer) <= 2 && guess.length >= 7
  );
}

function submitCareerGuess() {

  if (finished) return;

  if (isCareerMatch(guessInput.value, career.answer)) {

    finished = true;
    revealed = career.clubs.length;

    renderCareer();

    message.innerHTML =
  `🏆 Riktig! ${career.answer} · ${score} poeng`;

console.log("Prøver å lagre score:", {
  game: "career",
  challengeId: `career-${careerIndex}-${career.answer}`,
  score,
  user: getGameUser()
});

saveGameScore({
  game: "career",
  challengeId: `career-${careerIndex}-${career.answer}`,
  score,
  maxScore: 100,
  attempts: 1,
  details: {
    answer: career.answer,
    revealed,
    totalClubs: career.clubs.length,
    user: getGameUser()
  }
}).then(result => {
  console.log("saveGameScore ferdig:", result);
});

return;

    saveGameScore({
  game: "career",
  challengeId: `career-${careerIndex}-${career.answer}`,
  score,
  maxScore: 100,
  attempts: 1,
  details: {
    answer: career.answer,
    revealed,
    totalClubs: career.clubs.length,
    user: getGameUser()
  }
});
    
    return;
  }

  message.innerHTML =
    "❌ Feil spiller. Ny klubb avslørt.";

  if (revealed < career.clubs.length) {

  revealed++;
  score = Math.max(0, score - 10);
  renderCareer();

} else {

  finished = true;
  revealed = career.clubs.length;
  renderCareer();

  message.innerHTML =
    `💀 Ingen flere klubber! Det var ${career.answer}`;

}

}
guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    submitCareerGuess();
  }
});

window.revealNextClub = revealNextClub;
window.submitCareerGuess = submitCareerGuess;

renderCareer();


