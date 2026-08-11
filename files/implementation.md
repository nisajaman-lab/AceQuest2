# AceQuest: Agent Ragam and the Lost Knowledge
## Full Implementation Plan

---

## 1. Project Overview

**Game Title:** AceQuest: Agent Ragam and the Lost Knowledge  
**Genre:** Educational RPG / Top-Down Adventure  
**Platform:** Web Browser (Desktop-first, Mobile-responsive)  
**Target Audience:** O-Level / IGCSE Students in Brunei  
**Primary Goal:** Help students revise O-Level subjects while playing an engaging spy-themed RPG  

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| 2D Game Engine | Phaser 3 (embedded in React) |
| 3D Elements (cutscenes/UI) | Three.js (optional, for title screen / cutscenes) |
| Styling | Tailwind CSS |
| Backend | Python (FastAPI) |
| Database | PostgreSQL (via pgAdmin) |
| ORM | SQLAlchemy |
| Auth | JWT (JSON Web Tokens) |
| Real-time (future multiplayer) | Socket.IO |
| File Storage | Local / S3-compatible (Supabase Storage) |
| Free APIs | Open Trivia DB (fallback), DiceBear (avatar generation) |
| Deployment | Vercel (frontend) + Railway / Render (backend) |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   React Frontend                 │
│  ┌─────────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Home/Login │  │  Phaser 3 │  │  Admin    │  │
│  │  Dashboard  │  │  Game     │  │  Dashboard│  │
│  └─────────────┘  └───────────┘  └───────────┘  │
└────────────────────────┬────────────────────────┘
                         │ REST API (Axios)
┌────────────────────────▼────────────────────────┐
│              FastAPI (Python Backend)            │
│  Auth │ Player │ Game State │ Questions │ Admin  │
└────────────────────────┬────────────────────────┘
                         │ SQLAlchemy ORM
