import enum
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    Text,
    Enum,
    JSON,
)
from sqlalchemy.orm import relationship
from app.db import Base


class QuestionTypeEnum(str, enum.Enum):
    multiple_choice = "multiple_choice"
    true_false = "true_false"
    fill_blank = "fill_blank"
    drag_drop = "drag_drop"
    short_answer = "short_answer"


# Roles
class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)  # 'student', 'teacher', 'admin'

    users = relationship("User", back_populates="role")


# Users
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), default=1)
    avatar_url = Column(Text, nullable=True)
    skin_equipped = Column(String(100), default="default")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    role = relationship("Role", back_populates="users")
    profile = relationship("PlayerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    chapter_progress = relationship("PlayerChapterProgress", back_populates="user", cascade="all, delete-orphan")
    subject_progress = relationship("PlayerSubjectProgress", back_populates="user", cascade="all, delete-orphan")
    question_attempts = relationship("QuestionAttempt", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("PlayerBadge", back_populates="user", cascade="all, delete-orphan")
    skins = relationship("PlayerSkin", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("PlayerAchievement", back_populates="user", cascade="all, delete-orphan")
    coin_transactions = relationship("CoinTransaction", back_populates="user", cascade="all, delete-orphan")
    game_sessions = relationship("GameSession", back_populates="user", cascade="all, delete-orphan")
    admin_logs = relationship("AdminLog", back_populates="admin")


# Player Stats
class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    total_exp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    coins = Column(Integer, default=0)
    achievement_points = Column(Integer, default=0)
    login_streak = Column(Integer, default=0)
    last_daily_claim = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


# Subjects
class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    realm_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    icon_url = Column(Text, nullable=True)
    unlock_skin_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)

    chapters = relationship("Chapter", back_populates="subject", cascade="all, delete-orphan")
    player_progress = relationship("PlayerSubjectProgress", back_populates="subject", cascade="all, delete-orphan")


# Chapters
class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"))
    chapter_number = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    map_tileset_key = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)

    subject = relationship("Subject", back_populates="chapters")
    questions = relationship("Question", back_populates="chapter", cascade="all, delete-orphan")
    npcs = relationship("NPC", back_populates="chapter", cascade="all, delete-orphan")
    player_progress = relationship("PlayerChapterProgress", back_populates="chapter", cascade="all, delete-orphan")
    game_sessions = relationship("GameSession", back_populates="chapter", cascade="all, delete-orphan")


# Questions
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"))
    question_text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionTypeEnum), nullable=False)
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    hint = Column(Text, nullable=True)
    media_url = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    chapter = relationship("Chapter", back_populates="questions")
    options = relationship("AnswerOption", back_populates="question", cascade="all, delete-orphan")
    accepted_answers = relationship("AcceptedAnswer", back_populates="question", cascade="all, delete-orphan")
    attempts = relationship("QuestionAttempt", back_populates="question", cascade="all, delete-orphan")


# Answer Options for MCQ / Drag & Drop
class AnswerOption(Base):
    __tablename__ = "answer_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    display_order = Column(Integer, nullable=True)

    question = relationship("Question", back_populates="options")


# Accepted Answers (fill_blank / short_answer)
class AcceptedAnswer(Base):
    __tablename__ = "accepted_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    answer_text = Column(Text, nullable=False)

    question = relationship("Question", back_populates="accepted_answers")


# Player Progress - Chapters
class PlayerChapterProgress(Base):
    __tablename__ = "player_chapter_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    is_unlocked = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)
    best_score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    last_checkpoint_position = Column(String(50), nullable=True)  # e.g., "3/10"
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="chapter_progress")
    chapter = relationship("Chapter", back_populates="player_progress")


# Player Progress - Subjects
class PlayerSubjectProgress(Base):
    __tablename__ = "player_subject_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    is_unlocked = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="subject_progress")
    subject = relationship("Subject", back_populates="player_progress")


# Question Attempts
class QuestionAttempt(Base):
    __tablename__ = "question_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    selected_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    exp_gained = Column(Integer, default=0)
    attempted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="question_attempts")
    question = relationship("Question", back_populates="attempts")


# Badges
class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(Text, nullable=True)
    badge_type = Column(String(50), nullable=True)  # 'chapter', 'subject', 'achievement', 'special'
    condition_key = Column(String(100), nullable=True)

    players = relationship("PlayerBadge", back_populates="badge", cascade="all, delete-orphan")


# Player Badges
class PlayerBadge(Base):
    __tablename__ = "player_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="players")


# Skins
class Skin(Base):
    __tablename__ = "skins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    preview_url = Column(Text, nullable=True)
    unlock_condition = Column(String(100), nullable=True)
    is_default = Column(Boolean, default=False)

    players = relationship("PlayerSkin", back_populates="skin", cascade="all, delete-orphan")


# Player Skins
class PlayerSkin(Base):
    __tablename__ = "player_skins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skin_id = Column(Integer, ForeignKey("skins.id"))
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="skins")
    skin = relationship("Skin", back_populates="players")


# Achievements
class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(Text, nullable=True)
    points_reward = Column(Integer, default=10)
    condition_key = Column(String(100), nullable=True)

    players = relationship("PlayerAchievement", back_populates="achievement", cascade="all, delete-orphan")


# Player Achievements
class PlayerAchievement(Base):
    __tablename__ = "player_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="players")


# Coin Transactions
class CoinTransaction(Base):
    __tablename__ = "coin_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    amount = Column(Integer, nullable=False)  # positive = gain, negative = spend
    reason = Column(String(200), nullable=True)  # 'daily_login', 'chapter_complete', etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="coin_transactions")


# NPCs
class NPC(Base):
    __tablename__ = "npcs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    npc_type = Column(String(50), nullable=True)  # 'mission_giver', 'hint', 'shop', 'guardian', etc.
    sprite_key = Column(String(100), nullable=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))

    chapter = relationship("Chapter", back_populates="npcs")
    dialogues = relationship("Dialogue", back_populates="npc", cascade="all, delete-orphan")


# Dialogues
class Dialogue(Base):
    __tablename__ = "dialogues"

    id = Column(Integer, primary_key=True, index=True)
    npc_id = Column(Integer, ForeignKey("npcs.id", ondelete="CASCADE"))
    trigger_condition = Column(String(100), nullable=True)  # 'on_approach', 'pre_question', etc.
    dialogue_text = Column(Text, nullable=False)
    display_order = Column(Integer, default=0)

    npc = relationship("NPC", back_populates="dialogues")


# Game Sessions
class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    exp_gained = Column(Integer, default=0)
    coins_gained = Column(Integer, default=0)

    user = relationship("User", back_populates="game_sessions")
    chapter = relationship("Chapter", back_populates="game_sessions")


# Admin Logs
class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(200), nullable=False)
    target_table = Column(String(100), nullable=True)
    target_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)
    performed_at = Column(DateTime, default=datetime.utcnow)

    admin = relationship("User", back_populates="admin_logs")
