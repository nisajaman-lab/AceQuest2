import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGameStore } from '../store/useGameStore';
import { assets, getBadgeIconAsset } from '../lib/assets';
import { User, Award, Shield, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, getAuthHeader, updateProfileStats } = useGameStore();
  const [skins, setSkins] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipLoading, setEquipLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const skinsRes = await axios.get('http://127.0.0.1:8000/api/player/skins', {
          headers: getAuthHeader(),
        });
        const badgesRes = await axios.get('http://127.0.0.1:8000/api/player/badges', {
          headers: getAuthHeader(),
        });
        setSkins(skinsRes.data);
        setBadges(badgesRes.data);
      } catch (err) {
        console.error("Failed to load profile assets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [getAuthHeader]);

  const handleEquipSkin = async (skinName) => {
    if (user?.skin_equipped === skinName) return;
    setEquipLoading(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/player/equip-skin?skin_name=${skinName}`,
        {},
        { headers: getAuthHeader() }
      );
      updateProfileStats({});
      useGameStore.setState((state) => ({
        user: state.user ? { ...state.user, skin_equipped: skinName } : null
      }));
      alert(`Skin "${skinName}" equipped successfully!`);
    } catch (err) {
      console.error("Failed to equip skin", err);
      alert("Error equipping skin.");
    } finally {
      setEquipLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 relative">
      <div className="absolute inset-0 digital-grid opacity-10 pointer-events-none"></div>

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal glow-teal animate-float">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">AGENT TERMINAL PROFILE</h2>
            <p className="text-sm text-slate-400 mt-1">Equip skins, inspect earned merit badges, and check status parameters.</p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-500">
          Syncing profile database files...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img 
                src={user?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`}
                alt={user?.username}
                className="w-24 h-24 rounded-2xl bg-navy border border-teal/40 p-1 shadow-inner glow-teal"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal flex items-center justify-center font-mono font-bold text-navy border border-navy-dark text-xs shadow-md">
                {profile?.level || 1}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-white">{user?.username}</h3>
              <p className="text-xs text-teal-light font-semibold uppercase tracking-widest mt-1">Level {profile?.level} Field Agent</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>

            <div className="w-full pt-4 border-t border-slate-800/60 space-y-2 text-left text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-500">Equipped Suit:</span>
                <span className="text-white font-mono">{user?.skin_equipped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Login Streak:</span>
                <span className="text-gold flex items-center gap-0.5">{profile?.login_streak || 1} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Decryption Coins:</span>
                <span className="text-white font-mono">{profile?.coins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acquired Badges:</span>
                <span className="text-teal-light">{badges.length}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4.5 h-4.5 text-teal" /> Agent Suit Locker
              </h3>
              <p className="text-xs text-slate-400">Unlock customized agent suits by completing O-Level Subject Realms.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {skins.map((skin) => {
                  const isEquipped = user?.skin_equipped === skin.name;
                  return (
                    <div 
                      key={skin.id}
                      onClick={() => !isEquipped && !equipLoading && handleEquipSkin(skin.name)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isEquipped 
                          ? 'border-teal bg-teal/5 text-white glow-teal' 
                          : 'border-slate-800 bg-slate-900/10 hover:border-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-navy border border-slate-800 flex items-center justify-center overflow-hidden">
                          {skin.preview_url ? (
                            <img src={skin.preview_url} alt={skin.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">👕</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{skin.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{skin.description}</div>
                        </div>
                      </div>
                      <div>
                        {isEquipped ? (
                          <CheckCircle2 className="w-5 h-5 text-teal" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-700" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-gold" /> Merit Badges Cabinet
              </h3>
              <p className="text-xs text-slate-400">Merit badges earned from completing chapter missions and earning perfect scores.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {badges.map((badge) => (
                  <div key={badge.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-2 hover:border-gold/30 transition-colors">
                    <img 
                      src={getBadgeIconAsset(badge) || assets.ui.badgePlaceholder} 
                      alt={badge.name} 
                      className="w-12 h-12 bg-navy border border-slate-800/80 rounded-xl p-1 glow-gold shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://api.dicebear.com/7.x/identicon/svg?seed=badge";
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[100px]">{badge.name}</div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[100px] mt-0.5">{badge.badge_type}</div>
                    </div>
                  </div>
                ))}

                {badges.length === 0 && (
                  <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-500 gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-600" />
                    <span className="text-xs">No merit badges earned yet. Complete chapters with 100% correctness!</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