┌────────────────────────▼────────────────────────┐
│              PostgreSQL Database                 │
└─────────────────────────────────────────────────┘
```

---

## 4. Roles & Access Control

| Role | Access |
|---|---|
| **Student (Player)** | Home page, game, profile, leaderboard |
| **Teacher** | View student progress, assign subjects |
| **Admin** | Full dashboard, manage users, questions, subjects, analytics |

---

## 5. Page Structure

### 5.1 Public Pages
- `/` — Landing/Home Page
- `/login` — Role-based login
- `/register` — Student registration

### 5.2 Player Pages
- `/dashboard` — Player home (stats, daily login, notifications)
- `/subject-map` — Subject selection map (world map style)
- `/chapter-map/:subjectId` — Chapter selection for a subject
- `/game/:chapterId` — The actual Phaser 3 game session
- `/profile` — Player profile (badges, skins, achievements)
- `/leaderboard` — Global / subject leaderboard

### 5.3 Admin Pages
- `/admin` — Admin dashboard overview
- `/admin/users` — Manage students and teachers
- `/admin/questions` — CRUD questions per subject/chapter
- `/admin/subjects` — Manage subjects and chapters
- `/admin/analytics` — Player performance analytics
- `/admin/badges` — Manage badges and rewards

---

## 6. Subjects & Chapters (O-Level IGCSE Brunei)

### Subject Selection Map (World Map)
Each subject is a **realm** on the world map. Locked by default — unlocked after the introductory mission.

---

### 6.1 Mathematics (Logic Realm)
| Chapter | Topic |
|---|---|
| 1 | Numbers & Arithmetic |
| 2 | Algebra |
| 3 | Functions & Graphs |
| 4 | Geometry |
| 5 | Trigonometry |
| 6 | Statistics & Probability |
| 7 | Vectors & Transformations |

### 6.2 English Language (Language Realm)
| Chapter | Topic |
|---|---|
| 1 | Reading Comprehension |
| 2 | Summary Writing |
| 3 | Directed Writing |
| 4 | Continuous Writing / Composition |
| 5 | Listening Skills |

### 6.3 Combined Science / Physics (Discovery Realm — Physics)
| Chapter | Topic |
|---|---|
| 1 | Motion, Forces & Energy |
| 2 | Thermal Physics |
| 3 | Waves |
| 4 | Electricity & Magnetism |
| 5 | Atomic Physics |

### 6.4 Combined Science / Chemistry (Discovery Realm — Chemistry)
| Chapter | Topic |
|---|---|
| 1 | Particulate Nature of Matter |
| 2 | Experimental Chemistry |
| 3 | Atoms, Elements & Compounds |
| 4 | Chemical Reactions |
| 5 | Acids, Bases & Salts |
| 6 | Organic Chemistry |

### 6.5 Combined Science / Biology (Discovery Realm — Biology)
| Chapter | Topic |
|---|---|
| 1 | Characteristics of Living Things |
| 2 | Cell Biology |
| 3 | Movement in and out of Cells |
| 4 | Biological Molecules |
| 5 | Enzymes |
| 6 | Plant Nutrition & Transport |
| 7 | Human Nutrition & Transport |
| 8 | Respiration & Excretion |
| 9 | Coordination & Response |
| 10 | Reproduction |
| 11 | Inheritance & Evolution |
| 12 | Ecology |

### 6.6 Commerce / Business Studies (Commerce Realm)
| Chapter | Topic |
|---|---|
| 1 | Business Activity |
| 2 | Business Organisation |
| 3 | Business Finance |
| 4 | Marketing |
| 5 | Production & Operations |
| 6 | Human Resources |
| 7 | External Influences |

### 6.7 History (History Realm)
| Chapter | Topic |
|---|---|
| 1 | Brunei History & Government |
| 2 | World War II & Its Impact |
| 3 | The Cold War |
| 4 | United Nations |
| 5 | Independence Movements |
| 6 | Modern Southeast Asia |

### 6.8 Computer Science (Technology Realm)
| Chapter | Topic |
|---|---|
| 1 | Data Representation |
| 2 | Communication & Internet |
| 3 | Hardware & Software |
| 4 | Security |
| 5 | Algorithm & Programming |
| 6 | Databases |
| 7 | Ethics & Impacts |

### 6.9 Geography (Geography Realm)
| Chapter | Topic |
|---|---|
| 1 | Population |
| 2 | Settlement |
| 3 | Agriculture |
| 4 | Industry |
| 5 | Natural Hazards |
| 6 | Ecosystems |
| 7 | Water & Rivers |
| 8 | Coasts |
| 9 | Weather & Climate |

### 6.10 Malay Language (Language Realm — Malay)
| Chapter | Topic |
|---|---|
| 1 | Reading (Membaca) |
| 2 | Writing (Menulis) |
| 3 | Listening & Speaking |
| 4 | Grammar (Tatabahasa) |

---

## 7. Gameplay Design

### 7.1 Core Loop
```
Enter Chapter Map → Move Character → Encounter NPC/Event
→ Answer Question → Gain/Lose EXP → Checkpoint Save
→ Unlock Next Area → Complete Chapter → Earn Badge
→ Return to Subject Map → Select Next Chapter
```

### 7.2 Reward System

| Action | Reward |
|---|---|
| Correct answer | +10 EXP |
| Wrong answer | -5 EXP |
| Complete a chapter | +Badge + +50 EXP |
| Complete a subject | Unlock new character skin |
| Daily login | +20 Coins |
| Answer 5 in a row correctly | +Combo Bonus (+5 EXP each) |
| Complete chapter with 100% | +Achievement Point |
| First time completing chapter | +30 Coins |
| Help a classmate (multiplayer, future) | +10 Coins |

### 7.3 EXP & Leveling
```
Level 1: 0 - 100 EXP     → Trainee Agent
Level 2: 101 - 250 EXP   → Junior Agent
Level 3: 251 - 500 EXP   → Field Agent
Level 4: 501 - 900 EXP   → Senior Agent
Level 5: 901 - 1500 EXP  → Elite Agent
Level 6: 1501+ EXP       → Master Agent Ragam
```

### 7.4 NPC Types

| NPC Type | Role |
|---|---|
| **Mission Giver NPC** | Starts chapter, gives story briefing |
| **Hint NPC** | Gives a clue before a hard question (costs 5 Coins) |
| **Shop NPC** | Sells cosmetics/skins using Coins |
| **Guardian NPC** | Mini-boss — must answer series of questions to defeat |
| **Friendly NPC** | Gives lore, backstory, and world-building dialogue |
| **Checkpoint NPC** | Safehouse keeper — saves progress |

### 7.5 Question Types
- Multiple Choice (4 options)
- True / False
- Fill in the Blank
- Drag and Drop (match answer)
- Short Answer (text input, keyword match)

### 7.6 Map Design (per chapter)
- Top-down 2D tile map using Phaser 3 + Tiled Map Editor
- Player moves with WASD / Arrow Keys
- Interact with NPCs using `E` key or click
- Fog of war — locked areas are darkened until unlocked
- Safehouse (checkpoint) glows when active

---

## 8. Game Engine: Phaser 3 Integration with React

```
/src
  /game
    /scenes
      BootScene.js         ← Preload assets
      MainMenuScene.js     ← Title screen
      WorldMapScene.js     ← Subject map
      ChapterMapScene.js   ← Chapter map per subject
      GameScene.js         ← Main gameplay scene
      DialogScene.js       ← NPC dialogue overlay
      QuestionScene.js     ← Question popup UI
      CutsceneScene.js     ← Story cutscenes
      CheckpointScene.js   ← Save point animation
    /objects
      Player.js
      NPC.js
      Guardian.js
      Checkpoint.js
    /systems
      QuestManager.js
      RewardManager.js
      DialogManager.js
      SaveManager.js
    PhaserConfig.js
  /components
    GameCanvas.jsx         ← React wrapper for Phaser
    HUD.jsx                ← EXP bar, coins, badges overlay
    QuestionModal.jsx      ← Question popup
    DialogBox.jsx          ← NPC speech box
    SubjectMap.jsx
    ChapterMap.jsx
