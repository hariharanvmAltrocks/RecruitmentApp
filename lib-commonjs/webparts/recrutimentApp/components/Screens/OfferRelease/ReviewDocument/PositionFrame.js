"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionFrame = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("../OfferTable.scss");
require("./ReviewDocument.scss");
var moment_1 = tslib_1.__importDefault(require("moment"));
var Ppesizinginfo_1 = require("./Component/Ppesizinginfo/Ppesizinginfo");
var InfoField = function (_a) {
    var label = _a.label, value = _a.value, Icon = _a.icon;
    var displayValue = value != null ? String(value) : "-";
    return (react_1.default.createElement("div", { className: "review-document__info-field" },
        react_1.default.createElement("div", { className: "review-document__info-label", title: label },
            Icon && react_1.default.createElement(Icon, { size: 12 }),
            react_1.default.createElement("span", null, label)),
        react_1.default.createElement("div", { className: "review-document__info-value", title: displayValue }, displayValue)));
};
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return react_1.default.createElement("div", { className: "review-document__skeleton", style: { width: width, height: height } });
};
var SAMPLE_ITEMS = [
    { kit: "Cont. Suit Pants", size: "36" },
    { kit: "Cont. Suit Top", size: "XL" },
    { kit: "Safety Shoes", size: "7" },
];
var PositionFrame = function (_a) {
    var _b;
    var positionDetails = _a.positionDetails, isLoading = _a.isLoading, headerCode = _a.headerCode;
    return (react_1.default.createElement("section", { className: "review-document__section review-document__section--frame" },
        react_1.default.createElement("div", { className: "review-document__section-header" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement("span", { className: "review-document__section-indicator" }),
                "Position Framework")),
        isLoading ? (react_1.default.createElement("div", { className: "review-document__grid" }, Array.from({ length: 8 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "skeleton-".concat(idx), className: "review-document__info-field" },
            react_1.default.createElement(SkeletonBlock, { width: "120px" }),
            react_1.default.createElement(SkeletonBlock, { width: "180px" }))); }))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "review-document__group" },
                react_1.default.createElement("h4", { className: "review-document__group-title" },
                    react_1.default.createElement(lucide_react_1.Users, { size: 12 }),
                    "Organizational Alignment"),
                react_1.default.createElement("div", { className: "review-document__grid" },
                    react_1.default.createElement(InfoField, { label: "Applicant Name", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ApplicantName, icon: lucide_react_1.FileText }),
                    react_1.default.createElement(InfoField, { label: "Nationality", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: "Gender", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Gender, icon: lucide_react_1.LayoutDashboard }),
                    react_1.default.createElement(InfoField, { label: "Proof Of Identity", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProofOfIdentity, icon: lucide_react_1.ChevronRight }),
                    react_1.default.createElement(InfoField, { label: "Identity Number", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.IdentityNumber, icon: lucide_react_1.ChevronRight }),
                    react_1.default.createElement(InfoField, { label: "Email", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Email, icon: lucide_react_1.FileText }),
                    react_1.default.createElement(InfoField, { label: "Location", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Location, icon: lucide_react_1.UserCheck })),
                react_1.default.createElement("div", { className: "review-document__divider" }),
                react_1.default.createElement("h4", { className: "review-document__group-title" },
                    react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                    "Position Classification"),
                react_1.default.createElement("div", { className: "review-document__grid" },
                    react_1.default.createElement(InfoField, { label: "Business Unit Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCode, icon: lucide_react_1.Globe }),
                    react_1.default.createElement(InfoField, { label: "Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department, icon: lucide_react_1.Activity }),
                    react_1.default.createElement(InfoField, { label: "Sub Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.SubDepartment, icon: lucide_react_1.Activity }),
                    react_1.default.createElement(InfoField, { label: "Section", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Section, icon: lucide_react_1.UserCheck }),
                    react_1.default.createElement(InfoField, { label: "Department Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentCode, icon: lucide_react_1.FileCheck }),
                    react_1.default.createElement(InfoField, { label: "Employment Category", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: "Type of Contract", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.TypeofContract, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: "Area of Work", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AreaofWork, icon: lucide_react_1.Users }),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.labourHire) && (react_1.default.createElement(InfoField, { label: "Labour Hire", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.labourHire, icon: lucide_react_1.Users })),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JoiningDate) && (react_1.default.createElement(InfoField, { label: "Joining Date", value: (0, moment_1.default)(positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JoiningDate).format("DD-MM-YYYY"), icon: lucide_react_1.Users })),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NoticePeriod) && (react_1.default.createElement(InfoField, { label: "Notice Period", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NoticePeriod, icon: lucide_react_1.Users }))),
                (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceName) && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("h4", { className: "review-document__group-title" },
                        react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                        "Reference Employer Details"),
                    react_1.default.createElement("div", { className: "review-document__grid" },
                        react_1.default.createElement(InfoField, { label: "Reference Name", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceName, icon: lucide_react_1.Globe }),
                        react_1.default.createElement(InfoField, { label: "Reference Designation", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceDesignation, icon: lucide_react_1.Activity }),
                        react_1.default.createElement(InfoField, { label: "Reference Email ID", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceEmail, icon: lucide_react_1.Activity }),
                        react_1.default.createElement(InfoField, { label: "Reference Contact Number", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferencePhone, icon: lucide_react_1.UserCheck }),
                        react_1.default.createElement(InfoField, { label: "Reference Company Name", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceCompanyName, icon: lucide_react_1.FileCheck }))))),
            positionDetails && ((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.PPEItems) === null || _b === void 0 ? void 0 : _b.length) > 0 && (react_1.default.createElement(Ppesizinginfo_1.PPESizingTagStrip, { items: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.PPEItems }))))));
};
exports.PositionFrame = PositionFrame;
//# sourceMappingURL=PositionFrame.js.map