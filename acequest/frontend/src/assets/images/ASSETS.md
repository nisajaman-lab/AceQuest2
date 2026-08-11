# Image Assets

This folder stores image assets for the AceQuest frontend.

Base folder:

```text
src/assets/images
```

## How To Use In React

Import an image from this folder:

```jsx
import logo from "../assets/images/logos/logo.png";

export default function Example() {
  return <img src={logo} alt="AceQuest logo" />;
}
```

For files inside `src/pages`, use:

```jsx
import logo from "../assets/images/logos/logo.png";
```

For files inside deeper folders, adjust the `../` path as needed.

## Folder Guide

- `backgrounds` - Screen backgrounds, arenas, chapter scenes, loading/title images
- `badges` - Achievement and subject badges
- `bosses` - Boss character images and attack variants
- `crystals` - Realm or chapter crystal assets
- `effects` - Attack, impact, beam, crack, and erase effects
- `icons` - Subject icons, action icons, realm lock icon, factor icons, and status icons
- `logos` - AceQuest and related logo files
- `maps` - Gameplay maps, arenas, routes, and diagram maps
- `maps_misc` - Realm map images and world map images
- `misc` - Object props, diagrams, labels, warning assets, UI tags, and world objects
- `npc` - NPC character sprites and variations
- `portraits` - NPC and player portrait images
- `sprites` - Player skins and movement sprites for agent animations
- `tilesets` - Tileset images for map/game scenes
- `ui assets` - UI buttons, dialogue boxes, HUD elements, and interface components

## Asset Inventory

### Backgrounds

Complete list of all background images:

- `backgrounds/bg-agrifood-lab.png`
- `backgrounds/bg-broken-city-arena.png`
- `backgrounds/bg-chapter-complete.jpg`
- `backgrounds/bg-coastal-cliffs.png.jpg`
- `backgrounds/bg-counter-urban-suburb.png`
- `backgrounds/bg-dried-paddy-fields.png`
- `backgrounds/bg-earthquake-epicentre.png`
- `backgrounds/bg-empty-sea.png`
- `backgrounds/bg-erupting-volcano.png`
- `backgrounds/bg-expanding-slum.png`
- `backgrounds/bg-flood-command-centre.png.jpg`
- `backgrounds/bg-floodplain-village.png.jpg`
- `backgrounds/bg-forgetter-void.jpg`
- `backgrounds/bg-foundling-ruins.png`
- `backgrounds/bg-gameover.jpg`
- `backgrounds/bg-ghost-fields.jfif`
- `backgrounds/bg-jumbled-city.png`
- `backgrounds/bg-loading-screen.jpg`
- `backgrounds/bg-market-town-empty.png`
- `backgrounds/bg-megacity-overcrowded.png`
- `backgrounds/bg-migration-docks.png`
- `backgrounds/bg-plate-boundary-trenches.png`
- `backgrounds/bg-pyramid-tower.png`
- `backgrounds/bg-quake-lord-arena.png`
- `backgrounds/bg-river-middle-course.png.jpg`
- `backgrounds/bg-river-mouth-delta.png.jpg`
- `backgrounds/bg-river-source-mountain.png`
- `backgrounds/bg-title-screen.jpg`
- `backgrounds/bg-tsa-hq.jpg`
- `backgrounds/bg-tsunami-shore.png`

### Badges

Achievement and subject badges:

- `badges/badge-chapter-complete.jpg`
- `badges/badge-elite-agent.jpg`
- `badges/badge-first-mission.jpg`
- `badges/badge-perfect-score.jpg`
- `badges/badge-streak-7.jpg`
- `badges/badge-subject-cs.jpg`
- `badges/badge-subject-english.jpg`
- `badges/badge-subject-math.jpg`
- `badges/badge-subject-science.jpg`

### Bosses

Boss character sprites and attack animations:

- `bosses/boss-census-attack.png`
- `bosses/boss-census-phantom.png`
- `bosses/boss-quake-lord-attack-qquake.png`
- `bosses/boss-quake-lord-attack-volcano.png`
- `bosses/boss-quake-lord.png`
- `bosses/hunger-titan-attack.png`
- `bosses/hunger-titan.png`
- `bosses/urban-colossus-attack.png`
- `bosses/urban-colossus.png`

### Crystals

Realm and chapter crystal assets:

- `crystals/crystal-food.png`
- `crystals/crystal-population.png`
- `crystals/crystal-settlement.png`
- `crystals/crystal-tectonics.png`

### Effects

Visual effects for attacks, impacts, and environmental effects:

- `effects/attack-effect.png`
- `effects/fx-data-beam.png`
- `effects/fx-erase-effect.png`
- `effects/fx-ground-crack.png`
- `effects/fx-lava-burst.png`
- `effects/fx-rubble-impact.png`
- `effects/fx-village-impact.png`

### Icons

Subject, action, status, and factor icons:

