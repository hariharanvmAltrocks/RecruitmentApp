"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var fetchCandidateDashboardDetails_1 = require("./Hooks/fetchCandidateDashboardDetails");
var ShowCandidateDetailsPopup_1 = require("./Components/ShowCandidateDetailsPopup");
require("./CandidateTable.scss");
var rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: function (index) { return ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.05, duration: 0.35, ease: "easeOut" }
    }); }
};
var tableVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
};
var CandidateTable = function () {
    var _a = (0, fetchCandidateDashboardDetails_1.useFetchCandidateDashboardDetails)(), data = _a.data, loading = _a.loading, error = _a.error;
    var _b = (0, react_1.useState)(null), activeCandidateId = _b[0], setActiveCandidateId = _b[1];
    var headerMeta = (0, react_1.useMemo)(function () {
        if (!data.length) {
            return { code: "", title: "" };
        }
        var primary = data[0];
        return { code: primary.jobCode, title: primary.jobTitle };
    }, [data]);
    return (react_1.default.createElement("div", { className: "candidate-table" },
        react_1.default.createElement("div", { className: "candidate-table__header" },
            react_1.default.createElement("div", { className: "candidate-table__title" },
                react_1.default.createElement("div", { className: "candidate-table__title-icon" }, "RC"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", null, "Review Candidate Profiles"),
                    react_1.default.createElement("p", null,
                        react_1.default.createElement("span", { className: "candidate-table__job-code" }, headerMeta.code),
                        react_1.default.createElement("span", { className: "candidate-table__separator" }, "\uFFFD"),
                        headerMeta.title)))),
        react_1.default.createElement("div", { className: "candidate-table__card" },
            loading && react_1.default.createElement("div", { className: "candidate-table__state" }, "Loading candidates..."),
            error && react_1.default.createElement("div", { className: "candidate-table__state candidate-table__state--error" }, error),
            !loading && !error && (react_1.default.createElement(framer_motion_1.motion.table, { className: "candidate-table__table", initial: "hidden", animate: "visible", variants: tableVariants },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, "Job Code"),
                        react_1.default.createElement("th", null, "Job Title"),
                        react_1.default.createElement("th", null, "Business Unit Code"),
                        react_1.default.createElement("th", null, "Position Request"),
                        react_1.default.createElement("th", null, "Nationality"),
                        react_1.default.createElement("th", null, "Status"),
                        react_1.default.createElement("th", null, "Action"))),
                react_1.default.createElement("tbody", null, data.map(function (candidate, index) { return (react_1.default.createElement(framer_motion_1.motion.tr, { key: candidate.id, custom: index, variants: rowVariants, whileHover: { y: -2, boxShadow: "0 12px 24px rgba(16, 24, 40, 0.12)" } },
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: "candidate-table__code" }, candidate.jobCode)),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: "candidate-table__name" }, candidate.jobTitle),
                        react_1.default.createElement("div", { className: "candidate-table__subtext" }, candidate.applicantName)),
                    react_1.default.createElement("td", null, candidate.businessUnitCode),
                    react_1.default.createElement("td", null, candidate.positionRequest),
                    react_1.default.createElement("td", null, candidate.nationality),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: "candidate-table__status candidate-table__status--".concat(candidate.statusTone) }, candidate.statusLabel)),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(framer_motion_1.motion.button, { type: "button", className: "candidate-table__review", whileHover: { scale: 1.03 }, whileTap: { scale: 0.98 }, onClick: function () { return setActiveCandidateId(candidate.id); } }, "Review")))); })))),
            react_1.default.createElement("div", { className: "candidate-table__footer" },
                react_1.default.createElement("button", { type: "button", className: "candidate-table__footer-btn candidate-table__footer-btn--ghost" }, "Cancel"),
                react_1.default.createElement("button", { type: "button", className: "candidate-table__footer-btn candidate-table__footer-btn--primary" }, "Submit Review"))),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, activeCandidateId && (react_1.default.createElement(ShowCandidateDetailsPopup_1.ShowCandidateDetailsPopup, { isOpen: !!activeCandidateId, candidateId: activeCandidateId, onClose: function () { return setActiveCandidateId(null); } })))));
};
exports.CandidateTable = CandidateTable;
//# sourceMappingURL=CandidateTable.js.map