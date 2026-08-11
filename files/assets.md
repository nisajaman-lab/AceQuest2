# AceQuest: Agent Ragam — Asset Reference Guide
## Images & Sounds for AI Generation + Free Sources

---

## HOW TO USE THIS FILE

- **AI-Generated Images:** Use prompts below with Gemini / ChatGPT / DALL-E / Midjourney
- **Free Assets:** Download from Kenney.nl, OpenGameArt.org, Itch.io (free section)
- **Recommended Style:** Pixel art (16x16 or 32x32 tiles) OR stylized 2D cartoon (consistent art style throughout)
- **Recommended Palette:** Warm spy-themed tones — teal, gold, dark navy, crimson

---

## FOLDER STRUCTURE (Overview)

```
frontend/public/assets/
├── characters/
│   ├── agent-ragam/
│   ├── npcs/
│   └── guardians/
├── maps/
│   ├── tilesets/
│   └── tilemaps/
├── ui/
│   ├── icons/
│   ├── buttons/
│   ├── frames/
│   └── hud/
├── subjects/
│   ├── math/
│   ├── science/
│   ├── english/
│   ├── commerce/
│   ├── history/
│   ├── cs/
│   ├── geography/
│   └── malay/
├── badges/
├── skins/
├── cutscenes/
├── backgrounds/
├── logos/
└── sounds/
    ├── bgm/
    ├── sfx/
    └── ui/
```

---

## IMAGE FOLDER STRUCTURE (Full, with filenames)

This is the exact folder + filename structure for every IMAGE asset described in this document. Save each AI-generated image to the matching path/filename below — that way the file paths in the codebase will already line up with what's referenced.

