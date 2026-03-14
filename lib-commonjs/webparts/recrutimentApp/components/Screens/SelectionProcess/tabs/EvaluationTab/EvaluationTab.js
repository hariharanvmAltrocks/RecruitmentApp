"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var EvaluationTab_module_scss_1 = tslib_1.__importDefault(require("./EvaluationTab.module.scss"));
var EvaluationTable_1 = tslib_1.__importDefault(require("../../components/EvaluationTable/EvaluationTable"));
var useEvaluationData_1 = require("../../hooks/useEvaluationData");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var EvaluationTab = function (_a) {
    var _b;
    var employeeList = _a.employeeList;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) || "";
    var _c = (0, useEvaluationData_1.useEvaluationData)(currentUserEmail, employeeList), rows = _c.rows, tooltipData = _c.tooltipData, fetchData = _c.fetchData, fetchTooltip = _c.fetchTooltip, checkScoreSheet = _c.checkScoreSheet;
    var _d = (0, react_1.useState)(null), alert = _d[0], setAlert = _d[1];
    (0, react_1.useEffect)(function () {
        if (currentUserEmail) {
            void fetchData();
        }
    }, [fetchData, currentUserEmail]);
    return (react_1.default.createElement("div", { className: EvaluationTab_module_scss_1.default.card },
        alert && (react_1.default.createElement("div", { className: "".concat(EvaluationTab_module_scss_1.default.alert, " ").concat(alert.type ? EvaluationTab_module_scss_1.default[alert.type] : "") },
            react_1.default.createElement("span", null, alert.msg),
            react_1.default.createElement("button", { className: EvaluationTab_module_scss_1.default.alertClose, onClick: function () { return setAlert(null); } }, "\u2715"))),
        react_1.default.createElement("div", { className: EvaluationTab_module_scss_1.default.header },
            react_1.default.createElement("h2", { className: EvaluationTab_module_scss_1.default.title }, "Candidate Evaluations"),
            react_1.default.createElement("button", { className: EvaluationTab_module_scss_1.default.backBtn, onClick: function () { return navigate("/Dashboard"); } }, "\u21BA BACK TO DASHBOARD")),
        react_1.default.createElement(EvaluationTable_1.default, { rows: rows, tooltipData: tooltipData, currentRoleID: ["RecruitmentHR"], navigation: function (path, options) { return navigate(path, options); }, tabValue: "Evaluation", onRefresh: fetchData, onHover: fetchTooltip, onEvaluate: function (row) { return checkScoreSheet(row.id, row.statusId); }, onShowAlert: function (msg, type) { return setAlert({ msg: msg, type: type }); } })));
};
exports.default = EvaluationTab;
//# sourceMappingURL=EvaluationTab.js.map