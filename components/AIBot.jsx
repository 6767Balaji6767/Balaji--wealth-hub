import React, { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../services/geminiService';

const AIBot = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am WealthBot. How can I help you manage your money today? 📊' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.slice(-4);
    const response = await chatWithBot(userMessage, state, history);

    setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[90vw] sm:w-[350px] md:w-[400px] h-[500px] bg-slate-900/95 backdrop-blur-2xl border-2 border-indigo-500/30 rounded-[2.5rem] shadow-3xl mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-slate-800 bg-indigo-600/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-robot text-white text-lg"></i>
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tighter">WealthBot</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">● System Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="size-8 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="size-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask WealthBot..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3.5 pr-14 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'}`}></i>
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`size-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 active:scale-90 ${
          isOpen ? 'bg-rose-500 rotate-[360deg] scale-90' : 'bg-indigo-600 hover:scale-110 hover:shadow-indigo-600/40'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-comment-slash' : 'fa-robot'} text-2xl`}></i>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full border-4 border-slate-950"></div>
        )}
      </button>
    </div>
  );
};

export default AIBot;