```
frontend/public/assets/
│
├── characters/
│   ├── agent-ragam/
│   │   ├── agent-ragam-default.png
│   │   ├── agent-ragam-walk-down.png
│   │   ├── agent-ragam-walk-up.png
│   │   ├── agent-ragam-walk-left.png
│   │   ├── agent-ragam-walk-right.png
│   │   ├── agent-ragam-idle.png
│   │   ├── agent-ragam-victory.png
│   │   ├── agent-ragam-hurt.png
│   │   └── agent-ragam-portrait.png
│   │
│   ├── npcs/
│   │   ├── npc-commander.png
│   │   ├── npc-commander-portrait.png
│   │   ├── npc-hint-lady.png
│   │   ├── npc-hint-lady-portrait.png
│   │   ├── npc-shopkeeper.png
│   │   ├── npc-shopkeeper-portrait.png
│   │   ├── npc-checkpoint.png
│   │   ├── npc-checkpoint-portrait.png
│   │   ├── npc-friendly-bruneian.png
│   │   ├── npc-friendly-bruneian-portrait.png
│   │   ├── npc-student-classmate.png
│   │   └── npc-student-classmate-portrait.png
│   │
│   └── guardians/
│       ├── guardian-algebra.png
│       ├── guardian-molecule.png
│       ├── guardian-grammar.png
│       ├── guardian-cipher.png
│       └── guardian-forgetter.png
│
├── maps/
│   ├── tilesets/
│   │   ├── tileset-academy.png
│   │   ├── tileset-logic-realm.png
│   │   ├── tileset-discovery-realm.png
│   │   ├── tileset-language-realm.png
│   │   ├── tileset-commerce-realm.png
│   │   ├── tileset-history-realm.png
│   │   ├── tileset-tech-realm.png
│   │   ├── tileset-geo-realm.png
│   │   └── tileset-safehouse.png
│   │
│   └── tilemaps/
│       └── (JSON/Tiled map files go here — not images, generated later in Tiled Map Editor)
│
├── ui/
│   ├── icons/
│   │   ├── icon-correct.png
│   │   ├── icon-wrong.png
│   │   ├── icon-exp.png
│   │   ├── icon-coins.png
│   │   ├── icon-streak.png
│   │   └── icon-badge.png
│   │
│   ├── buttons/
│   │   ├── btn-play.png
│   │   ├── btn-locked.png
│   │   ├── btn-completed.png
│   │   └── btn-hint.png
│   │
│   ├── frames/
│   │   ├── dialogue-box.png
│   │   ├── dialogue-box-question.png
│   │   └── hud-portrait-frame.png
│   │
│   └── hud/
│       ├── hud-expbar.png
│       ├── hud-coinicon.png
│       ├── hud-healthbar.png
│       └── hud-level-badge.png
│
├── subjects/
│   ├── math/
│   │   ├── realm-icon-math.png
│   │   └── skin-math-master.png
│   │
│   ├── science/
│   │   ├── realm-icon-science.png
│   │   └── skin-science-lab.png
│   │
│   ├── english/
│   │   └── realm-icon-english.png
│   │
│   ├── commerce/
│   │   └── realm-icon-commerce.png
│   │
│   ├── history/
│   │   ├── realm-icon-history.png
│   │   └── skin-history-explorer.png
│   │
│   ├── cs/
│   │   ├── realm-icon-cs.png
│   │   └── skin-tech-coder.png
│   │
│   ├── geography/
│   │   └── realm-icon-geo.png
│   │
│   └── malay/
│       └── realm-icon-malay.png
│
├── badges/
│   ├── badge-chapter-complete.png
│   ├── badge-subject-math.png
│   ├── badge-subject-science.png
│   ├── badge-subject-english.png
│   ├── badge-subject-cs.png
│   ├── badge-perfect-score.png
│   ├── badge-streak-7.png
│   ├── badge-elite-agent.png
│   └── badge-first-mission.png
│
├── skins/
│   ├── skin-math-master.png        (also in subjects/math/)
│   ├── skin-science-lab.png        (also in subjects/science/)
│   ├── skin-history-explorer.png   (also in subjects/history/)
│   ├── skin-tech-coder.png         (also in subjects/cs/)
│   └── skin-elite-agent.png
│
├── cutscenes/
│   ├── bg-tsa-hq.png
│   ├── bg-forgetter-void.png
│   └── (additional cutscene panels can be added here as cutscene-01.png, cutscene-02.png, etc.)
│
├── backgrounds/
│   ├── bg-title-screen.png
│   ├── bg-loading-screen.png
│   ├── bg-chapter-complete.png
│   └── bg-gameover.png
│
├── world-map/
│   ├── worldmap-background.png
│   ├── realm-icon-math.png
│   ├── realm-icon-science.png
│   ├── realm-icon-english.png
│   ├── realm-icon-commerce.png
│   ├── realm-icon-history.png
│   ├── realm-icon-cs.png
│   ├── realm-icon-geo.png
│   ├── realm-icon-malay.png
│   └── realm-icon-locked.png
│
└── logos/
    ├── logo-acequest.png
    ├── logo-tsa.png
    ├── logo-forgetter.png
    └── favicon.ico
```

### Notes on Duplicates
- `skin-*.png` files appear in both `subjects/<subject>/` (in-game skin shop preview tied to that subject) and `skins/` (central skin library used by the equip/inventory screen). Generate the image once and copy it into both locations, or reference a single shared path in code.
- `realm-icon-*.png` and `worldmap-background.png` are listed under `world-map/` as their canonical home — pick one location and reference it consistently in code.

### Generation Order Recommendation
1. **Logos & branding** (sets the visual identity/color palette for everything else)
2. **Agent Ragam sprites** (main character — defines the art style baseline)
3. **World map + realm icons** (subject selection screen — high visibility)
4. **Tilesets** (one per realm — needed before building maps in Tiled)
5. **NPCs + portraits**
6. **Guardians (mini-bosses)**
7. **UI elements** (buttons, icons, HUD, dialogue boxes)
8. **Badges**
9. **Skins**
10. **Backgrounds & cutscenes** (last, since these can reuse the established style)

---

## 1. CHARACTER ASSETS

### 1.1 Agent Ragam (Main Character)

