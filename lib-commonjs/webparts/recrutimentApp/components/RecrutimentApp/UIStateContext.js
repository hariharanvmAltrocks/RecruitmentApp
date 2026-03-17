"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUIState = exports.UIProvider = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var UIContext = (0, react_1.createContext)(null);
var UIProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(0), activeMenuID = _b[0], setActiveMenuID = _b[1];
    var _c = (0, react_1.useState)(""), activeTab = _c[0], setActiveTab = _c[1];
    var _d = (0, react_1.useState)(""), navigationPath = _d[0], setNavigationPath = _d[1];
    var _e = (0, react_1.useState)(0), MatricID = _e[0], setMatricID = _e[1];
    return (react_1.default.createElement(UIContext.Provider, { value: {
            activeMenuID: activeMenuID,
            activeTab: activeTab,
            navigationPath: navigationPath,
            MatricID: MatricID,
            setMatricID: setMatricID,
            setActiveMenuID: setActiveMenuID,
            setActiveTab: setActiveTab,
            setNavigationPath: setNavigationPath
        } }, children));
};
exports.UIProvider = UIProvider;
var useUIState = function () {
    var context = (0, react_1.useContext)(UIContext);
    if (!context)
        throw new Error("useUIState must be used inside UIProvider");
    return context;
};
exports.useUIState = useUIState;
//# sourceMappingURL=UIStateContext.js.map