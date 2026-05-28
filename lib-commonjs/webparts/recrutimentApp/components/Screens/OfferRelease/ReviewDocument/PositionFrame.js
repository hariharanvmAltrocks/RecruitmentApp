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
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
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
    { kit: strings.ContSuitPants, size: "36" },
    { kit: strings.ContSuitTop, size: "XL" },
    { kit: strings.SafetyShoes, size: "7" },
];
var PositionFrame = function (_a) {
    var _b;
    var positionDetails = _a.positionDetails, isLoading = _a.isLoading, headerCode = _a.headerCode;
    return (react_1.default.createElement("section", { className: "review-document__section review-document__section--frame" },
        react_1.default.createElement("div", { className: "review-document__section-header" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement("span", { className: "review-document__section-indicator" }),
                strings.PositionFramework)),
        isLoading ? (react_1.default.createElement("div", { className: "review-document__grid" }, Array.from({ length: 8 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "skeleton-".concat(idx), className: "review-document__info-field" },
            react_1.default.createElement(SkeletonBlock, { width: "120px" }),
            react_1.default.createElement(SkeletonBlock, { width: "180px" }))); }))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "review-document__group" },
                react_1.default.createElement("h4", { className: "review-document__group-title" },
                    react_1.default.createElement(lucide_react_1.Users, { size: 12 }),
                    strings.OrganizationalAlignment),
                react_1.default.createElement("div", { className: "review-document__grid" },
                    react_1.default.createElement(InfoField, { label: strings.ApplicantName, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ApplicantName, icon: lucide_react_1.FileText }),
                    react_1.default.createElement(InfoField, { label: strings.Nationality, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: strings.Gender, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Gender, icon: lucide_react_1.LayoutDashboard }),
                    react_1.default.createElement(InfoField, { label: strings.ProofOfIdentity, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProofOfIdentity, icon: lucide_react_1.ChevronRight }),
                    react_1.default.createElement(InfoField, { label: strings.IdentityNumber, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.IdentityNumber, icon: lucide_react_1.ChevronRight }),
                    react_1.default.createElement(InfoField, { label: strings.Email, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Email, icon: lucide_react_1.FileText }),
                    react_1.default.createElement(InfoField, { label: strings.Location, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Location, icon: lucide_react_1.UserCheck })),
                react_1.default.createElement("div", { className: "review-document__divider" }),
                react_1.default.createElement("h4", { className: "review-document__group-title" },
                    react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                    strings.PositionClassification),
                react_1.default.createElement("div", { className: "review-document__grid" },
                    react_1.default.createElement(InfoField, { label: strings.BusinessUnitCode, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCode, icon: lucide_react_1.Globe }),
                    react_1.default.createElement(InfoField, { label: strings.Department, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department, icon: lucide_react_1.Activity }),
                    react_1.default.createElement(InfoField, { label: strings.SubDepartment, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.SubDepartment, icon: lucide_react_1.Activity }),
                    react_1.default.createElement(InfoField, { label: strings.Section, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Section, icon: lucide_react_1.UserCheck }),
                    react_1.default.createElement(InfoField, { label: strings.DepartmentCode, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentCode, icon: lucide_react_1.FileCheck }),
                    react_1.default.createElement(InfoField, { label: strings.EmploymentCategory, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: strings.TypeOfContract, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.TypeofContract, icon: lucide_react_1.Users }),
                    react_1.default.createElement(InfoField, { label: strings.AreaOfWork, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AreaofWork, icon: lucide_react_1.Users }),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.labourHire) != null &&
                        positionDetails.labourHire !== "" && (react_1.default.createElement(InfoField, { label: strings.LabourHire, value: positionDetails.labourHire, icon: lucide_react_1.Users })),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JoiningDate) && (react_1.default.createElement(InfoField, { label: strings.JoiningDate, value: (0, moment_1.default)(positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JoiningDate).format("DD-MM-YYYY"), icon: lucide_react_1.Users })),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NoticePeriod) && (react_1.default.createElement(InfoField, { label: strings.NoticePeriod, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NoticePeriod, icon: lucide_react_1.Users }))),
                (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceName) && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("h4", { className: "review-document__group-title" },
                        react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                        strings.ReferenceEmployerDetails),
                    react_1.default.createElement("div", { className: "review-document__grid" },
                        react_1.default.createElement(InfoField, { label: strings.ReferenceName, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceName, icon: lucide_react_1.Globe }),
                        react_1.default.createElement(InfoField, { label: strings.ReferenceDesignation, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceDesignation, icon: lucide_react_1.Activity }),
                        react_1.default.createElement(InfoField, { label: strings.ReferenceEmailId, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceEmail, icon: lucide_react_1.Activity }),
                        react_1.default.createElement(InfoField, { label: strings.ReferenceContactNumber, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferencePhone, icon: lucide_react_1.UserCheck }),
                        react_1.default.createElement(InfoField, { label: strings.ReferenceCompanyName, value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ReferenceCompanyName, icon: lucide_react_1.FileCheck }))))),
            positionDetails && ((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.PPEItems) === null || _b === void 0 ? void 0 : _b.length) > 0 && (react_1.default.createElement(Ppesizinginfo_1.PPESizingTagStrip, { items: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.PPEItems }))))));
};
exports.PositionFrame = PositionFrame;
//# sourceMappingURL=PositionFrame.js.map