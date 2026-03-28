"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Dashboard_1 = tslib_1.__importDefault(require("../Screens/Dashboard/Dashboard"));
var react_router_dom_1 = require("react-router-dom");
var RecruitmentTable_1 = require("../Screens/RecruitmentTable/RecruitmentTable");
var Questioncreation_1 = tslib_1.__importDefault(require("../Screens/QuestionCreation/Questioncreation"));
var CandidateTable_1 = require("../Screens/CandidateTable/CandidateTable");
var Evalution_1 = require("../Screens/Evalution/Evalution");
var RecruitmentProcess_1 = tslib_1.__importDefault(require("../Screens/SelectionProcess/RecruitmentProcess"));
var AppRoutes = function (_a) {
    var props = _a.props, activeMenuId = _a.activeMenuId;
    return (react_1.default.createElement(react_router_dom_1.Routes, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/Dashboard", element: react_1.default.createElement(Dashboard_1.default, tslib_1.__assign({}, props)) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/RecruitmentTable", element: react_1.default.createElement(RecruitmentTable_1.RecruitmentTable, null) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/QuestionCreation", element: react_1.default.createElement(Questioncreation_1.default, tslib_1.__assign({}, props)) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/CandidateTable", element: react_1.default.createElement(CandidateTable_1.CandidateTable, tslib_1.__assign({}, props)) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/Evalution", element: react_1.default.createElement(Evalution_1.Evalution, tslib_1.__assign({}, props)) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/RecurimentProcess", element: react_1.default.createElement(RecruitmentProcess_1.default, tslib_1.__assign({}, props)) })));
};
exports.default = AppRoutes;
//# sourceMappingURL=Approutes.js.map