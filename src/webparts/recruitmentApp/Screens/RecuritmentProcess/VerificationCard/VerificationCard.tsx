import * as React from "react";
import "./VerificationCard.css";
import { CheckboxGroupOption } from "../../../components/CustomCheckboxGroup";

// 1. Ensure your types are expecting the right data
export type VerifiedCheck = {
  id: string;
  label: string;
  checked: boolean;
};

export type MandatoryCheck = {
  id: string;
  label: string;
  key: string;
  checked: boolean;
};

// export type RawVerificationCheck = {
//   id: string | number;
//   description?: string;
//   checked: boolean;
//   isMandatory?: boolean;
// }

export type VerificationCardProps = {
  mandatoryChecks: MandatoryCheck[];
  VerificationChecks: CheckboxGroupOption[];
  onToggleOption: (id: string) => void;
};

const VerificationCard = ({
  mandatoryChecks,
  VerificationChecks,
  onToggleOption,
}: VerificationCardProps) => {
  // let mandatoryChecks: MandatoryCheck[] = VerificationChecks.filter(
  //   (check) => check.checked,
  // ).map((check) => ({
  //   id: String(check.id),
  //   label: check.description || "Unnamed Check",
  // }));

  let optionalChecks: VerifiedCheck[] = VerificationChecks.map((check) => ({
    id: String(check.id),
    label: check.description || "Unnamed Check",
    checked: Boolean(check.checked),
  }));

  return (
    <div className="vc-card-container">
      <div className="vc-header">
        <h2 className="vc-title">
          Background Verification Requirements{" "}
          <span className="vc-required-asterisk">*</span>
        </h2>
        <p className="vc-subtitle">
          Select the required background checks for this job title.
        </p>
      </div>

      <div className="vc-body">
        {/* Mandatory Section */}
        <div className="vc-section">
          <h3 className="vc-section-title">
            Standard Requirements (Pre-selected)
          </h3>
          <div className="vc-grid">
            {mandatoryChecks.map((item) => (
              <label key={item.id} className="vc-option disabled">
                <input
                  type="checkbox"
                  className="vc-checkbox"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
                <span className="vc-label-text">{item.label}</span>
                <span className="vc-badge">Required</span>
              </label>
            ))}
          </div>
        </div>

        <div className="vc-section">
          <h3 className="vc-section-title">Additional Role-Specific Checks</h3>
          <div className="vc-grid">
            {optionalChecks.map((item) => (
              <label
                key={item.id}
                className={`vc-option interactive ${item.checked ? "checked" : ""}`}
              >
                <input
                  type="checkbox"
                  className="vc-checkbox"
                  checked={item.checked}
                  onChange={() => onToggleOption(item.id)}
                />
                <span className="vc-label-text">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;
