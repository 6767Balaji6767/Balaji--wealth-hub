import React from 'react';

const DashboardHeader = ({ salary, salaryDate, onUpdateSalary, onUpdateDate, remaining }) => {
  const isLowBalance = remaining < (salary * 0.1);

  return (
    <header className="relative space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-600">
           <div className="flex items-center gap-4">
             <div className="bg-indigo-600/20 p-4 rounded-2xl border border-indigo-500/30 shadow-inner shrink-0">
                <i className="fa-solid fa-crown text-indigo-400 text-xl"></i>
             </div>
             <div>
               <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                 Wealth Hub
               </h1>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 ml-0.5">
                 <span className="text-emerald-500 mr-2 animate-pulse">●</span> Active Monitoring
               </p>
             </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 w-full lg:w-auto animate-in fade-in slide-in-from-right duration-600">
          <div className="bg-slate-800/60 border-2 border-slate-700/50 p-4 lg:p-5 rounded-3xl flex items-center gap-5 shadow-2xl flex-1 md:flex-none hover:border-indigo-500/50 transition-all group min-w-[260px] lg:min-w-[280px]">
            <div className="size-10 lg:size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300 shrink-0">
              <i className="fa-solid fa-indian-rupee-sign text-emerald-500 text-lg"></i>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Monthly Inflow</p>
              <input
                type="Text"  
                inputMode="numeric"
                value={salary === 0 ? '' : salary}
                placeholder="0.00"
               onChange={(e) => {
  const val = e.target.value.replace(/[^0-9]/g, '');
  onUpdateSalary(val === '' ? 0 : Number(val));
}}    
                className="bg-transparent text-2xl font-black text-white focus:outline-none w-full font-mono placeholder:text-slate-800"
              />
            </div>
          </div>

          <div className="bg-slate-800/60 border-2 border-slate-700/50 p-4 lg:p-5 rounded-3xl flex items-center gap-5 shadow-2xl flex-1 md:flex-none hover:border-cyan-500/50 transition-all group">
            <div className="size-10 lg:size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-300 shrink-0">
              <i className="fa-solid fa-calendar text-cyan-500 text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Pay Date</p>
              <input
                type="date"
                value={salaryDate}
                onChange={(e) => onUpdateDate(e.target.value)}
                className="bg-transparent text-base font-black text-white focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-600 delay-200">
         <div className={`relative overflow-hidden bg-gradient-to-br border-2 p-7 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02] ${isLowBalance ? 'from-rose-600/15 to-slate-950 border-rose-500/30' : 'from-emerald-600/15 to-slate-950 border-emerald-500/30'}`}>
            <div className="absolute -top-4 -right-4 p-8 opacity-5">
               <i className={`fa-solid ${isLowBalance ? 'fa-triangle-exclamation' : 'fa-vault'} text-7xl`}></i>
            </div>
            <h4 className={`text-[11px] font-black uppercase tracking-[0.4em] mb-3 ${isLowBalance ? 'text-rose-400' : 'text-emerald-400'}`}>Liquid Balance</h4>
            <p className="text-3xl font-black font-mono tracking-tight">₹{remaining.toLocaleString()}</p>
         </div>

         <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600/15 to-slate-950 border-2 border-cyan-500/30 p-7 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-transform">
            <h4 className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Total Managed</h4>
            <p className="text-3xl font-black font-mono text-slate-100 tracking-tight">₹{salary.toLocaleString()}</p>
         </div>

         <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600/15 to-slate-950 border-2 border-indigo-500/30 p-7 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-transform">
            <h4 className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.4em] mb-3">Wealth Retention</h4>
            <p className="text-3xl font-black font-mono text-slate-100 tracking-tight">{salary > 0 ? (Math.max(0, (remaining / salary) * 100)).toFixed(1) : 0}%</p>
         </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
