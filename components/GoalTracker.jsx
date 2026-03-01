import React, { useState } from 'react';

const GoalTracker = ({ goals, onAdd, onUpdate, onRemove }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && target) {
      onAdd(name, parseFloat(target));
      setName('');
      setTarget('');
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="fa-solid fa-bullseye text-amber-500"></i>
        Financial Goals
      </h3>

      <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {goals.length === 0 && (
          <p className="text-slate-500 text-sm italic text-center py-4">No goals set yet. What are you saving for?</p>
        )}
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-200">{goal.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
                  <button onClick={() => onRemove(goal.id)} className="text-rose-500 hover:text-rose-400 transition-colors">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="0"
                  max={goal.target}
                  value={goal.current}
                  onChange={(e) => onUpdate(goal.id, parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Goal name (e.g. New Car)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none"
          />
          <input
            type="number"
            placeholder="Target ₹"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none text-right font-mono"
          />
        </div>
        <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 rounded-xl transition-all active:scale-[0.98]">
          Create Goal
        </button>
      </form>
    </div>
  );
};

export default GoalTracker;
