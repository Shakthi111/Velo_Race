
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Shield, TrendingUp, Globe, Award } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between mb-24">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-blue-600">
              <Zap className="fill-blue-600" />
              <span>VeloRace</span>
            </div>
            <Link to="/login" className="px-6 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-full transition">
              Log In
            </Link>
          </nav>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                Race the World, <span className="text-blue-600">From Home.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                The ultimate virtual racing platform. Track your runs, earn legendary badges, and compete on global leaderboards with a community that pushes you further.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-200 transition-all group">
                  Start Your Journey
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800" 
                alt="Runner on trail" 
                className="rounded-3xl shadow-2xl rotate-2 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <TrendingUp />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">+12% Growth</p>
                  <p className="text-xs text-slate-500">Weekly Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">Why Runners Choose VeloRace</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: 'Global Challenges', desc: 'Join thousands in themed virtual races covering real-world distances.' },
              { icon: Shield, title: 'Verified Tracks', desc: 'Our GPS integration ensures every kilometer counts and keeps it fair.' },
              { icon: Award, title: 'Real Achievements', desc: 'Earn digital and physical rewards for hitting major milestones.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl mx-auto mb-6">
                  <f.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
