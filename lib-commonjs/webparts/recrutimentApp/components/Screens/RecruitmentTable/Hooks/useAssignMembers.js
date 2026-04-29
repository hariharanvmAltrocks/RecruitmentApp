"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssignMembers = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var Config_1 = require("../../../../utilities/Config");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useAssignMembers = function (Nationality) {
    var _a = (0, react_1.useState)([]), members = _a[0], setMembers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var isRecruitmentHRLead = roleIDs.includes(Config_1.RoleID.RecruitmentHRLead);
    var fetchAgencyOptions = (0, react_1.useCallback)(function (nationality) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var Filter, filteredAgents, mappedMembers, e_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!nationality) {
                        setMembers([]);
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    Filter = [
                        { FilterKey: "Nationality", Operator: "eq", FilterValue: nationality },
                        {
                            FilterKey: "UserType",
                            Operator: "eq",
                            FilterValue: Config_1.ExternalUserType.Agent,
                        },
                    ];
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSExternalAgents, Filter)];
                case 2:
                    filteredAgents = (_b.sent()).data;
                    mappedMembers = (_a = filteredAgents === null || filteredAgents === void 0 ? void 0 : filteredAgents.map(function (item) {
                        var _a, _b, _c;
                        return ({
                            id: item.Id,
                            name: item.AgentName,
                            role: "Agency",
                            initials: ((_c = (_b = (_a = item.AgentName) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) === null || _b === void 0 ? void 0 : _b.slice(0, 2)) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "",
                        });
                    })) !== null && _a !== void 0 ? _a : [];
                    setMembers(mappedMembers);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.error("Failed to fetch agency options:", e_1);
                    setError("Failed to load agency members");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var fetchRecruitmentHRMembers = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var userRoles, recruitmentHRRole, _a, status_1, data, mappedMembers, e_2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    setError(undefined);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSRecruitmentUserRole)];
                case 2:
                    userRoles = (_b.sent()).data;
                    recruitmentHRRole = userRoles === null || userRoles === void 0 ? void 0 : userRoles.find(function (item) { return item.ID === Config_1.RoleID.RecruitmentHR; });
                    if (!(recruitmentHRRole === null || recruitmentHRRole === void 0 ? void 0 : recruitmentHRRole.ADGroupID)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetADgruopsEmailIDs(recruitmentHRRole.ADGroupID)];
                case 3:
                    _a = _b.sent(), status_1 = _a.status, data = _a.data;
                    if (status_1 === 200 && data) {
                        mappedMembers = data.map(function (item) {
                            var _a, _b, _c;
                            return ({
                                id: item.key,
                                name: item.text,
                                role: "Recruitment HR",
                                initials: ((_c = (_b = (_a = item.text) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) === null || _b === void 0 ? void 0 : _b.slice(0, 2)) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || "",
                            });
                        });
                        setMembers(mappedMembers);
                    }
                    return [3 /*break*/, 5];
                case 4: throw new Error("Failed to fetch HR group emails.");
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_2 = _b.sent();
                    console.error(e_2);
                    setError(e_2.message || "Something went wrong");
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (Nationality === null) {
            setMembers([]);
            setLoading(false);
            return;
        }
        if (isRecruitmentHRLead) {
            void fetchRecruitmentHRMembers();
            return;
        }
        var isMounted = true;
        setLoading(true);
        setError(undefined);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isMounted)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetchAgencyOptions(Nationality)];
                    case 1:
                        _a.sent();
                        if (isMounted)
                            setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 500);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [Nationality, isRecruitmentHRLead, fetchAgencyOptions]);
    var memoizedMembers = (0, react_1.useMemo)(function () { return members; }, [members]);
    return {
        members: memoizedMembers,
        loading: loading,
        error: error,
    };
};
exports.useAssignMembers = useAssignMembers;
//# sourceMappingURL=useAssignMembers.js.map