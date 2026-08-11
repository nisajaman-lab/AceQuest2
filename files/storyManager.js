/**
 * ============================================
 * AceQuest: Agent Ragam — storyManager.js
 * Agent Ragam Storyline
 * ============================================
 *
 * Handles:
 * - Opening cutscene sequencing
 * - Chapter intro/outro story beats
 * - Big Boss pre-battle and defeat cutscenes
 * - Final Boss (The Forgetter / GEO-X) gauntlet narrative flow
 * - Cutscene playback (text + background image sequences)
 */

const API_BASE = '/api';

/**
 * Static story content for the Geography Realm (Terra Realm),
 * mirroring geography-storyline.md. Other realms can follow the
 * same shape and be merged into REALM_STORY_DATA.
 */
export const REALM_STORY_DATA = {
  geography: {
    realmName: 'The Terra Realm',
    villain: 'GEO-X — The World Eraser',
    entryCutscene: {
      background: '/assets/geography/backgrounds/bg-terra-realm-world-map.png',
      lines: [
        "The Terra Realm once held the memory of every mountain, every river, every city on Earth.",
        "But GEO-X has begun erasing it. Populations are forgotten. Coastlines dissolve.",
        "Volcanoes erupt without warning because no one remembers how to read the signs.",
        "Agent Ragam — you must journey through every zone of this world and restore what has been lost.",
      ],
    },
    chapters: {
      '1.1': {
        title: 'The Population Crisis Zone',
        introLines: [
          "The first zone of Terra Realm has been thrown into chaos.",
          "Cities are overflowing with people — some areas desperately overcrowded, others completely abandoned.",
          "GEO-X has deleted all population data, causing governments to collapse.",
        ],
        bigBoss: {
          id: 'census-phantom',
          name: 'The Census Phantom',
          preBattleLines: [
            "You think you understand people? I have erased every number, every name, every life from the record.",
            "Without data, populations don't exist!",
          ],
          defeatLines: [
            "The Census Phantom shatters into a shower of census forms.",
            "Population data floods back onto the walls.",
            "A small Knowledge Crystal (Population) rises from the rubble.",
            "Population data: RESTORED.",
          ],
          badgeId: 'badge-peoples-champion',
          crystalKey: 'crystal-population',
        },
      },
      '1.2': {
        title: 'The Famine Fields',
        introLines: [
          "The Terra Realm's food production zone has been hit hard.",
          "GEO-X deleted all agricultural knowledge — farmers don't know how to grow rice anymore.",
          "Fish are disappearing from Brunei's waters.",
        ],
        bigBoss: {
          id: 'hunger-titan',
          name: 'The Hunger Titan',
          preBattleLines: [
            "I have eaten every harvest. I have dried every river.",
            "Without food knowledge, your world will starve forever!",
          ],
          defeatLines: [
            "The Hunger Titan collapses, dissolving into rain that soaks the paddy fields.",
            "Rice shoots burst from the ground. Knowledge Crystal (Food) rises.",
            "Food production knowledge: RESTORED.",
          ],
          badgeId: 'badge-harvest-hero',
          crystalKey: 'crystal-food',
        },
      },
      '1.3': {
        title: 'The Crumbling City',
        introLines: [
          "The urban zone of Terra Realm is falling apart.",
          "Roads don't connect to anything. The CBD has merged with residential zones.",
          "GEO-X has scrambled every city plan in existence.",
        ],
        bigBoss: {
          id: 'urban-colossus',
          name: 'The Urban Colossus',
          preBattleLines: [
            "Cities are CHAOS. Urban growth is DESTRUCTION.",
            "No settlement plan survives me!",
          ],
          defeatLines: [
            "The Urban Colossus trips over a correctly placed city zone, crashes, and dissolves into neat rows of organised buildings.",
            "Knowledge Crystal (Settlement) rises.",
            "Settlement knowledge: RESTORED.",
          ],
          badgeId: 'badge-city-architect',
          crystalKey: 'crystal-settlement',
        },
      },
      '2.1': {
        title: 'The Tectonic Grounds',
        introLines: [
          "The ground itself is breaking apart.",
          "GEO-X has severed the knowledge of plate tectonics, causing the Terra Realm's tectonic plates to move wildly and without logic.",
          "Volcanoes erupt without warning. Earthquakes strike with no way to predict or prepare.",
        ],
        bigBoss: {
          id: 'quake-lord',
          name: 'The Quake Lord',
          preBattleLines: [
            "The earth obeys no one. Plates move, mountains rise, cities fall.",
            "GEO-X showed me that without knowledge, humans are helpless against my fury!",
          ],
          defeatLines: [
            "The Quake Lord is struck by a beam of geological knowledge and freezes — plates realign, lava cools, cracks seal.",
            "Knowledge Crystal (Tectonics) rises from the magma.",
            "Plate tectonics knowledge: RESTORED.",
          ],
          badgeId: 'badge-fault-line-fighter',
          crystalKey: 'crystal-tectonics',
        },
      },
      '2.2': {
        title: 'The River & Coast Labyrinth',
        introLines: [
          "The Terra Realm's water systems are broken.",
          "Rivers flow the wrong way. Coastlines have lost their features.",
          "A great flood is threatening the lower valley.",
        ],
        bigBoss: {
          id: 'flood-serpent',
          name: 'The Flood Serpent',
          preBattleLines: [
            "Rivers flow backwards. Coasts collapse into nothing.",
            "GEO-X has unwritten every hydrological law — and now I rule the water!",
          ],
          defeatLines: [
            "The Flood Serpent dissolves into a calm river flowing perfectly to the sea, with all coastal features standing correctly labelled.",
            "Knowledge Crystal (Rivers & Coasts) rises from the river mouth.",
            "River and coastal knowledge: RESTORED.",
          ],
          badgeId: 'badge-watershed-warrior',
          crystalKey: 'crystal-rivers-coasts',
        },
      },
      '2.3': {
        title: 'The Storm & Jungle Frontier',
        introLines: [
          "The outer edge of Terra Realm is a wild, storm-lashed jungle frontier.",
          "GEO-X has corrupted the climate systems — a typhoon is forming with no one able to predict or respond to it.",
          "The rainforest is being rapidly deforested.",
        ],
        bigBoss: {
          id: 'typhoon-wraith',
          name: 'The Typhoon Wraith',
          preBattleLines: [
            "The climate is mine now. Typhoons answer to me. Forests fall at my command.",
            "GEO-X promised me a world without memory — and I will deliver it!",
          ],
          defeatLines: [
            "The Typhoon Wraith is struck by a beam of climate data and unravels — the storm calms, the forest machines shut down, trees begin regrowing.",
            "Knowledge Crystal (Climate & Vegetation) rises from the canopy.",
            "Climate and natural environment knowledge: RESTORED.",
          ],
          badgeId: 'badge-storm-chaser',
          crystalKey: 'crystal-climate-vegetation',
        },
      },
      '3.1': {
        title: 'The Industrial Wasteland',
        introLines: [
          "The economic engine of Terra Realm has seized up.",
          "GEO-X deleted all knowledge of industrial geography — factories are in the wrong places.",
          "Pollution is choking the landscape with no management in sight.",
        ],
        bigBoss: {
          id: 'smog-baron',
          name: 'The Smog Baron',
          preBattleLines: [
            "Industry without knowledge is beautiful chaos!",
            "Every factory in the wrong place! Every river poisoned! This is PROGRESS without memory!",
          ],
          defeatLines: [
            "The Smog Baron chokes on a blast of clean economic data.",
            "The factories realign, smoke clears, the river runs clean.",
            "Industrial knowledge: RESTORED.",
          ],
          badgeId: 'badge-industry-insider',
          crystalKey: 'crystal-industry',
        },
      },
      '3.2': {
        title: 'The Energy Fortress',
        introLines: [
          "The power is out across Terra Realm.",
          "GEO-X destroyed the energy knowledge grid. Oil rigs are burning uncontrolled.",
          "Carbon emissions are skyrocketing with no one knowing how to reduce them.",
        ],
        bigBoss: {
          id: 'carbon-colossus',
          name: 'The Carbon Colossus',
          preBattleLines: [
            "Fossil fuels are forever! Carbon fills the sky!",
            "GEO-X promised a world so warm that all knowledge melts away — and I will make it so!",
          ],
          defeatLines: [
            "The Carbon Colossus is struck by a solar beam and its fossil fuel body burns out — cleanly.",
            "The temperature gauge drops. Wind turbines spin up. Solar panels glow.",
            "Energy knowledge: RESTORED.",
          ],
          badgeId: 'badge-power-protector',
          crystalKey: 'crystal-energy',
        },
      },
      '3.3': {
        title: 'The Tourist Trap',
        introLines: [
          "Terra Realm's most beautiful zone — the Tourism District — has been overrun.",
          "GEO-X lured millions of tourists to the same small area and deleted all sustainable tourism knowledge.",
          "The beaches are trashed. Brunei's natural attractions are under threat.",
        ],
        bigBoss: {
          id: 'overcrowding-phantom',
          name: 'The Overcrowding Phantom',
          preBattleLines: [
            "MORE tourists! MORE resorts! MORE destruction!",
            "GEO-X taught me that unlimited growth erases every beautiful thing on Earth!",
          ],
          defeatLines: [
            "The Overcrowding Phantom is overwhelmed by a wave of sustainable tourism plans.",
            "The resort cleans itself. Flora returns. NPCs smile.",
            "Tourism knowledge: RESTORED.",
          ],
          badgeId: 'badge-eco-explorer',
          crystalKey: 'crystal-tourism',
        },
      },
    },
    finalBoss: {
      id: 'geo-x',
      name: 'GEO-X: The World Eraser',
      preBattleLines: [
        "All 9 Knowledge Crystals float together, forming a glowing map of the Terra Realm.",
        "Commander: \"Agent Ragam. GEO-X is in its final form. It has absorbed all the erased knowledge and turned it into a weapon.\"",
        "Commander: \"The only way to shut it down — is to prove that knowledge can never be truly destroyed. Face it. Answer it. Defeat it.\"",
        "GEO-X: \"You have collected fragments. But fragments are useless against the totality of forgetting.\"",
        "GEO-X: \"Answer ALL of my questions — or the Terra Realm is erased forever.\"",
      ],
      defeatLines: [
        "The final beam of knowledge strikes GEO-X. The satellite AI fractures — data streams pour out of its cracking shell.",
        "Mountains reappear on the horizon. Rivers flow correctly. Cities are organised.",
        "GEO-X: \"...How? How did you remember everything?\"",
        "Agent Ragam: \"Because knowledge can't be erased. It can only be forgotten — and I refused to forget.\"",
        "GEO-X dissolves. The 9 Knowledge Crystals merge into a single, brilliant TERRA CORE.",
        "THE TERRA REALM IS SAVED.",
      ],
      masterBadgeId: 'badge-terra-realm-guardian',
      skinUnlockId: 'skin-geography-explorer',
    },
  },
};

