
import { CheckCircle } from "lucide-react";
import { InterviewScheduleForm } from "../Hooks/Usesubmitcandidatereview";
import styles from "./ShowCandidateDetailsPopup.module.scss";
import React from "react";


export const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};

export const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
    }),
};

export const SectionHeader: React.FC<{
    title: string;
    subtitle?: string;
    accent?: "orange" | "blue" | "green" | "red";
}> = ({ title, subtitle, accent = "orange" }) => {
    const accentClass = {
        orange: styles.accentOrange,
        blue: styles.accentBlue,
        green: styles.accentGreen,
        red: styles.accentRed,
    }[accent];

    return (
        <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderRow}>
                <div className={`${styles.sectionAccentBar} ${accentClass}`} />
                <h3 className={styles.sectionTitle}>{title}</h3>
            </div>
            {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
        </div>
    );
};

export const InfoItem: React.FC<{ label: string; value?: string | null; icon?: React.ReactNode }> = ({
    label,
    value,
    icon,
}) => (
    <div className={styles.infoItem}>
        <div className={styles.infoLabel}>
            {icon && <span className={styles.infoLabelIcon}>{icon}</span>}
            {label}
        </div>
        <div className={styles.infoValue}>{value ?? "--"}</div>
    </div>
);

export const QuestionCard: React.FC<{ index: number; question: string; answer?: string | null }> = ({
    index,
    question,
    answer,
}) => {
    const isYes = answer?.toLowerCase() === "yes";
    const isNo = answer?.toLowerCase() === "no";
    const badgeClass = isYes
        ? styles.answerYes
        : isNo
            ? styles.answerNo
            : styles.answerNeutral;

    return (
        <div className={styles.questionRow}>
            <div className={styles.questionInner}>
                <div className={styles.questionPill}>
                    <span>Q{index}</span>
                </div>
                <div className={styles.questionBody}>
                    <h4 className={styles.questionText}>{question}</h4>
                    <div className={styles.answerRow}>
                        <span className={styles.answerLabel}>Answer:</span>
                        <span className={`${styles.answerBadge} ${badgeClass}`}>{answer ?? "--"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface InterviewScheduleInputProps {
    form: InterviewScheduleForm;
    onChange: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>;
    panelOptions: { value: string; label: string }[];
    onToggleMember: (val: string) => void;
    minPanelCount?: number;
    Disable: boolean;
}

const toDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const InterviewScheduleInput: React.FC<InterviewScheduleInputProps> = ({
  form,
  onChange,
  panelOptions,
  onToggleMember,
  minPanelCount = 3,
  Disable
}) => {
  const needsMore = form.panelMembers.length < minPanelCount;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDay = new Date(today);
  maxDay.setDate(today.getDate() + 5);
  maxDay.setHours(23, 59, 0, 0);

  const minDateTime = toDateTimeLocal(today);      
  const maxDateTime = toDateTimeLocal(maxDay);      

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value; 
    const datePart = newStart.split("T")[0];
    const currentEndTime = form.endDate?.split("T")[1] ?? "00:00"; 

    const newEnd = `${datePart}T${currentEndTime}`;

    onChange((p) => ({ ...p, startDate: newStart, endDate: newEnd }));
  };
  const endDateMin = form.startDate ? `${form.startDate.split("T")[0]}T00:00` : minDateTime;
  const endDateMax = form.startDate ? `${form.startDate.split("T")[0]}T23:59` : maxDateTime;

  return (
    <div className={styles.scheduleCard}>
      <div className={styles.panelMembersWrap}>
        <label className={styles.fieldLabel}>
          Interview panel members <span className={styles.fieldRequired}>*</span>
        </label>
        <div className={styles.panelTagsWrap}>
          {panelOptions.map((opt) => {
            const selected = form.panelMembers.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.panelTag} ${selected ? styles.panelTagSelected : styles.panelTagUnselected}`}
                onClick={() => onToggleMember(opt.value)}
                disabled={Disable}
              >
                {selected && <CheckCircle size={16} className={styles.panelTagIcon} />}
                {opt.label}
              </button>
            );
          })}
        </div>
        {needsMore && (
          <span className={styles.panelWarning}>
            Please select at least {minPanelCount} panel members • {form.panelMembers.length} selected
          </span>
        )}
      </div>

      <div className={styles.dateRow}>
        <div className={styles.dateField}>
          <label className={styles.fieldLabel}>
            Start date & time <span className={styles.fieldRequired}>*</span>
          </label>
          <input
            type="datetime-local"
            className={styles.dateInput}
            value={form.startDate}
            min={maxDateTime}
            onChange={handleStartDateChange}
            disabled ={Disable}
          />
        </div>
        <div className={styles.dateField}>
          <label className={styles.fieldLabel}>
            End date & time <span className={styles.fieldRequired}>*</span>
          </label>
          <input
            type="datetime-local"
            className={styles.dateInput}
            value={form.endDate}
            min={endDateMin}  
            max={endDateMax}
            disabled={!form.startDate || Disable}  
            onChange={(e) => onChange((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
};