import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { LogOut, ShieldAlert, Award, Compass, LayoutDashboard, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, profile, logout, isAuthenticated } = useGameStore();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return null;

  // Level limits helper
  const getLevelThreshold = (lvl) => {
    switch(lvl) {
      case 1: return 100;
      case 2: return 250;
      case 3: return 500;
      case 4: return 900;
      case 5: return 1500;
      default: return 99999;
    }
  };

  const currentLevelMax = getLevelThreshold(profile?.level || 1);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 shadow-lg border-b border-teal/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center glow-teal font-extrabold text-navy text-xl shadow-md transition-transform group-hover:scale-105">
            AQ
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-none tracking-wide group-hover:text-teal transition-colors">
              ACEQUEST
            </h1>
            <span className="text-xs font-semibold text-teal-light tracking-widest uppercase glow-text-teal">
              Agent Ragam
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/subject-map" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
            <Compass className="w-4 h-4" />
            Subject Map
          </Link>
          <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
            <UserIcon className="w-4 h-4" />
            Agent Profile
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
            <Award className="w-4 h-4" />
            Leaderboard
          </Link>
          {user.role_id === 3 && (
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-950/30 border border-rose-900/30 transition-all">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Admin
            </Link>
          )}
        </nav>

        {/* Player Status Display */}
        <div className="flex items-center gap-5">
          {/* EXP and Level */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider">Level {profile?.level || 1}</span>
              <span className="text-teal-light font-mono font-bold">{profile?.total_exp || 0} / {currentLevelMax} EXP</span>
            </div>
            <div className="w-32 md:w-40 h-2.5 bg-navy-dark rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-teal-dark to-teal transition-all duration-500 rounded-full glow-teal"
                style={{ width: `${Math.min(100, ((profile?.total_exp || 0) / currentLevelMax) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold shadow-sm font-semibold">
            <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center text-[10px] text-navy font-black">
              $
            </div>
            <span className="font-mono text-sm tracking-wide">{profile?.coins || 0}</span>
          </div>

          {/* User Info & Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <img 
              src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}
              alt={user.username}
              className="w-9 h-9 rounded-md bg-navy-light border border-teal/30 shadow-inner"
            />
            <div className="hidden lg:block text-left">
              <div className="text-sm font-bold text-white leading-tight">{user.username}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Agent</div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-crimson hover:bg-crimson/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
