"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardCommentView_module_scss_1 = tslib_1.__importDefault(require("./ScorecardCommentView.module.scss"));
var ScorecardCommentView = function (_a) {
    var level1 = _a.level1, level2 = _a.level2, onClose = _a.onClose;
    var allComments = tslib_1.__spreadArray(tslib_1.__spreadArray([], level1, true), level2, true);
    return (React.createElement("div", { className: ScorecardCommentView_module_scss_1.default.commentWrapper },
        React.createElement("div", { className: ScorecardCommentView_module_scss_1.default.header },
            React.createElement("h3", null, "Justification History")),
        React.createElement("div", { className: ScorecardCommentView_module_scss_1.default.list }, allComments.length > 0 ? (allComments.map(function (c, i) { return (React.createElement("div", { key: i, className: ScorecardCommentView_module_scss_1.default.commentCard },
            React.createElement("div", { className: ScorecardCommentView_module_scss_1.default.row },
                React.createElement("span", { className: ScorecardCommentView_module_scss_1.default.role }, c.RoleName),
                React.createElement("span", { className: ScorecardCommentView_module_scss_1.default.date }, c.Date ? new Date(c.Date).toLocaleString() : "")),
            React.createElement("p", { className: ScorecardCommentView_module_scss_1.default.text }, c.comments))); })) : (React.createElement("p", { className: ScorecardCommentView_module_scss_1.default.empty }, "No justifications found.")))));
};
exports.default = ScorecardCommentView;
//# sourceMappingURL=ScorecardCommentView.js.map