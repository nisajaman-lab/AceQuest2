from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User, Role, PlayerProfile, PlayerSubjectProgress, PlayerChapterProgress, Subject, Chapter
from app.schemas import UserCreate, Token, UserResponse, UserProfileDetails, PlayerProfileResponse
from app.services.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _create_user_account(db: Session, user_data: UserCreate, role_name: str, is_admin: bool = False):
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )

    role = db.query(Role).filter(Role.name == role_name).first()
    role_id = role.id if role else (3 if is_admin else 1)

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        role_id=role_id,
        avatar_url=f"https://api.dicebear.com/7.x/pixel-art/svg?seed={user_data.username}",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_profile = PlayerProfile(
        user_id=new_user.id,
        total_exp=0,
        level=1,
        coins=50,
        achievement_points=0,
        login_streak=1,
        last_daily_claim=datetime.utcnow().date(),
    )
    db.add(new_profile)

    math_subject = db.query(Subject).filter(Subject.name == "Mathematics").first()
    if math_subject:
        sub_progress = PlayerSubjectProgress(
            user_id=new_user.id,
            subject_id=math_subject.id,
            is_unlocked=True,
            is_completed=False,
        )
        db.add(sub_progress)

        first_chapter = db.query(Chapter).filter(
            Chapter.subject_id == math_subject.id,
            Chapter.chapter_number == 1
        ).first()
        if first_chapter:
            ch_progress = PlayerChapterProgress(
                user_id=new_user.id,
                chapter_id=first_chapter.id,
                is_unlocked=True,
                is_completed=False,
            )
            db.add(ch_progress)

    db.commit()
    return new_user


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = _create_user_account(db, user_data, "student")
    access_token = create_access_token(
        data={"sub": new_user.username, "role_id": new_user.role_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/admin/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_admin(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = _create_user_account(db, user_data, "admin", is_admin=True)
    access_token = create_access_token(
        data={"sub": new_user.username, "role_id": new_user.role_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(
        data={"sub": user.username, "role_id": user.role_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/admin/login", response_model=Token)
def login_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.role or user.role.name != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is not an administrator account",
        )

    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(
        data={"sub": user.username, "role_id": user.role_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout():
    return {"detail": "Successfully logged out"}


@router.get("/me", response_model=UserProfileDetails)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    if not profile:
        profile = PlayerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return {
        "user": current_user,
        "profile": profile
    }
