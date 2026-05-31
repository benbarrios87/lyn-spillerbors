import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

const startDate = new Date("2026-01-01");
const today = new Date();

const diffDays = Math.floor(
  (today - startDate) / (1000 * 60 * 60 * 24)
);

const dailyIndex = diffDays % challenges.length;
const challenge = challenges[dailyIndex];

const challengeId =
  `dailyxi-${diffDays}-${challenge.title}`;

let guessed = [];
let guessedScorers = [];
let lives = 3;
let gameOver = false;
let username = getGameUser() || "Lyn-supporter";
let scoreSaved = false;

const stats = JSON.parse(
  localStorage.getItem("dailyXiStats")
) || {
  played: 0,
  wins: 0,
  goals: 0
};

const guessInput = document.getElementById("guessInput");

renderProfile();
renderLives();
renderPitch();
renderBonusBox();
initPlayedCheck();

document.getElementById("info").innerHTML = `
  <div><strong>${challenge.title}</strong></div>
  <div>${challenge.competition}</div>
  <div>${challenge.date}</div>
  <div>Resultat: ${challenge.result}</div>
  <div>Formasjon: ${challenge.formation}</div>
  <div>Tilskuere: ${Number(challenge.attendance || 0).toLocaleString("no-NO")}</div>
`;