- `icons/commerce-icon.png`
- `icons/comp-sci-icon.png`
- `icons/eng-icon.png`
- `icons/geo-icon.png`
- `icons/history-icon.png`
- `icons/icon-badge.png.png`
- `icons/icon-coins.png.png`
- `icons/icon-correct.png.png`
- `icons/icon-exp.png.png`
- `icons/icon-farming-steps.png`
- `icons/icon-pull-factor-education.png`
- `icons/icon-pull-factor-job.png`
- `icons/icon-pull-factor-safety.png`
- `icons/icon-push-factor-drought.png`
- `icons/icon-push-factor-poverty.png`
- `icons/icon-push-factor-war.png`
- `icons/icon-streak.png.png`
- `icons/icon-tsunami-action-correct.png`
- `icons/icon-tsunami-action-inland.png`
- `icons/icon-wrong.png.png`
- `icons/locked-realm-icon.png`
- `icons/malay-icon.png`
- `icons/math-icon.png`
- `icons/obj-tsunami-action-wrong-watch.png`
- `icons/sci-icon.png`

### Logos

AceQuest branding and organization logos:

- `logos/logo.png`
- `logos/the-forgetter-logo.png`
- `logos/tsa-logo-v2.png`
- `logos/tsa-logo.png`

### Maps

Gameplay maps, arenas, and diagram maps:

- `maps/battle-arena.png`
- `maps/boss-census-hall-arena.png`
- `maps/evacuation-route-map.png`
- `maps/map-southeast-asia-rice.png`
- `maps/obj-city-map-after.png`
- `maps/obj-city-map-before.png`
- `maps/obj-fishing-zone-map.png`

### Maps Misc

Realm selector maps and world map:

- `maps_misc/commerce-realm.png`
- `maps_misc/comp-sci-realm.png`
- `maps_misc/eng-realm.png`
- `maps_misc/geo-realm.png`
- `maps_misc/history-realm.png`
- `maps_misc/math-realm.png`
- `maps_misc/maths map.png`
- `maps_misc/sci-realm.png`
- `maps_misc/world-map.png`

### Misc

World objects, props, diagrams, and environmental assets:

- `misc/fx-rice-sprout.png`
- `misc/obj-aquaculture-tank-broken.png`
- `misc/obj-aquaculture-tank-fish.png`
- `misc/obj-earth-cross-section.png`
- `misc/obj-hdi-formula-board.png`
- `misc/obj-plate-arrows-convergent.png`
- `misc/obj-plate-arrows-divergent.png`
- `misc/obj-plate-transform.png`
- `misc/obj-population-graph-billboard.png`
- `misc/obj-population-pyramid-constrictive.png`
- `misc/obj-population-pyramid-expansive.png`
- `misc/obj-population-pyramid-stationary.png`
- `misc/obj-push-pull-board.png`
- `misc/obj-pyramid-blocks-set.png`
- `misc/obj-richter-scale-meter.png`
- `misc/obj-seismograph-machine.png`
- `misc/obj-site-factor-icons.png`
- `misc/obj-tsunami-wave-approaching.png`
- `misc/obj-tsunami-wave-diagram.png`
- `misc/obj-volcanic eruption.png`
- `misc/obj-volcanic-bomb.png`
- `misc/obj-volcano-ash-cloud.png`
- `misc/obj-volcano-gas-emission.png`
- `misc/obj-volcano-lava-flow.png`
- `misc/obj-volcano-pyroclastic-flow.jfif`
- `misc/obj-warning-steps-cards.png`
- `misc/obj-zonning-labels.png`
- `misc/ui-label-tag-blank.png`
- `misc/warning-siren-tower.png`

### NPC

Non-player character sprites and variations:

- `npc/npc-azri-planner.png`
- `npc/npc-checkpoint-geographer.png`
- `npc/npc-checkpoint-officer.png`
- `npc/npc-checkpoint.png.png`
- `npc/npc-commander.png.png`
- `npc/npc-dr-agro.png`
- `npc/npc-dr-siti.png`
- `npc/npc-dr-tectonica.png`
- `npc/npc-fisher-minah.jfif`
- `npc/npc-friendly-bruneian.png.png`
- `npc/npc-haji-daud.png`
- `npc/npc-hint-lady.png.png`
- `npc/npc-ibrabim-migrant.png`
- `npc/npc-maya-slum.png`
- `npc/npc-mayor-harith.png`
- `npc/npc-merchant-checkpoint.png`
- `npc/npc-merchant-male.png`
- `npc/npc-old-settler.png`
- `npc/npc-professor-zara.png`
- `npc/npc-rescued-villager.png`
- `npc/npc-seismologist-fatimah.png`
- `npc/npc-shopkeeper.png.png`
- `npc/npc-student-classmate.png.png`
- `npc/npc-transport-ofiicer.png`
- `npc/npc-village-elder-tsunami.png`
- `npc/npc-volcanologist-razak.png`

### Portraits

Character portrait images for dialogues and UI:

