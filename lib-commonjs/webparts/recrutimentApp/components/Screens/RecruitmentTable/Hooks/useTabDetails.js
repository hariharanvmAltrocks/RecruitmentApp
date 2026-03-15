"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTabDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var MenuDataContext_1 = require("../../../../utilities/hooks/MenuDataContext");
var useStateHooks_1 = require("../../../RecrutimentApp/useStateHooks");
var mockTabs = [
    {
        key: "mySubmission",
        label: "My Submission",
        description: "Requests submitted by you",
        tableMode: "normal",
        actionMode: "view",
    },
    {
        key: "assignRecruitmentHR",
        label: "Assign Recruitment HR",
        description: "Assign an HR partner to vacancies",
        tableMode: "checkbox",
        actionMode: "view",
    },
    {
        key: "uploadOnemDoc",
        label: "Upload ONEM Doc",
        description: "Attach ONEM documentation",
        tableMode: "normal",
        actionMode: "upload",
    },
];
var getTabDetails = function (items) {
    var _a;
    return (_a = items === null || items === void 0 ? void 0 : items.map(function (item, index) { return (tslib_1.__assign(tslib_1.__assign({}, item), { Value: "tab".concat(index + 1) })); })) !== null && _a !== void 0 ? _a : [];
};
var useTabDetails = function () {
    var menuData = (0, MenuDataContext_1.useMenuData)().menuData;
    var activeMenuID = (0, useStateHooks_1.useStateHooks)().activeMenuID;
    var _a = (0, react_1.useState)([]), tabs = _a[0], setTabs = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        setLoading(true);
        var timer = setTimeout(function () {
            var _a;
            if (!isMounted)
                return;
            var selectedTabDetails = (_a = menuData === null || menuData === void 0 ? void 0 : menuData.reduce(function (acc, menu) {
                var _a, _b;
                var match = menu.SubMenu
                    ? (_a = menu.Children) === null || _a === void 0 ? void 0 : _a.find(function (child) { return (child === null || child === void 0 ? void 0 : child.Id) === activeMenuID; })
                    : (_b = menu.TabDetails) === null || _b === void 0 ? void 0 : _b.find(function (tab) { return (tab === null || tab === void 0 ? void 0 : tab.Id) === activeMenuID; });
                if (match)
                    acc.push.apply(acc, getTabDetails(match.TabDetails));
                return acc;
            }, [])) !== null && _a !== void 0 ? _a : [];
            console.log(selectedTabDetails);
            setTabs(mockTabs);
            setLoading(false);
        }, 0);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [activeMenuID, menuData]);
    return { tabs: tabs, loading: loading };
};
exports.useTabDetails = useTabDetails;
//# sourceMappingURL=useTabDetails.js.map