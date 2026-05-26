const careerIndex =
  new Date().getDate() % careers.length;

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
    score -= 10;

    renderCareer();

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

function submitCareerGuess() {

  if (finished) return;

  const guess =
  normalize(guessInput.value);

const correct =
  normalize(career.answer);

const last =
  normalize(
    career.answer.split(" ").slice(-1)[0]
  );

if (
  guess === correct ||
  guess === last
) {

    finished = true;

    message.innerHTML =
      `🏆 Riktig! ${career.answer}`;

  } else {

    message.innerHTML =
      "❌ Feil spiller";

  }

}

renderCareer();
