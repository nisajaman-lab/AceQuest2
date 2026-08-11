# AceQuest: Agent Ragam — Geography Realm (Terra Realm)
## Image Asset Reference — assets.md

This file lists every image asset needed for the Geography Realm storyline, organized by chapter and scene. Use the AI prompts with Gemini/ChatGPT to generate each image. Recommended style: **2D stylized cartoon / pixel art**, consistent with the rest of AceQuest (Navy `#1a2744`, Teal `#00bcd4`, Gold `#f5c518`, Crimson `#c62828`).

---

## FOLDER STRUCTURE

```
frontend/public/assets/geography/
├── chapter-1.1-population/
├── chapter-1.2-food/
├── chapter-1.3-settlement/
├── chapter-2.1-tectonics/
│   ├── volcano/
│   ├── earthquake/
│   └── tsunami/
├── chapter-2.2-rivers-coasts/
├── chapter-2.3-climate-vegetation/
├── chapter-3.1-industry/
├── chapter-3.2-energy/
├── chapter-3.3-tourism/
├── bosses/
├── npcs/
├── final-boss-geox/
└── ui-icons/
```

---

# CHAPTER 1.1 — THE POPULATION CRISIS ZONE

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-megacity-overcrowded.png` | Overcrowded megacity zone | "Top-down 2D pixel art background of an overcrowded megacity street, dense crowds of small NPC sprites, tall buildings, neon signs, busy market stalls, vibrant but chaotic, 1024x1024" |
| `bg-ghost-fields.png` | Empty/underpopulated ghost town | "Top-down 2D pixel art background of an abandoned rural town, empty farmland, boarded-up houses, overgrown weeds, muted grey-green tones, eerie quiet atmosphere, 1024x1024" |
| `bg-migration-docks.png` | Harbour/migration scene | "2D pixel art background of a harbour dock at dusk, small boats arriving and departing, NPCs with luggage, warm orange sky, 1024x1024" |
| `bg-pyramid-tower.png` | Population pyramid tower interior | "2D pixel art interior of a tall tower with glowing floor levels stacked like a population pyramid, each floor a different color, futuristic data-tower aesthetic, 1024x1024" |

## Interactive Objects / Puzzle Assets

| File | Description | AI Prompt |
|---|---|---|
| `obj-population-graph-billboard.png` | Crumbling billboard with birth/death rate graph | "Pixel art cracked digital billboard showing a glitchy bar graph of birth and death rates, broken screen effect, 256x256" |
| `obj-population-pyramid-expansive.png` | Expansive pyramid diagram | "Clean 2D infographic illustration of an expansive population pyramid (wide base, narrow top), labeled age groups, flat design, blue and gold colors" |
| `obj-population-pyramid-stationary.png` | Stationary pyramid diagram | "Clean 2D infographic illustration of a stationary population pyramid (rectangular shape), labeled age groups, flat design, blue and gold colors" |
| `obj-population-pyramid-constrictive.png` | Constrictive pyramid diagram | "Clean 2D infographic illustration of a constrictive population pyramid (narrow base, wider middle), labeled age groups, flat design, blue and gold colors" |
| `obj-pyramid-blocks-set.png` | Draggable age-group blocks | "Set of 6 colorful rectangular UI blocks of different widths labeled with age ranges (0-14, 15-29, etc.), flat icon style, transparent background" |
| `obj-hdi-formula-board.png` | HDI formula board (scrambled) | "Pixel art chalkboard/screen showing a scrambled formula with floating puzzle-piece icons for GNI, life expectancy, and literacy rate, 512x512" |
| `obj-push-pull-board.png` | Push/pull factor sorting board | "2D flat-design mission board UI with two columns labeled 'PUSH FACTORS' and 'PULL FACTORS', empty slots, teal and gold spy-theme border, 512x512" |
| `icon-push-factor-drought.png` | Push factor card: drought | "Small flat icon of a cracked dry land with sun, card-style with rounded border, labeled 'Drought'" |
| `icon-push-factor-war.png` | Push factor card: war/conflict | "Small flat icon of a broken building with smoke, card-style rounded border, labeled 'Conflict'" |
| `icon-push-factor-poverty.png` | Push factor card: poverty | "Small flat icon of an empty wallet/coin, card-style rounded border, labeled 'Poverty'" |
| `icon-pull-factor-jobs.png` | Pull factor card: jobs | "Small flat icon of a briefcase with upward arrow, card-style rounded border, labeled 'Jobs'" |
| `icon-pull-factor-safety.png` | Pull factor card: safety | "Small flat icon of a shield, card-style rounded border, labeled 'Safety'" |
| `icon-pull-factor-education.png` | Pull factor card: education | "Small flat icon of a graduation cap and book, card-style rounded border, labeled 'Education'" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-mayor-harith.png` | Mission Giver — Mayor | "Top-down pixel art NPC of a stressed mayor in a suit holding papers, 32x32" |
| `npc-mayor-harith-portrait.png` | Mayor portrait | "2D cartoon portrait of a middle-aged Bruneian mayor, formal suit, worried expression, 128x128" |
| `npc-dr-siti.png` | Hint NPC — Dr. Siti | "Top-down pixel art NPC of a female scientist with glasses and lab coat holding a tablet, 32x32" |
| `npc-dr-siti-portrait.png` | Dr. Siti portrait | "2D cartoon portrait of a young Bruneian female scientist, glasses, friendly smile, lab coat, 128x128" |
| `npc-ibrahim-migrant.png` | Lore NPC — migrant with luggage | "Top-down pixel art NPC of a tired traveler carrying a suitcase and bundle, worn clothes, 32x32" |
| `npc-ibrahim-portrait.png` | Ibrahim portrait | "2D cartoon portrait of a tired male migrant traveler, weathered face, determined expression, 128x128" |
| `npc-professor-zara.png` | Checkpoint NPC — Professor | "Top-down pixel art NPC of an elderly female professor with a cane and books, 32x32" |
| `npc-professor-zara-portrait.png` | Professor Zara portrait | "2D cartoon portrait of an elderly Bruneian female professor, glasses, wise expression, traditional headscarf, 128x128" |

---

## BIG BOSS 1.1 — THE CENSUS PHANTOM

| File | Description | AI Prompt |
|---|---|---|
| `boss-census-phantom.png` | Main boss sprite | "2D cartoon boss character — a tall faceless phantom wrapped in torn census scroll papers, holding a giant glowing eraser, ghostly translucent body, dark purple and grey tones, menacing, 256x256, transparent background" |
| `boss-census-phantom-attack.png` | Attack animation frame | "Same census phantom character mid-attack, eraser swinging forward, scrolls flying off its body, motion lines, 256x256" |
| `bg-census-hall-arena.png` | Battle arena background | "2D background of a grand crumbling government census hall, walls covered in fading population data charts and documents, dramatic lighting, dust particles, 1024x1024" |
| `fx-data-beam.png` | Correct-answer effect | "Glowing teal energy beam effect with floating numbers and data symbols, transparent background, special effect sprite" |
| `fx-erase-effect.png` | Wrong-answer effect | "Grey/white erasing particle effect, papers and numbers dissolving into dust, transparent background" |
| `crystal-population.png` | Knowledge Crystal (Population) | "Glowing blue crystal gem with faint silhouettes of people inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 1.2 — THE FAMINE FIELDS

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-dried-paddy-fields.png` | Dry, cracked rice paddies | "Top-down 2D pixel art background of cracked dry rice paddy fields under a harsh sun, dead brown crops, dust clouds, 1024x1024" |
| `bg-empty-sea.png` | Barren fishing waters | "2D pixel art background of an empty grey-blue ocean with a small wooden fishing boat, no fish visible, overcast sky, 1024x1024" |
| `bg-agrifood-lab.png` | Research lab interior | "2D pixel art interior of a high-tech agricultural research lab, broken machines, hydroponic shelves, sparking wires, green and white tones, 1024x1024" |
| `bg-market-town-empty.png` | Empty market town | "2D pixel art background of a market street with empty stalls and shelves, a few worried NPC vendors, warm but dim lighting, 1024x1024" |

## Interactive Objects

| File | Description | AI Prompt |
|---|---|---|
| `map-southeast-asia-rice.png` | SE Asia rice farming map | "Flat 2D stylized map of Southeast Asia highlighting countries, with empty glowing tap-zones over Vietnam, Thailand, Indonesia, Philippines, clean infographic style" |
| `fx-rice-sprout.png` | Rice sprouting animation frame | "Small green rice sprout growing from soil, pixel art, 64x64, transparent background" |
| `obj-fishing-zone-map.png` | Sea map with fishing zones | "2D top-down map of a coastline showing inland water and marine fishing zones marked with glowing blue circles, flat design" |
| `obj-aquaculture-tank-broken.png` | Broken fish farm tank | "Pixel art illustration of a large empty fish farming tank with cracked glass and dripping water pipes, 256x256" |
| `obj-aquaculture-tank-fixed.png` | Restored fish farm tank | "Pixel art illustration of a full fish farming tank with healthy fish swimming, clean glass, glowing blue water, 256x256" |
| `icon-farming-step-cards.png` | Farming sequence cards | "Set of 5 small flat icon cards showing farming steps: prepare soil, plant seeds, irrigate, grow, harvest — simple line-art icons in circles" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-haji-daud.png` | Mission Giver — Farmer | "Top-down pixel art NPC of an elderly farmer in traditional clothing holding a hoe, straw hat, 32x32" |
| `npc-haji-daud-portrait.png` | Farmer portrait | "2D cartoon portrait of an elderly Bruneian farmer, kind weathered face, straw hat, 128x128" |
| `npc-fisher-minah.png` | Lore NPC — Fisherwoman | "Top-down pixel art NPC of a fisherwoman holding a net, standing near a boat, 32x32" |
| `npc-fisher-minah-portrait.png` | Minah portrait | "2D cartoon portrait of a Bruneian fisherwoman, headscarf, warm smile, 128x128" |
| `npc-dr-agro.png` | Hint NPC — Agricultural scientist | "Top-down pixel art NPC of a scientist in a green lab coat holding a plant sample, 32x32" |
| `npc-dr-agro-portrait.png` | Dr. Agro portrait | "2D cartoon portrait of a male agricultural scientist, glasses, green lab coat, holding a seedling, 128x128" |
| `npc-merchant-checkpoint.png` | Checkpoint NPC — Merchant | "Top-down pixel art NPC of a friendly market merchant standing behind a stall counter, 32x32" |
| `npc-merchant-portrait.png` | Merchant portrait | "2D cartoon portrait of a cheerful Bruneian merchant, traditional cap, friendly smile, 128x128" |

