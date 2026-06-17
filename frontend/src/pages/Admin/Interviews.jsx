import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Calendar, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/interviews');
        setInterviews(response.data);
      } catch (err) {
        setError('Failed to fetch platform interview logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
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
            Interview History Log
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Monitor all active and completed mock sessions on the system.
          </p>
        </div>
        <span className="text-xs bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full font-bold text-slate-500">
          {interviews.length} Sessions Logged
        </span>
      </div>

      {/* Directory Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        {error ? (
          <div className="p-8 text-center text-rose-500 flex items-center justify-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/40">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Domain Category</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {interviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-800 dark:text-slate-200 font-medium">
                      {interview.user?.email || `User #${interview.user?.id || '?'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {interview.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded">
                        {interview.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded ${
                        interview.status === 'COMPLETED'
                          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{new Date(interview.startedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      {interview.status === 'COMPLETED' ? (
                        <Link 
                          to={`/results/${interview.id}`}
                          className="text-primary-500 hover:text-primary-400 font-bold inline-flex items-center space-x-1"
                        >
                          <span>View Report</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">In progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No interviews logged on the platform.</div>
        )}
      </div>
    </div>
  );
};

export default AdminInterviews;