/**
 * StoryManager drives cutscene playback and tracks the player's
 * position within the overarching storyline for a given realm/subject.
 */
export class StoryManager {
  /**
   * @param {Object} options
   * @param {string} options.subjectKey - e.g. 'geography'
   * @param {Function} [options.onCutsceneLine] - callback(lineText, lineIndex, totalLines)
   * @param {Function} [options.onCutsceneComplete] - callback()
   */
  constructor({ subjectKey, onCutsceneLine, onCutsceneComplete }) {
    this.subjectKey = subjectKey;
    this.storyData = REALM_STORY_DATA[subjectKey];

    if (!this.storyData) {
      console.warn(`[StoryManager] No story data found for subject "${subjectKey}"`);
    }

    this.onCutsceneLine = onCutsceneLine || (() => {});
    this.onCutsceneComplete = onCutsceneComplete || (() => {});
  }

  /**
   * Plays the realm's opening cutscene (first time entering the subject).
   * @returns {Promise<void>} resolves when cutscene finishes
   */
  async playEntryCutscene() {
    if (!this.storyData) return;
    return this._playLines(this.storyData.entryCutscene.lines, this.storyData.entryCutscene.background);
  }

  /**
   * Returns the chapter's story data (intro lines, boss data) by chapter key.
   * @param {string} chapterKey - e.g. '2.1'
   */
  getChapterStory(chapterKey) {
    return this.storyData?.chapters?.[chapterKey] || null;
  }