---

## BIG BOSS 1.2 — THE HUNGER TITAN

| File | Description | AI Prompt |
|---|---|---|
| `boss-hunger-titan.png` | Main boss sprite | "2D cartoon boss character — a towering humanoid creature made of dead crops, dry vines, and tangled empty fishing nets, hollow glowing eyes shaped like empty bowls, brown and grey tones, intimidating, 256x256, transparent background" |
| `boss-hunger-titan-attack.png` | Attack animation frame | "Same hunger titan creature mid-attack, sending a wave of dust and dry leaves forward, cracked ground beneath it, 256x256" |
| `bg-famine-fields-arena.png` | Battle arena background | "2D background split into two halves — left side cracked dry paddy soil, right side empty dark ocean, dramatic stormy sky, 1024x1024" |
| `fx-drought-wave.png` | Attack effect | "Brown dust and drought particle wave effect, transparent background, special effect sprite" |
| `crystal-food.png` | Knowledge Crystal (Food) | "Glowing green crystal gem with faint silhouette of a rice grain inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 1.3 — THE CRUMBLING CITY

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-foundling-ruins.png` | Ancient settlement site terrain | "Top-down 2D pixel art background of an empty terrain map showing hills, a winding river, and flat grassland, suitable for a settlement-siting puzzle, clean and bright, 1024x1024" |
| `bg-jumbled-city.png` | Scrambled city zoning map | "Top-down 2D pixel art aerial view of a chaotic city where factories, houses, and skyscrapers are randomly mixed together, smoke and clutter, 1024x1024" |
| `bg-expanding-slum.png` | Rapidly growing slum area | "2D pixel art background of a densely packed informal settlement with narrow alleys, makeshift houses, laundry lines, smoky cooking fires, 1024x1024" |
| `bg-counter-urban-suburb.png` | Quiet rural fringe suburb | "2D pixel art background of a peaceful suburban area on the edge of a city, green gardens, low houses, quiet streets, soft pastel tones, 1024x1024" |

## Interactive Objects

| File | Description | AI Prompt |
|---|---|---|
| `obj-site-factor-icons.png` | Site factor selection icons | "Set of 4 flat icon cards labeled: Water Supply (river drop icon), Relief (hill icon), Soil (soil layer icon), Building Materials (stone/wood icon), simple line-art style" |
| `obj-zoning-labels.png` | Drag-and-drop zone labels | "Set of 4 flat rectangular UI labels: 'CBD', 'Industrial Zone', 'Residential Area', 'Urban Fringe', teal and gold color scheme, rounded corners" |
| `obj-city-map-before.png` | Scrambled city map (before) | "Top-down flat-design city map with mismatched colored zones overlapping incorrectly, glitch effect, 512x512" |
| `obj-city-map-after.png` | Organized city map (after) | "Top-down flat-design city map with correctly organized concentric zones — CBD center, residential ring, industrial edge, urban fringe outskirts, clean and colorful, 512x512" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-azri-planner.png` | Mission Giver — City Planner | "Top-down pixel art NPC of a city planner holding a rolled blueprint, hard hat, 32x32" |
| `npc-azri-portrait.png` | Azri portrait | "2D cartoon portrait of a young Bruneian male city planner, hard hat, holding blueprints, confident expression, 128x128" |
| `npc-old-settler.png` | Lore NPC — Old settler | "Top-down pixel art NPC of an elderly man in traditional robes standing near an old well, 32x32" |
| `npc-old-settler-portrait.png` | Old settler portrait | "2D cartoon portrait of a very elderly man, traditional robes, long beard, calm expression, 128x128" |
| `npc-maya-slum.png` | Lore NPC — Slum resident | "Top-down pixel art NPC of a young woman standing outside a small makeshift house, 32x32" |
| `npc-maya-portrait.png` | Maya portrait | "2D cartoon portrait of a young woman, modest clothing, hopeful but tired expression, 128x128" |
| `npc-transport-officer.png` | Hint NPC — Transport officer | "Top-down pixel art NPC of a traffic officer in uniform with a whistle and signal baton, 32x32" |
| `npc-transport-officer-portrait.png` | Transport officer portrait | "2D cartoon portrait of a traffic officer, uniform cap, whistle in mouth, alert expression, 128x128" |
| `npc-geographer-checkpoint.png` | Checkpoint NPC — Geographer | "Top-down pixel art NPC of a geographer holding a large folded map, 32x32" |
| `npc-geographer-portrait.png` | Geographer portrait | "2D cartoon portrait of a middle-aged geographer, glasses, holding a map, scholarly look, 128x128" |

---

## BIG BOSS 1.3 — THE URBAN COLOSSUS

