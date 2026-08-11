-- Database setup for AceQuest2

-- Create enum types
CREATE TYPE questiontypeenum AS ENUM ('multiple_choice', 'true_false', 'fill_blank', 'drag_drop', 'short_answer');

-- 1. Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) DEFAULT 1,
    avatar_url TEXT,
    skin_equipped VARCHAR(100) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 3. Player Profiles
CREATE TABLE player_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_exp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    achievement_points INTEGER DEFAULT 0,
    login_streak INTEGER DEFAULT 0,
    last_daily_claim DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    realm_name VARCHAR(100),
    description TEXT,
    icon_url TEXT,
    unlock_skin_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Chapters
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    map_tileset_key VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type questiontypeenum NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    hint TEXT,
    media_url TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Answer Options
CREATE TABLE answer_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    display_order INTEGER
);

-- 8. Accepted Answers
CREATE TABLE accepted_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL
);

-- 9. Player Chapter Progress
CREATE TABLE player_chapter_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INTEGER REFERENCES chapters(id),
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    best_score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    last_checkpoint_position VARCHAR(50),
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Player Subject Progress
CREATE TABLE player_subject_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id),
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP
);

-- 11. Question Attempts
CREATE TABLE question_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    chapter_id INTEGER REFERENCES chapters(id),
    selected_answer TEXT,
    is_correct BOOLEAN,
    exp_gained INTEGER DEFAULT 0,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Badges
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    badge_type VARCHAR(50),
    condition_key VARCHAR(100)
);

-- 13. Player Badges
CREATE TABLE player_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Skins
CREATE TABLE skins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    preview_url TEXT,
    unlock_condition VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE
);

-- 15. Player Skins
CREATE TABLE player_skins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skin_id INTEGER REFERENCES skins(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_reward INTEGER DEFAULT 10,
    condition_key VARCHAR(100)
);

-- 17. Player Achievements
CREATE TABLE player_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Coin Transactions
CREATE TABLE coin_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. NPCs
CREATE TABLE npcs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    npc_type VARCHAR(50),
    sprite_key VARCHAR(100),
    chapter_id INTEGER REFERENCES chapters(id)
);

