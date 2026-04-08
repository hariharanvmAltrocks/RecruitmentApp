import React from "react";
import { Activity, ClipboardList, FileCheck, LucideIcon, Zap } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface PriorityData {
    name: string;
    value: number;
    percent: number;
    color: string;
    iconType: 'hr' | 'onem'; 
}

interface PriorityWidgetProps {
  data: PriorityData[];
  total: number;
}

const iconMap: Record<PriorityData["iconType"], LucideIcon> = {
  hr: ClipboardList,
  onem: Activity
};

const PriorityWidget: React.FC<PriorityWidgetProps> = ({ data, total }) => {
  const safeTotal = total || data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          Priority Tasks
        </h3>

        {/* <button className="text-blue-600 text-[10px] font-bold uppercase tracking-wider hover:underline">
          Manage
        </button> */}
      </div>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-800">{safeTotal}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              Pendings
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {data.map((item, idx) => {
            const percentage = item.percent || Math.round((item.value / (safeTotal || 1)) * 100);
            const Icon = iconMap[item.iconType] || FileCheck;

            return (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-slate-50 border border-slate-100">
                      <Icon size={12} className="text-slate-600" />
                    </div>

                    <span className="text-[10px] font-bold text-slate-600">
                      {item.value} Tasks
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    {percentage}%
                  </span>
                </div>

                <div className="ml-6 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.name}
                </div>

                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden ml-6">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
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