| File | Description | AI Prompt |
|---|---|---|
| `boss-urban-colossus.png` | Main boss sprite | "2D cartoon boss character — a skyscraper-sized humanoid creature built from tangled roads, broken buildings, traffic signs, and rubble, grey and orange tones, towering and chaotic, 256x256, transparent background" |
| `boss-urban-colossus-attack.png` | Attack animation frame | "Same urban colossus creature stomping forward, sending cracks and debris across the ground, motion lines, 256x256" |
| `bg-broken-city-arena.png` | Battle arena background | "2D background of a battle arena split between a glossy CBD skyline and a crumbling slum district, dramatic contrast, dusk lighting, 1024x1024" |
| `fx-rubble-impact.png` | Attack effect | "Grey rubble and dust impact effect with cracks radiating outward, transparent background, special effect sprite" |
| `crystal-settlement.png` | Knowledge Crystal (Settlement) | "Glowing orange crystal gem with faint silhouette of city buildings inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 2.1 — THE TECTONIC GROUNDS

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-plate-boundary-trenches.png` | Underground plate tectonics view | "2D cross-section illustration background showing Earth's layers — crust, mantle, with two tectonic plates and arrows showing movement, educational diagram style with vibrant colors, 1024x1024" |
| `bg-erupting-volcano.png` | Active volcano eruption scene | "2D side-view background of an erupting stratovolcano, glowing red lava flowing down slopes, dark ash cloud rising, small village visible at the base, dramatic and intense, 1024x1024" |
| `bg-earthquake-epicentre.png` | Earthquake-affected city | "2D pixel art background of a city during an earthquake, buildings tilted and cracking, dust clouds, motion blur lines indicating shaking, 1024x1024" |
| `bg-tsunami-shore.png` | Coastal village before tsunami | "2D background of a coastal village seen from a clifftop, calm village in foreground, a massive dark wave visible on the horizon approaching, warning siren tower in scene, ominous lighting, 1024x1024" |

## Interactive Objects — Plate Tectonics

| File | Description | AI Prompt |
|---|---|---|
| `obj-plate-arrows-divergent.png` | Divergent boundary arrows | "Flat 2D diagram icon showing two arrows pointing away from each other with a gap forming between tectonic plates, labeled 'Divergent', educational style" |
| `obj-plate-arrows-convergent.png` | Convergent boundary arrows | "Flat 2D diagram icon showing two arrows pointing toward each other with one plate sliding under another, labeled 'Convergent', educational style" |
| `obj-plate-arrows-transform.png` | Transform boundary arrows | "Flat 2D diagram icon showing two arrows sliding past each other horizontally, labeled 'Transform', educational style" |
| `obj-earth-cross-section.png` | Earth layers diagram | "Flat 2D cross-section diagram of the Earth showing crust, mantle, and core layers in different colors, labeled, clean educational infographic" |

## Interactive Objects — Volcano (Material Identification Mini-Game)

| File | Description | AI Prompt |
|---|---|---|
| `obj-volcano-lava-flow.png` | Falling object: Lava flow | "2D icon of glowing red-orange flowing lava stream, falling/tumbling pose, transparent background, 128x128, labeled tag style for drag game" |
| `obj-volcano-ash-cloud.png` | Falling object: Ash cloud | "2D icon of a dark grey billowing ash cloud puff, falling pose, transparent background, 128x128" |
| `obj-volcano-pyroclastic-flow.png` | Falling object: Pyroclastic flow | "2D icon of a fast-moving cloud of hot gas and volcanic debris rolling down a slope, orange-grey gradient, transparent background, 128x128" |
| `obj-volcano-volcanic-bomb.png` | Falling object: Volcanic bomb | "2D icon of a glowing rounded chunk of molten rock with trailing sparks, transparent background, 128x128" |
| `obj-volcano-gas-emission.png` | Falling object: Volcanic gas | "2D icon of wispy yellow-white gas/smoke rising, sulfur-colored, transparent background, 128x128" |
| `obj-volcano-lapilli.png` | Falling object: Lapilli (volcanic ash/cinders) | "2D icon of small dark grey rock fragments scattered/falling, transparent background, 128x128" |
| `ui-label-tag-blank.png` | Blank label tag for tapping | "Flat UI label tag/sticker, rounded rectangle, teal border, empty space for text, transparent background" |
| `fx-village-impact.png` | Wrong-answer impact on village | "2D effect of a small village hut being hit by falling debris, smoke and impact stars, transparent background" |

## Interactive Objects — Earthquake

| File | Description | AI Prompt |
|---|---|---|
| `obj-seismograph-machine.png` | Seismograph display | "2D illustration of an old-style seismograph machine with a wildly oscillating needle line on paper roll, vintage scientific equipment style, 512x512" |
| `obj-richter-scale-meter.png` | Richter scale gauge | "Flat 2D circular gauge/meter UI showing a scale from 1 to 10, glowing red needle pointing to a high number, labeled 'Richter Scale', clean infographic style" |
| `obj-warning-steps-cards.png` | Earthquake response sequence cards | "Set of 5 flat icon cards in a row showing: seismograph (monitor), megaphone (warn), running people (evacuate), house with shield (shelter), ambulance (rescue) — simple line-art icons in circles" |

## Interactive Objects — Tsunami (Wave Analysis & NPC Fact-Giving)

| File | Description | AI Prompt |
|---|---|---|
| `obj-tsunami-wave-approaching.png` | Large wave on horizon | "2D illustration of a massive dark blue tsunami wave on the ocean horizon, towering over a small coastline, dramatic and powerful, wide format 1024x512" |
| `obj-tsunami-wave-diagram.png` | Tsunami formation diagram | "Flat 2D educational diagram showing how a tsunami forms — underwater earthquake at seafloor, energy traveling through water, wave growing near shore, labeled cross-section, clean infographic colors" |
| `obj-tsunami-warning-siren.png` | Warning siren tower | "2D pixel art illustration of a tall coastal warning siren tower, red light flashing, sound wave icons emanating, 256x256" |
| `obj-evacuation-route-map.png` | Evacuation route map | "Top-down flat-design map of a small coastal town showing a glowing path/arrow leading from the beach to higher ground marked with a safe zone icon, clean and colorful" |
| `icon-tsunami-action-correct.png` | Correct response action: move to high ground | "Flat icon of a person running uphill toward a 'safe zone' flag, simple line-art style, green checkmark accent" |
| `icon-tsunami-action-wrong-watch.png` | Incorrect response action: watching the wave | "Flat icon of a person standing on the beach pointing/filming the wave, simple line-art style, red X accent" |
| `icon-tsunami-action-correct-inland.png` | Correct response action: move inland | "Flat icon of a person and family moving away from coastline toward inland buildings, simple line-art style, green checkmark accent" |
| `npc-rescued-villager.png` | Rescued NPC sprite (post-correct-answer) | "Top-down pixel art NPC of a relieved villager waving, small celebratory sparkle effect, 32x32" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-dr-tectonica.png` | Mission Giver — Geologist | "Top-down pixel art NPC of a geologist wearing a hard hat and holding rock samples, 32x32" |
| `npc-dr-tectonica-portrait.png` | Dr. Tectonica portrait | "2D cartoon portrait of a female geologist, hard hat, holding a rock sample, determined expression, 128x128" |
| `npc-volcanologist-razak.png` | Hint NPC — Volcanologist | "Top-down pixel art NPC of a volcanologist in a heat-resistant suit holding a thermal scanner, 32x32" |
| `npc-volcanologist-razak-portrait.png` | Razak portrait | "2D cartoon portrait of a male volcanologist, silver heat-resistant suit collar, focused expression, 128x128" |
| `npc-seismologist-fatimah.png` | Lore NPC — Seismologist | "Top-down pixel art NPC of a seismologist standing next to monitoring equipment, headset on, 32x32" |
| `npc-seismologist-fatimah-portrait.png` | Fatimah portrait | "2D cartoon portrait of a female seismologist, headset, lab coat, alert expression, 128x128" |
| `npc-village-elder-tsunami.png` | Friendly NPC — Village elder (tsunami facts) | "Top-down pixel art NPC of an elderly coastal villager wearing a traditional hat, standing with a walking stick, 32x32" |
| `npc-village-elder-portrait.png` | Village elder portrait | "2D cartoon portrait of an elderly coastal villager, weathered face, traditional woven hat, solemn but kind expression, 128x128" |
| `npc-checkpoint-officer.png` | Checkpoint NPC | "Top-down pixel art NPC of a safehouse officer in a teal uniform, standing beside a glowing terminal, 32x32" |
| `npc-checkpoint-officer-portrait.png` | Checkpoint officer portrait | "2D cartoon portrait of a checkpoint officer, teal uniform, badge, calm professional expression, 128x128" |

---

## BIG BOSS 2.1 — THE QUAKE LORD

