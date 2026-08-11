/**
 * ============================================
 * AceQuest: Agent Ragam — npcInteraction.js
 * NPC Dialogue
 * ============================================
 *
 * Handles:
 * - Loading NPC sprites into the Three.js scene
 * - Proximity-based interaction prompts ("Press E to talk")
 * - Dialogue sequencing (multi-line, typewriter effect)
 * - Triggering questions / hints / shop / checkpoint flows from dialogue
 */

import * as THREE from 'three';

const INTERACTION_RADIUS = 1.5; // world units

/**
 * Represents a single NPC placed in a chapter map.
 */
export class NPC {
  /**
   * @param {THREE.Scene} scene
   * @param {Object} config
   * @param {string} config.id - unique NPC id, e.g. "npc-village-elder"
   * @param {string} config.name - display name
   * @param {'mission_giver'|'hint'|'shop'|'guardian'|'friendly'|'checkpoint'} config.npcType
   * @param {THREE.Texture} config.texture - sprite texture
   * @param {string} [config.portraitUrl] - path to portrait image for dialogue box
   * @param {{x:number, z:number}} config.position
   * @param {Array} config.dialogues - array of dialogue entries (see DialogueManager)
   */
  constructor(scene, config) {
    this.scene = scene;
    this.id = config.id;
    this.name = config.name;
    this.npcType = config.npcType;
    this.portraitUrl = config.portraitUrl || null;
    this.position = new THREE.Vector3(config.position.x, 0.01, config.position.z);
    this.dialogues = config.dialogues || [];
    this.hasInteracted = false;

    this._buildMesh(config.texture);
  }

