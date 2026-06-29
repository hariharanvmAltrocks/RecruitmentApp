// OfferrelaeseNational.tsx
import React from "react";
import { AlertTriangle, Image as ImageIcon } from "lucide-react";
import "./OfferrelaeseNational.scss";
import { ValidationError } from "../../StateManage/useReviewDocumentManage";
import { StatusId } from "../../../../../../utilities/Config";

// ─── Custom SVG Icons for PPE Items ──────────────────────────────────────────
const PantsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V2" />
    <path d="M6 9v13h4v-7h4v7h4V9" />
  </svg>
);

const ShirtIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3L3.62 3.46a1 1 0 0 0-1.34.3l-2 3.5a1 1 0 0 0 .3 1.34L5 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l4.42-2.74a1 1 0 0 0 .3-1.34l-2-3.5a1 1 0 0 0-1.34-.3zM15 20H9v-6h6z" />
  </svg>
);

const ShoesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h1v8H3zM4 20h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-4L6 12H4z" />
  </svg>
);

export interface OfferrelaeseNationalProps {
  offerReleased: string;
  // offerAccepted: string;
  noticePeriod: string;
  joiningDate: string;
  pantsSize: string;
  topSize: string;
  shoesSize: string;
  contractReleased: string;
  // contractAccepted: string;
  validationError: ValidationError;
  isReadOnly?: boolean;
  StatusID: number;

  onChangeOfferReleased: (val: string) => void;
  // onChangeOfferAccepted: (val: string) => void;
  onChangeNoticePeriod: (val: string) => void;
  onChangeJoiningDate: (val: string) => void;
  onChangePantsSize: (val: string) => void;
  onChangeTopSize: (val: string) => void;
  onChangeShoesSize: (val: string) => void;
  onChangeContractReleased: (val: string) => void;
  // onChangeContractAccepted: (val: string) => void;
}

