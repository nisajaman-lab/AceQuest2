import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import axios from 'axios';
import { assets } from '../lib/assets';
import { 
  Trophy, 
  Flame, 
  Map, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles,
  Calendar,
  ChevronRight,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, claimDaily, getAuthHeader } = useGameStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [claimedStatus, setClaimedStatus] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(false);

  useEffect(() => {
    // Fetch top 3 leaderboard
    const fetchLeaderboardSnippet = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/player/leaderboard');
        setLeaderboard(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load leaderboard snippet", err);
      }
    };
    fetchLeaderboardSnippet();

    // Set initial claimed status
    if (profile?.last_daily_claim) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (profile.last_daily_claim === todayStr) {
        setClaimedStatus(true);
      } else {
        setClaimedStatus(false);
      }
    }
  }, [profile]);

  const handleClaimDaily = async () => {
    setLoadingClaim(true);
    const result = await claimDaily();
    setLoadingClaim(false);
    if (result) {
      setClaimedStatus(true);
      alert(`Successfully claimed daily login reward! Unlocked +${result.coins_gained} Coins!`);
    } else {
      alert("Daily login bonus already claimed today!");
    }
  };

  const getAgentRankName = (lvl) => {
    switch (lvl) {
      case 1: return 'Trainee Agent';
      case 2: return 'Junior Agent';
      case 3: return 'Field Agent';
      case 4: return 'Senior Agent';
      case 5: return 'Elite Agent';
      case 6: return 'Master Agent Ragam';
      default: return 'Field Agent';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      {/* Hero Welcome Banner */}
      <section className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-teal/10 glow-teal">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-navy-light border border-teal/30 flex items-center justify-center text-4xl shadow-inner font-mono font-bold text-teal-light">
            {profile?.level || 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-teal-light font-bold glow-text-teal">
                {getAgentRankName(profile?.level || 1)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome Back, Agent {user?.username}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Subject realms are corrupted by The Forgetter. Review your map, answer curriculum questions, and reclaim lost data files.
            </p>
          </div>
        </div>

        {/* Daily Bonus Claim Card */}
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-gold/10 bg-gold/5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 md:flex-none">
            <div className="text-xs font-bold text-gold uppercase tracking-wider">Login Streak</div>
            <div className="text-sm font-black text-white">{profile?.login_streak || 1} Days Active</div>
          </div>
          <button
            onClick={handleClaimDaily}
            disabled={claimedStatus || loadingClaim}
            className={`px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all shadow-md ${
              claimedStatus 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60' 
                : 'bg-gold hover:bg-gold-light text-navy glow-gold hover:scale-102 active:scale-98'
            }`}
          >
            {claimedStatus ? 'CLAIMED' : 'CLAIM +20 $'}
          </button>
        </div>
      </section>

      {/* Grid Layout for Stats, Map Links, and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Stats & Map Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Rank Level</div>
              <div className="text-xl font-black text-white">{profile?.level || 1}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Total EXP</div>
              <div className="text-xl font-black text-teal-light glow-text-teal">{profile?.total_exp || 0}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Agent Coins</div>
              <div className="text-xl font-black text-gold glow-text-gold">{profile?.coins || 0}</div>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Achievements</div>
              <div className="text-xl font-black text-white">{profile?.achievement_points || 0} pts</div>
            </div>
          </div>

          {/* Subject Map Preview Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-teal" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">ACTIVE MISSIONS</h3>
              </div>
              <Link to="/subject-map" className="text-xs font-bold text-teal-light hover:underline flex items-center gap-0.5">
                View Subject Map <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual Callout for World Map */}
            <div className="relative h-48 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden flex items-center justify-center text-center p-6 group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-102 transition-transform duration-500" style={{ backgroundImage: `url(${assets.worldMap})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-transparent"></div>
              
              <div className="relative z-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center mx-auto text-teal glow-teal animate-float">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">World Map</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Select any realm on the world map to begin — you can start with whichever subject interests you.
                </p>
                <Link to="/subject-map" className="inline-block mt-2 px-5 py-2 rounded-lg bg-teal text-navy text-xs font-extrabold shadow-md hover:bg-teal-light glow-teal">
                  ACCESS SUBJECT MAP
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboard snippet */}
        <div className="space-y-8">
          {/* Top Agents Leaderboard Snippet */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">TOP AGENTS</h3>
              </div>
              <Link to="/leaderboard" className="text-xs font-bold text-teal-light hover:underline">
                Full Board
              </Link>
            </div>

            <div className="space-y-4">
              {leaderboard.map((entry, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    idx === 0 
                      ? 'bg-gold/5 border-gold/20' 
                      : idx === 1 
                        ? 'bg-slate-800/20 border-slate-700/50' 
                        : 'bg-slate-900/10 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 text-center font-mono font-bold text-sm ${
                      idx === 0 ? 'text-gold' : idx === 1 ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      #{idx + 1}
                    </span>
                    <img 
                      src={entry.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${entry.username}`} 
                      alt={entry.username} 
                      className="w-8 h-8 rounded bg-navy border border-slate-800"
                    />
                    <div>
                      <div className="text-sm font-bold text-white leading-none">{entry.username}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Level {entry.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-teal-light glow-text-teal">{entry.total_exp} EXP</span>
                  </div>
                </div>
              ))}
              
              {leaderboard.length === 0 && (
                <div className="text-center text-xs text-slate-500 py-6">
                  Fetching top agent logs...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
