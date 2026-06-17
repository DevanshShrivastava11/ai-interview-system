import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          My Profile
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Review your account login information and registered role scopes.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        {/* User Card */}
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md shadow-primary-600/10">
            {user?.name ? user.name.substring(0, 2) : 'US'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider mt-0.5">{user?.role} Profile</p>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
            <Mail className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Email Address</span>
              <span className="text-sm font-medium block mt-0.5">{user?.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
            <Shield className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Security Role</span>
              <span className="text-sm font-medium block mt-0.5">{user?.role}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Member Since</span>
              <span className="text-sm font-medium block mt-0.5">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 flex items-center space-x-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 italic font-semibold">
          <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
          <span>Practice mock panels regularly to develop your programming capabilities.</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
