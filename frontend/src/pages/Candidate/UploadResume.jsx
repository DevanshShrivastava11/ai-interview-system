import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Load latest resume on mount to show history
    const loadLatestResume = async () => {
      try {
        const response = await api.get('/api/resumes/latest');
        setResumeData(response.data);
      } catch (err) {
        // No resume uploaded yet
      }
    };
    loadLatestResume();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please select or drop a valid PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumeData(response.data);
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Failed to upload and analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  const parseJsonList = (jsonStr) => {
    try {
      return jsonStr ? JSON.parse(jsonStr) : [];
    } catch (e) {
      // Fallback if raw text
      return jsonStr ? [jsonStr] : [];
    }
  };

  const skills = parseJsonList(resumeData?.skills);
  const missingSkills = parseJsonList(resumeData?.missingSkills);
  const recommendations = parseJsonList(resumeData?.recommendations);

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          Resume Parser & Optimizer
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Upload your resume in PDF format. Gemini will parse your profile, outline missing skill gaps, and generate customized prep paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Hand: Upload Box */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Upload PDF Resume</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  file 
                    ? 'border-primary-500 bg-primary-500/5' 
                    : 'border-slate-300 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600'
                }`}
              >
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume-file" className="cursor-pointer block space-y-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {file ? file.name : 'Select or Drop PDF'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Max file size: 10MB
                    </span>
                  </div>
                </label>
              </div>

              {/* Status alerts */}
              {error && (
                <div className="bg-rose-500/15 border border-rose-500/35 rounded-lg p-3 flex items-start space-x-2 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/15 border border-emerald-500/35 rounded-lg p-3 flex items-start space-x-2 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Resume parsed and optimized successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg text-xs font-bold transition-all shadow-md shadow-primary-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Hand: Analysis Output */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">AI Profile Insights</h3>
          {resumeData ? (
            <div className="space-y-6">
              {/* Skills and missing skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Present Skills */}
                <div className="glass-panel rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-primary-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Identified Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length === 0 && <span className="text-xs text-slate-500">No skills parsed</span>}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="glass-panel rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-rose-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Missing Industry Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {missingSkills.length === 0 && <span className="text-xs text-emerald-500">Profile matches industry standard!</span>}
                  </div>
                </div>

              </div>

              {/* Study Recommendations */}
              <div className="glass-panel rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-2 text-indigo-500">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Recommended Improvement Actions</span>
                </div>
                <ul className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                  {recommendations.length === 0 && (
                    <span className="text-xs text-slate-500">No recommendations generated</span>
                  )}
                </ul>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-xl p-12 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-500" />
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Analysis Available</p>
              <p className="text-xs text-slate-500">Upload your latest CV on the left to parse details and map recommendation scores.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
