# Image Import Guide

Quick reference for importing images throughout the application.

## Import Paths by Location

### From Pages

```jsx
// From src/pages/*.jsx
import logo from '../assets/images/logos/logo.png';
import bgTitle from '../assets/images/backgrounds/bg-title-screen.jpg';
```

### From Components

```jsx
// From src/components/*.jsx
import icon from '../assets/images/icons/geo-icon.png';
import npc from '../assets/images/npc/npc-professor-zara.png';
```

### From Nested Components

```jsx
// Adjust ../ based on nesting depth
import sprite from '../../../assets/images/sprites/agent-ragam-idle.png';
```

### From Game Directory

```jsx
// From src/game/*.js or src/game/scenes/*.js
import effect from '../../assets/images/effects/fx-lava-burst.png';
```

## Category-Specific Import Examples

### Backgrounds

```jsx
import Background from '../assets/images/backgrounds/bg-erupting-volcano.png';
import LoadingScreen from '../assets/images/backgrounds/bg-loading-screen.jpg';
```

### Character Sprites

```jsx
import PlayerSprite from '../assets/images/sprites/agent-ragam-walk-down.png';
import PlayerSkin from '../assets/images/sprites/skin-math-master.jpg';
import NPCSprite from '../assets/images/npc/npc-professor-zara.png';
```

### UI Elements

```jsx
import PlayButton from '../assets/images/ui assets/btn-play.png.png';
import DialogueBox from '../assets/images/ui assets/dialogue-box.png.png';
import HealthBar from '../assets/images/ui assets/hud-healthbar.png.png';
```

### Icons

```jsx
import GeoIcon from '../assets/images/icons/geo-icon.png';
import Badge from '../assets/images/icons/icon-badge.png.png';
import CorrectIcon from '../assets/images/icons/icon-correct.png.png';
```

### Game Objects

```jsx
import BossSprite from '../assets/images/bosses/hunger-titan.png';
import MapImage from '../assets/images/maps/battle-arena.png';
import TileSet from '../assets/images/tilesets/tileset-academy.png';
```

## React Component Pattern

### Basic Image Component

```jsx
import geoIcon from '../assets/images/icons/geo-icon.png';

export function GeoSubjectIcon() {
  return (
    <img 
      src={geoIcon} 
      alt="Geography Subject" 
      className="subject-icon"
    />
  );
}
```

### Background Component

```jsx
import backgroundImg from '../assets/images/backgrounds/bg-title-screen.jpg';

export function TitleScreen() {
  return (
    <div 
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover'
      }}
    >
      {/* Content */}
    </div>
  );
}
```

## Phaser Game Scene Loading

### Load Images

```javascript
// In preload() method
this.load.image('bg-volcano', require('../../assets/images/backgrounds/bg-erupting-volcano.png').default);
this.load.image('player-idle', require('../../assets/images/sprites/agent-ragam-idle.png').default);
```

### Load Spritesheets

```javascript
// In preload() method for animated sprites
this.load.spritesheet(
  'player-walk',
  require('../../assets/images/sprites/agent-ragam-walk-down.png').default,
  { frameWidth: 32, frameHeight: 32 }
);
```

### Display in Scene

```javascript
// In create() method
this.add.image(512, 384, 'bg-volcano');
this.add.sprite(100, 100, 'player-idle');
```

## Dynamic Image Loading

### Function to Build Image Path

```jsx
export function getImagePath(category, filename) {
  return require(`../assets/images/${category}/${filename}`).default;
}

// Usage
const portrait = getImagePath('portraits', 'npc-professor-zara-portrait.png');
```

### Loading by Subject

```jsx
const subjectIcons = {
  math: '../assets/images/icons/math-icon.png',
  science: '../assets/images/icons/sci-icon.png',
  english: '../assets/images/icons/eng-icon.png',
  geography: '../assets/images/icons/geo-icon.png',
  commerce: '../assets/images/icons/commerce-icon.png',
  malay: '../assets/images/icons/malay-icon.png',
  compSci: '../assets/images/icons/comp-sci-icon.png',
  history: '../assets/images/icons/history-icon.png',
};

export function SubjectIcon({ subject }) {
  return <img src={subjectIcons[subject]} alt={subject} />;
}
```

## Import Considerations

### File Extensions

- `.png` - Use for most assets
- `.jpg` - Use for complex/compressed backgrounds
- `.jfif` - Alternative format (some character assets)

### Path Separators

- Always use forward slashes `/` in import paths
- Windows backslashes `\` will not work in imports

### Module Resolution

- Imports use relative paths from the source file location
- Each `../` moves up one directory level
- Always count from your current file to `src/assets/images/`

## Common Mistakes to Avoid

### ❌ Incorrect Paths

```jsx
// Wrong - missing directory level
import icon from '../images/icons/geo-icon.png';

// Wrong - using backslashes
import icon from '..\assets\images\icons\geo-icon.png';

// Wrong - absolute path from wrong root
import icon from 'src/assets/images/icons/geo-icon.png';
```

### ✅ Correct Paths

```jsx
// Correct from pages
import icon from '../assets/images/icons/geo-icon.png';

// Correct from components
import icon from '../assets/images/icons/geo-icon.png';

// Correct from nested locations - adjust ../
import icon from '../../../assets/images/icons/geo-icon.png';
```

## Image Optimization Tips

1. **Use appropriate formats**: PNG for transparency, JPG for complex backgrounds
2. **Import once**: Store imported images in variables for reuse
3. **Lazy load**: Load images only when needed for performance
4. **Cache**: React will cache imports across components automatically

## See Also

- [ASSETS.md](./ASSETS.md) - Complete asset inventory
- [IMAGE_ORGANIZATION.md](../../../scripts/IMAGE_ORGANIZATION.md) - Asset management guidelines