| File | Description | AI Prompt |
|---|---|---|
| `agent-ragam-default.png` | Main sprite, front-facing | "Top-down 2D pixel art of a young teenage spy agent in a teal jacket with gold badge, Bruneian features, neutral expression, 32x32 pixels, transparent background" |
| `agent-ragam-walk-down.png` | Walking down spritesheet (4 frames) | "Pixel art sprite sheet of a teenage spy walking downward, 4 animation frames, teal jacket, 32x32 each frame, transparent background" |
| `agent-ragam-walk-up.png` | Walking up spritesheet | Same as above, facing up |
| `agent-ragam-walk-left.png` | Walking left spritesheet | Same as above, facing left |
| `agent-ragam-walk-right.png` | Walking right spritesheet | Same as above, facing right |
| `agent-ragam-idle.png` | Idle animation (2 frames) | "Pixel art idle animation of a spy agent, subtle breathing motion, 2 frames, 32x32, transparent background" |
| `agent-ragam-victory.png` | Victory pose | "Pixel art spy agent doing a thumbs-up victory pose, celebratory, teal and gold colors" |
| `agent-ragam-hurt.png` | Wrong answer reaction | "Pixel art spy agent looking shocked/frustrated, small explosion stars around head, 32x32" |
| `agent-ragam-portrait.png` | Large face portrait for dialogue | "2D cartoon portrait of a teenage Bruneian spy agent, teal uniform, confident smile, square crop 128x128" |

### 1.2 Skin Variants (Unlockable)

| File | Unlock Condition | AI Prompt |
|---|---|---|
| `skin-math-master.png` | Complete Mathematics | "Pixel art spy agent wearing a mathematics-themed outfit with equation patterns, calculator badge, same base pose" |
| `skin-science-lab.png` | Complete Science | "Pixel art spy agent in a lab coat over spy uniform, science goggles on head, beaker icon badge" |
| `skin-history-explorer.png` | Complete History | "Pixel art spy agent in explorer outfit with vintage map satchel, compass badge, adventure theme" |
| `skin-tech-coder.png` | Complete Computer Science | "Pixel art spy agent with holographic visor, circuit board patterns on jacket, glowing blue tech aesthetic" |
| `skin-elite-agent.png` | Reach Level 6 | "Pixel art spy agent in sleek all-black elite uniform with glowing gold accents, cape, crown badge" |

---

## 2. NPC ASSETS

### 2.1 NPC Sprites (Top-Down, 32x32)

| File | Character | AI Prompt |
|---|---|---|
| `npc-commander.png` | TSA Commander (mission giver) | "Top-down pixel art of a mature military commander in navy blue uniform with medals, serious expression, 32x32" |
| `npc-hint-lady.png` | Hint NPC (female scientist) | "Top-down pixel art of a friendly female scientist with glasses and lab coat, holding a clipboard, 32x32" |
| `npc-shopkeeper.png` | Shop NPC | "Top-down pixel art of a cheerful vendor NPC behind a counter, wearing an apron, holding coins, 32x32" |
| `npc-checkpoint.png` | Safehouse keeper | "Top-down pixel art of a calm agent guarding a glowing safe door, trench coat, 32x32" |
| `npc-friendly-bruneian.png` | Lore NPC (Bruneian elder) | "Top-down pixel art of a wise elderly man in traditional Bruneian attire (baju melayu), 32x32" |
| `npc-student-classmate.png` | Friendly student NPC | "Top-down pixel art of a teenage student in school uniform, holding books, friendly expression, 32x32" |

### 2.2 NPC Portraits (for Dialogue Box, 64x64 or 128x128)

Generate larger portrait versions of each NPC above by adding `"portrait style, 128x128, facing slightly right, detailed face"` to each prompt.

---

## 3. GUARDIAN (MINI-BOSS) ASSETS

