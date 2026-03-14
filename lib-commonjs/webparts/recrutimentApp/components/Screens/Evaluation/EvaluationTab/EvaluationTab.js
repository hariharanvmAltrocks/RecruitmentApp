"use strict";
// components/Screens/Dashboard/tabs/EvaluationTab/EvaluationTab.tsx
// Evaluation tab UI – matches the Candidate Evaluations screenshot exactly
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
require("./EvaluationTab.css");
var useEvaluationTab_1 = require("../Hooks/useEvaluationTab");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var EvaluationTab = function () {
    var _a;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var currentUserEmailId = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0]) || ""; // Gets the email from RoleContext
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, useEvaluationTab_1.useEvaluationTab)(currentUserEmailId), candidates = _b.candidates, pendingInfo = _b.pendingInfo, isLoading = _b.isLoading, alert = _b.alert, closeAlert = _b.closeAlert, handleHover = _b.handleHover, handleEvaluateClick = _b.handleEvaluateClick, refresh = _b.refresh;
    // ── Evaluate button click ──────────────────────────────────────────────────
    var onEvaluate = function (row) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleEvaluateClick(row, navigate)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // ── Render ─────────────────────────────────────────────────────────────────
    return (react_1.default.createElement("div", { className: "eval-wrapper" },
        alert.open && (react_1.default.createElement("div", { className: "eval-alert eval-alert--".concat(alert.type.toLowerCase()) },
            react_1.default.createElement("span", null, alert.message),
            react_1.default.createElement("button", { className: "eval-alert__close", onClick: closeAlert }, "OK"))),
        react_1.default.createElement("div", { className: "eval-card" },
            react_1.default.createElement("div", { className: "eval-card__header" },
                react_1.default.createElement("h2", { className: "eval-card__title" }, "Candidate Evaluations"),
                react_1.default.createElement("button", { className: "eval-card__back-btn", onClick: function () { return navigate("/Dashboard"); } }, "\u21BA BACK TO DASHBOARD")),
            isLoading ? (react_1.default.createElement("div", { className: "eval-loader" }, "Loading\u2026")) : (react_1.default.createElement("div", { className: "eval-table-wrapper" },
                react_1.default.createElement("table", { className: "eval-table" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null,
                                "APPLICANTNAME ",
                                react_1.default.createElement("span", { className: "sort-icon" }, "\u2191\u2193")),
                            react_1.default.createElement("th", null,
                                "POSITION TITLE ",
                                react_1.default.createElement("span", { className: "sort-icon" }, "\u2191\u2193")),
                            react_1.default.createElement("th", null,
                                "INTERVIEW DATE ",
                                react_1.default.createElement("span", { className: "sort-icon" }, "\u2191\u2193")),
                            react_1.default.createElement("th", null,
                                "INTERVIEW LEVELS ",
                                react_1.default.createElement("span", { className: "sort-icon" }, "\u2191\u2193")),
                            react_1.default.createElement("th", null,
                                "GRADE ",
                                react_1.default.createElement("span", { className: "sort-icon" }, "\u2191\u2193")),
                            react_1.default.createElement("th", null, "ATTACHMENTS"),
                            react_1.default.createElement("th", null, "STATUS"),
                            react_1.default.createElement("th", null, "ACTION"))),
                    react_1.default.createElement("tbody", null, candidates.length === 0 ? (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", { colSpan: 8, className: "eval-table__empty" }, "No candidates found for evaluation."))) : (candidates.map(function (row) { return (react_1.default.createElement("tr", { key: row.ID },
                        react_1.default.createElement("td", { className: "eval-col-name" }, row.ApplicantName),
                        react_1.default.createElement("td", { className: "eval-col-position" }, row.PositionTitle),
                        react_1.default.createElement("td", { className: "eval-col-date" }, row.InterviewDateTime),
                        react_1.default.createElement("td", { className: "eval-col-level" }, row.InterviewLevel),
                        react_1.default.createElement("td", { className: "eval-col-grade" },
                            react_1.default.createElement("span", null, row.Grade)),
                        react_1.default.createElement("td", { className: "eval-col-attachments", onMouseEnter: function () { return handleHover(row.StatusId, row); }, title: pendingInfo.length > 0
                                ? "Pending: ".concat(pendingInfo.length, " evaluator(s)")
                                : "No pending info" },
                            react_1.default.createElement("span", { className: "attach-icon" }, "\uD83D\uDCCE"),
                            react_1.default.createElement("span", { className: "attach-count" }, pendingInfo.length || "—")),
                        react_1.default.createElement("td", { className: "eval-col-status" },
                            react_1.default.createElement("span", { className: "status-badge" },
                                react_1.default.createElement("span", { className: "status-dot" }),
                                row.Status)),
                        react_1.default.createElement("td", { className: "eval-col-action" },
                            react_1.default.createElement("button", { className: "evaluate-btn", onClick: function () { return onEvaluate(row); } }, "EVALUATE")))); })))))))));
};
exports.default = EvaluationTab;
//# sourceMappingURL=EvaluationTab.js.map