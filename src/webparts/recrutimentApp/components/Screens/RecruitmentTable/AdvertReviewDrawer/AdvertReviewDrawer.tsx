import React, { useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileCheck,
  FileText,
  Globe,
  History,
  LayoutDashboard,
  MessageSquare,
  Paperclip,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { usePositionDetails } from "./Hooks/getPositionDetails";
import { useAdvertismentDetails } from "./Hooks/getAdvertismentDetails";
import { useAttachmentDetails } from "./Hooks/getAttachmentDetails";
import { useSignatureDetails } from "./Hooks/getSignatureDetails";
import { AdvertLanguage } from "./StateManage/useStateFromManage";
import "./AdvertReviewDrawer.scss";

export interface AdvertReviewDrawerProps {
  drawerOpen: boolean;
  selectedJobId: string | null;
  advertLanguage: AdvertLanguage;
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  onClose: () => void;
  onLanguageChange: (language: AdvertLanguage) => void;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
}

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  icon?: React.ElementType;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon: Icon }) => (
  <div className="advert-review-drawer__info-field">
    <div className="advert-review-drawer__info-label">
      {Icon && <Icon size={12} />}
      <span>{label}</span>
    </div>
    <div className="advert-review-drawer__info-value">{value ?? "-"}</div>
  </div>
);

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({ width = "100%", height = "14px" }) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

