import React, { useMemo, useCallback } from "react";
import { CheckCircle } from "lucide-react";
import styles from "./InterviewScheduleInput.module.scss";
import { TimeDropdown } from "../../../../Comman/TimeComponent/TimeDropdown";
import * as strings from 'RecrutimentAppWebPartStrings';

export interface ScheduleForm {
  panelMembers: string[];
  startDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"  (24h)
  endTime: string; // "HH:MM"  (24h)
}

interface PanelOption {
  value: string;
  label: string;
}

interface InterviewScheduleInputProps {
  form: ScheduleForm;
  onChange: (updater: (prev: ScheduleForm) => ScheduleForm) => void;
  panelOptions: PanelOption[];
  onToggleMember: (val: string) => void;
  minPanelCount?: number;
  Disable?: boolean;
}

const WORK_START_H = 9;
const WORK_END_H = 18;

function buildTimeSlots(startH: number, endH: number) {
  const slots: { value: string; label: string }[] = [];
  for (let h = startH; h < endH; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const value = `${hh}:${mm}`;
      const ampm = h < 12 ? "AM" : "PM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const label = `${displayH}:${mm} ${ampm}`;
      slots.push({ value, label });
    }
  }
  return slots;
}

function addThirtyMins(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const totalMins = h * 60 + m + 30;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/** Today's date as "YYYY-MM-DD" */
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/** Max date (today + 5 days) as "YYYY-MM-DD" */
function maxDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString().split("T")[0];
}

// ─── Component ────────────────────────────────────────────────────────────────
export const InterviewScheduleInput: React.FC<InterviewScheduleInputProps> = ({
  form,
  onChange,
  panelOptions,
  onToggleMember,
  minPanelCount = 3,
  Disable,
}) => {
  const needsMore = form.panelMembers.length < minPanelCount;

  // All start time options (09:00 – 17:30)
  const startSlots = useMemo(
    () => buildTimeSlots(WORK_START_H, WORK_END_H),
    [],
  );

  // End time options: everything AFTER the selected start time (up to 18:00)
  const endSlots = useMemo(() => {
    if (!form.startTime) return buildTimeSlots(WORK_START_H, WORK_END_H);
    const [sh, sm] = form.startTime.split(":").map(Number);
    const startMins = sh * 60 + sm;
    return buildTimeSlots(WORK_START_H, WORK_END_H).filter(({ value }) => {
      const [h, m] = value.split(":").map(Number);
      return h * 60 + m > startMins;
    });
  }, [form.startTime]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;

      onChange((p) => ({
        ...p,
        startDate: newDate,
        startTime: "",
        endTime: "",
      }));
    },
    [onChange],
  );

  const handleStartTimeChange = useCallback(
    (newStart: string) => {
      const autoEnd = addThirtyMins(newStart);
      const [endH] = autoEnd.split(":").map(Number);
      const validEnd = endH <= WORK_END_H ? autoEnd : newStart;
      onChange((p) => ({ ...p, startTime: newStart, endTime: validEnd }));
    },
    [onChange],
  );

  const handleEndTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange((p) => ({ ...p, endTime: e.target.value }));
    },
    [onChange],
  );

  return (
    <div className={styles.scheduleCard}>
      {/* ── Panel Members ─────────────────────────────────────────────────── */}
      <div className={styles.panelMembersWrap}>
        <label className={styles.fieldLabel}>
          {strings.InterviewPanelMembers}<span className={styles.fieldRequired}> *</span>
        </label>

        <div className={styles.panelTagsWrap}>
          {panelOptions.map((opt) => {
            const selected = form.panelMembers.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.panelTag} ${
                  selected ? styles.panelTagSelected : styles.panelTagUnselected
                }`}
                onClick={() => onToggleMember(opt.value)}
                disabled={Disable}
              >
                {selected && (
                  <CheckCircle size={15} className={styles.panelTagIcon} />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>

        {needsMore && (
          <span className={styles.panelWarning}>
            {strings.SelectAtLeast}{minPanelCount} {strings.PanelMembers}{" "}
            {form.panelMembers.length} {strings.Selected}</span>
        )}
      </div>

      {/* ── Date + Time Row ───────────────────────────────────────────────── */}
      <div className={styles.dateRow}>
        {/* Date */}
        <div className={styles.dateField}>
          <label className={styles.timeFieldLabel}>
            {strings.Date}<span className={styles.fieldRequired}>*</span>
          </label>
          <input
            type="date"
            className={styles.dateInput}
            value={form.startDate}
            min={maxDateStr()}
            onChange={handleDateChange}
            disabled={Disable}
          />
        </div>

        {/* Start Time */}
        <div className={styles.dateField}>
          <label className={styles.timeFieldLabel}>
            {strings.StartTime}<span className={styles.fieldRequired}>*</span>
          </label>
          <TimeDropdown
            value={form.startTime}
            onChange={(val) => handleStartTimeChange(val)}
            slots={startSlots}
            placeholder={strings.SelectTime}
            disabled={!form.startDate || Disable}
          />
        </div>

        {/* <span className={styles.timeSeparator}>—</span> */}

        {/* End Time */}
        <div className={styles.dateField}>
          <label className={styles.timeFieldLabel}>
            {strings.EndTime}<span className={styles.fieldRequired}>*</span>
          </label>
          <TimeDropdown
            value={form.endTime}
            onChange={(val) => onChange((p) => ({ ...p, endTime: val }))}
            slots={endSlots}
            placeholder="Select time"
            disabled={!form.startTime || Disable}
          />
        </div>
      </div>
    </div>
  );
};
