This script standardizes and moves images from `src/assets/image` into `src/assets/images`.

Categories created (examples):
- `portraits` — files containing "portrait"
- `logos` — files containing "logo"
- `maps` — maps, world maps, realm graphics, tilesets
- `icons` — icon files
- `tilesets` — tileset images
- `npc` — NPC portraits and related assets
- `bosses` — boss sprites/art
- `sprites` — single sprite images
- `effects` — attack/effect/hint/wrong/correct assets
- `diagrams` — diagrams, boards, formulas
- `crystals` — "knowledge crystal" items
- `backgrounds` — background scenes
- `misc` — anything not matched

How to run (from project root):

```powershell
cd acequest\frontend\scripts
powershell -ExecutionPolicy Bypass -File .\organize-images.ps1
```

Notes:
- Filenames are normalized to lowercase with hyphens. Ampersand (&) becomes "and".
- If duplicate names occur, a numeric suffix is appended.
- Review `src/assets/images` after running and adjust categories or keywords in the script as needed.