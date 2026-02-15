
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Home, 
  Trophy, 
  User, 
  PlusCircle, 
  Award, 
  Users, 
  LayoutDashboard,
  Menu,
  X,
  Zap,
  LogOut,
  ShoppingBag,
  PartyPopper,
  Diamond,
  Bell,
  MessageSquare
} from 'lucide-react';
import { appStore } from './store';
import { Dashboard } from './pages/Dashboard';
import { Leaderboards } from './pages/Leaderboards';
import { Profile } from './pages/Profile';
import { Activities } from './pages/Activities';
import { Badges } from './pages/Badges';
import { Friends } from './pages/Friends';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Cravings } from './pages/Cravings';
import { Events } from './pages/Events';
import { Notification } from './types';

const NotificationToast = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show only unread notifications as toasts
    setNotifications([...(appStore.getState().notifications || []).filter(n => !n.read && n.userId === appStore.getState().currentUser?.id).slice(0, 3)]);

    return appStore.subscribe(() => {
      setNotifications([...(appStore.getState().notifications || []).filter(n => !n.read && n.userId === appStore.getState().currentUser?.id).slice(0, 3)]);
    });
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-right duration-300 max-w-sm">
           <div className="flex items-center gap-3">
             <div className="p-1 bg-blue-500 rounded-full">
               {n.type === 'message' ? <MessageSquare size={16} /> : <Bell size={16} />}
             </div>
             <span className="font-bold text-sm">{n.message}</span>
           </div>
           <button onClick={() => appStore.dismissNotification(n.id)} className="text-slate-400 hover:text-white transition"><X size={18}/></button>
        </div>
      ))}
    </div>
  );
};

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    appStore.logout();
    toggle();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PartyPopper, label: 'Events', path: '/events' },
    { icon: ShoppingBag, label: 'Cravings Shop', path: '/cravings' },
    { icon: PlusCircle, label: 'Log Activity', path: '/activities' },
    { icon: Trophy, label: 'Leaderboards', path: '/leaderboards' },
    { icon: Award, label: 'My Badges', path: '/badges' },
    { icon: Users, label: 'Community', path: '/friends' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggle}
      />
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-blue-600">
            <Zap className="fill-blue-600" />
            <span>VeloRace</span>
          </Link>
          <button onClick={toggle} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col h-[calc(100vh-64px)] justify-between">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => toggle()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [user, setUser] = useState(appStore.getState().currentUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  
  useEffect(() => {
    const update = () => {
      const state = appStore.getState();
      setUser(state.currentUser ? { ...state.currentUser } : null);
      if (state.currentUser) {
        setNotifications((state.notifications || []).filter(n => n.userId === state.currentUser!.id));
      }
    };
    update();
    return appStore.subscribe(update);
  }, []);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 hidden md:block">Welcome back, {user.username}!</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 hidden sm:flex">
            {/* XP Badge */}
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   Level Progress
                </span>
                <span className="text-sm font-black text-yellow-600 flex items-center gap-1">
                   <Zap size={14} className="fill-yellow-500 text-yellow-500" />
                   {user.personalXP} XP
                </span>
            </div>
            
            <div className="w-px h-8 bg-slate-200"></div>

            {/* Credits Badge */}
            <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                   Spendable
                </span>
                <span className="text-sm font-black text-blue-600 flex items-center gap-1">
                   <Diamond size={14} className="fill-blue-500 text-blue-500" />
                   {user.credits} Credits
                </span>
            </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) appStore.markNotificationsRead(user.id); }}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center px-4 py-2 border-b border-slate-50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <span className="text-xs text-slate-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? notifications.slice(0, 10).map(n => (
                  <div key={n.id} className={`p-3 hover:bg-slate-50 rounded-xl transition ${!n.read ? 'bg-blue-50/50' : ''}`}>
                    <p className="text-xs font-medium text-slate-700">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                  </div>
                )) : (
                  <div className="p-4 text-center text-slate-400 text-xs">No notifications yet</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Link to="/profile" className="relative group">
            <img 
            src={user.avatar} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full"></div>
        </Link>
      </div>
    </header>
  );
};

// Route Guard
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const user = appStore.getState().currentUser;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <HashRouter>
      <div className="min-h-screen flex">
        <NotificationToast />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={
            <ProtectedRoute>
              <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
              <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 md:p-8 bg-slate-50">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/leaderboards" element={<Leaderboards />} />
                    <Route path="/badges" element={<Badges />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cravings" element={<Cravings />} />
                    <Route path="/events" element={<Events />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </HashRouter>
  );
}
