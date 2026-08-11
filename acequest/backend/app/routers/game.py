from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from app.db import get_db
from app.models import (
    User,
    PlayerProfile,
    Subject,
    Chapter,
    Question,
    AnswerOption,
    AcceptedAnswer,
    PlayerChapterProgress,
    PlayerSubjectProgress,
    QuestionAttempt,
    Badge,
    PlayerBadge,
    Skin,
    PlayerSkin,
    CoinTransaction,
    NPC,
    Dialogue,
    GameSession,
)
from app.schemas import (
    SubjectResponse,
    ChapterResponse,
    QuestionResponse,
    QuestionAnswerRequest,
    AnswerResultResponse,
    SaveCheckpointRequest,
    CheckpointSaveResponse,
)
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/game", tags=["game"])


@router.get("/subjects", response_model=List[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).filter(Subject.is_active == True).all()


@router.get("/subjects/{subject_id}/chapters")
def get_subject_chapters(
    subject_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    chapters = (
        db.query(Chapter)
        .filter(Chapter.subject_id == subject_id, Chapter.is_active == True)
        .order_by(Chapter.chapter_number.asc())
        .all()
    )

    # Fetch player progress for these chapters
    progress_map = {}
    progress_entries = (
        db.query(PlayerChapterProgress)
        .filter(PlayerChapterProgress.user_id == current_user.id)
        .all()
    )
    for p in progress_entries:
        progress_map[p.chapter_id] = p

    results = []
    for c in chapters:
        prog = progress_map.get(c.id)
        # First chapter is always unlocked
        is_unlocked = prog.is_unlocked if prog else (c.chapter_number == 1)
        results.append(
            {
                "id": c.id,
                "chapter_number": c.chapter_number,
                "title": c.title,
                "description": c.description,
                "map_tileset_key": c.map_tileset_key,
                "is_unlocked": is_unlocked,
                "is_completed": prog.is_completed if prog else False,
                "best_score": prog.best_score if prog else 0,
                "attempts": prog.attempts if prog else 0,
                "last_checkpoint_position": prog.last_checkpoint_position if prog else None,
            }
        )
    return results


@router.get("/chapters/{chapter_id}")
def get_chapter_details(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    # Verify unlocked (first chapter always accessible)
    prog = (
        db.query(PlayerChapterProgress)
        .filter(
            PlayerChapterProgress.user_id == current_user.id,
            PlayerChapterProgress.chapter_id == chapter_id,
        )
        .first()
    )
    is_unlocked = prog.is_unlocked if prog else (chapter.chapter_number == 1)
    if not is_unlocked:
        raise HTTPException(
            status_code=403, detail="This chapter has not been unlocked yet."
        )

    # Fetch NPCs and their dialogues
    npcs = db.query(NPC).filter(NPC.chapter_id == chapter_id).all()
    npc_details = []
    for npc in npcs:
        dialogues = (
            db.query(Dialogue)
            .filter(Dialogue.npc_id == npc.id)
            .order_by(Dialogue.display_order.asc())
            .all()
        )
        npc_details.append(
            {
                "id": npc.id,
                "name": npc.name,
                "npc_type": npc.npc_type,
                "sprite_key": npc.sprite_key,
                "dialogues": [
                    {
                        "trigger_condition": d.trigger_condition,
                        "dialogue_text": d.dialogue_text,
                        "display_order": d.display_order,
                    }
                    for d in dialogues
                ],
            }
        )

    return {
        "id": chapter.id,
        "subject_id": chapter.subject_id,
        "chapter_number": chapter.chapter_number,
        "title": chapter.title,
        "description": chapter.description,
        "map_tileset_key": chapter.map_tileset_key,
        "npcs": npc_details,
        "progress": {
            "is_completed": prog.is_completed if prog else False,
            "best_score": prog.best_score if prog else 0,
            "attempts": prog.attempts if prog else 0,
            "last_checkpoint_position": prog.last_checkpoint_position if prog else None,
        },
    }


@router.get("/chapters/{chapter_id}/questions", response_model=List[QuestionResponse])
def get_chapter_questions(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Fetch chapter to check if it's the first one
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Verify unlocked (first chapter always accessible)
    prog = (
        db.query(PlayerChapterProgress)
        .filter(
            PlayerChapterProgress.user_id == current_user.id,
            PlayerChapterProgress.chapter_id == chapter_id,
        )
        .first()
    )
    is_unlocked = prog.is_unlocked if prog else (chapter.chapter_number == 1)
    if not is_unlocked:
        raise HTTPException(
            status_code=403, detail="This chapter has not been unlocked yet."
        )

    questions = db.query(Question).filter(Question.chapter_id == chapter_id).all()
    return questions


@router.post("/questions/{question_id}/answer", response_model=AnswerResultResponse)
def answer_question(
    question_id: int,
    answer_req: QuestionAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Player profile not found")

    # Evaluate answer
    is_correct = False
    correct_answer = None

    if question.question_type in ["multiple_choice", "true_false"]:
        # Find correct option
        correct_opt = (
            db.query(AnswerOption)
            .filter(
                AnswerOption.question_id == question.id,
                AnswerOption.is_correct == True,
            )
            .first()
        )
        if correct_opt:
            correct_answer = correct_opt.option_text
            # Compare selected answer (can be option text)
            if answer_req.selected_answer.strip().lower() == correct_opt.option_text.strip().lower():
                is_correct = True
    elif question.question_type in ["fill_blank", "short_answer"]:
        accepted = (
            db.query(AcceptedAnswer)
            .filter(AcceptedAnswer.question_id == question.id)
            .all()
        )
        accepted_texts = [a.answer_text.strip().lower() for a in accepted]
        if accepted_texts:
            correct_answer = accepted[0].answer_text
        if answer_req.selected_answer.strip().lower() in accepted_texts:
            is_correct = True

    # Check if this question was already answered correctly in the past
    already_solved = (
        db.query(QuestionAttempt)
        .filter(
            QuestionAttempt.user_id == current_user.id,
            QuestionAttempt.question_id == question.id,
            QuestionAttempt.is_correct == True
        )
        .first() is not None
    )

    # EXP and Coins logic
    exp_gained = 0
    coins_gained = 0

    if is_correct:
        if already_solved:
            exp_gained = 0
        else:
            exp_gained = 10
            # Check if there is a combo (5 correct attempts in a row)
            recent_attempts = (
                db.query(QuestionAttempt)
                .filter(QuestionAttempt.user_id == current_user.id)
                .order_by(QuestionAttempt.attempted_at.desc())
                .limit(4)
                .all()
            )
            combo = len(recent_attempts) == 4 and all(a.is_correct for a in recent_attempts)
            if combo:
                exp_gained += 5  # Combo bonus
    else:
        exp_gained = -5

    # Update profile EXP
    profile.total_exp = max(0, profile.total_exp + exp_gained)

    # Determine level up
    # Level 1: 0 - 100 EXP
    # Level 2: 101 - 250 EXP
    # Level 3: 251 - 500 EXP
    # Level 4: 501 - 900 EXP
    # Level 5: 901 - 1500 EXP
    # Level 6: 1501+ EXP
    old_level = profile.level
    new_level = 1
    exp = profile.total_exp
    if exp <= 100:
        new_level = 1
    elif exp <= 250:
        new_level = 2
    elif exp <= 500:
        new_level = 3
    elif exp <= 900:
        new_level = 4
    elif exp <= 1500:
        new_level = 5
    else:
        new_level = 6

    level_up = new_level > old_level
    if level_up:
        profile.level = new_level
        # Unlock Level 5 Elite skin if reached Level 5
        if new_level >= 5:
            elite_skin = db.query(Skin).filter(Skin.name == "skin-elite-agent").first()
            if elite_skin:
                has_skin = (
                    db.query(PlayerSkin)
                    .filter(
                        PlayerSkin.user_id == current_user.id,
                        PlayerSkin.skin_id == elite_skin.id,
                    )
                    .first()
                )
                if not has_skin:
                    db.add(PlayerSkin(user_id=current_user.id, skin_id=elite_skin.id))

    # Log question attempt
    attempt = QuestionAttempt(
        user_id=current_user.id,
        question_id=question.id,
        chapter_id=question.chapter_id,
        selected_answer=answer_req.selected_answer,
        is_correct=is_correct,
        exp_gained=exp_gained,
    )
    db.add(attempt)
    db.flush()

    # Check chapter completion status
    all_chapter_qs = db.query(Question).filter(Question.chapter_id == question.chapter_id).all()
    q_ids = [q.id for q in all_chapter_qs]

    correct_q_ids_attempted = (
        db.query(QuestionAttempt.question_id)
        .filter(
            QuestionAttempt.user_id == current_user.id,
            QuestionAttempt.question_id.in_(q_ids),
            QuestionAttempt.is_correct == True,
        )
        .distinct()
        .all()
    )
    correct_count = len(correct_q_ids_attempted)

    unique_q_ids_attempted = (
        db.query(QuestionAttempt.question_id)
        .filter(
            QuestionAttempt.user_id == current_user.id,
            QuestionAttempt.question_id.in_(q_ids),
        )
        .distinct()
        .all()
    )
    attempted_count = len(unique_q_ids_attempted)

    chapter_completed = False
    next_chapter_unlocked = False
    next_chapter_id = None
    earned_badges = []

    # Increment attempts on chapter progress
    ch_prog = (
        db.query(PlayerChapterProgress)
        .filter(
            PlayerChapterProgress.user_id == current_user.id,
            PlayerChapterProgress.chapter_id == question.chapter_id,
        )
        .first()
    )

    if ch_prog is None:
        ch_prog = PlayerChapterProgress(
            user_id=current_user.id,
            chapter_id=question.chapter_id,
            is_unlocked=True,
            attempts=0,
            best_score=0,
        )
        db.add(ch_prog)
        db.flush()

    ch_prog.attempts += 1
    
    current_score = int((correct_count / len(q_ids)) * 100)
    ch_prog.best_score = max(ch_prog.best_score, current_score)

    # Award perfect badge independently if reached 100%
    if ch_prog.best_score == 100:
        perfect_badge = db.query(Badge).filter(Badge.condition_key == "perfect_chapter").first()
        if perfect_badge:
            has_perf = db.query(PlayerBadge).filter(PlayerBadge.user_id == current_user.id, PlayerBadge.badge_id == perfect_badge.id).first()
            if not has_perf:
                profile.achievement_points += 10
                db.add(PlayerBadge(user_id=current_user.id, badge_id=perfect_badge.id))
                earned_badges.append({
                    "name": perfect_badge.name,
                    "badge_type": perfect_badge.badge_type,
                    "icon_url": perfect_badge.icon_url,
                })

    if attempted_count == len(q_ids) and not ch_prog.is_completed:
        ch_prog.is_completed = True
        ch_prog.completed_at = datetime.utcnow()
        chapter_completed = True

        profile.total_exp += 50
        coins_gained += 30
        profile.coins += coins_gained

        db.add(
            CoinTransaction(
                user_id=current_user.id,
                amount=coins_gained,
                reason="chapter_complete",
            )
        )

        chapter_badge = db.query(Badge).filter(Badge.condition_key == f"chapter_{question.chapter_id}").first()
        if not chapter_badge:
            chapter_badge = Badge(
                name=f"{question.chapter.title} Badge",
                description=f"Earned for completing Chapter {question.chapter.chapter_number} of {question.chapter.subject.name}.",
                icon_url="/assets/badges/badge-chapter-complete.png",
                badge_type="chapter",
                condition_key=f"chapter_{question.chapter_id}",
            )
            db.add(chapter_badge)
            db.commit()
            db.refresh(chapter_badge)

        has_badge = (
            db.query(PlayerBadge)
            .filter(
                PlayerBadge.user_id == current_user.id,
                PlayerBadge.badge_id == chapter_badge.id,
            )
            .first()
        )
        if not has_badge:
            db.add(PlayerBadge(user_id=current_user.id, badge_id=chapter_badge.id))
            earned_badges.append({
                "name": chapter_badge.name,
                "badge_type": chapter_badge.badge_type,
                "icon_url": chapter_badge.icon_url,
            })



        next_ch = (
            db.query(Chapter)
            .filter(
                Chapter.subject_id == question.chapter.subject_id,
                Chapter.chapter_number > question.chapter.chapter_number,
            )
            .order_by(Chapter.chapter_number.asc())
            .first()
        )
        if next_ch:
            next_ch_prog = (
                db.query(PlayerChapterProgress)
                .filter(
                    PlayerChapterProgress.user_id == current_user.id,
                    PlayerChapterProgress.chapter_id == next_ch.id,
                )
                .first()
            )
            if not next_ch_prog:
                db.add(
                    PlayerChapterProgress(
                        user_id=current_user.id,
                        chapter_id=next_ch.id,
                        is_unlocked=True,
                    )
                )
            elif not next_ch_prog.is_unlocked:
                # A progress record can already exist from a checkpoint or an
                # earlier session. Completing the preceding chapter must still
                # unlock it before the client can proceed.
                next_ch_prog.is_unlocked = True
            next_chapter_unlocked = True
            next_chapter_id = next_ch.id
        else:
            sub_prog = (
                db.query(PlayerSubjectProgress)
                .filter(
                    PlayerSubjectProgress.user_id == current_user.id,
                    PlayerSubjectProgress.subject_id == question.chapter.subject_id,
                )
                .first()
            )
            if sub_prog and not sub_prog.is_completed:
                sub_prog.is_completed = True
                sub_prog.completed_at = datetime.utcnow()

                skin_cond = f"complete_subject_{question.chapter.subject.name.lower()[:4]}"
                sub_skin = db.query(Skin).filter(Skin.unlock_condition == skin_cond).first()
                if sub_skin:
                    has_skin = (
                        db.query(PlayerSkin)
                        .filter(
                            PlayerSkin.user_id == current_user.id,
                            PlayerSkin.skin_id == sub_skin.id,
                        )
                        .first()
                    )
                    if not has_skin:
                        db.add(PlayerSkin(user_id=current_user.id, skin_id=sub_skin.id))

                next_sub = (
                    db.query(Subject)
                    .filter(Subject.id == question.chapter.subject_id + 1)
                    .first()
                )
                if next_sub:
                    next_sub_prog = (
                        db.query(PlayerSubjectProgress)
                        .filter(
                            PlayerSubjectProgress.user_id == current_user.id,
                            PlayerSubjectProgress.subject_id == next_sub.id,
                        )
                        .first()
                    )
                    if not next_sub_prog:
                        db.add(
                            PlayerSubjectProgress(
                                user_id=current_user.id,
                                subject_id=next_sub.id,
                                is_unlocked=True,
                            )
                        )
                        next_sub_ch1 = (
                            db.query(Chapter)
                            .filter(
                                Chapter.subject_id == next_sub.id,
                                Chapter.chapter_number == 1,
                            )
                            .first()
                        )
                        if next_sub_ch1:
                            db.add(
                                PlayerChapterProgress(
                                    user_id=current_user.id,
                                    chapter_id=next_sub_ch1.id,
                                    is_unlocked=True,
                                )
                            )

    db.commit()
    db.refresh(profile)

    return {
        "is_correct": is_correct,
        "correct_answer": correct_answer,
        "exp_gained": exp_gained,
        "coins_gained": coins_gained,
        "new_total_exp": profile.total_exp,
        "new_coins": profile.coins,
        "new_level": profile.level,
        "level_up": level_up,
        "chapter_completed": chapter_completed,
        "next_chapter_unlocked": next_chapter_unlocked,
        "next_chapter_id": next_chapter_id,
        "earned_badges": earned_badges,
    }


@router.post("/save-checkpoint", response_model=CheckpointSaveResponse)
def save_checkpoint(
    req: SaveCheckpointRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prog = (
        db.query(PlayerChapterProgress)
        .filter(
            PlayerChapterProgress.user_id == current_user.id,
            PlayerChapterProgress.chapter_id == req.chapter_id,
        )
        .first()
    )
    if not prog:
        prog = PlayerChapterProgress(
            user_id=current_user.id,
            chapter_id=req.chapter_id,
            is_unlocked=True,
        )
        db.add(prog)

    prog.last_checkpoint_position = req.checkpoint_position
    db.commit()

    return {"success": True, "checkpoint_position": req.checkpoint_position}


@router.get("/session/{chapter_id}")
def get_or_create_session(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Verify unlocked (first chapter always accessible)
    prog = (
        db.query(PlayerChapterProgress)
        .filter(
            PlayerChapterProgress.user_id == current_user.id,
            PlayerChapterProgress.chapter_id == chapter_id,
        )
        .first()
    )
    is_unlocked = prog.is_unlocked if prog else (chapter.chapter_number == 1)
    if not is_unlocked:
        raise HTTPException(
            status_code=403, detail="This chapter has not been unlocked yet."
        )

    # Find active session
    session = (
        db.query(GameSession)
        .filter(
            GameSession.user_id == current_user.id,
            GameSession.chapter_id == chapter_id,
            GameSession.ended_at == None,
        )
        .first()
    )
    if not session:
        session = GameSession(user_id=current_user.id, chapter_id=chapter_id)
        db.add(session)
        db.commit()
        db.refresh(session)

    return {"session_id": session.id, "started_at": session.started_at}
