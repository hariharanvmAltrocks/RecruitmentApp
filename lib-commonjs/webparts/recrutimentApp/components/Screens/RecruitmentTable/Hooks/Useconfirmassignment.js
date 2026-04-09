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
var useConfirmAssignment = function (handleClosePopup, handleRefresh) {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, RoleContext_1.userInfo)(), roleIDs = _a.roleIDs, ADGroupData = _a.ADGroupData;
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    var showError = (0, useToast_1.useToast)().showError;
    var _b = (0, useModalPopup_1.useModalPopup)(), modalState = _b.modalState, showModal = _b.showModal, closeModal = _b.closeModal;
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
                    _d.trys.push([1, 11, , 12]);
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
                    return [4 /*yield*/, Promise.all(vacancyDetailResults.map(function (_a) { return tslib_1.__awaiter(void 0, [_a], void 0, function (_b) {
                            var JDEData;
                            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                            var vacancy = _b.vacancy, jobDetail = _b.jobDetail;
                            return tslib_1.__generator(this, function (_u) {
                                switch (_u.label) {
                                    case 0: return [4 /*yield*/, ServiceExport_1.masterService.fetchJDEEmailIDs(jobDetail.BusinessUnitCodeId)];
                                    case 1:
                                        JDEData = _u.sent();
                                        // let StatusID = WorkflowConfig(MatricID)
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
                                                    EnterNumberOfMonths: (_c = jobDetail.EnterNumberOfMonths) !== null && _c !== void 0 ? _c : "0",
                                                    TypeOfContract: jobDetail.TypeOfContract,
                                                    DateRequried: (_d = jobDetail.DateRequried) !== null && _d !== void 0 ? _d : null,
                                                    StatusId: Config_1.StatusId.PendingUploadAdvert,
                                                    JobCodeId: jobDetail.JobCodeId,
                                                    AreaofWork: jobDetail.AreaofWork,
                                                    AssignedHR: userIDResult_1.data,
                                                    RecruitmentHRLead: Array.isArray(ADGroupData.EmailId)
                                                        ? ((_e = ADGroupData.EmailId[0]) !== null && _e !== void 0 ? _e : "")
                                                        : ((_f = ADGroupData.EmailId) !== null && _f !== void 0 ? _f : ""),
                                                    DataFrom: (_g = jobDetail.Type) !== null && _g !== void 0 ? _g : "",
                                                    Location: (_h = jobDetail.Location) !== null && _h !== void 0 ? _h : "",
                                                    LineManager: (_k = (_j = JDEData === null || JDEData === void 0 ? void 0 : JDEData.data) === null || _j === void 0 ? void 0 : _j.LineManagerEmail) !== null && _k !== void 0 ? _k : "",
                                                    HOD: (_m = (_l = JDEData === null || JDEData === void 0 ? void 0 : JDEData.data) === null || _l === void 0 ? void 0 : _l.HODEmail) !== null && _m !== void 0 ? _m : "",
                                                },
                                                PositionData: {
                                                    PatersonGradeId: (_o = jobDetail.PatersonGradeId) !== null && _o !== void 0 ? _o : 0,
                                                    DRCGradeId: (_p = jobDetail.DRCGradeId) !== null && _p !== void 0 ? _p : 0,
                                                    JobTitleEnglishId: (_q = jobDetail.JobTitleEnglishId) !== null && _q !== void 0 ? _q : 0,
                                                    JobTitleFrenchId: (_r = jobDetail.JobTitleFrenchId) !== null && _r !== void 0 ? _r : 0,
                                                },
                                                CommentsList: {
                                                    RoleId: roleIDs[0],
                                                    RecruitmentIDId: 0,
                                                    Comments: (_s = payload.comments) !== null && _s !== void 0 ? _s : "",
                                                },
                                                updatePreList: {
                                                    ID: (_t = vacancy.ItemID) !== null && _t !== void 0 ? _t : 0,
                                                    ActionId: Config_1.WorkflowAction.Approved,
                                                    ItemCreated: "Yes",
                                                    IsDataSyncToRecruitment: "No",
                                                },
                                            }];
                                }
                            });
                        }); }))];
                case 6:
                    batchPayloads = _d.sent();
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.InsertRecruitmentDptBatch(batchPayloads)];
                case 7:
                    batchResponse = _d.sent();
                    if (batchResponse.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        showModal({
                            type: "success",
                            title: "Assignment Successfully",
                            message: payload.vacancies.length > 1
                                ? ConditionConfig_1.RecuritmentHRMsg.HRSuccess
                                : ConditionConfig_1.RecuritmentHRMsg.SingleHRSuccessMsg,
                            confirmLabel: "Go to Dashboard",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/Dashboard");
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
                            confirmLabel: "Go to Dashboard",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/RecruitmentTable");
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
                            confirmLabel: "Go to Dashboard",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/RecruitmentTable");
                                handleRefresh();
                            },
                        });
                        Submitted.current = true;
                    }
                    else {
                        Submitted.current = false;
                        showError("Something went wrong. Please try again.");
                    }
                    _d.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_1 = _d.sent();
                    Submitted.current = false;
                    console.error("Critical error during submission:", error_1);
                    showError("An unexpected error occurred. Please try again.");
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); }, [roleIDs, ADGroupData, navigate, showModal, closeModal, showError]);
    return {
        handleConfirmAssignment: handleConfirmAssignment,
        Submitted: Submitted,
        modalState: modalState,
        closeModal: closeModal,
    };
};
exports.useConfirmAssignment = useConfirmAssignment;
//# sourceMappingURL=Useconfirmassignment.js.map