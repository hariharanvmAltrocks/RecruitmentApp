"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewerUrl = exports.buildOfficeViewerUrl = exports.buildWopiUrl = exports.isOfficeUrl = exports.isBlobUrl = exports.isPdfUrl = exports.isSharePointUrl = exports.SP_ORIGIN = exports.QuestionCard = exports.InfoItem = exports.SectionHeader = exports.sectionVariants = exports.cardVariants = exports.backdropVariants = void 0;
var tslib_1 = require("tslib");
var ShowCandidateDetailsPopup_module_scss_1 = tslib_1.__importDefault(require("./ShowCandidateDetailsPopup.module.scss"));
var react_1 = tslib_1.__importDefault(require("react"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
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
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.answerLabel }, strings.Answer),
                    react_1.default.createElement("span", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.answerBadge, " ").concat(badgeClass) }, answer !== null && answer !== void 0 ? answer : "--"))))));
};
exports.QuestionCard = QuestionCard;
// interface InterviewScheduleInputProps {
//   form: InterviewScheduleForm;
//   onChange: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>;
//   panelOptions: { value: string; label: string }[];
//   onToggleMember: (val: string) => void;
//   minPanelCount?: number;
//   Disable: boolean;
// }
// const toDateTimeLocal = (date: Date) => {
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
// };
// export const InterviewScheduleInput: React.FC<InterviewScheduleInputProps> = ({
//   form,
//   onChange,
//   panelOptions,
//   onToggleMember,
//   minPanelCount = 3,
//   Disable,
// }) => {
//   const needsMore = form.panelMembers.length < minPanelCount;
//   // ✅ Helpers
//   const formatLocalDateTime = (date: Date) => {
//     const pad = (n: number) => n.toString().padStart(2, "0");
//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
//       date.getDate(),
//     )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
//   };
//   // ✅ Today & max range
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const maxDay = new Date(today);
//   maxDay.setDate(today.getDate() + 5);
//   maxDay.setHours(23, 59, 0, 0);
//   const WORK_START = "09:00";
//   const WORK_END = "18:00";
//   const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newStart = e.target.value;
//     if (!newStart) return;
//     const startDateObj = new Date(newStart);
//     onChange((p) => {
//       let newEndDate = p.endDate;
//       const isSameDay =
//         p.endDate && p.endDate.split("T")[0] === newStart.split("T")[0];
//       const isInvalid =
//         !p.endDate || new Date(p.endDate) <= startDateObj || !isSameDay;
//       if (isInvalid) {
//         const endDateObj = new Date(startDateObj.getTime() + 30 * 60000);
//         newEndDate = formatLocalDateTime(endDateObj);
//       }
//       return {
//         ...p,
//         startDate: newStart,
//         endDate: newEndDate,
//       };
//     });
//   };
//   // ✅ Same-day restriction for End Date
//   const endDateMin = form.startDate
//     ? `${form.startDate.split("T")[0]}T${WORK_START}`
//     : "";
//   const endDateMax = form.startDate
//     ? `${form.startDate.split("T")[0]}T${WORK_END}`
//     : "";
//   return (
//     <div className={styles.scheduleCard}>
//       {/* ✅ Panel Members */}
//       <div className={styles.panelMembersWrap}>
//         <label className={styles.fieldLabel}>
//           Interview panel members{" "}
//           <span className={styles.fieldRequired}>*</span>
//         </label>
//         <div className={styles.panelTagsWrap}>
//           {panelOptions.map((opt) => {
//             const selected = form.panelMembers.includes(opt.value);
//             return (
//               <button
//                 key={opt.value}
//                 type="button"
//                 className={`${styles.panelTag} ${
//                   selected ? styles.panelTagSelected : styles.panelTagUnselected
//                 }`}
//                 onClick={() => onToggleMember(opt.value)}
//                 disabled={Disable}
//               >
//                 {selected && (
//                   <CheckCircle size={16} className={styles.panelTagIcon} />
//                 )}
//                 {opt.label}
//               </button>
//             );
//           })}
//         </div>
//         {needsMore && (
//           <span className={styles.panelWarning}>
//             Please select at least {minPanelCount} panel members •{" "}
//             {form.panelMembers.length} selected
//           </span>
//         )}
//       </div>
//       <div className={styles.dateRow}>
//         <div className={styles.dateField}>
//           <label className={styles.fieldLabel}>
//             Start date & time <span className={styles.fieldRequired}>*</span>
//           </label>
//           <input
//             type="datetime-local"
//             placeholder=" dd-mm-yyyy hh:mm"
//             className={styles.dateInput}
//             value={form.startDate}
//             min={`${formatLocalDateTime(maxDay).split("T")[0]}T${WORK_START}`}
//             max={`T${WORK_END}`}
//             step={1800} // ✅ 30 mins
//             onChange={handleStartDateChange}
//             disabled={Disable}
//           />
//         </div>
//         <div className={styles.dateField}>
//           <label className={styles.fieldLabel}>
//             End date & time <span className={styles.fieldRequired}>*</span>
//           </label>
//           <input
//             type="datetime-local"
//             placeholder="dd-mm-yyyy hh:mm"
//             className={styles.dateInput}
//             value={form.endDate}
//             min={endDateMin}
//             max={endDateMax}
//             step={1800}
//             disabled={!form.startDate || Disable}
//             onChange={(e) =>
//               onChange((p) => ({
//                 ...p,
//                 endDate: e.target.value,
//               }))
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
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