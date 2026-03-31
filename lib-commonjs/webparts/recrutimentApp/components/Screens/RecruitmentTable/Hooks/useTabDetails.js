"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTabDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var MenuDataContext_1 = require("../../../../utilities/hooks/MenuDataContext");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var reusehooks_1 = require("../../../Hooks/reusehooks");
var getTabDetails = function (items, roleIDs) {
    var _a;
    return (_a = items === null || items === void 0 ? void 0 : items.map(function (item, index) {
        var _a, _b;
        return (tslib_1.__assign(tslib_1.__assign({}, item), { Value: "tab".concat(index + 1), MatricID: (0, reusehooks_1.findMatricID)(roleIDs, Number((_b = (_a = item.StatusDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.StatusId), item.TabName) }));
    })) !== null && _a !== void 0 ? _a : [];
};
var useTabDetails = function () {
    var menuData = (0, MenuDataContext_1.useMenuData)().menuData;
    var activeMenuID = (0, UIStateContext_1.useUIState)().activeMenuID;
    var roleIDs = (0, RoleContext_1.useRoleContext)().roleIDs;
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
                    acc.push.apply(acc, getTabDetails(match.TabDetails, roleIDs));
                return acc;
            }, [])) !== null && _a !== void 0 ? _a : [];
            var normalize = function (value) {
                return value.replace(/\s+/g, "").toLowerCase();
            };
            var orderedTabDetails = tslib_1.__spreadArray([], selectedTabDetails, true);
            var mySubmissionIndex = orderedTabDetails.findIndex(function (tab) { var _a; return normalize((_a = tab.TabName) !== null && _a !== void 0 ? _a : "") === "mysubmission"; });
            if (mySubmissionIndex > 0) {
                var mySubmission = orderedTabDetails.splice(mySubmissionIndex, 1)[0];
                orderedTabDetails.unshift(mySubmission);
            }
            var HRLead = roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.RecruitmentHRLead);
            var HR = roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.RecruitmentHR);
            var mappedTabs = orderedTabDetails.map(function (tab) {
                var _a, _b, _c;
                return ({
                    key: tab.Value,
                    label: tab.TabName,
                    description: tab.TabName,
                    tableMode: (HRLead && tab.Value === "tab1") ||
                        (tab.TabName != ConditionConfig_1.TabName.AssignInterviewPanel &&
                            HR &&
                            tab.Value === "tab2")
                        ? "checkbox"
                        : "normal",
                    actionMode: (Array.isArray((_a = tab.StatusDetails[0]) === null || _a === void 0 ? void 0 : _a.Action)
                        ? (_b = tab.StatusDetails[0]) === null || _b === void 0 ? void 0 : _b.Action[0]
                        : (_c = tab.StatusDetails[0]) === null || _c === void 0 ? void 0 : _c.Action),
                    matricId: tab.MatricID,
                });
            });
            setTabs(mappedTabs);
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