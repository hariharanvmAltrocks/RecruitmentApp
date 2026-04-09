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
import "../RecruitmentTable.scss";
import { PositionDetails } from "../AdvertReviewDrawer/Hooks/getPositionDetails";
import moment from "moment";

export interface PositionFrameworkProps {
  positionDetails: PositionDetails | null;
  isLoading: boolean;
  headerCode: string;
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

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

export const PositionFramework: React.FC<PositionFrameworkProps> = ({
  positionDetails,
  isLoading,
  headerCode,
}) => (
  <section className="advert-review-drawer__section advert-review-drawer__section--frame">
    <div className="advert-review-drawer__section-header">
      <h3>
        <span className="advert-review-drawer__section-indicator" />
        Position Framework
      </h3>
      {/* <span className="advert-review-drawer__ref">REF: {headerCode || "-"}</span> */}
    </div>

    {isLoading ? (
      <div className="advert-review-drawer__grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="advert-review-drawer__info-field"
          >
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
          <InfoField
            label="BU Code"
            value={positionDetails?.buCode}
            icon={FileText}
          />
          {/* <InfoField label="BU Name" value={positionDetails?.buName} icon={LayoutDashboard} /> */}
          <InfoField
            label="Department"
            value={positionDetails?.department}
            icon={Users}
          />
          <InfoField
            label="Sub Department"
            value={positionDetails?.subDepartment}
            icon={ChevronRight}
          />
          <InfoField
            label="Section"
            value={positionDetails?.section}
            icon={ChevronRight}
          />
          <InfoField
            label="Dept Code"
            value={positionDetails?.deptCode}
            icon={FileText}
          />
          {/* <InfoField label="Reports To" value={positionDetails?.reportsTo} icon={UserCheck} /> */}
          <InfoField
            label="Area of Work"
            value={positionDetails?.areaOfWork}
            icon={Globe}
          />
        </div>

        <div className="advert-review-drawer__divider" />

        <h4 className="advert-review-drawer__group-title">
          <ClipboardList size={12} />
          Position Classification
        </h4>
        <div className="advert-review-drawer__grid">
          <InfoField
            label="Nationality"
            value={positionDetails?.nationality}
            icon={Globe}
          />
          <InfoField
            label="Paterson Grade"
            value={positionDetails?.patersonGrade}
            icon={Activity}
          />
          <InfoField
            label="DRC Grade"
            value={positionDetails?.drcGrade}
            icon={Activity}
          />
          <InfoField
            label="Employment Category"
            value={positionDetails?.employmentCategory}
            icon={UserCheck}
          />
          <InfoField
            label="Type of Contract"
            value={positionDetails?.contractType}
            icon={FileCheck}
          />
          <InfoField
            label="No of Person(s)"
            value={positionDetails?.numberOfPersons}
            icon={Users}
          />
          <InfoField
            label="Date Required"
            value={moment(positionDetails?.dateRequired).format("DD-MM-YYYY")}
            icon={Calendar}
          />
        </div>
      </div>
    )}
  </section>
);
