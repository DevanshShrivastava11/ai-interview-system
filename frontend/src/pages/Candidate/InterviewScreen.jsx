import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  PlayCircle, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Loader2, 
  Sparkles,
  HelpCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

const InterviewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // maps questionId to answerText
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  
  const [secTimer, setSecTimer] = useState(0);

  // Time tracker
  useEffect(() => {
    const timer = setInterval(() => {
      if (!evaluating) {
        setSecTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [evaluating]);

  const formatTimer = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadInterviewDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/interviews/${id}`);
        const data = response.data;
        
        if (data.status === 'COMPLETED') {
          navigate(`/results/${id}`);
          return;
        }

        setInterview(data);
        setQuestions(data.questions || []);
        
        // Initialize local answers state from DB
        const initialAnswers = {};
        data.questions.forEach((q) => {
          if (q.answerText) {
            initialAnswers[q.id] = q.answerText;
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError('Failed to load interview session questions.');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewDetails();
  }, [id, navigate]);

  const handleAnswerChange = (e) => {
    const currentQuestion = questions[currentIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value
    });
  };

  const saveCurrentAnswer = async () => {
    const currentQuestion = questions[currentIndex];
    const answerText = answers[currentQuestion.id] || '';
    
    setSaving(true);
    try {
      await api.post(`/api/interviews/${id}/answer/${currentQuestion.id}`, {
        answerText
      });
      // Update the inline details
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex].answerText = answerText;
      setQuestions(updatedQuestions);
    } catch (err) {
      // Show non-blocking warning
      console.warn("Auto-saving failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = async () => {
    await saveCurrentAnswer();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitInterview = async () => {
    // Save last remaining answer
    await saveCurrentAnswer();

    const confirmed = window.confirm("Are you sure you want to complete the interview and submit your answers for AI evaluation?");
    if (!confirmed) return;

    setEvaluating(true);
    try {
      await api.post(`/api/interviews/${id}/submit`);
      navigate(`/results/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || 'Failed to complete interview evaluation.');
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-12">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/3 mx-auto" />
        <div className="glass-panel rounded-xl p-8 space-y-6">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/4" />
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg flex flex-col items-center justify-center z-50 text-white select-none">
        <div className="space-y-6 max-w-md text-center p-6">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">AI Grading in Progress</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Gemini AI is parsing your technical answers, scoring communication relevance, and generating detailed profile improvement reports...
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-500 italic">
            This operation normally completes in 5-10 seconds. Please do not close or reload this window.
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).filter(k => answers[k] && answers[k].trim().length > 0).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left py-6">
      
      {/* Session Title and Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-primary-500 tracking-wider uppercase block">
            {interview?.category}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">
            Active Mock Session
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full font-semibold">
            <Clock className="w-4 h-4 text-primary-500" />
            <span>{formatTimer(secTimer)}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full font-semibold">
            <MessageSquare className="w-4 h-4 text-primary-500" />
            <span>{answeredCount} / {questions.length} Answered</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="space-y-1">
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wider">
          <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
          <span>{Math.round(progressPercent)}% COMPLETE</span>
        </div>
      </div>

      {/* Main Question Answer Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Question text */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
            Question {currentIndex + 1}
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 pt-1 leading-relaxed">
            {currentQuestion?.questionText}
          </p>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <label htmlFor="answer" className="text-xs font-semibold text-slate-400 tracking-wide block uppercase">
            Your Technical Response
          </label>
          <textarea
            id="answer"
            rows={8}
            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-slate-500"
            placeholder="Compose your detailed technical reply here..."
            value={answers[currentQuestion?.id] || ''}
            onChange={handleAnswerChange}
          />
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-rose-500/15 border border-rose-500/35 rounded-lg p-3 text-rose-400 text-xs flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || saving}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-5 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-md shadow-primary-600/10"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitInterview}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-600/15"
            >
              <Send className="w-4 h-4" />
              <span>Finish & Submit</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default InterviewScreen;
