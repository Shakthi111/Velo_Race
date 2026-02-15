
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, UserPlus, UserMinus, MessageSquare, Flame, Check, Heart, ExternalLink, X, Send
} from 'lucide-react';
import { appStore } from '../store';
import { AppState } from '../types';

export const Friends = () => {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (selectedFriendId) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedFriendId, state.messages, state.directMessages]);

  const currentUser = state.currentUser;
  const potentialFriends = state.users.filter(u => u.id !== currentUser?.id);
  const following = currentUser?.following || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFriendId && messageText.trim()) {
      appStore.sendMessage(selectedFriendId, messageText);
      setMessageText('');
    }
  };

  const getConversation = (friendId: string) => {
    const legacyMessages = state.messages || [];
    const newMessages = state.directMessages || [];
    const allMessages = [...legacyMessages, ...newMessages];

    return allMessages.filter(m => 
      (m.senderId === currentUser?.id && m.recipientId === friendId) ||
      (m.senderId === friendId && m.recipientId === currentUser?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const selectedFriend = state.users.find(u => u.id === selectedFriendId);

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Runners Community</h2>
          <p className="text-slate-500">Discover and follow athletes around the globe.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Find runners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition w-full sm:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {potentialFriends.filter(f => f.username.toLowerCase().includes(searchTerm.toLowerCase())).map((friend) => {
          const isFollowing = following.includes(friend.id);
          return (
            <div key={friend.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <img src={friend.avatar} className="w-28 h-28 rounded-[2rem] border-4 border-slate-50 group-hover:scale-110 transition duration-500" alt="" />
                {isFollowing && <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white"><Check size={14} /></div>}
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-1">{friend.username}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Pace: {friend.stats.bestPace.toFixed(1)} m/k</p>
              
              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <p className="text-lg font-black text-slate-800">{friend.stats.totalDistance.toFixed(0)}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">KM</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <p className="text-lg font-black text-orange-500">{friend.stats.currentStreak}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Streak</p>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => appStore.toggleFollow(friend.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isFollowing ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                  }`}
                >
                  {isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button 
                  onClick={() => setSelectedFriendId(friend.id)}
                  className="w-full py-4 border border-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Send Message
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Drawer */}
      {selectedFriendId && selectedFriend && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={selectedFriend.avatar} className="w-10 h-10 rounded-full" alt="" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedFriend.username}</h3>
                  <p className="text-xs text-slate-500">Online now</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFriendId(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {getConversation(selectedFriend.id).length > 0 ? (
                getConversation(selectedFriend.id).map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessageSquare size={32} className="opacity-20" />
                  <p className="text-sm">No messages yet. Say hello!</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition text-sm"
                />
                <button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:hover:bg-blue-600"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
