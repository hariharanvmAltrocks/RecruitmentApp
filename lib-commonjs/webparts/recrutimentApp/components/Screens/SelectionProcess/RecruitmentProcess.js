"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RecruitmentProcess_module_scss_1 = tslib_1.__importDefault(require("./RecruitmentProcess.module.scss"));
var EvaluationTab_1 = tslib_1.__importDefault(require("./tabs/EvaluationTab/EvaluationTab"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var Reviewscorecardtab_1 = tslib_1.__importDefault(require("./tabs/EvaluationTab/Reviewscorecardtab/Reviewscorecardtab"));
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
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var defaultTab = (_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.defaultTab) !== null && _b !== void 0 ? _b : "my-submission";
    var _c = React.useState(defaultTab), activeTab = _c[0], setActiveTab = _c[1];
    var _d = React.useState(false), isFormOpen = _d[0], setIsFormOpen = _d[1];
    var handleFormStateChange = function (isOpen) {
        setIsFormOpen(isOpen);
        if (props.onFormStateChange)
            props.onFormStateChange(isOpen);
    };
    var renderContent = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (activeTab) {
            case "Evaluation":
                return (React.createElement(EvaluationTab_1.default, { employeeList: (_a = props.EmployeeList) !== null && _a !== void 0 ? _a : [], onFormStateChange: handleFormStateChange }));
            case "review-scorecard":
                return (React.createElement(Reviewscorecardtab_1.default, { employeeList: (_b = props.EmployeeList) !== null && _b !== void 0 ? _b : [], userDetails: (_d = (_c = props.userDetails) !== null && _c !== void 0 ? _c : ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.RoleDetails) !== null && _d !== void 0 ? _d : [], CurrentUserEmailId: (_f = (_e = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : "", onFormStateChange: handleFormStateChange }));
            default:
                return (React.createElement("div", { className: RecruitmentProcess_module_scss_1.default.placeholder }, (_g = TABS.find(function (t) { return t.id === activeTab; })) === null || _g === void 0 ? void 0 :
                    _g.label,
                    " \u2014 coming soon."));
        }
    };
    return (React.createElement("div", { className: "".concat(RecruitmentProcess_module_scss_1.default.page, " ").concat(isFormOpen ? RecruitmentProcess_module_scss_1.default.pageFormOpen : "") },
        !isFormOpen && (React.createElement("div", { className: RecruitmentProcess_module_scss_1.default.tabBar }, TABS.map(function (tab) { return (React.createElement("button", { key: tab.id, className: "".concat(RecruitmentProcess_module_scss_1.default.tabBtn, " ").concat(activeTab === tab.id ? RecruitmentProcess_module_scss_1.default.active : ""), onClick: function () { return setActiveTab(tab.id); } }, tab.label)); }))),
        React.createElement("div", null, renderContent())));
};
exports.default = RecruitmentProcess;
//# sourceMappingURL=RecruitmentProcess.js.map