/**
 * ============================================
 * AceQuest: Agent Ragam — saveSystem.js
 * Checkpoints
 * ============================================
 *
 * Handles:
 * - Saving/loading player progress (position, chapter, question index)
 * - Big Boss checkpoints (restart boss without redoing chapter questions)
 * - Chapter/subject unlock logic
 * - Local fallback caching (in case of network issues)
 */

const API_BASE = '/api';
const LOCAL_CACHE_KEY = 'acequest_save_cache';

/**
 * SaveSystem coordinates checkpoint persistence between the client
 * and the PostgreSQL-backed FastAPI server.
 */
export class SaveSystem {
  /**
   * @param {Object} options
   * @param {string} options.authToken
   * @param {number} options.userId
   */
  constructor({ authToken, userId }) {
    this.authToken = authToken;
    this.userId = userId;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Saves a standard in-chapter checkpoint (e.g. player answered a question
   * correctly and reached a safehouse NPC).
   *
   * @param {Object} params
   * @param {number} params.chapterId
   * @param {string} params.checkpointPosition - e.g. "3/10" representing question progress
   * @param {{x:number, z:number}} params.playerPosition - world coordinates to restore on resume
   */
  async saveChapterCheckpoint({ chapterId, checkpointPosition, playerPosition }) {
    const payload = {
      user_id: this.userId,
      chapter_id: chapterId,
      checkpoint_type: 'in_chapter',
      last_checkpoint_position: checkpointPosition,
      player_position: playerPosition,
    };

    this._cacheLocally('chapter', chapterId, payload);

    try {
      const res = await fetch(`${API_BASE}/game/save-checkpoint`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    } catch (err) {
      console.warn('[SaveSystem] Network save failed, cached locally:', err);
      return { offline: true, ...payload };
    }
  }

  /**
   * Saves a Big Boss checkpoint. If the player loses to the boss,
   * reloading this checkpoint restarts ONLY the boss battle —
   * not the chapter's questions.
   *
   * @param {Object} params
   * @param {number} params.chapterId
   * @param {string} params.bossId - e.g. "quake-lord"
   * @param {'reached'|'defeated'} params.status
   * @param {string} [params.badgeId] - badge to award if status === 'defeated'
   */
  async saveBossCheckpoint({ chapterId, bossId, status, badgeId }) {
    const payload = {
      user_id: this.userId,
      chapter_id: chapterId,
      checkpoint_type: 'boss',
      boss_id: bossId,
      boss_status: status, // 'reached' = arrived at boss, 'defeated' = won
      badge_id: badgeId || null,
    };

    this._cacheLocally('boss', chapterId, payload);

    try {
      const res = await fetch(`${API_BASE}/game/save-checkpoint`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Boss checkpoint save failed');

      // If the boss was defeated, also mark the chapter as completed
      if (status === 'defeated') {
        await this.markChapterCompleted(chapterId);
      }

      return res.json();
    } catch (err) {
      console.warn('[SaveSystem] Boss checkpoint network save failed:', err);
      return { offline: true, ...payload };
    }
  }

  /**
   * Loads the player's saved progress for a chapter.
   * If a boss checkpoint with status 'reached' exists, the caller
   * should resume directly at the boss battle scene rather than
   * the start of the chapter.
   *
   * @param {number} chapterId
   * @returns {Promise<Object|null>}
   */
  async loadChapterProgress(chapterId) {
    try {
      const res = await fetch(`${API_BASE}/player/progress?chapter_id=${chapterId}`, {
        headers: this._headers(),
      });
      if (!res.ok) throw new Error('Failed to load progress');
      return res.json();
    } catch (err) {
      console.warn('[SaveSystem] Falling back to local cache:', err);
      return this._readLocalCache('chapter', chapterId) || this._readLocalCache('boss', chapterId);
    }
  }

  /**
   * Determines where the player should resume within a chapter.
   *
   * @param {Object|null} progress - result of loadChapterProgress()
   * @returns {{ resumeAt: 'start'|'in_chapter'|'boss', checkpointPosition?: string, bossId?: string }}
   */
  getResumePoint(progress) {
    if (!progress) {
      return { resumeAt: 'start' };
    }

    if (progress.checkpoint_type === 'boss' && progress.boss_status === 'reached') {
      return { resumeAt: 'boss', bossId: progress.boss_id };
    }

    if (progress.checkpoint_type === 'in_chapter') {
      return {
        resumeAt: 'in_chapter',
        checkpointPosition: progress.last_checkpoint_position,
        playerPosition: progress.player_position,
      };
    }

    return { resumeAt: 'start' };
  }

  /**
   * Marks a chapter as fully completed and unlocks the next chapter
   * in the same subject (sequential unlock logic).
   *
   * @param {number} chapterId
   */
  async markChapterCompleted(chapterId) {
    const res = await fetch(`${API_BASE}/player/progress/chapter/${chapterId}/complete`, {
      method: 'POST',
      headers: this._headers(),
    });
    if (!res.ok) throw new Error('Failed to mark chapter completed');
    return res.json();
  }

  /**
   * Marks an entire subject as completed (all chapters done + Forgetter/GEO-X defeated).
   * Unlocks the next subject realm and triggers skin unlock.
   *
   * @param {number} subjectId
   */
  async markSubjectCompleted(subjectId) {
    const res = await fetch(`${API_BASE}/player/progress/subject/${subjectId}/complete`, {
      method: 'POST',
      headers: this._headers(),
    });
    if (!res.ok) throw new Error('Failed to mark subject completed');
    return res.json();
  }

  /**
   * Fetches the player's full progress map (which chapters/subjects
   * are locked, unlocked, or completed) — used to render the
   * subject/chapter selection maps.
   *
   * @returns {Promise<{ subjects: Array, chapters: Array }>}
   */
  async loadFullProgressMap() {
    const res = await fetch(`${API_BASE}/player/progress`, {
      headers: this._headers(),
    });
    if (!res.ok) throw new Error('Failed to load progress map');
    return res.json();
  }

  // ---------------------------------------------
  // Local cache fallback (localStorage)
  // ---------------------------------------------

  _cacheLocally(type, chapterId, payload) {
    try {
      const cache = JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY) || '{}');
      cache[`${type}_${chapterId}`] = { ...payload, cachedAt: Date.now() };
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn('[SaveSystem] Local cache write failed:', err);
    }
  }

  _readLocalCache(type, chapterId) {
    try {
      const cache = JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY) || '{}');
      return cache[`${type}_${chapterId}`] || null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Attempts to flush any locally cached checkpoints to the server
   * (e.g. call this on reconnect / app focus).
   */
  async syncLocalCache() {
    try {
      const cache = JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY) || '{}');
      const entries = Object.entries(cache);

      for (const [key, payload] of entries) {
        const res = await fetch(`${API_BASE}/game/save-checkpoint`, {
          method: 'POST',
          headers: this._headers(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          delete cache[key];
        }
      }

      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn('[SaveSystem] Cache sync failed:', err);
    }
  }
}