```

---

## 9. Database Schema (PostgreSQL)

### 9.1 Users & Auth

```sql
-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- 'student', 'teacher', 'admin'
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INT REFERENCES roles(id) DEFAULT 1,
    avatar_url TEXT,
    skin_equipped VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

### 9.2 Player Stats

```sql
-- Player Profile
CREATE TABLE player_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    total_exp INT DEFAULT 0,
    level INT DEFAULT 1,
    coins INT DEFAULT 0,
    achievement_points INT DEFAULT 0,
    login_streak INT DEFAULT 0,
    last_daily_claim DATE,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9.3 Subjects & Chapters

```sql
-- Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    realm_name VARCHAR(100),
    description TEXT,
    icon_url TEXT,
    unlock_skin_id INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Chapters
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    map_tileset_key VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);
```

### 9.4 Questions

```sql
-- Question Types ENUM
CREATE TYPE question_type AS ENUM (
    'multiple_choice', 'true_false', 'fill_blank',
    'drag_drop', 'short_answer'
);

-- Questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',  -- easy, medium, hard
    hint TEXT,
    media_url TEXT,  -- optional image/diagram
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Answer Options (for MCQ)
CREATE TABLE answer_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    display_order INT
);

-- For fill_blank / short_answer
CREATE TABLE accepted_answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL  -- supports multiple accepted values
);
```

### 9.5 Player Progress

```sql
-- Chapter Progress
CREATE TABLE player_chapter_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES chapters(id),
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    best_score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    last_checkpoint_position VARCHAR(50),  -- e.g., "3/10"
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subject Progress
CREATE TABLE player_subject_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id),
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- Question Attempts
CREATE TABLE question_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id),
    chapter_id INT REFERENCES chapters(id),
    selected_answer TEXT,
    is_correct BOOLEAN,
    exp_gained INT,
    attempted_at TIMESTAMP DEFAULT NOW()
);
```

### 9.6 Rewards System

```sql
-- Badges
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    badge_type VARCHAR(50),  -- 'chapter', 'subject', 'achievement', 'special'
    condition_key VARCHAR(100)  -- e.g., 'complete_chapter_1_math'
);

