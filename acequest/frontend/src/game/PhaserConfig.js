import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

export const getPhaserConfig = (parent, chapterId, chapter, heroSkin, npcs, checkpointPos) => {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: parent,
    audio: {
      noAudio: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [GameScene],
    callbacks: {
      preBoot: (game) => {
        // Expose configuration variables
        game.registry.set('chapterId', chapterId);
        game.registry.set('chapter', chapter);
        game.registry.set('heroSkin', heroSkin);
        game.registry.set('npcs', npcs);
        game.registry.set('checkpointPos', checkpointPos);
      },
    },
  };
};

export const startPhaserGame = (parent, chapterId, chapter, heroSkin, npcs, checkpointPos) => {
  const config = getPhaserConfig(parent, chapterId, chapter, heroSkin, npcs, checkpointPos);
  const game = new Phaser.Game(config);
  
  // Pass dynamic parameters to scene once Booted/Created
  game.events.once('ready', () => {
    game.scene.start('GameScene', {
      chapterId,
      chapter,
      heroSkin,
      npcs,
      checkpointPos
    });
  });

  return game;
};
