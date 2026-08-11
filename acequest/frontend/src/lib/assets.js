const imageModules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,jfif,webp,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const images = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [
    path.replace('../assets/images/', ''),
    url,
  ])
);

const image = (relativePath, fallbackPath = 'maps_misc/world-map.png') => (
  images[relativePath] || images[fallbackPath] || ''
);

export const assets = {
  logos: {
    aceQuest: image('logos/logo.png'),
    tsa: image('logos/tsa-logo.png'),
    forgetter: image('logos/the-forgetter-logo.png'),
  },
  hero: {
    default: image('sprites/agent-ragam-default.png'),
    walkDown: image('sprites/agent-ragam-walk-down.png'),
    walkUp: image('sprites/agent-ragam-walk-down.png'),
    walkLeft: image('sprites/agent-ragam-walk-left.png'),
    walkRight: image('sprites/agent-ragam-walk-right.png'),
    idle: image('sprites/agent-ragam-idle.png'),
    victory: image('sprites/agent-ragam-victory.png'),
    hurt: image('sprites/agent-ragam-hurt.jpg'),
    portrait: image('portraits/agent-ragam-portrait.png'),
    skins: {
      math: image('sprites/skin-math-master.jpg'),
      science: image('sprites/skin-science-lab.jpg'),
      history: image('sprites/skin-history-explorer.jpg'),
      tech: image('sprites/skin-tech-coder.jpg'),
      elite: image('sprites/skin-elite-agent.jpg'),
    },
  },
  worldMap: image('maps_misc/world-map.png'),
  realmArt: {
    Mathematics: image('maps_misc/math-realm.png'),
    'Computer Science': image('maps_misc/comp-sci-realm.png'),
    Geography: image('maps_misc/geo-realm.png'),
    History: image('maps_misc/history-realm.png'),
    English: image('maps_misc/eng-realm.png'),
    Science: image('maps_misc/sci-realm.png'),
    Commerce: image('maps_misc/commerce-realm.png'),
    Malay: image('icons/malay-icon.png'),
    default: image('maps_misc/world-map.png'),
  },
  tilesets: {
    academy: image('tilesets/tileset-academy.png'),
    logic: image('maps_misc/math-realm.png'),
    discovery: image('maps_misc/sci-realm.png'),
    language: image('maps_misc/eng-realm.png'),
    commerce: image('maps_misc/commerce-realm.png'),
    history: image('maps_misc/history-realm.png'),
    tech: image('maps_misc/comp-sci-realm.png'),
    geo: image('maps_misc/geo-realm.png'),
    safehouse: image('tilesets/tileset-academy.png'),
    'tileset-academy': image('tilesets/tileset-academy.png'),
    'tileset-logic-realm': image('maps_misc/math-realm.png'),
    'tileset-discovery-realm': image('maps_misc/sci-realm.png'),
    'tileset-language-realm': image('maps_misc/eng-realm.png'),
    'tileset-commerce-realm': image('maps_misc/commerce-realm.png'),
    'tileset-history-realm': image('maps_misc/history-realm.png'),
    'tileset-tech-realm': image('maps_misc/comp-sci-realm.png'),
    'tileset-geo-realm': image('maps_misc/geo-realm.png'),
    'tileset-terra-realm': image('maps_misc/geo-realm.png'),
    'tileset-safehouse': image('tilesets/tileset-academy.png'),
  },
  backgrounds: {
    title: image('backgrounds/bg-title-screen.jpg'),
    loading: image('backgrounds/bg-loading-screen.jpg'),
    chapterComplete: image('backgrounds/bg-chapter-complete.jpg'),
    gameOver: image('backgrounds/bg-gameover.jpg'),
    tsaHq: image('backgrounds/bg-tsa-hq.jpg'),
    forgetterVoid: image('backgrounds/bg-forgetter-void.jpg'),
    crowd: image('backgrounds/bg-megacity-overcrowded.png'),
    paddyFields: image('backgrounds/bg-dried-paddy-fields.png'),
    cityRuins: image('backgrounds/bg-jumbled-city.png'),
    cityArena: image('backgrounds/bg-broken-city-arena.png'),
    settlementTerrain: image('backgrounds/bg-foundling-ruins.png'),
    harbour: image('backgrounds/bg-migration-docks.png'),
    sea: image('backgrounds/bg-empty-sea.png'),
    lab: image('backgrounds/bg-agrifood-lab.png'),
    slum: image('backgrounds/bg-expanding-slum.png'),
    emptyTown: image('backgrounds/bg-market-town-empty.png'),
    tsunamiShore: image('backgrounds/bg-tsunami-shore.png'),
    quakeArena: image('backgrounds/bg-quake-lord-arena.png'),
    plateBoundary: image('backgrounds/bg-plate-boundary-trenches.png'),
    pyramidTower: image('backgrounds/bg-pyramid-tower.png'),
    volcano: image('backgrounds/bg-erupting-volcano.png'),
  },
  portraits: {
    mayor: image('portraits/npc-mayor-portrait.png'),
    drSiti: image('portraits/npc-dr-siti-portrait.png'),
    ibrahim: image('portraits/npc-ibrahim-portrait.png'),
    profZara: image('portraits/npc-prof-zara-portrait.png'),
    hajiDaud: image('portraits/npc-haji-dauh-portrait.png'),
    minah: image('portraits/npc-fisher-minah-portarit.png'),
    agro: image('portraits/npc-dr-agro-portrait.png'),
    merchant: image('portraits/npc-merchant-portrait.png'),
    azri: image('portraits/npc-azri-portrait.png'),
    oldSettler: image('portraits/npc-old-settler-portratit.png'),
    maya: image('portraits/npc-maya-portrait.png'),
    transport: image('portraits/npc-transport-officer-portrait.png'),
    geographer: image('portraits/npc-checkpoint-portrait.png'),
    tectonica: image('portraits/npc-dr-tectonica-portrait.png'),
    razak: image('portraits/npc-volcanologist-razak-portrait.png'),
    fatimah: image('portraits/npc-sesimologist-fatimah-portrait.png'),
    checkpoint: image('portraits/npc-checkpoint-portrait.png'),
    villageElder: image('portraits/npc-village-elder-portrait.png'),
    'azri-planner': image('portraits/npc-azri-portrait.png'),
    'checkpoint-geographer': image('portraits/npc-checkpoint-portrait.png'),
    'checkpoint-officer': image('portraits/npc-checkpoint-portrait.png'),
    'dr-agro': image('portraits/npc-dr-agro-portrait.png'),
    'dr-siti': image('portraits/npc-dr-siti-portrait.png'),
    'dr-tectonica': image('portraits/npc-dr-tectonica-portrait.png'),
    'fisher-minah': image('portraits/npc-fisher-minah-portarit.png'),
    'haji-daud': image('portraits/npc-haji-dauh-portrait.png'),
    'ibrabim-migrant': image('portraits/npc-ibrahim-portrait.png'),
    'ibrahim-migrant': image('portraits/npc-ibrahim-portrait.png'),
    'maya-slum': image('portraits/npc-maya-portrait.png'),
    'mayor-harith': image('portraits/npc-mayor-portrait.png'),
    'merchant-checkpoint': image('portraits/npc-merchant-portrait.png'),
    'merchant-male': image('portraits/npc-merchant-portrait-male.png'),
    'old-settler': image('portraits/npc-old-settler-portratit.png'),
    'professor-zara': image('portraits/npc-prof-zara-portrait.png'),
    'seismologist-fatimah': image('portraits/npc-sesimologist-fatimah-portrait.png'),
    'transport-ofiicer': image('portraits/npc-transport-officer-portrait.png'),
    'transport-officer': image('portraits/npc-transport-officer-portrait.png'),
    'village-elder-tsunami': image('portraits/npc-village-elder-portrait.png'),
    'volcanologist-razak': image('portraits/npc-volcanologist-razak-portrait.png'),
  },
  npcs: {
    commander: image('npc/npc-commander.png.png'),
    hintLady: image('npc/npc-dr-siti.png'),
    shopkeeper: image('npc/npc-merchant-checkpoint.png'),
    checkpoint: image('npc/npc-checkpoint-officer.png'),
    friendlyBruneian: image('npc/npc-rescued-villager.png'),
    studentClassmate: image('npc/npc-rescued-villager.png'),
    mayor: image('npc/npc-mayor-harith.png'),
    scientist: image('npc/npc-dr-siti.png'),
    scientist2: image('npc/npc-dr-agro.png'),
    farmer: image('npc/npc-haji-daud.png'),
    fisher: image('npc/npc-fisher-minah.jfif'),
    planner: image('npc/npc-azri-planner.png'),
    geologist: image('npc/npc-dr-tectonica.png'),
    guide: image('npc/npc-checkpoint-geographer.png'),
    director: image('npc/npc-mayor-harith.png'),
    tourism: image('npc/npc-merchant-male.png'),
    'npc-azri-planner': image('npc/npc-azri-planner.png'),
    'npc-checkpoint-geographer': image('npc/npc-checkpoint-geographer.png'),
    'npc-checkpoint-officer': image('npc/npc-checkpoint-officer.png'),
    'npc-commander': image('npc/npc-commander.png.png'),
    'npc-dr-agro': image('npc/npc-dr-agro.png'),
    'npc-dr-siti': image('npc/npc-dr-siti.png'),
    'npc-dr-tectonica': image('npc/npc-dr-tectonica.png'),
    'npc-fisher-minah': image('npc/npc-fisher-minah.jfif'),
    'npc-haji-daud': image('npc/npc-haji-daud.png'),
    'npc-ibrabim-migrant': image('npc/npc-ibrabim-migrant.png'),
    'npc-ibrahim-migrant': image('npc/npc-ibrabim-migrant.png'),
    'npc-maya-slum': image('npc/npc-maya-slum.png'),
    'npc-mayor-harith': image('npc/npc-mayor-harith.png'),
    'npc-merchant-checkpoint': image('npc/npc-merchant-checkpoint.png'),
    'npc-merchant-male': image('npc/npc-merchant-male.png'),
    'npc-old-settler': image('npc/npc-old-settler.png'),
    'npc-professor-zara': image('npc/npc-professor-zara.png'),
    'npc-rescued-villager': image('npc/npc-rescued-villager.png'),
    'npc-seismologist-fatimah': image('npc/npc-seismologist-fatimah.png'),
    'npc-transport-ofiicer': image('npc/npc-transport-ofiicer.png'),
    'npc-transport-officer': image('npc/npc-transport-ofiicer.png'),
    'npc-village-elder-tsunami': image('npc/npc-village-elder-tsunami.png'),
    'npc-volcanologist-razak': image('npc/npc-volcanologist-razak.png'),
    'boss-algebra-x': image('bosses/boss-census-phantom.png'),
    'boss-typhoon': image('BIG BOSS 2.3 — THE TYPHOON WRAITH/BIG BOSS 2.3 — THE TYPHOON WRAITH/boss-typhoon-wraith.png.jpg'),
    'boss-smog': image('BIG BOSS 3.1 — THE SMOG BARON/BIG BOSS 3.1 — THE SMOG BARON/boss-smog-baron.png.jpg'),
  },
  bosses: {
    census: image('bosses/boss-census-phantom.png'),
    censusAttack: image('bosses/boss-census-attack.png'),
    hunger: image('bosses/hunger-titan.png'),
    hungerAttack: image('bosses/hunger-titan-attack.png'),
    urban: image('bosses/urban-colossus.png'),
    urbanAttack: image('bosses/urban-colossus-attack.png'),
    quake: image('bosses/boss-quake-lord.png'),
    quakeAttack: image('bosses/boss-quake-lord-attack-qquake.png'),
    flood: image('misc/obj-tsunami-wave-approaching.png'),
    typhoon: image('BIG BOSS 2.3 — THE TYPHOON WRAITH/BIG BOSS 2.3 — THE TYPHOON WRAITH/boss-typhoon-wraith.png.jpg'),
    typhoonAttack: image('BIG BOSS 2.3 — THE TYPHOON WRAITH/BIG BOSS 2.3 — THE TYPHOON WRAITH/boss-typhoon-wraith-attack.png.jpg'),
    smog: image('BIG BOSS 3.1 — THE SMOG BARON/BIG BOSS 3.1 — THE SMOG BARON/boss-smog-baron.png.jpg'),
    smogAttack: image('BIG BOSS 3.1 — THE SMOG BARON/BIG BOSS 3.1 — THE SMOG BARON/boss-smog-baron-attack.png.jpg'),
    carbon: image('bosses/urban-colossus.png'),
    crowd: image('bosses/boss-census-phantom.png'),
    forgetter: image('logos/the-forgetter-logo.png'),
  },
  ui: {
    badgePlaceholder: image('icons/locked-realm-icon.png'),
  },
  crystals: {
    population: image('crystals/crystal-population.png'),
    food: image('crystals/crystal-food.png'),
    settlement: image('crystals/crystal-settlement.png'),
    tectonics: image('crystals/crystal-tectonics.png'),
    climateVegetation: image('BIG BOSS 2.3 — THE TYPHOON WRAITH/BIG BOSS 2.3 — THE TYPHOON WRAITH/crystal-climate-vegetation.png.jpg'),
    industry: image('BIG BOSS 3.1 — THE SMOG BARON/BIG BOSS 3.1 — THE SMOG BARON/crystal-industry.png.jpg'),
  },
  chapterScenes: {
    geography: {
      'The Population Crisis Zone': image('tilesets/tileset-academy.png'),
      'The Famine Fields': image('backgrounds/bg-dried-paddy-fields.png'),
      'The Crumbling City': image('backgrounds/bg-broken-city-arena.png'),
      'The Tectonic Grounds': image('backgrounds/bg-quake-lord-arena.png'),
      'The River & Coast Labyrinth': image('backgrounds/bg-tsunami-shore.png'),
    'The Storm & Jungle Frontier': image('BIG BOSS 2.3 — THE TYPHOON WRAITH/BIG BOSS 2.3 — THE TYPHOON WRAITH/bg-typhoon-wraith-arena.png.jpg'),
    'The Industrial Wasteland': image('BIG BOSS 3.1 — THE SMOG BARON/BIG BOSS 3.1 — THE SMOG BARON/bg-smog-baron-arena.png.jpg'),
    'The Energy Fortress': image('backgrounds/bg-tsa-hq.jpg'),
    'The Tourist Trap': image('backgrounds/bg-market-town-empty.png'),
  },
    mathematics: image('maps_misc/math-realm.png'),
    math: {
      'Numbers & Arithmetic': image('maps_misc/math-realm.png'),
      Algebra: image('maps_misc/math-realm.png'),
    },
    computerScience: image('backgrounds/bg-agrifood-lab.png'),
  },
  badges: {
    chapterComplete: image('badges/badge-chapter-complete.jpg'),
    eliteAgent: image('badges/badge-elite-agent.jpg'),
    firstMission: image('badges/badge-first-mission.jpg'),
    perfectScore: image('badges/badge-perfect-score.jpg'),
    streak7: image('badges/badge-streak-7.jpg'),
    cs: image('badges/badge-subject-cs.jpg'),
    english: image('badges/badge-subject-english.jpg'),
    math: image('badges/badge-subject-math.jpg'),
    science: image('badges/badge-subject-science.jpg'),
  },
  effects: {
    attack: image('effects/attack-effect.png'),
    dataBeam: image('effects/fx-data-beam.png'),
    erase: image('effects/fx-erase-effect.png'),
    groundCrack: image('effects/fx-ground-crack.png'),
    lavaBurst: image('effects/fx-lava-burst.png'),
    rubbleImpact: image('effects/fx-rubble-impact.png'),
    villageImpact: image('effects/fx-village-impact.png'),
  },
};

