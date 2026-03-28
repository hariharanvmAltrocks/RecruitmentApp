import * as React from 'react';
import type { Candidate } from '../State/CommonStateManagement';
import styles from './CandidateInfo.module.scss';

interface CandidateInfoProps {
  candidate: Candidate | null;
  onRefresh?: () => void;
}

export default function CandidateInfo({ candidate, onRefresh }: CandidateInfoProps): JSX.Element {
  return (
    <aside className={styles.leftPanel}>
      {/* Sticky header */}
      <div className={styles.leftHeader}>
        <div className={styles.leftAccent} />
        <span className={styles.leftTitle}>CANDIDATE INFO</span>
        {onRefresh && (
          <button className={styles.refreshBtn} title="Refresh" onClick={onRefresh}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ paddingTop: 8 }}>
        <InfoField icon="👤" label="APPLICANT NAME"  value={candidate?.applicantName} />
        <InfoField icon="🌐" label="NATIONALITY"     value={candidate?.nationality} />
        <InfoField icon="👤" label="GENDER"          value={candidate?.gender} />
        <InfoField icon="📄" label="QUALIFICATION"   value={candidate?.qualification} />

        <div className={styles.twoCol}>
          <InfoField icon="📈" label="MINING EXP."  value={candidate?.miningExp} />
          <InfoField icon="📈" label="RELATED EXP." value={candidate?.relevantExp} />
        </div>

        <div className={styles.twoCol}>
          <InfoField icon="📅" label="INTERVIEW DATE" value={candidate?.interviewDate} />
          <InfoField icon="🔲" label="LEVEL"          value={candidate?.interviewLevel} />
        </div>

        <div className={styles.twoCol}>
          <InfoField icon="📈" label="GRADE"     value={candidate?.grade} />
          <InfoField icon="⚠️" label="CONFLICTS" value={candidate?.conflictsOfInterest} />
        </div>

        <InfoField icon="♿" label="DISABILITY" value={candidate?.disability} />

        {(candidate?.panelMembers?.length ?? 0) > 0 && (
          <div className={styles.panelSection}>
            <div className={styles.panelHeader}>
              <span className={styles.panelHeaderIcon}>👥</span>
              <span className={styles.panelHeaderLabel}>INTERVIEW PANEL</span>
            </div>
            {candidate!.panelMembers!.map((name, i) => (
              <div key={i} className={styles.panelRow}>
                <span className={styles.panelBadge}>{i + 1}</span>
                <span className={styles.panelName}>{name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon?: string;
  label: string;
  value?: string;
}): JSX.Element {
  return (
    <div className={styles.leftFieldWrapper}>
      <div className={styles.leftFieldLabelRow}>
        {icon && <span className={styles.leftFieldIcon}>{icon}</span>}
        <span className={styles.leftFieldLabel}>{label}</span>
      </div>
      <div className={styles.leftFieldValueBox}>{value || ''}</div>
    </div>
  );
}