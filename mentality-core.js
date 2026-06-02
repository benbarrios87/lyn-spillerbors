import {
  saveGameScore,
  getGameUser,
  hasPlayedToday
} from "./v2/js/games-core.js";

import { supabaseClient } from "./v2/js/supabase.js";

const QUESTION_COUNT = 5;
const DEADLINE_HOUR = 22;
const QUESTION_POINTS = 20;

export function setupMentalityGame({
  mode,
  emoji,
  deliveredText,
  closedText
}) {
  const startDate = new Date("2026-01-01");
  const today = new Date();

  const diffDays = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24)
  );

  const challengeId = `${mode}-${diffDays}`;

  const userBox = document.getElementById("userBox");
  const questionsBox = document.getElementById("questions");
  const submitBtn = document.getElementById("submitBtn");
  const message = document.getElementById("message");

  let selectedQuestions = [];
  let alreadyPlayed = false;

  function isClosed() {
    return new Date().getHours() >= DEADLINE_HOUR;
  }

  function lockInputs() {
    submitBtn.disabled = true;
    document.querySelectorAll("input").forEach(input => {
      input.disabled = true;
    });
  }

  function normalizeAnswer(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "a")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ");
  }

  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function pickQuestions() {
    const pool = window.mentalityQuestions
      .filter(q => q.mode.includes(mode))
      .map((q, index) => ({
        ...q,
        sortValue: seededRandom(diffDays * 1000 + index * 17 + mode.length * 31)
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

  function getAnswersFromRow(row) {
    return Array.isArray(row.details?.answers)
      ? row.details.answers
      : [];
  }

  function buildQuestionStats(rows) {
    const questions = {};

    rows.forEach(row => {
      getAnswersFromRow(row).forEach(answerObj => {
        const qid = answerObj.question_id;
        const answer = normalizeAnswer(answerObj.answer);

        if (!qid || !answer) return;

        if (!questions[qid]) {
          questions[qid] = {
            question: answerObj.question,
            answers: {}
          };
        }

        if (!questions[qid].answers[answer]) {
          questions[qid].answers[answer] = {
            display: answerObj.answer,
            count: 0
          };
        }

        questions[qid].answers[answer].count++;
      });
    });

    return questions;
  }

  function scoreAnswer(answerKey, questionStats) {
    const counts = Object.values(questionStats.answers).map(a => a.count);
    const myCount = questionStats.answers[answerKey]?.count || 0;

    if (!counts.length || !myCount) return 0;

    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);

    if (mode === "herd") {
      return Math.round((myCount / maxCount) * QUESTION_POINTS);
    }

    if (mode === "rebel") {
      return Math.round((minCount / myCount) * QUESTION_POINTS);
    }

    return 0;
  }

  function calculateRowScore(row, questionStats) {
    let total = 0;
    const breakdown = [];

    getAnswersFromRow(row).forEach(answerObj => {
      const qid = answerObj.question_id;
      const answerKey = normalizeAnswer(answerObj.answer);
      const stats = questionStats[qid];

      if (!stats || !answerKey) return;

      const points = scoreAnswer(answerKey, stats);
      const count = stats.answers[answerKey]?.count || 0;

      total += points;

      breakdown.push({
        question_id: qid,
        question: answerObj.question,
        answer: answerObj.answer,
        count,
        points
      });
    });

    return {
      score: Math.min(100, total),
      breakdown
    };
  }

  async function autoScoreIfClosed() {
    if (!isClosed()) return;

    const { data: rows, error } = await supabaseClient
      .from("game_scores")
      .select("*")
      .eq("game", mode)
      .eq("challenge_id", challengeId);

    if (error || !rows || !rows.length) return;

    const alreadyScored = rows.every(row => row.details?.scored === true);
    if (alreadyScored) return;

    const questionStats = buildQuestionStats(rows);

    for (const row of rows) {
      const result = calculateRowScore(row, questionStats);

      await supabaseClient
        .from("game_scores")
        .update({
          score: result.score,
          max_score: 100,
          details: {
            ...(row.details || {}),
            scored: true,
            scored_at: new Date().toISOString(),
            mentality_score_breakdown: result.breakdown
          }
        })
        .eq("id", row.id);
    }
  }

  async function getMyScore() {
    const user = getGameUser();
    if (!user) return null;

    const { data } = await supabaseClient
      .from("game_scores")
      .select("*")
      .eq("game", mode)
      .eq("challenge_id", challengeId)
      .ilike("voter", user)
      .maybeSingle();

    return data || null;
  }

  async function submitAnswers() {
    if (alreadyPlayed) return;

    if (isClosed()) {
      await autoScoreIfClosed();
      lockInputs();
      message.innerHTML = closedText;
      return;
    }

    const answers = getAnswers();

    if (answers.some(a => !a.answer)) {
      message.innerHTML = "Svar på alle spørsmål først.";
      return;
    }

    const result = await saveGameScore({
      game: mode,
      challengeId,
      score: 0,
      maxScore: 100,
      attempts: 1,
      details: {
        mode,
        answers,
        pending_score: true
      }
    });

    if (!result) {
      message.innerHTML = "Kunne ikke lagre. Har du allerede spilt?";
      return;
    }

    alreadyPlayed = true;
    lockInputs();
    message.innerHTML = deliveredText;
  }

  async function initPlayedCheck() {
    if (isClosed()) {
      await autoScoreIfClosed();
    }

    alreadyPlayed = await hasPlayedToday(mode, challengeId);

    if (alreadyPlayed) {
      lockInputs();

      const myScore = await getMyScore();

      if (isClosed() && myScore?.details?.scored) {
        message.innerHTML =
          `${emoji} Du fikk ${myScore.score} poeng i dagens ${mode === "herd" ? "Herd" : "Rebel"} Mentality.`;
      } else {
        message.innerHTML =
          `${emoji} Du har allerede levert. Poeng regnes etter kl. 22.`;
      }

      return;
    }

    if (isClosed()) {
      lockInputs();
      message.innerHTML = closedText;
    }
  }

  renderUser();
  renderQuestions();
  initPlayedCheck();

  submitBtn.addEventListener("click", submitAnswers);
}