-- 20. Dialogues
CREATE TABLE dialogues (
    id SERIAL PRIMARY KEY,
    npc_id INTEGER REFERENCES npcs(id) ON DELETE CASCADE,
    trigger_condition VARCHAR(100),
    dialogue_text TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 21. Game Sessions
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INTEGER REFERENCES chapters(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    exp_gained INTEGER DEFAULT 0,
    coins_gained INTEGER DEFAULT 0
);

-- 22. Admin Logs
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(200) NOT NULL,
    target_table VARCHAR(100),
    target_id INTEGER,
    details JSON,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================
-- INSERT SAMPLE DATA (From seed.py and realistic mock data)
-- ==============================================================

-- Seed Roles
INSERT INTO roles (name) VALUES 
('student'), 
('teacher'), 
('admin');

-- Seed Dummy Users
INSERT INTO users (username, email, password_hash, role_id) VALUES
('admin_user', 'admin@acequest.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 3),
('teacher_john', 'john@acequest.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2),
('student_amy', 'amy@student.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 1);

-- Seed Skins
INSERT INTO skins (name, description, preview_url, is_default, unlock_condition) VALUES
('default', 'Standard Agent Ragam teal uniform.', '/assets/skins/default.png', TRUE, NULL),
('skin-math-master', 'Unlocked by completing Mathematics.', '/assets/skins/math.png', FALSE, 'complete_subject_math'),
('skin-science-lab', 'Unlocked by completing Science.', '/assets/skins/science.png', FALSE, 'complete_subject_science'),
('skin-history-explorer', 'Unlocked by completing History.', '/assets/skins/history.png', FALSE, 'complete_subject_history'),
('skin-tech-coder', 'Unlocked by completing Computer Science.', '/assets/skins/cs.png', FALSE, 'complete_subject_cs'),
('skin-elite-agent', 'Reach Elite Agent level.', '/assets/skins/elite.png', FALSE, 'level_5');

-- Seed Subjects
INSERT INTO subjects (id, name, realm_name, description, icon_url) VALUES
(1, 'Mathematics', 'Logic Realm', 'Master numbers, algebra, and geometry in the clockwork Logic Realm.', '/assets/realm-icon-math.png'),
(2, 'Computer Science', 'Technology Realm', 'Decrypt systems, code algorithms, and hack firewalls in the server room tech realm.', '/assets/realm-icon-cs.png');

-- Fix sequence for subjects
SELECT setval('subjects_id_seq', (SELECT MAX(id) FROM subjects));

-- Seed Chapters
INSERT INTO chapters (id, subject_id, chapter_number, title, description, map_tileset_key) VALUES
(1, 1, 1, 'Numbers & Arithmetic', 'Unlock the gates of Logic Realm by solving number patterns and basic fractions.', 'tileset-logic-realm'),
(2, 1, 2, 'Algebra', 'Find the missing variables (X and Y) to restore power to the Logic Core.', 'tileset-logic-realm'),
(3, 2, 1, 'Data Representation', 'Learn binary, hexadecimal, and text encoding to interface with the mainframes.', 'tileset-tech-realm'),
(4, 2, 5, 'Algorithm & Programming', 'Trace code structures, conditional loops, and logic gates to stop the security virus.', 'tileset-tech-realm');

-- Fix sequence for chapters
SELECT setval('chapters_id_seq', (SELECT MAX(id) FROM chapters));

-- Seed Questions
INSERT INTO questions (id, chapter_id, question_text, question_type, difficulty, hint) VALUES
(1, 1, 'What is the value of 3/5 + 1/4?', 'multiple_choice', 'easy', 'Find the common denominator, which is 20.'),
(2, 1, 'Find the prime factors of 60.', 'multiple_choice', 'medium', 'Divide 60 continuously by prime numbers: 2, 3, 5...'),
(3, 1, 'Is 97 a prime number?', 'true_false', 'easy', 'A prime number is only divisible by 1 and itself. Try dividing by 2, 3, 5, 7.'),
(4, 2, 'Solve the equation for x: 3x + 7 = 22.', 'short_answer', 'easy', 'Subtract 7 from both sides, then divide by 3.'),
(5, 2, 'Factorise the quadratic expression: x^2 - 5x + 6.', 'multiple_choice', 'medium', 'Look for two numbers that multiply to 6 and add up to -5.'),
(6, 3, 'Convert the decimal number 13 into 4-bit binary.', 'short_answer', 'easy', 'Place values are 8, 4, 2, 1. 13 = 8 + 4 + 1.'),
(7, 3, 'Which of the following is the hexadecimal representation of the decimal number 254?', 'multiple_choice', 'medium', 'Divide 254 by 16. The quotient is 15 (F) and the remainder is 14 (E).'),
(8, 3, 'ASCII encoding uses 7 bits to represent character codes.', 'true_false', 'easy', 'Standard ASCII represents 128 characters (0 to 127). How many bits does it need?');

-- Fix sequence for questions
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

-- Seed Answer Options
INSERT INTO answer_options (question_id, option_text, is_correct, display_order) VALUES
(1, '17/20', TRUE, 1),
(1, '4/9', FALSE, 2),
(1, '3/20', FALSE, 3),
(1, '7/10', FALSE, 4),

(2, '2, 3, and 5', TRUE, 1),
(2, '2, 4, and 5', FALSE, 2),
(2, '3, 5, and 10', FALSE, 3),
(2, '2, 3, and 10', FALSE, 4),

(3, 'True', TRUE, 1),
(3, 'False', FALSE, 2),

(5, '(x - 2)(x - 3)', TRUE, 1),
(5, '(x + 2)(x + 3)', FALSE, 2),
(5, '(x - 1)(x - 6)', FALSE, 3),
(5, '(x + 1)(x - 6)', FALSE, 4),

(7, 'FE', TRUE, 1),
(7, 'FF', FALSE, 2),
(7, 'EF', FALSE, 3),
(7, 'E4', FALSE, 4),

(8, 'True', TRUE, 1),
(8, 'False', FALSE, 2);

-- Seed Accepted Answers
INSERT INTO accepted_answers (question_id, answer_text) VALUES
(4, '5'),
(4, 'x=5'),
(4, 'x = 5'),
(6, '1101'),
(6, '1101₂');

-- Seed NPCs
INSERT INTO npcs (id, name, npc_type, sprite_key, chapter_id) VALUES
(1, 'Commander Sarah', 'mission_giver', 'npc-commander', 1),
(2, 'Dr. Amina', 'hint', 'npc-hint-lady', 1),
(3, 'Guardian Algebra X', 'guardian', 'guardian-algebra', 2);

-- Fix sequence for npcs
SELECT setval('npcs_id_seq', (SELECT MAX(id) FROM npcs));

-- Seed Dialogues
INSERT INTO dialogues (npc_id, trigger_condition, dialogue_text, display_order) VALUES
(1, 'on_approach', 'Welcome to the field, Agent Ragam. The Forgetter has corrupted the Logic Realm! We need your analytical skills immediately.', 1),
(1, 'on_approach', 'Go speak with Dr. Amina to get a hint, and then tackle the Arithmetic gate to proceed.', 2),
(2, 'on_approach', 'Hello Agent. If you are struggling with fractions, always find the lowest common multiple for the denominators first!', 1),
(3, 'pre_question', 'HALT! I am the variable guardian. You cannot restore the Logic Core unless you solve my equations!', 1),
(3, 'post_correct', 'Argh! You solved for X! My equations are broken!', 1),
(3, 'post_wrong', 'Incorrect! The unknown variable remains hidden, and you weaken!', 1);
