from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date
from app.models import QuestionTypeEnum


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role_id: Optional[int] = None


# Role Schemas
class RoleResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    role_id: int
    avatar_url: Optional[str] = None
    skin_equipped: str
    created_at: datetime

    class Config:
        from_attributes = True


# Profile Schemas
class PlayerProfileResponse(BaseModel):
    id: int
    user_id: int
    total_exp: int
    level: int
    coins: int
    achievement_points: int
    login_streak: int
    last_daily_claim: Optional[date] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfileDetails(BaseModel):
    user: UserResponse
    profile: PlayerProfileResponse


# Subject / Chapter progress
class SubjectResponse(BaseModel):
    id: int
    name: str
    realm_name: Optional[str] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None
    unlock_skin_id: Optional[int] = None
    is_active: bool

    class Config:
        from_attributes = True


class ChapterResponse(BaseModel):
    id: int
    subject_id: int
    chapter_number: int
    title: str
    description: Optional[str] = None
    map_tileset_key: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class PlayerChapterProgressResponse(BaseModel):
    id: int
    chapter_id: int
    is_unlocked: bool
    is_completed: bool
    best_score: int
    attempts: int
    last_checkpoint_position: Optional[str] = None

    class Config:
        from_attributes = True


class PlayerSubjectProgressResponse(BaseModel):
    id: int
    subject_id: int
    is_unlocked: bool
    is_completed: bool

    class Config:
        from_attributes = True


# Question Schemas
class AnswerOptionResponse(BaseModel):
    id: int
    option_text: str
    display_order: Optional[int] = None

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: int
    chapter_id: int
    question_text: str
    question_type: QuestionTypeEnum
    difficulty: str
    hint: Optional[str] = None
    media_url: Optional[str] = None
    options: List[AnswerOptionResponse] = []

    class Config:
        from_attributes = True


class QuestionAnswerRequest(BaseModel):
    selected_answer: str


class AnswerResultResponse(BaseModel):
    is_correct: bool
    correct_answer: Optional[str] = None
    exp_gained: int
    coins_gained: int
    new_total_exp: int
    new_coins: int
    new_level: int
    level_up: bool
    chapter_completed: bool = False
    next_chapter_unlocked: bool = False
    next_chapter_id: Optional[int] = None


class SaveCheckpointRequest(BaseModel):
    chapter_id: int
    checkpoint_position: str  # e.g. "3/10" or coordinates "x,y"


class CheckpointSaveResponse(BaseModel):
    success: bool
    checkpoint_position: str


# Leaderboard
class LeaderboardEntry(BaseModel):
    username: str
    level: int
    total_exp: int
    avatar_url: Optional[str] = None


# Badges and Skins
class BadgeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    badge_type: Optional[str] = None
    condition_key: Optional[str] = None

    class Config:
        from_attributes = True


class SkinResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    preview_url: Optional[str] = None
    unlock_condition: Optional[str] = None
    is_default: bool

    class Config:
        from_attributes = True


# Admin Schemas
class UserUpdateAdmin(BaseModel):
    role_id: Optional[int] = None
    email: Optional[EmailStr] = None


class QuestionCreateAdmin(BaseModel):
    chapter_id: int
    question_text: str
    question_type: QuestionTypeEnum
    difficulty: str = "medium"
    hint: Optional[str] = None
    media_url: Optional[str] = None
    options: Optional[List[str]] = None  # text options for MCQ (first one correct or check options schema)
    correct_option_index: Optional[int] = None  # for MCQs, index of correct option
    accepted_answers: Optional[List[str]] = None  # for short/fill-in-blank text answers
