
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, CheckCircle2, Diamond, ArrowRight, Camera, Music, Pizza, Play } from 'lucide-react';
import { appStore } from '../store';
import { AppState } from '../types';

export const Events = () => {
  const [state, setState] = useState<AppState>(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  if (!user) return null;

  // Filter events: Global or user's community specific
  const activeEvents = state.communityEvents.filter(e => 
      (e.communityId === `${user.location}-${user.communityTier}` || e.communityId.includes(user.location)) && e.status === 'upcoming'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Community Events</h2>
          <p className="text-slate-500">Real-world gatherings. Spend credits to join!</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
            <Diamond size={20} className="fill-blue-300 text-blue-300" />
            <span>Balance: {user.credits} Credits</span>
        </div>
      </div>

      <div className="space-y-12">
        {activeEvents.length > 0 ? (
            activeEvents.map(event => {
                const isJoined = event.participants.includes(user.id);
                const cost = event.creditsCost || 0;
                const canAfford = user.credits >= cost;

                return (
                    <div key={event.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl group">
                        {/* Hero Image */}
                        <div className="relative h-64 md:h-80 w-full overflow-hidden">
                            <img 
                                src={event.image || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800'} 
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wide w-fit">
                                    {event.communityId}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{event.title}</h3>
                                <div className="flex flex-wrap gap-4 text-white/80 text-sm font-medium">
                                    <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(event.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-2"><MapPin size={16}/> {event.location}</span>
                                    <span className="flex items-center gap-2"><Users size={16}/> {event.participants.length} Joining</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">About this Event</h4>
                                    <p className="text-slate-600 leading-relaxed">{event.description}</p>
                                </div>

                                {event.activities && (
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 mb-4">Activities & Perks</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {event.activities.map((act, i) => (
                                                <div key={i} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="text-3xl mb-2">{act.icon}</span>
                                                    <span className="font-bold text-slate-700 text-sm">{act.name}</span>
                                                    <span className="text-xs text-slate-400 mt-1">{act.creditsCost > 0 ? `${act.creditsCost} Cr` : 'Free'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between h-full">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-4">Registration</h4>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Entry Fee</span>
                                            <span className="font-bold text-slate-900 flex items-center gap-1">
                                                <Diamond size={14} className="fill-blue-500 text-blue-500"/> {cost}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Your Balance</span>
                                            <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                                                {user.credits}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {isJoined ? (
                                    <button disabled className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-default shadow-lg shadow-green-200">
                                        <CheckCircle2 size={20} />
                                        You're Going!
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => appStore.joinEvent(event.id)}
                                        disabled={!canAfford}
                                        className={`w-full py-4 rounded-2xl font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                                            canAfford 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {canAfford ? 'Confirm RSVP' : 'Not Enough Credits'}
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className="bg-slate-100 rounded-[2.5rem] p-16 text-center text-slate-400 border-2 border-dashed border-slate-200">
                <Calendar size={64} className="mx-auto mb-6 opacity-20" />
                <h3 className="text-2xl font-bold text-slate-600 mb-2">No Upcoming Events</h3>
                <p>Log activities to fill the Community XP bar and unlock the next gathering!</p>
            </div>
        )}
      </div>
    </div>
  );
};
