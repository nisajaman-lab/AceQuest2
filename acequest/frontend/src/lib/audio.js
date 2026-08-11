const audioModules = import.meta.glob('../assets/8. SOUND ASSETS/**/*.{mp3,ogg,wav}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const normalizeAudioKey = (fileName) => {
  return fileName
    .replace(/^(?:sounds-)?(?:bgm|sfx|ui)[/\\_-]?/i, '')
    .replace(/\.((?:ogg|mp3|wav)(\d*))/gi, (_match, _ext, variant) => (variant ? `-${variant}` : ''))
    .replace(/\.(ogg|mp3|wav)$/i, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const rawAudioAssets = Object.fromEntries(
  Object.entries(audioModules).map(([path, url]) => {
    const normalizedPath = path.replace('../assets/8. SOUND ASSETS/', '').replace(/\\/g, '/');
    const fileName = normalizedPath.split('/').pop() || normalizedPath;
    const key = normalizeAudioKey(fileName);

    return [key, url];
  }),
);

const getAsset = (name, fallbackNames = []) =>
  rawAudioAssets[name] || fallbackNames.map((fallbackName) => rawAudioAssets[fallbackName]).find(Boolean) || '';

const audioLibrary = {
  bgm: {
    title: getAsset('title'),
    academyHq: getAsset('academy-hq'),
    battleGuardian: getAsset('battle-guardian'),
    chapterComplete: getAsset('chapter-complete'),
    commerceRealm: getAsset('commerce-realm'),
    cutscene: getAsset('cutscene'),
    discoveryRealm: getAsset('discovery-realm'),
    finalBoss: getAsset('final-boss'),
    geoRealm: getAsset('geo-realm'),
    historyRealm: getAsset('history-realm'),
    languageRealm: getAsset('language-realm'),
    logicRealm: getAsset('logic-realm'),
    techRealm: getAsset('tech-realm'),
  },
  sfx: {
    badgeEarn: getAsset('badge-earn'),
    checkpointSave: getAsset('checkpoint-save'),
    coinsGain: getAsset('coins-gain'),
    combo: getAsset('combo'),
    correct: getAsset('correct'),
    cutsceneStart: getAsset('cutscene-start'),
    doorUnlock: getAsset('door-unlock', ['door-unlock-1', 'door-unlock-2']),
    doorUnlock1: getAsset('door-unlock-1'),
    doorUnlock2: getAsset('door-unlock-2'),
    footstep: getAsset('footstep'),
    gameStart: getAsset('game-start'),
    guardianAppear: getAsset('guardian-appear', ['guardian-appear-1', 'guardian-appear-2']),
    guardianAppear1: getAsset('guardian-appear-1'),
    guardianAppear2: getAsset('guardian-appear-2'),
    levelup: getAsset('levelup'),
    missionComplete: getAsset('mission-complete', ['mission-complete-1', 'mission-complete-2', 'mission-complete-3']),
    missionComplete1: getAsset('mission-complete-1'),
    missionComplete2: getAsset('mission-complete-2'),
    missionComplete3: getAsset('mission-complete-3'),
    npcApproach: getAsset('npc-approach', ['npc-approach-1', 'npc-approach-2']),
    npcApproach1: getAsset('npc-approach-1'),
    npcApproach2: getAsset('npc-approach-2'),
    skinEquip: getAsset('skin-equip'),
    streakClaim: getAsset('streak-claim'),
    wrong: getAsset('wrong'),
  },
  ui: {
    click: getAsset('click', ['click-1', 'click-2']),
    click1: getAsset('click-1'),
    click2: getAsset('click-2'),
    close: getAsset('close'),
    error: getAsset('error'),
    hover: getAsset('hover', ['hover-1']),
    hover1: getAsset('hover-1'),
    mapSelect: getAsset('map-select'),
    notification: getAsset('notification'),
    open: getAsset('open'),
    typing: getAsset('typing', ['typing-1', 'typing-2', 'typing-3']),
    typing1: getAsset('typing-1'),
    typing2: getAsset('typing-2'),
    typing3: getAsset('typing-3'),
  },
};

const getMusicKeyForChapter = (chapter) => {
  if (!chapter) return 'title';
  const subjectName = (chapter.subject_name || chapter.subjectName || '').toLowerCase();
  const title = (chapter.title || chapter.name || '').toLowerCase();
  const tileset = (chapter.map_tileset_key || '').toLowerCase();

  if (subjectName.includes('geography') || tileset.includes('terra') || title.includes('population') || title.includes('famine') || title.includes('city') || title.includes('settlement') || title.includes('tectonic') || title.includes('river') || title.includes('storm') || title.includes('energy') || title.includes('tourist')) {
    return 'geoRealm';
  }
  if (subjectName.includes('mathematics') || title.includes('numbers') || title.includes('algebra') || title.includes('logic')) {
    return 'logicRealm';
  }
  if (subjectName.includes('computer') || title.includes('programming') || title.includes('data') || title.includes('algorithm')) {
    return 'techRealm';
  }
  if (subjectName.includes('commerce') || title.includes('commerce')) {
    return 'commerceRealm';
  }
  if (subjectName.includes('history') || title.includes('history')) {
    return 'historyRealm';
  }
  if (subjectName.includes('language') || title.includes('english') || title.includes('malay')) {
    return 'languageRealm';
  }

  return 'geoRealm';
};

export const playMusicForChapter = async (chapter, options = {}) => {
  const key = getMusicKeyForChapter(chapter);
  return playMusic(key, options);
};

let audioUnlocked = false;
let currentMusicElement = null;
let currentMusicKey = null;
let masterVolume = 0.7;

const ensureAudioContext = async () => {
  if (typeof window === 'undefined' || audioUnlocked) return true;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    const AudioContextInstance = new AudioContextClass();
    if (AudioContextInstance.state === 'suspended') {
      await AudioContextInstance.resume();
    }

    audioUnlocked = true;
    return true;
  } catch (error) {
    console.warn('Audio initialization failed', error);
    return false;
  }
};

const getAudioUrl = (category, key) => {
  const resolved = audioLibrary[category]?.[key];
  if (resolved) return resolved;

  const fallback = audioLibrary[category]?.click || audioLibrary[category]?.title || '';
  return fallback;
};

const createAudioElement = (src, options = {}) => {
  if (!src) return null;

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.volume = options.volume ?? 1;
  audio.loop = Boolean(options.loop);
  return audio;
};

export const initializeAudioSystem = async () => {
  await ensureAudioContext();
  if (typeof document !== 'undefined') {
    document.body?.setAttribute('data-audio-ready', 'true');
  }
};

export const playSound = async (category, key, options = {}) => {
  const url = getAudioUrl(category, key);
  if (!url || typeof window === 'undefined') return null;

  const unlocked = await ensureAudioContext();
  if (!unlocked) return null;

  const audio = createAudioElement(url, options);
  if (!audio) return null;

  audio.volume = Math.max(0, Math.min(1, (options.volume ?? 1) * masterVolume));
  audio.play().catch(() => {
    // Ignore autoplay restrictions until the user interacts with the page.
  });

  return audio;
};

export const playSfx = async (key, options = {}) => {
  return playSound('sfx', key, options);
};

export const playUiSound = async (key, options = {}) => {
  return playSound('ui', key, options);
};

export const playMusic = async (key, options = {}) => {
  const url = getAudioUrl('bgm', key);
  if (!url || typeof window === 'undefined') return null;

  const unlocked = await ensureAudioContext();
  if (!unlocked) return null;

  if (currentMusicKey === key && currentMusicElement && !currentMusicElement.paused) {
    currentMusicElement.volume = Math.max(0, Math.min(1, (options.volume ?? 0.3) * masterVolume));
    return currentMusicElement;
  }

  if (currentMusicElement) {
    currentMusicElement.pause();
    currentMusicElement.currentTime = 0;
  }

  const audio = createAudioElement(url, { ...options, loop: true });
  if (!audio) return null;

  audio.volume = Math.max(0, Math.min(1, (options.volume ?? 0.3) * masterVolume));
  currentMusicElement = audio;
  currentMusicKey = key;
  audio.play().catch(() => {
    // Ignore autoplay restrictions until the user interacts with the page.
  });

  return audio;
};

export const stopMusic = () => {
  if (currentMusicElement) {
    currentMusicElement.pause();
    currentMusicElement.currentTime = 0;
    currentMusicElement = null;
  }
  currentMusicKey = null;
};

export const setMasterVolume = (volume) => {
  masterVolume = Math.max(0, Math.min(1, volume));
  if (currentMusicElement) {
    currentMusicElement.volume = masterVolume * 0.3;
  }
};

export const getAudioLibrary = () => audioLibrary;