| File | Subject | AI Prompt |
|---|---|---|
| `guardian-algebra.png` | Mathematics | "2D cartoon mini-boss character shaped like an X variable symbol, glowing equations floating around it, menacing but educational, 64x64 pixel art" |
| `guardian-molecule.png` | Science/Chemistry | "2D cartoon villain shaped like a giant molecule, red and purple, spinning electrons, angry eyes, 64x64 pixel art" |
| `guardian-grammar.png` | English | "2D cartoon antagonist that looks like a corrupted book with sharp teeth and glowing red text, 64x64 pixel art" |
| `guardian-cipher.png` | Computer Science | "2D cartoon boss made of corrupted code/binary, glitchy digital appearance, red scan lines, 64x64 pixel art" |
| `guardian-forgetter.png` | Final Boss | "2D cartoon final boss villain 'The Forgetter' — dark shadowy figure with an eraser weapon, wearing a black cloak, erasing glowing text around it, ominous, 96x96 pixel art" |

---

## 4. MAP & ENVIRONMENT ASSETS

### 4.1 Tilesets (16x16 or 32x32 px tiles)

| File | Description | Source / Prompt |
|---|---|---|
| `tileset-academy.png` | TSA Academy HQ interior | Free: Kenney.nl "Topdown Shooter" tiles, recolored |
| `tileset-logic-realm.png` | Mathematics realm — mechanical/gear themed | "Pixel art tileset of a clockwork mathematical realm, gears, equation walls, calculator floors, blue and gold colors, 16x16 tiles" |
| `tileset-discovery-realm.png` | Science realm — laboratory themed | "Pixel art tileset of a science laboratory, tile floors, equipment, beakers on shelves, green and white, 16x16 tiles" |
| `tileset-language-realm.png` | English realm — library/literary themed | "Pixel art tileset of a grand library, bookshelves, reading lamps, writing desks, warm amber tones, 16x16 tiles" |
| `tileset-commerce-realm.png` | Business realm — city office themed | "Pixel art tileset of a modern business district, office floors, desks, windows with city views, grey and gold, 16x16 tiles" |
| `tileset-history-realm.png` | History realm — ancient ruins themed | "Pixel art tileset of ancient ruins with Bruneian/Malay architectural influences, stone floors, torch walls, earthy tones" |
| `tileset-tech-realm.png` | CS realm — cyberpunk/digital themed | "Pixel art tileset of a cyberpunk server room, neon blue grid floors, server racks, holographic panels" |
| `tileset-geo-realm.png` | Geography realm — nature/terrain themed | "Pixel art tileset of diverse terrain — grass, sand, water, mountain tiles, natural earthy greens and blues" |
| `tileset-safehouse.png` | Safehouse/checkpoint room | "Pixel art cozy safehouse interior, glowing save terminal, cot, map on wall, warm orange lighting" |

### 4.2 World Map (Subject Selection)

| File | Description | AI Prompt |
|---|---|---|
| `worldmap-background.png` | Full world map background | "2D stylized top-down world map showing 7 distinct magical realms separated by borders, each with a unique biome, fantasy RPG style, colorful, 1920x1080" |
| `realm-icon-math.png` | Math realm icon | "Icon of a golden gear with mathematical symbols, pixel art, 64x64" |
| `realm-icon-science.png` | Science realm icon | "Icon of a glowing atom/beaker, pixel art, 64x64" |
| `realm-icon-english.png` | English realm icon | "Icon of an open book with a quill pen, pixel art, 64x64" |
| `realm-icon-commerce.png` | Commerce realm icon | "Icon of a coin stack with a briefcase, pixel art, 64x64" |
| `realm-icon-history.png` | History realm icon | "Icon of a scroll with a compass, Bruneian-inspired, pixel art, 64x64" |
| `realm-icon-cs.png` | CS realm icon | "Icon of a circuit board with a glowing chip, pixel art, 64x64" |
| `realm-icon-geo.png` | Geography realm icon | "Icon of a globe with a map pin, pixel art, 64x64" |
| `realm-icon-malay.png` | Malay realm icon | "Icon of a traditional Bruneian kris dagger with script, pixel art, 64x64" |
| `realm-icon-locked.png` | Locked realm (grey/fog) | "Greyscale locked realm icon with padlock overlay, pixel art, 64x64" |

