import React, { useEffect, useState } from "react";
import { Check, Eye, EyeOff, Info } from "lucide-react";
import styles from "./drawer.module.scss";

export interface PasswordRule {
  key: string;
  label: string;
  test: (pw: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: "length",
    label: "At least 10 characters long",
    test: (pw) => pw.length >= 10,
  },
  {
    key: "uppercase",
    label: "Contains an uppercase letter (A–Z)",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    key: "lowercase",
    label: "Contains a lowercase letter (a–z)",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    key: "number",
    label: "Contains a number (0–9)",
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    key: "special",
    label: "Contains a special character (!@#$…)",
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
      {/* ── Label row with optional tooltip ─────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className={styles.label}>{label}</span>

        {showRules && (
          <span
            className={styles.tooltipAnchor}
            tabIndex={0}
            role="button"
            aria-label="Password requirements"
          >
            <Info size={14} className={styles.tooltipIcon} />

            {/* ── Tooltip box ────────────────────────────────────────────── */}
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
            aria-label={show ? "Hide password" : "Show password"}
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