  /**
   * Plays the intro cutscene for a chapter (before the player enters the map).
   * @param {string} chapterKey
   */
  async playChapterIntro(chapterKey) {
    const chapter = this.getChapterStory(chapterKey);
    if (!chapter) return;
    return this._playLines(chapter.introLines);
  }

  /**
   * Plays the pre-battle dialogue for a chapter's Big Boss.
   * @param {string} chapterKey
   */
  async playBossIntro(chapterKey) {
    const chapter = this.getChapterStory(chapterKey);
    if (!chapter?.bigBoss) return;
    return this._playLines(chapter.bigBoss.preBattleLines);
  }

  /**
   * Plays the defeat cutscene for a chapter's Big Boss, returning
   * the badge and crystal identifiers so the caller can trigger
   * achievement.js and visual effects.
   *
   * @param {string} chapterKey
   * @returns {Promise<{badgeId: string, crystalKey: string}>}
   */
  async playBossDefeat(chapterKey) {
    const chapter = this.getChapterStory(chapterKey);
    if (!chapter?.bigBoss) return { badgeId: null, crystalKey: null };

    await this._playLines(chapter.bigBoss.defeatLines);

    return {
      badgeId: chapter.bigBoss.badgeId,
      crystalKey: chapter.bigBoss.crystalKey,
    };
  }

