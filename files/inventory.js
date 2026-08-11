/**
 * ============================================
 * AceQuest: Agent Ragam — inventory.js
 * Items and Rewards
 * ============================================
 *
 * Handles:
 * - Coin balance and transactions
 * - Skins (unlock, equip)
 * - Consumable items (hints)
 * - Daily login rewards / streaks
 * - Syncing inventory state with backend
 */

const API_BASE = '/api';

/** Coin costs and rewards (keep in sync with implementation.md) */
export const COIN_VALUES = {
  DAILY_LOGIN: 20,
  FIRST_CHAPTER_COMPLETE: 30,
  HINT_COST: 5,
};

/**
 * InventoryManager tracks the player's coins, skins, and consumable
 * items, and syncs changes with the backend `coin_transactions`,
 * `player_skins`, and `player_profiles` tables.
 */
export class InventoryManager {
  /**
   * @param {Object} options
   * @param {string} options.authToken
   * @param {number} options.userId
   * @param {Function} [options.onCoinsChange] - callback(newTotal, delta)
   * @param {Function} [options.onSkinUnlocked] - callback(skin)
   * @param {Function} [options.onSkinEquipped] - callback(skin)
   */
  constructor({ authToken, userId, onCoinsChange, onSkinUnlocked, onSkinEquipped }) {
    this.authToken = authToken;
    this.userId = userId;
    this.onCoinsChange = onCoinsChange || (() => {});
    this.onSkinUnlocked = onSkinUnlocked || (() => {});
    this.onSkinEquipped = onSkinEquipped || (() => {});

    this.coins = 0;
    this.skins = []; // { id, name, preview_url, unlocked: boolean, equipped: boolean }
    this.hintsRemaining = 0;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Loads the player's full inventory state from the backend.
   * Call once when the game/dashboard initializes.
   */
  async load() {
    const [profileRes, skinsRes] = await Promise.all([
      fetch(`${API_BASE}/player/profile`, { headers: this._headers() }),
      fetch(`${API_BASE}/player/skins`, { headers: this._headers() }),
    ]);

    if (!profileRes.ok || !skinsRes.ok) {
      throw new Error('Failed to load inventory');
    }

    const profile = await profileRes.json();
    const skins = await skinsRes.json();

    this.coins = profile.coins;
    this.skins = skins;

    return { coins: this.coins, skins: this.skins };
  }

  // ---------------------------------------------
  // Coins
  // ---------------------------------------------

  /**
   * Adds (or subtracts, if negative) coins and records the transaction.
   *
   * @param {number} amount - positive = gain, negative = spend
   * @param {string} reason - e.g. 'daily_login', 'chapter_complete', 'hint_purchase'
   * @returns {Promise<number>} new coin total
   */
  async addCoins(amount, reason) {
    if (amount < 0 && this.coins + amount < 0) {
      throw new Error('Insufficient coins');
    }

    this.coins += amount;
    this.onCoinsChange(this.coins, amount);

    try {
      await fetch(`${API_BASE}/player/coins/transaction`, {
        method: 'POST',
        headers: this._headers(),
        body: JSON.stringify({
          user_id: this.userId,
          amount,
          reason,
        }),
      });
    } catch (err) {
      console.warn('[InventoryManager] Failed to record coin transaction:', err);
    }

    return this.coins;
  }

  /**
   * Attempts to claim the daily login reward.
   * Backend enforces the once-per-day rule via `last_daily_claim`.
   *
   * @returns {Promise<{ claimed: boolean, coinsAwarded: number, newStreak: number }>}
   */
  async claimDailyLogin() {
    const res = await fetch(`${API_BASE}/player/daily-claim`, {
      method: 'POST',
      headers: this._headers(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { claimed: false, coinsAwarded: 0, newStreak: err.streak || 0 };
    }

    const data = await res.json();
    this.coins += data.coins_awarded;
    this.onCoinsChange(this.coins, data.coins_awarded);

    return { claimed: true, coinsAwarded: data.coins_awarded, newStreak: data.login_streak };
  }

  /**
   * Purchases a hint from a Hint NPC. Deducts coins and returns
   * whether the purchase succeeded.
   *
   * @returns {Promise<boolean>}
   */
  async purchaseHint() {
    if (this.coins < COIN_VALUES.HINT_COST) {
      return false;
    }

    await this.addCoins(-COIN_VALUES.HINT_COST, 'hint_purchase');
    this.hintsRemaining += 1;
    return true;
  }

  // ---------------------------------------------
  // Skins
  // ---------------------------------------------

  /**
   * Unlocks a skin (typically called after completing a subject).
   *
   * @param {number} skinId
   */
  async unlockSkin(skinId) {
    const res = await fetch(`${API_BASE}/player/skins/${skinId}/unlock`, {
      method: 'POST',
      headers: this._headers(),
    });

    if (!res.ok) throw new Error('Failed to unlock skin');

    const skin = await res.json();
    const existing = this.skins.find((s) => s.id === skinId);
    if (existing) {
      existing.unlocked = true;
    } else {
      this.skins.push({ ...skin, unlocked: true, equipped: false });
    }

    this.onSkinUnlocked(skin);
    return skin;
  }

  /**
   * Equips a previously-unlocked skin as the player's active appearance.
   *
   * @param {number} skinId
   */
  async equipSkin(skinId) {
    const skin = this.skins.find((s) => s.id === skinId);
    if (!skin || !skin.unlocked) {
      throw new Error('Skin not unlocked');
    }

    const res = await fetch(`${API_BASE}/player/equip-skin`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ skin_id: skinId }),
    });

    if (!res.ok) throw new Error('Failed to equip skin');

    this.skins.forEach((s) => (s.equipped = s.id === skinId));
    this.onSkinEquipped(skin);
    return skin;
  }

  getEquippedSkin() {
    return this.skins.find((s) => s.equipped) || null;
  }

  getUnlockedSkins() {
    return this.skins.filter((s) => s.unlocked);
  }

  getLockedSkins() {
    return this.skins.filter((s) => !s.unlocked);
  }

  // ---------------------------------------------
  // Reward bundles (returned after boss fights, chapter completion, etc.)
  // ---------------------------------------------

  /**
   * Applies a reward bundle returned from the backend after a
   * significant event (e.g. defeating a Big Boss).
   *
   * Expected shape:
   * { exp: number, coins: number, badge_id?: number, skin_id?: number, achievement_id?: number }
   *
   * @param {Object} rewardBundle
   * @returns {Promise<void>}
   */
  async applyRewardBundle(rewardBundle) {
    if (rewardBundle.coins) {
      await this.addCoins(rewardBundle.coins, 'reward_bundle');
    }

    if (rewardBundle.skin_id) {
      await this.unlockSkin(rewardBundle.skin_id);
    }

    // Note: EXP, badges, and achievements are handled by
    // questionEngine.js and achievement.js respectively.
    // This method focuses on coins/skins (inventory concerns).
  }
}
