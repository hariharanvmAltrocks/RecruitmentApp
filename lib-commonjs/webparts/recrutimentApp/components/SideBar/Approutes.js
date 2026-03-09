"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Dashboard_1 = tslib_1.__importDefault(require("../Screens/Dashboard/Dashboard"));
var react_router_dom_1 = require("react-router-dom");
var AppRoutes = function (_a) {
    var props = _a.props;
    return (react_1.default.createElement(react_router_dom_1.Routes, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/Dashboard", element: react_1.default.createElement(Dashboard_1.default, tslib_1.__assign({}, props)) })));
};
exports.default = AppRoutes;
//# sourceMappingURL=Approutes.js.map