
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, ArrowLeft, MapPin, Gauge } from 'lucide-react';
import { appStore } from '../store';
import { LOCATIONS } from '../constants';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [paceLevel, setPaceLevel] = useState('Beginner');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    await new Promise(r => setTimeout(r, 1200));
    
    const result = appStore.signup(username, email, password, location, paceLevel);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl -ml-48 -mt-48 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -mr-48 -mb-48 opacity-40"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 transition z-20">
        <ArrowLeft size={24} />
      </Link>

      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100 p-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-black text-blue-600 mb-4">
            <Zap className="fill-blue-600" />
            <span>VeloRace</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Start Your Journey</h1>
          <p className="text-slate-500 mt-2">Join a community that runs at your pace.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 animate-in shake-horizontal">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="TrailRunner99"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

             <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Running Pace</label>
              <div className="relative">
                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  value={paceLevel}
                  onChange={e => setPaceLevel(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="Beginner">Beginner (5-7 min/km)</option>
                  <option value="Intermediate">Intermediate (4-5 min/km)</option>
                  <option value="Advanced">Advanced (3-4 min/km)</option>
                  <option value="Expert">Expert (&lt;3 min/km)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="password" 
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="password" 
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Create My Account <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account? {' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
