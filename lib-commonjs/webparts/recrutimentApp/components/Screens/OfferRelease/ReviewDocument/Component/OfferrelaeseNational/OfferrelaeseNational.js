"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferrelaeseNational = void 0;
var tslib_1 = require("tslib");
// OfferrelaeseNational.tsx
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("./OfferrelaeseNational.scss");
var Config_1 = require("../../../../../../utilities/Config");
// ─── Custom SVG Icons for PPE Items ──────────────────────────────────────────
var PantsIcon = function () { return (react_1.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "#f97316", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M4 2v4a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V2" }),
    react_1.default.createElement("path", { d: "M6 9v13h4v-7h4v7h4V9" }))); };
var ShirtIcon = function () { return (react_1.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "#f97316", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M20.38 3.46L16 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3L3.62 3.46a1 1 0 0 0-1.34.3l-2 3.5a1 1 0 0 0 .3 1.34L5 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9l4.42-2.74a1 1 0 0 0 .3-1.34l-2-3.5a1 1 0 0 0-1.34-.3zM15 20H9v-6h6z" }))); };
var ShoesIcon = function () { return (react_1.default.createElement("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "#475569", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M3 12h1v8H3zM4 20h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-4L6 12H4z" }))); };
var OfferrelaeseNational = function (_a) {
    var offerReleased = _a.offerReleased, 
    // offerAccepted,
    noticePeriod = _a.noticePeriod, joiningDate = _a.joiningDate, pantsSize = _a.pantsSize, topSize = _a.topSize, shoesSize = _a.shoesSize, contractReleased = _a.contractReleased, 
    // contractAccepted,
    validationError = _a.validationError, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b, StatusID = _a.StatusID, onChangeOfferReleased = _a.onChangeOfferReleased, 
    // onChangeOfferAccepted,
    onChangeNoticePeriod = _a.onChangeNoticePeriod, onChangeJoiningDate = _a.onChangeJoiningDate, onChangePantsSize = _a.onChangePantsSize, onChangeTopSize = _a.onChangeTopSize, onChangeShoesSize = _a.onChangeShoesSize, onChangeContractReleased = _a.onChangeContractReleased;
    var PANTS_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42"];
    var TOP_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];
    var SHOES_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12"];
    var getMinJoiningDate = function () {
        var today = new Date();
        var days = parseInt(noticePeriod, 10);
        if (!isNaN(days) && days > 0) {
            today.setDate(today.getDate() + days);
        }
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var dd = String(today.getDate()).padStart(2, "0");
        return "".concat(yyyy, "-").concat(mm, "-").concat(dd);
    };
    return (react_1.default.createElement("div", { className: "national-offer-card" },
        react_1.default.createElement("div", { className: "national-offer-card__titleRow" },
            react_1.default.createElement("span", { className: "national-offer-card__titleBar" }),
            react_1.default.createElement("h2", { className: "national-offer-card__title" }, StatusID === Config_1.StatusId.HROfferLetterProgress ? "National Offer Release & PPE Details" : "National Employment contract Release")),
        react_1.default.createElement("div", { className: "national-offer-card__fields" },
            StatusID === Config_1.StatusId.HROfferLetterProgress && (react_1.default.createElement("div", { className: "national-offer-card__field national-offer-card__field--full ".concat(validationError.nationalOfferReleased ? "national-offer-card__field--error" : "") },
                react_1.default.createElement("label", { className: "national-offer-card__label" },
                    "Has the offer letter been released, and has the candidate accepted it? ",
                    react_1.default.createElement("span", { className: "national-offer-card__required" }, "*")),
                react_1.default.createElement("div", { className: "national-offer-card__radio-group-border" },
                    react_1.default.createElement("div", { className: "national-offer-card__radio-options" },
                        react_1.default.createElement("label", { className: "national-offer-card__radio-label" },
                            react_1.default.createElement("input", { type: "radio", name: "offerReleased", value: "Yes", checked: offerReleased === "Yes", onChange: function () {
                                    onChangeOfferReleased("Yes");
                                }, disabled: isReadOnly }),
                            react_1.default.createElement("span", { className: "national-offer-card__radio-custom" }),
                            react_1.default.createElement("span", null, "Yes")),
                        react_1.default.createElement("label", { className: "national-offer-card__radio-label" },
                            react_1.default.createElement("input", { type: "radio", name: "offerReleased", value: "No", checked: offerReleased === "No", onChange: function () {
                                    onChangeOfferReleased("No");
                                    // onChangeOfferAccepted("");
                                    onChangeNoticePeriod("");
                                    onChangeJoiningDate("");
                                    onChangePantsSize("");
                                    onChangeTopSize("");
                                    onChangeShoesSize("");
                                }, disabled: isReadOnly }),
                            react_1.default.createElement("span", { className: "national-offer-card__radio-custom" }),
                            react_1.default.createElement("span", null, "No")))),
                validationError.nationalOfferReleased && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "This field is required.")))),
            offerReleased === "Yes" && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "national-offer-card__field ".concat(validationError.nationalNoticePeriod ? "national-offer-card__field--error" : "") },
                    react_1.default.createElement("label", { className: "national-offer-card__label" },
                        "Notice period Days of candidate ",
                        react_1.default.createElement("span", { className: "national-offer-card__required" }, "*")),
                    react_1.default.createElement("input", { type: "number", className: "national-offer-card__input", placeholder: "Enter notice period days", value: noticePeriod, onChange: function (e) { return onChangeNoticePeriod(e.target.value); }, disabled: isReadOnly }),
                    validationError.nationalNoticePeriod && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "Notice period is required."))),
                react_1.default.createElement("div", { className: "national-offer-card__field ".concat(validationError.nationalJoiningDate ? "national-offer-card__field--error" : "") },
                    react_1.default.createElement("label", { className: "national-offer-card__label" },
                        "Tentative Joining Date of candidate ",
                        react_1.default.createElement("span", { className: "national-offer-card__required" }, "*")),
                    react_1.default.createElement("input", { type: "date", className: "national-offer-card__input", value: joiningDate, onChange: function (e) { return onChangeJoiningDate(e.target.value); }, disabled: isReadOnly, min: getMinJoiningDate() }),
                    validationError.nationalJoiningDate && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "Joining date is required."))),
                react_1.default.createElement("div", { className: "national-offer-card__field national-offer-card__field--full" },
                    react_1.default.createElement("div", { className: "national-offer-card__ppe-section" },
                        react_1.default.createElement("h4", { className: "national-offer-card__ppe-title" }, "Please provide your Personal Protective Equipment sizing information"),
                        react_1.default.createElement("div", { className: "national-offer-card__ppe-row" },
                            react_1.default.createElement("div", { className: "national-offer-card__ppe-header" },
                                react_1.default.createElement(PantsIcon, null),
                                react_1.default.createElement("span", { className: "national-offer-card__ppe-name" }, "Cont. Suit Pants"),
                                react_1.default.createElement("button", { type: "button", className: "national-offer-card__ppe-chart-link", title: "Size chart" },
                                    react_1.default.createElement(lucide_react_1.Image, { size: 16 }))),
                            react_1.default.createElement("div", { className: validationError.nationalPantsSize ? "national-offer-card__size-strip-border" : "" },
                                react_1.default.createElement("div", { className: "national-offer-card__size-strip" }, PANTS_SIZES.map(function (size) { return (react_1.default.createElement("button", { key: size, type: "button", className: "national-offer-card__size-btn ".concat(pantsSize === size ? "national-offer-card__size-btn--selected" : ""), onClick: function () { return onChangePantsSize(size); }, disabled: isReadOnly }, size)); }))),
                            validationError.nationalPantsSize && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "Please select a pants size."))),
                        react_1.default.createElement("div", { className: "national-offer-card__ppe-row" },
                            react_1.default.createElement("div", { className: "national-offer-card__ppe-header" },
                                react_1.default.createElement(ShirtIcon, null),
                                react_1.default.createElement("span", { className: "national-offer-card__ppe-name" }, "Cont. Suit Top"),
                                react_1.default.createElement("button", { type: "button", className: "national-offer-card__ppe-chart-link", title: "Size chart" },
                                    react_1.default.createElement(lucide_react_1.Image, { size: 16 }))),
                            react_1.default.createElement("div", { className: validationError.nationalTopSize ? "national-offer-card__size-strip-border" : "" },
                                react_1.default.createElement("div", { className: "national-offer-card__size-strip" }, TOP_SIZES.map(function (size) { return (react_1.default.createElement("button", { key: size, type: "button", className: "national-offer-card__size-btn ".concat(topSize === size ? "national-offer-card__size-btn--selected" : ""), onClick: function () { return onChangeTopSize(size); }, disabled: isReadOnly }, size)); }))),
                            validationError.nationalTopSize && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "Please select a top size."))),
                        react_1.default.createElement("div", { className: "national-offer-card__ppe-row" },
                            react_1.default.createElement("div", { className: "national-offer-card__ppe-header" },
                                react_1.default.createElement(ShoesIcon, null),
                                react_1.default.createElement("span", { className: "national-offer-card__ppe-name" }, "Safety Shoes"),
                                react_1.default.createElement("button", { type: "button", className: "national-offer-card__ppe-chart-link", title: "Size chart" },
                                    react_1.default.createElement(lucide_react_1.Image, { size: 16 }))),
                            react_1.default.createElement("div", { className: validationError.nationalShoesSize ? "national-offer-card__size-strip-border" : "" },
                                react_1.default.createElement("div", { className: "national-offer-card__size-strip" }, SHOES_SIZES.map(function (size) { return (react_1.default.createElement("button", { key: size, type: "button", className: "national-offer-card__size-btn ".concat(shoesSize === size ? "national-offer-card__size-btn--selected" : ""), onClick: function () { return onChangeShoesSize(size); }, disabled: isReadOnly }, size)); }))),
                            validationError.nationalShoesSize && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "Please select a shoes size."))))))),
            StatusID === Config_1.StatusId.HREmploymentContractProgress && (react_1.default.createElement("div", { className: "national-offer-card__field national-offer-card__field--full ".concat(validationError.nationalContractReleased ? "national-offer-card__field--error" : "") },
                react_1.default.createElement("label", { className: "national-offer-card__label" },
                    "Has the candidate received and accepted the employment contract?",
                    react_1.default.createElement("span", { className: "national-offer-card__required" }, "*")),
                react_1.default.createElement("div", { className: "national-offer-card__radio-group-border" },
                    react_1.default.createElement("div", { className: "national-offer-card__radio-options" },
                        react_1.default.createElement("label", { className: "national-offer-card__radio-label" },
                            react_1.default.createElement("input", { type: "radio", name: "contractReleased", value: "Yes", checked: contractReleased === "Yes", onChange: function () { return onChangeContractReleased("Yes"); }, disabled: isReadOnly }),
                            react_1.default.createElement("span", { className: "national-offer-card__radio-custom" }),
                            react_1.default.createElement("span", null, "Yes")),
                        react_1.default.createElement("label", { className: "national-offer-card__radio-label" },
                            react_1.default.createElement("input", { type: "radio", name: "contractReleased", value: "No", checked: contractReleased === "No", onChange: function () {
                                    onChangeContractReleased("No");
                                    // onChangeContractAccepted("");
                                }, disabled: isReadOnly }),
                            react_1.default.createElement("span", { className: "national-offer-card__radio-custom" }),
                            react_1.default.createElement("span", null, "No")))),
                validationError.nationalContractReleased && (react_1.default.createElement("span", { className: "national-offer-card__error-msg" }, "This field is required.")))
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
            ))));
};
exports.OfferrelaeseNational = OfferrelaeseNational;
exports.default = exports.OfferrelaeseNational;
//# sourceMappingURL=OfferrelaeseNational.js.map