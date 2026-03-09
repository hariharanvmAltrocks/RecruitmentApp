import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ClipboardList, Zap } from 'lucide-react';
import { PriorityData } from '../../models';

interface PriorityWidgetProps {
  data: PriorityData[];
}

const PriorityWidget: React.FC<PriorityWidgetProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Priority Tasks
        </h3>
        <button className="text-blue-600 text-[10px] font-bold uppercase tracking-wider hover:underline">Manage</button>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800">
              {data.reduce((acc, d) => acc + d.value, 0)}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Pendings</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {data.map((item, idx) => {
            const total = data.reduce((acc, d) => acc + d.value, 0);
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-50 border border-slate-100">
                      {idx === 0 ? <ClipboardList size={12} className="text-blue-500" /> : <Zap size={12} className="text-orange-500" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{item.value} Tasks</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-6">{item.name}</div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden ml-6">
                  <div className="h-full transition-all duration-1000 rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
        <Zap size={14} className="text-yellow-400 fill-yellow-400" />
        Process All Pendings
      </button>
    </div>
  );
};

export default PriorityWidget;
