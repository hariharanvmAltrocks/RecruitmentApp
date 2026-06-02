import React, { useMemo } from "react";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  Globe,
  Layers,
  Shield,
  Star,
  TrendingUp,
  UserCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { AdvertLanguage } from "../AdvertReviewDrawer/StateManage/useStateFromManage";
import { AdvertLanguageDetails } from "../AdvertReviewDrawer/Hooks/getAdvertismentDetails";
import "../RecruitmentTable.scss";
import * as strings from 'RecrutimentAppWebPartStrings';
import { Text } from '@microsoft/sp-core-library';

export interface AdvertLanguageToggleProps {
  advertLanguage: AdvertLanguage;
  advertContent: AdvertLanguageDetails | null;
  isLoading: boolean;
  onLanguageChange: (language: AdvertLanguage) => void;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

const SkeletonList: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="advert-review-drawer__list">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock key={i} width={`${60 + (i % 3) * 10}%`} />
    ))}
  </div>
);

// ─── Strip HTML helper ────────────────────────────────────────────────────────
const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? "";
};

// ─── Section component ────────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  isLoading: boolean;
  skeletonLines?: number;
  children: React.ReactNode;
  isEmpty?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  isLoading,
  skeletonLines = 3,
  children,
  isEmpty = false,
}) => {
  if (!isLoading && isEmpty) return null;

  return (
    <section className="advert-review-drawer__section">
      <h3 className="advert-review-drawer__section-title">
        {icon}
        {title}
      </h3>
      {isLoading ? <SkeletonList lines={skeletonLines} /> : children}
    </section>
  );
};

// ─── List renderer ────────────────────────────────────────────────────────────
const renderList = (
  items: string[] | null | undefined,
  muted = false,
): React.ReactNode => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="advert-review-drawer__list">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={`advert-review-drawer__list-item${muted ? " advert-review-drawer__list-item--muted" : ""}`}
        >
          <span
            className={`advert-review-drawer__list-dot${muted ? " advert-review-drawer__list-dot--muted" : ""}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
};

export const AdvertLanguageToggle: React.FC<AdvertLanguageToggleProps> = ({
  advertLanguage,
  advertContent,
  isLoading,
  onLanguageChange,
}) => {
  const responsibilitiesList = useMemo(
    () => renderList(advertContent?.responsibilities),
    [advertContent?.responsibilities],
  );

  const qualificationsList = useMemo(
    () => renderList(advertContent?.qualifications, true),
    [advertContent?.qualifications],
  );

  const preferredQualificationsList = useMemo(
    () => renderList(advertContent?.PrefeQualification, true),
    [advertContent?.PrefeQualification],
  );

  const experienceList = useMemo(
    () => renderList(advertContent?.experience, true),
    [advertContent?.experience],
  );

  const roleSpecificKnowledgeList = useMemo(
    () => renderList(advertContent?.RoleSpecificKnowledge, true),
    [advertContent?.RoleSpecificKnowledge],
  );

  const requiredLevelList = useMemo(
    () => renderList(advertContent?.RequiredLevel, true),
    [advertContent?.RequiredLevel],
  );

  const technicalSkillsList = useMemo(
    () => renderList(advertContent?.TechnicalSkills, true),
    [advertContent?.TechnicalSkills],
  );

  const levelProficiencyList = useMemo(
    () => renderList(advertContent?.LevelProficiency, true),
    [advertContent?.LevelProficiency],
  );

  const jobFunctionalTypeList = useMemo(
    () => renderList(advertContent?.JobFunctionalType, true),
    [advertContent?.JobFunctionalType],
  );

  const jobBGVList = useMemo(
    () => renderList(advertContent?.JobBasedBGVVerification, true),
    [advertContent?.JobBasedBGVVerification],
  );

  const isEmpty = (arr: string[] | null | undefined) =>
    !arr || arr.length === 0;

  return (
    <>
      <section className="advert-review-drawer__section advert-review-drawer__section--frame">
        <div className="advert-review-drawer__section-header">
          <h3>
            <span className="advert-review-drawer__section-indicator" />
            {strings.JobAdvertisement}</h3>
        </div>
        <div className="advert-review-drawer__section advert-review-drawer__section--toggle">
          <div className="advert-review-drawer__toggle-label">
            <Globe size={14} />
            {strings.AdvertLanguage}</div>
          <div className="advert-review-drawer__toggle">
            <button
              type="button"
              className={`advert-review-drawer__toggle-button ${advertLanguage === "EN" ? "is-active" : ""}`.trim()}
              onClick={() => onLanguageChange("EN")}
            >
              {strings.English}</button>
            <button
              type="button"
              className={`advert-review-drawer__toggle-button ${advertLanguage === "FR" ? "is-active" : ""}`.trim()}
              onClick={() => onLanguageChange("FR")}
            >
              {strings.French}</button>
          </div>
        </div>

        <section className="advert-review-drawer__section">
          <h3 className="advert-review-drawer__section-title">
            <FileText size={12} />
            {strings.JobDescription}{advertLanguage}
          </h3>
          {isLoading ? (
            <SkeletonBlock height="72px" />
          ) : (
            <p className="advert-review-drawer__description">
              {advertContent?.description || ""}
            </p>
          )}
        </section>

        <Section
          title={Text.format(strings.KeyResponsibilities, )}
          icon={<CheckCircle2 size={12} />}
          isLoading={isLoading}
          isEmpty={isEmpty(advertContent?.responsibilities)}
        >
          {responsibilitiesList}
        </Section>

        <Section
          title={Text.format(strings.Experience, )}
          icon={<Activity size={12} />}
          isLoading={isLoading}
          skeletonLines={2}
          isEmpty={isEmpty(advertContent?.experience)}
        >
          {experienceList}
        </Section>

        <div className="advert-review-drawer__grid advert-review-drawer__grid--split">
          <Section
            title={Text.format(strings.MinimumQualification, )}
            icon={<Award size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.qualifications)}
          >
            {qualificationsList}
          </Section>

          <Section
            title={Text.format(strings.PreferredQualification, )}
            icon={<Star size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.PrefeQualification)}
          >
            {preferredQualificationsList}
          </Section>

          <Section
            title={Text.format(strings.RoleSpecificKnowledge, )}
            icon={<BookOpen size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.RoleSpecificKnowledge)}
          >
            {roleSpecificKnowledgeList}
          </Section>

          <Section
            title={Text.format(strings.RequiredLevel, )}
            icon={<TrendingUp size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.RequiredLevel)}
          >
            {requiredLevelList}
          </Section>

          <Section
            title={Text.format(strings.TechnicalSkillsAbilityToApplyKnowledge, )}
            icon={<Wrench size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.TechnicalSkills)}
          >
            {technicalSkillsList}
          </Section>

          <Section
            title={Text.format(strings.LevelOfProficiency, )}
            icon={<Zap size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.LevelProficiency)}
          >
            {levelProficiencyList}
          </Section>

          <Section
            title={Text.format(strings.JobFunctionalType, )}
            icon={<Briefcase size={12} />}
            isLoading={isLoading}
            skeletonLines={2}
            isEmpty={isEmpty(advertContent?.JobFunctionalType)}
          >
            {jobFunctionalTypeList}
          </Section>

          {/* <Section
          title={`Job Based BGV Verification (${advertLanguage})`}
          icon={<Shield size={12} />}
          isLoading={isLoading}
          skeletonLines={2}
          isEmpty={isEmpty(advertContent?.JobBasedBGVVerification)}
        >
          {jobBGVList}
        </Section> */}
        </div>
      </section>
    </>
  );
};
