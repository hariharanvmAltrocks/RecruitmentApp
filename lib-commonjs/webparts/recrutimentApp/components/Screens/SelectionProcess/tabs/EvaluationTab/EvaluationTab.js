"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var EvaluationTab_module_scss_1 = tslib_1.__importDefault(require("./EvaluationTab.module.scss"));
var EvaluationTable_1 = tslib_1.__importDefault(require("../../components/EvaluationTable/EvaluationTable"));
var EvaluationForm_1 = tslib_1.__importDefault(require("../../components/EvaluationTable/EvaluationForm/EvaluationForm"));
var useEvaluationData_1 = require("../../hooks/useEvaluationData");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var EvaluationTab = function (_a) {
    var _b, _c, _d;
    var employeeList = _a.employeeList, onFormStateChange = _a.onFormStateChange;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = (_c = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "";
    var currentRoleIDs = (_d = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) !== null && _d !== void 0 ? _d : [];
    var _e = (0, useEvaluationData_1.useEvaluationData)(currentUserEmail, employeeList), rows = _e.rows, tooltipData = _e.tooltipData, fetchData = _e.fetchData, fetchTooltip = _e.fetchTooltip, checkScoreSheet = _e.checkScoreSheet;
    var _f = React.useState(""), alertMsg = _f[0], setAlertMsg = _f[1];
    var _g = React.useState(false), alertIsError = _g[0], setAlertIsError = _g[1];
    var _h = React.useState(false), alertVisible = _h[0], setAlertVisible = _h[1];
    var showAlert = function (msg, type) {
        setAlertMsg(msg);
        setAlertIsError(type === "Error");
        setAlertVisible(true);
    };
    var hideAlert = function () { return setAlertVisible(false); };
    var _j = React.useState(null), selectedRow = _j[0], setSelectedRow = _j[1];
    React.useEffect(function () {
        if (currentUserEmail)
            void fetchData();
    }, [currentUserEmail]);
    React.useEffect(function () {
        if (onFormStateChange) {
            onFormStateChange(selectedRow !== null);
        }
        return function () {
            if (onFormStateChange)
                onFormStateChange(false);
        };
    }, [selectedRow, onFormStateChange]);
    React.useEffect(function () {
        var handleCloseEvent = function () {
            setSelectedRow(null);
            void fetchData();
        };
        window.addEventListener("close-evaluation-form", handleCloseEvent);
        return function () {
            window.removeEventListener("close-evaluation-form", handleCloseEvent);
        };
    }, [fetchData]);
    if (selectedRow) {
        return (React.createElement(EvaluationForm_1.default, { candidateId: selectedRow.id, recruitmentId: selectedRow.recruitmentID, interviewLevel: selectedRow.interviewLevel, grade: selectedRow.grade, status: selectedRow.status, statusId: selectedRow.statusId, jobCodeID: selectedRow.jobCodeID, currentRoleIDs: currentRoleIDs, onBack: function () {
                setSelectedRow(null);
                void fetchData();
            } }));
    }
    var alertClass = [
        EvaluationTab_module_scss_1.default.alertBanner,
        alertIsError ? EvaluationTab_module_scss_1.default.alertBannerError : EvaluationTab_module_scss_1.default.alertBannerSuccess,
    ].join(" ");
    return (React.createElement("div", { className: EvaluationTab_module_scss_1.default.card },
        alertVisible && (React.createElement("div", { className: alertClass },
            React.createElement("span", null, alertMsg),
            React.createElement("button", { className: EvaluationTab_module_scss_1.default.alertClose, onClick: hideAlert }, "\u2715"))),
        React.createElement("div", { className: EvaluationTab_module_scss_1.default.header },
            React.createElement("h2", { className: EvaluationTab_module_scss_1.default.title }, "Candidate Evaluations"),
            React.createElement("button", { className: EvaluationTab_module_scss_1.default.backBtn, onClick: function () { return navigate("/Dashboard"); } }, "\u21BA BACK TO DASHBOARD")),
        React.createElement(EvaluationTable_1.default, { rows: rows, tooltipData: tooltipData, currentRoleID: currentRoleIDs, navigation: function (path, options) { return navigate(path, options); }, tabValue: "Evaluation", onRefresh: fetchData, onHover: fetchTooltip, onEvaluate: function (row) { return checkScoreSheet(row.id, row.statusId); }, onShowAlert: showAlert, onOpenForm: function (row) { return setSelectedRow(row); } })));
};
exports.default = EvaluationTab;
//# sourceMappingURL=EvaluationTab.js.map