---

## 5. UI ASSETS

### 5.1 HUD (Heads-Up Display)

| File | Description | AI Prompt |
|---|---|---|
| `hud-expbar.png` | EXP bar frame | "Pixel art UI EXP progress bar with gold border, teal fill, spy theme, 200x24 pixels" |
| `hud-coinicon.png` | Coin icon | "Pixel art golden coin with TSA logo, small icon, 24x24" |
| `hud-healthbar.png` | Incorrect answer penalty bar | "Pixel art red and white HP bar with shield icon, 200x24" |
| `hud-level-badge.png` | Level indicator badge | "Pixel art hexagonal badge with number placeholder in center, gold and teal" |
| `hud-portrait-frame.png` | Player portrait frame | "Pixel art decorative frame for player portrait, ornate spy theme, 80x80" |

### 5.2 Buttons

| File | Description | AI Prompt |
|---|---|---|
| `btn-play.png` | Play button (normal + hover) | "Pixel art play button, teal with gold border, play triangle icon" |
| `btn-locked.png` | Locked chapter button | "Pixel art grey locked button with padlock, muted colors" |
| `btn-completed.png` | Completed chapter button with checkmark | "Pixel art green button with star/checkmark, completed chapter style" |
| `btn-hint.png` | Hint button (costs coins) | "Pixel art question mark button with coin cost indicator, yellow and gold" |

### 5.3 Dialogue Box

| File | Description | AI Prompt |
|---|---|---|
| `dialogue-box.png` | Main dialogue frame | "Pixel art dialogue box UI with rounded corners, dark navy background, gold border, speech indicator arrow at bottom, 480x120" |
| `dialogue-box-question.png` | Question popup frame | "Pixel art question dialog box, slightly larger, with glowing blue border, mission-briefing style" |

### 5.4 Icons

| File | Description | AI Prompt |
|---|---|---|
| `icon-correct.png` | Correct answer tick | "Pixel art large green checkmark with glow effect, 32x32" |
| `icon-wrong.png` | Wrong answer X | "Pixel art red X mark with spark effect, 32x32" |
| `icon-exp.png` | EXP gain icon | "Pixel art star with 'EXP' text, golden sparkle, 32x32" |
| `icon-coins.png` | Coin icon | "Pixel art coin stack, golden, 32x32" |
| `icon-streak.png` | Daily streak fire icon | "Pixel art flame with calendar icon, orange and yellow, 32x32" |
| `icon-badge.png` | Generic badge template | "Pixel art shield badge template with star center, gold and teal, 48x48" |

---

## 6. BADGE ASSETS

| File | Description | AI Prompt |
|---|---|---|
| `badge-chapter-complete.png` | Chapter completion badge | "Pixel art shield badge with a scroll icon, silver border, 'Mission Complete' style, 48x48" |
| `badge-subject-math.png` | Math subject badge | "Pixel art badge with mathematical symbols (pi, equals, infinity), gold and blue, 48x48" |
| `badge-subject-science.png` | Science subject badge | "Pixel art badge with atom and beaker icons, green and white glow, 48x48" |
| `badge-subject-english.png` | English subject badge | "Pixel art badge with open book and quill, deep red and gold, 48x48" |
| `badge-subject-cs.png` | CS subject badge | "Pixel art badge with circuit board and binary code, neon blue, 48x48" |
| `badge-perfect-score.png` | 100% chapter score badge | "Pixel art gold star badge with '100' and confetti, shining, 48x48" |
| `badge-streak-7.png` | 7-day login streak | "Pixel art flame badge with number 7, hot orange and gold, 48x48" |
| `badge-elite-agent.png` | Reach max level | "Pixel art elite crown badge in black and gold, dramatic glow, 48x48" |
| `badge-first-mission.png` | Complete first chapter | "Pixel art rookie badge with a small star, silver, 'First Mission' engraving" |

