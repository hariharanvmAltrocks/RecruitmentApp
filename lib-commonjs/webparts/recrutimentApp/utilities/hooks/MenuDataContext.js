"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMenuData = exports.MenuDataProvider = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var RoleContext_1 = require("./RoleContext");
var ServiceExport_1 = require("../../services/ServiceExport");
var MenuDataContext = (0, react_1.createContext)(undefined);
var MenuDataProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), menuData = _b[0], setMenuData = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), error = _d[0], setError = _d[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var fetchMenu = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var response, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!roleIDs)
                        return [2 /*return*/]; // Don't fetch if not logged in
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ServiceExport_1.menuService.getSwitchUserMatrix(roleIDs)];
                case 2:
                    response = _a.sent();
                    if (response.status === 200) {
                        setMenuData(response.data);
                    }
                    else {
                        throw new Error('Failed to fetch menu');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        void fetchMenu();
    }, [roleIDs]);
    return (react_1.default.createElement(MenuDataContext.Provider, { value: { menuData: menuData, isLoading: isLoading, error: error, refreshMenu: fetchMenu } }, children));
};
exports.MenuDataProvider = MenuDataProvider;
var useMenuData = function () {
    var context = (0, react_1.useContext)(MenuDataContext);
    if (!context)
        throw new Error('useMenuData must be used within a MenuDataProvider');
    return context;
};
exports.useMenuData = useMenuData;
//# sourceMappingURL=MenuDataContext.js.map