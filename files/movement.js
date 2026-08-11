/**
 * ============================================
 * AceQuest: Agent Ragam — movement.js
 * Character Movement (Three.js, top-down 2.5D)
 * ============================================
 *
 * Handles:
 * - Keyboard input (WASD / Arrow Keys)
 * - Sprite-based player movement on an XZ plane
 * - Walking animation frame switching (via sprite sheet textures)
 * - Collision detection against a simple tile-based collision map
 * - Camera following
 */

import * as THREE from 'three';

const MOVE_SPEED = 4.0; // units per second
const TILE_SIZE = 1.0;

// Direction enum
export const Direction = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

/**
 * PlayerController manages the player's Three.js mesh, movement,
 * animation state, and collision checks against the active map.
 */
export class PlayerController {
  /**
   * @param {THREE.Scene} scene
   * @param {Object} textures - map of direction -> THREE.Texture[] (animation frames)
   *   e.g. { down: [tex0, tex1, tex2, tex3], up: [...], left: [...], right: [...], idle: [tex0, tex1] }
   * @param {Object} [options]
   * @param {number} [options.x=0]
   * @param {number} [options.z=0]
   * @param {Function} [options.onTileEnter] - callback(tileX, tileZ) when player moves to a new tile
   */
  constructor(scene, textures, options = {}) {
    this.scene = scene;
    this.textures = textures;

    this.position = new THREE.Vector3(options.x ?? 0, 0.01, options.z ?? 0);
    this.facing = Direction.DOWN;
    this.isMoving = false;

    this.animFrame = 0;
    this.animTimer = 0;
    this.animFrameDuration = 0.12; // seconds per frame

    this.lastTile = { x: null, z: null };
    this.onTileEnter = options.onTileEnter || null;

    // Collision map: 2D array, 1 = blocked, 0 = walkable
    this.collisionMap = options.collisionMap || null;
    this.collisionOrigin = options.collisionOrigin || { x: 0, z: 0 };

    this._buildMesh();
  }

  _buildMesh() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: this.textures.down[0],
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2; // lay flat for top-down view; remove if using billboard sprites
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  /**
   * Call every frame from the main render loop.
   * @param {number} delta - seconds since last frame
   * @param {Object} input - { up, down, left, right } booleans
   */
  update(delta, input) {
    let dx = 0;
    let dz = 0;
    let newFacing = this.facing;

    if (input.up) {
      dz -= 1;
      newFacing = Direction.UP;
    } else if (input.down) {
      dz += 1;
      newFacing = Direction.DOWN;
    } else if (input.left) {
      dx -= 1;
      newFacing = Direction.LEFT;
    } else if (input.right) {
      dx += 1;
      newFacing = Direction.RIGHT;
    }

    this.isMoving = dx !== 0 || dz !== 0;
    this.facing = newFacing;

    if (this.isMoving) {
      const length = Math.sqrt(dx * dx + dz * dz);
      dx = (dx / length) * MOVE_SPEED * delta;
      dz = (dz / length) * MOVE_SPEED * delta;

      const nextX = this.position.x + dx;
      const nextZ = this.position.z + dz;

      // Check collision separately per axis for smoother wall-sliding
      if (!this._isBlocked(nextX, this.position.z)) {
        this.position.x = nextX;
      }
      if (!this._isBlocked(this.position.x, nextZ)) {
        this.position.z = nextZ;
      }

      this.mesh.position.copy(this.position);

      this._checkTileChange();
    }

    this._updateAnimation(delta);
  }

  /**
   * Checks the collision map for a blocked tile at the given world position.
   */
  _isBlocked(worldX, worldZ) {
    if (!this.collisionMap) return false;

    const tileX = Math.floor(worldX - this.collisionOrigin.x);
    const tileZ = Math.floor(worldZ - this.collisionOrigin.z);

    const row = this.collisionMap[tileZ];
    if (!row) return true; // out of bounds = blocked
    const cell = row[tileX];
    if (cell === undefined) return true;

    return cell === 1;
  }

  /**
   * Fires onTileEnter callback whenever the player crosses into a new tile.
   * Useful for triggering NPC proximity checks, checkpoint zones, etc.
   */
  _checkTileChange() {
    const tileX = Math.floor(this.position.x / TILE_SIZE);
    const tileZ = Math.floor(this.position.z / TILE_SIZE);

    if (tileX !== this.lastTile.x || tileZ !== this.lastTile.z) {
      this.lastTile = { x: tileX, z: tileZ };
      if (this.onTileEnter) {
        this.onTileEnter(tileX, tileZ);
      }
    }
  }

