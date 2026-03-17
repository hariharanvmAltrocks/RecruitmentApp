"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssignMembers = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var Config_1 = require("../../../../utilities/Config");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
// const mockMembers: HrMember[] = [
//   {
//     id: "hr-1",
//     name: "Alex Mwamba",
//     role: "Senior HR Partner",
//     initials: "AM",
//   },
//   {
//     id: "hr-2",
//     name: "Sara Mensah",
//     role: "Recruitment Specialist",
//     initials: "SM",
//   },
//   {
//     id: "hr-3",
//     name: "Rahul Perera",
//     role: "Talent Acquisition",
//     initials: "RP",
//   },
//   {
//     id: "hr-4",
//     name: "Maria Okoro",
//     role: "HR Business Partner",
//     initials: "MO",
//   },
// ];
var useAssignMembers = function (Nationality) {
    var _a = (0, react_1.useState)([]), members = _a[0], setMembers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var fetchAgencyOptions = (0, react_1.useCallback)(function (nationality) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var Filter, filteredAgents, mappedMembers, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!nationality) {
                        setMembers([]);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
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
                    filteredAgents = (_a.sent()).data;
                    mappedMembers = filteredAgents.map(function (item) { return ({
                        id: item.Id,
                        name: item.AgentName,
                        role: "Agency",
                        initials: item.AgentName.split(" ")[0].slice(0, 2).toUpperCase(),
                    }); });
                    setMembers(mappedMembers);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Failed to fetch agency options for ".concat(nationality, ":"), e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var userRoles, recruitmentHRRole, _a, status_1, data, message, mappedMembers;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isMounted) {
                            return [2 /*return*/];
                        }
                        if (!!roleIDs.includes(Config_1.RoleID.RecruitmentHR)) return [3 /*break*/, 5];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSRecruitmentUserRole)];
                    case 1:
                        userRoles = (_b.sent()).data;
                        recruitmentHRRole = userRoles === null || userRoles === void 0 ? void 0 : userRoles.find(function (item) { return item.ID === Config_1.RoleID.RecruitmentHR; });
                        if (!(recruitmentHRRole === null || recruitmentHRRole === void 0 ? void 0 : recruitmentHRRole.ADGroupID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetADgruopsEmailIDs(recruitmentHRRole.ADGroupID)];
                    case 2:
                        _a = _b.sent(), status_1 = _a.status, data = _a.data, message = _a.message;
                        if (status_1 === 200 && data) {
                            console.log(data, "datatata");
                            mappedMembers = data.map(function (item) { return ({
                                id: item.key,
                                name: item.text,
                                role: "Recruitment HR",
                                initials: item.text.split(" ")[0].slice(0, 2).toUpperCase(),
                            }); });
                            setMembers(mappedMembers);
                        }
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Failed to fetch HR group emails.");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        fetchAgencyOptions(Nationality);
                        _b.label = 6;
                    case 6:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 900);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);
    var memoizedMembers = (0, react_1.useMemo)(function () { return members; }, [members]);
    return {
        members: memoizedMembers,
        loading: loading,
    };
};
exports.useAssignMembers = useAssignMembers;
//# sourceMappingURL=useAssignMembers.js.map