-- Player Badges
CREATE TABLE player_badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW()
);

-- Skins
CREATE TABLE skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    preview_url TEXT,
    unlock_condition VARCHAR(100),  -- e.g., 'complete_subject_math'
    is_default BOOLEAN DEFAULT FALSE
);

-- Player Skins
CREATE TABLE player_skins (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    skin_id INT REFERENCES skins(id),
    unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_reward INT DEFAULT 10,
    condition_key VARCHAR(100)
);

-- Player Achievements
CREATE TABLE player_achievements (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT NOW()
);

-- Coin Transactions
CREATE TABLE coin_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,  -- positive = gain, negative = spend
    reason VARCHAR(200),  -- 'daily_login', 'chapter_complete', 'hint_purchase'
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 9.7 NPC & Dialogue

```sql
-- NPCs
CREATE TABLE npcs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    npc_type VARCHAR(50),  -- 'mission_giver', 'hint', 'shop', 'guardian', 'friendly', 'checkpoint'
    sprite_key VARCHAR(100),
    chapter_id INT REFERENCES chapters(id)
);

-- Dialogues
CREATE TABLE dialogues (
    id SERIAL PRIMARY KEY,
    npc_id INT REFERENCES npcs(id) ON DELETE CASCADE,
    trigger_condition VARCHAR(100),  -- 'on_approach', 'pre_question', 'post_correct', 'post_wrong'
    dialogue_text TEXT NOT NULL,
    display_order INT DEFAULT 0
);
```

### 9.8 Game Sessions

```sql
-- Game Sessions (for analytics)
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES chapters(id),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    exp_gained INT DEFAULT 0,
    coins_gained INT DEFAULT 0
);
```

### 9.9 Admin Logs

