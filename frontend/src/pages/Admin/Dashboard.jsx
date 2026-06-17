import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Cpu, 
  TrendingDown, 
  Clock, 
  Activity,
  UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/analytics');
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8 text-center text-rose-500">
        <p>{error || 'An error occurred loading admin stats.'}</p>
      </div>
    );
  }

  // Format Recharts data structures
  const categoryCountData = analytics.categoryCounts.map(c => ({
    name: c.category,
    value: c.count
  }));

  const categoryScoreData = analytics.categoryScores.map(c => ({
    name: c.category,
    score: parseFloat(c.avgScore).toFixed(1)
  }));

  const monthlyTrendData = analytics.monthlyTrends.map(m => ({
    month: m.month,
    count: m.count
  }));

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8 text-left">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          System Analytics Dashboard
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Review overall candidate registrations, mock sessions count, and performance indicators.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Candidates</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">{analytics.totalUsers}</span>
          </div>
          <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Total Sessions</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">{analytics.totalInterviews}</span>
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Platform Average Score</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">{analytics.averageScore.toFixed(1)}/10</span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Volumes Pie Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary-500" />
            <span>Interviews per Domain</span>
          </h3>
          <div className="h-64 mt-4 flex items-center">
            {categoryCountData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryCountData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryCountData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} fontSize={10} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 mx-auto">No interview category logs recorded.</p>
            )}
          </div>
        </div>

        {/* Category Performance Averages Bar Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <span>Average Scores by Domain</span>
          </h3>
          <div className="h-64 mt-4">
            {categoryScoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryScoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 mx-auto flex items-center">No scores computed yet.</p>
            )}
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>Monthly Interview Volumes</span>
          </h3>
          <div className="h-64 mt-4">
            {monthlyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={0.15} fill="url(#colorCount)" />
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 text-center flex items-center h-full justify-center">No monthly stats compiled.</p>
            )}
          </div>
        </div>

      </div>

      {/* Top Performing Candidates list */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">Top Performing Candidates</h3>
        <div className="glass-panel rounded-2xl overflow-hidden">
          {analytics.topPerformers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/40">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {analytics.topPerformers.map((performer, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800 dark:text-slate-200">{performer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{performer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">{performer.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-full border border-emerald-500/20">
                          {performer.overallScore}/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">No records available to display.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