  _buildMesh(texture) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.copy(this.position);
    this.mesh.userData.npcId = this.id;
    this.scene.add(this.mesh);
  }

  /**
   * Returns the distance from a given world position to this NPC.
   * @param {THREE.Vector3} worldPos
   */
  distanceTo(worldPos) {
    return this.position.distanceTo(worldPos);
  }

  /**
   * Picks the appropriate dialogue entry based on trigger condition
   * and current game state.
   *
   * @param {string} triggerCondition - 'on_approach' | 'pre_question' | 'post_correct' | 'post_wrong'
   * @returns {Object|null}
   */
  getDialogue(triggerCondition = 'on_approach') {
    const matches = this.dialogues
      .filter((d) => d.trigger_condition === triggerCondition)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return matches.length > 0 ? matches[0] : null;
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

/**
 * NPCManager tracks all NPCs in the current scene, handles proximity
 * detection against the player, and surfaces interaction prompts.
 */
export class NPCManager {
  /**
   * @param {Object} [options]
   * @param {Function} [options.onProximityEnter] - callback(npc) when player is in range
   * @param {Function} [options.onProximityExit] - callback(npc) when player leaves range
   * @param {Function} [options.onInteract] - callback(npc, dialogue) when player presses interact
   */
  constructor(options = {}) {
    this.npcs = [];
    this.nearbyNpc = null;
    this.onProximityEnter = options.onProximityEnter || (() => {});
    this.onProximityExit = options.onProximityExit || (() => {});
    this.onInteract = options.onInteract || (() => {});
  }

  addNPC(npc) {
    this.npcs.push(npc);
    return npc;
  }

  removeNPC(npcId) {
    const idx = this.npcs.findIndex((n) => n.id === npcId);
    if (idx >= 0) {
      this.npcs[idx].dispose();
      this.npcs.splice(idx, 1);
    }
  }

  /**
   * Call every frame with the player's current world position and
   * whether the interact key was just pressed.
   *
   * @param {THREE.Vector3} playerPosition
   * @param {boolean} interactPressed
   */
  update(playerPosition, interactPressed) {
    let closest = null;
    let closestDist = Infinity;

    for (const npc of this.npcs) {
      const dist = npc.distanceTo(playerPosition);
      if (dist <= INTERACTION_RADIUS && dist < closestDist) {
        closest = npc;
        closestDist = dist;
      }
    }

    if (closest !== this.nearbyNpc) {
      if (this.nearbyNpc) this.onProximityExit(this.nearbyNpc);
      if (closest) this.onProximityEnter(closest);
      this.nearbyNpc = closest;
    }

    if (interactPressed && this.nearbyNpc) {
      this.triggerInteraction(this.nearbyNpc);
    }
  }

  /**
   * Manually triggers an interaction with a specific NPC
   * (e.g. from a quest script rather than player input).
   *
   * @param {NPC} npc
   * @param {string} [triggerCondition='on_approach']
   */
  triggerInteraction(npc, triggerCondition = 'on_approach') {
    const dialogue = npc.getDialogue(triggerCondition);
    this.onInteract(npc, dialogue);
    npc.hasInteracted = true;
  }

  getNearbyNpc() {
    return this.nearbyNpc;
  }

  disposeAll() {
    this.npcs.forEach((npc) => npc.dispose());
    this.npcs = [];
    this.nearbyNpc = null;
  }
}

/**
 * DialogueManager drives the typewriter-style text reveal and
 * multi-line dialogue sequencing shown in the DialogBox UI component.
 *
 * Usage pattern:
 *   const dm = new DialogueManager({ onUpdate: (text, done) => setDialogueText(text) });
 *   dm.start(['Line one...', 'Line two...'], () => console.log('dialogue finished'));
 *   // each frame:
 *   dm.tick(delta);
 *   // on "continue" button press:
 *   dm.advance();
 */
export class DialogueManager {
  /**
   * @param {Object} options
   * @param {Function} options.onUpdate - callback(currentText, isLineComplete)
   * @param {number} [options.charsPerSecond=30]
   */
  constructor(options = {}) {
    this.onUpdate = options.onUpdate || (() => {});
    this.charsPerSecond = options.charsPerSecond || 30;

    this.lines = [];
    this.currentLineIndex = 0;
    this.currentText = '';
    this.charProgress = 0;
    this.isActive = false;
    this.onComplete = null;
  }

  /**
   * Starts a new dialogue sequence.
   * @param {string[]} lines
   * @param {Function} [onComplete] - called after the last line is dismissed
   */
  start(lines, onComplete) {
    this.lines = lines;
    this.currentLineIndex = 0;
    this.currentText = '';
    this.charProgress = 0;
    this.isActive = true;
    this.onComplete = onComplete || null;
    this._emit();
  }

  /** Call every frame with delta time in seconds. */
  tick(delta) {
    if (!this.isActive) return;

    const line = this.lines[this.currentLineIndex];
    if (!line) return;

    if (this.charProgress < line.length) {
      this.charProgress += this.charsPerSecond * delta;
      const visibleChars = Math.min(Math.floor(this.charProgress), line.length);
      this.currentText = line.substring(0, visibleChars);
      this._emit();
    }
  }

  /**
   * Advances to the next line, or completes the dialogue if on the last line.
   * If the current line hasn't finished typing, instead instantly completes it
   * (standard "tap to skip typing" behavior).
   */
  advance() {
    const line = this.lines[this.currentLineIndex];

    // If still typing, fast-forward to full line
    if (this.charProgress < line.length) {
      this.charProgress = line.length;
      this.currentText = line;
      this._emit();
      return;
    }

    // Move to next line
    if (this.currentLineIndex < this.lines.length - 1) {
      this.currentLineIndex += 1;
      this.currentText = '';
      this.charProgress = 0;
      this._emit();
    } else {
      this.isActive = false;
      if (this.onComplete) this.onComplete();
    }
  }

  isLineComplete() {
    const line = this.lines[this.currentLineIndex];
    return line ? this.charProgress >= line.length : true;
  }

  _emit() {
    this.onUpdate(this.currentText, this.isLineComplete());
  }
}

/**
 * Helper: builds NPC config objects from a chapter's NPC + dialogue data
 * (as returned by the backend `npcs` and `dialogues` tables).
 *
 * @param {Array} npcRecords - rows from `npcs` table joined with `dialogues`
 * @param {Object} textureMap - map of sprite_key -> THREE.Texture
 * @returns {Array} config objects ready for `new NPC(scene, config)`
 */
export function buildNpcConfigsFromData(npcRecords, textureMap) {
  return npcRecords.map((record) => ({
    id: `npc-${record.id}`,
    name: record.name,
    npcType: record.npc_type,
    texture: textureMap[record.sprite_key],
    portraitUrl: record.portrait_url || null,
    position: record.position || { x: 0, z: 0 },
    dialogues: record.dialogues || [],
  }));
}
