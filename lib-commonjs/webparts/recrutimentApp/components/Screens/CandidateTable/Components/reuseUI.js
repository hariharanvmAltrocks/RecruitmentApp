"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewerUrl = exports.buildOfficeViewerUrl = exports.buildWopiUrl = exports.isOfficeUrl = exports.isBlobUrl = exports.isPdfUrl = exports.isSharePointUrl = exports.SP_ORIGIN = exports.InterviewScheduleInput = exports.QuestionCard = exports.InfoItem = exports.SectionHeader = exports.sectionVariants = exports.cardVariants = exports.backdropVariants = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
var ShowCandidateDetailsPopup_module_scss_1 = tslib_1.__importDefault(require("./ShowCandidateDetailsPopup.module.scss"));
var react_1 = tslib_1.__importDefault(require("react"));
exports.backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};
exports.cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.28, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};
exports.sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: function (i) { return ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
    }); },
};
var SectionHeader = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, _b = _a.accent, accent = _b === void 0 ? "orange" : _b;
    var accentClass = {
        orange: ShowCandidateDetailsPopup_module_scss_1.default.accentOrange,
        blue: ShowCandidateDetailsPopup_module_scss_1.default.accentBlue,
        green: ShowCandidateDetailsPopup_module_scss_1.default.accentGreen,
        red: ShowCandidateDetailsPopup_module_scss_1.default.accentRed,
    }[accent];
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionHeader },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionHeaderRow },
            react_1.default.createElement("div", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.sectionAccentBar, " ").concat(accentClass) }),
            react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionTitle }, title)),
        subtitle && react_1.default.createElement("p", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionSubtitle }, subtitle)));
};
exports.SectionHeader = SectionHeader;
var InfoItem = function (_a) {
    var label = _a.label, value = _a.value, icon = _a.icon;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoItem },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoLabel },
            icon && react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoLabelIcon }, icon),
            label),
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoValue }, value !== null && value !== void 0 ? value : "--")));
};
exports.InfoItem = InfoItem;
var QuestionCard = function (_a) {
    var index = _a.index, question = _a.question, answer = _a.answer;
    var isYes = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "yes";
    var isNo = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "no";
    var badgeClass = isYes
        ? ShowCandidateDetailsPopup_module_scss_1.default.answerYes
        : isNo
            ? ShowCandidateDetailsPopup_module_scss_1.default.answerNo
            : ShowCandidateDetailsPopup_module_scss_1.default.answerNeutral;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionRow },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionInner },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionPill },
                react_1.default.createElement("span", null,
                    "Q",
                    index)),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionBody },
                react_1.default.createElement("h4", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionText }, question),
                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.answerRow },
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.answerLabel }, "Answer:"),
                    react_1.default.createElement("span", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.answerBadge, " ").concat(badgeClass) }, answer !== null && answer !== void 0 ? answer : "--"))))));
};
exports.QuestionCard = QuestionCard;
var toDateTimeLocal = function (date) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return "".concat(date.getFullYear(), "-").concat(pad(date.getMonth() + 1), "-").concat(pad(date.getDate()), "T").concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()));
};
var InterviewScheduleInput = function (_a) {
    var form = _a.form, onChange = _a.onChange, panelOptions = _a.panelOptions, onToggleMember = _a.onToggleMember, _b = _a.minPanelCount, minPanelCount = _b === void 0 ? 3 : _b, Disable = _a.Disable;
    var needsMore = form.panelMembers.length < minPanelCount;
    // ✅ Helpers
    var formatLocalDateTime = function (date) {
        var pad = function (n) { return n.toString().padStart(2, "0"); };
        return "".concat(date.getFullYear(), "-").concat(pad(date.getMonth() + 1), "-").concat(pad(date.getDate()), "T").concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()));
    };
    // ✅ Today & max range
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 5);
    maxDay.setHours(23, 59, 0, 0);
    var WORK_START = "09:00";
    var WORK_END = "18:00";
    var handleStartDateChange = function (e) {
        var newStart = e.target.value;
        if (!newStart)
            return;
        var startDateObj = new Date(newStart);
        onChange(function (p) {
            var newEndDate = p.endDate;
            var isSameDay = p.endDate && p.endDate.split("T")[0] === newStart.split("T")[0];
            var isInvalid = !p.endDate || new Date(p.endDate) <= startDateObj || !isSameDay;
            if (isInvalid) {
                var endDateObj = new Date(startDateObj.getTime() + 30 * 60000);
                newEndDate = formatLocalDateTime(endDateObj);
            }
            return tslib_1.__assign(tslib_1.__assign({}, p), { startDate: newStart, endDate: newEndDate });
        });
    };
    // ✅ Same-day restriction for End Date
    var endDateMin = form.startDate
        ? "".concat(form.startDate.split("T")[0], "T").concat(WORK_START)
        : "";
    var endDateMax = form.startDate
        ? "".concat(form.startDate.split("T")[0], "T").concat(WORK_END)
        : "";
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.scheduleCard },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelMembersWrap },
            react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                "Interview panel members",
                " ",
                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelTagsWrap }, panelOptions.map(function (opt) {
                var selected = form.panelMembers.includes(opt.value);
                return (react_1.default.createElement("button", { key: opt.value, type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.panelTag, " ").concat(selected ? ShowCandidateDetailsPopup_module_scss_1.default.panelTagSelected : ShowCandidateDetailsPopup_module_scss_1.default.panelTagUnselected), onClick: function () { return onToggleMember(opt.value); }, disabled: Disable },
                    selected && (react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16, className: ShowCandidateDetailsPopup_module_scss_1.default.panelTagIcon })),
                    opt.label));
            })),
            needsMore && (react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelWarning },
                "Please select at least ",
                minPanelCount,
                " panel members \u2022",
                " ",
                form.panelMembers.length,
                " selected"))),
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateRow },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                    "Start date & time ",
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", placeholder: " dd-mm-yyyy hh:mm", className: ShowCandidateDetailsPopup_module_scss_1.default.dateInput, value: form.startDate, min: "".concat(formatLocalDateTime(maxDay).split("T")[0], "T").concat(WORK_START), max: "T".concat(WORK_END), step: 1800, onChange: handleStartDateChange, disabled: Disable })),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                    "End date & time ",
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", placeholder: "dd-mm-yyyy hh:mm", className: ShowCandidateDetailsPopup_module_scss_1.default.dateInput, value: form.endDate, min: endDateMin, max: endDateMax, step: 1800, disabled: !form.startDate || Disable, onChange: function (e) {
                        return onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { endDate: e.target.value })); });
                    } })))));
};
exports.InterviewScheduleInput = InterviewScheduleInput;
exports.SP_ORIGIN = (_b = (_a = window.__SP_ORIGIN__) !== null && _a !== void 0 ? _a : process.env.REACT_APP_SP_ORIGIN) !== null && _b !== void 0 ? _b : window.location.origin;
var isSharePointUrl = function (url) {
    return /\.sharepoint\.com\//i.test(url) || url.startsWith("/sites/");
};
exports.isSharePointUrl = isSharePointUrl;
/** Ends with .pdf (ignores query-string) */
var isPdfUrl = function (url) {
    return url.split("?")[0].toLowerCase().endsWith(".pdf");
};
exports.isPdfUrl = isPdfUrl;
/** base64 data-URL produced by FileReader */
var isBlobUrl = function (url) {
    return url.startsWith("data:") || url.startsWith("blob:");
};
exports.isBlobUrl = isBlobUrl;
/** Office document extensions */
var isOfficeUrl = function (url) {
    return /\.(docx?|xlsx?|pptx?)(\?|$)/i.test(url);
};
exports.isOfficeUrl = isOfficeUrl;
// ── Builders ──────────────────────────────────────────────────────────────────
/**
 * Build a SharePoint WOPI embed URL.
 * Works for both full URLs and relative /sites/… paths.
 */
