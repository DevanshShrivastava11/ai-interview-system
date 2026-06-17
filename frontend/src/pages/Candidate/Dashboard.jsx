import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  PlayCircle, 
  Upload, 
  Award, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  FileText,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [latestResume, setLatestResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch interviews history
        const interviewsRes = await api.get('/api/interviews/history');
        setInterviews(interviewsRes.data);

        // Fetch latest resume
        try {
          const resumeRes = await api.get('/api/resumes/latest');
          setLatestResume(resumeRes.data);
        } catch (resErr) {
          // If no resume uploaded, latestResume remains null
        }
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getAverageScore = () => {
    const completed = interviews.filter(i => i.status === 'COMPLETED' && i.result);
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, curr) => acc + curr.result.overallScore, 0);
    return (sum / completed.length).toFixed(1);
  };

  const getLatestResult = () => {
    const completed = interviews.filter(i => i.status === 'COMPLETED' && i.result);
    return completed.length > 0 ? completed[0] : null;
  };

  const parsedSkills = latestResume?.skills ? JSON.parse(latestResume.skills) : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  const latestResult = getLatestResult();

  return (
    <div className="space-y-8">
      {/* Welcome & New Practice Call to Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-primary-900 to-indigo-950 p-8 rounded-2xl border border-primary-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary-600/15 rounded-full blur-2xl" />
        <div className="space-y-2 relative z-10 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hi, {user?.name}!
          </h1>
          <p className="text-slate-300 text-sm max-w-lg">
            Ready to test your readiness? Start a realistic technical mock session, or upload a new resume to generate relevant prep paths.
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 relative z-10">
          <Link 
            to="/create-interview" 
            className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary-600/35 group"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Practice</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link 
            to="/upload-resume" 
            className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Total Interviews</span>
            <span className="text-2xl font-bold dark:text-white mt-1 block">{interviews.length}</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Average AI Score</span>
            <span className="text-2xl font-bold dark:text-white mt-1 block">
              {getAverageScore()}/10
            </span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Latest Evaluation</span>
            <span className="text-2xl font-bold dark:text-white mt-1 block">
              {latestResult ? `${latestResult.result.overallScore}/10` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Resume Skills & Latest History Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Resume analysis highlight */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white text-left">Resume Profile</h3>
          {latestResume ? (
            <div className="glass-panel rounded-xl p-6 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
                    {latestResume.fileName}
                  </span>
                </div>
                <Link to="/upload-resume" className="text-xs text-primary-500 hover:underline">Update</Link>
              </div>

              {/* Skills lists */}
              <div className="space-y-3">
                <span className="text-xs text-slate-400 block font-semibold">Identified Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {parsedSkills.slice(0, 10).map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {parsedSkills.length === 0 && (
                    <span className="text-xs text-slate-500">No skills parsed yet</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Resume Uploaded</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Upload a resume to unlock missing skills logs and tailored Gemini suggestions.</p>
              </div>
              <Link 
                to="/upload-resume" 
                className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
              >
                Upload Resume PDF
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Previous Interviews list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-left">Previous Interviews</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full">
              {interviews.length} Sessions
            </span>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden">
            {interviews.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {interviews.map((interview) => (
                  <div 
                    key={interview.id} 
                    className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 dark:text-white">{interview.category}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {interview.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span>Started: {new Date(interview.startedAt).toLocaleDateString()}</span>
                        {interview.status === 'COMPLETED' && (
                          <span className="text-emerald-500 font-semibold bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-0.5 rounded">
                            Score: {interview.result?.overallScore}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      {interview.status === 'STARTED' ? (
                        <Link 
                          to={`/interview/${interview.id}`}
                          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all shadow-md shadow-primary-600/10"
                        >
                          <span>Resume Interview</span>
                          <PlayCircle className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link 
                          to={`/results/${interview.id}`}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all"
                        >
                          <span>View Evaluation</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Interviews Completed Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">Create a mock technical interview to generate questions and test your readiness.</p>
                </div>
                <Link 
                  to="/create-interview" 
                  className="inline-block bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-primary-600/20"
                >
                  Create Mock Interview
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
