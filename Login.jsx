import React from 'react';
import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from './firebase';
import { auth, provider } from './firebase';

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
      <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center gap-8 shadow-2xl max-w-md w-full mx-4">
        <div className="size-20 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl border border-white/10">
          <i className="fa-solid fa-crown text-white text-3xl"></i>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Wealth Hub</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Coach Balaji Pro Finance</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-black py-4 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 text-sm uppercase tracking-widest"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
        <p className="text-slate-600 text-xs text-center">Your data is private and securely stored in the cloud ☁️</p>
      </div>
    </div>
  );
};

export default Login;
