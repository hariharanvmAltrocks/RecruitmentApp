"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RecruitmentProcess_module_scss_1 = tslib_1.__importDefault(require("./RecruitmentProcess.module.scss"));
var EvaluationTab_1 = tslib_1.__importDefault(require("./tabs/EvaluationTab/EvaluationTab"));
var TABS = [
    { id: "my-submission", label: "My Submission" },
    { id: "review-advert", label: "Review Advert" },
    { id: "Evaluation", label: "Evaluation" },
    { id: "review-scorecard", label: "Review Scorecard" },
];
var RecruitmentProcess = function (props) {
    var _a, _b;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var defaultTab = (_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.defaultTab) !== null && _b !== void 0 ? _b : "my-submission";
    var _c = (0, react_1.useState)(defaultTab), activeTab = _c[0], setActiveTab = _c[1];
    var _d = (0, react_1.useState)(false), isFormOpen = _d[0], setIsFormOpen = _d[1];
    var handleFormStateChange = function (isOpen) {
        try {
            setIsFormOpen(isOpen);
            if (props.onFormStateChange) {
                props.onFormStateChange(isOpen);
            }
        }
        catch (error) {
            console.error("Error toggling form state:", error);
        }
    };
    var renderContent = function () {
        var _a, _b;
        switch (activeTab) {
            case "Evaluation":
                return (react_1.default.createElement(EvaluationTab_1.default, { employeeList: (_a = props.EmployeeList) !== null && _a !== void 0 ? _a : [], onFormStateChange: handleFormStateChange }));
            default:
                return (react_1.default.createElement("div", { className: RecruitmentProcess_module_scss_1.default.placeholder }, (_b = TABS.find(function (t) { return t.id === activeTab; })) === null || _b === void 0 ? void 0 :
                    _b.label,
                    " \u2014 coming soon."));
        }
    };
    return (react_1.default.createElement("div", { className: "".concat(RecruitmentProcess_module_scss_1.default.page, " ").concat(isFormOpen ? RecruitmentProcess_module_scss_1.default.pageFormOpen : "") },
        !isFormOpen && (react_1.default.createElement("div", { className: RecruitmentProcess_module_scss_1.default.tabBar }, TABS.map(function (tab) { return (react_1.default.createElement("button", { key: tab.id, className: "".concat(RecruitmentProcess_module_scss_1.default.tabBtn, " ").concat(activeTab === tab.id ? RecruitmentProcess_module_scss_1.default.active : ""), onClick: function () { return setActiveTab(tab.id); } }, tab.label)); }))),
        react_1.default.createElement("div", null, renderContent())));
};
exports.default = RecruitmentProcess;
//# sourceMappingURL=RecruitmentProcess.js.map