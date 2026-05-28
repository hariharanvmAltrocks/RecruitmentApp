import * as React from 'react';
import type { Candidate } from '../State/CommonStateManagement';
import styles from './CandidateInfo.module.scss';
import * as strings from 'RecrutimentAppWebPartStrings';

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
        <span className={styles.leftTitle}>{strings.CandidateInfo}</span>
      </div>

      <div style={{ paddingTop: 8 }}>
        <InfoField icon="👤" label={strings.ApplicantName1}  value={candidate?.applicantName} />
        <InfoField icon="🌐" label={strings.Nationality1}     value={candidate?.nationality} />
        <InfoField icon="👤" label={strings.Gender1}          value={candidate?.gender} />
        <InfoField icon="📄" label={strings.Qualification1}   value={candidate?.qualification} />

        <div className={styles.twoCol}>
          <InfoField icon="📈" label={strings.MiningExp1}  value={candidate?.miningExp} />
          <InfoField icon="📈" label={strings.RelatedExp1} value={candidate?.relevantExp} />
        </div>

        <div className={styles.twoCol}>
          <InfoField icon="📅" label={strings.InterviewDate1} value={candidate?.interviewDate} />
          {candidate?.interviewLevel && (
            <InfoField icon="🔲" label={strings.Level} value={candidate?.interviewLevel} />
          )}
        </div>
        {candidate?.grade && (
          <div className={styles.twoCol}>
            <InfoField icon="📈" label={strings.Grade} value={candidate?.grade} />
            <InfoField icon="⚠️" label={strings.Conflicts1} value={candidate?.conflictsOfInterest} />
          </div>
        )}

        <InfoField icon="♿" label={strings.Disability1} value={candidate?.disability} />

        {(candidate?.panelMembers?.length ?? 0) > 0 && (
          <div className={styles.panelSection}>
            <div className={styles.panelHeader}>
              <span className={styles.panelHeaderIcon}>{strings.StringKey1}</span>
              <span className={styles.panelHeaderLabel}>{strings.InterviewPanel}</span>
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