/**
 * ============================================
 * AceQuest: Agent Ragam — questionEngine.js
 * Question Logic
 * ============================================
 *
 * Handles:
 * - Fetching questions from the backend API
 * - Standard in-map questions (EXP reward/penalty)
 * - Big Boss battle questions (short answer 60s, higher-order 3min)
 * - The Forgetter / GEO-X final exam gauntlet (timed phases)
 * - Answer validation for MCQ, true/false, fill-blank, short answer
 */

const API_BASE = '/api';

/** EXP awarded/deducted for standard in-map questions */
export const EXP_REWARDS = {
  CORRECT: 10,
  INCORRECT: -5,
  COMBO_BONUS: 5, // extra EXP per correct answer in a streak of 5+
};

/** Timer durations (seconds) for Big Boss / Final Boss questions */
export const QUESTION_TIME_LIMITS = {
  SHORT_ANSWER: 60,
  HIGHER_ORDER: 180,
  FINAL_GAUNTLET: 300, // GEO-X final question
};

/**
 * QuestionEngine manages fetching, presenting, and scoring questions
 * for a given chapter or boss battle.
 */
export class QuestionEngine {
  /**
   * @param {Object} options
   * @param {string} options.authToken - JWT for API calls
   * @param {Function} [options.onExpChange] - callback(delta, total) when EXP changes
   * @param {Function} [options.onCoinChange] - callback(delta, total) when coins change
   */
  constructor(options = {}) {
    this.authToken = options.authToken || null;
    this.onExpChange = options.onExpChange || (() => {});
    this.onCoinChange = options.onCoinChange || (() => {});

    this.correctStreak = 0;
  }

