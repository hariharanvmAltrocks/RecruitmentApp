"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertLanguageToggle = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("../RecruitmentTable.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
// ─── Skeleton ────────────────────────────────────────────────────────────────
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var SkeletonList = function (_a) {
    var _b = _a.lines, lines = _b === void 0 ? 3 : _b;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__list" }, Array.from({ length: lines }).map(function (_, i) { return (react_1.default.createElement(SkeletonBlock, { key: i, width: "".concat(60 + (i % 3) * 10, "%") })); })));
};
// ─── Strip HTML helper ────────────────────────────────────────────────────────
var stripHtml = function (html) {
    var _a, _b;
    if (!html)
        return "";
    var doc = new DOMParser().parseFromString(html, "text/html");
    return (_b = (_a = doc.body.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
};
var Section = function (_a) {
    var title = _a.title, icon = _a.icon, isLoading = _a.isLoading, _b = _a.skeletonLines, skeletonLines = _b === void 0 ? 3 : _b, children = _a.children, _c = _a.isEmpty, isEmpty = _c === void 0 ? false : _c;
    if (!isLoading && isEmpty)
        return null;
    return (react_1.default.createElement("section", { className: "advert-review-drawer__section" },
        react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
            icon,
            title),
        isLoading ? react_1.default.createElement(SkeletonList, { lines: skeletonLines }) : children));
};
// ─── List renderer ────────────────────────────────────────────────────────────
var renderList = function (items, muted) {
    if (muted === void 0) { muted = false; }
    if (!items || items.length === 0)
        return null;
    return (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, items.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item".concat(muted ? " advert-review-drawer__list-item--muted" : "") },
        react_1.default.createElement("span", { className: "advert-review-drawer__list-dot".concat(muted ? " advert-review-drawer__list-dot--muted" : "") }),
        item)); })));
};
var AdvertLanguageToggle = function (_a) {
    var advertLanguage = _a.advertLanguage, advertContent = _a.advertContent, isLoading = _a.isLoading, onLanguageChange = _a.onLanguageChange;
    var responsibilitiesList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.responsibilities); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.responsibilities]);
    var qualificationsList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.qualifications, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.qualifications]);
    var preferredQualificationsList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.PrefeQualification, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.PrefeQualification]);
    var experienceList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.experience, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.experience]);
    var roleSpecificKnowledgeList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.RoleSpecificKnowledge, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.RoleSpecificKnowledge]);
    var requiredLevelList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.RequiredLevel, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.RequiredLevel]);
    var technicalSkillsList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.TechnicalSkills, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.TechnicalSkills]);
    var levelProficiencyList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.LevelProficiency, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.LevelProficiency]);
    var jobFunctionalTypeList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.JobFunctionalType, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.JobFunctionalType]);
    var jobBGVList = (0, react_1.useMemo)(function () { return renderList(advertContent === null || advertContent === void 0 ? void 0 : advertContent.JobBasedBGVVerification, true); }, [advertContent === null || advertContent === void 0 ? void 0 : advertContent.JobBasedBGVVerification]);
    var isEmpty = function (arr) {
        return !arr || arr.length === 0;
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("section", { className: "advert-review-drawer__section advert-review-drawer__section--frame" },
            react_1.default.createElement("div", { className: "advert-review-drawer__section-header" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement("span", { className: "advert-review-drawer__section-indicator" }),
                    strings.JobAdvertisement)),
            react_1.default.createElement("div", { className: "advert-review-drawer__section advert-review-drawer__section--toggle" },
                react_1.default.createElement("div", { className: "advert-review-drawer__toggle-label" },
                    react_1.default.createElement(lucide_react_1.Globe, { size: 14 }),
                    strings.AdvertLanguage),
                react_1.default.createElement("div", { className: "advert-review-drawer__toggle" },
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "EN" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("EN"); } }, strings.English),
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "FR" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("FR"); } }, strings.French))),
            react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                    react_1.default.createElement(lucide_react_1.FileText, { size: 12 }),
                    strings.JobDescription,
                    advertLanguage,
                    ")"),
                isLoading ? (react_1.default.createElement(SkeletonBlock, { height: "72px" })) : (react_1.default.createElement("p", { className: "advert-review-drawer__description" }, (advertContent === null || advertContent === void 0 ? void 0 : advertContent.description) || ""))),
            react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.KeyResponsibilities), icon: react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12 }), isLoading: isLoading, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.responsibilities) }, responsibilitiesList),
            react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.Experience), icon: react_1.default.createElement(lucide_react_1.Activity, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.experience) }, experienceList),
            react_1.default.createElement("div", { className: "advert-review-drawer__grid advert-review-drawer__grid--split" },
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.MinimumQualification), icon: react_1.default.createElement(lucide_react_1.Award, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.qualifications) }, qualificationsList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.PreferredQualification), icon: react_1.default.createElement(lucide_react_1.Star, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.PrefeQualification) }, preferredQualificationsList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.RoleSpecificKnowledge), icon: react_1.default.createElement(lucide_react_1.BookOpen, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.RoleSpecificKnowledge) }, roleSpecificKnowledgeList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.RequiredLevel), icon: react_1.default.createElement(lucide_react_1.TrendingUp, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.RequiredLevel) }, requiredLevelList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.TechnicalSkillsAbilityToApplyKnowledge), icon: react_1.default.createElement(lucide_react_1.Wrench, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.TechnicalSkills) }, technicalSkillsList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.LevelOfProficiency), icon: react_1.default.createElement(lucide_react_1.Zap, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.LevelProficiency) }, levelProficiencyList),
                react_1.default.createElement(Section, { title: sp_core_library_1.Text.format(strings.JobFunctionalType), icon: react_1.default.createElement(lucide_react_1.Briefcase, { size: 12 }), isLoading: isLoading, skeletonLines: 2, isEmpty: isEmpty(advertContent === null || advertContent === void 0 ? void 0 : advertContent.JobFunctionalType) }, jobFunctionalTypeList)))));
};
exports.AdvertLanguageToggle = AdvertLanguageToggle;
//# sourceMappingURL=AdvertLanguageToggle.js.map