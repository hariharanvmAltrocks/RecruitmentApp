"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertLanguageToggle = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("../RecruitmentTable.scss");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var AdvertLanguageToggle = function (_a) {
    var advertLanguage = _a.advertLanguage, advertContent = _a.advertContent, isLoading = _a.isLoading, onLanguageChange = _a.onLanguageChange;
    var responsibilitiesList = (0, react_1.useMemo)(function () {
        return advertContent === null || advertContent === void 0 ? void 0 : advertContent.responsibilities.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item" },
            react_1.default.createElement("span", { className: "advert-review-drawer__list-dot" }),
            item)); });
    }, [advertContent]);
    var qualificationsList = (0, react_1.useMemo)(function () {
        return advertContent === null || advertContent === void 0 ? void 0 : advertContent.qualifications.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item advert-review-drawer__list-item--muted" },
            react_1.default.createElement("span", { className: "advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" }),
            item)); });
    }, [advertContent]);
    var experienceList = (0, react_1.useMemo)(function () {
        return advertContent === null || advertContent === void 0 ? void 0 : advertContent.experience.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item advert-review-drawer__list-item--muted" },
            react_1.default.createElement("span", { className: "advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" }),
            item)); });
    }, [advertContent]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "advert-review-drawer__section advert-review-drawer__section--toggle" },
            react_1.default.createElement("div", { className: "advert-review-drawer__toggle-label" },
                react_1.default.createElement(lucide_react_1.Globe, { size: 14 }),
                "Advert Language"),
            react_1.default.createElement("div", { className: "advert-review-drawer__toggle" },
                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "EN" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("EN"); } }, "English"),
                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "FR" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("FR"); } }, "French"))),
        react_1.default.createElement("section", { className: "advert-review-drawer__section" },
            react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                react_1.default.createElement(lucide_react_1.FileText, { size: 12 }),
                "Job Description (",
                advertLanguage,
                ")"),
            isLoading ? (react_1.default.createElement(SkeletonBlock, { height: "72px" })) : (react_1.default.createElement("p", { className: "advert-review-drawer__description" }, advertContent === null || advertContent === void 0 ? void 0 : advertContent.description))),
        react_1.default.createElement("section", { className: "advert-review-drawer__section" },
            react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12 }),
                "Key Responsibilities (",
                advertLanguage,
                ")"),
            isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                react_1.default.createElement(SkeletonBlock, { width: "80%" }),
                react_1.default.createElement(SkeletonBlock, { width: "60%" }),
                react_1.default.createElement(SkeletonBlock, { width: "70%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, responsibilitiesList))),
        react_1.default.createElement("div", { className: "advert-review-drawer__grid advert-review-drawer__grid--split" },
            react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                    react_1.default.createElement(lucide_react_1.UserCheck, { size: 12 }),
                    "Qualifications (",
                    advertLanguage,
                    ")"),
                isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                    react_1.default.createElement(SkeletonBlock, { width: "70%" }),
                    react_1.default.createElement(SkeletonBlock, { width: "55%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, qualificationsList))),
            react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                    react_1.default.createElement(lucide_react_1.Activity, { size: 12 }),
                    "Experience (",
                    advertLanguage,
                    ")"),
                isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                    react_1.default.createElement(SkeletonBlock, { width: "65%" }),
                    react_1.default.createElement(SkeletonBlock, { width: "50%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, experienceList))))));
};
exports.AdvertLanguageToggle = AdvertLanguageToggle;
//# sourceMappingURL=AdvertLanguageToggle.js.map