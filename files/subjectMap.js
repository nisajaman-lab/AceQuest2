/**
 * ============================================
 * AceQuest: Agent Ragam — subjectMap.js
 * Subject/Chapter World Map
 * ============================================
 *
 * Handles:
 * - Fetching subject (realm) and chapter unlock states
 * - Sequential chapter unlock logic (chapter N+1 unlocks after N's
 *   Big Boss is defeated)
 * - Subject completion unlock logic (next realm unlocks after
 *   Final Boss / Forgetter / GEO-X is defeated)
 * - Data formatting for the SubjectMap / ChapterMap React components
 */

const API_BASE = '/api';

/**
 * The 9 O-Level IGCSE Brunei realms, matching implementation.md.
 * `key` corresponds to REALM_STORY_DATA keys in storyManager.js where available.
 */
export const REALMS = [
  { key: 'mathematics', name: 'Logic Realm', subjectName: 'Mathematics', icon: '/assets/world-map/realm-icon-math.png' },
  { key: 'science', name: 'Discovery Realm', subjectName: 'Science', icon: '/assets/world-map/realm-icon-science.png' },
  { key: 'english', name: 'Language Realm', subjectName: 'English', icon: '/assets/world-map/realm-icon-english.png' },
  { key: 'commerce', name: 'Commerce Realm', subjectName: 'Business', icon: '/assets/world-map/realm-icon-commerce.png' },
  { key: 'history', name: 'History Realm', subjectName: 'History', icon: '/assets/world-map/realm-icon-history.png' },
  { key: 'computer_science', name: 'Technology Realm', subjectName: 'Computer Science', icon: '/assets/world-map/realm-icon-cs.png' },
  { key: 'geography', name: 'Terra Realm', subjectName: 'Geography', icon: '/assets/world-map/realm-icon-geo.png' },
  { key: 'malay', name: 'Language Realm (Malay)', subjectName: 'Malay Language', icon: '/assets/world-map/realm-icon-malay.png' },
];

/**
 * Geography Realm chapter list, matching geography-storyline.md.
 * Each entry maps to a `chapters` row (subject_id + chapter_number).
 */
export const GEOGRAPHY_CHAPTERS = [
  { key: '1.1', number: 1, title: 'The Population Crisis Zone', bossName: 'The Census Phantom' },
  { key: '1.2', number: 2, title: 'The Famine Fields', bossName: 'The Hunger Titan' },
  { key: '1.3', number: 3, title: 'The Crumbling City', bossName: 'The Urban Colossus' },
  { key: '2.1', number: 4, title: 'The Tectonic Grounds', bossName: 'The Quake Lord' },
  { key: '2.2', number: 5, title: 'The River & Coast Labyrinth', bossName: 'The Flood Serpent' },
  { key: '2.3', number: 6, title: 'The Storm & Jungle Frontier', bossName: 'The Typhoon Wraith' },
  { key: '3.1', number: 7, title: 'The Industrial Wasteland', bossName: 'The Smog Baron' },
  { key: '3.2', number: 8, title: 'The Energy Fortress', bossName: 'The Carbon Colossus' },
  { key: '3.3', number: 9, title: 'The Tourist Trap', bossName: 'The Overcrowding Phantom' },
  { key: 'FINAL_BOSS', number: 10, title: 'GEO-X: The World Eraser', bossName: 'GEO-X' },
];

/**
 * SubjectMapManager fetches and organizes the player's progress
 * across subjects and chapters for rendering the world map and
 * chapter selection screens.
 */
