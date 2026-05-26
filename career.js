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

function submitCareerGuess() {

  if (finished) return;

  const guess =
    guessInput.value
      .trim()
      .toLowerCase();

  const correct =
    career.answer.toLowerCase();

  if (guess === correct) {

    finished = true;

    message.innerHTML =
      `🏆 Riktig! ${career.answer}`;

  } else {

    message.innerHTML =
      "❌ Feil spiller";

  }

}

renderCareer();
