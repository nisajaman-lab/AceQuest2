import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft, Play, Lock, CheckCircle2, Award, Zap } from 'lucide-react';
import { assets } from '../lib/assets';

const LOCAL_CHAPTER_FALLBACKS = {
  Mathematics: [
    { id: 1, chapter_number: 1, title: 'Numbers & Arithmetic', description: 'Unlock the gates of Logic Realm by solving number patterns and basic fractions.', is_unlocked: true, is_completed: false, map_tileset_key: 'tileset-logic-realm' },
    { id: 2, chapter_number: 2, title: 'Algebra', description: 'Find the missing variables (X and Y) to restore power to the Logic Core.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-logic-realm' },
  ],
  'Computer Science': [
    { id: 3, chapter_number: 1, title: 'Data Representation', description: 'Learn binary, hexadecimal, and text encoding to interface with the mainframes.', is_unlocked: true, is_completed: false, map_tileset_key: 'tileset-tech-realm' },
    { id: 4, chapter_number: 2, title: 'Algorithm & Programming', description: 'Trace code structures, conditional loops, and logic gates to stop the security virus.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-tech-realm' },
  ],
  Geography: [
    { id: 5, chapter_number: 1, title: 'The Population Crisis Zone', description: 'Restore population data and understand human geography across the Terra Realm.', is_unlocked: true, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 6, chapter_number: 2, title: 'The Famine Fields', description: 'Rescue food production knowledge and restore agricultural systems in Southeast Asia.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 7, chapter_number: 3, title: 'The Crumbling City', description: 'Rebuild urban geography and restore settlement knowledge to chaotic cities.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 8, chapter_number: 4, title: 'The Tectonic Grounds', description: 'Master plate tectonics, volcanoes, and earthquakes in the shifting Terra Realm.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 9, chapter_number: 5, title: 'The River & Coast Labyrinth', description: 'Navigate rivers and coasts to restore hydrological and coastal knowledge.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 10, chapter_number: 6, title: 'The Storm & Jungle Frontier', description: 'Survive typhoons and protect tropical rainforests from climate destruction.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 11, chapter_number: 7, title: 'The Industrial Wasteland', description: 'Restore industrial geography and manage pollution across manufacturing zones.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 12, chapter_number: 8, title: 'The Energy Fortress', description: 'Power up renewable energy and reduce carbon emissions before GEO-X wins.', is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
    { id: 13, chapter_number: 9, title: 'The Tourist Trap', description: "Rescue sustainable tourism and protect Brunei's natural attractions.", is_unlocked: false, is_completed: false, map_tileset_key: 'tileset-terra-realm' },
  ],
};

export default function ChapterMapPage() {
  const { subjectId } = useParams();
  const { getAuthHeader } = useGameStore();
  const [chapters, setChapters] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const subjectImageMap = {
    Mathematics: assets.realmArt.Mathematics,
    'Computer Science': assets.realmArt['Computer Science'],
    Geography: assets.realmArt.Geography,
    History: assets.realmArt.History,
    English: assets.realmArt.English,
    Science: assets.realmArt.Science,
    Commerce: assets.realmArt.Commerce,
    Malay: assets.realmArt.Malay,
  };

  const chapterBackgroundMap = {
    'tileset-logic-realm': assets.realmArt.Mathematics,
    'tileset-tech-realm': assets.realmArt['Computer Science'],
    'tileset-terra-realm': assets.realmArt.Geography,
    'tileset-academy': assets.tilesets.academy,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subject details
        const subRes = await axios.get('http://127.0.0.1:8000/api/game/subjects');
        const activeSub = subRes.data.find((s) => s.id === parseInt(subjectId));
        setSubject(activeSub);

        // Fetch subject chapters with user progress
        const chRes = await axios.get(`http://127.0.0.1:8000/api/game/subjects/${subjectId}/chapters`, {
          headers: getAuthHeader(),
        });
        setChapters(chRes.data?.length ? chRes.data : (LOCAL_CHAPTER_FALLBACKS[activeSub?.name] || []));
      } catch (err) {
        console.error("Failed to load chapters", err);
        const fallbackSubject = subjectId === '1' ? 'Mathematics' : subjectId === '2' ? 'Computer Science' : subjectId === '3' ? 'Geography' : null;
        setChapters(fallbackSubject ? (LOCAL_CHAPTER_FALLBACKS[fallbackSubject] || []) : []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, getAuthHeader]);

  const handleLaunchGame = (chapterId, isUnlocked) => {
    if (!isUnlocked) {
      alert("This chapter is locked! Complete previous chapters first.");
      return;
    }
    navigate(`/game/${chapterId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      {/* Back button & Subject Title */}
      <div className="flex flex-col gap-4 border-b border-slate-800/60 pb-6">
        <Link to="/subject-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK TO REALMS
        </Link>
        <div>
          <span className="text-xs font-semibold text-teal-light tracking-widest uppercase glow-text-teal">
            {subject?.realm_name || 'Subject Realm'}
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-wide uppercase mt-1">
            {subject?.name} Chapters
          </h2>
          <p className="text-sm text-slate-400 mt-1">{subject?.description}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-500">
          Loading chapters log files...
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/60 bg-slate-950/70 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_25%)] pointer-events-none" />
            <div className="relative overflow-x-auto py-8">
              <div className="relative min-w-[960px] flex items-center gap-8">
                <div className="absolute inset-y-1/2 left-0 right-0 h-2 bg-slate-800/40 rounded-full" />
                {chapters.map((ch, idx) => {
                  const unlocked = ch.is_unlocked;
                  const completed = ch.is_completed;

                  return (
                    <div key={ch.id} className="relative z-10 flex flex-col items-center gap-4 min-w-[180px] text-center">
                      <button
                        type="button"
                        onClick={() => handleLaunchGame(ch.id, unlocked)}
                        disabled={!unlocked}
                        className={`relative flex flex-col items-center gap-4 rounded-[28px] border px-5 py-6 w-full transition-all duration-200 ${
                          unlocked
                            ? 'border-teal/30 bg-slate-900/50 hover:-translate-y-1 hover:border-teal/50'
                            : 'border-slate-800/60 bg-slate-950/60 cursor-not-allowed opacity-60'
                        }`}
                        style={{
                          backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.9)), url(${chapterBackgroundMap[subject?.name] || subjectImageMap[subject?.name] || assets.worldMap})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-black ${
                          completed
                            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400'
                            : unlocked
                              ? 'bg-teal/10 border-teal/30 text-teal-light'
                              : 'bg-slate-950/70 border-slate-800 text-slate-600'
                        }`}>
                          {ch.chapter_number}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-white tracking-wide">{ch.title}</h3>
                          <p className="text-[11px] text-slate-400 leading-snug">{completed ? 'Sector restored' : unlocked ? 'Unlocked' : 'Locked'}</p>
                        </div>
                      </button>

                      {idx < chapters.length - 1 && (
                        <div className="hidden md:block absolute z-0 top-1/2 right-[-3.5rem] w-24 h-2 bg-slate-800/40 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {chapters.map((ch) => {
              const unlocked = ch.is_unlocked;
              const completed = ch.is_completed;

              return (
                <div
                  key={ch.id}
                  onClick={() => handleLaunchGame(ch.id, unlocked)}
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
                    unlocked
                      ? 'border-slate-800/80 bg-slate-900/10 hover:border-teal/30 hover:bg-slate-900/40 cursor-pointer'
                      : 'border-slate-950/40 bg-slate-950/20 opacity-40 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.92)), url(${chapterBackgroundMap[subject?.name] || subjectImageMap[subject?.name] || assets.worldMap})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold border ${
                      completed 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                        : unlocked 
                          ? 'bg-teal/10 border-teal/20 text-teal-light glow-teal' 
                          : 'bg-slate-950/50 border-slate-800 text-slate-600'
                    }`}>
                      {ch.chapter_number}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white tracking-wide text-md">{ch.title}</h3>
                        {completed && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-emerald-500/10" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">{ch.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/40">
                    {unlocked && (
                      <div className="flex gap-4 items-center">
                        <div className="text-left md:text-right">
                          <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Best Score</div>
                          <div className="text-sm font-black text-white font-mono flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-gold" /> {ch.best_score || 0}%
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Attempts</div>
                          <div className="text-sm font-black text-slate-300 font-mono flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-teal" /> {ch.attempts || 0}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      {unlocked ? (
                        <button className="px-4 py-2.5 rounded-lg bg-teal text-navy font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-teal-light glow-teal transition-all">
                          <Play className="w-3 h-3 fill-navy" /> START MISSION
                        </button>
                      ) : (
                        <div className="px-4 py-2.5 rounded-lg bg-slate-950/80 text-slate-600 border border-slate-900 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed">
                          <Lock className="w-3 h-3" /> LOCKED
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
