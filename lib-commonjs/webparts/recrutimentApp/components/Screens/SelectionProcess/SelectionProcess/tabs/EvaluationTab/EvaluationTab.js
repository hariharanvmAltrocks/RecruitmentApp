"use strict";
// ─── EvaluationTab.tsx ───────────────────────────────────────────────────────
// Evaluation tab — hook + common table compose மட்டும்
// No API calls here. No spinner. Skeleton rows show on mount.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var EvaluationTab_module_scss_1 = tslib_1.__importDefault(require("./EvaluationTab.module.scss"));
var EvaluationTable_1 = tslib_1.__importDefault(require("../../components/EvaluationTable/EvaluationTable"));
var useEvaluationData_1 = require("../../hooks/useEvaluationData");
var EvaluationTab = function (_a) {
    var _b;
    var currentUserEmail = _a.currentUserEmail, employeeList = _a.employeeList;
    var navigate = (0, react_router_dom_1.useNavigate)();
    // All data fetching via hook
    var _c = (0, useEvaluationData_1.useEvaluationData)(currentUserEmail, employeeList), rows = _c.rows, tooltipData = _c.tooltipData, fetchData = _c.fetchData, fetchTooltip = _c.fetchTooltip, checkScoreSheet = _c.checkScoreSheet;
    // Inline alert state (no modal)
    var _d = (0, react_1.useState)(null), alert = _d[0], setAlert = _d[1];
    // Fetch on mount (Selection Process click → tab mounts → data loads)
    (0, react_1.useEffect)(function () {
        void fetchData();
    }, [fetchData]);
    return (react_1.default.createElement("div", { className: EvaluationTab_module_scss_1.default.card },
        alert && (react_1.default.createElement("div", { className: "".concat(EvaluationTab_module_scss_1.default.alert, " ").concat((_b = EvaluationTab_module_scss_1.default[alert.type]) !== null && _b !== void 0 ? _b : "") },
            react_1.default.createElement("span", null, alert.msg),
            react_1.default.createElement("button", { className: EvaluationTab_module_scss_1.default.alertClose, onClick: function () { return setAlert(null); } }, "\u2715"))),
        react_1.default.createElement("div", { className: EvaluationTab_module_scss_1.default.header },
            react_1.default.createElement("h2", { className: EvaluationTab_module_scss_1.default.title }, "Candidate Evaluations"),
            react_1.default.createElement("button", { className: EvaluationTab_module_scss_1.default.backBtn, onClick: function () { return navigate("/Dashboard"); } }, "\u21BA BACK TO DASHBOARD")),
        react_1.default.createElement(EvaluationTable_1.default, { rows: rows, tooltipData: tooltipData, onHover: fetchTooltip, onEvaluate: function (row) { return checkScoreSheet(row.id, row.statusId); }, onShowAlert: function (msg, type) { return setAlert({ msg: msg, type: type }); } })));
};
exports.default = EvaluationTab;
//# sourceMappingURL=EvaluationTab.js.map