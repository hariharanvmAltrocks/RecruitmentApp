import React, { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Info } from "lucide-react";
import styles from "./Drawer.module.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

export interface PasswordRule {
  key: string;
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: "length",
    label: strings.AtLeast10CharactersLong,
    test: (pw) => pw.length >= 10,
  },
  {
    key: "uppercase",
    label: strings.ContainsAnUppercaseLetterAZ,
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: "lowercase",
    label: strings.ContainsALowercaseLetterAZ,
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    key: "number",
    label: strings.ContainsANumber09,
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    key: "special",
    label: strings.ContainsASpecialCharacter,
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  passwordValue?: string;
  showRules?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "••••••••",
  readOnly = false,
  passwordValue = "",
  showRules = false,
}) => {
  const [show, setShow] = useState(false);

  // Count how many rules pass
  const passCount = showRules
    ? PASSWORD_RULES.filter((r) => r.test(passwordValue)).length
    : 0;

  const strengthIndex = passCount - 1; // -1 when 0 pass = no segments lit

  const strengthClasses = [
    styles.active0,
    styles.active1,
    styles.active2,
    styles.active3,
    styles.active4,
  ];

  return (
    <div className={styles.field}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className={styles.label}>{label}</span>

        {showRules && (
          <span
            className={styles.tooltipAnchor}
            tabIndex={0}
            role="button"
            aria-label={strings.PasswordRequirements}
          >
            <Info size={14} className={styles.tooltipIcon} />

            <div className={styles.tooltipBox} role="tooltip">
              <div className={styles.tooltipTitle}>Password requirements</div>
              <div className={styles.tooltipRuleList}>
                {PASSWORD_RULES.map((rule) => {
                  const pass = rule.test(passwordValue);
                  return (
                    <div
                      key={rule.key}
                      className={`${styles.tooltipRule} ${pass ? styles.pass : ""}`}
                    >
                      <span className={styles.tooltipRuleDot}>
                        {pass && (
                          <Check size={9} strokeWidth={3} color="#fff" />
                        )}
                      </span>
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </span>
        )}
      </div>

      <div className={styles.passwordInputRow}>
        <input
          type={show ? "text" : "password"}
          className={`${styles.input} ${styles.passwordInput} ${error ? styles.hasError : ""}`}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
        {!readOnly && (
          <button
            type="button"
            className={styles.passwordToggleBtn}
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? strings.HidePassword : strings.ShowPassword}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>

      {showRules && passwordValue.length > 0 && (
        <div className={styles.strengthBarWrap} aria-hidden="true">
          {PASSWORD_RULES.map((_, i) => (
            <div
              key={i}
              className={`${styles.strengthSegment} ${
                i <= strengthIndex ? strengthClasses[strengthIndex] : ""
              }`}
            />
          ))}
        </div>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