export const getRealmArt = (realmName) => assets.realmArt[realmName] || assets.realmArt.default;

export const getTilesetAsset = (key) => {
  if (!key) return assets.tilesets.safehouse;
  return assets.tilesets[key] || assets.tilesets.safehouse;
};

export const getNpcSpriteAsset = (spriteKey, npcType) => {
  const direct = assets.npcs[spriteKey];
  if (direct) return direct;

  const bossKey = spriteKey?.replace(/^boss-/, '');
  if (bossKey && assets.bosses[bossKey]) {
    return assets.bosses[bossKey];
  }

  const fallbackByType = {
    mission_giver: assets.npcs.commander,
    hint: assets.npcs.hintLady,
    shop: assets.npcs.shopkeeper,
    guardian: assets.bosses.smog,
    friendly: assets.npcs.friendlyBruneian,
    checkpoint: assets.npcs.checkpoint,
  };

  return fallbackByType[npcType] || assets.npcs.friendlyBruneian;
};

export const getNpcPortraitAsset = (spriteKey, npcType) => {
  const portraitKey = spriteKey?.replace(/^npc-/, '').replace(/^boss-/, '');
  const direct = assets.portraits[portraitKey];
  if (direct) return direct;

  const fallbackByType = {
    mission_giver: assets.portraits.mayor,
    hint: assets.portraits.drSiti,
    shop: assets.portraits.merchant,
    guardian: assets.portraits.tectonica,
    friendly: assets.portraits.villageElder,
    checkpoint: assets.portraits.checkpoint,
  };

  return fallbackByType[npcType] || assets.hero.portrait;
};

