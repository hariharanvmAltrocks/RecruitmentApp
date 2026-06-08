"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var moment_1 = tslib_1.__importDefault(require("moment"));
var CommentsModal_module_scss_1 = tslib_1.__importDefault(require("./CommentsModal.module.scss"));
var CustomComments = function (_a) {
    var open = _a.open, loading = _a.loading, Comments = _a.Comments, onClose = _a.onClose;
    return (React.createElement(framer_motion_1.AnimatePresence, null, open && (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsModalOverlay, onClick: onClose },
        React.createElement(framer_motion_1.motion.div, { className: CommentsModal_module_scss_1.default.mCommentsModalWindow, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsHeader },
                React.createElement("h3", null,
                    React.createElement(lucide_react_1.FileText, { size: 20, color: "#2563eb" }),
                    " View Justification")),
            React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsBody }, loading ? (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsLoading }, "Loading comments...")) : Comments.length === 0 ? (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsNoData }, "No Comments Found")) : Comments.map(function (c, i) { return (React.createElement("div", { key: i, className: CommentsModal_module_scss_1.default.mCommentItemL1 },
                React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentRole },
                    "Submitted by ",
                    c.RoleName || c.Name || ""),
                c.comments && (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentText },
                    React.createElement("strong", null, "Comments:"),
                    React.createElement("br", null),
                    c.comments)),
                c.Date && (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentDate },
                    "Date: ",
                    (0, moment_1.default)(c.Date).format("M/D/YYYY, h:mm:ss A"))),
                c.Name && (React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentAuthor },
                    c.Name,
                    c.JobTitleInEnglish ? " \u2014 ".concat(c.JobTitleInEnglish) : "",
                    c.JobTitleInFrench ? " (".concat(c.JobTitleInFrench, ")") : "")),
                c.Department && React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentAuthor }, c.Department))); })),
            React.createElement("div", { className: CommentsModal_module_scss_1.default.mCommentsFooter },
                React.createElement("button", { onClick: onClose, className: CommentsModal_module_scss_1.default.closeBtn }, "CLOSE")))))));
};
exports.default = CustomComments;
//# sourceMappingURL=CommentsModal.js.map