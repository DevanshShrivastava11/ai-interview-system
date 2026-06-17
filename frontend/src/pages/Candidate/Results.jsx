import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/interviews/${id}`);
        setInterview(response.data);
        if (response.data.result) {
          setResult(response.data.result);
        } else {
          // If result not returned inside interview setup, query manually
          const res = await api.get(`/api/interviews/${id}/result`);
          setResult(res.data);
        }
      } catch (err) {
        setError('Evaluation result not found or has not been processed yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/api/interviews/${id}/report`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview_report_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download PDF report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const parseJsonList = (jsonStr) => {
    try {
      return jsonStr ? JSON.parse(jsonStr) : [];
    } catch (e) {
      return jsonStr ? [jsonStr] : [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Report Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This interview does not contain completed evaluation results.'}</p>
        <Link to="/dashboard" className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const chartData = [
    { name: 'Technical Score', value: result.technicalScore },
    { name: 'Communication', value: result.communicationScore },
    { name: 'Overall Score', value: result.overallScore }
  ];

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981'];

  const strengths = parseJsonList(result.strengths);
  const weaknesses = parseJsonList(result.weaknesses);
  const suggestions = parseJsonList(result.improvementSuggestions);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left py-6">
      
      {/* Page Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link to="/dashboard" className="text-xs text-slate-500 hover:text-primary-500 flex items-center space-x-1.5 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
            Interview Feedback
          </h1>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </>
          )}
        </button>
      </div>

      {/* Scores Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Technical Score Card */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Technical Score</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">{result.technicalScore}/10</span>
          </div>
          <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Communication Score Card */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Communication</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white block">{result.communicationScore}/10</span>
          </div>
          <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Overall Performance Card */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between bg-emerald-500/5 border-emerald-500/20">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 block">Overall Performance</span>
            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 block">{result.overallScore}/10</span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Analysis and Chart Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Score Charts */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Scores Breakdown</h3>
          <div className="glass-panel rounded-2xl p-6 h-80 flex flex-col justify-between">
            <div className="flex-1 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={25}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-4 font-semibold italic">Double check core technical details in reports.</p>
          </div>
        </div>

        {/* Right Side: AI Overall Feedback Text */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">AI Interviewer Summary</h3>
          <div className="glass-panel rounded-2xl p-6 h-80 overflow-y-auto space-y-3">
            <div className="flex items-center space-x-2 text-primary-500 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Interviewer Decision & Summary</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {result.feedback}
            </p>
          </div>
        </div>

      </div>

      {/* Strengths and Weaknesses listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Key Strengths */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Key Strengths Identified</h3>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <ul className="space-y-3.5">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
              {strengths.length === 0 && <span className="text-xs text-slate-500">None parsed.</span>}
            </ul>
          </div>
        </div>

        {/* Key Weaknesses */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Key Areas for Development</h3>
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <ul className="space-y-3.5">
              {weaknesses.map((weak, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{weak}</span>
                </li>
              ))}
              {weaknesses.length === 0 && <span className="text-xs text-emerald-500">None identified. Keep up the good work!</span>}
            </ul>
          </div>
        </div>

      </div>

      {/* Suggested Actions */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white font-sans">AI Prep Actions / Study Suggestions</h3>
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <ul className="space-y-3">
            {suggestions.map((sug, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0 animate-ping" style={{ animationDuration: '3s' }} />
                <span>{sug}</span>
              </li>
            ))}
            {suggestions.length === 0 && <span className="text-xs text-slate-500">No suggestions compiled.</span>}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Results;
