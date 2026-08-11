import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useGameStore } from '../store/useGameStore';
import GameCanvas from '../components/GameCanvas';
import { ArrowLeft, HelpCircle, Award, CheckCircle2, XCircle, Info, Sparkles, Coins } from 'lucide-react';
import { getChapterCrystalAsset, getBadgeIconAsset, getNpcPortraitAsset } from '../lib/assets';
import { playMusicForChapter } from '../lib/audio';

export default function GamePage() {
  const { chapterId } = useParams();
  const { getAuthHeader, updateProfileStats, profile, user } = useGameStore();
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextChapter, setNextChapter] = useState(null);
  const navigate = useNavigate();

  // Dialog & Question State
  const [activeNpc, setActiveNpc] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState(null); // { is_correct, exp_gained, correct_answer }
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [progressPopup, setProgressPopup] = useState(null);
  const [nextChapterId, setNextChapterId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const loadNextChapter = useCallback(
    async (subjectId, currentChapterNumber) => {
      if (!subjectId || currentChapterNumber == null) return;

      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/game/subjects/${subjectId}/chapters`, {
          headers: getAuthHeader(),
        });
        const nextChap = res.data
          .filter((item) => item.chapter_number > currentChapterNumber)
          .sort((a, b) => a.chapter_number - b.chapter_number)[0];
        if (nextChap) {
          setNextChapter(nextChap);
        }
      } catch (err) {
        console.error('Failed to load next chapter', err);
      }
    },
    [getAuthHeader]
  );

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Fetch details
        const chRes = await axios.get(`http://127.0.0.1:8000/api/game/chapters/${chapterId}`, {
          headers: getAuthHeader(),
        });
        setChapter(chRes.data);
        await loadNextChapter(chRes.data.subject_id, chRes.data.chapter_number);

        // Fetch questions
        const qRes = await axios.get(`http://127.0.0.1:8000/api/game/chapters/${chapterId}/questions`, {
          headers: getAuthHeader(),
        });
        setQuestions(qRes.data);

        // Start session
        await axios.get(`http://127.0.0.1:8000/api/game/session/${chapterId}`, {
          headers: getAuthHeader(),
        });
      } catch (err) {
        console.error("Failed to load game data", err);
        alert("Make sure this chapter is unlocked and database is running!");
        navigate('/subject-map');
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, [chapterId, getAuthHeader, loadNextChapter, navigate]);

  const getMissionIntroNpc = useCallback((chapterData) => {
    if (!chapterData) return null;

    if (Number(chapterData.chapter_number) === 1 || chapterData.title === 'Numbers & Arithmetic') {
      return {
        id: 'mission-one-intro',
        name: 'Commander Sarah',
        npc_type: 'mission_giver',
        sprite_key: 'npc-commander',
        dialogues: [
          {
            dialogue_text: 'Welcome to the field, Agent Ragam. The Forgetter has corrupted the Logic Realm! We need your analytical skills immediately.',
          },
          {
            dialogue_text: 'Go speak with Dr. Amina to get a hint, and then tackle the Arithmetic gate to proceed.',
          },
        ],
      };
    }

    return chapterData.npcs?.[0] || null;
  }, []);

  const activateNpcDialogue = useCallback((npc, isIntro = false) => {
    if (!npc) return;
    setActiveNpc({
      ...npc,
      is_intro: isIntro,
      portrait_url: npc.portrait_url || getNpcPortraitAsset(npc.sprite_key, npc.npc_type),
    });
    setDialogueIndex(0);
  }, []);

  // Event handlers from Phaser Canvas
  const handleNpcOverlapStart = useCallback((data) => {
    activateNpcDialogue(data.npc, data.isIntro ?? false);
  }, [activateNpcDialogue]);

  const handleNpcOverlapEnd = useCallback(() => {
    setActiveNpc(null);
  }, []);

  const handleMissionIntroTrigger = useCallback((data) => {
    activateNpcDialogue(data.npc, data.isIntro ?? true);
  }, [activateNpcDialogue]);

  const handleSaveCheckpoint = useCallback(async (data) => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/game/save-checkpoint',
        {
          chapter_id: parseInt(chapterId),
          checkpoint_position: data.position,
        },
        { headers: getAuthHeader() }
      );
    } catch (err) {
      console.error("Failed to save checkpoint", err);
    }
  }, [chapterId, getAuthHeader]);

  const handleStartGame = () => {
    setGameStarted(true);
    setShowQuestions(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswer('');
    setAnswerResult(null);
    setActiveNpc(null);
  };

  const handleCloseDialogue = () => {
    setActiveNpc(null);
  };

  // Dialogue navigation
  const handleNextDialogue = () => {
    if (!activeNpc) return;

    const dialogues = activeNpc.dialogues || [];
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      if (activeNpc.auto_start_questions && questions.length > 0) {
        setShowQuestions(true);
        setCurrentQuestionIdx(0);
        setSelectedAnswer('');
        setAnswerResult(null);
        setActiveNpc(null);
        return;
      }

      if (activeNpc.is_intro) {
        setActiveNpc(null);
        return;
      }

      setActiveNpc(null);
    }
  };

  // Answer handling
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIdx];
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/game/questions/${currentQuestion.id}/answer`,
        { selected_answer: selectedAnswer },
        { headers: getAuthHeader() }
      );

      setAnswerResult(res.data);
      updateProfileStats({
        coins: res.data.new_coins,
        total_exp: res.data.new_total_exp,
        level: res.data.new_level,
      });

      if (chapter && res.data.next_chapter_unlocked) {
        loadNextChapter(chapter.subject_id, chapter.chapter_number);
      }

      if (res.data.next_chapter_id) {
        setNextChapterId(res.data.next_chapter_id);
      }

      if (res.data.level_up || (res.data.earned_badges || []).length > 0) {
        setProgressPopup({
          type: 'level-up',
          level: res.data.new_level,
          badges: res.data.earned_badges || [],
        });
      }
    } catch (err) {
      console.error("Failed to submit answer", err);
    }
  };

  const handleNextQuestion = () => {
    setAnswerResult(null);
    setSelectedAnswer('');

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setChapterCompleted(true);
      setShowQuestions(false);
      if (chapter) {
        loadNextChapter(chapter.subject_id, chapter.chapter_number);
      }
    }
  };

  const handleTryAgain = () => {
    setAnswerResult(null);
    setSelectedAnswer('');
  };

  useEffect(() => {
    if (!chapter) return;
    playMusicForChapter(chapter, { volume: 0.2 });
  }, [chapter]);

  const handleCloseProgressPopup = () => {
    setProgressPopup(null);
  };

  const handleProceedToNextChapter = () => {
    const targetChapterId = nextChapter?.id || nextChapterId;
    if (!targetChapterId) return;
    window.location.assign(`/game/${targetChapterId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 font-semibold">
        Initializing virtual hologram map...
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] py-6 px-4 flex flex-col items-center justify-center gap-6">
      {/* Game Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4">
        <Link 
          to={`/chapter-map/${chapter?.subject_id}`} 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> LEAVE MISSION
        </Link>
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-teal font-extrabold glow-text-teal">
            MISSION: CHAPTER {chapter?.chapter_number}
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-wide">{chapter?.title}</h2>
        </div>
        <div className="text-xs text-slate-400 font-mono font-bold uppercase">
          Safehouse status: <span className="text-emerald-400">active</span>
        </div>
      </div>

      {!chapterCompleted && !gameStarted && (
        <div className="w-full max-w-4xl glass-panel-heavy p-8 rounded-3xl border border-teal/20 shadow-2xl text-center space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.35em] text-teal font-extrabold glow-text-teal">MISSION READY</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-wide">Launch the mission briefing</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Once you start, the mission map becomes active. When your agent reaches an NPC, their dialogue will open automatically before the challenge begins.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setGameStarted(true);
            }}
            className="px-8 py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-2xl transition-all shadow-md active:scale-98 glow-teal"
          >
            START MISSION & BRIEFING
          </button>
        </div>
      )}

      {/* Phaser Canvas */}
      {!chapterCompleted && gameStarted && (
        <GameCanvas
          chapterId={parseInt(chapterId)}
          chapter={chapter}
          heroSkin={user?.skin_equipped || 'default'}
          npcs={chapter?.npcs || []}
          checkpointPos={chapter?.progress?.last_checkpoint_position || '100,300'}
          onNpcOverlapStart={handleNpcOverlapStart}
          onNpcOverlapEnd={handleNpcOverlapEnd}
          onMissionIntroTrigger={handleMissionIntroTrigger}
          onSaveCheckpoint={handleSaveCheckpoint}
        />
      )}

      {/* Dialogue Box */}
      {activeNpc && !showQuestions && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6 z-40">
          <div className="glass-panel-heavy p-6 rounded-2xl border border-teal/20 shadow-2xl flex gap-5">
            <div className="w-14 h-14 rounded-xl bg-navy border border-teal/30 flex-shrink-0 overflow-hidden shadow-inner">
              <img
                src={activeNpc.portrait_url}
                alt={activeNpc.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-teal-light tracking-wide">{activeNpc.name}</span>
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {activeNpc.npc_type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed min-h-[40px]">
                {activeNpc.dialogues[dialogueIndex]?.dialogue_text}
              </p>
              <div className="flex justify-end pt-1 gap-2">
                {dialogueIndex >= (activeNpc.dialogues.length - 1) && (activeNpc.is_intro || activeNpc.npc_type === 'mission_giver') ? (
                  <>
                    <button
                      onClick={handleCloseDialogue}
                      className="px-4 py-1.5 rounded bg-slate-800 text-slate-200 font-bold text-xs shadow-md hover:bg-slate-700"
                    >
                      CLOSE
                    </button>
                    <button
                      onClick={handleStartGame}
                      className="px-4 py-1.5 rounded bg-teal text-navy font-bold text-xs shadow-md hover:bg-teal-light glow-teal"
                    >
                      START GAME
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextDialogue}
                    className="px-4 py-1.5 rounded bg-teal text-navy font-bold text-xs shadow-md hover:bg-teal-light glow-teal"
                  >
                    {dialogueIndex < (activeNpc.dialogues.length - 1) ? 'NEXT' : activeNpc.auto_start_questions ? 'START QUESTIONS' : 'CONTINUE'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {showQuestions && questions[currentQuestionIdx] && (
        <div className="fixed inset-0 bg-navy-dark/95 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="glass-panel-heavy p-8 rounded-2xl w-full max-w-xl shadow-2xl border border-teal/30 space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  DECIPHER TASK: {currentQuestionIdx + 1} / {questions.length}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal/10 border border-teal/30 text-teal-light font-mono font-bold uppercase">
                {questions[currentQuestionIdx].difficulty}
              </span>
            </div>

            <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-900">
              <p className="text-white font-bold text-base leading-relaxed">
                {questions[currentQuestionIdx].question_text}
              </p>
            </div>

            {questions[currentQuestionIdx].hint && !answerResult && (
              <div className="p-3 rounded-lg bg-gold/5 border border-gold/15 text-gold-light text-xs leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong className="uppercase">Clue:</strong> {questions[currentQuestionIdx].hint}</span>
              </div>
            )}

            {!answerResult ? (
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                {['multiple_choice', 'true_false'].includes(questions[currentQuestionIdx].question_type) ? (
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestionIdx].options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedAnswer(opt.option_text)}
                        className={`w-full text-left p-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-between ${
                          selectedAnswer === opt.option_text
                            ? 'bg-teal/15 border-teal text-white shadow-md glow-teal'
                            : 'bg-navy border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <span>{opt.option_text}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedAnswer === opt.option_text ? 'border-teal bg-teal' : 'border-slate-700'
                        }`}>
                          {selectedAnswer === opt.option_text && <div className="w-1.5 h-1.5 rounded-full bg-navy" />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Type your decryption solution here..."
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="w-full px-4 py-3 bg-navy rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal font-semibold text-sm shadow-inner"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedAnswer.trim()}
                  className="w-full py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal hover:shadow-teal/20"
                >
                  VERIFY DECRYPTION KEY
                </button>
              </form>
            ) : (
              <div className="space-y-6 pt-4">
                <div className={`p-6 rounded-xl border text-center space-y-3 ${
                  answerResult.is_correct 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-crimson/10 border-crimson/20 text-crimson-light'
                }`}>
                  <div className="flex justify-center">
                    {answerResult.is_correct ? (
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    ) : (
                      <XCircle className="w-12 h-12 text-crimson-light" />
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold tracking-wide uppercase">
                    {answerResult.is_correct ? 'Decryption Successful!' : 'Decryption Failed!'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {answerResult.is_correct 
                      ? 'The corrupted database block has been unlocked successfully.'
                      : `Security countermeasure triggered. Correct code was: "${answerResult.correct_answer}"`
                    }
                  </p>

                  <div className="flex justify-center gap-6 pt-2 text-sm font-bold font-mono">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-4.5 h-4.5 text-teal" /> 
                      {answerResult.exp_gained >= 0 ? `+${answerResult.exp_gained}` : answerResult.exp_gained} EXP
                    </span>
                    {answerResult.coins_gained > 0 && (
                      <span className="flex items-center gap-1 text-gold">
                        <Coins className="w-4.5 h-4.5" /> +{answerResult.coins_gained} Coins
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex gap-3 ${answerResult.is_correct ? 'flex-col' : 'flex-row'}`}>
                  {!answerResult.is_correct && (
                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98"
                    >
                      TRY AGAIN
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className={`py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal ${answerResult.is_correct ? 'w-full' : 'flex-1'}`}
                  >
                    {currentQuestionIdx < questions.length - 1 ? 'NEXT DECRYPTION PORT' : 'COMPLETE RECONSTRUCTION'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chapter Completed Screen */}
      {chapterCompleted && (
        <div className="max-w-md w-full glass-panel-heavy p-8 rounded-2xl border border-teal/20 text-center space-y-6 shadow-2xl animate-float">
          <div className="flex justify-center">
            <img
              src={getChapterCrystalAsset(chapter)}
              alt={`${chapter?.title || 'chapter'} crystal`}
              className="w-24 h-24 object-contain drop-shadow-[0_0_18px_rgba(45,212,191,0.35)]"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-teal font-extrabold glow-text-teal">MISSION COMPLETE</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">REALM SECTOR RESTORED</h2>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              All question logs in Chapter {chapter?.chapter_number} have been solved correctly. The knowledge crystals are secured!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal/5 border border-teal/15 flex items-center justify-around font-mono font-bold text-sm">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Rewards</div>
              <div className="text-teal-light font-extrabold">+50 EXP</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">First Clear</div>
              <div className="text-gold font-extrabold">+30 Coins</div>
            </div>
          </div>

          <div className="space-y-4">
            {(nextChapter?.id || nextChapterId) && (
              <div className="rounded-2xl border border-teal/20 bg-slate-950/60 p-4 text-sm text-slate-300 space-y-3">
                <div>
                  Next chapter unlocked: <span className="text-white font-semibold">{nextChapter?.title || 'Ready to launch'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToNextChapter}
                  className="w-full relative z-10 pointer-events-auto py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal"
                >
                  PROCEED TO NEXT CHAPTER
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate(`/chapter-map/${chapter?.subject_id}`)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98 border border-slate-700"
            >
              RETURN TO CHAPTERS REALM
            </button>
          </div>
        </div>
      )}

      {progressPopup?.type === 'level-up' && (
        <div className="fixed inset-0 z-[60] bg-navy-dark/85 flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass-panel-heavy p-8 rounded-2xl border border-gold/30 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto text-gold glow-gold">
              <Sparkles className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-extrabold glow-text-gold">LEVEL UP</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                Congratulations! You leveled up to Level {progressPopup.level}!
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed px-4">
                Your agent rank has increased. Any newly earned badges are shown below.
              </p>
            </div>

            {progressPopup.badges.length > 0 && (
              <div className="space-y-3 text-left">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Badges earned</div>
                <div className="grid gap-3">
                  {progressPopup.badges.map((badge, index) => (
                    <div key={`${badge.name}-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center overflow-hidden">
                        <img
                          src={getBadgeIconAsset(badge)}
                          alt={badge.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{badge.name}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">{badge.badge_type || 'badge'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCloseProgressPopup}
              className="w-full py-4 bg-gold hover:bg-gold-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-gold"
            >
              CONTINUE MISSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
