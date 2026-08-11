import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { getChapterSceneAsset, getHeroSkinAsset, getNpcPortraitAsset, getNpcSpriteAsset } from '../../lib/assets';
import { playSfx } from '../../lib/audio';

const MISSION_ONE_START = { row: 10, col: 4, x: 247, y: 500 };

const MISSION_ONE_PATH_POINTS = [
  { row: 10, col: 4, x: 247, y: 500 },
  { row: 9, col: 4, x: 247, y: 450 },
  { row: 8, col: 4, x: 247, y: 397 },
  { row: 7, col: 4, x: 247, y: 347 },
  { row: 7, col: 4, x: 264, y: 340 },
  { row: 6, col: 5, x: 267, y: 293 },
  { row: 6, col: 6, x: 334, y: 293 },
  { row: 6, col: 7, x: 400, y: 293 },
  { row: 6, col: 8, x: 467, y: 293 },
  { row: 7, col: 9, x: 534, y: 327 },
  { row: 8, col: 9, x: 550, y: 350 },
  { row: 9, col: 9, x: 550, y: 400 },
  { row: 10, col: 9, x: 570, y: 453 },
  { row: 11, col: 9, x: 570, y: 503 },
  { row: 11, col: 9, x: 534, y: 527 },
  { row: 11, col: 8, x: 530, y: 513 },
  { row: 11, col: 7, x: 464, y: 513 },
  { row: 11, col: 6, x: 397, y: 513 },
];

const MISSION_ONE_NPCS = [
  {
    id: 'mission-one-commander',
    name: 'Commander Sarah',
    npc_type: 'mission_giver',
    sprite_key: 'npc-commander',
    x: 264,
    y: 340,
    dialogues: [
      { dialogue_text: 'The Arithmetic Gate has scrambled the number patterns that keep the Logic Realm stable.' },
      { dialogue_text: 'Restore the rules of factors, fractions, and place value before the corruption spreads to the Logic Core.' },
    ],
  },
  {
    id: 'mission-one-dr-siti',
    name: 'Dr. Siti',
    npc_type: 'hint',
    sprite_key: 'npc-dr-siti',
    x: 534,
    y: 527,
    dialogues: [
      { dialogue_text: 'Hint: break the number problem into smaller steps before choosing your answer.' },
      { dialogue_text: 'Check place value, signs, and order of operations carefully.' },
    ],
  },
];

