import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserCheck } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Candidate Dashboard';
    if (path === '/upload-resume') return 'Resume Upload & Analysis';
    if (path === '/create-interview') return 'Practice Interview Setup';
    if (path.startsWith('/interview/')) return 'Live Interview Panel';
    if (path.startsWith('/results/')) return 'AI Evaluation Report';
    if (path === '/profile') return 'User Profile';
    if (path === '/admin/dashboard') return 'Admin Portal Overview';
    if (path === '/admin/users') return 'Candidate Directory';
    if (path === '/admin/interviews') return 'Interview History Log';
    return 'AI Interview System';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center space-x-6">
        {/* Date Display */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{currentDate}</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-6">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {user?.name}
            </span>
            <span className="text-[10px] font-medium text-primary-500 capitalize">
              {user?.role?.toLowerCase()}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <UserCheck className="w-4 h-4 text-primary-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
