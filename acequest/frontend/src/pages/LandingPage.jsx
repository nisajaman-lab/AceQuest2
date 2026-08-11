import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Trophy, Sparkles } from 'lucide-react';
import { assets } from '../lib/assets';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden py-10 px-6">
      {/* Background visual details */}
      <div className="absolute inset-0 digital-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Landing Navigation Header */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center glow-teal font-extrabold text-navy text-xl">
            AQ
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-none tracking-wide">ACEQUEST</h1>
            <span className="text-xs font-semibold text-teal-light tracking-widest uppercase glow-text-teal">Agent Ragam</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-teal hover:bg-teal-light text-navy font-bold text-sm shadow-md transition-all glow-teal">
            Join Academy
          </Link>
        </div>
      </div>

      {/* Main Content Hero */}
      <main className="max-w-4xl mx-auto text-center flex-1 flex flex-col justify-center items-center gap-8 py-20 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal-light text-xs font-bold uppercase tracking-wider animate-pulse shadow-inner glow-teal">
          <Sparkles className="w-3.5 h-3.5" />
          Brunei O-Level / IGCSE Revision RPG
        </div>

        <img src={assets.logos.aceQuest} alt="ACEQUEST Logo" className="mx-auto h-24 w-auto mt-4" />

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          The Forgetter Has Struck!<br />
          <span className="bg-gradient-to-r from-teal-light via-teal to-gold bg-clip-text text-transparent glow-text-teal">
            Rescue the Lost Knowledge
          </span>
        </h1>

        <p className="max-w-xl text-slate-400 text-base md:text-lg leading-relaxed">
          Embark on a top-down educational RPG. Step into the shoes of <span className="text-teal-light font-semibold">Agent Ragam</span>, explore magical realms of school subjects, answer curriculum questions, defeat guardians, and earn badges.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link to="/register" className="px-8 py-4 rounded-xl bg-teal hover:bg-teal-light text-navy font-black text-lg shadow-lg hover:shadow-teal/20 hover:scale-105 transition-all glow-teal">
            Start Introductory Mission
          </Link>
          <Link to="/login" className="px-8 py-4 rounded-xl bg-navy-light hover:bg-slate-800/80 border border-slate-700/80 text-white font-bold text-lg hover:scale-105 transition-all">
            Access Terminal
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 text-left">
          <div className="glass-panel p-6 rounded-2xl relative hover:border-teal/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 border border-teal/20 group-hover:bg-teal/20 transition-all">
              <BookOpen className="w-6 h-6 text-teal-light" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">10 Subject Realms</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revised subjects styled as realms: Mathematics (Logic Realm), Computer Science (Tech Realm), English, Biology, Geography, and more.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative hover:border-gold/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 border border-gold/20 group-hover:bg-gold/20 transition-all">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Top-down Phaser Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Explore tileset maps, walk to interact with NPCs, speak to hint givers, and engage with mini-boss Guardians using your knowledge.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative hover:border-teal/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 border border-teal/20 group-hover:bg-teal/20 transition-all">
              <Trophy className="w-6 h-6 text-teal-light" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rewards & Leaderboard</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Earn coins, EXP, unlock badges for perfect scores, customize Agent Ragam with unlockable suits, and rise to Master Agent.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 z-10 max-w-6xl mx-auto w-full border-t border-slate-800/60 pt-6">
        &copy; {new Date().getFullYear()} Totally Spies Academy (TSA). Specially designed for Brunei O-Level & IGCSE Students.
      </footer>
    </div>
  );
}