- `portraits/agent-ragam-portrait.png`
- `portraits/npc-azri-portrait.png`
- `portraits/npc-checkpoint-portrait.png`
- `portraits/npc-commander-potraits.png`
- `portraits/npc-dr-agro-portrait.png`
- `portraits/npc-dr-siti-portrait.png`
- `portraits/npc-dr-tectonica-portrait.png`
- `portraits/npc-fisher-minah-portarit.png`
- `portraits/npc-haji-dauh-portrait.png`
- `portraits/npc-ibrahim-portrait.png`
- `portraits/npc-maya-portrait.png`
- `portraits/npc-mayor-portrait.png`
- `portraits/npc-merchant-portrait-male.png`
- `portraits/npc-merchant-portrait.png`
- `portraits/npc-old-settler-portratit.png`
- `portraits/npc-potraits.png.png`
- `portraits/npc-prof-zara-portrait.png`
- `portraits/npc-sesimologist-fatimah-portrait.png`
- `portraits/npc-shopkeeper-potraits.png`
- `portraits/npc-transport-officer-portrait.png`
- `portraits/npc-village-elder-portrait.png`
- `portraits/npc-volcanologist-razak-portrait.png`

### Sprites

Player character skins and movement animations:

- `sprites/agent-ragam-default.png`
- `sprites/agent-ragam-hurt.jpg`
- `sprites/agent-ragam-idle.png`
- `sprites/agent-ragam-victory.jpg`
- `sprites/agent-ragam-victory.png`
- `sprites/agent-ragam-walk-down.png`
- `sprites/agent-ragam-walk-left.png`
- `sprites/agent-ragam-walk-right.png`
- `sprites/skin-elite-agent.jpg`
- `sprites/skin-history-explorer.jpg`
- `sprites/skin-math-master.jpg`
- `sprites/skin-science-lab.jpg`
- `sprites/skin-tech-coder.jpg`

### Tilesets

Game world tileset graphics:

- `tilesets/tileset-academy.png`

### UI Assets

User interface elements including buttons, dialogue boxes, and HUD components:

- `ui assets/btn-completed.png.png`
- `ui assets/btn-hint.png.png`
- `ui assets/btn-locked.png.png`
- `ui assets/btn-play.png.png`
- `ui assets/dialogue-box-question.png.png`
- `ui assets/dialogue-box.png.png`
- `ui assets/hud-coinicon.png.png`
- `ui assets/hud-expbar.png.png`
- `ui assets/hud-healthbar.png.png`
- `ui assets/hud-level-badge.png.png`
- `ui assets/hud-portrait-frame.png.png`

## Usage Examples

### Importing in Components

```jsx
// For icons
import geoIcon from '../assets/images/icons/geo-icon.png';

// For backgrounds
import background from '../assets/images/backgrounds/bg-title-screen.jpg';

// For NPC sprites
import npcFisher from '../assets/images/npc/npc-fisher-minah.jfif';

// For UI elements
import playButton from '../assets/images/ui assets/btn-play.png.png';
```

### Using with Phaser

For game scenes in [PhaserConfig.js](../game/PhaserConfig.js):

```javascript
// Load sprite assets
this.load.image('bg-volcano', require('../assets/images/backgrounds/bg-erupting-volcano.png'));
this.load.spritesheet('agent-ragam', require('../assets/images/sprites/agent-ragam-walk-down.png'), 
  { frameWidth: 32, frameHeight: 32 }
);
```

## Asset Organization Notes

- Keep filenames lowercase where possible
- Avoid spaces in new filenames; use hyphens instead (e.g., `btn-play.png` not `btn play.png`)
- Some files have double extensions like `.png.png` or `.png.jpg` — these should be renamed when refactoring
- Update this file when adding or removing assets
- Total asset count: **150+** images across all categories
- File formats supported: PNG, JPG, JFIF

## Asset Categorization by Function

### Character Assets
- **Sprites**: Player movement, states, and skins
- **Portraits**: Character dialogue/UI display
- **NPC**: In-game NPC character sprites

### Environmental Assets
- **Backgrounds**: Scene backdrops and arena environments
- **Maps**: Gameplay and world maps
- **Tilesets**: Interactive world terrain and structures

### Game Mechanics
- **Bosses**: Boss enemy sprites and attack animations
- **Effects**: Combat and environment visual effects
- **Crystals**: Realm completion/progression markers
- **Badges**: Achievement and subject mastery indicators

### UI/UX
- **Icons**: Subject, status, and action indicators
- **UI Assets**: Buttons, HUD elements, dialogue components
- **Logos**: Branding and organization assets

## File Format Standards

| Format | Usage |
|--------|-------|
| PNG | Primary format for most assets, supports transparency |
| JPG | Compressed backgrounds and complex images |
| JFIF | Alternative format for specific character assets |

## Next Steps

- Standardize double-extension filenames in icons, npc, portraits, and ui assets folders
- Consider organizing UI assets into semantic subfolders (buttons, hud, dialogue)
- Create sprite animation metadata files for complex characters
- Document recommended resolution standards for each asset category
