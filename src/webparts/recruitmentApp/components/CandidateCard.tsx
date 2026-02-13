import * as React from "react";
import "./CandidateList.css";
import { StatusId } from "../utilities/Config";

export interface CandidateItem {
  CandidateID: number;
  ApplicantName: string;
  appliedBy?: string;
  createdOn: Date | string;
  Status: string;
  statusId?: number;
  PositionTitle?: string;
}

interface Props {
  data: CandidateItem;
  onClick?: (id: number) => void;
  isLoading?: boolean;
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case "Pending":
      return "candidate-status-pending";
    case "In Review":
      return "candidate-status-inreview";
    case "Interviewed":
      return "candidate-status-interviewed";
    case "Selected":
      return "candidate-status-selected";
    case "Rejected":
      return "candidate-status-rejected";
    default:
      return "candidate-status-default";
  }
};

const statusClassFromId = (id?: number, statusText?: string): string => {
  if (typeof id === "number") {
    switch (id) {
      case StatusId.Selected:
        return "candidate-status-selected";
      case StatusId.Pending:
      case StatusId.RecruitmentInProgress:
        return "candidate-status-pending";
      case StatusId.OnHoldbyHOD:
      case StatusId.CandidateOnHoldbyHODLevel1:
      case StatusId.CandidateOnHoldbyHODLevel2:
        return "candidate-status-inreview";
      case StatusId.RejectedbyHOD:
      case StatusId.CandidateRejectedbyHODLevel1:
      case StatusId.CandidateRejectedbyHODLevel2:
        return "candidate-status-rejected";
      default:
        break;
    }
  }
  return getStatusClass(statusText || "");
};

const CandidateCard: React.FC<Props> = ({ data, onClick, isLoading }) => {
  const getInitials = (name: string): string => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(data.ApplicantName || "");

  const formatDate = (date: Date | string): string => {
    try {
      if (typeof date === "string") {
        return new Date(date).toLocaleDateString("en-GB");
      }
      return date instanceof Date ? date.toLocaleDateString("en-GB") : "N/A";
    } catch {
      return "N/A";
    }
  };

  const handleCardClick = (): void => {
    if (onClick && !isLoading) {
      onClick(data.CandidateID);
    }
  };

  return (
    <div
      className={`candidate-card ${isLoading ? "loading" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
      title={`View details for ${data.ApplicantName}`}
    >
      {/* 1. Candidate Name */}
<div className="candidate-name-cell">
  <div className="candidate-card-avatar">{initials}</div>

  <div className="candidate-text">
    <div className="candidate-card-name">
      {data.ApplicantName || ""}
    </div>
  </div>
</div>

      {/* 2. Position Title */}
      <div className="min-w-0">
        <span className="text-xs text-gray-600 font-medium leading-relaxed block truncate pr-4">
          {data.appliedBy || ""}
        </span>
      </div>
      {/* 3. Created On */}
      <div>
        <span className="text-xs text-gray-600 font-medium">
          {formatDate(data.createdOn)}
        </span>
      </div>
      {/* 4. Status */}
      <div 
      // style={{ display: "flex", justifyContent: "flex-end" }}
      >
  <div className={`status-pill-fixed ${statusClassFromId(data.statusId, data.Status)}`}>
    <span className="status-dot-common"></span>
    <span className="truncate">{data.Status}</span>
  </div>
</div>
    </div>
  );
};

export default CandidateCard;