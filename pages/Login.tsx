
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { appStore } from '../store';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    const result = appStore.login(identifier, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl -ml-48 -mb-48 opacity-50"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-md text-slate-600 hover:text-blue-600 transition z-20">
        <ArrowLeft size={24} />
      </Link>

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500 border border-slate-100">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-black text-blue-600 mb-6">
            <Zap className="fill-blue-600" />
            <span>VeloRace</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back!</h1>
          <p className="text-slate-500 mt-2">Log in to track your progress and race with friends.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username or Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                placeholder="runner@velorace.com"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account? {' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
