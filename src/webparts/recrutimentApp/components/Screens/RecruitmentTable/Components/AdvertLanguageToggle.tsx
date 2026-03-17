import React, { useMemo } from "react";
import { Activity, CheckCircle2, FileText, Globe, UserCheck } from "lucide-react";
import { AdvertLanguage } from "../AdvertReviewDrawer/StateManage/useStateFromManage";
import { AdvertLanguageDetails } from "../AdvertReviewDrawer/Hooks/getAdvertismentDetails";
import "../RecruitmentTable.scss"

export interface AdvertLanguageToggleProps {
  advertLanguage: AdvertLanguage;
  advertContent: AdvertLanguageDetails | null;
  isLoading: boolean;
  onLanguageChange: (language: AdvertLanguage) => void;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({ width = "100%", height = "14px" }) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

export const AdvertLanguageToggle: React.FC<AdvertLanguageToggleProps> = ({
  advertLanguage,
  advertContent,
  isLoading,
  onLanguageChange,
}) => {
  const responsibilitiesList = useMemo(
    () =>
      advertContent?.responsibilities.map((item, index) => (
        <li key={`${item}-${index}`} className="advert-review-drawer__list-item">
          <span className="advert-review-drawer__list-dot" />
          {item}
        </li>
      )),
    [advertContent]
  );

  const qualificationsList = useMemo(
    () =>
      advertContent?.qualifications.map((item, index) => (
        <li key={`${item}-${index}`} className="advert-review-drawer__list-item advert-review-drawer__list-item--muted">
          <span className="advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" />
          {item}
        </li>
      )),
    [advertContent]
  );

  const experienceList = useMemo(
    () =>
      advertContent?.experience.map((item, index) => (
        <li key={`${item}-${index}`} className="advert-review-drawer__list-item advert-review-drawer__list-item--muted">
          <span className="advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" />
          {item}
        </li>
      )),
    [advertContent]
  );

  return (
    <>
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
    </>
  );
};
