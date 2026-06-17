import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch user directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/4" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            Candidate Directory
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Browse all registered platform accounts and their authorization levels.
          </p>
        </div>
        <span className="text-xs bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full font-bold text-slate-500">
          {users.length} Registered Accounts
        </span>
      </div>

      {/* Directory Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        {error ? (
          <div className="p-8 text-center text-rose-500 flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/40">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-600/10 text-primary-600 flex items-center justify-center font-bold uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No user profiles present.</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
