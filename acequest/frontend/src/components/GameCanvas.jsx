import React, { useEffect, useRef } from 'react';
import { startPhaserGame } from '../game/PhaserConfig';
import { EventBus } from '../game/EventBus';

export default function GameCanvas({ chapterId, chapter, heroSkin, npcs, checkpointPos, onNpcOverlapStart, onNpcOverlapEnd, onMissionIntroTrigger, onSaveCheckpoint }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      // Initialize Phaser game
      gameRef.current = startPhaserGame(
        containerRef.current,
        chapterId,
        chapter,
        heroSkin,
        npcs,
        checkpointPos
      );

      // EventBus listeners
      EventBus.on('npc-overlap-start', onNpcOverlapStart);
      EventBus.on('npc-overlap-end', onNpcOverlapEnd);
      EventBus.on('mission-intro-trigger', onMissionIntroTrigger);
      EventBus.on('save-checkpoint', onSaveCheckpoint);
    }

    return () => {
      // Clean up event listeners
      EventBus.off('npc-overlap-start', onNpcOverlapStart);
      EventBus.off('npc-overlap-end', onNpcOverlapEnd);
      EventBus.off('mission-intro-trigger', onMissionIntroTrigger);
      EventBus.off('save-checkpoint', onSaveCheckpoint);

      // Destroy Phaser game instance
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [chapterId, chapter, heroSkin, npcs, checkpointPos, onNpcOverlapStart, onNpcOverlapEnd, onMissionIntroTrigger, onSaveCheckpoint]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-teal/20 shadow-2xl bg-[#0f172a] glow-teal">
      <div 
        ref={containerRef} 
        id="phaser-game-container" 
        className="w-[800px] h-[600px] mx-auto"
      />
    </div>
  );
}
