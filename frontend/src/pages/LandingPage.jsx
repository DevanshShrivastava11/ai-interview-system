import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Cpu, Target, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-primary-400" />
          <span className="font-extrabold text-xl tracking-wider text-white">AI Interview</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-slate-300 hover:text-white transition-all text-sm font-medium">
            Log In
          </Link>
          <Link 
            to="/register" 
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-primary-300 tracking-wide">
            <Cpu className="w-4 h-4 text-primary-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI-Powered Performance Analytics</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Master Your Next <br />
            <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              Technical Interview
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Upload your resume, select your target role, and practice with realistic technical questions generated dynamically by Gemini AI. Get instant grading, strengths breakdown, and PDF feedback reports.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
            <Link 
              to="/register" 
              className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 text-sm group"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              to="/login" 
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-8 py-4 rounded-xl font-bold transition-all text-sm text-center"
            >
              Candidate Login
            </Link>
          </div>
        </div>

        {/* Visual Mock Card Showcase */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/10 rounded-3xl blur-2xl pointer-events-none" />
          <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Evaluation Summary</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">Java Spring Boot Developer</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                Score: 8.5/10
              </span>
            </div>

            <div className="space-y-4 pt-6 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Technical Depth</p>
                  <p className="text-slate-400 text-xs mt-0.5">Strong conceptual knowledge of Spring IOC container and lifecycle management.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Communication Skills</p>
                  <p className="text-slate-400 text-xs mt-0.5">Articulate and concise answers, with structured use of design patterns.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Areas for Improvement</p>
                  <p className="text-slate-400 text-xs mt-0.5">Could explain transaction propagation and concurrency locks with more details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-slate-950/80 border-t border-slate-800/80 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-4 max-w-xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold tracking-tight">Supercharge Interview Skills</h3>
            <p className="text-slate-400 text-sm">Our comprehensive toolkit is built specifically to transition aspiring candidates into industry-ready software developers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 text-left space-y-4 hover:border-primary-500/30 transition-all hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">Resume Extraction</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Upload your resume. Our parser identifies key tech skills and generates missing domain gaps to suggest study targets.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 text-left space-y-4 hover:border-primary-500/30 transition-all hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">Interactive Wizard</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Attend full technical interview panels matching domain selection. Display questions one-by-one with text input autosave.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-8 text-left space-y-4 hover:border-primary-500/30 transition-all hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold">Detailed Evaluation</h4>
              <p className="text-slate-400 text-xs leading-relaxed">Obtain instant, structured grades mapping overall, technical, and communication skills directly from Gemini evaluations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-800/40 text-center relative z-10 text-xs text-slate-500">
        <p>© 2026 AI Interview System. All rights reserved. Built using Spring Boot, React, and Google Gemini API.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
