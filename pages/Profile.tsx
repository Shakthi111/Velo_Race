
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Map, Flame, Award, Calendar, Edit3, Mail, Check, Zap, ShoppingBag, TrendingUp, Activity as ActivityIcon, Diamond, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { appStore } from '../store';
import { AppState, CommunityTier } from '../types';
import { XP_THRESHOLDS } from '../constants';

// Helper for Tier Theming
const getTierTheme = (tier: CommunityTier) => {
  switch (tier) {
    case 'Expert': return { bg: 'bg-purple-600', from: 'from-purple-600', to: 'to-indigo-900', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' };
    case 'Advanced': return { bg: 'bg-orange-500', from: 'from-orange-500', to: 'to-red-600', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' };
    case 'Intermediate': return { bg: 'bg-blue-600', from: 'from-blue-600', to: 'to-cyan-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' };
    default: return { bg: 'bg-green-500', from: 'from-green-500', to: 'to-emerald-700', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200' };
  }
};

export const Profile = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [isEditingShowcase, setIsEditingShowcase] = useState(false);
  const [showcaseDraft, setShowcaseDraft] = useState<string[]>([]);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  if (!user) return null;

  const theme = getTierTheme(user.communityTier);
  const unlockedBadges = state.userBadges.filter(ub => ub.userId === user.id);
  const currentShowcase = user.showcaseBadges;

  // XP Calculations
  let nextTierXP = 2000;
  if (user.communityTier === 'Intermediate') nextTierXP = 7000;
  if (user.communityTier === 'Advanced') nextTierXP = 17000;
  if (user.communityTier === 'Expert') nextTierXP = 25000;

  const progressPercent = Math.min((user.personalXP / nextTierXP) * 100, 100);

  // Chart Data (Last 7 Days)
  const weeklyChartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const distance = state.activities
      .filter(a => a.userId === user.id && a.date === dateStr)
      .reduce((sum, a) => sum + a.distance, 0);
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), distance };
  });

  const handleStartShowcaseEdit = () => {
    setShowcaseDraft([...currentShowcase]);
    setIsEditingShowcase(true);
  };

  const toggleDraftBadge = (badgeId: string) => {
    if (showcaseDraft.includes(badgeId)) {
      setShowcaseDraft(showcaseDraft.filter(id => id !== badgeId));
    } else if (showcaseDraft.length < 4) {
      setShowcaseDraft([...showcaseDraft, badgeId]);
    }
  };

  const saveShowcase = () => {
    appStore.updateShowcase(showcaseDraft);
    setIsEditingShowcase(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* --- Badge Editor Modal --- */}
      {isEditingShowcase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Showcase Your Glory</h3>
                <p className="text-slate-500">Select up to 4 badges to display on your profile.</p>
              </div>
              <button onClick={() => setIsEditingShowcase(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"><X /></button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8 max-h-[60vh] overflow-y-auto p-2">
              {unlockedBadges.map(ub => {
                const badge = state.badges.find(b => b.id === ub.badgeId);
                const isSelected = showcaseDraft.includes(ub.badgeId);
                return (
                  <button 
                    key={ub.badgeId} 
                    onClick={() => toggleDraftBadge(ub.badgeId)}
                    className={`relative p-4 rounded-3xl border-2 flex flex-col items-center transition-all duration-200 ${
                      isSelected 
                      ? `border-${theme.text.split('-')[1]}-500 bg-${theme.text.split('-')[1]}-50 scale-105 shadow-md` 
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-4xl mb-2 filter drop-shadow-sm">{badge?.icon}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase text-center leading-tight">{badge?.name}</span>
                    {isSelected && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${theme.bg} text-white flex items-center justify-center`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
              {unlockedBadges.length === 0 && (
                 <div className="col-span-full text-center py-12 text-slate-400">
                    <Award size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No badges unlocked yet. Go run!</p>
                 </div>
              )}
            </div>
            
            <button 
              onClick={saveShowcase} 
              className={`w-full py-4 ${theme.bg} text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg shadow-blue-100`}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 relative group">
        <div className={`h-48 bg-gradient-to-r ${theme.from} ${theme.to} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <button className="absolute top-6 right-6 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition border border-white/10">
            <Settings size={20} />
          </button>
        </div>

        <div className="px-8 md:px-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
            <div className="relative">
                <img src={user.avatar} className="w-36 h-36 rounded-[2rem] border-[6px] border-white shadow-2xl bg-white object-cover" alt="" />
                <div className={`absolute -bottom-2 -right-2 ${theme.bg} text-white p-2 rounded-xl border-4 border-white shadow-lg`}>
                    <Award size={20} />
                </div>
            </div>
            
            <div className="flex-1 space-y-3 pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{user.username}</h2>
                <span className={`self-start md:self-auto px-4 py-1.5 ${theme.light} ${theme.text} rounded-full text-xs font-extrabold uppercase tracking-widest border ${theme.border}`}>
                  {user.communityTier} Athlete
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-sm font-medium">
                <span className="flex items-center gap-2"><Map size={16} className="text-slate-400"/> {user.location}</span>
                <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400"/> Member since {new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mt-4 md:mt-0">
                 <Link to="/activities" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition flex items-center gap-2">
                    <ActivityIcon size={18} /> Log
                 </Link>
                 <Link to="/cravings" className={`px-6 py-3 ${theme.bg} text-white rounded-2xl font-bold text-sm hover:opacity-90 transition shadow-lg shadow-blue-100 flex items-center gap-2`}>
                    <ShoppingBag size={18} /> Shop
                 </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: Stats --- */}
        <div className="lg:col-span-1 space-y-6">
            {/* Tier Progress Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-bold text-slate-800">Tier Progress</h3>
                    <TrendingUp size={20} className={theme.text} />
                </div>
                <div className="flex items-end gap-1 mb-2 relative z-10">
                    <span className={`text-3xl font-black ${theme.text}`}>{user.personalXP}</span>
                    <span className="text-xs font-bold text-slate-400 mb-1.5">/ {nextTierXP} XP</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full ${theme.bg} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-3 font-medium text-center">
                    {nextTierXP - user.personalXP} XP needed for promotion
                </p>
                {/* Decorative BG */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${theme.light} rounded-full blur-2xl`}></div>
            </div>

            {/* Currency Stats */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500 fill-yellow-500" /> 
                    Currency Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-yellow-600 uppercase">Lifetime XP</p>
                        <p className="text-lg font-black text-slate-900">{user.totalXPEarned || user.personalXP}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Lifetime Credits</p>
                        <p className="text-lg font-black text-slate-900">{user.totalCreditsEarned || user.credits}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Credits Spent</p>
                        <p className="text-lg font-black text-slate-900">{user.creditsSpent || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-purple-600 uppercase">Balance</p>
                        <p className="text-lg font-black text-slate-900">{user.credits}</p>
                    </div>
                </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-blue-200 transition group">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition"><Map size={20} /></div>
                    <div>
                        <div className="text-lg font-black text-slate-900">{user.stats.totalDistance.toFixed(0)}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Km Run</div>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-orange-200 transition group">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition"><Flame size={20} /></div>
                    <div>
                        <div className="text-lg font-black text-slate-900">{user.stats.currentStreak}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Streak</div>
                    </div>
                 </div>
            </div>
        </div>

        {/* --- Right Column: Showcase & History --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Badge Showcase */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Award size={24} className={theme.text} />
                        Trophy Case
                    </h3>
                    <button onClick={handleStartShowcaseEdit} className={`text-xs font-bold ${theme.text} bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1`}>
                        <Edit3 size={14} /> Edit
                    </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentShowcase.length > 0 ? currentShowcase.map(id => {
                    const badge = state.badges.find(b => b.id === id);
                    return (
                      <div key={id} className="aspect-square flex flex-col items-center justify-center p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                        <span className="text-5xl mb-3 filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{badge?.icon}</span>
                        <span className="text-[10px] font-black text-slate-700 text-center uppercase tracking-tight leading-tight">{badge?.name}</span>
                      </div>
                    );
                  }) : (
                      <div className="col-span-4 py-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer" onClick={handleStartShowcaseEdit}>
                          <Award size={32} />
                          <span className="text-sm font-bold">Select Badges to Showcase</span>
                      </div>
                  )}
                </div>
            </div>

            {/* Weekly Performance Chart */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Weekly Performance</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Last 7 Days</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyChartData}>
                            <RechartsTooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <Bar dataKey="distance" radius={[6, 6, 6, 6]}>
                                {weeklyChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.distance > 0 ? '#3b82f6' : '#e2e8f0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
