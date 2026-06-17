import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PlayCircle, Target, Shield, HelpCircle, Loader2, Sparkles } from 'lucide-react';

const CreateInterview = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Java Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Java Developer',
    'Full Stack Developer',
    'Spring Boot Developer',
    'React Developer',
    'Python Developer',
    'Data Analyst',
  ];

  const difficulties = [
    { value: 'Beginner', desc: 'Core fundamentals, theoretical concepts, basic syntax.' },
    { value: 'Intermediate', desc: 'Framework structures, security implementation, data processing, design patterns.' },
    { value: 'Advanced', desc: 'Performance optimizations, caching strategies, scaling structures, concurrency controls.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/interviews/setup', {
        category,
        difficulty,
      });
      const interview = response.data;
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Failed to initialize interview questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          Configure Practice Interview
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Select your target domain and choose a challenge difficulty. Gemini AI will compose 10 tailored technical questions matching your configurations.
        </p>
      </div>

      <div className="glass-panel rounded-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Domain Category Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-primary-500" />
              <span>Target Role / Domain</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                    category === cat
                      ? 'border-primary-500 bg-primary-500/5 text-primary-700 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level Selection */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-primary-500" />
              <span>Challenge Difficulty</span>
            </label>
            <div className="space-y-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => setDifficulty(diff.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col md:flex-row md:items-center md:justify-between ${
                    difficulty === diff.value
                      ? 'border-primary-500 bg-primary-500/5'
                      : 'border-slate-200 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <span className={`text-sm font-bold block ${
                      difficulty === diff.value ? 'text-primary-700 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {diff.value}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {diff.desc}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase mt-2 md:mt-0 px-2.5 py-1 rounded tracking-wider ${
                    difficulty === diff.value 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Errors */}
          {error && (
            <div className="bg-rose-500/15 border border-rose-500/35 rounded-lg p-3 text-rose-400 text-xs flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary-600/25 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Interview Session via Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;