export const AdvertReviewDrawer: React.FC<AdvertReviewDrawerProps> = ({
  drawerOpen,
  selectedJobId,
  advertLanguage,
  reviewerComments,
  acknowledgementCheckbox,
  loadingState,
  onClose,
  onLanguageChange,
  onCommentsChange,
  onToggleAcknowledgement,
  setLoadingState,
}) => {
  const { data: positionDetails, loading: positionLoading } = usePositionDetails(selectedJobId);
  const { data: advertDetails, loading: advertLoading } = useAdvertismentDetails(selectedJobId);
  const { data: attachments, loading: attachmentLoading } = useAttachmentDetails(selectedJobId);
  const { data: signatureDetails, loading: signatureLoading } = useSignatureDetails(selectedJobId);

  const isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;

  useEffect(() => {
    if (loadingState !== isLoading) {
      setLoadingState(isLoading);
    }
  }, [isLoading, loadingState, setLoadingState]);

  const advertContent = useMemo(() => {
    if (!advertDetails) {
      return null;
    }

    return advertLanguage === "EN" ? advertDetails.english : advertDetails.french;
  }, [advertDetails, advertLanguage]);

  const headerMeta = useMemo(() => ({
    title: positionDetails?.jobTitle ?? "",
    code: positionDetails?.jobCode ?? "",
    department: positionDetails?.department ?? "",
  }), [positionDetails]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const attachmentCards = useMemo(() => (
    attachments.map((doc, index) => (
      <div key={`${doc.title}-${index}`} className="advert-review-drawer__attachment-card">
        <div className="advert-review-drawer__attachment-header">
          <div className={`advert-review-drawer__attachment-type advert-review-drawer__attachment-type--${doc.type.toLowerCase()}`}>
            <FileText size={14} />
            <span>{doc.type}</span>
          </div>
          <div className="advert-review-drawer__attachment-meta">
            <div className="advert-review-drawer__attachment-title" title={doc.title}>{doc.title}</div>
            <div className="advert-review-drawer__attachment-tag">Recruitment</div>
          </div>
        </div>

        <div className="advert-review-drawer__attachment-body">
          {doc.versions.map((version, idx) => (
            <div key={`${version.lang}-${idx}`} className="advert-review-drawer__attachment-version">
              <div className={`advert-review-drawer__attachment-lang advert-review-drawer__attachment-lang--${version.lang.toLowerCase()}`}>
                {version.lang}
              </div>
              <div className="advert-review-drawer__attachment-info">
                <div className="advert-review-drawer__attachment-label">{version.label}</div>
                <div className="advert-review-drawer__attachment-size">{version.size}</div>
              </div>
              <Download size={12} />
            </div>
          ))}
        </div>
      </div>
    ))
  ), [attachments]);

  const responsibilitiesList = useMemo(() => (
    advertContent?.responsibilities.map((item, index) => (
      <li key={`${item}-${index}`} className="advert-review-drawer__list-item">
        <span className="advert-review-drawer__list-dot" />
        {item}
      </li>
    ))
  ), [advertContent]);

  const qualificationsList = useMemo(() => (
    advertContent?.qualifications.map((item, index) => (
      <li key={`${item}-${index}`} className="advert-review-drawer__list-item advert-review-drawer__list-item--muted">
        <span className="advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" />
        {item}
      </li>
    ))
  ), [advertContent]);

  const experienceList = useMemo(() => (
    advertContent?.experience.map((item, index) => (
      <li key={`${item}-${index}`} className="advert-review-drawer__list-item advert-review-drawer__list-item--muted">
        <span className="advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" />
        {item}
      </li>
    ))
  ), [advertContent]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="advert-review-drawer">
          <motion.div
            className="advert-review-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="advert-review-drawer__panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="advert-review-drawer__header">
              <div className="advert-review-drawer__header-left">
                <div className="advert-review-drawer__header-icon">
                  <FileCheck size={22} />
                </div>
                <div>
                  <h2 className="advert-review-drawer__title">
                    {isLoading ? <SkeletonBlock width="220px" /> : headerMeta.title}
                  </h2>
                  <div className="advert-review-drawer__meta">
                    {isLoading ? (
                      <SkeletonBlock width="160px" />
                    ) : (
                      <>
                        <span className="advert-review-drawer__badge">{headerMeta.code}</span>
                        <span className="advert-review-drawer__dot" />
                        <span className="advert-review-drawer__meta-text">{headerMeta.department}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button type="button" className="advert-review-drawer__close" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <div className="advert-review-drawer__content">
              <section className="advert-review-drawer__section advert-review-drawer__section--frame">
                <div className="advert-review-drawer__section-header">
                  <h3>
                    <span className="advert-review-drawer__section-indicator" />
                    Position Framework
                  </h3>
                  <span className="advert-review-drawer__ref">REF: {headerMeta.code || "-"}</span>
                </div>

                {isLoading ? (
                  <div className="advert-review-drawer__grid">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div key={`skeleton-${idx}`} className="advert-review-drawer__info-field">
                        <SkeletonBlock width="120px" />
                        <SkeletonBlock width="180px" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="advert-review-drawer__group">
                    <h4 className="advert-review-drawer__group-title">
                      <Users size={12} />
                      Organizational Alignment
                    </h4>
                    <div className="advert-review-drawer__grid">
                      <InfoField label="BU Code" value={positionDetails?.buCode} icon={FileText} />
                      <InfoField label="BU Name" value={positionDetails?.buName} icon={LayoutDashboard} />
                      <InfoField label="Department" value={positionDetails?.department} icon={Users} />
                      <InfoField label="Sub Department" value={positionDetails?.subDepartment} icon={ChevronRight} />
                      <InfoField label="Section" value={positionDetails?.section} icon={ChevronRight} />
                      <InfoField label="Dept Code" value={positionDetails?.deptCode} icon={FileText} />
                      <InfoField label="Reports To" value={positionDetails?.reportsTo} icon={UserCheck} />
                      <InfoField label="Area of Work" value={positionDetails?.areaOfWork} icon={Globe} />
                    </div>

                    <div className="advert-review-drawer__divider" />

                    <h4 className="advert-review-drawer__group-title">
                      <ClipboardList size={12} />
                      Position Classification
                    </h4>
                    <div className="advert-review-drawer__grid">
                      <InfoField label="Nationality" value={positionDetails?.nationality} icon={Globe} />
                      <InfoField label="Paterson Grade" value={positionDetails?.patersonGrade} icon={Activity} />
                      <InfoField label="DRC Grade" value={positionDetails?.drcGrade} icon={Activity} />
                      <InfoField label="Employment Category" value={positionDetails?.employmentCategory} icon={UserCheck} />
                      <InfoField label="Type of Contract" value={positionDetails?.contractType} icon={FileCheck} />
                      <InfoField label="No of Person(s)" value={positionDetails?.numberOfPersons} icon={Users} />
                      <InfoField label="Date Required" value={positionDetails?.dateRequired} icon={Calendar} />
                    </div>
                  </div>
                )}
              </section>

              <div className="advert-review-drawer__section advert-review-drawer__section--toggle">
                <div className="advert-review-drawer__toggle-label">
                  <Globe size={14} />
                  Advert Language
                </div>
                <div className="advert-review-drawer__toggle">
                  <button
                    type="button"
                    className={`advert-review-drawer__toggle-button ${advertLanguage === "EN" ? "is-active" : ""}`.trim()}
                    onClick={() => onLanguageChange("EN")}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`advert-review-drawer__toggle-button ${advertLanguage === "FR" ? "is-active" : ""}`.trim()}
                    onClick={() => onLanguageChange("FR")}
                  >
                    French
                  </button>
                </div>
              </div>

              <section className="advert-review-drawer__section">
                <h3 className="advert-review-drawer__section-title">
                  <FileText size={12} />
                  Job Description ({advertLanguage})
                </h3>
                {isLoading ? (
                  <SkeletonBlock height="72px" />
                ) : (
                  <p className="advert-review-drawer__description">{advertContent?.description}</p>
                )}
              </section>

              <section className="advert-review-drawer__section">
                <h3 className="advert-review-drawer__section-title">
                  <CheckCircle2 size={12} />
                  Key Responsibilities ({advertLanguage})
                </h3>
                {isLoading ? (
                  <div className="advert-review-drawer__list">
                    <SkeletonBlock width="80%" />
                    <SkeletonBlock width="60%" />
                    <SkeletonBlock width="70%" />
                  </div>
                ) : (
                  <ul className="advert-review-drawer__list">{responsibilitiesList}</ul>
                )}
              </section>

              <div className="advert-review-drawer__grid advert-review-drawer__grid--split">
                <section className="advert-review-drawer__section">
                  <h3 className="advert-review-drawer__section-title">
                    <UserCheck size={12} />
                    Qualifications ({advertLanguage})
                  </h3>
                  {isLoading ? (
                    <div className="advert-review-drawer__list">
                      <SkeletonBlock width="70%" />
                      <SkeletonBlock width="55%" />
                    </div>
                  ) : (
                    <ul className="advert-review-drawer__list">{qualificationsList}</ul>
                  )}
                </section>
                <section className="advert-review-drawer__section">
                  <h3 className="advert-review-drawer__section-title">
                    <Activity size={12} />
                    Experience ({advertLanguage})
                  </h3>
                  {isLoading ? (
                    <div className="advert-review-drawer__list">
                      <SkeletonBlock width="65%" />
                      <SkeletonBlock width="50%" />
                    </div>
                  ) : (
                    <ul className="advert-review-drawer__list">{experienceList}</ul>
                  )}
                </section>
              </div>

              <section className="advert-review-drawer__section">
                <div className="advert-review-drawer__section-header advert-review-drawer__section-header--plain">
                  <h3>
                    <Paperclip size={12} />
                    Required Attachments
                  </h3>
                </div>
                {isLoading ? (
                  <div className="advert-review-drawer__attachments">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={`attachment-skeleton-${idx}`} className="advert-review-drawer__attachment-card">
                        <div className="advert-review-drawer__attachment-header">
                          <SkeletonBlock width="60%" />
                        </div>
                        <div className="advert-review-drawer__attachment-body">
                          <SkeletonBlock width="80%" />
                          <SkeletonBlock width="65%" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="advert-review-drawer__attachments">{attachmentCards}</div>
                )}
              </section>

              <section className="advert-review-drawer__section advert-review-drawer__section--comments">
                <h3 className="advert-review-drawer__section-title">
                  <MessageSquare size={12} />
                  Reviewer Comments
                </h3>
                <textarea
                  className="advert-review-drawer__textarea"
                  placeholder="Add your feedback or notes here..."
                  value={reviewerComments}
                  onChange={(event) => onCommentsChange(event.target.value)}
                />

                <div className="advert-review-drawer__signature">
                  <label className="advert-review-drawer__acknowledge">
                    <span className={`advert-review-drawer__checkbox ${acknowledgementCheckbox ? "is-checked" : ""}`.trim()}>
                      <input
                        type="checkbox"
                        checked={acknowledgementCheckbox}
                        onChange={onToggleAcknowledgement}
                      />
                      <CheckCircle2 size={12} />
                    </span>
                    <span>
                      I hereby acknowledge that I have reviewed the job advertisement details and attachments, and I confirm that the
                      information is accurate and ready for publication.
                    </span>
                  </label>

                  <div className="advert-review-drawer__signature-details">
                    <div className="advert-review-drawer__avatar">
                      {isLoading ? "" : (signatureDetails?.reviewerInitial ?? "JD")}
                    </div>
                    <div className="advert-review-drawer__signature-meta">
                      <div>
                        <div className="advert-review-drawer__signature-label">Reviewer Name</div>
                        <div className="advert-review-drawer__signature-value">
                          {isLoading ? <SkeletonBlock width="120px" /> : signatureDetails?.reviewerName}
                        </div>
                      </div>
                      <div>
                        <div className="advert-review-drawer__signature-label">Job Title (EN)</div>
                        <div className="advert-review-drawer__signature-value">
                          {isLoading ? <SkeletonBlock width="140px" /> : signatureDetails?.jobTitleEN}
                        </div>
                      </div>
                      <div>
                        <div className="advert-review-drawer__signature-label">Job Title (FR)</div>
                        <div className="advert-review-drawer__signature-value">
                          {isLoading ? <SkeletonBlock width="160px" /> : signatureDetails?.jobTitleFR}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="advert-review-drawer__footer">
              <button type="button" className="advert-review-drawer__history" title="View History">
                <History size={18} />
              </button>
              <div className="advert-review-drawer__footer-actions">
                <button type="button" className="advert-review-drawer__button" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`advert-review-drawer__button advert-review-drawer__button--primary ${acknowledgementCheckbox ? "" : "is-disabled"}`.trim()}
                  disabled={!acknowledgementCheckbox}
                >
                  <CheckCircle2 size={16} />
                  Approve Advert
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
