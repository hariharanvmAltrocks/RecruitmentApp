"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NationalBGVProcess = void 0;
var tslib_1 = require("tslib");
// NationalBGVProcess.tsx
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var Coicard_1 = tslib_1.__importDefault(require("../Coicard/Coicard"));
var NationalBGVProcess = function (_a) {
    var payslipChecked = _a.payslipChecked, bankStatementChecked = _a.bankStatementChecked, verifiedByHR = _a.verifiedByHR, validationError = _a.validationError, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b, coiState = _a.coiState, showCoiErrors = _a.showCoiErrors, onCoiChange = _a.onCoiChange, consultOptions = _a.consultOptions, onChangePayslipChecked = _a.onChangePayslipChecked, onChangeBankStatementChecked = _a.onChangeBankStatementChecked, onChangeVerifiedByHR = _a.onChangeVerifiedByHR;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "national-bgv-card" },
            react_1.default.createElement("div", { className: "national-bgv-card__titleRow" },
                react_1.default.createElement("div", { className: "national-bgv-card__titleIcon" },
                    react_1.default.createElement(lucide_react_1.ShieldCheck, { size: 20 })),
                react_1.default.createElement("h2", { className: "national-bgv-card__title" }, "National Payslips Verification ")),
            react_1.default.createElement("p", { className: "national-bgv-card__description" }, "Please review and verify the candidate's 3 months of payslips and last 6 months of bank statements. After completing the verification, select \"Yes\" if the information is verified; otherwise, select \"No\"."),
            react_1.default.createElement("div", { className: "national-bgv-card__fields" },
                react_1.default.createElement("div", { className: "national-bgv-card__field ".concat(validationError.nationalBgvPayslip ? "national-bgv-card__field--error" : "") },
                    react_1.default.createElement("label", { className: "national-bgv-card__label" },
                        react_1.default.createElement(lucide_react_1.FileText, { size: 16 }),
                        "Payslip (Minimum 3 months) ",
                        react_1.default.createElement("span", { className: "national-bgv-card__required" }, "*")),
                    react_1.default.createElement("div", { className: "national-bgv-card__radioGroup" },
                        react_1.default.createElement("label", { className: "national-bgv-card__radioLabel ".concat(payslipChecked === "Yes" ? "national-bgv-card__radioLabel--selected" : "") },
                            react_1.default.createElement("input", { type: "radio", name: "payslipChecked", value: "Yes", checked: payslipChecked === "Yes", onChange: function () { return onChangePayslipChecked("Yes"); }, disabled: isReadOnly }),
                            "Yes"),
                        react_1.default.createElement("label", { className: "national-bgv-card__radioLabel ".concat(payslipChecked === "No" ? "national-bgv-card__radioLabel--selected" : "") },
                            react_1.default.createElement("input", { type: "radio", name: "payslipChecked", value: "No", checked: payslipChecked === "No", onChange: function () { return onChangePayslipChecked("No"); }, disabled: isReadOnly }),
                            "No")),
                    validationError.nationalBgvPayslip && (react_1.default.createElement("span", { className: "national-bgv-card__error-msg" },
                        react_1.default.createElement(lucide_react_1.AlertCircle, { size: 12 }),
                        "Payslip checklist confirmation is required."))),
                payslipChecked === "Yes" && (react_1.default.createElement("div", { className: "national-bgv-card__field ".concat(validationError.nationalBgvBankStatement ? "national-bgv-card__field--error" : "") },
                    react_1.default.createElement("label", { className: "national-bgv-card__label" },
                        react_1.default.createElement(lucide_react_1.Landmark, { size: 16 }),
                        "Bank Statement (Minimum 6 months) ",
                        react_1.default.createElement("span", { className: "national-bgv-card__required" }, "*")),
                    react_1.default.createElement("div", { className: "national-bgv-card__radioGroup" },
                        react_1.default.createElement("label", { className: "national-bgv-card__radioLabel ".concat(bankStatementChecked === "Yes" ? "national-bgv-card__radioLabel--selected" : "") },
                            react_1.default.createElement("input", { type: "radio", name: "bankStatementChecked", value: "Yes", checked: bankStatementChecked === "Yes", onChange: function () { return onChangeBankStatementChecked("Yes"); }, disabled: isReadOnly }),
                            "Yes"),
                        react_1.default.createElement("label", { className: "national-bgv-card__radioLabel ".concat(bankStatementChecked === "No" ? "national-bgv-card__radioLabel--selected" : "") },
                            react_1.default.createElement("input", { type: "radio", name: "bankStatementChecked", value: "No", checked: bankStatementChecked === "No", onChange: function () { return onChangeBankStatementChecked("No"); }, disabled: isReadOnly }),
                            "No")),
                    validationError.nationalBgvBankStatement && (react_1.default.createElement("span", { className: "national-bgv-card__error-msg" },
                        react_1.default.createElement(lucide_react_1.AlertCircle, { size: 12 }),
                        "Bank statement checklist confirmation is required.")))),
                (payslipChecked === "No" || bankStatementChecked === "No") && (react_1.default.createElement("div", { className: "national-bgv-card__field national-bgv-card__field--full", style: { padding: 0, background: "none", border: "none" } },
                    react_1.default.createElement(Coicard_1.default, { consultOptions: consultOptions, isReadOnly: isReadOnly, hasError: showCoiErrors, onChange: onCoiChange, LabelName: "Verified the Payslip and Bank Statement" })))))));
};
exports.NationalBGVProcess = NationalBGVProcess;
exports.default = exports.NationalBGVProcess;
//# sourceMappingURL=NationalBGVProcess.js.map