| File | Description | AI Prompt |
|---|---|---|
| `boss-quake-lord.png` | Main boss sprite | "2D cartoon boss character — a massive humanoid entity split down the middle: left half made of glowing molten volcanic rock with cracks and lava veins, right half made of cracked grey earth with fault-line patterns, towering and powerful, 256x256, transparent background" |
| `boss-quake-lord-attack-volcano.png` | Volcanic attack animation frame | "Same quake lord creature with its volcanic half erupting, lava bursting from its shoulder, ash spewing, 256x256" |
| `boss-quake-lord-attack-quake.png` | Earthquake attack animation frame | "Same quake lord creature with its earthquake half pulsing, ground cracks radiating outward from its feet, 256x256" |
| `bg-quake-lord-arena.png` | Battle arena background | "2D battle arena background split into two halves — left side a molten lava field with volcanic rock, right side an earthquake-fractured urban ruin with cracked roads, dramatic split-scene, 1024x1024" |
| `fx-lava-burst.png` | Volcanic attack effect | "Orange-red lava burst particle effect with embers, transparent background, special effect sprite" |
| `fx-ground-crack.png` | Earthquake attack effect | "Grey ground-crack effect spreading outward with dust particles, transparent background, special effect sprite" |
| `crystal-tectonics.png` | Knowledge Crystal (Tectonics) | "Glowing red-orange crystal gem with faint silhouette of a volcano and fault line inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 2.2 — THE RIVER & COAST LABYRINTH

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-river-source-mountain.png` | River source (upper course) | "2D side-view background of a mountain river source, narrow fast-flowing stream, steep V-shaped valley, rocky terrain, 1024x1024" |
| `bg-river-middle-course.png` | River middle course | "2D side-view background of a winding river with a meander forming, wider valley, grassy banks, 1024x1024" |
| `bg-river-mouth-delta.png` | River mouth (lower course) | "2D side-view background of a wide river delta meeting the sea, floodplains, levees visible, calm water, 1024x1024" |
| `bg-coastal-cliffs.png` | Coastal cliff erosion scene | "2D side-view background of dramatic coastal cliffs with crashing waves, a cave forming at the base of the cliff, sea spray, 1024x1024" |
| `bg-floodplain-village.png` | Flooding village scene | "2D background of a village near a river that has overflowed its banks, rising brown floodwater, rain falling, NPCs on rooftops, dramatic stormy sky, 1024x1024" |
| `bg-flood-command-centre.png` | Flood event command centre interior | "2D pixel art interior of a flood emergency command centre, large monitors showing river levels, maps on walls, busy control room, blue-toned lighting, 1024x1024" |

## Interactive Objects — River Features

| File | Description | AI Prompt |
|---|---|---|
| `obj-river-waterfall.png` | River feature: Waterfall | "2D illustration of a waterfall cascading over a rock ledge into a plunge pool, river landform style, transparent background, 256x256" |
| `obj-river-gorge.png` | River feature: Gorge | "2D illustration of a steep narrow gorge with a river flowing through it, high rock walls, transparent background, 256x256" |
| `obj-river-meander.png` | River feature: Meander | "2D top-down illustration of a winding S-shaped river meander through grassland, transparent background, 256x256" |
| `obj-river-oxbow-lake.png` | River feature: Oxbow lake | "2D top-down illustration of a curved oxbow lake separated from the main river channel, with the river flowing straight nearby, transparent background, 256x256" |
| `obj-river-levee.png` | River feature: Levee | "2D side-view illustration of raised natural embankments (levees) along a river bank during high water, transparent background, 256x256" |
| `obj-river-floodplain.png` | River feature: Floodplain | "2D side-view illustration of a flat floodplain area beside a river with farmland, transparent background, 256x256" |
| `obj-river-delta.png` | River feature: Delta | "2D top-down illustration of a river splitting into multiple channels forming a delta as it meets the sea, transparent background, 256x256" |
| `obj-raft-player.png` | Player raft sprite | "2D pixel art small wooden raft with a flag, top-down or side view, transparent background, 64x64" |
| `ui-wrong-label-floating.png` | Floating incorrect label | "Flat UI floating text label with a red question mark icon, rounded rectangle, transparent background" |

## Interactive Objects — Coastal Erosion Sequence

| File | Description | AI Prompt |
|---|---|---|
| `obj-coast-cave.png` | Coastal feature: Cave | "2D side-view illustration of a sea cave forming at the base of a cliff, waves entering the opening, transparent background, 256x256" |
| `obj-coast-arch.png` | Coastal feature: Arch | "2D side-view illustration of a natural rock arch over the sea, waves passing through the opening, transparent background, 256x256" |
| `obj-coast-stack.png` | Coastal feature: Stack | "2D side-view illustration of an isolated rock stack standing in the sea near a cliff, waves around its base, transparent background, 256x256" |
| `obj-coast-stump.png` | Coastal feature: Stump | "2D side-view illustration of a low eroded rock stump barely visible above sea level near a cliff, transparent background, 256x256" |
| `ui-erosion-sequence-labels.png` | Sequence label set | "Set of 4 flat UI labels reading 'CAVE', 'ARCH', 'STACK', 'STUMP' in order, teal rounded rectangles with gold text" |

## Interactive Objects — Flood Rescue

| File | Description | AI Prompt |
|---|---|---|
| `icon-flood-cause-deforestation.png` | Flood cause card: Deforestation | "Flat icon card of a hillside with tree stumps and bare soil, labeled 'Deforestation', simple line-art style" |
| `icon-flood-cause-monsoon.png` | Flood cause card: Heavy monsoon rainfall | "Flat icon card of dark rain clouds with heavy rainfall over land, labeled 'Heavy Rainfall', simple line-art style" |
| `icon-flood-cause-urbanisation.png` | Flood cause card: Urbanisation | "Flat icon card of concrete buildings and paved roads with water running off, labeled 'Urbanisation', simple line-art style" |
| `icon-flood-cause-river-modification.png` | Flood cause card: River modification | "Flat icon card of a straightened concrete river channel, labeled 'River Modification', simple line-art style" |
| `icon-flood-strategy-embankment.png` | Flood strategy card: Embankments | "Flat icon card of a raised earth embankment beside a river, labeled 'Embankments', simple line-art style" |
| `icon-flood-strategy-afforestation.png` | Flood strategy card: Afforestation | "Flat icon card of newly planted trees on a hillside, labeled 'Afforestation', simple line-art style" |
| `icon-flood-strategy-warning-system.png` | Flood strategy card: Warning systems | "Flat icon card of a siren/alert symbol with a phone, labeled 'Flood Warning System', simple line-art style" |
| `npc-rescue-team-sprite.png` | Animated rescue team unit | "Top-down pixel art of a small rescue boat with two rescuer NPCs, life jackets, 64x64" |
| `npc-stranded-villager.png` | Stranded NPC on rooftop | "Top-down pixel art of a villager waving for help, standing on a rooftop surrounded by floodwater, 32x32" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-river-guide-alia.png` | Mission Giver — River guide | "Top-down pixel art NPC of a young woman in outdoor gear holding a paddle, 32x32" |
| `npc-river-guide-alia-portrait.png` | Alia portrait | "2D cartoon portrait of a young female river guide, outdoor gear, confident smile, 128x128" |
| `npc-coastal-geologist-basir.png` | Lore NPC — Coastal geologist | "Top-down pixel art NPC of a geologist standing near cliffs holding binoculars, 32x32" |
| `npc-coastal-geologist-basir-portrait.png` | Basir portrait | "2D cartoon portrait of a male coastal geologist, binoculars around neck, observant expression, 128x128" |
| `npc-flood-survivor.png` | Friendly NPC — Flood survivor | "Top-down pixel art NPC of a person wrapped in a blanket, standing near sandbags, 32x32" |
| `npc-flood-survivor-portrait.png` | Flood survivor portrait | "2D cartoon portrait of a person wrapped in a blanket, tired but relieved expression, 128x128" |
| `npc-river-engineer.png` | Hint NPC — River engineer | "Top-down pixel art NPC of an engineer in a hard hat holding blueprints near a river barrier, 32x32" |
| `npc-river-engineer-portrait.png` | River engineer portrait | "2D cartoon portrait of a river engineer, hard hat, blueprints, focused expression, 128x128" |

---

## BIG BOSS 2.2 — THE FLOOD SERPENT

