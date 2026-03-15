"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateHooks = void 0;
var react_1 = require("react");
var useStateHooks = function () {
    var _a = (0, react_1.useState)(0), activeMenuID = _a[0], setactiveMenuID = _a[1];
    var _b = (0, react_1.useState)(""), navigationPath = _b[0], setNavigationPath = _b[1];
    var _c = (0, react_1.useState)(""), activeTab = _c[0], setActiveTab = _c[1];
    return {
        activeMenuID: activeMenuID,
        setactiveMenuID: setactiveMenuID,
        navigationPath: navigationPath,
        setNavigationPath: setNavigationPath,
        activeTab: activeTab,
        setActiveTab: setActiveTab
    };
};
exports.useStateHooks = useStateHooks;
//# sourceMappingURL=useStateHooks.js.map