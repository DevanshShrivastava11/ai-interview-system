import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Upload, 
  PlayCircle, 
  History, 
  User, 
  Users, 
  BookOpen,
  LogOut, 
  Sun, 
  Moon, 
  Sparkles 
} from 'lucide-react';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload-resume', label: 'Upload Resume', icon: Upload },
    { to: '/create-interview', label: 'Practice Interview', icon: PlayCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Candidates', icon: Users },
    { to: '/admin/interviews', label: 'Interviews', icon: BookOpen },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : candidateLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 h-screen sticky top-0">
      <div>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-primary-400 animate-pulse" />
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide">AI Interview</h1>
            <span className="text-xs text-primary-400 uppercase tracking-widest font-semibold">Evaluation Engine</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all text-sm font-medium"
        >
          <div className="flex items-center space-x-3">
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary-400" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* User Card & Logout */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold uppercase shadow-inner">
              {user?.name ? user.name.substring(0, 2) : 'US'}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