export const getHeroSkinAsset = (skinName) => {
  if (!skinName || skinName === 'default') return assets.hero.default;

  const skinMap = {
    'skin-math-master': assets.hero.skins.math,
    'skin-science-lab': assets.hero.skins.science,
    'skin-history-explorer': assets.hero.skins.history,
    'skin-tech-coder': assets.hero.skins.tech,
    'skin-elite-agent': assets.hero.skins.elite,
  };

  return skinMap[skinName] || assets.hero.default;
};

export const getChapterSceneAsset = (chapter) => {
  if (!chapter) return assets.backgrounds.loading;

  const isGeographyRealm = chapter.map_tileset_key === 'tileset-terra-realm' || chapter.title?.includes('Zone') || chapter.title?.includes('Grounds') || chapter.title?.includes('City');
  const subjectName = chapter.subject_name || chapter.subjectName;
  if (isGeographyRealm || subjectName === 'Geography') {
    return assets.chapterScenes.geography[chapter.title] || getTilesetAsset(chapter.map_tileset_key) || assets.worldMap;
  }

  if (assets.chapterScenes.math[chapter.title]) return assets.chapterScenes.math[chapter.title];
  if (subjectName === 'Mathematics') return assets.chapterScenes.mathematics;
  if (subjectName === 'Computer Science') return assets.chapterScenes.computerScience;

  return getTilesetAsset(chapter.map_tileset_key) || assets.worldMap;
};

