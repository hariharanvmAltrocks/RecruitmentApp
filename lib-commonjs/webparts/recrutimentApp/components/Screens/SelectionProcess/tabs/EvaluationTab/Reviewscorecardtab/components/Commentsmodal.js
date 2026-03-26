"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var moment = tslib_1.__importStar(require("moment"));
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("../Reviewscorecardtab.module.scss"));
var CommentsModal = function (_a) {
    var open = _a.open, loading = _a.loading, level1 = _a.level1, level2 = _a.level2, onClose = _a.onClose;
    var allComments = React.useMemo(function () { return tslib_1.__spreadArray(tslib_1.__spreadArray([], level1.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { _level: "Level 1" })); }), true), level2.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { _level: "Level 2" })); }), true).sort(function (a, b) {
        var d1 = a.Date ? new Date(a.Date).getTime() : 0;
        var d2 = b.Date ? new Date(b.Date).getTime() : 0;
        return d1 - d2;
    }); }, [level1, level2]);
    return (React.createElement(framer_motion_1.AnimatePresence, null, open && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsModalOverlay, onClick: onClose },
        React.createElement(framer_motion_1.motion.div, { className: Reviewscorecardtab_module_scss_1.default.mCommentsModalWindow, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsHeader },
                React.createElement("h3", null,
                    React.createElement(lucide_react_1.FileText, { size: 20, color: "#2563eb" }),
                    " View Justification"),
                React.createElement("button", { onClick: onClose },
                    React.createElement(lucide_react_1.X, { size: 20 }))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsBody }, loading ? (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsLoading }, "Loading comments...")) : allComments.length === 0 ? (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsNoData }, "No Comments Found")) : allComments.map(function (c, i) { return (React.createElement("div", { key: i, className: c._level === "Level 1" ? Reviewscorecardtab_module_scss_1.default.mCommentItemL1 : Reviewscorecardtab_module_scss_1.default.mCommentItemL2 },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentRole },
                    "Submitted by ",
                    c.RoleName || c.Name || "",
                    " (",
                    c._level,
                    ")"),
                c.comments && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentText },
                    React.createElement("strong", null,
                        "Feedback ",
                        c._level,
                        ":"),
                    React.createElement("br", null),
                    c.comments)),
                c.OverAllEvaluationFeedback && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentText },
                    React.createElement("strong", null,
                        "Overall Feedback ",
                        c._level,
                        ":"),
                    React.createElement("br", null),
                    c.OverAllEvaluationFeedback)),
                c.Date && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentDate },
                    "Date: ",
                    moment(c.Date).format("M/D/YYYY, h:mm:ss A"))),
                c.Name && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentAuthor },
                    c.Name,
                    c.JobTitleInEnglish ? " \u2014 ".concat(c.JobTitleInEnglish) : "",
                    c.JobTitleInFrench ? " (".concat(c.JobTitleInFrench, ")") : "")),
                c.Department && React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentAuthor }, c.Department))); })),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsFooter },
                React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.closeBtn }, "CLOSE")))))));
};
exports.default = CommentsModal;
//# sourceMappingURL=Commentsmodal.js.map