import React, { useState } from 'react';

const ExpenseSection = ({ title, category, expenses, onAdd, onUpdate, onRemove, accentColor, isCustom }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [customCat, setCustomCat] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (label && !isNaN(numericAmount)) {
      if (editingId) {
        onUpdate(editingId, {
          label,
          amount: numericAmount,
          paymentMethod: method,
          notes,
          customCategory: isCustom ? customCat : undefined
        });
        setEditingId(null);
      } else {
        onAdd(label, numericAmount, method, notes, isCustom ? customCat : undefined);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setLabel('');
    setAmount('');
    setNotes('');
    setMethod('UPI');
    setCustomCat('');
    setShowExtra(false);
    setEditingId(null);
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setLabel(exp.label);
    setAmount(exp.amount.toString());
    setMethod(exp.paymentMethod || 'UPI');
    setNotes(exp.notes || '');
    if (isCustom) setCustomCat(exp.customCategory || '');
    setShowExtra(true);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-8 border-2 border-slate-700/50 flex flex-col h-full hover:border-slate-500 transition-all shadow-2xl group animate-in zoom-in duration-500">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-2 h-8 rounded-full shadow-lg ${accentColor}`}></div>
          <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter truncate max-w-[150px] lg:max-w-none">{title}</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase text-slate-500 block mb-0.5 tracking-widest">Aggregate</span>
          <span className="text-lg font-mono font-black text-emerald-400">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-8 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
        {expenses.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-12">
            <i className={`fa-solid ${isCustom ? 'fa-folder-plus' : 'fa-box-open'} text-5xl mb-4`}></i>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-center">Empty Vault</p>
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-transparent hover:border-slate-700 hover:bg-slate-900/90 transition-all group/item shadow-sm">
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-100 truncate">{exp.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-700">{exp.paymentMethod || 'UPI'}</span>
                  {isCustom && exp.customCategory && (
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/20">{exp.customCategory}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-2 shrink-0">
                <span className="font-mono text-sm font-black text-slate-300">₹{exp.amount.toLocaleString()}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(exp)} className="text-indigo-400 hover:text-white size-7 rounded-lg flex items-center justify-center transition-all">
                    <i className="fa-solid fa-pen text-[11px]"></i>
                  </button>
                  <button onClick={() => onRemove(exp.id)} className="text-rose-500 hover:text-white size-7 rounded-lg flex items-center justify-center transition-all">
                    <i className="fa-solid fa-trash text-[11px]"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-slate-700/50 bg-slate-900/20 p-5 rounded-[1.75rem] border border-slate-800/50 shadow-inner">
        {isCustom && (
          <div className="animate-in slide-in-from-left duration-300">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 px-1">Namespace</p>
            <input
              type="text"
              placeholder="e.g. Travel, Electronics"
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
              className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-2.5 text-[12px] font-bold text-indigo-300 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-800"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 px-1">Label</p>
             <input
               type="text"
               placeholder="Entry detail..."
               value={label}
               onChange={(e) => setLabel(e.target.value)}
               className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-100 focus:border-emerald-500/30 outline-none transition-all placeholder:text-slate-800"
             />
          </div>
          <div className="w-full sm:w-28 shrink-0">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 px-1 sm:text-right">Value</p>
             <input
               type="text"
               inputMode="decimal"
               placeholder="0"
               value={amount}
               onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
               className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-base font-mono font-black text-emerald-400 focus:border-emerald-500/30 outline-none sm:text-right transition-all placeholder:text-slate-800"
             />
          </div>
        </div>

        {showExtra ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 px-1">Gateway</p>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-[11px] font-black text-slate-400 outline-none cursor-pointer focus:border-indigo-500/30"
                >
                  <option value="UPI">UPI Transfer</option>
                  <option value="Card">Card Transaction</option>
                  <option value="Cash">Cash Liquidation</option>
                  <option value="Bank Transfer">Direct Bank</option>
                </select>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 px-1">Context Notes</p>
                <input
                  type="text"
                  placeholder="Optional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950/80 border-2 border-slate-800 rounded-xl px-4 py-3 text-[11px] outline-none placeholder:text-slate-800 text-slate-300"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
               <button
                 type="button"
                 onClick={resetForm}
                 className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-800 transition-all"
               >
                 Cancel
               </button>
               <button type="submit" className={`flex-[2] py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${accentColor} border border-white/10`}>
                 {editingId ? 'Update' : 'Initialize'}
               </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowExtra(true)}
              className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-slate-500 rounded-xl text-[10px] font-black border border-slate-800 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-ellipsis-h opacity-50"></i>
              More Params
            </button>
            <button type="submit" className={`px-8 py-3 rounded-xl text-white transition-all shadow-xl active:scale-95 ${accentColor} border border-white/10`}>
              <i className={`fa-solid ${editingId ? 'fa-check' : 'fa-plus'} text-lg`}></i>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ExpenseSection;
