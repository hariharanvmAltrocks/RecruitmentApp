"use strict";
// ─── RecruitmentProcess.tsx ──────────────────────────────────────────────────
// 4 tabs: My Submission | Review Advert | Evaluation | Review Scorecard
// Selection Process sidebar click → navigate state { defaultTab: "evaluation" }
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RecruitmentProcess_module_scss_1 = tslib_1.__importDefault(require("./RecruitmentProcess.module.scss"));
var EvaluationTab_1 = tslib_1.__importDefault(require("./tabs/EvaluationTab/EvaluationTab"));
var TABS = [
    { id: "my-submission", label: "My Submission" },
    { id: "review-advert", label: "Review Advert" },
    { id: "evaluation", label: "Evaluation" },
    { id: "review-scorecard", label: "Review Scorecard" },
];
var RecruitmentProcess = function (props) {
    var _a, _b;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var defaultTab = (_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.defaultTab) !== null && _b !== void 0 ? _b : "my-submission";
    var _c = (0, react_1.useState)(defaultTab), activeTab = _c[0], setActiveTab = _c[1];
    var renderContent = function () {
        var _a, _b, _c;
        switch (activeTab) {
            case "evaluation":
                return (react_1.default.createElement(EvaluationTab_1.default, { currentUserEmail: (_a = props.CurrentUserEmailId) !== null && _a !== void 0 ? _a : "", employeeList: (_b = props.EmployeeList) !== null && _b !== void 0 ? _b : [] }));
            default:
                return (react_1.default.createElement("div", { className: RecruitmentProcess_module_scss_1.default.placeholder }, (_c = TABS.find(function (t) { return t.id === activeTab; })) === null || _c === void 0 ? void 0 :
                    _c.label,
                    " \u2014 coming soon."));
        }
    };
    return (react_1.default.createElement("div", { className: RecruitmentProcess_module_scss_1.default.page },
        react_1.default.createElement("nav", { className: RecruitmentProcess_module_scss_1.default.breadcrumb },
            react_1.default.createElement("span", { className: RecruitmentProcess_module_scss_1.default.crumb, onClick: function () { return navigate("/Dashboard"); } }, "HOME"),
            react_1.default.createElement("span", { className: RecruitmentProcess_module_scss_1.default.sep }, ">"),
            react_1.default.createElement("span", { className: RecruitmentProcess_module_scss_1.default.crumb, onClick: function () { return navigate("/Dashboard"); } }, "DASHBOARD"),
            react_1.default.createElement("span", { className: RecruitmentProcess_module_scss_1.default.sep }, ">"),
            react_1.default.createElement("span", { className: RecruitmentProcess_module_scss_1.default.current }, "ADVERT REVIEW")),
        react_1.default.createElement("h1", { className: RecruitmentProcess_module_scss_1.default.title }, "Recruitment Process"),
        react_1.default.createElement("div", { className: RecruitmentProcess_module_scss_1.default.tabBar }, TABS.map(function (tab) { return (react_1.default.createElement("button", { key: tab.id, className: "".concat(RecruitmentProcess_module_scss_1.default.tabBtn, " ").concat(activeTab === tab.id ? RecruitmentProcess_module_scss_1.default.active : ""), onClick: function () { return setActiveTab(tab.id); } }, tab.label)); })),
        react_1.default.createElement("div", null, renderContent())));
};
exports.default = RecruitmentProcess;
//# sourceMappingURL=RecruitmentProcess.js.map