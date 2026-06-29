"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBGVStatusDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var UIStateContext_1 = require("../../../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var useBGVStatusDetails = function (jobRequestID, isActive) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)([]), bgvStatus = _b[0], setBGVStatus = _b[1];
    var _c = (0, react_1.useState)([]), bgvComments = _c[0], setBGVComments = _c[1];
    var _d = (0, react_1.useState)(false), rejectFlag = _d[0], setRejectFlag = _d[1];
    var _e = (0, react_1.useState)(false), allCompleted = _e[0], setAllCompleted = _e[1];
    var _f = (0, react_1.useState)(false), revertFLag = _f[0], setRevertflag = _f[1];
    var _g = (0, react_1.useState)(false), loading = _g[0], setLoading = _g[1];
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        if (!jobRequestID && !isActive)
            return;
        var fetchData = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var res, bgData, mappedStatus, remarks, revertflag, isRejected, allCompleted_1, error_1;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        setLoading(true);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, ServiceExport_1.OfferServices.CheckBGVerification(Number(jobRequestID))];
                    case 2:
                        res = _d.sent();
                        bgData = ((_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.bgVerification) || [];
                        if (!bgData.length) {
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        mappedStatus = bgData.map(function (item, index) {
                            var _a, _b;
                            var status = (_a = item.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
                            var result = (_b = item.result) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase();
                            var statusID = "";
                            if (status === ConditionConfig_1.DotAfricaStatus.Completed.toLowerCase() &&
                                result === ConditionConfig_1.DotAfricaStatus.Confirmed.toLowerCase()) {
                                statusID = "done";
                            }
                            else if ([
                                ConditionConfig_1.DotAfricaStatus.skipped,
                                ConditionConfig_1.DotAfricaStatus.skiped,
                                ConditionConfig_1.DotAfricaStatus.error,
                                ConditionConfig_1.DotAfricaStatus.cancelled,
                            ].includes(status)) {
                                statusID = "warning";
                            }
                            else {
                                statusID = "pending";
                            }
                            return {
                                id: index + 1,
                                name: item.bgType,
                                sub: item.bgTypeCode,
                                state: statusID,
                            };
                        }, []);
                        setBGVStatus(mappedStatus);
                        remarks = bgData
                            .filter(function (item) {
                            var _a;
                            return [
                                ConditionConfig_1.DotAfricaStatus.skipped,
                                ConditionConfig_1.DotAfricaStatus.skiped,
                                ConditionConfig_1.DotAfricaStatus.error,
                                ConditionConfig_1.DotAfricaStatus.cancelled,
                            ].includes((_a = item.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase());
                        })
                            .map(function (item, index) { return ({
                            id: index + 1,
                            BGVCode: item.bgTypeCode,
                            BGVType: item.bgType,
                            Remarks: item.remarks,
                        }); });
                        setBGVComments(remarks);
                        revertflag = (_c = bgData === null || bgData === void 0 ? void 0 : bgData.filter(function (item) { return item.bgTypeCode === "IDCS"; })) === null || _c === void 0 ? void 0 : _c.every(function (item) {
                            var _a, _b, _c, _d;
                            return ((_a = item.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) ===
                                ConditionConfig_1.DotAfricaStatus.skipped.trim().toLowerCase() ||
                                ((_b = item.status) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) ===
                                    ConditionConfig_1.DotAfricaStatus.skiped.trim().toLowerCase() ||
                                ((_c = item.status) === null || _c === void 0 ? void 0 : _c.trim().toLowerCase()) ===
                                    ConditionConfig_1.DotAfricaStatus.error.trim().toLowerCase() ||
                                ((_d = item.status) === null || _d === void 0 ? void 0 : _d.trim().toLowerCase()) ===
                                    ConditionConfig_1.DotAfricaStatus.cancelled.trim().toLowerCase();
                        });
                        setRevertflag(revertflag);
                        isRejected = bgData.some(function (item) {
                            var _a;
                            return [
                                ConditionConfig_1.DotAfricaStatus.skipped,
                                ConditionConfig_1.DotAfricaStatus.error,
                                ConditionConfig_1.DotAfricaStatus.cancelled,
                            ].includes((_a = item.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase());
                        });
                        setRejectFlag(isRejected);
                        allCompleted_1 = bgData.every(function (item) {
                            var _a, _b;
                            return ((_a = item.status) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) ===
                                ConditionConfig_1.DotAfricaStatus.Completed.toLowerCase() &&
                                ((_b = item.result) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase()) ===
                                    ConditionConfig_1.DotAfricaStatus.Confirmed.toLowerCase();
                        });
                        setAllCompleted(allCompleted_1);
                        setData(res.data[0]);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _d.sent();
                        console.error("Error fetching candidate details:", error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        void fetchData();
    }, [jobRequestID, MatricID]);
    return {
        data: data,
        bgvStatus: bgvStatus,
        bgvComments: bgvComments,
        revertFLag: revertFLag,
        rejectFlag: rejectFlag,
        allCompleted: allCompleted,
        loading: loading,
    };
};
exports.useBGVStatusDetails = useBGVStatusDetails;
//# sourceMappingURL=useStatusDetails.js.map