---

## 7. CUTSCENE / BACKGROUND ASSETS

| File | Description | AI Prompt |
|---|---|---|
| `bg-tsa-hq.png` | TSA Headquarters interior | "2D stylized wide background of a spy agency command center, large screens, Bruneian motifs mixed with modern tech aesthetic, 1920x1080" |
| `bg-title-screen.png` | Title screen background | "Epic 2D game title screen background showing a young spy agent overlooking seven magical realms on a glowing map, dramatic lighting, RPG style, 1920x1080" |
| `bg-forgetter-void.png` | The Forgetter's domain | "2D game background of a dark void with erased and fragmented knowledge floating, torn books and equations fading, ominous, purple and black" |
| `bg-loading-screen.png` | Loading screen | "Minimal 2D loading screen with TSA logo, dark navy background, animated particle dots suggestion" |
| `bg-chapter-complete.png` | Chapter complete screen | "2D celebratory background with confetti, glowing knowledge crystal, gold stars, bright cheerful colors" |
| `bg-gameover.png` | Low EXP / game over screen | "2D sad/retry background with crumbling knowledge crystals, muted dark tones, 'Try Again' energy" |

---

## 8. SOUND ASSETS

### 8.1 Folder: `sounds/bgm/` (Background Music — Loop)

| File | Scene | Style Suggestion | Free Source |
|---|---|---|---|
| `bgm-title.ogg` | Title / main menu | Epic orchestral spy theme, Brunei-inspired | OpenGameArt.org — search "RPG title theme" |
| `bgm-academy-hq.ogg` | TSA HQ / lobby | Light jazz spy theme, upbeat | OpenGameArt.org — search "spy jazz loop" |
| `bgm-logic-realm.ogg` | Math realm | Mechanical, puzzle-game music, clicking gears | Freesound.org — search "puzzle background" |
| `bgm-discovery-realm.ogg` | Science realm | Curious, sci-fi lab music | Freesound.org — search "laboratory ambient" |
| `bgm-language-realm.ogg` | English realm | Calm, library ambience, soft piano | OpenGameArt.org |
| `bgm-commerce-realm.ogg` | Commerce realm | Corporate but adventurous | Freesound.org |
| `bgm-history-realm.ogg` | History realm | Traditional Malay gamelan inspired | Freesound.org — search "gamelan ambient" |
| `bgm-tech-realm.ogg` | CS realm | Cyberpunk electronic, glitchy synth | OpenGameArt.org |
| `bgm-geo-realm.ogg` | Geography realm | Nature sounds + soft adventure | Freesound.org |
| `bgm-battle-guardian.ogg` | Guardian mini-boss | Tense, battle music | OpenGameArt.org — search "boss battle RPG" |
| `bgm-final-boss.ogg` | The Forgetter battle | Epic final boss orchestral | OpenGameArt.org |
| `bgm-chapter-complete.ogg` | Chapter complete screen | Short victory fanfare | OpenGameArt.org |
| `bgm-cutscene.ogg` | Story cutscenes | Cinematic, dramatic | Freesound.org |

**Free Music Sources:**
- https://opengameart.org (filter: music, free license)
- https://freesound.org (requires free account)
- https://www.zapsplat.com (free with account)
- https://incompetech.com (Kevin MacLeod — CC license)

---

### 8.2 Folder: `sounds/sfx/` (Sound Effects)