  /**
   * Cycles through animation frames for the current facing direction.
   * Falls back to idle frames when not moving.
   */
  _updateAnimation(delta) {
    this.animTimer += delta;

    const frameSet = this.isMoving
      ? this.textures[this.facing]
      : this.textures.idle || this.textures[this.facing];

    if (!frameSet || frameSet.length === 0) return;

    if (this.animTimer >= this.animFrameDuration) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % frameSet.length;
      this.mesh.material.map = frameSet[this.animFrame];
      this.mesh.material.needsUpdate = true;
    }
  }

  /**
   * Plays a one-shot reaction animation (e.g. victory or hurt pose).
   * @param {THREE.Texture[]} frames
   * @param {number} durationSeconds
   * @returns {Promise<void>}
   */
  playReaction(frames, durationSeconds = 1.0) {
    return new Promise((resolve) => {
      let elapsed = 0;
      let frameIndex = 0;
      const frameDuration = durationSeconds / frames.length;

      const tick = (delta) => {
        elapsed += delta;
        const targetFrame = Math.min(
          Math.floor(elapsed / frameDuration),
          frames.length - 1
        );
        if (targetFrame !== frameIndex) {
          frameIndex = targetFrame;
          this.mesh.material.map = frames[frameIndex];
          this.mesh.material.needsUpdate = true;
        }
        if (elapsed >= durationSeconds) {
          resolve();
          return false; // stop ticking
        }
        return true; // keep ticking
      };

      this._reactionTick = tick;
    });
  }

  /** Returns the current tile coordinates (integer). */
  getTilePosition() {
    return {
      x: Math.floor(this.position.x / TILE_SIZE),
      z: Math.floor(this.position.z / TILE_SIZE),
    };
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

/**
 * Sets up keyboard listeners for WASD + Arrow Keys.
 * Returns an input state object that is mutated in place,
 * plus a cleanup function.
 *
 * @returns {{ input: {up:boolean,down:boolean,left:boolean,right:boolean,interact:boolean}, cleanup: Function }}
 */
export function createKeyboardInput() {
  const input = { up: false, down: false, left: false, right: false, interact: false };

  const keyMap = {
    KeyW: 'up',
    ArrowUp: 'up',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
    KeyE: 'interact',
    Space: 'interact',
  };

  const onKeyDown = (e) => {
    const action = keyMap[e.code];
    if (action) input[action] = true;
  };

  const onKeyUp = (e) => {
    const action = keyMap[e.code];
    if (action) input[action] = false;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  const cleanup = () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };

  return { input, cleanup };
}

/**
 * Smoothly follows the player with the camera (top-down or angled view).
 * Call every frame after player.update().
 *
 * @param {THREE.Camera} camera
 * @param {PlayerController} player
 * @param {Object} [options]
 * @param {number} [options.height=6] - camera height above player
 * @param {number} [options.distance=4] - camera distance behind player (for angled view)
 * @param {number} [options.smoothing=0.1] - lerp factor (0-1)
 */
export function updateCameraFollow(camera, player, options = {}) {
  const height = options.height ?? 6;
  const distance = options.distance ?? 4;
  const smoothing = options.smoothing ?? 0.1;

  const targetPos = new THREE.Vector3(
    player.position.x,
    height,
    player.position.z + distance
  );

  camera.position.lerp(targetPos, smoothing);
  camera.lookAt(player.position.x, 0, player.position.z);
}

/**
 * Loads animation frame textures for all 4 directions + idle from
 * a manifest of file paths (see assetManifest.js).
 *
 * @param {THREE.TextureLoader} loader
 * @param {Object} paths - { down: [...], up: [...], left: [...], right: [...], idle: [...] }
 * @returns {Promise<Object>} resolves to { down: THREE.Texture[], up: [...], ... }
 */
export async function loadDirectionalTextures(loader, paths) {
  const result = {};

  for (const [direction, framePaths] of Object.entries(paths)) {
    result[direction] = await Promise.all(
      framePaths.map(
        (path) =>
          new Promise((resolve, reject) => {
            loader.load(
              path,
              (texture) => {
                texture.magFilter = THREE.NearestFilter; // crisp pixel art
                texture.minFilter = THREE.NearestFilter;
                resolve(texture);
              },
              undefined,
              reject
            );
          })
      )
    );
  }

  return result;
}

/**
 * Builds a simple collision map from a 2D array of tile type strings.
 * 'X' = blocked, '.' = walkable. Useful for quickly defining chapter maps.
 *
 * @param {string[]} rows - array of strings, each character is a tile
 * @returns {number[][]} collision map (1 = blocked, 0 = walkable)
 */
export function buildCollisionMapFromAscii(rows) {
  return rows.map((row) =>
    row.split('').map((char) => (char === 'X' ? 1 : 0))
  );
}