| File | Description | AI Prompt |
|---|---|---|
| `boss-flood-serpent.png` | Main boss sprite | "2D cartoon boss character — a colossal serpent made of swirling brown river water and blue coastal sea spray, with floating broken signs and wrongly-labeled landform icons embedded in its body, long sinuous shape, 256x512, transparent background" |
| `boss-flood-serpent-attack.png` | Attack animation frame | "Same flood serpent creature rearing up and unleashing a wave of water and debris toward the viewer, motion lines, 256x512" |
| `bg-flood-serpent-arena.png` | Battle arena background | "2D battle arena background split between a roaring waterfall river scene and crashing coastal cliffs, dramatic stormy lighting, 1024x1024" |
| `fx-water-wave-attack.png` | Attack effect | "Large blue-brown water wave splash effect with foam, transparent background, special effect sprite" |
| `crystal-rivers-coasts.png` | Knowledge Crystal (Rivers & Coasts) | "Glowing cyan crystal gem with faint silhouette of a river meander and coastline inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 2.3 — THE STORM & JUNGLE FRONTIER

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-weathering-cave.png` | Underground cave system | "2D side-view background of a limestone cave interior, visible cracks in rock walls, plant roots growing through stone, dripping water, 1024x1024" |
| `bg-climate-data-tower.png` | Climate data tower interior | "2D pixel art interior of a tall tower filled with broken climate graph screens and weather instruments, 1024x1024" |
| `bg-typhoon-eye.png` | Typhoon formation scene | "2D background of a dramatic tropical storm forming over the ocean, swirling dark clouds, lightning, rain, viewed from a coastal weather station, 1024x1024" |
| `bg-disappearing-rainforest.png` | Deforestation scene | "2D side-view background of a tropical rainforest with logging machines cutting down trees on one side and lush untouched forest on the other side, 1024x1024" |

## Interactive Objects — Weathering

| File | Description | AI Prompt |
|---|---|---|
| `obj-weathering-freeze-thaw.png` | Weathering example: Freeze-thaw | "2D close-up illustration of a rock face with a crack widened by ice, small ice crystals visible in the crack, transparent background, 256x256" |
| `obj-weathering-root-action.png` | Weathering example: Root action (biological) | "2D close-up illustration of plant roots growing into and breaking apart a rock crevice, transparent background, 256x256" |
| `obj-weathering-carbonation.png` | Weathering example: Carbonation (chemical) | "2D close-up illustration of limestone rock dissolving with bubbling water droplets, transparent background, 256x256" |
| `ui-weathering-type-labels.png` | Weathering type label set | "Set of 3 flat UI labels reading 'PHYSICAL', 'CHEMICAL', 'BIOLOGICAL', rounded rectangles in different colors (blue, green, brown)" |

## Interactive Objects — Climate Graphs

| File | Description | AI Prompt |
|---|---|---|
| `obj-climate-graph-equatorial-blank.png` | Blank equatorial climate graph | "Flat 2D infographic of an empty climate graph template with axes for temperature (line) and rainfall (bars), labeled months, clean educational style" |
| `obj-climate-graph-equatorial-complete.png` | Completed equatorial climate graph | "Flat 2D infographic of a completed tropical equatorial climate graph showing high consistent temperature line and high rainfall bars across all months, clean educational style" |
| `obj-climate-graph-monsoon-complete.png` | Completed monsoon climate graph | "Flat 2D infographic of a completed tropical monsoon climate graph showing high temperature line and seasonal rainfall bars with a clear wet and dry season, clean educational style" |
| `obj-climate-data-blocks.png` | Draggable climate data blocks | "Set of small flat UI blocks showing temperature and rainfall values for different months, simple card style, transparent background" |

## Interactive Objects — Typhoon Formation & Response

| File | Description | AI Prompt |
|---|---|---|
| `obj-typhoon-tracking-map.png` | Weather tracking map | "Flat 2D weather radar map showing a swirling tropical cyclone symbol over warm ocean water near the equator, satellite-map style, dark blue ocean with cyclone spiral icon" |
| `icon-typhoon-factor-warm-sea.png` | Formation factor: Warm sea | "Flat icon card of ocean waves with a thermometer showing high temperature, labeled 'Warm Tropical Sea', simple line-art style" |
| `icon-typhoon-factor-latitude.png` | Formation factor: Latitude 6-20° | "Flat icon card of a globe with a highlighted latitude band near the equator, labeled '6-20° Latitude', simple line-art style" |
| `icon-typhoon-factor-low-pressure.png` | Formation factor: Low pressure | "Flat icon card of a weather symbol showing a low pressure 'L' with spiraling arrows, simple line-art style" |
| `icon-typhoon-factor-humidity.png` | Formation factor: High humidity | "Flat icon card of water droplets in the air with a humidity gauge, labeled 'High Humidity', simple line-art style" |
| `icon-typhoon-impact-storm-surge.png` | Impact sequence: Storm surge | "Flat icon card of a large wave hitting a coastline, labeled 'Storm Surge', simple line-art style" |
| `icon-typhoon-impact-flooding.png` | Impact sequence: Coastal flooding | "Flat icon card of a flooded coastal town, labeled 'Coastal Flooding', simple line-art style" |
| `icon-typhoon-impact-landslide.png` | Impact sequence: Landslides | "Flat icon card of a hillside collapsing onto a road, labeled 'Landslides', simple line-art style" |
| `icon-typhoon-impact-infrastructure.png` | Impact sequence: Infrastructure damage | "Flat icon card of a damaged power line and collapsed roof, labeled 'Infrastructure Damage', simple line-art style" |

## Interactive Objects — Rainforest SOS

| File | Description | AI Prompt |
|---|---|---|
| `obj-logging-machine.png` | Active logging machine | "2D illustration of a yellow logging machine/excavator cutting down a tree, side view, transparent background, 256x256" |
| `obj-logging-machine-shutdown.png` | Shutdown logging machine | "2D illustration of the same yellow logging machine powered off with a tree regrowing beside it, transparent background, 256x256" |
| `ui-deforestation-counter.png` | Deforestation counter UI | "Flat UI counter widget showing a number with a tree icon and downward red arrow, alarm-style red border" |
| `icon-conservation-reforestation.png` | Conservation strategy: Reforestation | "Flat icon card of hands planting a tree sapling, labeled 'Reforestation', simple line-art style" |
| `icon-conservation-controlled-logging.png` | Conservation strategy: Controlled logging | "Flat icon card of a single tree being cut with a checkmark, labeled 'Controlled Logging', simple line-art style" |
| `icon-conservation-ecotourism.png` | Conservation strategy: Ecotourism | "Flat icon card of a tourist with binoculars in a forest, labeled 'Ecotourism', simple line-art style" |
| `icon-conservation-protected-area.png` | Conservation strategy: Protected areas | "Flat icon card of a forest area surrounded by a fence/boundary line with a shield icon, labeled 'Protected Area', simple line-art style" |
| `obj-forest-management-board.png` | Forest management plan board | "Flat 2D mission board UI with empty slots for strategy cards, forest-green and brown color scheme, wooden board texture" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-climate-scientist-noor.png` | Mission Giver — Climate scientist | "Top-down pixel art NPC of a climate scientist holding a tablet with a weather symbol, 32x32" |
| `npc-climate-scientist-noor-portrait.png` | Noor portrait | "2D cartoon portrait of a female climate scientist, lab coat, holding a tablet, focused expression, 128x128" |
| `npc-cave-guide-mahmud.png` | Lore NPC — Cave guide | "Top-down pixel art NPC of a cave guide holding a lantern, helmet with headlamp, 32x32" |
| `npc-cave-guide-mahmud-portrait.png` | Mahmud portrait | "2D cartoon portrait of a male cave guide, helmet with headlamp, holding a lantern, friendly expression, 128x128" |
| `npc-meteorologist-suria.png` | Hint NPC — Meteorologist | "Top-down pixel art NPC of a meteorologist standing in front of a weather map, holding a pointer, 32x32" |
| `npc-meteorologist-suria-portrait.png` | Suria portrait | "2D cartoon portrait of a female meteorologist, professional attire, holding a pointer, alert expression, 128x128" |
| `npc-forest-ranger-amira.png` | Friendly NPC — Forest ranger | "Top-down pixel art NPC of a forest ranger in green uniform with a walkie-talkie, 32x32" |
| `npc-forest-ranger-amira-portrait.png` | Amira portrait | "2D cartoon portrait of a female forest ranger, green uniform, hat, determined expression, 128x128" |

---

## BIG BOSS 2.3 — THE TYPHOON WRAITH

