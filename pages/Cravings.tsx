
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, Clock, Check, Diamond } from 'lucide-react';
import { appStore } from '../store';
import { AppState } from '../types';
import { CRAVINGS_MENU } from '../constants';

export const Cravings = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  const user = state.currentUser;
  if (!user) return null;

  const handlePurchase = (id: string) => {
      const result = appStore.purchaseCraving(id);
      setPurchaseMsg(result.message);
      setTimeout(() => setPurchaseMsg(null), 3000);
  };

  const history = state.cravingsHistory.filter(h => h.userId === user.id).slice(0, 5);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {purchaseMsg && (
        <div className="fixed top-20 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right">
          <Check size={20} />
          <span className="font-bold">{purchaseMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Cravings Shop</h2>
          <p className="text-slate-500">Spend your credits on guilt-free rewards. Does not affect your XP tier!</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Diamond className="fill-white" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none">Credits Available</p>
            <p className="text-3xl font-black">{user.credits}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CRAVINGS_MENU.map((item) => {
            const canAfford = user.credits >= item.creditsCost;
            return (
                <div key={item.id} className={`bg-white p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${canAfford ? 'border-slate-100 hover:border-blue-200 hover:shadow-xl' : 'border-slate-100 opacity-60'}`}>
                    <div className="text-5xl mb-4 bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center">{item.icon}</div>
                    <h3 className="font-bold text-xl text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6 min-h-[40px]">{item.description}</p>
                    <button 
                        onClick={() => handlePurchase(item.id)}
                        disabled={!canAfford}
                        className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${canAfford ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        <span>{item.creditsCost} Credits</span>
                        {canAfford && <ShoppingBag size={16} />}
                    </button>
                </div>
            );
        })}
      </div>

      {history.length > 0 && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-slate-400" />
                  Recent Purchases
              </h3>
              <div className="space-y-4">
                  {history.map((h, i) => {
                      const item = CRAVINGS_MENU.find(c => c.id === h.cravingId);
                      return (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl">{item?.icon}</span>
                                  <span className="font-bold text-slate-700">{item?.name}</span>
                              </div>
                              <span className="text-xs font-bold text-slate-400">
                                  {new Date(h.date).toLocaleDateString()}
                              </span>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}
    </div>
  );
};