```sql
-- Admin Action Logs
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES users(id),
    action VARCHAR(200) NOT NULL,
    target_table VARCHAR(100),
    target_id INT,
    details JSONB,
    performed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. API Endpoints (FastAPI)

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Player
```
GET  /api/player/profile
PUT  /api/player/profile
GET  /api/player/progress
POST /api/player/daily-claim
GET  /api/player/badges
GET  /api/player/skins
POST /api/player/equip-skin
GET  /api/player/achievements
GET  /api/player/leaderboard
```

### Game
```
GET  /api/subjects
GET  /api/subjects/:id/chapters
GET  /api/chapters/:id
GET  /api/chapters/:id/questions
POST /api/questions/:id/answer
POST /api/game/save-checkpoint
GET  /api/game/session/:chapterId
```

### Admin
```
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/analytics/overview
GET    /api/admin/analytics/subject/:id
POST   /api/admin/questions
PUT    /api/admin/questions/:id
DELETE /api/admin/questions/:id
POST   /api/admin/badges
PUT    /api/admin/badges/:id
GET    /api/admin/logs
```

---

## 11. Home Page Design

### Player Home (`/dashboard`)
- **Top Bar:** Agent Ragam logo + player name + EXP bar + Coins + Notifications bell
- **Hero Banner:** Daily mission card with login streak and claim button
- **Quick Stats:** Level, Total EXP, Badges earned, Subjects completed
- **Subject Map Preview:** Visual realm map (click to go to `/subject-map`)
- **Recent Activity Feed:** Last played chapter, last badge earned
- **Leaderboard Snippet:** Top 3 players this week
- **Announcements:** Teacher/admin messages

### Landing Page (`/`)
- Game logo + animated title
- "Play Now" button (redirect to login/register)
- Game trailer or animated preview
- Feature highlights (subjects, gameplay, rewards)
- Footer

---

## 12. Admin Dashboard Design

### Overview
- **Stats Cards:** Total students, Active today, Questions answered today, New registrations
- **Charts:**
  - Weekly active users (line chart)
  - Top subjects played (bar chart)
  - Accuracy rate per subject (radar chart)
- **Quick Actions:** Add question, Add chapter, View logs

### Sections
- **User Management:** Table of all users with filters, role editing, ban/unban
- **Question Bank:** CRUD editor per subject/chapter with difficulty tagging
- **Analytics:** Per-student and per-subject drill-down
- **Badge & Reward Manager:** Create badges, assign conditions
- **Announcement Board:** Broadcast messages to all players
- **Audit Logs:** Admin action history

---

## 13. Storyline Structure

### Opening Cutscene (Three.js animated)
```
Scene 1: Dark void — shattered glowing crystals floating
Scene 2: Title card — "The Forgetter has struck..."
Scene 3: TSA Headquarters briefing room
Scene 4: Commander introduces Agent Ragam
Scene 5: Player customizes character name/skin
Scene 6: First mission assigned — Mathematics Division
```

### Chapter Structure
```
Intro Dialogue → Map Exploration → NPC Encounters
→ Question Challenges → Mini-Boss Guardian
→ Knowledge Crystal Recovered → Cutscene reward
→ Checkpoint / Safehouse saved
```

### Subject Completion
```
All chapters cleared → Subject Guardian defeated
→ Realm restored → Skin unlocked
→ Cinematic: "The Forgetter loses power..."
→ New realm unlocked on world map
```

---

## 14. Free APIs to Use

| API | Purpose | URL |
|---|---|---|
| Open Trivia DB | Fallback question bank | https://opentdb.com/api_config.php |
| DiceBear | Avatar / NPC sprite generation | https://www.dicebear.com/how-to-use/http-api |
| Kenney Assets | Free game sprites/tiles | https://kenney.nl/assets |
| Freesound | Free sound effects (see assets.md) | https://freesound.org |
| Google Fonts | Game UI typography | https://fonts.google.com |

---

## 15. Folder Structure

```
acequest/
├── frontend/                    # React + Vite
│   ├── public/
│   │   └── assets/              # See assets.md
│   ├── src/
│   │   ├── game/                # Phaser 3 scenes & objects
│   │   ├── components/          # React UI components
│   │   ├── pages/               # Route pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Zustand / Redux state
│   │   ├── api/                 # Axios API calls
│   │   └── utils/
│   └── vite.config.js
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── routers/             # auth, player, game, admin
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   ├── db.py                # DB connection
│   │   └── main.py
│   ├── alembic/                 # DB migrations
│   └── requirements.txt
│
├── implementation.md            # This file
├── assets.md                    # Asset list
└── README.md
```

---

## 16. Development Phases

### Phase 1 — Foundation (Weeks 1–3)
- Set up React + Vite + Phaser 3 project
- Set up FastAPI + PostgreSQL
- Implement auth (register/login/JWT)
- Create DB schema + seed data
- Basic player dashboard

### Phase 2 — Core Game (Weeks 4–7)
- Build Phaser 3 game scenes (WorldMap, ChapterMap, GameScene)
- Player movement, NPC interaction, dialogue system
- Question modal + answer system
- EXP/Coins reward system
- Checkpoint save system

### Phase 3 — Content (Weeks 8–10)
- Add all subjects and chapters
- Write/seed questions for at least 2 subjects
- NPC dialogue for each chapter
- Cutscene system (Three.js or Phaser animations)

### Phase 4 — Rewards & Polish (Weeks 11–13)
- Badge system
- Skin unlock and equip
- Achievement system
- Daily login coins
- Leaderboard

### Phase 5 — Admin & Analytics (Week 14–15)
- Admin dashboard
- Question CRUD
- Analytics charts (Recharts)
- Audit logs

### Phase 6 — Testing & Deployment (Week 16)
- Bug fixes
- Performance optimization
- Deploy frontend (Vercel) + backend (Railway)
- Final demo

---

## 17. Key Dependencies

### Frontend
```json
{
  "phaser": "^3.70.0",
  "three": "^0.165.0",
  "react": "^18.3.0",
  "react-router-dom": "^6.23.0",
  "axios": "^1.7.0",
  "zustand": "^4.5.0",
  "tailwindcss": "^3.4.0",
  "recharts": "^2.12.0",
  "framer-motion": "^11.0.0"
}
```

### Backend
```
fastapi
uvicorn
sqlalchemy
asyncpg
alembic
pydantic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
```