const ALGEBRA_GUARDIAN = {
  id: 'mission-two-algebra-x',
  name: 'Guardian Algebra X',
  npc_type: 'guardian',
  sprite_key: 'boss-algebra-x',
  x: 337,
  y: 297,
  auto_start_questions: true,
  dialogues: [
    { dialogue_text: 'So, Agent Ragam, you have reached the Algebra Gate.' },
    { dialogue_text: 'Solve for the unknowns. Balance both sides, isolate X, and prove you can restore this corrupted sector.' },
  ],
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  isMissionOneMath() {
    return this.chapter?.subject_id === 1
      && (this.chapter?.title === 'Numbers & Arithmetic' || this.chapterId === 1);
  }

  isAlgebraMission() {
    return this.chapter?.subject_id === 1
      && (this.chapter?.title === 'Algebra' || this.chapterId === 2);
  }

  usesGuidedMathPath() {
    return this.isMissionOneMath() || this.isAlgebraMission();
  }

  getCurrentCell() {
    if (!this.player || !this.cellGrid) return null;

    if (this.usesGuidedMathPath()) {
      const nearestPoint = MISSION_ONE_PATH_POINTS.reduce((nearest, point) => {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, point.x, point.y);
        return !nearest || distance < nearest.distance ? { ...point, distance } : nearest;
      }, null);

      return {
        row: nearestPoint.row,
        col: nearestPoint.col,
        label: `R${nearestPoint.row}C${nearestPoint.col}`,
      };
    }

    const col = Phaser.Math.Clamp(Math.floor(this.player.x / this.cellGrid.cellWidth) + 1, 1, this.cellGrid.cols);
    const row = Phaser.Math.Clamp(Math.floor(this.player.y / this.cellGrid.cellHeight) + 1, 1, this.cellGrid.rows);

    return {
      row,
      col,
      label: `R${row}C${col}`,
    };
  }

  logCurrentCell() {
    const currentCell = this.getCurrentCell();
    if (!currentCell || currentCell.label === this.lastLoggedCell) return currentCell;

    console.log(`Mission cell: ${currentCell.label}`, {
      mission: this.chapter?.title || `Chapter ${this.chapterId}`,
      row: currentCell.row,
      column: currentCell.col,
      x: Math.round(this.player.x),
      y: Math.round(this.player.y),
    });
    this.lastLoggedCell = currentCell.label;

    return currentCell;
  }

  fitSpriteToBounds(sprite, maxWidth, maxHeight) {
    const texture = sprite.texture;
    const source = texture?.getSourceImage?.();
    const sourceWidth = source?.width || texture?.source?.[0]?.width || maxWidth;
    const sourceHeight = source?.height || texture?.source?.[0]?.height || maxHeight;
    const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);
    sprite.setDisplaySize(sourceWidth * scale, sourceHeight * scale);
    if (sprite.body && sprite.body.setSize) {
      sprite.body.setSize(sprite.displayWidth, sprite.displayHeight, true);
    }
  }

  init(data) {
    this.chapterId = data.chapterId || this.game.registry.get('chapterId');
    this.chapter = data.chapter || this.game.registry.get('chapter') || null;
    this.heroSkin = data.heroSkin || this.game.registry.get('heroSkin') || 'default';
    this.npcsData = data.npcs || this.game.registry.get('npcs') || [];
    this.checkpointPos = data.checkpointPos || this.game.registry.get('checkpointPos') || '100,300';

    if (this.isMissionOneMath()) {
      this.npcsData = MISSION_ONE_NPCS;
      this.checkpointPos = `${MISSION_ONE_START.x},${MISSION_ONE_START.y}`;
    } else if (this.isAlgebraMission()) {
      this.npcsData = [ALGEBRA_GUARDIAN];
      this.checkpointPos = `${MISSION_ONE_START.x},${MISSION_ONE_START.y}`;
    }
  }

  preload() {
    const chapterAsset = getChapterSceneAsset(this.chapter);
    this.load.image('chapter-background', chapterAsset);

    const heroAsset = getHeroSkinAsset(this.heroSkin);
    this.load.image('player_sprite', heroAsset);

    this.npcsData.forEach((npc) => {
      const spriteKey = `npc-sprite-${npc.id}`;
      const portraitKey = `npc-portrait-${npc.id}`;
      this.load.image(spriteKey, getNpcSpriteAsset(npc.sprite_key, npc.npc_type));
      this.load.image(portraitKey, getNpcPortraitAsset(npc.sprite_key, npc.npc_type));
    });

    this.load.on('loaderror', () => {
      // Missing assets fall back to generated placeholders in create().
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#0f172a');
    playSfx('gameStart', { volume: 0.2 });

    if (this.textures.exists('chapter-background')) {
      const background = this.add.image(400, 300, 'chapter-background');
      background.setDisplaySize(800, 600);
      background.setAlpha(0.75);
    }

    const overlay = this.add.rectangle(400, 300, 800, 600, 0x0f172a, 0.42);
    overlay.setDepth(0);

    this.cellGrid = { cols: 12, rows: 12, cellWidth: 800 / 12, cellHeight: 600 / 12 };

    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00bcd4, 0.45);
    for (let col = 0; col <= this.cellGrid.cols; col += 1) {
      const x = col * this.cellGrid.cellWidth;
      gridGraphics.lineBetween(x, 0, x, 600);
    }
    for (let row = 0; row <= this.cellGrid.rows; row += 1) {
      const y = row * this.cellGrid.cellHeight;
      gridGraphics.lineBetween(0, y, 800, y);
    }

    this.obstacles = this.physics.add.staticGroup();

    const wallGraphics = this.add.graphics();
    wallGraphics.fillStyle(0x1a2744, 1);
    wallGraphics.lineStyle(2, 0x00bcd4, 1);
    wallGraphics.fillRect(0, 0, 800, 20);
    wallGraphics.strokeRect(0, 0, 800, 20);
    wallGraphics.fillRect(0, 580, 800, 20);
    wallGraphics.strokeRect(0, 580, 800, 20);
    wallGraphics.fillRect(0, 0, 20, 600);
    wallGraphics.strokeRect(0, 0, 20, 600);
    wallGraphics.fillRect(780, 0, 20, 600);
    wallGraphics.strokeRect(780, 0, 20, 600);

    // Parse checkpoint position
    let startX = 100;
    let startY = 300;
    if (this.checkpointPos && this.checkpointPos.includes(',')) {
      const parts = this.checkpointPos.split(',');
      startX = parseFloat(parts[0]) || 100;
      startY = parseFloat(parts[1]) || 300;
    }
    if (this.usesGuidedMathPath()) {
      startX = MISSION_ONE_START.x;
      startY = MISSION_ONE_START.y;
    }

    if (!this.textures.exists('player_sprite')) {
      const playerCanvas = this.make.graphics({ x: 0, y: 0, add: false });
      playerCanvas.fillStyle(0x00bcd4, 1);
      playerCanvas.fillCircle(16, 16, 14);
      playerCanvas.fillStyle(0xf5c518, 1);
      playerCanvas.fillRect(10, 2, 12, 6);
      playerCanvas.generateTexture('player_sprite', 32, 32);
    }

    this.player = this.physics.add.sprite(startX, startY, 'player_sprite');
    this.player.setCollideWorldBounds(true);
    this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(20, 20, 760, 560));
    this.player.setOrigin(0.5, 0.5);
    this.fitSpriteToBounds(this.player, 42, 58);

    this.npcs = this.physics.add.staticGroup();
    this.npcMap = new Map();

    const npcColors = {
      mission_giver: 0x3b82f6,
      hint: 0x10b981,
      guardian: 0xef4444,
      checkpoint: 0xf5c518,
      friendly: 0x8b5cf6,
      shop: 0xf59e0b,
    };

    const positions = [
      { x: 220, y: 170 },
      { x: 360, y: 410 },
      { x: 560, y: 200 },
      { x: 690, y: 330 },
      { x: 500, y: 470 },
    ];

    this.npcsData.forEach((npc, index) => {
      const isBoss = npc.npc_type === 'guardian';
      const pos = this.usesGuidedMathPath() ? { x: npc.x, y: npc.y } : positions[index % positions.length];
      const color = npcColors[npc.npc_type] || 0x00bcd4;

      const spriteKey = `npc-sprite-${npc.id}`;
      let npcSprite;
      if (this.textures.exists(spriteKey)) {
        npcSprite = this.npcs.create(pos.x, pos.y, spriteKey);
      } else {
        const fallbackKey = `npc-fallback-${npc.id}`;
        const npcCanvas = this.make.graphics({ x: 0, y: 0, add: false });
        npcCanvas.fillStyle(color, 1);
        npcCanvas.fillCircle(16, 16, 14);
        npcCanvas.fillStyle(0xffffff, 1);
        npcCanvas.fillCircle(10, 12, 3);
        npcCanvas.fillCircle(22, 12, 3);
        npcCanvas.fillStyle(0x000000, 1);
        npcCanvas.fillCircle(10, 12, 1);
        npcCanvas.fillCircle(22, 12, 1);
        npcCanvas.generateTexture(fallbackKey, 32, 32);
        npcSprite = this.npcs.create(pos.x, pos.y, fallbackKey);
      }

      npcSprite.setOrigin(0.5, 0.5);
      this.fitSpriteToBounds(npcSprite, isBoss ? 56 : 40, isBoss ? 56 : 40);
      npcSprite.setData('info', {
        ...npc,
        portraitUrl: this.textures.exists(`npc-portrait-${npc.id}`)
          ? this.textures.get(`npc-portrait-${npc.id}`).getSourceImage()?.src
          : getNpcPortraitAsset(npc.sprite_key, npc.npc_type),
      });

      const label = this.add.text(pos.x, pos.y - 28, npc.name, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '11px',
        fontWeight: 'bold',
        color: isBoss ? '#f5c518' : '#ffffff',
        backgroundColor: '#0f172a',
        padding: { x: 4, y: 2 }
      });
      label.setOrigin(0.5);
      if (isBoss) {
        const bossTag = this.add.text(pos.x, pos.y - 46, 'BOSS', {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '10px',
          fontStyle: 'bold',
          color: '#f5c518',
          backgroundColor: '#1a2744',
          padding: { x: 6, y: 2 },
        });
        bossTag.setOrigin(0.5);
      }

      this.npcMap.set(npc.id, npcSprite);
    });

    this.physics.add.overlap(this.player, this.npcs, (p, npcSprite) => {
      const npcInfo = npcSprite.getData('info');
      if (!this.activeInteraction || this.activeInteraction.id !== npcInfo.id) {
        this.activeInteraction = npcInfo;
        EventBus.emit('npc-overlap-start', { npc: npcInfo, isIntro: false });
        const now = this.time.now;
        if (now - this.lastNpcSoundTime > 800) {
          playSfx('npcApproach', { volume: 0.2 });
          this.lastNpcSoundTime = now;
        }
      }
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.add.text(30, 30, 'WASD / ARROWS TO MOVE | COLLIDE WITH NPC TO INTERACT', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#475569',
      letterSpacing: 1
    });

    this.lastSavedTime = 0;
    this.lastLoggedCell = null;
    this.lastValidPosition = { x: this.player.x, y: this.player.y };
    this.lastMissionOneCell = null;
    this.lastFootstepTime = 0;
    this.lastNpcSoundTime = 0;

    // Surface every chapter's own mission briefing when its map is ready.
    // Some chapters use a guardian as the opener, so fall back to the first
    // chapter NPC when a dedicated mission giver is not present.
    const briefingNpc = this.npcsData.find((npc) => npc.npc_type === 'mission_giver') || this.npcsData[0];
    if (briefingNpc) {
      this.time.delayedCall(150, () => {
        EventBus.emit('npc-overlap-start', { npc: briefingNpc, isIntro: true });
      });
    }
  }

  update(time) {
    const speed = 200;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.setVelocityY(speed);
    }

    const isMoving = this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0;
    if (isMoving && time - this.lastFootstepTime > 320) {
      playSfx('footstep', { volume: 0.1 });
      this.lastFootstepTime = time;
    }

    if (this.usesGuidedMathPath()) {
      const pathPosition = this.getNearestMissionOnePathPosition(this.player.x, this.player.y);
      if (pathPosition.distance <= 24) {
        this.lastValidPosition = { x: this.player.x, y: this.player.y };
      } else {
        this.player.setPosition(pathPosition.x, pathPosition.y);
        this.player.setVelocity(0);
        this.lastValidPosition = { x: pathPosition.x, y: pathPosition.y };
      }

      const currentCell = this.logCurrentCell();

      if (this.isMissionOneMath() && currentCell?.label === 'R7C4' && this.lastMissionOneCell !== 'R7C4') {
        const missionIntroNpc = {
          ...MISSION_ONE_NPCS[0],
          id: 'mission-one-intro',
        };

        EventBus.emit('npc-overlap-start', { npc: missionIntroNpc, isIntro: true });
      }

      this.lastMissionOneCell = currentCell?.label || null;
    } else {
      this.logCurrentCell();
    }

    if (this.activeInteraction) {
      const npcSprite = this.npcMap.get(this.activeInteraction.id);
      if (npcSprite) {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          npcSprite.x,
          npcSprite.y
        );
        if (distance > 50) {
          EventBus.emit('npc-overlap-end');
          this.activeInteraction = null;
        }
      }
    }

    if (time - this.lastSavedTime > 5000) {
      const posString = `${Math.round(this.player.x)},${Math.round(this.player.y)}`;
      EventBus.emit('save-checkpoint', { position: posString });
      this.lastSavedTime = time;
    }
  }

  getNearestMissionOnePathPosition(x, y) {
    let nearest = null;

    for (let index = 0; index < MISSION_ONE_PATH_POINTS.length - 1; index += 1) {
      const start = MISSION_ONE_PATH_POINTS[index];
      const end = MISSION_ONE_PATH_POINTS[index + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const lengthSq = dx * dx + dy * dy || 1;
      const t = Phaser.Math.Clamp(((x - start.x) * dx + (y - start.y) * dy) / lengthSq, 0, 1);
      const projectedX = start.x + t * dx;
      const projectedY = start.y + t * dy;
      const distance = Phaser.Math.Distance.Between(x, y, projectedX, projectedY);

      if (!nearest || distance < nearest.distance) {
        nearest = { x: projectedX, y: projectedY, distance };
      }
    }

    return nearest || { x: MISSION_ONE_START.x, y: MISSION_ONE_START.y, distance: 0 };
  }
}