| File | Description | AI Prompt |
|---|---|---|
| `boss-typhoon-wraith.png` | Main boss sprite | "2D cartoon boss character — a swirling ghostly entity made of storm clouds, rain, and shredded green leaves, rotating like a spiral typhoon eye, holding a chainsaw in one hand and a lightning bolt in the other, dark blue and green tones, ethereal and menacing, 256x256, transparent background" |
| `boss-typhoon-wraith-attack.png` | Attack animation frame | "Same typhoon wraith creature spinning faster, blowing leaves, rain, and corrupted data papers outward, motion blur, 256x256" |
| `bg-typhoon-wraith-arena.png` | Battle arena background | "2D battle arena background of a stormy rainforest edge, half lashed by typhoon winds and rain, half being cut down by logging machines, dramatic dark lighting, 1024x1024" |
| `fx-wind-leaf-attack.png` | Attack effect | "Swirling wind effect with green leaves and rain droplets, transparent background, special effect sprite" |
| `crystal-climate-vegetation.png` | Knowledge Crystal (Climate & Vegetation) | "Glowing emerald green crystal gem with faint silhouette of a leaf and storm cloud inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 3.1 — THE INDUSTRIAL WASTELAND

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-sector-sorting-factory.png` | Factory interior with conveyor belt | "2D pixel art interior of a factory with a conveyor belt running across the screen, industrial machinery, grey and yellow tones, 1024x1024" |
| `bg-misplaced-factory-zone.png` | Map with factories in wrong places | "Top-down 2D pixel art map showing factories oddly placed — one in the middle of a residential area, one on a mountain top, ports and roads visible, slightly chaotic layout, 1024x1024" |
| `bg-brunei-industrial-site.png` | Brunei industrial zone | "2D pixel art background of a modern industrial site in Brunei with oil/gas processing buildings, cranes, and a port, clean and organized, daytime, 1024x1024" |
| `bg-pollution-control-centre.png` | Pollution-affected area | "2D pixel art background of an industrial area with yellow smog in the air, an orange-tinted polluted river, smoke stacks, 1024x1024" |

## Interactive Objects

| File | Description | AI Prompt |
|---|---|---|
| `obj-worker-primary.png` | Worker sprite: Primary sector | "Top-down pixel art NPC of a worker holding farming/mining tools, 32x32" |
| `obj-worker-secondary.png` | Worker sprite: Secondary sector | "Top-down pixel art NPC of a factory worker in overalls holding a wrench, 32x32" |
| `obj-worker-tertiary.png` | Worker sprite: Tertiary sector | "Top-down pixel art NPC of a service worker in a shirt and tie holding a folder, 32x32" |
| `obj-worker-quaternary.png` | Worker sprite: Quaternary sector | "Top-down pixel art NPC of a researcher in a lab coat holding a laptop, 32x32" |
| `ui-sector-bins.png` | Sector sorting bins | "Set of 4 flat UI labeled bins/boxes reading 'Primary', 'Secondary', 'Tertiary', 'Quaternary', color-coded, clean infographic style" |
| `obj-factory-sprite-generic.png` | Draggable factory icon | "2D top-down icon of a small factory building with a smokestack, transparent background, 128x128" |
| `obj-location-factor-icons.png` | Location factor icon set | "Set of flat icon cards: raw materials (ore icon), labor (person icon), transport (truck icon), market (shopping cart icon), energy (lightning bolt icon), simple line-art style" |
| `icon-pollution-air.png` | Pollution type: Air | "Flat icon of grey smoke clouds rising from a chimney, labeled 'Air Pollution', simple line-art style" |
| `icon-pollution-water.png` | Pollution type: Water | "Flat icon of a water droplet with pollution symbols inside, labeled 'Water Pollution', simple line-art style" |
| `icon-pollution-noise.png` | Pollution type: Noise | "Flat icon of sound waves with a warning symbol, labeled 'Noise Pollution', simple line-art style" |
| `icon-pollution-strategy-legislation.png` | Pollution strategy: Legislation | "Flat icon of a law gavel with a document, labeled 'Legislation', simple line-art style" |
| `icon-pollution-strategy-cleanfuel.png` | Pollution strategy: Cleaner fuels | "Flat icon of a fuel pump with a green leaf symbol, labeled 'Cleaner Fuels', simple line-art style" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-factory-boss-hassan.png` | Mission Giver — Factory boss | "Top-down pixel art NPC of a factory manager in a hard hat holding a clipboard, 32x32" |
| `npc-factory-boss-hassan-portrait.png` | Hassan portrait | "2D cartoon portrait of a male factory manager, hard hat, clipboard, stern but fair expression, 128x128" |
| `npc-economist.png` | Hint NPC — Economist | "Top-down pixel art NPC of an economist in a suit holding a graph chart, 32x32" |
| `npc-economist-portrait.png` | Economist portrait | "2D cartoon portrait of an economist, suit, holding a chart, analytical expression, 128x128" |
| `npc-bruneian-worker.png` | Lore NPC — Industrial worker | "Top-down pixel art NPC of a worker in safety gear standing near oil/gas equipment, 32x32" |
| `npc-bruneian-worker-portrait.png` | Worker portrait | "2D cartoon portrait of a Bruneian industrial worker, safety helmet and vest, proud expression, 128x128" |
| `npc-environmental-inspector.png` | Checkpoint NPC — Inspector | "Top-down pixel art NPC of an environmental inspector with a gas mask and clipboard, 32x32" |
| `npc-environmental-inspector-portrait.png` | Inspector portrait | "2D cartoon portrait of an environmental inspector, gas mask lowered, clipboard, serious expression, 128x128" |

---

## BIG BOSS 3.1 — THE SMOG BARON

| File | Description | AI Prompt |
|---|---|---|
| `boss-smog-baron.png` | Main boss sprite | "2D cartoon boss character — a rotund tycoon-shaped creature made of factory smokestacks and industrial chimneys for a body, constantly emitting grey smog, holding a tiny misplaced factory under one arm and a permit scroll in the other, dark grey and sickly yellow tones, comedic-but-menacing, 256x256, transparent background" |
| `boss-smog-baron-attack.png` | Attack animation frame | "Same smog baron creature dumping a wave of acid rain and industrial waste from above, dark clouds forming, 256x256" |
| `bg-smog-baron-arena.png` | Battle arena background | "2D battle arena background of a dark, smog-filled industrial zone with burning factories and an orange polluted river, 1024x1024" |
| `fx-acid-rain.png` | Attack effect | "Green-yellow acid rain droplet effect falling diagonally, transparent background, special effect sprite" |
| `crystal-industry.png` | Knowledge Crystal (Industry) | "Glowing grey-gold crystal gem with faint silhouette of a factory and gear inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 3.2 — THE ENERGY FORTRESS

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-energy-source-map-room.png` | Energy control room with world map | "2D pixel art interior of a control room with a large illuminated world map showing energy production hotspots, control panels, 1024x1024" |
| `bg-seria-oil-refinery.png` | Seria oil refinery scene | "2D pixel art background of an oil refinery with large storage tanks, pipelines, and flare stacks near the coast, Brunei-style industrial complex, daytime, 1024x1024" |
| `bg-carbon-emissions-lab.png` | Greenhouse gas chamber lab | "2D pixel art interior of a science lab with a large glass dome containing a model of Earth, gas particles visible inside the dome, 1024x1024" |
| `bg-tenaga-suria-solar-plant.png` | Solar power plant | "2D pixel art background of a large solar power plant with rows of solar panels under a bright sun, Brunei landscape in background, 1024x1024" |

## Interactive Objects

| File | Description | AI Prompt |
|---|---|---|
| `icon-energy-coal.png` | Energy source tile: Coal | "Flat icon card of a pile of black coal, labeled 'Coal', simple line-art style" |
| `icon-energy-oil.png` | Energy source tile: Oil | "Flat icon card of an oil barrel, labeled 'Oil', simple line-art style" |
| `icon-energy-natural-gas.png` | Energy source tile: Natural gas | "Flat icon card of a gas flame icon, labeled 'Natural Gas', simple line-art style" |
| `icon-energy-nuclear.png` | Energy source tile: Nuclear | "Flat icon card of a radiation/atom symbol, labeled 'Nuclear', simple line-art style" |
| `icon-energy-hydro.png` | Energy source tile: HEP | "Flat icon card of a dam with water flowing, labeled 'HEP', simple line-art style" |
| `icon-energy-solar.png` | Energy source tile: Solar | "Flat icon card of a sun above a solar panel, labeled 'Solar', simple line-art style" |
| `icon-energy-wind.png` | Energy source tile: Wind | "Flat icon card of a wind turbine, labeled 'Wind', simple line-art style" |
| `icon-energy-biofuel.png` | Energy source tile: Biofuel | "Flat icon card of a plant/leaf inside a fuel droplet, labeled 'Biofuel', simple line-art style" |
| `ui-energy-bins-renewable-nonrenewable.png` | Sorting bins | "Two flat UI labeled bins reading 'Renewable' (green) and 'Non-Renewable' (grey/black), clean infographic style" |
| `obj-greenhouse-dome.png` | Greenhouse gas dome | "2D illustration of a glass dome containing a small Earth model, with colored gas particles (CO2 in grey, methane in orange, nitrous oxide in purple) floating inside, transparent background, 512x512" |
| `icon-gas-co2.png` | Gas particle: CO2 | "Small flat icon of a grey gas molecule labeled 'CO2', transparent background" |
| `icon-gas-methane.png` | Gas particle: Methane | "Small flat icon of an orange gas molecule labeled 'CH4', transparent background" |
| `icon-gas-nitrous-oxide.png` | Gas particle: Nitrous oxide | "Small flat icon of a purple gas molecule labeled 'N2O', transparent background" |
| `obj-temperature-gauge.png` | Rising temperature gauge | "Flat 2D vertical thermometer gauge UI with red mercury level rising, danger zone marked at top, clean infographic style" |
| `icon-carbon-footprint-meter.png` | Carbon footprint meter | "Flat circular gauge UI showing a carbon footprint level from low (green) to high (red), labeled 'Carbon Footprint', clean infographic style" |
| `icon-lifestyle-bus.png` | Lifestyle choice: Bus | "Flat icon of a green bus, simple line-art style" |
| `icon-lifestyle-car.png` | Lifestyle choice: Car | "Flat icon of a car with exhaust smoke, simple line-art style" |
| `icon-lifestyle-recycle.png` | Lifestyle choice: Recycle | "Flat icon of a recycling symbol bin, simple line-art style" |
| `icon-lifestyle-trash.png` | Lifestyle choice: Throw away | "Flat icon of a trash can overflowing, simple line-art style" |
| `icon-lifestyle-plant-tree.png` | Lifestyle choice: Plant trees | "Flat icon of hands planting a tree, simple line-art style" |
| `icon-lifestyle-cut-tree.png` | Lifestyle choice: Cut trees | "Flat icon of a chainsaw cutting a tree, simple line-art style" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-energy-director-nabil.png` | Mission Giver — Energy director | "Top-down pixel art NPC of an energy director in a suit standing near control panels, 32x32" |
| `npc-energy-director-nabil-portrait.png` | Nabil portrait | "2D cartoon portrait of a male energy director, suit, confident expression, control panel background, 128x128" |
| `npc-oil-rig-worker.png` | Lore NPC — Oil rig worker | "Top-down pixel art NPC of an oil rig worker in safety gear and helmet, 32x32" |
| `npc-oil-rig-worker-portrait.png` | Oil rig worker portrait | "2D cartoon portrait of an oil rig worker, helmet, safety vest, weathered face, 128x128" |
| `npc-solar-engineer-puteri.png` | Hint NPC — Solar engineer | "Top-down pixel art NPC of a solar engineer holding a solar panel sample, 32x32" |
| `npc-solar-engineer-puteri-portrait.png` | Puteri portrait | "2D cartoon portrait of a female solar engineer, holding a small solar panel, bright optimistic expression, 128x128" |
| `npc-climate-scientist-azlan.png` | Friendly NPC — Climate scientist | "Top-down pixel art NPC of a climate scientist standing near the greenhouse dome, lab coat, 32x32" |
| `npc-climate-scientist-azlan-portrait.png` | Azlan portrait | "2D cartoon portrait of a male climate scientist, lab coat, glasses, concerned expression, 128x128" |

