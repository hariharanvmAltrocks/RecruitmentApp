import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UrgentTask } from '../../models';
import { cn } from '../../utilities/cn';

interface UrgentWidgetProps {
  tasks: UrgentTask[];
}

const UrgentWidget: React.FC<UrgentWidgetProps> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500" />
          Urgent
        </h3>
        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
          {tasks.length} TASKS
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{task.title}</div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">{task.subtitle}</div>
              </div>
              <span
                className={cn(
                  'text-[8px] font-bold px-1.5 py-0.5 rounded border',
                  task.type === 'error'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-orange-50 text-orange-600 border-orange-100'
                )}
              >
                {task.overdue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentWidget;