| File | Trigger | Description |
|---|---|---|
| `sfx-correct.ogg` | Correct answer | Short upbeat chime / "ding" |
| `sfx-wrong.ogg` | Wrong answer | Buzzer / descending tone |
| `sfx-exp-gain.ogg` | EXP gained | Sparkle, leveling up sound |
| `sfx-levelup.ogg` | Level up | Triumphant short fanfare |
| `sfx-coins-gain.ogg` | Coins added | Coin clinking sound |
| `sfx-badge-earn.ogg` | Badge earned | Medal ding + shine |
| `sfx-checkpoint-save.ogg` | Checkpoint saved | Soft save sound (typewriter click) |
| `sfx-door-unlock.ogg` | Chapter/realm unlocked | Door creaking open + key sound |
| `sfx-npc-approach.ogg` | Player walks near NPC | Soft notification bell |
| `sfx-guardian-appear.ogg` | Guardian NPC appears | Dramatic sting |
| `sfx-footstep.ogg` | Player walking | Soft floor tap |
| `sfx-skin-equip.ogg` | New skin equipped | Whoosh + sparkle |
| `sfx-combo.ogg` | Combo bonus triggered | Rising "combo!" tone |
| `sfx-streak-claim.ogg` | Daily streak claimed | Calendar + coins pop |
| `sfx-cutscene-start.ogg` | Cutscene begins | Cinematic whoosh |
| `sfx-game-start.ogg` | Game session begins | Mission start sound |
| `sfx-mission-complete.ogg` | Mission/chapter done | Triumphant orchestral hit |

---

### 8.3 Folder: `sounds/ui/` (UI Interaction Sounds)

| File | Trigger | Description |
|---|---|---|
| `ui-click.ogg` | Button click | Soft UI click |
| `ui-hover.ogg` | Button hover | Very soft tick |
| `ui-open.ogg` | Panel / menu open | Swoosh in |
| `ui-close.ogg` | Panel / menu close | Swoosh out |
| `ui-error.ogg` | Form error / invalid action | Soft buzz |
| `ui-notification.ogg` | Notification popup | Ding |
| `ui-map-select.ogg` | Subject/chapter selected | Map pin click sound |
| `ui-typing.ogg` | Text appears in dialogue box | Typewriter loop |

---

## 9. LOGO & BRANDING

| File | Description | AI Prompt |
|---|---|---|
| `logo-acequest.png` | Main game logo | "Game logo for 'AceQuest: Agent Ragam' — bold spy-themed typography, teal and gold color scheme, magnifying glass and map incorporated into design, clean vector style" |
| `logo-tsa.png` | TSA organization logo | "Circular emblem for 'Totally Spies Academy (TSA)', eagle or compass motif, gold on navy, official-looking badge style" |
| `logo-forgetter.png` | The Forgetter villain logo | "Villain symbol for 'The Forgetter' — eraser crossing out a brain or book, dark purple and black, ominous" |
| `favicon.ico` | Browser favicon | Small 32x32 version of TSA logo |

---

## 10. RECOMMENDED AI GENERATION TIPS

### For Gemini / ChatGPT Image Gen:
1. Always specify **pixel art** or **2D cartoon** to keep style consistent
2. Always specify **transparent background** for sprites
3. Specify exact pixel dimensions
4. Mention **Bruneian aesthetic** for culturally relevant NPCs
5. Add `top-down view` for map/character sprites
6. Use `--no background, --no text` to clean outputs

### Style Consistency Rules:
- Stick to ONE art style throughout (recommend: pixel art 32x32)
- Use consistent color palette: Navy `#1a2744`, Teal `#00bcd4`, Gold `#f5c518`, Crimson `#c62828`
- All character sprites: same resolution, same facing direction
- All badges: same size (48x48), same border style

---

## 11. FREE ASSET PACKS (READY TO USE)

| Pack | Content | URL |
|---|---|---|
| Kenney RPG Urban Pack | Top-down tiles, characters | https://kenney.nl/assets/rpg-urban-pack |
| Kenney Tiny Town | Environment tiles | https://kenney.nl/assets/tiny-town |
| LPC Sprite Sheet | RPG character sprites | https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles |
| RPG Music Pack | Background music loops | https://opengameart.org/content/rpg-music-pack |
| UI Sound Effects | Button/click sounds | https://kenney.nl/assets/interface-sounds |
| Pixel Adventure | Platformer tiles (reusable) | https://free-game-assets.itch.io/free-pixel-art-forest-game-tileset |
