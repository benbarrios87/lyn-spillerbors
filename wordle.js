const startDate =
  new Date("2026-01-01");

const today =
  new Date();

const diffDays =
  Math.floor(
    (today - startDate) /
    (1000 * 60 * 60 * 24)
  );

const answer =
  players[diffDays % players.length];

const maxGuesses = 6;
let guesses = [];
let finished = false;

const board =
  document.getElementById("board");

const statusBox =
  document.getElementById("status");

const message =
  document.getElementById("message");

const guessInput =
  document.getElementById("guessInput");

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
    message.innerHTML =
      `🏆 Riktig! ${answer}`;
  } else if (guesses.length >= maxGuesses) {
    finished = true;
    message.innerHTML =
      `💀 Ferdig! Svaret var ${answer}`;
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

renderBoard();
