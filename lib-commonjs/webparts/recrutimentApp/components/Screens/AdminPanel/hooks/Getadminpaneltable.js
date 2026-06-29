"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdminPanelTable = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ServiceExport_1 = require("../../../../services/ServiceExport");
// ─── Hook ─────────────────────────────────────────────────────────────────────
var useAdminPanelTable = function (_a) {
    var _b;
    var type = _a.type, initialPageSize = _a.initialPageSize;
    var matricId = (0, UIStateContext_1.useUIState)().MatricID;
    var _c = (0, RoleContext_1.userInfo)(), roleIDs = _c.roleIDs, ADGroupData = _c.ADGroupData;
    var emailId = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0];
    var _d = (0, react_1.useState)({
        data: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            pageSize: initialPageSize,
            totalItems: 0,
        },
    }), state = _d[0], setState = _d[1];
    var pageSizeRef = (0, react_1.useRef)(initialPageSize);
    var abortRef = (0, react_1.useRef)(null);
    var timerRef = (0, react_1.useRef)(null);
    var fetchPage = (0, react_1.useCallback)(function (page, pageSize) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var resolvedPageSize;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            if (!type)
                return [2 /*return*/];
            resolvedPageSize = pageSize !== null && pageSize !== void 0 ? pageSize : pageSizeRef.current;
            pageSizeRef.current = resolvedPageSize;
            (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            abortRef.current = new AbortController();
            if (timerRef.current)
                clearTimeout(timerRef.current);
            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { loading: true, error: null })); });
            timerRef.current = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var Filter, response, FilterType, FilterValue, res, getTotalItems, totalItems, err_1;
                var _a, _b;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            Filter = [
                                { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId },
                            ];
                            return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails(Filter, "and")];
                        case 1:
                            response = _c.sent();
                            if (!(response.status === 200 && response.data)) return [3 /*break*/, 3];
                            FilterType = type === "labour-hire"
                                ? Config_1.ExternalUserType.LabourHire
                                : Config_1.ExternalUserType.Agent;
                            FilterValue = {
                                hrUserId: String(response.data.ID),
                                type: FilterType,
                                pagination: {
                                    filterValue: "",
                                    sortBy: "",
                                    sortOrder: 0,
                                    pageSize: resolvedPageSize,
                                    currentPage: page - 1,
                                    totalItems: 0,
                                },
                            };
                            return [4 /*yield*/, ServiceExport_1.AdminPanelServices.getAdminPanelDashboard(FilterValue)];
                        case 2:
                            res = _c.sent();
                            getTotalItems = function (res) {
                                var _a;
                                return (res === null || res === void 0 ? void 0 : res.data) &&
                                    res.data.length > 0 &&
                                    ((_a = res.data[0]) === null || _a === void 0 ? void 0 : _a.TotalItems) &&
                                    res.data[0].TotalItems > 0
                                    ? res.data[0].TotalItems
                                    : 0;
                            };
                            totalItems = getTotalItems(res) || ((_a = res.data) === null || _a === void 0 ? void 0 : _a.length);
                            setState({
                                data: (_b = res.data) !== null && _b !== void 0 ? _b : [],
                                loading: false,
                                error: null,
                                pagination: {
                                    currentPage: page,
                                    pageSize: resolvedPageSize,
                                    totalItems: totalItems !== null && totalItems !== void 0 ? totalItems : 0,
                                },
                            });
                            _c.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            err_1 = _c.sent();
                            if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError")
                                return [2 /*return*/];
                            console.error("Adminpanel Dashboard: fetch failed", err_1);
                            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { loading: false, error: "Failed to load Adminpanel. Please try again." })); });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); }, 300);
            return [2 /*return*/];
        });
    }); }, [type, matricId, roleIDs]);
    var setPageSize = (0, react_1.useCallback)(function (size) {
        void fetchPage(1, size);
    }, [fetchPage]);
    var refresh = (0, react_1.useCallback)(function () {
        void fetchPage(state.pagination.currentPage, pageSizeRef.current);
    }, [fetchPage, state.pagination.currentPage]);
    (0, react_1.useEffect)(function () {
        void fetchPage(1, initialPageSize);
        return function () {
            var _a;
            (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, [type]);
    return tslib_1.__assign(tslib_1.__assign({}, state), { fetchPage: fetchPage, setPageSize: setPageSize, refresh: refresh });
};
exports.useAdminPanelTable = useAdminPanelTable;
//# sourceMappingURL=Getadminpaneltable.js.map