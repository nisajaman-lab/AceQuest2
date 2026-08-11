import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGameStore } from '../store/useGameStore';
import { Map, Lock, Play, Compass, Info, Award } from 'lucide-react';
import { assets } from '../lib/assets';

export default function SubjectMapPage() {
  const { getAuthHeader } = useGameStore();
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState({ subjects: [], chapters: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await axios.get('http://127.0.0.1:8000/api/game/subjects');
        const progRes = await axios.get('http://127.0.0.1:8000/api/player/progress', {
          headers: getAuthHeader(),
        });
        setSubjects(subRes.data);
        setProgress(progRes.data);
      } catch (err) {
        console.error("Failed to load map data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAuthHeader]);

  const isSubjectCompleted = (subId) => {
    const prog = progress.subjects.find((s) => s.subject_id === subId);
    return prog ? prog.is_completed : false;
  };

  const handleSelectSubject = (sub) => {
    navigate(`/chapter-map/${sub.id}`);
  };

  // Realm styling lookup helper
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

  const getRealmStyle = (realmName) => {
    const defaultStyle = {
      bg: 'from-slate-900 to-slate-950 border-slate-800',
      glow: 'hover:border-teal/30 hover:shadow-teal/10',
      badge: 'bg-teal/10 text-teal-light border-teal/20',
      iconColor: 'text-teal-light'
    };

    switch(realmName) {
      case 'Logic Realm':
        return {
          bg: 'from-cyan-950/20 via-slate-900 to-cyan-950/30 border-cyan-800/20',
          glow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
          badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          iconColor: 'text-cyan-400'
        };
      case 'Technology Realm':
        return {
          bg: 'from-blue-950/20 via-slate-900 to-blue-950/30 border-blue-800/20',
          glow: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          iconColor: 'text-blue-400'
        };
      default:
        return defaultStyle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal glow-teal animate-float">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">SUBJECT REALM MAP</h2>
            <p className="text-sm text-slate-400 mt-1">Select a subject realm and begin your restoration mission.</p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-500">
          Loading knowledge realms...
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/60 bg-slate-950/70 p-6">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none" style={{ backgroundImage: `url(${assets.worldMap})` }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%)] pointer-events-none" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {subjects.map((sub, index) => {
              const completed = isSubjectCompleted(sub.id);
              const style = getRealmStyle(sub.realm_name);

              return (
                <React.Fragment key={sub.id}>
                  <div
                    onClick={() => handleSelectSubject(sub)}
                    className={`group relative flex-1 min-h-[260px] rounded-[2rem] border p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${style.bg} cursor-pointer ${style.glow} hover:-translate-y-1`}
                    style={{ backgroundImage: `url(${subjectImageMap[sub.name] || assets.worldMap})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)] pointer-events-none" />
                    <div className="relative z-10 space-y-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${style.badge}`}>
                          {sub.realm_name || 'Subject Realm'}
                        </span>
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">{completed ? 'RESTORED' : 'ACTIVE'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-black border ${
                          completed ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-teal/10 border-teal/20 text-teal-light'
                        }`}>
                          {sub.id}
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-white tracking-wide">{sub.name}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-2">{sub.description || 'Explore the gates of this realm and recover its secrets.'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-5 border-t border-slate-800/40 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tap to explore</span>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center border bg-teal text-navy border-teal/20">
                        <Play className="w-4 h-4 fill-navy" />
                      </div>
                    </div>
                  </div>

                  {index < subjects.length - 1 && (
                    <div className="hidden md:flex flex-col items-center gap-3 px-2">
                      <div className="w-24 h-1 rounded-full bg-slate-800/50" />
                      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">NEXT</div>
                      <div className="w-10 h-10 rounded-full border bg-teal/20 border-teal/30 text-teal-light flex items-center justify-center">
                        <span className="text-[10px]">GO</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
