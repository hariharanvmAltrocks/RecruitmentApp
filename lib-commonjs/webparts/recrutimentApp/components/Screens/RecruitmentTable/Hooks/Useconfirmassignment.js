"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfirmAssignment = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var Config_1 = require("../../../../utilities/Config");
var useToast_1 = require("../../../Hooks/useToast");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var useConfirmAssignment = function (handleClosePopup, handleRefresh) {
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, RoleContext_1.userInfo)(), roleIDs = _b.roleIDs, ADGroupData = _b.ADGroupData;
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    var showError = (0, useToast_1.useToast)().showError;
    var _c = (0, useModalPopup_1.useModalPopup)(), modalState = _c.modalState, showModal = _c.showModal, closeModal = _c.closeModal;
    var Submitted = (0, react_1.useRef)(false);
    var handleConfirmAssignment = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isHRLead, userIDResult_1, _a, vacancyDetailResults, unresolved, batchPayloads, batchResponse, batchPayloads, batchResponse, error_1;
        var _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    Submitted.current = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 11, 12, 13]);
                    setLoading(true);
                    isHRLead = roleIDs.includes(Config_1.RoleID.RecruitmentHRLead);
                    if (!isHRLead) return [3 /*break*/, 3];
                    return [4 /*yield*/, ServiceExport_1.CommonServices.getUserIDByEmail((_c = Number((_b = payload.member) === null || _b === void 0 ? void 0 : _b.id)) !== null && _c !== void 0 ? _c : 0)];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = null;
                    _d.label = 4;
                case 4:
                    userIDResult_1 = _a;
                    if (!isHRLead) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.all(payload.vacancies.map(function (vacancy) {
                            var filter = [
                                {
                                    FilterKey: "ID",
                                    Operator: "eq",
                                    FilterValue: vacancy.ItemID,
                                },
                            ];
                            return ServiceExport_1.RecruitmentServices.GetNPAEPVRRDetails(filter, "and", vacancy.requestType).then(function (res) {
                                var _a, _b;
                                return ({
                                    vacancy: vacancy,
                                    jobDetail: (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null,
                                });
                            });
                        }))];
                case 5:
                    vacancyDetailResults = _d.sent();
                    unresolved = vacancyDetailResults.filter(function (r) { return !r.jobDetail; });
                    if (unresolved.length) {
                        console.warn("Unresolved job details:", unresolved);
                        Submitted.current = false;
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(vacancyDetailResults.map(function (_a) {
                            var vacancy = _a.vacancy, jobDetail = _a.jobDetail;
                            return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                var JDEData, existingItems, JobUniqueKey, maxNumber, nextNumber, paddedNumber;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                                return tslib_1.__generator(this, function (_t) {
                                    switch (_t.label) {
                                        case 0: return [4 /*yield*/, ServiceExport_1.masterService.fetchJDEEmailIDs(jobDetail.BusinessUnitCodeId)];
                                        case 1:
                                            JDEData = _t.sent();
                                            return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                    Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                                    Select: "*",
                                                    FilterCondition: "and",
                                                    Filter: [
                                                        {
                                                            FilterKey: "JobCodeId",
                                                            Operator: "eq",
                                                            FilterValue: jobDetail.JobCodeId,
                                                        },
                                                        {
                                                            FilterKey: "IsActive",
                                                            Operator: "eq",
                                                            FilterValue: 1,
                                                        },
                                                    ],
                                                })];
                                        case 2:
                                            existingItems = _t.sent();
                                            JobUniqueKey = "";
                                            if (!existingItems || existingItems.length === 0) {
                                                JobUniqueKey = "".concat(jobDetail.JobCode, "_001");
                                            }
                                            else {
                                                maxNumber = Math.max.apply(Math, existingItems.map(function (item) {
                                                    var key = item.JobUniqueKey || "";
                                                    var parts = key.split("-");
                                                    return parseInt(parts[1], 10) || 0;
                                                }));
                                                nextNumber = maxNumber + 1;
                                                paddedNumber = nextNumber <= 999
                                                    ? String(nextNumber).padStart(3, "0")
                                                    : String(nextNumber);
                                                JobUniqueKey = "".concat(jobDetail.JobCode, "-").concat(paddedNumber);
                                            }
                                            return [2 /*return*/, {
                                                    Data: {
                                                        BusinessUnitCodeId: jobDetail.BusinessUnitCodeId,
                                                        Nationality: jobDetail.Nationality,
                                                        EmploymentCategory: jobDetail.EmploymentCategory,
                                                        DepartmentId: jobDetail.DepartmentId,
                                                        SubDepartmentId: jobDetail.SubDepartmentId,
                                                        SectionId: jobDetail.SectionId,
                                                        DepartmentCodeId: jobDetail.DepartmentCodeId,
                                                        NumberOfPersonNeeded: Number(jobDetail.NumberOfPersonNeeded),
                                                        EnterNumberOfMonths: (_b = jobDetail.EnterNumberOfMonths) !== null && _b !== void 0 ? _b : "0",
                                                        TypeOfContract: jobDetail.TypeOfContract,
                                                        DateRequried: (_c = jobDetail.DateRequried) !== null && _c !== void 0 ? _c : null,
                                                        StatusId: Config_1.StatusId.PendingUploadAdvert,
                                                        JobCodeId: jobDetail.JobCodeId,
                                                        AreaofWork: jobDetail.AreaofWork,
                                                        AssignedHR: userIDResult_1.data,
                                                        RecruitmentHRLead: Array.isArray(ADGroupData.EmailId)
                                                            ? ((_d = ADGroupData.EmailId[0]) !== null && _d !== void 0 ? _d : "")
                                                            : ((_e = ADGroupData.EmailId) !== null && _e !== void 0 ? _e : ""),
                                                        DataFrom: (_f = jobDetail.Type) !== null && _f !== void 0 ? _f : "",
                                                        Location: (_g = jobDetail.Location) !== null && _g !== void 0 ? _g : "",
                                                        LineManager: (_j = (_h = JDEData === null || JDEData === void 0 ? void 0 : JDEData.data) === null || _h === void 0 ? void 0 : _h.LineManagerEmail) !== null && _j !== void 0 ? _j : "",
                                                        HOD: (_l = (_k = JDEData === null || JDEData === void 0 ? void 0 : JDEData.data) === null || _k === void 0 ? void 0 : _k.HODEmail) !== null && _l !== void 0 ? _l : "",
                                                    },
                                                    PositionData: {
                                                        PatersonGradeId: (_m = jobDetail.PatersonGradeId) !== null && _m !== void 0 ? _m : 0,
                                                        DRCGradeId: (_o = jobDetail.DRCGradeId) !== null && _o !== void 0 ? _o : 0,
                                                        JobTitleEnglishId: (_p = jobDetail.JobTitleEnglishId) !== null && _p !== void 0 ? _p : 0,
                                                        JobTitleFrenchId: (_q = jobDetail.JobTitleFrenchId) !== null && _q !== void 0 ? _q : 0,
                                                    },
                                                    CommentsList: {
                                                        RoleId: roleIDs[0],
                                                        RecruitmentIDId: 0,
                                                        Comments: (_r = payload.comments) !== null && _r !== void 0 ? _r : "",
                                                    },
                                                    updatePreList: {
                                                        ID: (_s = vacancy.ItemID) !== null && _s !== void 0 ? _s : 0,
                                                        ActionId: Config_1.WorkflowAction.Approved,
                                                        ItemCreated: "Yes",
                                                        IsDataSyncToRecruitment: "No",
                                                    },
                                                    CareerPortalIntegration: {
                                                        JobCode: jobDetail.JobCode,
                                                        JobUniqueKey: JobUniqueKey,
                                                    },
                                                }];
                                    }
                                });
                            });
                        }))];
                case 6:
                    batchPayloads = _d.sent();
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.InsertRecruitmentDptBatch(batchPayloads)];
                case 7:
                    batchResponse = _d.sent();
                    if (batchResponse.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        showModal({
                            type: "success",
                            title: "Assigned Successfully",
                            message: payload.vacancies.length > 1
                                ? ConditionConfig_1.RecuritmentHRMsg.HRSuccess
                                : ConditionConfig_1.RecuritmentHRMsg.SingleHRSuccessMsg,
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/MyTracker");
                                handleRefresh();
                            },
                        });
                        Submitted.current = true;
                    }
                    else {
                        Submitted.current = false;
                        showModal({
                            type: "error",
                            title: "Assignment Failed",
                            message: "Something went wrong. Please try again.",
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/MyTracker");
                                handleRefresh();
                            },
                        });
                    }
                    return [3 /*break*/, 10];
                case 8:
                    batchPayloads = payload.vacancies.map(function (vacancy) {
                        var _a, _b, _c;
                        return ({
                            Data: {
                                AgentId: Number((_a = payload.member) === null || _a === void 0 ? void 0 : _a.id),
                                JobCodeId: Number(vacancy.jobCodeID),
                                RecrutimentId: Number(vacancy.ItemID),
                            },
                            AgentProfileData: {
                                jobCode: String(vacancy.jobCodeID),
                                jobsXAgents: [
                                    {
                                        agentId: String((_b = payload.member) === null || _b === void 0 ? void 0 : _b.id),
                                    },
                                ],
                            },
                            CommentsList: {
                                RoleId: roleIDs[0],
                                RecruitmentIDId: Number(vacancy.ItemID),
                                Comments: (_c = payload.comments) !== null && _c !== void 0 ? _c : "",
                            },
                        });
                    });
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.InsertExternalAgencyDetails(batchPayloads)];
                case 9:
                    batchResponse = _d.sent();
                    if (batchResponse.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        showModal({
                            type: "success",
                            title: "Agent Assignment Successfully",
                            message: payload.vacancies.length > 1
                                ? ConditionConfig_1.RecuritmentHRMsg.AgencySucess
                                : ConditionConfig_1.RecuritmentHRMsg.SingleAgencyMsg,
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/MyTracker");
                                handleRefresh();
                            },
                        });
                        Submitted.current = true;
                    }
                    else {
                        Submitted.current = false;
                        showModal({
                            type: "error",
                            title: "Assignment Failed",
                            message: "Something went wrong. Please try again.",
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/MyTracker");
                                handleRefresh();
                            },
                        });
                    }
                    _d.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11:
                    error_1 = _d.sent();
                    Submitted.current = false;
                    console.error("Critical error during submission:", error_1);
                    showError("An unexpected error occurred. Please try again.");
                    return [3 /*break*/, 13];
                case 12:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); }, [roleIDs, ADGroupData, navigate, showModal, closeModal, showError]);
    return {
        handleConfirmAssignment: handleConfirmAssignment,
        Submitted: Submitted,
        modalState: modalState,
        closeModal: closeModal,
        loading: loading,
    };
};
exports.useConfirmAssignment = useConfirmAssignment;
//# sourceMappingURL=Useconfirmassignment.js.map