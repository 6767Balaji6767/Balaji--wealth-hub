import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './Login';
import DashboardHeader from './components/DashboardHeader';
import ExpenseSection from './components/ExpenseSection';
import FinancialAnalytics from './components/FinancialAnalytics';
import GoalTracker from './components/GoalTracker';
import UnifiedLedger from './components/UnifiedLedger';
import AIBot from './components/AIBot';
import { CategoryType } from './constants';
import { getFinancialAdvice } from './services/geminiService';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const getMonthKey = (year, month) => `${year}-${String(month + 1).padStart(2, '0')}`;

const getInitialState = () => ({
  salary: 0,
  salaryDate: new Date().toISOString().split('T')[0],
  expenses: [],
  goals: [{ id: 'g1', name: 'Emergency Fund', target: 50000, current: 0 }]
});

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setState] = useState(getInitialState());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Load data from Firestore when user/month changes
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const monthKey = getMonthKey(selectedYear, selectedMonth);
      const ref = doc(db, 'users', user.uid, 'months', monthKey);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setState(snap.data());
      } else {
        setState(getInitialState());
      }
      setInsight(null);
    };
    loadData();
  }, [user, selectedYear, selectedMonth]);

  // Save to Firestore whenever state changes
  useEffect(() => {
    if (!user) return;
    const save = async () => {
      setSaving(true);
      const monthKey = getMonthKey(selectedYear, selectedMonth);
      const ref = doc(db, 'users', user.uid, 'months', monthKey);
      await setDoc(ref, state);
      setSaving(false);
    };
    const timer = setTimeout(save, 500);
    return () => clearTimeout(timer);
  }, [state, user, selectedYear, selectedMonth]);

  const addExpense = (label, amount, category, method = 'UPI', notes = '', customCat) => {
    const newItem = {
      id: crypto.randomUUID(),
      label, amount,
      date: new Date().toISOString().split('T')[0],
      category, paymentMethod: method, notes,
      customCategory: customCat
    };
    setState(prev => ({ ...prev, expenses: [...prev.expenses, newItem] }));
  };

  const updateExpense = (id, updates) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    }));
  };

  const removeExpense = (id) => {
    setState(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  const addGoal = (name, target) => {
    setState(prev => ({ ...prev, goals: [...prev.goals, { id: crypto.randomUUID(), name, target, current: 0 }] }));
  };

  const updateGoalCurrent = (id, current) => {
    setState(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, current } : g) }));
  };

  const removeGoal = (id) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const updateSalary = (salary) => setState(prev => ({ ...prev, salary }));
  const updateSalaryDate = (salaryDate) => setState(prev => ({ ...prev, salaryDate }));

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const data = await getFinancialAdvice(state);
    if (data) setInsight(data);
    setLoadingInsight(false);
  };

  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = state.salary - totalExpenses;

  const dynamicCustomCategories = Array.from(new Set(
    state.expenses
      .filter(e => e.category === CategoryType.OTHER && e.customCategory)
      .map(e => e.customCategory)
  ));

  const NavItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-row items-center justify-center lg:justify-start gap-4 px-4 lg:px-5 py-4 rounded-2xl transition-all duration-300 w-full group ${
        activeTab === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
      }`}
    >
      <i className={`fa-solid ${icon} text-xl lg:text-lg group-hover:scale-110 transition-transform`}></i>
      <span className="text-[12px] font-black uppercase tracking-widest hidden lg:block whitespace-nowrap">{label}</span>
    </button>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="text-white text-xl font-black animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
      {/* Sidebar */}
      <nav className="w-full md:w-20 lg:w-72 h-auto md:h-screen bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800/50 p-4 lg:p-6 flex flex-row md:flex-col gap-3 md:gap-4 z-50 backdrop-blur-3xl shadow-2xl shrink-0 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto scrollbar-hide">
        <div className="hidden md:flex items-center gap-4 mb-6 px-2 shrink-0">
           <div className="size-11 lg:size-12 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-xl flex items-center justify-center shadow-xl border border-white/10 shrink-0">
              <i className="fa-solid fa-crown text-white text-lg"></i>
           </div>
           <div className="hidden lg:block truncate">
              <h1 className="text-base font-black tracking-tighter text-white leading-none uppercase">Wealth Hub</h1>
              <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest">Financial OS</p>
           </div>
        </div>

        {/* Month Selector */}
        <div className="hidden md:block px-2 mb-4 shrink-0">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Month</p>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-300 outline-none mb-2"
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-300 outline-none"
          >
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-row md:flex-col gap-2 md:gap-4 flex-1">
          <NavItem id="dashboard" icon="fa-house-signal" label="Analytics" />
          <NavItem id="ledger" icon="fa-rectangle-list" label="History" />
          <NavItem id="goals" icon="fa-bullseye" label="Targets" />
        </div>

        {/* User + Logout */}
        <div className="mt-auto hidden lg:block px-2 pb-4 shrink-0">
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30 flex items-center gap-3 mb-3">
            <img src={user.photoURL} alt="avatar" className="size-8 rounded-full" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate">{user.displayName}</p>
              <p className="text-[9px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20 transition-all"
          >
            <i className="fa-solid fa-sign-out mr-2"></i>Sign Out
          </button>
          {saving && <p className="text-[9px] text-slate-500 text-center mt-2 animate-pulse">Saving...</p>}
        </div>

        <div className="hidden lg:block px-2 pb-6 shrink-0">
           <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/30 shadow-inner">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Health Check</p>
             <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
               <div
                className={`h-full transition-all duration-1000 ${remaining < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${state.salary > 0 ? Math.min(100, Math.max(0, (remaining/state.salary)*100)) : 0}%` }}
               ></div>
             </div>
             <p className="text-xs text-slate-100 font-black mt-3 flex justify-between">
                <span>{state.salary > 0 ? Math.max(0, Math.round((remaining/state.salary)*100)) : 0}%</span>
                <span className="text-[8px] opacity-40 uppercase tracking-tighter">Available</span>
             </p>
           </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 w-full h-screen scroll-smooth">
        <div className="max-w-[1500px] mx-auto space-y-12 pb-24">

          {/* Month indicator */}
          <div className="flex items-center justify-between">
            <div className="bg-indigo-600/20 border border-indigo-500/30 px-5 py-2 rounded-2xl">
              <span className="text-indigo-300 font-black text-sm uppercase tracking-widest">
                {MONTHS[selectedMonth]} {selectedYear}
              </span>
            </div>
            {/* Mobile month selector */}
            <div className="flex gap-2 md:hidden">
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-300 outline-none"
              >
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-slate-300 outline-none"
              >
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <DashboardHeader
            salary={state.salary}
            salaryDate={state.salaryDate}
            onUpdateSalary={updateSalary}
            onUpdateDate={updateSalaryDate}
            remaining={remaining}
          />

          <div className="min-h-full">
            {activeTab === 'dashboard' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
                  <div className="xl:col-span-3">
                    <FinancialAnalytics expenses={state.expenses} salary={state.salary} />
                  </div>
                  <div className="bg-slate-900/60 rounded-[2.5rem] p-8 border border-indigo-500/20 shadow-2xl flex flex-col h-auto xl:h-full shrink-0 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                         <i className="fa-solid fa-brain text-indigo-400"></i>
                         AI Intelligence
                       </h3>
                    </div>
                    <div className="flex-1 space-y-6">
                      {insight ? (
                        <div className="space-y-6">
                           <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                              <div className="flex items-center gap-4">
                                 <div className="size-12 rounded-xl bg-indigo-600 flex flex-col items-center justify-center shadow-lg shrink-0">
                                    <span className="text-[8px] font-black opacity-60 text-white uppercase tracking-tighter">Score</span>
                                    <span className="text-xl font-black text-white leading-none">{insight.score}</span>
                                 </div>
                                 <p className="text-[12px] font-bold text-slate-300 leading-snug line-clamp-4">"{insight.summary}"</p>
                              </div>
                           </div>
                           <div className="space-y-3">
                              {insight.recommendations.map((rec, i) => (
                                <div key={i} className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/30 flex gap-3 group">
                                   <div className="text-indigo-400 font-black text-[10px] shrink-0">0{i+1}</div>
                                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{rec}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-20">
                           <i className="fa-solid fa-sparkles text-5xl mb-6"></i>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ready for Analysis</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={fetchInsight}
                      disabled={loadingInsight}
                      className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest text-[11px] border border-white/10"
                    >
                      {loadingInsight ? <i className="fa-solid fa-sync animate-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                      {loadingInsight ? 'Computing...' : 'Generate Insight'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <ExpenseSection title="Daily Needs" category={CategoryType.DAILY} expenses={state.expenses.filter(e => e.category === CategoryType.DAILY)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.DAILY, m, n)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-emerald-500" />
                  <ExpenseSection title="Investments" category={CategoryType.INVESTMENT} expenses={state.expenses.filter(e => e.category === CategoryType.INVESTMENT)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.INVESTMENT, m, n)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-orange-500" />
                  <ExpenseSection title="Personal Care" category={CategoryType.PERSONAL} expenses={state.expenses.filter(e => e.category === CategoryType.PERSONAL)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.PERSONAL, m, n)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-sky-500" />
                  <ExpenseSection title="Debt & EMI" category={CategoryType.EMI} expenses={state.expenses.filter(e => e.category === CategoryType.EMI)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.EMI, m, n)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-rose-500" />
                  <ExpenseSection title="Fixed Savings" category={CategoryType.SAVINGS} expenses={state.expenses.filter(e => e.category === CategoryType.SAVINGS)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.SAVINGS, m, n)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-indigo-500" />
                  {dynamicCustomCategories.map(catName => (
                    <ExpenseSection key={catName} title={catName} category={CategoryType.OTHER} expenses={state.expenses.filter(e => e.category === CategoryType.OTHER && e.customCategory === catName)} onAdd={(l, a, m, n) => addExpense(l, a, CategoryType.OTHER, m, n, catName)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-purple-600" isCustom={false} />
                  ))}
                  <ExpenseSection title="Create Card" category={CategoryType.OTHER} expenses={[]} onAdd={(l, a, m, n, c) => addExpense(l, a, CategoryType.OTHER, m, n, c)} onUpdate={updateExpense} onRemove={removeExpense} accentColor="bg-slate-700" isCustom={true} />
                </div>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-10">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800 pb-8 gap-4">
                    <div>
                      <h2 className="text-3xl font-black text-slate-100 tracking-tighter uppercase leading-none">The Ledger</h2>
                      <p className="text-slate-500 text-sm mt-3 font-medium">Historical audit of every transaction.</p>
                    </div>
                    <div className="bg-slate-800/40 px-6 py-3 rounded-2xl border border-slate-700/50 shadow-lg">
                      <span className="text-[12px] font-black text-emerald-400 uppercase tracking-widest">{state.expenses.length} Records found</span>
                    </div>
                 </div>
                 <UnifiedLedger expenses={state.expenses} onRemove={removeExpense} salary={state.salary} user={user} />
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-left-4 duration-700 space-y-12">
                <div className="text-center px-4">
                   <h2 className="text-4xl font-black text-slate-100 tracking-tighter uppercase leading-tight mb-4">Milestones</h2>
                   <p className="text-slate-500 text-base font-medium max-w-xl mx-auto">Strategic tracking of long-term wealth accumulation.</p>
                </div>
                <GoalTracker goals={state.goals} onAdd={addGoal} onUpdate={updateGoalCurrent} onRemove={removeGoal} />
              </div>
            )}
          </div>
        </div>
      </main>

      <AIBot state={state} />
    </div>
  );
};

export default App;