export const getChapterCrystalAsset = (chapter) => {
  const title = chapter?.title || chapter?.name || '';
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes('population')) return assets.crystals.population;
  if (normalizedTitle.includes('famine') || normalizedTitle.includes('food')) return assets.crystals.food;
  if (normalizedTitle.includes('crumbling') || normalizedTitle.includes('city') || normalizedTitle.includes('settlement')) return assets.crystals.settlement;
  if (normalizedTitle.includes('tectonic') || normalizedTitle.includes('ground')) return assets.crystals.tectonics;
  if (normalizedTitle.includes('storm') || normalizedTitle.includes('jungle') || normalizedTitle.includes('climate') || normalizedTitle.includes('vegetation')) return assets.crystals.climateVegetation;
  if (normalizedTitle.includes('industrial') || normalizedTitle.includes('industry') || normalizedTitle.includes('smog') || normalizedTitle.includes('wasteland')) return assets.crystals.industry;

  return assets.badges.chapterComplete;
};

export const getBadgeIconAsset = (badge) => {
  const badgeText = `${badge?.name || ''} ${badge?.description || ''} ${badge?.badge_type || ''} ${badge?.icon_url || ''}`.toLowerCase();

  if (badgeText.includes('perfect')) return assets.badges.perfectScore;
  if (badgeText.includes('elite')) return assets.badges.eliteAgent;
  if (badgeText.includes('first mission') || badgeText.includes('first-mission')) return assets.badges.firstMission;
  if (badgeText.includes('streak')) return assets.badges.streak7;

  if (badgeText.includes('population') || badgeText.includes('crisis zone')) return assets.crystals.population;
  if (badgeText.includes('famine') || badgeText.includes('food')) return assets.crystals.food;
  if (badgeText.includes('crumbling') || badgeText.includes('city') || badgeText.includes('settlement')) return assets.crystals.settlement;
  if (badgeText.includes('tectonic') || badgeText.includes('ground')) return assets.crystals.tectonics;

  if (badgeText.includes('computer science') || badgeText.includes('subject-cs') || badgeText.includes('cs') || badgeText.includes('tech')) return assets.badges.cs;
  if (badgeText.includes('english') || badgeText.includes('language')) return assets.badges.english;
  if (badgeText.includes('mathematics') || badgeText.includes('math') || badgeText.includes('arithmetic') || badgeText.includes('algebra')) return assets.badges.math;
  if (badgeText.includes('science') || badgeText.includes('biology')) return assets.badges.science;

  if (badgeText.includes('chapter') || badgeText.includes('complete')) return assets.badges.chapterComplete;

  return badge?.icon_url || assets.badges.chapterComplete;
};
