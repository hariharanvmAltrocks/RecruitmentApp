"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBreadcrumbPath = exports.getIcon = exports.IconMap = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
exports.IconMap = {
    dashboard: lucide_react_1.LayoutDashboard,
    users: lucide_react_1.Users,
    recruitment: lucide_react_1.Briefcase,
    reports: lucide_react_1.FileText,
    settings: lucide_react_1.Settings,
    search: lucide_react_1.FileSearch,
    default: lucide_react_1.Circle
};
var getIcon = function (iconName) { return exports.IconMap[iconName === null || iconName === void 0 ? void 0 : iconName.toLowerCase()] || exports.IconMap.default; };
exports.getIcon = getIcon;
var findBreadcrumbPath = function (menu, path) {
    for (var _i = 0, menu_1 = menu; _i < menu_1.length; _i++) {
        var item = menu_1[_i];
        if (item.Path === path)
            return [item];
        if (item.Children) {
            var childPath = (0, exports.findBreadcrumbPath)(item.Children, path);
            if (childPath.length > 0)
                return tslib_1.__spreadArray([item], childPath, true);
        }
    }
    return [];
};
exports.findBreadcrumbPath = findBreadcrumbPath;
//# sourceMappingURL=menuUtils.js.map