export const OfferrelaeseNational: React.FC<OfferrelaeseNationalProps> = ({
  offerReleased,
  // offerAccepted,
  noticePeriod,
  joiningDate,
  pantsSize,
  topSize,
  shoesSize,
  contractReleased,
  // contractAccepted,
  validationError,
  isReadOnly = false,
  StatusID,

  onChangeOfferReleased,
  // onChangeOfferAccepted,
  onChangeNoticePeriod,
  onChangeJoiningDate,
  onChangePantsSize,
  onChangeTopSize,
  onChangeShoesSize,
  onChangeContractReleased,
  // onChangeContractAccepted,
}) => {
  const PANTS_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42"];
  const TOP_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const SHOES_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12"];

  const getMinJoiningDate = (): string => {
    const today = new Date();
    const days = parseInt(noticePeriod, 10);
    if (!isNaN(days) && days > 0) {
      today.setDate(today.getDate() + days);
    }
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="national-offer-card">
      <div className="national-offer-card__titleRow">
        <span className="national-offer-card__titleBar" />
        <h2 className="national-offer-card__title">{StatusID === StatusId.HROfferLetterProgress ? "National Offer Release & PPE Details": "National Employment contract Release" }</h2>
      </div>


      <div className="national-offer-card__fields">
        {/* Q1: Have you released the offer letter for this candidate */}
         {StatusID === StatusId.HROfferLetterProgress && ( 
  <div className={`national-offer-card__field national-offer-card__field--full ${validationError.nationalOfferReleased ? "national-offer-card__field--error" : ""}`}>
          <label className="national-offer-card__label">
            Has the offer letter been released, and has the candidate accepted it? <span className="national-offer-card__required">*</span>
          </label>
          <div className="national-offer-card__radio-group-border">
            <div className="national-offer-card__radio-options">
              <label className="national-offer-card__radio-label">
                <input
                  type="radio"
                  name="offerReleased"
                  value="Yes"
                  checked={offerReleased === "Yes"}
                  onChange={() => {
                    onChangeOfferReleased("Yes");
                  }}
                  disabled={isReadOnly}
                />
                <span className="national-offer-card__radio-custom" />
                <span>Yes</span>
              </label>
              <label className="national-offer-card__radio-label">
                <input
                  type="radio"
                  name="offerReleased"
                  value="No"
                  checked={offerReleased === "No"}
                  onChange={() => {
                    onChangeOfferReleased("No");
                    // onChangeOfferAccepted("");
                    onChangeNoticePeriod("");
                    onChangeJoiningDate("");
                    onChangePantsSize("");
                    onChangeTopSize("");
                    onChangeShoesSize("");
                  }}
                  disabled={isReadOnly}
                />
                <span className="national-offer-card__radio-custom" />
                <span>No</span>
              </label>
            </div>
          </div>
          {validationError.nationalOfferReleased && (
            <span className="national-offer-card__error-msg">This field is required.</span>
          )}
        </div>
 )}
        

        {/* Q2: Was the offer letter accepted by the candidate (Conditional) */}
        {/* {offerReleased === "Yes" && (
          <div className={`national-offer-card__field national-offer-card__field--full ${validationError.nationalOfferAccepted ? "national-offer-card__field--error" : ""}`}>
            <label className="national-offer-card__label">
              Was the offer letter accepted by the candidate? <span className="national-offer-card__required">*</span>
            </label>
            <div className="national-offer-card__radio-group-border">
              <div className="national-offer-card__radio-options">
                <label className="national-offer-card__radio-label">
                  <input
                    type="radio"
                    name="offerAccepted"
                    value="Yes"
                    checked={offerAccepted === "Yes"}
                    onChange={() => onChangeOfferAccepted("Yes")}
                    disabled={isReadOnly}
                  />
                  <span className="national-offer-card__radio-custom" />
                  <span>Yes</span>
                </label>
                <label className="national-offer-card__radio-label">
                  <input
                    type="radio"
                    name="offerAccepted"
                    value="No"
                    checked={offerAccepted === "No"}
                    onChange={() => {
                      onChangeOfferAccepted("No");
                      onChangeNoticePeriod("");
                      onChangeJoiningDate("");
                      onChangePantsSize("");
                      onChangeTopSize("");
                      onChangeShoesSize("");
                    }}
                    disabled={isReadOnly}
                  />
                  <span className="national-offer-card__radio-custom" />
                  <span>No</span>
                </label>
              </div>
            </div>
            {validationError.nationalOfferAccepted && (
              <span className="national-offer-card__error-msg">This field is required.</span>
            )}
          </div>
        )} */}

        {/* Notice Period and Joining Date (Conditional if Q2 is Yes) */}
        {offerReleased === "Yes" && (
          <>
            <div className={`national-offer-card__field ${validationError.nationalNoticePeriod ? "national-offer-card__field--error" : ""}`}>
              <label className="national-offer-card__label">
                Notice period Days of candidate <span className="national-offer-card__required">*</span>
              </label>
              <input
                type="number"
                className="national-offer-card__input"
                placeholder="Enter notice period days"
                value={noticePeriod}
                onChange={(e) => onChangeNoticePeriod(e.target.value)}
                disabled={isReadOnly}
              />
              {validationError.nationalNoticePeriod && (
                <span className="national-offer-card__error-msg">Notice period is required.</span>
              )}
            </div>

            <div className={`national-offer-card__field ${validationError.nationalJoiningDate ? "national-offer-card__field--error" : ""}`}>
              <label className="national-offer-card__label">
                Tentative Joining Date of candidate <span className="national-offer-card__required">*</span>
              </label>
              <input
                type="date"
                className="national-offer-card__input"
                value={joiningDate}
                onChange={(e) => onChangeJoiningDate(e.target.value)}
                disabled={isReadOnly}
                min={getMinJoiningDate()}
              />
              {validationError.nationalJoiningDate && (
                <span className="national-offer-card__error-msg">Joining date is required.</span>
              )}
            </div>

            {/* PPE Kit sizes */}
            <div className="national-offer-card__field national-offer-card__field--full">
              <div className="national-offer-card__ppe-section">
                <h4 className="national-offer-card__ppe-title">Please provide your Personal Protective Equipment sizing information</h4>

                {/* Cont. Suit Pants */}
                <div className="national-offer-card__ppe-row">
                  <div className="national-offer-card__ppe-header">
                    <PantsIcon />
                    <span className="national-offer-card__ppe-name">Cont. Suit Pants</span>
                    <button type="button" className="national-offer-card__ppe-chart-link" title="Size chart">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  <div className={validationError.nationalPantsSize ? "national-offer-card__size-strip-border" : ""}>
                    <div className="national-offer-card__size-strip">
                      {PANTS_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`national-offer-card__size-btn ${pantsSize === size ? "national-offer-card__size-btn--selected" : ""}`}
                          onClick={() => onChangePantsSize(size)}
                          disabled={isReadOnly}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  {validationError.nationalPantsSize && (
                    <span className="national-offer-card__error-msg">Please select a pants size.</span>
                  )}
                </div>

                {/* Cont. Suit Top */}
                <div className="national-offer-card__ppe-row">
                  <div className="national-offer-card__ppe-header">
                    <ShirtIcon />
                    <span className="national-offer-card__ppe-name">Cont. Suit Top</span>
                    <button type="button" className="national-offer-card__ppe-chart-link" title="Size chart">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  <div className={validationError.nationalTopSize ? "national-offer-card__size-strip-border" : ""}>
                    <div className="national-offer-card__size-strip">
                      {TOP_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`national-offer-card__size-btn ${topSize === size ? "national-offer-card__size-btn--selected" : ""}`}
                          onClick={() => onChangeTopSize(size)}
                          disabled={isReadOnly}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  {validationError.nationalTopSize && (
                    <span className="national-offer-card__error-msg">Please select a top size.</span>
                  )}
                </div>

                {/* Safety Shoes */}
                <div className="national-offer-card__ppe-row">
                  <div className="national-offer-card__ppe-header">
                    <ShoesIcon />
                    <span className="national-offer-card__ppe-name">Safety Shoes</span>
                    <button type="button" className="national-offer-card__ppe-chart-link" title="Size chart">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  <div className={validationError.nationalShoesSize ? "national-offer-card__size-strip-border" : ""}>
                    <div className="national-offer-card__size-strip">
                      {SHOES_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`national-offer-card__size-btn ${shoesSize === size ? "national-offer-card__size-btn--selected" : ""}`}
                          onClick={() => onChangeShoesSize(size)}
                          disabled={isReadOnly}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  {validationError.nationalShoesSize && (
                    <span className="national-offer-card__error-msg">Please select a shoes size.</span>
                  )}
                </div>

                {/* Resignation warning banner */}
                {/* <div className="national-offer-card__warning-note">
                  <AlertTriangle size={18} />
                  <span>Note: Don't Resign until we communicate back to you once the visa process is completed.</span>
                </div> */}
              </div>
            </div>
          </>
        )}
        
        {StatusID === StatusId.HREmploymentContractProgress && (
<div className={`national-offer-card__field national-offer-card__field--full ${validationError.nationalContractReleased ? "national-offer-card__field--error" : ""}`}>
          <label className="national-offer-card__label">
            Has the employment contract been released, and has the candidate accepted it? <span className="national-offer-card__required">*</span>
          </label>
          <div className="national-offer-card__radio-group-border">
            <div className="national-offer-card__radio-options">
              <label className="national-offer-card__radio-label">
                <input
                  type="radio"
                  name="contractReleased"
                  value="Yes"
                  checked={contractReleased === "Yes"}
                  onChange={() => onChangeContractReleased("Yes")}
                  disabled={isReadOnly}
                />
                <span className="national-offer-card__radio-custom" />
                <span>Yes</span>
              </label>
              <label className="national-offer-card__radio-label">
                <input
                  type="radio"
                  name="contractReleased"
                  value="No"
                  checked={contractReleased === "No"}
                  onChange={() => {
                    onChangeContractReleased("No");
                    // onChangeContractAccepted("");
                  }}
                  disabled={isReadOnly}
                />
                <span className="national-offer-card__radio-custom" />
                <span>No</span>
              </label>
            </div>
          </div>
          {validationError.nationalContractReleased && (
            <span className="national-offer-card__error-msg">This field is required.</span>
          )}
        </div>

        // {contractReleased === "Yes" && (
        //   <div className={`national-offer-card__field national-offer-card__field--full ${validationError.nationalContractAccepted ? "national-offer-card__field--error" : ""}`}>
        //     <label className="national-offer-card__label">
        //       Was the employment contract accepted by the candidate? <span className="national-offer-card__required">*</span>
        //     </label>
        //     <div className="national-offer-card__radio-group-border">
        //       <div className="national-offer-card__radio-options">
        //         <label className="national-offer-card__radio-label">
        //           <input
        //             type="radio"
        //             name="contractAccepted"
        //             value="Yes"
        //             checked={contractAccepted === "Yes"}
        //             onChange={() => onChangeContractAccepted("Yes")}
        //             disabled={isReadOnly}
        //           />
        //           <span className="national-offer-card__radio-custom" />
        //           <span>Yes</span>
        //         </label>
        //         <label className="national-offer-card__radio-label">
        //           <input
        //             type="radio"
        //             name="contractAccepted"
        //             value="No"
        //             checked={contractAccepted === "No"}
        //             onChange={() => onChangeContractAccepted("No")}
        //             disabled={isReadOnly}
        //           />
        //           <span className="national-offer-card__radio-custom" />
        //           <span>No</span>
        //         </label>
        //       </div>
        //     </div>
        //     {validationError.nationalContractAccepted && (
        //       <span className="national-offer-card__error-msg">This field is required.</span>
        //     )}
        //   </div>
        // )}
        )}
        
      </div>
    </div>
  );
};

export default OfferrelaeseNational;
