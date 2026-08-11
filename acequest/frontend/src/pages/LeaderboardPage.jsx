import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/player/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1: return 'text-gold bg-gold/15 border-gold/30 glow-gold';
      case 2: return 'text-slate-300 bg-slate-800 border-slate-700/50';
      case 3: return 'text-amber-600 bg-amber-950/10 border-amber-900/30';
      default: return 'text-slate-400 border-transparent';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold glow-gold animate-float">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">TSA GLOBAL LEADERBOARD</h2>
            <p className="text-sm text-slate-400 mt-1">Ranking directory of active field agents based on total experience parameters.</p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-500">
          Syncing agent directory log files...
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-850/80 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                <th className="py-4 px-6 text-center w-20">Rank</th>
                <th className="py-4 px-6">Field Agent</th>
                <th className="py-4 px-6 text-center">Rank Level</th>
                <th className="py-4 px-6 text-right w-36">Total Progress</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                return (
                  <tr 
                    key={idx}
                    className={`border-b border-slate-850/40 hover:bg-slate-900/10 transition-colors ${
                      rank === 1 ? 'bg-gold/2' : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-center font-mono font-bold text-sm">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border font-black ${getRankBadgeClass(rank)}`}>
                        {rank}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={entry.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.username}`} 
                          alt={entry.username} 
                          className="w-9 h-9 rounded bg-navy border border-slate-850 shadow-inner"
                        />
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            {entry.username}
                            {rank === 1 && <Star className="w-4 h-4 fill-gold text-gold animate-pulse" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Field Agent</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded bg-navy border border-slate-800 text-xs font-bold text-slate-300 font-mono">
                        LVL {entry.level}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-teal-light glow-text-teal">
                      {entry.total_exp} EXP
                    </td>
                  </tr>
                );
              })}

              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-xs text-slate-500 font-medium">
                    No active agent data records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
