import * as React from "react";
import "./BGVerification.scss";
import * as strings from 'RecrutimentAppWebPartStrings';
import { Text } from '@microsoft/sp-core-library';

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

export type CheckboxGroupOption = {
  id: string | number;
  key: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
};

export type VerificationCardProps = {
  mandatoryChecks: MandatoryCheck[];
  VerificationChecks: CheckboxGroupOption[];
  onToggleOption: (id: string) => void;
  hasError?: boolean;
  disabled?: boolean;
};

const BGVerification = ({
  mandatoryChecks,
  VerificationChecks,
  onToggleOption,
  hasError = false,
  disabled = false
}: VerificationCardProps) => {
  const optionalChecks: VerifiedCheck[] = VerificationChecks.map((check) => ({
    id: String(check.id),
    label: check.description || strings.UnnamedCheck,
    checked: Boolean(check.checked),
  }));

  return (
    <div
      className={[
        "vc-card-container",
        hasError ? "vc-card-container--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="vc-header">
        <h2 className="vc-title">
          {strings.BackgroundVerificationRequirements}<span className="vc-required-asterisk">*</span>
        </h2>
        <p className="vc-subtitle">
          {strings.SelectTheRequiredBackgroundChecksForThis}</p>
      </div>

      <div className="vc-body">
        <div className="vc-section">
          <h3 className="vc-section-title">
            {strings.StandardRequirementsPreSelected}</h3>
          <div className="vc-grid">
            {mandatoryChecks.map((item) => (
              <label key={item.id} className="vc-option disabled">
                <input
                  type="checkbox"
                  className="vc-checkbox"
                  checked
                  disabled
                  readOnly
                  aria-label={item.label}
                />
                <span className="vc-checkbox-wrap">
                  <span className="vc-custom-checkbox" aria-hidden="true" />
                </span>
                <span className="vc-label-text">{item.label}</span>
                <span className="vc-badge">{strings.Required}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="vc-section">
          <h3 className="vc-section-title">
            {strings.AdditionalRoleSpecificChecks}</h3>
          <div className="vc-grid">
            {optionalChecks.map((item) => (
              <label
                key={item.id}
                className={Text.format(strings.VcOptionInteractive, )}
              >
                <input
                  type="checkbox"
                  className="vc-checkbox"
                  checked={item.checked}
                  onChange={() => onToggleOption(item.id)}
                  aria-label={item.label}
                  disabled={disabled}
                />
                <span className="vc-checkbox-wrap">
                  <span className="vc-custom-checkbox" aria-hidden="true" />
                </span>
                <span className="vc-label-text">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {hasError && (
        <p className="vc-error-text">
          {strings.PleaseChooseAtLeastOneBgvVerificationOpt}</p>
      )}
    </div>
  );
};

export default BGVerification;