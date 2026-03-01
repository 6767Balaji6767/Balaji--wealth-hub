import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CategoryType } from '../constants';

const COLORS = [
  '#10b981',
  '#f59e0b',
  '#0ea5e9',
  '#f43f5e',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#1e293b'
];

const FinancialAnalytics = ({ expenses, salary }) => {
  const categoriesMap = new Map();

  expenses.forEach(e => {
    const name = e.category === CategoryType.OTHER && e.customCategory ? e.customCategory : e.category.split(' / ')[0];
    categoriesMap.set(name, (categoriesMap.get(name) || 0) + e.amount);
  });

  const data = Array.from(categoriesMap.entries())
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = salary - totalSpent;

  if (remaining > 0) {
    data.push({ name: 'Unallocated', value: remaining });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="bg-slate-800/30 border-2 border-slate-700/50 rounded-[2.5rem] p-8 lg:p-10 shadow-3xl flex flex-col group hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-md">
        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-slate-500 flex items-center gap-3">
           <i className="fa-solid fa-chart-pie opacity-50"></i>
           Asset Mix
        </h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={75}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-out"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#070b14', border: '2px solid #1e293b', borderRadius: '20px', color: '#fff', padding: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/30 border-2 border-slate-700/50 rounded-[2.5rem] p-8 lg:p-10 shadow-3xl flex flex-col group hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-md">
        <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-slate-500 flex items-center gap-3">
           <i className="fa-solid fa-chart-simple opacity-50"></i>
           Expense Profile
        </h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.filter(d => d.name !== 'Unallocated')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#070b14', border: '2px solid #1e293b', borderRadius: '20px', color: '#fff', padding: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900' }}
                cursor={{ fill: '#1e293b', opacity: 0.2 }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} animationDuration={1200} barSize={35}>
                 {data.filter(d => d.name !== 'Unallocated').map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
