
const challenges = [

  {
    id:"fram-2023",

    title:"Lyn vs Fram",

    competition:"PostNord-ligaen 2023",

    date:"11.11.2023",

    result:"10-1",

    formation:"4-3-3 Attacking",

    attendance:2247,

    lineup:[
      { name:"Alexander Pedersen", pos:"GK", x:50, y:91 },
      { name:"Herman Solberg Nilsen", pos:"LB", x:18, y:72 },
      { name:"Schneider", pos:"CB", x:38, y:75 },
      { name:"William Sell", pos:"CB", x:62, y:75 },
      { name:"Meinseth", pos:"RB", x:82, y:72 },

      { name:"Even Bydal", pos:"DM", x:50, y:58 },
      { name:"Henrik Elvevold", pos:"CM", x:35, y:46 },
      { name:"Kristiansen", pos:"CM", x:65, y:46 },

      { name:"Ole Breistøl", pos:"LW", x:22, y:25 },
      { name:"Hellum", pos:"ST", x:50, y:18 },
      { name:"Olsen", pos:"RW", x:78, y:25 }
    ],

    bonusGoalscorers:[
      "Kristiansen",
      "Loholt",
      "Hellum",
      "Henrik Elvevold",
      "Elvevold",
      "Laajab",
      "Olsen"
    ]
  }

];

const dailyIndex =
  new Date().getDate() % challenges.length;
const challenge =
  challenges[dailyIndex];
let guessed = [];
let guessedScorers = [];
let lives = 3;
let gameOver = false;
let username =
  localStorage.getItem("dailyXiUsername");

if(!username) {

  username =
    prompt("Velg brukernavn");

  if(!username) {
    username = "Lyn-supporter";
  }

  localStorage.setItem(
    "dailyXiUsername",
    username
  );

}

const stats = JSON.parse(
  localStorage.getItem("dailyXiStats")
) || {
  played:0,
  wins:0,
  goals:0
};

renderProfile();

function renderProfile() {

  document.getElementById(
    "profileBox"
  ).innerHTML = `

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
 
document.getElementById("info").innerHTML = `
  <div><strong>${challenge.title}</strong></div>
  <div>${challenge.competition}</div>
  <div>${challenge.date}</div>
  <div>Resultat: ${challenge.result}</div>
  <div>Formasjon: ${challenge.formation}</div>
  <div>Tilskuere: ${challenge.attendance.toLocaleString("no-NO")}</div>
`;

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

function isNameMatch(guess, fullName) {
  const g = normalize(guess);
  const full = normalize(fullName);
  const last = normalize(lastName(fullName));

  if (!g) return false;

  if (g === full || g === last) return true;

  if (full.includes(g) && g.length >= 5) return true;
  if (last.includes(g) && g.length >= 4) return true;

  return levenshtein(g, last) <= 1 && g.length >= 5;
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
      ${guessed.length ? guessed.map(p => `<div>${p}</div>`).join("") : "<div>Ingen ennå</div>"}
    </div>

    <div class="hint">
      Tips: Etternavn holder. Små skrivefeil tåles.
      ${challenge.bonusGoalscorers.length ? "<br>Bonus: målscorere kan også treffes." : ""}
    </div>
  `;

  document.querySelector(".container").appendChild(wrapper);
}

function setMessage(text) {
  document.getElementById("message").innerText = text;
}

function endGame(text) {
  gameOver = true;
  setMessage(text);
  document.getElementById("guessInput").disabled = true;
}

function submitGuess() {
  if (gameOver) return;

  const input = document.getElementById("guessInput");
  const rawGuess = input.value.trim();

  input.value = "";
  input.focus();

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
    renderPitch();
    setMessage(`✅ Riktig! ${foundPlayer.name}`);

    if (guessed.length === challenge.lineup.length) {
      stats.played++;
stats.wins++;

localStorage.setItem(
  "dailyXiStats",
  JSON.stringify(stats)
);

renderProfile();
      endGame("🏆 DU KLARTE DAGENS LYN XI");
    }

    return;
  }

  const foundScorer = challenge.bonusGoalscorers.find(scorer =>
    isNameMatch(rawGuess, scorer)
  );

  if (foundScorer) {
    const key = normalize(foundScorer);

    if (guessedScorers.includes(key)) {
      setMessage("⚠️ Målscorer allerede tatt");
      return;
    }

    guessedScorers.push(key);
    stats.goals++;

localStorage.setItem(
  "dailyXiStats",
  JSON.stringify(stats)
);

renderProfile();
    setMessage(`⭐ Bonusmålscorer! ${foundScorer}`);
    return;
  }

  lives--;
  renderLives();

  if (lives <= 0) {
    stats.played++;

localStorage.setItem(
  "dailyXiStats",
  JSON.stringify(stats)
);

renderProfile();
    endGame("💀 Game over");
    revealAnswers();
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

document.getElementById("guessInput").addEventListener("keydown", e => {
  if (e.key === "Enter") submitGuess();
});

renderLives();
renderPitch();
document.getElementById("guessInput").focus();
