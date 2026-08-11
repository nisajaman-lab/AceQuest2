from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from datetime import datetime

from app.db import get_db
from app.models import (
    User,
    Role,
    PlayerProfile,
    Question,
    AnswerOption,
    AcceptedAnswer,
    Badge,
    AdminLog,
    QuestionAttempt,
    Subject,
    Chapter,
    QuestionTypeEnum,
)
from app.schemas import (
    UserResponse,
    UserUpdateAdmin,
    QuestionCreateAdmin,
    QuestionResponse,
    BadgeResponse,
)
from app.services.auth import get_current_admin, get_password_hash

router = APIRouter(prefix="/api/admin", tags=["admin"])


def log_admin_action(
    db: Session,
    admin_id: int,
    action: str,
    target_table: str = None,
    target_id: int = None,
    details: dict = None,
):
    log = AdminLog(
        admin_id=admin_id,
        action=action,
        target_table=target_table,
        target_id=target_id,
        details=details,
    )
    db.add(log)
    db.commit()


def _serialize_question(question: Question):
    return {
        "id": question.id,
        "chapter_id": question.chapter_id,
        "question_text": question.question_text,
        "question_type": question.question_type.value if hasattr(question.question_type, "value") else question.question_type,
        "difficulty": question.difficulty,
        "hint": question.hint,
        "media_url": question.media_url,
        "options": [
            {"id": opt.id, "option_text": opt.option_text, "display_order": opt.display_order, "is_correct": opt.is_correct}
            for opt in question.options
        ],
        "accepted_answers": [
            {"id": ans.id, "answer_text": ans.answer_text} for ans in question.accepted_answers
        ],
    }


def _coerce_question_type(value):
    if isinstance(value, QuestionTypeEnum):
        return value
    if isinstance(value, str):
        return QuestionTypeEnum(value)
    return QuestionTypeEnum.multiple_choice


@router.get("/users")
def list_users(
    db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)
):
    users = db.query(User).all()
    results = []
    for u in users:
        role_name = u.role.name if u.role else "student"
        profile = (
            db.query(PlayerProfile).filter(PlayerProfile.user_id == u.id).first()
        )
        results.append(
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": role_name,
                "role_id": u.role_id,
                "avatar_url": u.avatar_url,
                "skin_equipped": u.skin_equipped,
                "created_at": u.created_at,
                "last_login": u.last_login,
                "profile": {
                    "level": profile.level if profile else 1,
                    "total_exp": profile.total_exp if profile else 0,
                    "coins": profile.coins if profile else 0,
                }
                if profile
                else None,
            }
        )
    return results


