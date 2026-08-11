import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock, Mail, Shield, User, UserPlus } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export default function AdminRegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerAdmin, isLoading, error, clearError, isAuthenticated, user } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    if (isAuthenticated && user?.role_id === 3) {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate, clearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !password) return;
    const success = await registerAdmin(username, email, password);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 digital-grid opacity-15 pointer-events-none" />
      <div className="glass-panel-heavy p-8 md:p-10 rounded-2xl w-full max-w-md shadow-2xl relative border border-teal/20">
        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900/80 rounded-t-2xl flex items-center px-4 gap-1.5 border-b border-teal/10">
          <div className="w-2.5 h-2.5 rounded-full bg-crimson" />
          <div className="w-2.5 h-2.5 rounded-full bg-gold" />
          <div className="w-2.5 h-2.5 rounded-full bg-teal" />
          <span className="text-[10px] font-mono text-slate-500 ml-auto uppercase tracking-wider">Admin Enrollment</span>
        </div>

        <div className="text-center mt-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal/10 border border-teal/30 flex items-center justify-center mx-auto mb-4 glow-teal">
            <UserPlus className="w-8 h-8 text-teal-light" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide text-white">CREATE ADMIN ACCESS</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Initialize an administrator profile for the control panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-crimson/10 border border-crimson/30 flex items-start gap-3 text-sm text-crimson-light">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-dark rounded-xl border border-slate-700/80 focus:border-teal text-white focus:outline-none transition-colors placeholder-slate-600 text-sm font-semibold shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recovery Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-dark rounded-xl border border-slate-700/80 focus:border-teal text-white focus:outline-none transition-colors placeholder-slate-600 text-sm font-semibold shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Master Key</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-dark rounded-xl border border-slate-700/80 focus:border-teal text-white focus:outline-none transition-colors placeholder-slate-600 text-sm font-semibold shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                CREATING ACCESS...
              </>
            ) : (
              'CREATE ADMIN ACCOUNT'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
          Already have an admin account?{' '}
          <Link to="/admin/login" className="text-teal-light hover:underline font-bold">
            Return to control room
          </Link>
        </div>
      </div>
    </div>
  );
}