---

## BIG BOSS 3.2 — THE CARBON COLOSSUS

| File | Description | AI Prompt |
|---|---|---|
| `boss-carbon-colossus.png` | Main boss sprite | "2D cartoon boss character — a towering creature with coal-black bones, oil dripping like blood, exhaust pipes for arms, a glowing red temperature gauge embedded in its chest, dark and industrial, 256x256, transparent background" |
| `boss-carbon-colossus-attack.png` | Attack animation frame | "Same carbon colossus creature launching a cloud of dark carbon emissions and acid rain from its exhaust-pipe arms, 256x256" |
| `bg-carbon-colossus-arena.png` | Battle arena background | "2D battle arena background split between a burning fossil fuel landscape with oil derricks and smoke, and a dead solar/wind farm with broken panels and still turbines, 1024x1024" |
| `fx-carbon-emission-cloud.png` | Attack effect | "Dark grey-black smoke cloud effect with embers, transparent background, special effect sprite" |
| `crystal-energy.png` | Knowledge Crystal (Energy) | "Glowing yellow-white crystal gem with faint silhouette of a lightning bolt and sun inside it, fantasy item icon, transparent background, 128x128" |

---

# CHAPTER 3.3 — THE TOURIST TRAP

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-overtourism-beach.png` | Trashed beach resort | "2D pixel art background of a beautiful tropical beach resort covered in litter, overcrowded with tourists, damaged coral visible in shallow water, 1024x1024" |
| `bg-sustainable-ecolodge.png` | Eco-lodge under construction | "2D pixel art background of a sustainable eco-lodge being built among trees, solar panels, wooden walkways, workers using eco-friendly materials, 1024x1024" |
| `bg-brunei-tourism-showcase.png` | Brunei attractions display | "2D pixel art background of a museum-style showcase room displaying models of Brunei landmarks (mosque, water village, rainforest), with information panels, 1024x1024" |
| `bg-tourism-investigation-office.png` | Investigation office interior | "2D pixel art interior of a research office with maps, survey forms, photographs pinned to a corkboard, 1024x1024" |

## Interactive Objects

| File | Description | AI Prompt |
|---|---|---|
| `icon-tourism-problem-litter.png` | Tourism problem: Litter | "Flat icon of scattered trash on a beach, labeled 'Litter', simple line-art style" |
| `icon-tourism-problem-overcrowding.png` | Tourism problem: Overcrowding | "Flat icon of a crowd of people icons packed together, labeled 'Overcrowding', simple line-art style" |
| `icon-tourism-problem-coral-damage.png` | Tourism problem: Coral damage | "Flat icon of broken/bleached coral, labeled 'Coral Damage', simple line-art style" |
| `icon-tourism-problem-cultural-disrespect.png` | Tourism problem: Cultural disrespect | "Flat icon of a tourist taking a photo disrespectfully near a cultural site with a warning symbol, labeled 'Cultural Disrespect', simple line-art style" |
| `icon-tourism-strategy-limit-numbers.png` | Strategy: Limit tourist numbers | "Flat icon of a ticket with a 'limited' stamp, labeled 'Limit Numbers', simple line-art style" |
| `icon-tourism-strategy-awareness.png` | Strategy: Raise awareness | "Flat icon of a megaphone with an info symbol, labeled 'Raise Awareness', simple line-art style" |
| `icon-tourism-strategy-conservation.png` | Strategy: Biodiversity conservation | "Flat icon of a leaf inside a shield, labeled 'Conservation', simple line-art style" |
| `icon-tourism-strategy-local-labor.png` | Strategy: Use of local labor | "Flat icon of a handshake with a local community symbol, labeled 'Local Labor', simple line-art style" |
| `obj-brunei-attraction-mosque.png` | Brunei attraction: Mosque | "2D illustration of the Sultan Omar Ali Saifuddien Mosque, golden dome, reflecting pool, clean illustrative style, transparent background, 256x256" |
| `obj-brunei-attraction-water-village.png` | Brunei attraction: Water village | "2D illustration of Kampong Ayer water village, traditional houses on stilts over water, clean illustrative style, transparent background, 256x256" |
| `obj-brunei-attraction-rainforest.png` | Brunei attraction: Rainforest park | "2D illustration of a rainforest canopy walkway with lush greenery, clean illustrative style, transparent background, 256x256" |
| `npc-stakeholder-tourist.png` | Stakeholder NPC: Tourist | "Top-down pixel art NPC of a tourist with a camera and sunhat, 32x32" |
| `npc-stakeholder-hotel-owner.png` | Stakeholder NPC: Hotel owner | "Top-down pixel art NPC of a hotel owner in a formal resort uniform, 32x32" |
| `npc-stakeholder-fisherman.png` | Stakeholder NPC: Local fisherman | "Top-down pixel art NPC of a local fisherman holding a net, 32x32" |
| `npc-stakeholder-government.png` | Stakeholder NPC: Government official | "Top-down pixel art NPC of a government official in formal attire holding a folder, 32x32" |
| `npc-stakeholder-conservation.png` | Stakeholder NPC: Conservation officer | "Top-down pixel art NPC of a conservation officer in a green uniform with binoculars, 32x32" |
| `npc-stakeholder-tour-guide.png` | Stakeholder NPC: Tour guide | "Top-down pixel art NPC of a tour guide holding a flag and pamphlet, 32x32" |

## NPCs

| File | Description | AI Prompt |
|---|---|---|
| `npc-tourism-director-hana.png` | Mission Giver — Tourism director | "Top-down pixel art NPC of a tourism director in business attire holding a brochure, 32x32" |
| `npc-tourism-director-hana-portrait.png` | Hana portrait | "2D cartoon portrait of a female tourism director, business attire, holding a brochure, professional smile, 128x128" |
| `npc-local-village-elder.png` | Lore NPC — Village elder | "Top-down pixel art NPC of a village elder in traditional Bruneian dress, 32x32" |
| `npc-local-village-elder-portrait.png` | Village elder portrait | "2D cartoon portrait of an elderly Bruneian village elder, traditional dress, dignified expression, 128x128" |
| `npc-ecolodge-manager.png` | Hint NPC — Eco-lodge manager | "Top-down pixel art NPC of an eco-lodge manager in casual eco-friendly attire holding a clipboard, 32x32" |
| `npc-ecolodge-manager-portrait.png` | Eco-lodge manager portrait | "2D cartoon portrait of an eco-lodge manager, casual attire, friendly approachable expression, 128x128" |
| `npc-conservation-ranger-checkpoint.png` | Checkpoint NPC — Conservation ranger | "Top-down pixel art NPC of a conservation ranger in green uniform near a checkpoint terminal, 32x32" |
| `npc-conservation-ranger-checkpoint-portrait.png` | Conservation ranger portrait | "2D cartoon portrait of a conservation ranger, green uniform, calm professional expression, 128x128" |

---

## BIG BOSS 3.3 — THE OVERCROWDING PHANTOM

| File | Description | AI Prompt |
|---|---|---|
| `boss-overcrowding-phantom.png` | Main boss sprite | "2D cartoon boss character — a bloated tourist-shaped spectre carrying too many suitcases and beach gear, flickering between a tourist appearance and a corporate resort developer in a suit, translucent ghostly body, bright clashing colors, 256x256, transparent background" |
| `boss-overcrowding-phantom-attack.png` | Attack animation frame | "Same overcrowding phantom creature spawning waves of litter, suitcases, and noise-wave symbols toward the viewer, 256x256" |
| `bg-overcrowding-phantom-arena.png` | Battle arena background | "2D battle arena background split between a beautiful untouched tropical paradise and a ruined overcrowded resort with litter and broken umbrellas, 1024x1024" |
| `fx-litter-wave.png` | Attack effect | "Scattered litter and trash particle effect flying outward, transparent background, special effect sprite" |
| `crystal-tourism.png` | Knowledge Crystal (Tourism) | "Glowing turquoise crystal gem with faint silhouette of a palm tree and mangrove inside it, fantasy item icon, transparent background, 128x128" |

---

# FINAL BOSS — GEO-X: THE WORLD ERASER

## Environment / Backgrounds

| File | Description | AI Prompt |
|---|---|---|
| `bg-terra-realm-world-map.png` | Final battle arena - world map | "2D top-down stylized world map of the Terra Realm showing all 9 zones connected, each zone glowing with its respective Knowledge Crystal color, GEO-X positioned at the center, epic scale, 1920x1080" |
| `bg-pre-boss-cutscene.png` | Pre-boss cutscene - crystals forming map | "2D cinematic illustration of 9 glowing colored crystals floating together in the air, forming the outline of a world map, dark dramatic background with light rays, 1920x1080" |

## Boss Assets

| File | Description | AI Prompt |
|---|---|---|
| `boss-geox-form1.png` | GEO-X initial form | "2D cartoon final boss character — a sleek dark satellite-shaped AI entity with glowing red eye-like sensors, mechanical tendrils reaching outward, ominous and high-tech, 256x256, transparent background" |
| `boss-geox-form2-erasure.png` | GEO-X erasure surge form | "Same GEO-X satellite AI entity in an enraged overcharged state, glowing brighter red, tendrils extended fully across the screen, erasure beams firing in all directions, 384x384, transparent background" |
| `boss-geox-defeat.png` | GEO-X defeat/fracturing | "Same GEO-X satellite AI entity cracking apart with bright golden light and data streams pouring out of the cracks, dramatic, 384x384, transparent background" |
| `fx-erasure-beam.png` | GEO-X attack effect | "Red laser beam effect with glitch/static distortion along its length, transparent background, special effect sprite" |
| `fx-knowledge-restoration.png` | Victory restoration effect | "Golden light burst effect with streams of data and light particles flowing outward, transparent background, special effect sprite" |

## UI — Crystal Health Tracker

| File | Description | AI Prompt |
|---|---|---|
| `ui-crystal-tracker-bar.png` | Terra Realm health bar showing 9 crystals | "Flat UI horizontal health bar made of 9 small crystal icons in a row, each a different color matching the 9 knowledge crystals, some glowing brightly and some dim/cracked, clean game UI style" |
| `ui-timer-60sec.png` | 60-second timer UI | "Flat circular countdown timer UI widget showing '60' with a clock icon, teal and gold color scheme, clean game UI style" |
| `ui-timer-3min.png` | 3-minute timer UI | "Flat circular countdown timer UI widget showing '3:00' with a clock icon, orange and gold color scheme indicating a longer/harder question, clean game UI style" |
| `ui-timer-5min.png` | 5-minute timer UI (final question) | "Flat circular countdown timer UI widget showing '5:00' with a glowing red clock icon, dramatic final-boss styling, clean game UI style" |

## Final Rewards

| File | Description | AI Prompt |
|---|---|---|
| `badge-terra-realm-guardian.png` | Master badge | "Pixel art master badge — an ornate circular medal with all 9 knowledge crystal colors arranged around its border, a globe in the center, gold trim, 64x64, transparent background" |
| `skin-geography-explorer.png` | Geography Explorer skin | "Pixel art spy agent character wearing a khaki explorer outfit with a map satchel, compass badge, and sun hat, same base pose as default Agent Ragam sprite, 32x32, transparent background" |
| `crystal-terra-core.png` | Final merged Terra Core | "Glowing multicolor crystal sphere combining all 9 crystal colors, radiant and powerful, fantasy item icon, transparent background, 256x256" |
| `bg-victory-cutscene.png` | Victory cutscene background | "2D cinematic illustration of the Terra Realm fully restored — green forests, blue rivers, organized cities, calm volcanoes, all visible on a vibrant world map, bright triumphant lighting, 1920x1080" |

---

# SOUND ASSETS (Geography Realm Specific)

## Folder: `sounds/geography/bgm/`

| File | Scene | Style Suggestion |
|---|---|---|
| `bgm-terra-realm-overworld.ogg` | Geography world map | Adventurous orchestral with nature sounds (birds, wind) |
| `bgm-volcano-eruption.ogg` | Volcano eruption scene | Intense rumbling, deep drums, rising tension |
| `bgm-tsunami-warning.ogg` | Tsunami shore scene | Tense ambient with siren undertones |
| `bgm-rainforest.ogg` | Rainforest frontier zone | Calm jungle ambience with distant chainsaw sounds (for deforestation areas) |
| `bgm-typhoon.ogg` | Typhoon eye scene | Howling wind, rain, distant thunder |
| `bgm-geox-battle.ogg` | Final boss battle | Epic electronic/orchestral hybrid, escalating intensity across phases |

## Folder: `sounds/geography/sfx/`

| File | Trigger | Description |
|---|---|---|
| `sfx-volcano-rumble.ogg` | Volcano eruption begins | Deep rumbling bass sound |
| `sfx-lava-bubble.ogg` | Lava material falls | Bubbling/sizzling sound |
| `sfx-ash-puff.ogg` | Ash cloud material falls | Soft puffing/whoosh sound |
| `sfx-earthquake-shake.ogg` | Earthquake event triggers | Low rumble with shaking/rattling |
| `sfx-tsunami-siren.ogg` | Tsunami warning siren activates | Rising siren wail |
| `sfx-wave-crash.ogg` | Tsunami wave hits shore | Large water crash sound |
| `sfx-correct-identify.ogg` | Correct material/feature identification | Bright positive chime |
| `sfx-incorrect-identify.ogg` | Wrong material/feature identification | Buzzer/error sound |
| `sfx-villager-rescued.ogg` | NPC successfully rescued | Cheerful relief sound |
| `sfx-crystal-restore.ogg` | Knowledge Crystal restored after boss | Magical chime/sparkle |
| `sfx-geox-erasure-beam.ogg` | GEO-X fires erasure beam | Sharp digital glitch/laser sound |
| `sfx-geox-defeat.ogg` | GEO-X final defeat | Dramatic shattering + triumphant rising tone |

---

# GENERATION ORDER RECOMMENDATION (Geography Realm)

1. **Logos/branding consistency check** — confirm Terra Realm color palette matches main game
2. **Agent Ragam Geography Explorer skin** (final reward — establish early so it's ready)
3. **World map + 9 zone backgrounds** (highest visual priority — sets tone for each chapter)
4. **All 9 Big Bosses + GEO-X** (key visual identity pieces)
5. **9 Knowledge Crystals + Terra Core** (small, simple, used everywhere)
6. **Volcano material identification icons** (core gameplay mechanic)
7. **Tsunami wave/diagram/evacuation assets** (core gameplay mechanic)
8. **River feature & coastal erosion sequence assets** (core gameplay mechanic)
9. **All other interactive objects/icons per chapter**
10. **NPCs + portraits** (largest quantity — batch by chapter)
11. **UI elements** (timers, health tracker, sorting bins, label tags)
12. **Sound assets** (last, can be sourced from free libraries while images are being generated)
