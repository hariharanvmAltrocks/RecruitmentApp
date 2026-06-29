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
          {candidate?.interviewLevel && (
            <InfoField icon="🔲" label="LEVEL" value={candidate?.interviewLevel} />
          )}
        </div>
        {candidate?.grade && (
          <div className={styles.twoCol}>
            <InfoField icon="📈" label="GRADE" value={candidate?.grade} />
            <InfoField icon="⚠️" label="CONFLICTS" value={candidate?.conflictsOfInterest} />
          </div>
        )}

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