import * as React from 'react';
import type { Candidate } from '../State/CommonStateManagement';
import styles from './CandidateInfo.module.scss';

interface CandidateInfoProps {
  candidate: Candidate | null;
}

export default function CandidateInfo({ candidate }: CandidateInfoProps): JSX.Element {
  return (
    <aside className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ${styles.card}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Candidate Info</h3>
          <p className="text-xs text-slate-500">Personal and recruitment details</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">Profile</span>
      </div>

      <div className="flex flex-col gap-4">
        <InfoRow label="Name" value={candidate?.applicantName} />
        <InfoRow label="Job Title" value={candidate?.jobTitle} />
        <InfoRow label="Grade" value={candidate?.grade} />
        <InfoRow label="Nationality" value={candidate?.nationality} />
        <InfoRow label="Interview Date" value={candidate?.interviewDate} />
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 font-semibold">
        {value || '—'}
      </div>
    </div>
  );
}