  _headers() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.authToken) headers.Authorization = `Bearer ${this.authToken}`;
    return headers;
  }

  /**
   * Fetches all questions for a chapter from the backend.
   * @param {number} chapterId
   * @returns {Promise<Array>} array of question objects
   */
  async fetchChapterQuestions(chapterId) {
    const res = await fetch(`${API_BASE}/chapters/${chapterId}/questions`, {
      headers: this._headers(),
    });
    if (!res.ok) throw new Error(`Failed to fetch questions for chapter ${chapterId}`);
    return res.json();
  }

  /**
   * Fetches the Big Boss battle question set for a chapter.
   * Expected shape: { shortAnswer: [...3 questions], higherOrder: [...2 questions] }
   * @param {number} chapterId
   */
  async fetchBossQuestions(chapterId) {
    const res = await fetch(`${API_BASE}/chapters/${chapterId}/boss-questions`, {
      headers: this._headers(),
    });
    if (!res.ok) throw new Error(`Failed to fetch boss questions for chapter ${chapterId}`);
    return res.json();
  }

  /**
   * Fetches the GEO-X / Forgetter final exam gauntlet question set,
   * organized by phase.
   * @param {number} subjectId
   */
  async fetchFinalGauntlet(subjectId) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/final-gauntlet`, {
      headers: this._headers(),
    });
    if (!res.ok) throw new Error(`Failed to fetch final gauntlet for subject ${subjectId}`);
    return res.json();
  }

  /**
   * Validates an answer locally (for instant feedback) based on question type.
   * For short_answer / fill_blank, performs case-insensitive trimmed match
   * against a list of accepted answers.
   *
   * @param {Object} question - question object from API
   * @param {*} userAnswer - selected option index, string, or array
   * @returns {boolean}
   */
  validateAnswer(question, userAnswer) {
    switch (question.question_type) {
      case 'multiple_choice':
      case 'true_false': {
        const correctOption = question.options.find((opt) => opt.is_correct);
        return correctOption && userAnswer === correctOption.id;
      }

      case 'fill_blank':
      case 'short_answer': {
        if (typeof userAnswer !== 'string') return false;
        const normalized = userAnswer.trim().toLowerCase();
        return question.accepted_answers.some(
          (ans) => ans.answer_text.trim().toLowerCase() === normalized
        );
      }

      case 'drag_drop': {
        // userAnswer expected as array matching question.correct_order
        if (!Array.isArray(userAnswer) || !Array.isArray(question.correct_order)) {
          return false;
        }
        return (
          userAnswer.length === question.correct_order.length &&
          userAnswer.every((val, i) => val === question.correct_order[i])
        );
      }

      default:
        return false;
    }
  }

  /**
   * Submits an answer attempt to the backend AND applies local EXP/coin effects.
   * Use this for standard in-map questions (NPC challenges).
   *
   * @param {Object} params
   * @param {number} params.userId
   * @param {Object} params.question
   * @param {*} params.userAnswer
   * @param {number} params.chapterId
   * @returns {Promise<{isCorrect: boolean, expGained: number}>}
   */
  async submitStandardAnswer({ userId, question, userAnswer, chapterId }) {
    const isCorrect = this.validateAnswer(question, userAnswer);
    let expGained = isCorrect ? EXP_REWARDS.CORRECT : EXP_REWARDS.INCORRECT;

    if (isCorrect) {
      this.correctStreak += 1;
      if (this.correctStreak >= 5) {
        expGained += EXP_REWARDS.COMBO_BONUS;
      }
    } else {
      this.correctStreak = 0;
    }

    // Persist the attempt to backend
    await fetch(`${API_BASE}/questions/${question.id}/answer`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({
        user_id: userId,
        chapter_id: chapterId,
        selected_answer: this._serializeAnswer(userAnswer),
        is_correct: isCorrect,
        exp_gained: expGained,
      }),
    });

    this.onExpChange(expGained);

    return { isCorrect, expGained };
  }

  /**
   * Evaluates an answer for a Big Boss battle question.
   * Boss questions don't grant/deduct EXP per-question; instead they
   * determine whether the boss takes damage or the boss attacks back.
   *
   * @param {Object} question
   * @param {*} userAnswer
   * @param {boolean} timedOut - true if the timer expired before answering
   * @returns {{isCorrect: boolean, bossDamage: number}}
   */
  evaluateBossAnswer(question, userAnswer, timedOut = false) {
    if (timedOut) {
      return { isCorrect: false, bossDamage: 0 };
    }

    const isCorrect = this.validateAnswer(question, userAnswer);
    const bossDamage = isCorrect
      ? question.difficulty === 'hard'
        ? 25
        : 15
      : 0;

    return { isCorrect, bossDamage };
  }

  /**
   * Returns the correct time limit (seconds) for a given question type
   * in a Big Boss or Final Boss context.
   *
   * @param {'short_answer'|'higher_order'|'final_gauntlet'} questionCategory
   * @returns {number}
   */
  getTimeLimit(questionCategory) {
    switch (questionCategory) {
      case 'higher_order':
        return QUESTION_TIME_LIMITS.HIGHER_ORDER;
      case 'final_gauntlet':
        return QUESTION_TIME_LIMITS.FINAL_GAUNTLET;
      default:
        return QUESTION_TIME_LIMITS.SHORT_ANSWER;
    }
  }

  _serializeAnswer(userAnswer) {
    if (Array.isArray(userAnswer)) return JSON.stringify(userAnswer);
    return String(userAnswer);
  }

  resetStreak() {
    this.correctStreak = 0;
  }
}

/**
 * Countdown timer utility for boss battle questions.
 * Designed to be driven by the render loop (call tick(delta) each frame)
 * or by setInterval for UI-only contexts.
 */
export class QuestionTimer {
  /**
   * @param {number} durationSeconds
   * @param {Function} onTick - callback(secondsRemaining)
   * @param {Function} onExpire - callback() when time runs out
   */
  constructor(durationSeconds, onTick, onExpire) {
    this.duration = durationSeconds;
    this.remaining = durationSeconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.expired = false;
    this.paused = false;
  }

  /** Call once per frame with delta time in seconds. */
  tick(delta) {
    if (this.expired || this.paused) return;

    this.remaining -= delta;

    if (this.remaining <= 0) {
      this.remaining = 0;
      this.expired = true;
      this.onTick(0);
      this.onExpire();
      return;
    }

    this.onTick(this.remaining);
  }

  /** Returns true if remaining time is in the "warning" zone (<= 25% left). */
  isWarning() {
    return this.remaining <= this.duration * 0.25;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  reset(durationSeconds = this.duration) {
    this.duration = durationSeconds;
    this.remaining = durationSeconds;
    this.expired = false;
    this.paused = false;
  }
}

/**
 * Runs the GEO-X / Forgetter final gauntlet sequence.
 * Each phase targets a subset of "knowledge crystals"; wrong/timed-out
 * answers cause a crystal to crack, correct answers shield it.
 *
 * @param {Object} params
 * @param {QuestionEngine} params.engine
 * @param {Object} params.gauntletData - from fetchFinalGauntlet()
 * @param {Function} params.askQuestion - async (question, timeLimit) => userAnswer | null (null = timeout)
 * @param {Function} params.onCrystalUpdate - (crystalIndex, status) status: 'shielded' | 'cracked'
 * @returns {Promise<{ crystalsRemaining: number, victory: boolean }>}
 */
export async function runFinalGauntlet({ engine, gauntletData, askQuestion, onCrystalUpdate }) {
  const crystalStatus = new Array(gauntletData.crystalCount || 9).fill('active');

  for (const phase of gauntletData.phases) {
    for (const question of phase.questions) {
      const timeLimit = engine.getTimeLimit(
        question.is_final_question ? 'final_gauntlet' : question.difficulty === 'hard' ? 'higher_order' : 'short_answer'
      );

      const userAnswer = await askQuestion(question, timeLimit);
      const timedOut = userAnswer === null;
      const { isCorrect } = engine.evaluateBossAnswer(question, userAnswer, timedOut);

      const targetCrystals = question.target_crystal_indices || [];
      for (const idx of targetCrystals) {
        crystalStatus[idx] = isCorrect ? 'shielded' : 'cracked';
        onCrystalUpdate(idx, crystalStatus[idx]);
      }
    }
  }

  const crystalsRemaining = crystalStatus.filter((s) => s !== 'cracked').length;
  const victory = crystalsRemaining > 0;

  return { crystalsRemaining, victory };
}
