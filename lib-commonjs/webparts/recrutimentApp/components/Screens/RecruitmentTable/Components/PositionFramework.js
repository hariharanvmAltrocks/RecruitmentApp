"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionFramework = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("../RecruitmentTable.scss");
var moment_1 = tslib_1.__importDefault(require("moment"));
var InfoField = function (_a) {
    var label = _a.label, value = _a.value, Icon = _a.icon;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__info-field" },
        react_1.default.createElement("div", { className: "advert-review-drawer__info-label" },
            Icon && react_1.default.createElement(Icon, { size: 12 }),
            react_1.default.createElement("span", null, label)),
        react_1.default.createElement("div", { className: "advert-review-drawer__info-value" }, value !== null && value !== void 0 ? value : "-")));
};
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var PositionFramework = function (_a) {
    var positionDetails = _a.positionDetails, isLoading = _a.isLoading, headerCode = _a.headerCode;
    return (react_1.default.createElement("section", { className: "advert-review-drawer__section advert-review-drawer__section--frame" },
        react_1.default.createElement("div", { className: "advert-review-drawer__section-header" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement("span", { className: "advert-review-drawer__section-indicator" }),
                "Position Framework"),
            react_1.default.createElement("span", { className: "advert-review-drawer__ref" },
                "REF: ",
                headerCode || "-")),
        isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__grid" }, Array.from({ length: 8 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "skeleton-".concat(idx), className: "advert-review-drawer__info-field" },
            react_1.default.createElement(SkeletonBlock, { width: "120px" }),
            react_1.default.createElement(SkeletonBlock, { width: "180px" }))); }))) : (react_1.default.createElement("div", { className: "advert-review-drawer__group" },
            react_1.default.createElement("h4", { className: "advert-review-drawer__group-title" },
                react_1.default.createElement(lucide_react_1.Users, { size: 12 }),
                "Organizational Alignment"),
            react_1.default.createElement("div", { className: "advert-review-drawer__grid" },
                react_1.default.createElement(InfoField, { label: "BU Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.buCode, icon: lucide_react_1.FileText }),
                react_1.default.createElement(InfoField, { label: "Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.department, icon: lucide_react_1.Users }),
                react_1.default.createElement(InfoField, { label: "Sub Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.subDepartment, icon: lucide_react_1.ChevronRight }),
                react_1.default.createElement(InfoField, { label: "Section", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.section, icon: lucide_react_1.ChevronRight }),
                react_1.default.createElement(InfoField, { label: "Dept Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.deptCode, icon: lucide_react_1.FileText }),
                react_1.default.createElement(InfoField, { label: "Reports To", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.reportsTo, icon: lucide_react_1.UserCheck }),
                react_1.default.createElement(InfoField, { label: "Area of Work", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.areaOfWork, icon: lucide_react_1.Globe })),
            react_1.default.createElement("div", { className: "advert-review-drawer__divider" }),
            react_1.default.createElement("h4", { className: "advert-review-drawer__group-title" },
                react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                "Position Classification"),
            react_1.default.createElement("div", { className: "advert-review-drawer__grid" },
                react_1.default.createElement(InfoField, { label: "Nationality", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.nationality, icon: lucide_react_1.Globe }),
                react_1.default.createElement(InfoField, { label: "Paterson Grade", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.patersonGrade, icon: lucide_react_1.Activity }),
                react_1.default.createElement(InfoField, { label: "DRC Grade", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.drcGrade, icon: lucide_react_1.Activity }),
                react_1.default.createElement(InfoField, { label: "Employment Category", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.employmentCategory, icon: lucide_react_1.UserCheck }),
                react_1.default.createElement(InfoField, { label: "Type of Contract", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.contractType, icon: lucide_react_1.FileCheck }),
                react_1.default.createElement(InfoField, { label: "No of Person(s)", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.numberOfPersons, icon: lucide_react_1.Users }),
                react_1.default.createElement(InfoField, { label: "Date Required", value: (0, moment_1.default)(positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.dateRequired).format("DD-MM-YYYY"), icon: lucide_react_1.Calendar }))))));
};
exports.PositionFramework = PositionFramework;
//# sourceMappingURL=PositionFramework.js.map