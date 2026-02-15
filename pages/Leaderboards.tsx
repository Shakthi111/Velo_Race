
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, ArrowUpRight, Search, Users } from 'lucide-react';
import { appStore } from '../store';
import { AppState, CommunityTier } from '../types';

export const Leaderboards = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [tab, setTab] = useState<'Global' | 'Friends' | 'Community'>('Global');
  
  // Default to user's tier if logged in
  const currentUser = state.currentUser;
  const [selectedTier, setSelectedTier] = useState<CommunityTier>(currentUser?.communityTier || 'Beginner');

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  let sortedUsers = [...state.users];

  if (tab === 'Global') {
      // Global Rank based on Personal XP
      sortedUsers.sort((a, b) => b.personalXP - a.personalXP);
  } else if (tab === 'Friends') {
      sortedUsers = sortedUsers.filter(u => currentUser?.following.includes(u.id) || u.id === currentUser?.id);
      sortedUsers.sort((a, b) => b.personalXP - a.personalXP);
  } else if (tab === 'Community') {
      // Filter by the selected tier dropdown
      sortedUsers = sortedUsers.filter(u => u.communityTier === selectedTier);
      // Sort by Personal XP for gamification view
      sortedUsers.sort((a, b) => b.personalXP - a.personalXP);
  }

  const top3 = sortedUsers.slice(0, 3);
  const others = sortedUsers.slice(3, 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Leaderboards</h2>
        <p className="text-slate-500">The hall of fame. See how you stack up against the best.</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 w-fit">
            {['Global', 'Friends', 'Community'].map((t) => (
              <button 
                key={t}
                onClick={() => setTab(t as any)}
                className={`px-6 py-3 rounded-xl font-bold transition ${tab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Community' && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                  <Users size={18} className="text-slate-400" />
                  <select 
                    value={selectedTier} 
                    onChange={(e) => setSelectedTier(e.target.value as CommunityTier)}
                    className="bg-transparent font-bold text-slate-700 outline-none"
                  >
                      <option value="Beginner">Beginner Tier</option>
                      <option value="Intermediate">Intermediate Tier</option>
                      <option value="Advanced">Advanced Tier</option>
                      <option value="Expert">Expert Tier</option>
                  </select>
              </div>
          )}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-12">
        {/* Silver - 2nd */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          <div className="relative mb-4">
            <img src={top3[1]?.avatar} className="w-24 h-24 rounded-full border-4 border-slate-200" alt="" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-200 text-slate-600 flex items-center justify-center rounded-full font-bold shadow-lg">2</div>
          </div>
          <div className="bg-white p-6 rounded-t-3xl border-x border-t border-slate-200 w-full text-center h-32 flex flex-col justify-center">
            <h4 className="font-bold text-slate-800">{top3[1]?.username}</h4>
            <p className="text-blue-600 font-extrabold">{top3[1]?.personalXP} XP</p>
          </div>
        </div>

        {/* Gold - 1st */}
        <div className="order-1 md:order-2 flex flex-col items-center scale-110 md:-translate-y-4">
          <div className="relative mb-6">
            <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400" size={48} />
            <img src={top3[0]?.avatar} className="w-32 h-32 rounded-full border-4 border-yellow-400 p-1" alt="" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 text-white flex items-center justify-center rounded-full font-bold shadow-xl">1</div>
          </div>
          <div className="bg-white p-8 rounded-t-3xl border-x border-t border-yellow-100 w-full text-center h-40 flex flex-col justify-center shadow-xl shadow-yellow-50">
            <h4 className="text-xl font-extrabold text-slate-900">{top3[0]?.username}</h4>
            <p className="text-2xl font-black text-blue-600">{top3[0]?.personalXP} XP</p>
          </div>
        </div>

        {/* Bronze - 3rd */}
        <div className="order-3 flex flex-col items-center">
          <div className="relative mb-4">
            <img src={top3[2]?.avatar} className="w-20 h-20 rounded-full border-4 border-orange-200" alt="" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-300 text-white flex items-center justify-center rounded-full font-bold shadow-lg">3</div>
          </div>
          <div className="bg-white p-6 rounded-t-3xl border-x border-t border-slate-200 w-full text-center h-28 flex flex-col justify-center">
            <h4 className="font-bold text-slate-800">{top3[2]?.username}</h4>
            <p className="text-blue-600 font-extrabold">{top3[2]?.personalXP} XP</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">
              {tab === 'Community' ? `${selectedTier} Rankings` : 'Global Rankings'}
          </h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Find a runner..." className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-48" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-4">Rank</th>
              <th className="px-4 py-4">Runner</th>
              <th className="px-4 py-4">Tier</th>
              <th className="px-4 py-4">Pace</th>
              <th className="px-8 py-4 text-right">Personal XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {others.map((u, i) => (
              <tr key={u.id} className={`group hover:bg-slate-50 transition ${u.id === state.currentUser?.id ? 'bg-blue-50/50' : ''}`}>
                <td className="px-8 py-4 font-bold text-slate-500">#{i + 4}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                    <span className="font-bold text-slate-800">{u.username}</span>
                    {u.id === state.currentUser?.id && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">YOU</span>}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600 text-sm">{u.communityTier}</td>
                <td className="px-4 py-4 text-slate-600 text-sm">{u.stats.bestPace.toFixed(2)} m/k</td>
                <td className="px-8 py-4 text-right font-black text-blue-600">{u.personalXP} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 text-center border-t border-slate-50">
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View Full Leaderboard</button>
        </div>
      </div>
    </div>
  );
};
