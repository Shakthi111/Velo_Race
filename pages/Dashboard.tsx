
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Trophy, 
  Flame, 
  Map, 
  Timer, 
  ChevronRight, 
  Activity as ActivityIcon,
  Award,
  X,
  Zap,
  Users,
  Diamond,
  ShoppingBag
} from 'lucide-react';
import { appStore } from '../store';
import { AppState, Activity } from '../types';
import { XP_THRESHOLDS } from '../constants';

export const Dashboard = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [goalInputs, setGoalInputs] = useState({ weekly: 0, monthly: 0 });

  useEffect(() => {
    return appStore.subscribe(() => {
      // Force update by creating a shallow copy of the state
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  if (!user) return null;

  const handleEditGoals = () => {
    setGoalInputs({ weekly: user.goals.weeklyDistance, monthly: user.goals.monthlyDistance });
    setIsEditingGoals(true);
  };

  const saveGoals = () => {
    appStore.updateGoals(goalInputs.weekly, goalInputs.monthly);
    setIsEditingGoals(false);
  };

  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const distance = state.activities
      .filter(a => a.userId === user.id && a.date === dateStr)
      .reduce((sum, a) => sum + a.distance, 0);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      distance
    };
  });

  const StatCard = ({ icon: Icon, color, label, value, sub }: any) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
      <div className={`p-3 rounded-2xl bg-${color}-100 text-${color}-600`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{sub}</p>
      </div>
    </div>
  );

  const userUnlockedBadges = state.userBadges.filter(ub => ub.userId === user.id);

  // Gamification Data
  const commId = `${user.location}-${user.communityTier}`;
  const communityData = state.communities[commId] || { currentXP: 0, xpThreshold: 50000 };
  
  // Calculate XP needed for next tier
  // Requirements: Beginner 2000, Int 7000, Adv 17000.
  let nextTierXP = 2000;
  if (user.communityTier === 'Intermediate') nextTierXP = 7000;
  if (user.communityTier === 'Advanced') nextTierXP = 17000;
  if (user.communityTier === 'Expert') nextTierXP = 25000; // Just a placeholder for max

  const personalProgress = Math.min((user.personalXP / nextTierXP) * 100, 100);
  const communityProgress = Math.min((communityData.currentXP / communityData.xpThreshold) * 100, 100);

  // Filter Activity Feed - Show self and following
  const relevantFeed = state.activityFeed.filter(item => 
    item.userId === user.id || 
    (user.following && user.following.includes(item.userId)) ||
    item.type === 'event_join' // Show event joins globally or filter by community? Let's keep it tight.
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Goal Edit Modal */}
      {isEditingGoals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Adjust Goals</h3>
              <button onClick={() => setIsEditingGoals(false)} className="p-2 text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weekly Goal (km)</label>
                <input 
                  type="number" 
                  value={goalInputs.weekly} 
                  onChange={e => setGoalInputs({...goalInputs, weekly: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Monthly Goal (km)</label>
                <input 
                  type="number" 
                  value={goalInputs.monthly} 
                  onChange={e => setGoalInputs({...goalInputs, monthly: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                />
              </div>
            </div>
            <button 
              onClick={saveGoals}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition"
            >
              Update Goals
            </button>
          </div>
        </div>
      )}

      {/* Hero: Dual Currency Display */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* XP Card - Progression */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between h-64 border-4 border-white/10">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                        <Zap className="fill-yellow-400 text-yellow-400" size={28} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full border border-white/10">
                        Tier Progression
                    </span>
                </div>
                <h3 className="text-3xl font-black mt-2">{user.communityTier}</h3>
                <p className="text-blue-200 text-sm font-medium">Current Status</p>
            </div>
            
            <div className="relative z-10 space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold">{user.personalXP} <span className="text-sm font-normal text-blue-300">XP</span></span>
                    <span className="text-xs font-bold text-blue-300">{nextTierXP} XP Goal</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${personalProgress}%` }}></div>
                </div>
                <p className="text-[10px] text-blue-300 text-right">Accumulates permanently</p>
            </div>
            
            {/* Background Decor */}
            <Zap className="absolute -top-6 -right-6 text-white/5" size={200} />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Credits Card - Spending */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between h-64 border-4 border-white/10">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-lg">
                        <Diamond className="fill-blue-200 text-white" size={28} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full border border-white/20">
                        Spendable
                    </span>
                </div>
                <h3 className="text-4xl font-black mt-2 tracking-tight">{user.credits}</h3>
                <p className="text-yellow-50 text-sm font-bold">Credits Available</p>
            </div>

            <div className="relative z-10">
                <div className="flex gap-3 mt-4">
                     <Link to="/cravings" className="flex-1 bg-white text-orange-600 px-4 py-3 rounded-2xl font-bold text-sm hover:bg-orange-50 transition shadow-lg flex items-center justify-center gap-2">
                        <ShoppingBag size={16} /> Shop Cravings
                     </Link>
                     <Link to="/events" className="flex-1 bg-black/10 text-white px-4 py-3 rounded-2xl font-bold text-sm hover:bg-black/20 transition border border-white/20 flex items-center justify-center gap-2">
                        <Users size={16} /> Join Events
                     </Link>
                </div>
                <p className="text-[10px] text-yellow-100 text-center mt-3">Earn more by logging activities!</p>
            </div>

            {/* Background Decor */}
            <Diamond className="absolute -bottom-10 -right-10 text-white/10 rotate-12" size={220} />
        </div>
      </div>

      {/* Community Progress Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <Users className="text-green-600" size={20} />
                <h3 className="font-bold text-slate-800">Community Event Goal</h3>
             </div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.location} • {user.communityTier}</span>
        </div>
        <div className="h-6 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center z-10 text-[10px] font-bold text-slate-600">
                {Math.round(communityProgress)}% to Next Event
            </div>
            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${communityProgress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Map} color="blue" label="Total Distance" value={`${user.stats.totalDistance.toFixed(1)} km`} sub="Across all activities" />
        <StatCard icon={Flame} color="orange" label="Current Streak" value={`${user.stats.currentStreak} Days`} sub="Keep it up!" />
        <StatCard icon={Timer} color="green" label="Best Pace" value={`${user.stats.bestPace.toFixed(2)} min/km`} sub="Personal Record" />
        <StatCard icon={Trophy} color="yellow" label="Global Rank" value={`#${user.globalRank}`} sub={`Top ${(user.globalRank / state.users.length * 100).toFixed(0)}%`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Weekly Progress</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div> Distance
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData}>
                <defs>
                  <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="distance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDist)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Goals Progress</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600">Weekly Goal</span>
                <span className="text-sm font-bold text-blue-600">{user.stats.totalDistance.toFixed(1)} / {user.goals.weeklyDistance} km</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((user.stats.totalDistance / user.goals.weeklyDistance) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-600">Monthly Goal</span>
                <span className="text-sm font-bold text-green-600">{user.stats.totalDistance.toFixed(1)} / {user.goals.monthlyDistance} km</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((user.stats.totalDistance / user.goals.monthlyDistance) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleEditGoals}
            className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition"
          >
            Adjust Target Goals
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Activity Feed</h3>
          <div className="space-y-6">
            {relevantFeed.length > 0 ? relevantFeed.slice(0, 5).map((item) => {
              const feedUser = state.users.find(u => u.id === item.userId);
              return (
                <div key={item.id} className="flex gap-4">
                  <img src={feedUser?.avatar} alt="" className="w-12 h-12 rounded-full" />
                  <div className="flex-1 border-b border-slate-100 pb-4">
                    <p className="text-sm text-slate-800">
                      <span className="font-bold">{feedUser?.username}</span>
                      {item.type === 'activity' && ' logged a new run!'}
                      {item.type === 'badge' && ' earned a new badge!'}
                      {item.type === 'follow' && ' started following someone!'}
                      {item.type === 'tier_up' && ` promoted to ${(item.data as any).tier}! 🚀`}
                      {item.type === 'event_join' && ` joined ${item.data?.eventTitle}! 🎉`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="mt-2 flex gap-4">
                      <button 
                        onClick={() => appStore.likeFeedItem(item.id)}
                        className={`text-xs font-bold flex items-center gap-1 ${item.likes.includes(user.id) ? 'text-blue-600' : 'text-slate-400'}`}
                      >
                        <Flame size={14} className={item.likes.includes(user.id) ? 'fill-blue-600' : ''} />
                        {item.likes.length} Cheers
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10 text-slate-400">
                <Users className="mx-auto mb-2 opacity-50" size={32} />
                <p>No activity from friends yet. Follow more runners!</p>
                <Link to="/friends" className="text-blue-600 font-bold text-sm mt-2 inline-block hover:underline">Find Friends</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Your Badges</h3>
            <Link to="/badges" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {userUnlockedBadges.length > 0 ? (
              userUnlockedBadges.slice(0, 8).map((ub) => {
                const badge = state.badges.find(b => b.id === ub.badgeId);
                return (
                  <div key={ub.badgeId} className="group relative aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-2 text-center hover:bg-blue-50 transition">
                    <span className="text-3xl mb-1">{badge?.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{badge?.name}</span>
                  </div>
                );
              })
            ) : (
               <div className="col-span-4 flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                 <Award size={32} className="opacity-50" />
                 <p className="text-sm font-medium">No badges unlocked yet.</p>
                 <Link to="/activities" className="text-xs text-blue-600 font-bold hover:underline">Start running to earn!</Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
