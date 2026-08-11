/**
 * ============================================
 * AceQuest: Agent Ragam — achievement.js
 * Badges and Achievements
 * ============================================
 *
 * Handles:
 * - Awarding badges (chapter completion, subject completion, special)
 * - Awarding achievements + achievement points
 * - Tracking condition_key based unlocks (e.g. 'complete_chapter_1_geo')
 * - Player-facing badge/achievement collections
 */

const API_BASE = '/api';

/** Achievement point values for common conditions */
export const ACHIEVEMENT_POINTS = {
  PERFECT_CHAPTER: 10, // 100% correct on a chapter
  FIRST_MISSION: 5,
  BOSS_DEFEATED: 10,
  SUBJECT_COMPLETED: 25,
  FINAL_BOSS_DEFEATED: 50,
};

/**
 * AchievementManager handles awarding and tracking badges/achievements
 * for the current player, syncing with `player_badges` and
 * `player_achievements` tables.
 */
export class AchievementManager {
  /**
   * @param {Object} options
   * @param {string} options.authToken
   * @param {number} options.userId
   * @param {Function} [options.onBadgeEarned] - callback(badge)
   * @param {Function} [options.onAchievementEarned] - callback(achievement)
   */
  constructor({ authToken, userId, onBadgeEarned, onAchievementEarned }) {
    this.authToken = authToken;
    this.userId = userId;
    this.onBadgeEarned = onBadgeEarned || (() => {});
    this.onAchievementEarned = onAchievementEarned || (() => {});

    this.earnedBadges = []; // cached after load()
    this.earnedAchievements = [];
    this.achievementPoints = 0;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Loads the player's earned badges and achievements.
   * Call once on dashboard/profile init.
   */
  async load() {
    const [badgesRes, achievementsRes, profileRes] = await Promise.all([
      fetch(`${API_BASE}/player/badges`, { headers: this._headers() }),
      fetch(`${API_BASE}/player/achievements`, { headers: this._headers() }),
      fetch(`${API_BASE}/player/profile`, { headers: this._headers() }),
    ]);

    if (!badgesRes.ok || !achievementsRes.ok || !profileRes.ok) {
      throw new Error('Failed to load achievements');
    }

    this.earnedBadges = await badgesRes.json();
    this.earnedAchievements = await achievementsRes.json();
    const profile = await profileRes.json();
    this.achievementPoints = profile.achievement_points;

    return {
      badges: this.earnedBadges,
      achievements: this.earnedAchievements,
      points: this.achievementPoints,
    };
  }

  /**
   * Awards a badge to the player by its `condition_key`
   * (e.g. 'complete_chapter_2.1_geo' -> badge "The Fault Line Fighter").
   * No-ops if the badge was already earned.
   *
   * @param {string} conditionKey
   * @returns {Promise<Object|null>} the awarded badge, or null if already owned / not found
   */
  async awardBadgeByCondition(conditionKey) {
    const alreadyEarned = this.earnedBadges.some((b) => b.condition_key === conditionKey);
    if (alreadyEarned) return null;

    const res = await fetch(`${API_BASE}/player/badges/award`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ user_id: this.userId, condition_key: conditionKey }),
    });

    if (!res.ok) {
      if (res.status === 404) return null; // no badge configured for this condition
      throw new Error('Failed to award badge');
    }

    const badge = await res.json();
    this.earnedBadges.push(badge);
    this.onBadgeEarned(badge);
    return badge;
  }

  /**
   * Awards an achievement to the player by `condition_key` and adds
   * its point value to the player's achievement_points total.
   *
   * @param {string} conditionKey
   * @returns {Promise<Object|null>}
   */
  async awardAchievementByCondition(conditionKey) {
    const alreadyEarned = this.earnedAchievements.some((a) => a.condition_key === conditionKey);
    if (alreadyEarned) return null;

    const res = await fetch(`${API_BASE}/player/achievements/award`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ user_id: this.userId, condition_key: conditionKey }),
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to award achievement');
    }

    const achievement = await res.json();
    this.earnedAchievements.push(achievement);
    this.achievementPoints += achievement.points_reward || 0;
    this.onAchievementEarned(achievement);
    return achievement;
  }

  /**
   * Convenience method: call this when a Big Boss is defeated.
   * Awards the chapter's badge + the "Boss Defeated" achievement,
   * and checks for a "Perfect Chapter" bonus if accuracy was 100%.
   *
   * @param {Object} params
   * @param {string} params.chapterConditionKey - e.g. 'complete_chapter_2.1_geo'
   * @param {number} params.accuracyPercent - 0-100
   * @returns {Promise<{ badge: Object|null, achievements: Object[] }>}
   */
  async onBossDefeated({ chapterConditionKey, accuracyPercent }) {
    const badge = await this.awardBadgeByCondition(chapterConditionKey);

    const achievements = [];
    const bossAchievement = await this.awardAchievementByCondition('boss_defeated');
    if (bossAchievement) achievements.push(bossAchievement);

    if (accuracyPercent >= 100) {
      const perfectAchievement = await this.awardAchievementByCondition(
        `perfect_${chapterConditionKey}`
      );
      if (perfectAchievement) achievements.push(perfectAchievement);
    }

    return { badge, achievements };
  }

  /**
   * Convenience method: call this when a subject's Final Boss
   * (The Forgetter / GEO-X) is defeated. Awards the master badge,
   * subject-completion achievement, and final boss achievement.
   *
   * @param {string} subjectKey - e.g. 'geography', 'mathematics'
   * @returns {Promise<{ masterBadge: Object|null, achievements: Object[] }>}
   */
  async onFinalBossDefeated(subjectKey) {
    const masterBadge = await this.awardBadgeByCondition(`master_${subjectKey}`);

    const achievements = [];
    const subjectAchievement = await this.awardAchievementByCondition(
      `subject_completed_${subjectKey}`
    );
    if (subjectAchievement) achievements.push(subjectAchievement);

    const finalBossAchievement = await this.awardAchievementByCondition(
      `final_boss_defeated_${subjectKey}`
    );
    if (finalBossAchievement) achievements.push(finalBossAchievement);

    return { masterBadge, achievements };
  }

  /**
   * Returns all badges (earned + locked) for display in a badge grid,
   * given the full badge catalog from the backend.
   *
   * @param {Array} badgeCatalog - full list of badges from `badges` table
   * @returns {Array} badges with `earned: boolean` flag
   */
  getBadgeGridData(badgeCatalog) {
    const earnedIds = new Set(this.earnedBadges.map((b) => b.id));
    return badgeCatalog.map((badge) => ({
      ...badge,
      earned: earnedIds.has(badge.id),
    }));
  }

  getTotalPoints() {
    return this.achievementPoints;
  }
}
