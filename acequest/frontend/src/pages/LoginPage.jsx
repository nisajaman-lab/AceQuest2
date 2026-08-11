import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Shield, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError, isAuthenticated } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 digital-grid opacity-15 pointer-events-none"></div>

      <div className="glass-panel-heavy p-8 md:p-10 rounded-2xl w-full max-w-md shadow-2xl relative border border-teal/20">
        {/* Terminal Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900/80 rounded-t-2xl flex items-center px-4 gap-1.5 border-b border-teal/10">
          <div className="w-2.5 h-2.5 rounded-full bg-crimson"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-gold"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-teal"></div>
          <span className="text-[10px] font-mono text-slate-500 ml-auto uppercase tracking-wider">Secure Connection</span>
        </div>

        <div className="text-center mt-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal/10 border border-teal/30 flex items-center justify-center mx-auto mb-4 glow-teal">
            <Shield className="w-8 h-8 text-teal-light" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wide text-white">TSA FIELD AGENT PORTAL</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Enter credentials to authenticate</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-crimson/10 border border-crimson/30 flex items-start gap-3 text-sm text-crimson-light">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agent Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-dark rounded-xl border border-slate-700/80 focus:border-teal text-white focus:outline-none transition-colors placeholder-slate-600 text-sm font-semibold shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Decryption Key</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-navy-dark rounded-xl border border-slate-700/80 focus:border-teal text-white focus:outline-none transition-colors placeholder-slate-600 text-sm font-semibold shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-teal hover:bg-teal-light text-navy font-extrabold rounded-xl transition-all shadow-md active:scale-98 glow-teal hover:shadow-teal/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              'ESTABLISH LINK'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
          First assignment?{' '}
          <Link to="/register" className="text-teal-light hover:underline font-bold">
            Enroll at the Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
