
import React, { useState, useEffect } from 'react';
import { Award, Lock, Info, CheckCircle2, Star } from 'lucide-react';
import { appStore } from '../store';
import { AppState } from '../types';

export const Badges = () => {
  const [state, setState] = useState<AppState>(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  const userBadges = state.userBadges.filter(ub => ub.userId === user?.id);
  const unlockedIds = new Set(userBadges.map(ub => ub.badgeId));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Achievement Hall</h2>
          <p className="text-slate-500">Master challenges and collect legendary badges.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
            <Star className="fill-yellow-600" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Your Progress</p>
            <p className="text-lg font-black text-slate-800">{unlockedIds.size} / {state.badges.length} Unlocked</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {state.badges.map((badge) => {
          const isUnlocked = unlockedIds.has(badge.id);
          const unlockedInfo = userBadges.find(ub => ub.badgeId === badge.id);

          return (
            <div 
              key={badge.id} 
              className={`relative bg-white p-8 rounded-[2rem] border-2 transition-all duration-300 group ${
                isUnlocked 
                ? 'border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1' 
                : 'border-slate-100 grayscale opacity-60'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-2 transition-transform duration-500 group-hover:rotate-12 ${isUnlocked ? 'bg-blue-50' : 'bg-slate-50'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tighter">{badge.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{badge.description}</p>
                </div>
              </div>

              {isUnlocked ? (
                <div className="absolute top-4 right-4 text-green-500">
                  <CheckCircle2 size={24} className="fill-white" />
                </div>
              ) : (
                <div className="absolute top-4 right-4 text-slate-300">
                  <Lock size={20} />
                </div>
              )}

              {isUnlocked && (
                <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold text-blue-400 uppercase tracking-widest text-center">
                  Unlocked {new Date(unlockedInfo!.unlockedAt).toLocaleDateString()}
                </div>
              )}
              
              {!isUnlocked && (
                <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Requirement: {badge.criteria}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
