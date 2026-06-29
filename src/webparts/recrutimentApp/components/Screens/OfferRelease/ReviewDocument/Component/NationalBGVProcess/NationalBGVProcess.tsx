// NationalBGVProcess.tsx
import React from "react";
import { ShieldCheck, AlertCircle, FileText, Landmark } from "lucide-react";
import { ValidationError, COIFormState } from "../../StateManage/useReviewDocumentManage";
import COICard from "../Coicard/Coicard";

export interface NationalBGVProcessProps {
  payslipChecked: string;
  bankStatementChecked: string;
  verifiedByHR: boolean;
  validationError: ValidationError;
  isReadOnly?: boolean;
  coiState: COIFormState;
  showCoiErrors: boolean;
  onCoiChange: (state: any) => void;
  consultOptions: any[];

  onChangePayslipChecked: (val: string) => void;
  onChangeBankStatementChecked: (val: string) => void;
  onChangeVerifiedByHR: (val: boolean) => void;
}

export const NationalBGVProcess: React.FC<NationalBGVProcessProps> = ({
  payslipChecked,
  bankStatementChecked,
  verifiedByHR,
  validationError,
  isReadOnly = false,
  coiState,
  showCoiErrors,
  onCoiChange,
  consultOptions,

  onChangePayslipChecked,
  onChangeBankStatementChecked,
  onChangeVerifiedByHR,
}) => {
  return (
    <div>
       <div className="national-bgv-card">
      <div className="national-bgv-card__titleRow">
        <div className="national-bgv-card__titleIcon">
          <ShieldCheck size={20} />
        </div>
        <h2 className="national-bgv-card__title">National Payslips Verification </h2>
      </div>

      <p className="national-bgv-card__description">
       Please review and verify the candidate's 3 months of payslips and last 6 months of bank statements. After completing the verification, select "Yes" if the information is verified; otherwise, select "No".
      </p>

      <div className="national-bgv-card__fields">
        {/* Payslip (Minimum 3 month) */}
        <div className={`national-bgv-card__field ${validationError.nationalBgvPayslip ? "national-bgv-card__field--error" : ""}`}>
          <label className="national-bgv-card__label">
            <FileText size={16} />
            Payslip (Minimum 3 months) <span className="national-bgv-card__required">*</span>
          </label>
          <div className="national-bgv-card__radioGroup">
            <label
              className={`national-bgv-card__radioLabel ${payslipChecked === "Yes" ? "national-bgv-card__radioLabel--selected" : ""}`}
            >
              <input
                type="radio"
                name="payslipChecked"
                value="Yes"
                checked={payslipChecked === "Yes"}
                onChange={() => onChangePayslipChecked("Yes")}
                disabled={isReadOnly}
              />
              Yes
            </label>
            <label
              className={`national-bgv-card__radioLabel ${payslipChecked === "No" ? "national-bgv-card__radioLabel--selected" : ""}`}
            >
              <input
                type="radio"
                name="payslipChecked"
                value="No"
                checked={payslipChecked === "No"}
                onChange={() => onChangePayslipChecked("No")}
                disabled={isReadOnly}
              />
              No
            </label>
          </div>
          {validationError.nationalBgvPayslip && (
            <span className="national-bgv-card__error-msg">
              <AlertCircle size={12} />
              Payslip checklist confirmation is required.
            </span>
          )}
        </div>

        {payslipChecked === "Yes" && (
        <div className={`national-bgv-card__field ${validationError.nationalBgvBankStatement ? "national-bgv-card__field--error" : ""}`}>
          <label className="national-bgv-card__label">
            <Landmark size={16} />
            Bank Statement (Minimum 6 months) <span className="national-bgv-card__required">*</span>
          </label>
          <div className="national-bgv-card__radioGroup">
            <label
              className={`national-bgv-card__radioLabel ${bankStatementChecked === "Yes" ? "national-bgv-card__radioLabel--selected" : ""}`}
            >
              <input
                type="radio"
                name="bankStatementChecked"
                value="Yes"
                checked={bankStatementChecked === "Yes"}
                onChange={() => onChangeBankStatementChecked("Yes")}
                disabled={isReadOnly}
              />
              Yes
            </label>
            <label
              className={`national-bgv-card__radioLabel ${bankStatementChecked === "No" ? "national-bgv-card__radioLabel--selected" : ""}`}
            >
              <input
                type="radio"
                name="bankStatementChecked"
                value="No"
                checked={bankStatementChecked === "No"}
                onChange={() => onChangeBankStatementChecked("No")}
                disabled={isReadOnly}
              />
              No
            </label>
          </div>
          {validationError.nationalBgvBankStatement && (
            <span className="national-bgv-card__error-msg">
              <AlertCircle size={12} />
              Bank statement checklist confirmation is required.
            </span>
          )}
        </div>
        )}

        {(payslipChecked === "No" || bankStatementChecked === "No") && (
          <div className="national-bgv-card__field national-bgv-card__field--full" style={{ padding: 0, background: "none", border: "none" }}>
            <COICard
              consultOptions={consultOptions}
              isReadOnly={isReadOnly}
              hasError={showCoiErrors}
              onChange={onCoiChange}
              LabelName={"Verified the Payslip and Bank Statement"}
            />
          </div>
        )}

        {/* Verified by the HR checkbox */}
        {/* <div
          className={`national-bgv-card__verifyContainer national-bgv-card__field national-bgv-card__field--full ${
            validationError.nationalBgvVerified ? "national-bgv-card__field--error" : ""
          }`}
        >
          <div className="national-bgv-card__verifyText">
            <span className="national-bgv-card__verifyTitle">
              Verified the Payslip and Bank Statement
            </span>
            <span className="national-bgv-card__verifySubtitle">
              I confirm that I have reviewed and verified the candidate's payslip and bank statement.
            </span>
          </div>

          <label className="national-bgv-card__verifySwitch">
            <input
              type="checkbox"
              checked={verifiedByHR}
              onChange={(e) => onChangeVerifiedByHR(e.target.checked)}
              disabled={isReadOnly}
            />
            <span className="national-bgv-card__slider" />
          </label>
        </div>
        {validationError.nationalBgvVerified && (
          <div className="national-bgv-card__field" style={{ border: "none", background: "none", padding: 0, marginTop: -12 }}>
            <span className="national-bgv-card__error-msg">
              <AlertCircle size={12} />
              You must confirm the verification before submitting.
            </span>
          </div>
        )} */}
      </div>
    </div>
    </div>
   
  );
};

export default NationalBGVProcess;