export class SubjectMapManager {
  /**
   * @param {Object} options
   * @param {string} options.authToken
   * @param {number} options.userId
   */
  constructor({ authToken, userId }) {
    this.authToken = authToken;
    this.userId = userId;

    this.subjectProgress = []; // [{ subject_id, is_unlocked, is_completed }]
    this.chapterProgress = []; // [{ chapter_id, is_unlocked, is_completed, best_score }]
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Loads progress for all subjects and chapters.
   * Call once when entering the world map.
   */
  async loadProgress() {
    const res = await fetch(`${API_BASE}/player/progress`, { headers: this._headers() });
    if (!res.ok) throw new Error('Failed to load progress map');

    const data = await res.json();
    this.subjectProgress = data.subjects || [];
    this.chapterProgress = data.chapters || [];

    return data;
  }

  /**
   * Builds the data array for rendering the SubjectMap (world map) screen.
   * The first realm is always unlocked by default; subsequent realms
   * unlock once the previous realm's Final Boss is defeated.
   *
   * @returns {Array} REALMS enriched with `unlocked` and `completed` flags
   */
  getSubjectMapData() {
    return REALMS.map((realm, index) => {
      const progress = this.subjectProgress.find((p) => p.subject_key === realm.key);

      // First realm always unlocked; others follow backend progress,
      // with a safe fallback: unlocked if the previous realm is completed.
      let unlocked = progress?.is_unlocked ?? (index === 0);
      if (!unlocked && index > 0) {
        const prevRealm = REALMS[index - 1];
        const prevProgress = this.subjectProgress.find((p) => p.subject_key === prevRealm.key);
        unlocked = prevProgress?.is_completed ?? false;
      }

      return {
        ...realm,
        unlocked,
        completed: progress?.is_completed ?? false,
        subjectId: progress?.subject_id ?? null,
      };
    });
  }

  /**
   * Builds the data array for rendering the ChapterMap screen for a subject.
   * Sequential unlock: chapter N+1 (and FINAL_BOSS) requires chapter N
   * to be completed (i.e. its Big Boss defeated).
   *
   * @param {Array} chapterTemplate - e.g. GEOGRAPHY_CHAPTERS
   * @returns {Array} chapterTemplate enriched with `unlocked`, `completed`, `bestScore`
   */
  getChapterMapData(chapterTemplate) {
    return chapterTemplate.map((chapter, index) => {
      const progress = this.chapterProgress.find((p) => p.chapter_key === chapter.key);

      let unlocked = progress?.is_unlocked ?? (index === 0);
      if (!unlocked && index > 0) {
        const prevChapter = chapterTemplate[index - 1];
        const prevProgress = this.chapterProgress.find((p) => p.chapter_key === prevChapter.key);
        unlocked = prevProgress?.is_completed ?? false;
      }

      return {
        ...chapter,
        unlocked,
        completed: progress?.is_completed ?? false,
        bestScore: progress?.best_score ?? 0,
        chapterId: progress?.chapter_id ?? null,
      };
    });
  }

  /**
   * Checks whether the player can currently access a given chapter.
   * Used to guard navigation (e.g. prevent deep-linking to a locked chapter).
   *
   * @param {Array} chapterTemplate
   * @param {string} chapterKey
   * @returns {boolean}
   */
  canAccessChapter(chapterTemplate, chapterKey) {
    const chapterData = this.getChapterMapData(chapterTemplate);
    const chapter = chapterData.find((c) => c.key === chapterKey);
    return chapter?.unlocked ?? false;
  }

  /**
   * Checks whether the player can access a subject realm.
   *
   * @param {string} realmKey
   * @returns {boolean}
   */
  canAccessSubject(realmKey) {
    const subjectData = this.getSubjectMapData();
    const subject = subjectData.find((s) => s.key === realmKey);
    return subject?.unlocked ?? false;
  }

  /**
   * Calculates overall completion percentage for a subject
   * (used for progress bars on realm cards).
   *
   * @param {Array} chapterTemplate
   * @returns {number} 0-100
   */
  getSubjectCompletionPercent(chapterTemplate) {
    const chapterData = this.getChapterMapData(chapterTemplate);
    const completed = chapterData.filter((c) => c.completed).length;
    return Math.round((completed / chapterData.length) * 100);
  }
}

/**
 * Renders a simple HTML world map grid (vanilla JS, no framework)
 * for environments not using React. For React, see the JSX pattern
 * in media-integration-guide.md (.realm-card uses game.css classes).
 *
 * @param {HTMLElement} container
 * @param {Array} subjectMapData - from getSubjectMapData()
 * @param {Function} onSelectRealm - callback(realm)
 */
export function renderSubjectMapHTML(container, subjectMapData, onSelectRealm) {
  container.innerHTML = '';
  container.className = 'subject-map__grid';

  subjectMapData.forEach((realm) => {
    const card = document.createElement('div');
    card.className = `realm-card ${realm.unlocked ? '' : 'is-locked'}`;

    card.innerHTML = `
      <img class="realm-card__icon" src="${realm.unlocked ? realm.icon : '/assets/world-map/realm-icon-locked.png'}" alt="${realm.subjectName}" />
      <div class="realm-card__name">${realm.subjectName}</div>
      ${realm.completed ? '<div class="realm-card__progress">✓ Completed</div>' : ''}
      ${!realm.unlocked ? '<img class="realm-card__lock-icon" src="/assets/ui/icons/icon-locked.png" alt="Locked" />' : ''}
    `;

    if (realm.unlocked) {
      card.addEventListener('click', () => onSelectRealm(realm));
    }

    container.appendChild(card);
  });
}

/**
 * Renders a simple HTML chapter list (vanilla JS).
 *
 * @param {HTMLElement} container
 * @param {Array} chapterMapData - from getChapterMapData()
 * @param {Function} onSelectChapter - callback(chapter)
 */
export function renderChapterMapHTML(container, chapterMapData, onSelectChapter) {
  container.innerHTML = '';
  container.className = 'chapter-map';

  chapterMapData.forEach((chapter) => {
    const row = document.createElement('div');
    let statusClass = '';
    if (!chapter.unlocked) statusClass = 'is-locked';
    else if (chapter.completed) statusClass = 'is-completed';

    row.className = `chapter-row ${statusClass}`;

    const statusIcon = !chapter.unlocked
      ? '/assets/ui/icons/icon-locked.png'
      : chapter.completed
        ? '/assets/ui/icons/icon-correct.png'
        : '/assets/ui/buttons/btn-play.png';

    row.innerHTML = `
      <div class="chapter-row__number">${chapter.number}</div>
      <div class="chapter-row__title">${chapter.title}${chapter.bossName ? ` — vs ${chapter.bossName}` : ''}</div>
      <img class="chapter-row__status-icon" src="${statusIcon}" alt="status" />
    `;

    if (chapter.unlocked) {
      row.addEventListener('click', () => onSelectChapter(chapter));
    }

    container.appendChild(row);
  });
}