var buildWopiUrl = function (url, spOrigin) {
    if (spOrigin === void 0) { spOrigin = exports.SP_ORIGIN; }
    try {
        var fullUrl = url.startsWith("http")
            ? url
            : "".concat(spOrigin).concat(url.startsWith("/") ? "" : "/").concat(url);
        var origin_1 = new URL(fullUrl).origin;
        return "".concat(origin_1, "/_layouts/15/WopiFrame.aspx?sourcedoc=").concat(encodeURIComponent(fullUrl), "&action=embedview");
    }
    catch (_a) {
        return url;
    }
};
exports.buildWopiUrl = buildWopiUrl;
/** Microsoft Office Online viewer (for public / SAS-signed URLs) */
var buildOfficeViewerUrl = function (url) {
    return "https://view.officeapps.live.com/op/embed.aspx?src=".concat(encodeURIComponent(url));
};
exports.buildOfficeViewerUrl = buildOfficeViewerUrl;
// ── Main resolver ─────────────────────────────────────────────────────────────
/**
 * Resolves any file URL to the best embeddable viewer URL.
 *
 * Priority:
 *   1. blob / data-URL  → direct (browser renders natively)
 *   2. SharePoint path  → WOPI embed
 *   3. PDF              → direct src
 *   4. Office doc       → Office Online viewer
 *   5. fallback         → direct src
 */
var getViewerUrl = function (rawUrl, spOrigin) {
    // if (!rawUrl) return { url: "", type: "direct" };
    if (spOrigin === void 0) { spOrigin = exports.SP_ORIGIN; }
    // if (isBlobUrl(rawUrl)) return { url: rawUrl, type: "blob" };
    // if (isSharePointUrl(rawUrl))
    //   return { url: buildWopiUrl(rawUrl, spOrigin), type: "wopi" };
    // if (isPdfUrl(rawUrl)) return { url: rawUrl, type: "direct" };
    // if (isOfficeUrl(rawUrl))
    //   return { url: buildOfficeViewerUrl(rawUrl), type: "office" };
    return { url: rawUrl, type: "direct" };
};
exports.getViewerUrl = getViewerUrl;
//# sourceMappingURL=reuseUI.js.map