async function initPlayedCheck() {
  const alreadyPlayed = await hasPlayedToday(
    "dailyxi",
    challengeId
  );

  if (!alreadyPlayed) {
    guessInput.focus();
    return;
  }

  gameOver = true;
  guessInput.disabled = true;

  const btn = document.querySelector(".guess-box button");
  if (btn) btn.disabled = true;

  setMessage("🏆 Du har allerede spilt dagens Daily XI");
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

function lastName(fullName) {
  return String(fullName || "").split(" ").slice(-1)[0];
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

function isNameMatch(guess, fullName) {
  const g = normalize(guess);
  const full = normalize(fullName);
  const last = normalize(lastName(fullName));

  if (!g) return false;

  return (
    g === full ||
    g === last ||
    (full.includes(g) && g.length >= 5) ||
    (last.includes(g) && g.length >= 4) ||
    (levenshtein(g, last) <= 1 && g.length >= 5)
  );
}

function renderProfile() {
  document.getElementById("profileBox").innerHTML = `
    <div class="profile-name">
      ⚽ ${username}
    </div>

    <div class="profile-stats">
      <div class="profile-stat">
        <strong>${stats.played}</strong>
        Spill
      </div>

      <div class="profile-stat">
        <strong>${stats.wins}</strong>
        Seire
      </div>

      <div class="profile-stat">
        <strong>${stats.goals}</strong>
        Bonusmål
      </div>
    </div>
  `;
}

function renderLives() {
  document.getElementById("lives").innerText =
    "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}

function renderPitch() {
  const pitch = document.getElementById("pitch");

  pitch.innerHTML = `
    <div class="pitch-line"></div>
    <div class="box-top"></div>
    <div class="box-bottom"></div>
  `;

  challenge.lineup.forEach(player => {
    const div = document.createElement("div");
    const isGuessed = guessed.includes(player.name);

    div.className = `player ${isGuessed ? "correct" : "empty"}`;
    div.style.left = player.x + "%";
    div.style.top = player.y + "%";
    div.innerText = isGuessed ? player.name : player.pos;

    pitch.appendChild(div);
  });

  renderGuessedList();
}

function renderGuessedList() {
  let existing = document.querySelector(".guessed-list");
  if (existing) existing.remove();

  const wrapper = document.createElement("div");
  wrapper.className = "guessed-list";

  wrapper.innerHTML = `
    <h3>Gjettede spillere (${guessed.length}/11)</h3>

    <div class="guessed-grid">
      ${
        guessed.length
          ? guessed.map(p => `<div>${p}</div>`).join("")
          : "<div>Ingen ennå</div>"
      }
    </div>

    <div class="hint">
      Tips: Etternavn holder. Små skrivefeil tåles.
      ${
        challenge.bonusGoalscorers?.length
          ? "<br>Bonus: målscorere kan også treffes."
          : ""
      }
    </div>
  `;

  document.querySelector(".container").appendChild(wrapper);
}

function renderBonusBox() {
  const box = document.getElementById("bonusBox");
  if (!box) return;

  const scorers = challenge.bonusGoalscorers || [];

  if (!scorers.length) {
    box.innerHTML = "";
    return;
  }

  const uniqueScorers = [...new Set(scorers)];

  box.innerHTML = `
    <h3>
      ⭐ Målscorere
      (${guessedScorers.length}/${uniqueScorers.length})
    </h3>

    <div class="bonus-help">
      Målscorere kan også være innbyttere.
    </div>

    <div class="bonus-grid">
      ${uniqueScorers.map(name => {
        const found = guessedScorers.includes(normalize(name));

        return `
          <div class="bonus-chip ${found ? "found" : ""}">
            ${found ? "⚽ " + name : "⚽ ?"}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function setMessage(text) {
  document.getElementById("message").innerText = text;
}

function calculateDailyXiScore(won = false) {
  const lineupPoints = guessed.filter(name =>
    challenge.lineup.some(player => player.name === name)
  ).length * 7;

  const bonusPoints = guessedScorers.length * 5;
  const lifeBonus = won ? lives * 5 : 0;

  return Math.min(100, lineupPoints + bonusPoints + lifeBonus);
}

function saveDailyXiScore(won = false) {
  if (scoreSaved) return;

  scoreSaved = true;

  const finalScore = calculateDailyXiScore(won);

  saveGameScore({
    game: "dailyxi",
    challengeId,
    score: finalScore,
    maxScore: 100,
    attempts: 3 - lives + 1,
    details: {
      title: challenge.title,
      result: challenge.result,
      formation: challenge.formation,
      guessedPlayers: guessed,
      guessedScorers,
      livesLeft: lives,
      won,
      user: getGameUser()
    }
  }).then(result => {
    console.log("Daily XI score lagret:", result, finalScore);
  });
}

function endGame(text) {
  gameOver = true;
  setMessage(text);

  guessInput.disabled = true;

  const btn = document.querySelector(".guess-box button");
  if (btn) btn.disabled = true;
}

function checkBonusScorer(rawGuess) {
  const scorers = challenge.bonusGoalscorers || [];
  if (!scorers.length) return false;

  const foundScorer = scorers.find(scorer =>
    isNameMatch(rawGuess, scorer)
  );

  if (!foundScorer) return false;

  const normalizedScorer = normalize(foundScorer);

  if (guessedScorers.includes(normalizedScorer)) {
    return false;
  }

  guessedScorers.push(normalizedScorer);
  stats.goals++;

  localStorage.setItem("dailyXiStats", JSON.stringify(stats));

  renderProfile();
  renderBonusBox();

  return foundScorer;
}

function submitGuess() {
  if (gameOver) return;

  const rawGuess = guessInput.value.trim();

  guessInput.value = "";
  guessInput.focus();

  if (!rawGuess) return;

  const foundPlayer = challenge.lineup.find(player =>
    isNameMatch(rawGuess, player.name)
  );

  if (foundPlayer) {
    if (guessed.includes(foundPlayer.name)) {
      setMessage("⚠️ Allerede gjettet");
      return;
    }

    guessed.push(foundPlayer.name);

    const bonusHit = checkBonusScorer(rawGuess);

    renderPitch();

    setMessage(
      bonusHit
        ? `✅ Riktig! ${foundPlayer.name} ⭐ Bonusmålscorer!`
        : `✅ Riktig! ${foundPlayer.name}`
    );

    if (guessed.length === challenge.lineup.length) {
      stats.played++;
      stats.wins++;

      localStorage.setItem("dailyXiStats", JSON.stringify(stats));
      renderProfile();

      saveDailyXiScore(true);
      endGame(`🏆 DU KLARTE DAGENS LYN XI · ${calculateDailyXiScore(true)} poeng`);
    }

    return;
  }

  const bonusHit = checkBonusScorer(rawGuess);

  if (bonusHit) {
    setMessage(`⭐ Bonusmålscorer! ${bonusHit}`);
    return;
  }

  lives--;
  renderLives();

  if (lives <= 0) {
    stats.played++;

    localStorage.setItem("dailyXiStats", JSON.stringify(stats));
    renderProfile();

    saveDailyXiScore(false);
    revealAnswers();
    endGame(`💀 Game over · ${calculateDailyXiScore(false)} poeng`);
  } else {
    setMessage(`❌ Feil. ${lives} liv igjen`);
  }
}

function revealAnswers() {
  challenge.lineup.forEach(player => {
    if (!guessed.includes(player.name)) {
      guessed.push(player.name);
    }
  });

  renderPitch();
}

guessInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    submitGuess();
  }
});

window.submitGuess = submitGuess;
