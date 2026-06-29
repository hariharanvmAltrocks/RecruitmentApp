import React from "react";
import {
  Activity,
  Calendar,
  ChevronRight,
  ClipboardList,
  FileCheck,
  FileText,
  Globe,
  LayoutDashboard,
  UserCheck,
  Users,
} from "lucide-react";
import "../OfferTable.scss";
import "./ReviewDocument.scss";
import moment from "moment";
import {
  PPEItem,
  PPESizingTagStrip,
} from "./Component/Ppesizinginfo/Ppesizinginfo";
import { IDocFiles } from "../../../../services/SPService/Ispservice";

export interface IselectedPosition {
  ID: number;
  CandidateID: number;
  RecID: number;
  JobTiltle: string;
  JobCode: string;
  positionID: string;
  ApplicantName: string;
  Nationality: string;
  Gender: string;
  ProofOfIdentity: string;
  IdentityNumber: string;
  Email: string;
  Location: string;
  BusinessUnitCode: string;
  BusinessUnitCodeId: number;
  Department: string;
  SubDepartment: string;
  Section: string;
  DepartmentCode: string;
  EmploymentCategory: string;
  TypeofContract: string;
  AreaofWork: string;
  patersonGrade: string;
  drcGrade: string;

  JoiningDate: string;
  NoticePeriod: string;

  ReferenceName: string;
  ReferenceDesignation: string;
  ReferenceEmail: string;
  ReferencePhone: string;
  ReferenceCompanyName: string;
  StatusID: number;

  ProfileID: string;
  JobRequestID: string;

  PPEItems: PPEItem[];
  DotAfricaCF: IDocFiles;

  NationalityCode: string;

  PreChecklist: IPreChecklist;

  labourHire: string;
}

export interface IPreChecklist {
  BackgroundChecks: boolean;
  SignedOfferLetterVerified: boolean;
  VisaProcess: boolean;
  AccommodationBooked: boolean;
  SignedEmploymentContract: boolean;
  WorkPermitApproved: boolean;
  TravelProcess: boolean;
  MedicalCheckStatus: boolean;
  ReadyForOnboarding: boolean;
}

export interface PositionFrameworkProps {
  positionDetails: IselectedPosition | null;
  isLoading: boolean;
  headerCode: string;
}

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  icon?: React.ElementType;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon: Icon }) => {
  const displayValue = value != null ? String(value) : "-";
  return (
    <div className="review-document__info-field">
      <div className="review-document__info-label" title={label}>
        {Icon && <Icon size={12} />}
        <span>{label}</span>
      </div>
      <div className="review-document__info-value" title={displayValue}>
        {displayValue}
      </div>
    </div>
  );
};

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => <div className="review-document__skeleton" style={{ width, height }} />;

const SAMPLE_ITEMS: PPEItem[] = [
  { kit: "Cont. Suit Pants", size: "36" },
  { kit: "Cont. Suit Top", size: "XL" },
  { kit: "Safety Shoes", size: "7" },
];

export const PositionFrame: React.FC<PositionFrameworkProps> = ({
  positionDetails,
  isLoading,
  headerCode,
}) => (
  <section className="review-document__section review-document__section--frame">
    <div className="review-document__section-header">
      <h3>
        <span className="review-document__section-indicator" />
        Position Framework
      </h3>
      {/* <span className="advert-review-drawer__ref">REF: {headerCode || "-"}</span> */}
    </div>

    {isLoading ? (
      <div className="review-document__grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className="review-document__info-field">
            <SkeletonBlock width="120px" />
            <SkeletonBlock width="180px" />
          </div>
        ))}
      </div>
    ) : (
      <>
        <div className="review-document__group">
          <h4 className="review-document__group-title">
            <Users size={12} />
            Organizational Alignment
          </h4>
          <div className="review-document__grid">
            <InfoField
              label="Applicant Name"
              value={positionDetails?.ApplicantName}
              icon={FileText}
            />
            <InfoField
              label="Nationality"
              value={positionDetails?.Nationality}
              icon={Users}
            />
            <InfoField
              label="Gender"
              value={positionDetails?.Gender}
              icon={LayoutDashboard}
            />
            <InfoField
              label="Proof Of Identity"
              value={positionDetails?.ProofOfIdentity}
              icon={ChevronRight}
            />
            <InfoField
              label="Identity Number"
              value={positionDetails?.IdentityNumber}
              icon={ChevronRight}
            />
            <InfoField
              label="Email"
              value={positionDetails?.Email}
              icon={FileText}
            />
            <InfoField
              label="Location"
              value={positionDetails?.Location}
              icon={UserCheck}
            />
          </div>

          <div className="review-document__divider" />

          <h4 className="review-document__group-title">
            <ClipboardList size={12} />
            Position Classification
          </h4>
          <div className="review-document__grid">
            <InfoField
              label="Business Unit Code"
              value={positionDetails?.BusinessUnitCode}
              icon={Globe}
            />
            <InfoField
              label="Department"
              value={positionDetails?.Department}
              icon={Activity}
            />
            <InfoField
              label="Sub Department"
              value={positionDetails?.SubDepartment}
              icon={Activity}
            />
            <InfoField
              label="Section"
              value={positionDetails?.Section}
              icon={UserCheck}
            />
            <InfoField
              label="Department Code"
              value={positionDetails?.DepartmentCode}
              icon={FileCheck}
            />
            <InfoField
              label="Employment Category"
              value={positionDetails?.EmploymentCategory}
              icon={Users}
            />
            <InfoField
              label="Type of Contract"
              value={positionDetails?.TypeofContract}
              icon={Users}
            />
            <InfoField
              label="Area of Work"
              value={positionDetails?.AreaofWork}
              icon={Users}
            />
            {positionDetails?.labourHire != null &&
              positionDetails.labourHire !== "" && (
                <InfoField
                  label="Labour Hire"
                  value={positionDetails.labourHire}
                  icon={Users}
                />
              )}
            {positionDetails?.JoiningDate && (
              <InfoField
                label="Joining Date"
                value={moment(positionDetails?.JoiningDate).format(
                  "DD-MM-YYYY",
                )}
                icon={Users}
              />
            )}
            {positionDetails?.NoticePeriod && (
              <InfoField
                label="Notice Period"
                value={positionDetails?.NoticePeriod}
                icon={Users}
              />
            )}
          </div>
          {positionDetails?.ReferenceName && (
            <>
              <h4 className="review-document__group-title">
                <ClipboardList size={12} />
                Reference Employer Details
              </h4>
              <div className="review-document__grid">
                <InfoField
                  label="Reference Name"
                  value={positionDetails?.ReferenceName}
                  icon={Globe}
                />
                <InfoField
                  label="Reference Designation"
                  value={positionDetails?.ReferenceDesignation}
                  icon={Activity}
                />
                <InfoField
                  label="Reference Email ID"
                  value={positionDetails?.ReferenceEmail}
                  icon={Activity}
                />
                <InfoField
                  label="Reference Contact Number"
                  value={positionDetails?.ReferencePhone}
                  icon={UserCheck}
                />
                <InfoField
                  label="Reference Company Name"
                  value={positionDetails?.ReferenceCompanyName}
                  icon={FileCheck}
                />
              </div>
            </>
          )}
        </div>
        {positionDetails && positionDetails?.PPEItems?.length > 0 && (
          <PPESizingTagStrip items={positionDetails?.PPEItems} />
        )}
      </>
    )}
  </section>
);
