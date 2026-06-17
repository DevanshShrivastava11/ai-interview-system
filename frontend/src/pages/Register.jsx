import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setSubmitting(true);
    try {
      await register(name, email, password, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-2 text-white pb-6">
          <Sparkles className="w-8 h-8 text-primary-400" />
          <span className="font-extrabold text-xl tracking-wider">AI Interview</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-xl rounded-xl sm:px-10">
          {/* Status alerts */}
          {error && (
            <div className="mb-4 bg-rose-500/15 border border-rose-500/35 rounded-lg p-3 flex items-start space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-500/15 border border-emerald-500/35 rounded-lg p-3 flex items-start space-x-2 text-emerald-400 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Registration successful! Redirecting to login...</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Account Type
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-500" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="CANDIDATE" className="bg-slate-900">Candidate (Practice Interviews)</option>
                  <option value="ADMIN" className="bg-slate-900">Administrator (View Analytics)</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting || success}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
