import React, { useEffect, useState } from "react";
import styles from "./advertextension.module.scss";
import {
  DataSyncToRecruitmentResponse,
  IDptData,
} from "../../../../../services/RecruitmentTable/IRecruitmentService";
import { toDate } from "../../../../Hooks/dateConfigfn";
import { usePositionDetails } from "../../AdvertReviewDrawer/Hooks/getPositionDetails";
import Loading from "../../../../Comman/Loading/loading";
import { ModalPopup } from "../../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../../Comman/ModalPopup/useModalPopup";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface useadvert {
  filterConditions: any[];
  Conditions: string;
  form: IDptData;
  IsActive: number;
  IsExtened: number;
  extendStartDate: Date;
  extendEndDate: Date;
  isSecondExtension: boolean;
}

interface AdvertExtensionProps {
  RecruitmentID: number;
  onClose: () => void;
  useDataExtension: (args: useadvert) => { triggerExtension: () => void };
}

type DateState = {
  StartDate: Date | undefined;
  EndDate: Date | undefined;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EXTENSION_LABELS = [
  "First Extension Date",
  "Second Extension Date",
  "Third Extension Date",
] as const;

const EMPTY_DATE: DateState = { StartDate: undefined, EndDate: undefined };

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

const calculateValidTo = (
  startDate: Date | undefined,
  daysToAdd: number,
): Date => {
  const result = new Date(startDate ?? new Date());
  let added = 0;
  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) added++;
  }
  if (result.getDay() === 0) result.setDate(result.getDate() + 1);
  return result;
};

const formatDateDisplay = (date: Date | undefined): string => {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
};

const toInputValue = (date: Date | undefined): string => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const checkCannotExtend = (
  positionDetails: DataSyncToRecruitmentResponse | null | undefined,
): { cannotExtend: boolean; comparisonDate: Date | null } => {
  if (!positionDetails) {
    return { cannotExtend: false, comparisonDate: null };
  }

  const {
    JobPostingEndDate,
    JobPostingFirstExtensionEndDate,
    JobPostingSecondExtensionEndDate,
  } = positionDetails;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let comparisonDate: Date | null = null;

  if (JobPostingSecondExtensionEndDate) {
    comparisonDate = new Date(JobPostingSecondExtensionEndDate);
  } else if (JobPostingFirstExtensionEndDate) {
    comparisonDate = new Date(JobPostingFirstExtensionEndDate);
  } else if (JobPostingEndDate) {
    comparisonDate = new Date(JobPostingEndDate);
  }

  if (!comparisonDate) {
    return { cannotExtend: false, comparisonDate: null };
  }

  comparisonDate.setHours(0, 0, 0, 0);

  return {
    cannotExtend: today <= comparisonDate,
    comparisonDate,
  };
};

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Custom Hook: date state ──────────────────────────────────────────────────

function useDateExtensionState(
  RecuritmentData: DataSyncToRecruitmentResponse | null,
) {
  const [Level1Date, setLevel1Date] = useState<DateState>(EMPTY_DATE);
  const [Level2Date, setLevel2Date] = useState<DateState>(EMPTY_DATE);
  const [Level3Date, setLevel3Date] = useState<DateState>(EMPTY_DATE);
  const [showLevel3, setShowLevel3] = useState(false);

  useEffect(() => {
    if (!RecuritmentData) {
      setLevel1Date(EMPTY_DATE);
      setLevel2Date(EMPTY_DATE);
      setLevel3Date(EMPTY_DATE);
      setShowLevel3(false);
      return;
    }

    const startDate = toDate(RecuritmentData.JobPostingStartDate);
    const endDate = toDate(RecuritmentData.JobPostingEndDate);

    setLevel1Date({ StartDate: startDate, EndDate: endDate });

    const secondEnd = endDate ? calculateValidTo(endDate, 14) : undefined;
    setLevel2Date({ StartDate: startDate, EndDate: secondEnd });

    if (RecuritmentData.JobPostingFirstExtensionEndDate) {
      const firstExtEnd = toDate(
        RecuritmentData.JobPostingFirstExtensionEndDate,
      );
      const thirdEnd = calculateValidTo(firstExtEnd, 14);
      setLevel3Date({ StartDate: startDate, EndDate: thirdEnd });
      setShowLevel3(true);
    } else {
      setLevel3Date(EMPTY_DATE);
      setShowLevel3(false);
    }
  }, [RecuritmentData]);

  return { Level1Date, Level2Date, Level3Date, showLevel3 };
}

// ─── DateField sub-component ──────────────────────────────────────────────────

interface DateFieldProps {
  label: string;
  date: Date | undefined;
}

