
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  List, 
  Grid,
  Activity as ActivityIcon,
  X,
  Zap,
  Diamond
} from 'lucide-react';
import { appStore } from '../store';
import { AppState } from '../types';

export const Activities = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    distance: '',
    time: '',
    type: 'Run',
    notes: ''
  });

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  const userActivities = state.activities.filter(a => a.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    appStore.addActivity({
      userId: user.id,
      date: formData.date,
      distance: parseFloat(formData.distance),
      time: parseInt(formData.time),
      type: formData.type,
      notes: formData.notes
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      distance: '',
      time: '',
      type: 'Run',
      notes: ''
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Activity Log</h2>
          <p className="text-slate-500">Every step earns you XP and Credits. Track it here.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white rounded-xl border border-slate-200 p-1 flex">
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} /></button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition shadow-lg ${showForm ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Close' : 'Add Activity'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-100 animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold mb-6 text-slate-900">Record New Activity</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Distance (km)</label>
              <input type="number" step="0.1" required placeholder="0.0" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Time (minutes)</label>
              <input type="number" required placeholder="0" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium">
                <option>Run</option><option>Walk</option><option>Cycle</option><option>Hike</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-sm font-bold text-slate-700">Quick Note</label>
              <input type="text" placeholder="Route, feeling, weather..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Save Log</button>
            </div>
          </form>
        </div>
      )}

      <div className={view === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {userActivities.map((activity) => (
          <div key={activity.id} className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden group ${view === 'list' ? 'flex items-center p-6 gap-6' : 'flex flex-col'}`}>
            <div className={`p-4 ${view === 'list' ? 'rounded-2xl bg-blue-50 text-blue-600' : 'bg-blue-600 text-white flex justify-between items-center'}`}>
              <ActivityIcon size={24} />
              {view === 'grid' && <span className="text-xs font-bold uppercase">{activity.type}</span>}
            </div>
            <div className={`flex-1 ${view === 'grid' ? 'p-6 space-y-4' : 'flex items-center gap-12'}`}>
              <div className={view === 'list' ? 'w-48' : ''}>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{activity.date}</p>
                <h4 className="text-lg font-bold text-slate-800">{activity.notes || 'Workout'}</h4>
              </div>
              <div className={`flex gap-8 ${view === 'grid' ? 'justify-between border-t border-slate-50 pt-4' : ''}`}>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</p><p className="text-xl font-extrabold text-blue-600">{activity.distance} <span className="text-sm font-normal">km</span></p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p><p className="text-xl font-extrabold text-slate-800">{activity.time} <span className="text-sm font-normal">min</span></p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pace</p><p className="text-xl font-extrabold text-slate-800">{activity.pace.toFixed(2)}</p></div>
              </div>
            </div>
            
            {/* Dual Currency Earnings Display */}
            {activity.xpEarned > 0 && (
                <div className={`flex flex-col gap-1 ${view === 'list' ? 'ml-auto' : 'px-6 pb-6'}`}>
                    <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-xs font-bold w-fit ml-auto">
                        <Zap size={12} className="fill-yellow-600 text-yellow-600"/> +{activity.xpEarned} XP
                    </div>
                    {activity.creditsEarned > 0 && (
                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-xs font-bold w-fit ml-auto">
                            <Diamond size={12} className="fill-blue-600 text-blue-600"/> +{activity.creditsEarned} Credits
                        </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