  /**
   * Plays the Final Boss (Forgetter / GEO-X) pre-battle narrative.
   * Call this before launching the final exam gauntlet (see questionEngine.js
   * runFinalGauntlet).
   */
  async playFinalBossIntro() {
    if (!this.storyData?.finalBoss) return;
    return this._playLines(this.storyData.finalBoss.preBattleLines);
  }

  /**
   * Plays the Final Boss defeat / victory cutscene.
   * @returns {Promise<{masterBadgeId: string, skinUnlockId: string}>}
   */
  async playFinalBossDefeat() {
    if (!this.storyData?.finalBoss) return { masterBadgeId: null, skinUnlockId: null };

    await this._playLines(this.storyData.finalBoss.defeatLines);

    return {
      masterBadgeId: this.storyData.finalBoss.masterBadgeId,
      skinUnlockId: this.storyData.finalBoss.skinUnlockId,
    };
  }

  /**
   * Returns the ordered list of chapter keys for sequential progression
   * (e.g. '1.1' -> '1.2' -> ... -> '3.3' -> final boss).
   */
  getChapterSequence() {
    if (!this.storyData) return [];
    return Object.keys(this.storyData.chapters);
  }

  /**
   * Given the current chapter key, returns the next chapter key,
   * or 'FINAL_BOSS' if the current chapter was the last one,
   * or null if the sequence is already complete.
   *
   * @param {string} currentChapterKey
   */
  getNextChapterKey(currentChapterKey) {
    const sequence = this.getChapterSequence();
    const currentIndex = sequence.indexOf(currentChapterKey);

    if (currentIndex === -1) return null;
    if (currentIndex === sequence.length - 1) return 'FINAL_BOSS';
    return sequence[currentIndex + 1];
  }

  /**
   * Internal helper: feeds lines to the onCutsceneLine callback one at a time.
   * The caller's UI (e.g. a cutscene React component) is responsible for
   * the actual typewriter timing via npcInteraction.js's DialogueManager.
   *
   * @param {string[]} lines
   * @param {string} [background] - optional background image path to display
   * @returns {Promise<void>}
   */
  _playLines(lines, background = null) {
    return new Promise((resolve) => {
      let index = 0;

      const showNext = () => {
        if (index >= lines.length) {
          this.onCutsceneComplete();
          resolve();
          return;
        }
        this.onCutsceneLine(lines[index], index, lines.length, background);
        index += 1;
      };

      // Expose a manual "advance" trigger for the UI to call
      this._advanceCutscene = showNext;
      showNext();
    });
  }

  /**
   * Called by the cutscene UI when the player clicks "Continue" / taps screen.
   */
  advanceCutscene() {
    if (this._advanceCutscene) this._advanceCutscene();
  }
}

/**
 * Fetches story/cutscene data from the backend for realms not yet
 * hardcoded in REALM_STORY_DATA (e.g. Mathematics, Science).
 * Falls back gracefully if the endpoint doesn't exist yet.
 *
 * @param {string} subjectKey
 * @returns {Promise<Object|null>}
 */
export async function fetchRealmStoryData(subjectKey) {
  if (REALM_STORY_DATA[subjectKey]) {
    return REALM_STORY_DATA[subjectKey];
  }

  try {
    const res = await fetch(`${API_BASE}/subjects/${subjectKey}/story`);
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.warn(`[storyManager] Could not fetch story data for "${subjectKey}":`, err);
    return null;
  }
}
