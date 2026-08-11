from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.db import get_db
from app.models import (
    User,
    PlayerProfile,
    PlayerSubjectProgress,
    PlayerChapterProgress,
    PlayerBadge,
    PlayerSkin,
    Skin,
    Badge,
    CoinTransaction,
)
from app.schemas import (
    UserProfileDetails,
    PlayerProfileResponse,
    LeaderboardEntry,
    BadgeResponse,
    SkinResponse,
)
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/player", tags=["player"])


@router.get("/profile", response_model=UserProfileDetails)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    return {"user": current_user, "profile": profile}


@router.put("/profile", response_model=UserProfileDetails)
def update_profile(
    avatar_url: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if avatar_url:
        current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)
    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    return {"user": current_user, "profile": profile}


@router.get("/progress")
def get_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    subject_progress = (
        db.query(PlayerSubjectProgress)
        .filter(PlayerSubjectProgress.user_id == current_user.id)
        .all()
    )
    chapter_progress = (
        db.query(PlayerChapterProgress)
        .filter(PlayerChapterProgress.user_id == current_user.id)
        .all()
    )

    return {
        "subjects": [
            {
                "subject_id": sp.subject_id,
                "is_unlocked": sp.is_unlocked,
                "is_completed": sp.is_completed,
            }
            for sp in subject_progress
        ],
        "chapters": [
            {
                "chapter_id": cp.chapter_id,
                "is_unlocked": cp.is_unlocked,
                "is_completed": cp.is_completed,
                "best_score": cp.best_score,
                "attempts": cp.attempts,
                "last_checkpoint_position": cp.last_checkpoint_position,
            }
            for cp in chapter_progress
        ],
    }


@router.post("/daily-claim")
def claim_daily(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Player profile not found")

    today = datetime.utcnow().date()

    if profile.last_daily_claim == today:
        raise HTTPException(
            status_code=400,
            detail="Daily login bonus has already been claimed today.",
        )

    # Check streak
    if profile.last_daily_claim:
        yesterday = today - timedelta(days=1)
        if profile.last_daily_claim == yesterday:
            profile.login_streak += 1
        else:
            profile.login_streak = 1
    else:
        profile.login_streak = 1

    # Coins reward: 20 coins
    reward_amount = 20
    profile.coins += reward_amount
    profile.last_daily_claim = today

    # Record transaction
    transaction = CoinTransaction(
        user_id=current_user.id, amount=reward_amount, reason="daily_login"
    )
    db.add(transaction)
    db.commit()
    db.refresh(profile)

    return {
        "success": True,
        "coins_gained": reward_amount,
        "new_coins": profile.coins,
        "login_streak": profile.login_streak,
    }


@router.get("/badges", response_model=List[BadgeResponse])
def get_badges(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    player_badges = (
        db.query(PlayerBadge).filter(PlayerBadge.user_id == current_user.id).all()
    )
    badge_ids = [pb.badge_id for pb in player_badges]
    return db.query(Badge).filter(Badge.id.in_(badge_ids)).all() if badge_ids else []


@router.get("/skins", response_model=List[SkinResponse])
def get_skins(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Standard users always have the default skin
    default_skins = db.query(Skin).filter(Skin.is_default == True).all()
    player_skins = (
        db.query(PlayerSkin).filter(PlayerSkin.user_id == current_user.id).all()
    )
    unlocked_skin_ids = [ps.skin_id for ps in player_skins]

    unlocked_skins = (
        db.query(Skin).filter(Skin.id.in_(unlocked_skin_ids)).all()
        if unlocked_skin_ids
        else []
    )

    # Combine unique list
    all_skins = {s.id: s for s in default_skins + unlocked_skins}
    return list(all_skins.values())


@router.post("/equip-skin")
def equip_skin(
    skin_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if skin exists
    skin = db.query(Skin).filter(Skin.name == skin_name).first()
    if not skin:
        raise HTTPException(status_code=404, detail="Skin not found")

    # If not default, verify user unlocked it
    if not skin.is_default:
        unlocked = (
            db.query(PlayerSkin)
            .filter(
                PlayerSkin.user_id == current_user.id, PlayerSkin.skin_id == skin.id
            )
            .first()
        )
        if not unlocked:
            raise HTTPException(
                status_code=400, detail="Skin has not been unlocked yet"
            )

    current_user.skin_equipped = skin_name
    db.commit()

    return {"success": True, "skin_equipped": skin_name}


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    leaderboard = (
        db.query(PlayerProfile)
        .join(User)
        .order_by(PlayerProfile.total_exp.desc())
        .limit(20)
        .all()
    )

    entries = []
    for profile in leaderboard:
        entries.append(
            {
                "username": profile.user.username,
                "level": profile.level,
                "total_exp": profile.total_exp,
                "avatar_url": profile.user.avatar_url,
            }
        )
    return entries