const DateField: React.FC<DateFieldProps> = React.memo(({ label, date }) => (
  <div className={styles.dateField}>
    <label className={styles.fieldLabel}>{label}</label>
    <div className={styles.inputWrap}>
      <input
        type="date"
        className={styles.dateInput}
        value={toInputValue(date)}
        disabled
        readOnly
      />
      <span className={styles.calIcon}>
        <CalendarIcon />
      </span>
    </div>
    <span className={styles.displayDate}>{formatDateDisplay(date)}</span>
  </div>
));

export const AdvertExtension: React.FC<AdvertExtensionProps> = ({
  RecruitmentID,
  onClose,
  useDataExtension,
}) => {
  const { data: positionDetails, loading: positionLoading } =
    usePositionDetails(RecruitmentID, "Recruitment");

  const { modalState, showModal, closeModal } = useModalPopup();

  const { Level1Date, Level2Date, Level3Date, showLevel3 } =
    useDateExtensionState(positionDetails ?? null);

  const { cannotExtend, comparisonDate } = checkCannotExtend(positionDetails);

  useEffect(() => {
    if (cannotExtend && comparisonDate) {
      showModal({
        title: "Extension Not Allowed",
        message: `You cannot extend the advertisement as the posting period has ${formatDateDisplay(comparisonDate)} already ended.`,
        type: "error",
        confirmLabel: "OK",
        onConfirm: () => {
          closeModal();
          onClose();
        },
      });
    }
  }, [cannotExtend, positionLoading]);

  const form: IDptData = {
    ID: positionDetails?.ID ?? 0,
    JobCodeId: positionDetails?.JobCodeId ?? 0,
    JobCode: positionDetails?.JobCode ?? "",
    JobTitleEnglish: positionDetails?.JobTitleEnglish ?? "",
    JobTitleFrench: positionDetails?.JobTitleFrench ?? "",
    DepartmentID: positionDetails?.DepartmentId ?? 0,
    Nationality: positionDetails?.Nationality ?? "",
    NumberOfPersonNeeded: positionDetails?.NumberOfPersonNeeded ?? "",
    Dptcode: positionDetails?.DepartmentCode ?? "",
    reviewerComments: "",
    StatusId: positionDetails?.StatusId ?? 0,
  };

  const activeStart =
    (showLevel3 ? Level3Date.StartDate : Level2Date.StartDate) ?? new Date();
  const activeEnd =
    (showLevel3 ? Level3Date.EndDate : Level2Date.EndDate) ?? new Date();

  const advertArgs: useadvert = {
    filterConditions: [
      { FilterKey: "JobCodeId", Operator: "eq", FilterValue: form.JobCodeId },
    ],
    Conditions: "",
    form,
    IsActive: 0,
    IsExtened: 0,
    extendStartDate: activeStart,
    extendEndDate: activeEnd,
    isSecondExtension: showLevel3,
  };

  const { triggerExtension } = useDataExtension(advertArgs);

  const extensionRows = [
    {
      label: EXTENSION_LABELS[0],
      start: Level1Date.StartDate,
      end: Level1Date.EndDate,
    },
    {
      label: EXTENSION_LABELS[1],
      start: Level1Date.StartDate,
      end: Level2Date.EndDate,
    },
    ...(showLevel3
      ? [
          {
            label: EXTENSION_LABELS[2],
            start: Level1Date.StartDate,
            end: Level3Date.EndDate,
          },
        ]
      : []),
  ];

  const hideSubmit = Boolean(positionDetails?.JobPostingSecondExtensionEndDate);

  if (positionLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.iconWrap}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className={styles.title}>Advertisement Extension</h2>
            </div>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Job subtitle */}
          <div className={styles.jobSubtitle}>
            <span className={styles.jobLabel}>Job Title</span>
            <span className={styles.jobName}>
              {positionDetails?.JobTitleEnglish ?? "—"}
            </span>
          </div>

          {/* Scrollable body */}
          <div className={styles.body}>
            {extensionRows.map((row, i) => (
              <div className={styles.extensionBlock} key={i}>
                <div className={styles.extensionLabelRow}>
                  <span className={styles.extensionIndex}>{i + 1}</span>
                  <span className={styles.extensionLabel}>{row.label}</span>
                </div>
                <div className={styles.dateRow}>
                  <DateField label="Start Date" date={row.start} />
                  <div className={styles.dateDivider}>
                    <span className={styles.arrowLine} />
                  </div>
                  <DateField label="End Date" date={row.end} />
                </div>
                {i < extensionRows.length - 1 && (
                  <div className={styles.divider} />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Close
            </button>
            {/* Also hide submit when extension is not allowed */}
            {!hideSubmit && !cannotExtend && (
              <button className={styles.submitBtn} onClick={triggerExtension}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      <ModalPopup {...modalState} onClose={closeModal} />
    </>
  );
};

export default AdvertExtension;
