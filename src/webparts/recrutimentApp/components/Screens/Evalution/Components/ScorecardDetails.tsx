import * as React from 'react';
import type { ScoreSummary } from '../State/CommonStateManagement';
import styles from './ScorecardDetails.module.scss';

interface ScorecardDetailsProps {
  summary: ScoreSummary;
}

export default function ScorecardDetails({ summary }: ScorecardDetailsProps): JSX.Element {
  return (
    <section className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${styles.scorecard}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Scorecard Summary</h3>
          <p className="text-xs text-slate-500">Aggregated interview performance</p>
        </div>
        <span className={statusClass(summary.status)}>{summary.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryTile label="Total Score" value={summary.total.toString()} />
        <SummaryTile label="Average" value={summary.average.toString()} />
        <SummaryTile label="Status" value={summary.status} />
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</div>
      <div className="text-lg font-bold text-slate-800 mt-1">{value}</div>
    </div>
  );
}

function statusClass(status: ScoreSummary['status']): string {
  switch (status) {
    case 'Pass':
      return 'text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full';
    case 'Borderline':
      return 'text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full';
    case 'Fail':
      return 'text-xs font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full';
    default:
      return 'text-xs font-semibold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full';
  }
}