@router.post("/users")
def create_user(
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    username = (req.get("username") or "").strip()
    email = (req.get("email") or "").strip()
    password = req.get("password") or ""
    role_id = req.get("role_id")

    if not username or not email or not password:
        raise HTTPException(status_code=400, detail="Username, email, and password are required")

    existing_user = db.query(User).filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    if role_id is not None:
        role = db.query(Role).filter(Role.id == role_id).first()
        if not role:
            raise HTTPException(status_code=400, detail="Invalid role ID")
    else:
        role = db.query(Role).filter(Role.name == "student").first()
        role_id = role.id if role else 1

    hashed_password = get_password_hash(password)
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role_id=role_id,
        avatar_url=f"https://api.dicebear.com/7.x/pixel-art/svg?seed={username}",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    profile = PlayerProfile(user_id=new_user.id, total_exp=0, level=1, coins=50, achievement_points=0, login_streak=1, last_daily_claim=datetime.utcnow().date())
    db.add(profile)
    db.commit()

    log_admin_action(db, current_admin.id, f"created_user_{new_user.username}", "users", new_user.id)
    return {"success": True, "user": {"id": new_user.id, "username": new_user.username, "role_id": new_user.role_id}}


@router.put("/users/{user_id}")
def update_user_role(
    user_id: int,
    req: UserUpdateAdmin,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if req.role_id is not None:
        role = db.query(Role).filter(Role.id == req.role_id).first()
        if not role:
            raise HTTPException(status_code=400, detail="Invalid role ID")
        user.role_id = req.role_id

    if req.email is not None:
        user.email = req.email

    db.commit()

    log_admin_action(
        db,
        current_admin.id,
        f"updated_user_profile_{user.username}",
        "users",
        user.id,
        {"role_id": req.role_id, "email": req.email},
    )
    return {"success": True, "user_id": user_id}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=400, detail="Cannot delete your own admin account."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    username = user.username
    db.delete(user)
    db.commit()

    log_admin_action(
        db, current_admin.id, f"deleted_user_{username}", "users", user_id
    )
    return {"success": True}


@router.get("/subjects")
def list_subjects(
    db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)
):
    return db.query(Subject).order_by(Subject.id.asc()).all()


@router.post("/subjects")
def create_subject(
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    name = (req.get("name") or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Subject name is required")

    subject = Subject(
        name=name,
        realm_name=(req.get("realm_name") or "").strip() or None,
        description=(req.get("description") or "").strip() or None,
        icon_url=(req.get("icon_url") or "").strip() or None,
        is_active=bool(req.get("is_active", True)),
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)

    log_admin_action(db, current_admin.id, f"created_subject_{subject.name}", "subjects", subject.id)
    return {"success": True, "subject": subject}


@router.put("/subjects/{subject_id}")
def update_subject(
    subject_id: int,
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    if req.get("name") is not None:
        subject.name = req["name"]
    if req.get("realm_name") is not None:
        subject.realm_name = req["realm_name"] or None
    if req.get("description") is not None:
        subject.description = req["description"] or None
    if req.get("icon_url") is not None:
        subject.icon_url = req["icon_url"] or None
    if req.get("is_active") is not None:
        subject.is_active = bool(req["is_active"])
    db.commit()
    log_admin_action(db, current_admin.id, f"updated_subject_{subject.id}", "subjects", subject.id)
    return {"success": True, "subject": subject}


@router.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
    log_admin_action(db, current_admin.id, f"deleted_subject_{subject_id}", "subjects", subject_id)
    return {"success": True}


@router.get("/chapters")
def list_chapters(
    subject_id: int | None = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(Chapter)
    if subject_id is not None:
        query = query.filter(Chapter.subject_id == subject_id)
    return query.order_by(Chapter.subject_id.asc(), Chapter.chapter_number.asc()).all()


@router.post("/chapters")
def create_chapter(
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    subject_id = req.get("subject_id")
    chapter_number = req.get("chapter_number")
    title = (req.get("title") or "").strip()
    if not subject_id or not chapter_number or not title:
        raise HTTPException(status_code=400, detail="Subject, chapter number, and title are required")
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    chapter = Chapter(
        subject_id=subject_id,
        chapter_number=chapter_number,
        title=title,
        description=(req.get("description") or "").strip() or None,
        map_tileset_key=(req.get("map_tileset_key") or "").strip() or None,
        is_active=bool(req.get("is_active", True)),
    )
    db.add(chapter)
    db.commit()
    db.refresh(chapter)
    log_admin_action(db, current_admin.id, f"created_chapter_{chapter.id}", "chapters", chapter.id)
    return {"success": True, "chapter": chapter}


@router.put("/chapters/{chapter_id}")
def update_chapter(
    chapter_id: int,
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    if req.get("subject_id") is not None:
        chapter.subject_id = req["subject_id"]
    if req.get("chapter_number") is not None:
        chapter.chapter_number = req["chapter_number"]
    if req.get("title") is not None:
        chapter.title = req["title"]
    if req.get("description") is not None:
        chapter.description = req["description"] or None
    if req.get("map_tileset_key") is not None:
        chapter.map_tileset_key = req["map_tileset_key"] or None
    if req.get("is_active") is not None:
        chapter.is_active = bool(req["is_active"])
    db.commit()
    log_admin_action(db, current_admin.id, f"updated_chapter_{chapter.id}", "chapters", chapter.id)
    return {"success": True, "chapter": chapter}


@router.delete("/chapters/{chapter_id}")
def delete_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    db.delete(chapter)
    db.commit()
    log_admin_action(db, current_admin.id, f"deleted_chapter_{chapter_id}", "chapters", chapter_id)
    return {"success": True}


@router.get("/badges")
def list_badges(
    db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)
):
    return db.query(Badge).order_by(Badge.id.asc()).all()


@router.post("/badges")
def create_badge(
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    name = (req.get("name") or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Badge name is required")

    badge = Badge(
        name=name,
        description=(req.get("description") or "").strip() or None,
        icon_url=(req.get("icon_url") or "").strip() or None,
        badge_type=(req.get("badge_type") or "").strip() or None,
        condition_key=(req.get("condition_key") or "").strip() or None,
    )
    db.add(badge)
    db.commit()
    db.refresh(badge)

    log_admin_action(db, current_admin.id, f"created_badge_{badge.name}", "badges", badge.id)
    return {"success": True, "badge": badge}


@router.put("/badges/{badge_id}")
def update_badge(
    badge_id: int,
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")

    if req.get("name") is not None:
        badge.name = req["name"]
    if req.get("description") is not None:
        badge.description = req["description"] or None
    if req.get("icon_url") is not None:
        badge.icon_url = req["icon_url"] or None
    if req.get("badge_type") is not None:
        badge.badge_type = req["badge_type"] or None
    if req.get("condition_key") is not None:
        badge.condition_key = req["condition_key"] or None

    db.commit()
    log_admin_action(db, current_admin.id, f"updated_badge_{badge.id}", "badges", badge.id)
    return {"success": True, "badge": badge}


@router.delete("/badges/{badge_id}")
def delete_badge(
    badge_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")

    db.delete(badge)
    db.commit()
    log_admin_action(db, current_admin.id, f"deleted_badge_{badge_id}", "badges", badge_id)
    return {"success": True}


@router.get("/analytics/overview")
def get_analytics_overview(
    db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)
):
    total_users = db.query(func.count(User.id)).scalar()
    total_students = (
        db.query(func.count(User.id))
        .join(Role)
        .filter(Role.name == "student")
        .scalar()
    )
    total_teachers = (
        db.query(func.count(User.id))
        .join(Role)
        .filter(Role.name == "teacher")
        .scalar()
    )
    total_questions = db.query(func.count(Question.id)).scalar()
    total_attempts = db.query(func.count(QuestionAttempt.id)).scalar()

    correct_attempts = (
        db.query(func.count(QuestionAttempt.id))
        .filter(QuestionAttempt.is_correct == True)
        .scalar()
    )
    overall_accuracy = (
        (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0
    )

    subjects = db.query(Subject).all()
    sub_analytics = []
    for sub in subjects:
        attempts_sub = (
            db.query(QuestionAttempt)
            .join(Question)
            .join(Chapter)
            .filter(Chapter.subject_id == sub.id)
            .count()
        )
        correct_sub = (
            db.query(QuestionAttempt)
            .join(Question)
            .join(Chapter)
            .filter(Chapter.subject_id == sub.id, QuestionAttempt.is_correct == True)
            .count()
        )
        accuracy = (correct_sub / attempts_sub * 100) if attempts_sub > 0 else 0
        sub_analytics.append(
            {
                "id": sub.id,
                "name": sub.name,
                "realm": sub.realm_name,
                "attempts": attempts_sub,
                "accuracy": round(accuracy, 1),
            }
        )

    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_questions": total_questions,
        "total_attempts": total_attempts,
        "overall_accuracy": round(overall_accuracy, 1),
        "subjects": sub_analytics,
    }


@router.get("/questions")
def list_questions(
    chapter_id: int | None = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    query = db.query(Question)
    if chapter_id is not None:
        query = query.filter(Question.chapter_id == chapter_id)
    questions = query.order_by(Question.id.asc()).all()
    return [_serialize_question(q) for q in questions]


@router.post("/questions")
def create_question(
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    chapter_id = req.get("chapter_id")
    question_text = (req.get("question_text") or "").strip()
    if not chapter_id or not question_text:
        raise HTTPException(status_code=400, detail="Chapter and question text are required")

    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=400, detail="Chapter not found")

    question_type = _coerce_question_type(req.get("question_type") or "multiple_choice")
    new_q = Question(
        chapter_id=chapter_id,
        question_text=question_text,
        question_type=question_type,
        difficulty=(req.get("difficulty") or "medium"),
        hint=(req.get("hint") or "").strip() or None,
        media_url=(req.get("media_url") or "").strip() or None,
        created_by=current_admin.id,
    )
    db.add(new_q)
    db.commit()
    db.refresh(new_q)

    if question_type in [QuestionTypeEnum.multiple_choice, QuestionTypeEnum.true_false]:
        options = req.get("options") or []
        if question_type == QuestionTypeEnum.true_false:
            options = ["True", "False"]
        for index, opt_text in enumerate(options):
            is_correct = index == (req.get("correct_option_index") or 0)
            opt = AnswerOption(
                question_id=new_q.id,
                option_text=str(opt_text),
                is_correct=is_correct,
                display_order=index + 1,
            )
            db.add(opt)
    elif question_type in [QuestionTypeEnum.short_answer, QuestionTypeEnum.fill_blank]:
        accepted_answers = req.get("accepted_answers") or []
        for ans_text in accepted_answers:
            ans = AcceptedAnswer(question_id=new_q.id, answer_text=str(ans_text))
            db.add(ans)

    db.commit()
    db.refresh(new_q)

    log_admin_action(
        db,
        current_admin.id,
        f"created_question_{new_q.id}",
        "questions",
        new_q.id,
    )
    return {"success": True, "question": _serialize_question(new_q)}


@router.put("/questions/{question_id}")
def update_question(
    question_id: int,
    req: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    if req.get("chapter_id") is not None:
        q.chapter_id = req["chapter_id"]
    if req.get("question_text") is not None:
        q.question_text = req["question_text"]
    if req.get("question_type") is not None:
        q.question_type = _coerce_question_type(req["question_type"])
    if req.get("difficulty") is not None:
        q.difficulty = req["difficulty"]
    if req.get("hint") is not None:
        q.hint = req["hint"] or None
    if req.get("media_url") is not None:
        q.media_url = req["media_url"] or None

    db.query(AnswerOption).filter(AnswerOption.question_id == q.id).delete()
    db.query(AcceptedAnswer).filter(AcceptedAnswer.question_id == q.id).delete()

    question_type = q.question_type
    if question_type in [QuestionTypeEnum.multiple_choice, QuestionTypeEnum.true_false]:
        options = req.get("options") or []
        if question_type == QuestionTypeEnum.true_false:
            options = ["True", "False"]
        for index, opt_text in enumerate(options):
            is_correct = index == (req.get("correct_option_index") or 0)
            db.add(AnswerOption(question_id=q.id, option_text=str(opt_text), is_correct=is_correct, display_order=index + 1))
    elif question_type in [QuestionTypeEnum.short_answer, QuestionTypeEnum.fill_blank]:
        accepted_answers = req.get("accepted_answers") or []
        for ans_text in accepted_answers:
            db.add(AcceptedAnswer(question_id=q.id, answer_text=str(ans_text)))

    db.commit()
    db.refresh(q)
    log_admin_action(db, current_admin.id, f"updated_question_{q.id}", "questions", q.id)
    return {"success": True, "question": _serialize_question(q)}


@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(q)
    db.commit()

    log_admin_action(
        db, current_admin.id, f"deleted_question_{question_id}", "questions", question_id
    )
    return {"success": True}


@router.get("/logs")
def list_logs(
    db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)
):
    logs = db.query(AdminLog).order_by(AdminLog.performed_at.desc()).limit(100).all()
    results = []
    for log in logs:
        results.append(
            {
                "id": log.id,
                "admin_username": log.admin.username if log.admin else "system",
                "action": log.action,
                "target_table": log.target_table,
                "target_id": log.target_id,
                "details": log.details,
                "performed_at": log.performed_at,
            }
        )
    return results
