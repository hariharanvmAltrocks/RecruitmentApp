import React from 'react';
import { ChevronRight, ArrowUpDown } from 'lucide-react';
import { Metric, TrackerRow } from '../../models';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utilities/cn';

interface TrackerTableProps {
  data: TrackerRow[];
  activeMetric: string;
  selectedMetric: Metric;
  onRowClick: (row: TrackerRow) => void;
}

const TrackerTable: React.FC<TrackerTableProps> = ({ data, activeMetric, selectedMetric, onRowClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-800">My Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing <span className="text-slate-900 font-bold">{selectedMetric.value}</span> results for{' '}
            <span className="text-blue-600 font-bold">{selectedMetric.label}</span>
          </p>
        </div>
        <button className="text-blue-600 hover:underline text-sm font-bold">View All Tasks</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {activeMetric === 'pos-mapping' ? (
                <>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Code <ArrowUpDown size={10} className="inline ml-1" /></th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title <ArrowUpDown size={10} className="inline ml-1" /></th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">BusinessUnit Code <ArrowUpDown size={10} className="inline ml-1" /></th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position Request <ArrowUpDown size={10} className="inline ml-1" /></th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality <ArrowUpDown size={10} className="inline ml-1" /></th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Vacancies</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Request Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4" />
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {data.slice(0, selectedMetric.value > 7 ? 7 : selectedMetric.value).map((row, idx) => (
                <motion.tr
                  key={`${activeMetric}-${row.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  onClick={() => onRowClick(row)}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  {activeMetric === 'pos-mapping' ? (
                    <>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.jobCode}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.title}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.buCode}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.posRequest}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.nationality}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-100">
                          Recruitment In Progress
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mx-auto" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-700">{row.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Job Code: {row.jobCode}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-600">{row.vacancies.toString().padStart(2, '0')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-500">{row.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border',
                          selectedMetric.bgColor,
                          selectedMetric.color,
                          selectedMetric.color.replace('text-', 'border-').replace('500', '100')
                        )}>
                          {selectedMetric.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackerTable;
