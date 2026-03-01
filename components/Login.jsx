import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div className="bg-slate-900/80 border border-slate-700 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl text-center">
        
        <div className="size-20 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <i className="fa-solid fa-crown text-white text-3xl"></i>
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Wealth Hub</h1>
        <p className="text-slate-500 text-sm font-medium mb-10">Your Personal Finance OS by Coach Balaji</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-2xl p-4 mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-black py-4 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-spinner animate-spin text-indigo-600"></i>
          ) : (
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          )}
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-slate-600 text-xs mt-8">Your data is private and secured 🔒</p>
      </div>
    </div>
  );
};

export default Login;
