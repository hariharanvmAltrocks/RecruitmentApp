"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var MyTracker_module_scss_1 = tslib_1.__importDefault(require("./MyTracker.module.scss"));
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var matric_1 = tslib_1.__importDefault(require("../../../Comman/MatricBox/matric"));
var DataTable_1 = require("../../../Comman/DataTable/DataTable");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var config_1 = require("../../RecruitmentTable/config");
var useAssignMembers_1 = require("../../RecruitmentTable/Hooks/useAssignMembers");
var Useconfirmassignment_1 = require("../../RecruitmentTable/Hooks/Useconfirmassignment");
var useadvertextend_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/SaveHooks/useadvertextend");
var useStateFromManage_1 = require("../../RecruitmentTable/AdvertReviewDrawer/StateManage/useStateFromManage");
var AdvertReviewDrawer_1 = require("../../RecruitmentTable/AdvertReviewDrawer/AdvertReviewDrawer");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../utilities/Config");
var Evaluationformservice_1 = require("../../Evalution/Evaluationservice/Evaluationformservice");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useRecruitmentDetails_1 = require("../../RecruitmentTable/Hooks/useRecruitmentDetails");
var ReviewDocument_1 = require("../../OfferRelease/ReviewDocument/ReviewDocument");
var Useupdatelistportal_1 = require("../../OfferRelease/ReviewDocument/Hooks/Useupdatelistportal");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var AssignHRPopup = react_1.default.lazy(function () {
    return Promise.resolve().then(function () { return tslib_1.__importStar(require("../../RecruitmentTable/Components/AssignHRPopup/AssignHRPopup")); }).then(function (module) { return ({
        default: module.AssignHRPopup,
    }); });
});
var AdvertExtension = react_1.default.lazy(function () {
    return Promise.resolve().then(function () { return tslib_1.__importStar(require("../../RecruitmentTable/Components/AdvertExtension/advertextension")); }).then(function (module) { return ({
        default: module.AdvertExtension,
    }); });
});
var Mytracker = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var _l = (0, UIStateContext_1.useUIState)(), activeMetric = _l.MatricID, setNavigationPath = _l.setNavigationPath, setActiveMenuID = _l.setActiveMenuID, setActiveTab = _l.setActiveTab, setMatricID = _l.setMatricID, setCurrentTabName = _l.setCurrentTabName, currentTabName = _l.currentTabName, navigationPath = _l.navigationPath;
    var _m = (0, react_1.useState)(0), refreshKey = _m[0], setRefreshKey = _m[1];
    var _o = (0, react_1.useState)([]), selectedIds = _o[0], setSelectedIds = _o[1];
    var _p = (0, react_1.useState)(10), pageSize = _p[0], setPageSize = _p[1];
    var _q = (0, react_1.useState)(1), currentPage = _q[0], setCurrentPage = _q[1];
    var _r = (0, react_1.useState)(false), isPopupOpen = _r[0], setIsPopupOpen = _r[1];
    var _s = (0, react_1.useState)(false), isadvertPopupOpen = _s[0], setAdvertPopupOpen = _s[1];
    var _t = (0, react_1.useState)(0), selectedMemberId = _t[0], setSelectedMemberId = _t[1];
    var _u = (0, react_1.useState)(currentTabName), selectedmatricId = _u[0], setselectedmatricId = _u[1];
    var _v = (0, react_1.useState)(false), drawerOfferOpen = _v[0], setDrawerOfferOpen = _v[1];
    var processingRef = (0, react_1.useRef)(false);
    var selectedAdvertID = (0, react_1.useRef)(0);
    var ref = (0, react_1.useRef)(0);
    var drawerMeta = (0, react_1.useRef)({
        isOpen: false,
        selectedType: "",
    });
    var _w = (0, useRecruitmentDetails_1.useRecruitmentDetails)(refreshKey), trackerData = _w.items, trackerLoading = _w.loading;
    var MatricData = (0, RoleContext_1.useRoleContext)().MatricData;
    // const martics = useDashboardMetrics(refreshKey);
    var items = trackerData || [];
    var updateList = (0, react_1.useMemo)(function () {
        return items.map(function (item) { return ({
            StatusID: item.statusId,
            ID: item.ItemID,
            JobRequestID: item.jobrequestID,
            EmploymentCategory: item.EmploymentCategory,
            IsExpat: item.IsExpat,
        }); });
    }, [items]);
    var updateListPortal = (0, Useupdatelistportal_1.useUpdateListPortal)({
        items: updateList,
        refreshKey: refreshKey,
    }).updateListPortal;
    var _x = (0, useStateFromManage_1.useStateFromManage)(), drawerOpen = _x.drawerOpen, selectedJobId = _x.selectedJobId, advertLanguage = _x.advertLanguage, reviewerComments = _x.reviewerComments, acknowledgementCheckbox = _x.acknowledgementCheckbox, loadingState = _x.loadingState, openDrawer = _x.openDrawer, closeDrawer = _x.closeDrawer, setAdvertLanguage = _x.setAdvertLanguage, setComments = _x.setComments, toggleAcknowledgement = _x.toggleAcknowledgement, setLoadingState = _x.setLoadingState;
    var _y = (0, useModalPopup_1.useModalPopup)(), modalState = _y.modalState, showModal = _y.showModal, closeModal = _y.closeModal;
    (0, react_1.useEffect)(function () {
        if (activeMetric === ConditionConfig_1.MatricID.BackgroundCheck || activeMetric === ConditionConfig_1.MatricID.LabourHire || activeMetric === ConditionConfig_1.MatricID.Kcsa) {
            void updateListPortal();
        }
    }, [activeMetric, refreshKey]);
    var onMetricChange = (0, react_1.useCallback)(function (data) {
        setNavigationPath(data.path);
        ref.current = data.menuId;
        setActiveTab(data.TabValue);
        setCurrentTabName(data.TabName);
        setMatricID(data.id);
        setCurrentPage(1);
        setSelectedIds([]);
        setSelectedMemberId(0);
        setselectedmatricId(data === null || data === void 0 ? void 0 : data.label);
    }, [setNavigationPath, setActiveTab, setCurrentTabName, setMatricID]);
    var handleRefresh = (0, react_1.useCallback)(function () {
        setRefreshKey(function (prev) { return prev + 1; });
    }, []);
    var totalCount = items.length;
    var paginatedItems = (0, react_1.useMemo)(function () {
        var start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, currentPage, pageSize]);
    var selectedItems = (0, react_1.useMemo)(function () { return items.filter(function (item) { return selectedIds.includes(item.id); }); }, [items, selectedIds]);
    var selectedJobCode = (0, react_1.useMemo)(function () { var _a; return (selectedItems.length === 1 ? (_a = selectedItems[0]) === null || _a === void 0 ? void 0 : _a.jobCode : ""); }, [selectedItems]);
    var selectedNationality = (0, react_1.useMemo)(function () { var _a; return (selectedItems.length > 0 ? (_a = selectedItems[0]) === null || _a === void 0 ? void 0 : _a.nationality : null); }, [selectedItems]);
    var _z = (0, useAssignMembers_1.useAssignMembers)(selectedNationality), members = _z.members, membersLoading = _z.loading;
    var selectedMember = (0, react_1.useMemo)(function () { var _a; return (_a = members.find(function (m) { return m.id === selectedMemberId; })) !== null && _a !== void 0 ? _a : null; }, [members, selectedMemberId]);
    var handleToggleRow = (0, react_1.useCallback)(function (id) {
        if (selectedNationality) {
            var item = items.find(function (i) { return i.id === id; });
            if ((item === null || item === void 0 ? void 0 : item.nationality) !== selectedNationality) {
                showModal({
                    type: "warning",
                    title: strings.NationalityMismatch,
                    message: strings.YouCannotAssignHrForDifferentNationality,
                    confirmLabel: "OK",
                    onConfirm: closeModal,
                });
                return;
            }
        }
        setSelectedIds(function (prev) {
            return prev.includes(id)
                ? prev.filter(function (itemId) { return itemId !== id; })
                : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false);
        });
    }, [selectedNationality, items, showModal, closeModal]);
    var handleToggleAll = (0, react_1.useCallback)(function () {
        setSelectedIds(function (prev) {
            return allSelected
                ? prev.filter(function (id) { return !pageIds.includes(id); })
                : Array.from(new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), pageIds, true)));
        });
        // const allSameNationality = (items: typeof selectedItems): boolean => {
        //   if (items.length === 0) return false;
        //   return items.every((item) => item.nationality === items[0].nationality);
        // };
        // if (!allSameNationality(selectedItems)) {
        //   showModal({
        //     type: "warning",
        //     title: "Nationality Mismatch",
        //     message: "You cannot assign HR for different nationality.",
        //     confirmLabel: "OK",
        //     onConfirm: closeModal,
        //   });
        //   return;
        // }
        var pageIds = paginatedItems.map(function (item) { return item.id; });
        var allSelected = pageIds.length > 0 && pageIds.every(function (id) { return selectedIds.includes(id); });
    }, [paginatedItems, selectedIds]);
    var handleClosePopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(false);
    }, []);
    var resetSelection = (0, react_1.useCallback)(function () {
        setSelectedIds([]);
        setSelectedMemberId(0);
    }, []);
    var _0 = (0, Useconfirmassignment_1.useConfirmAssignment)(handleClosePopup, handleRefresh, resetSelection), handleConfirmAssignment = _0.handleConfirmAssignment, assignmentModalState = _0.modalState, assignmentCloseModal = _0.closeModal, assignmentLoading = _0.loading;
    var _1 = (0, useadvertextend_1.useAdvertExtends)(handleClosePopup, handleRefresh, setAdvertPopupOpen), handleAdvertExtend = _1.handleAdvertExtend, advertModalState = _1.modalState, advertCloseModal = _1.closeModal, advertLoading = _1.loading;
    var selectedItemRef = (0, react_1.useRef)(null);
    var handleActionOffer = (0, react_1.useCallback)(function (item) {
        selectedItemRef.current = {
            jobId: item.RecID,
            candidateID: item.CandidateID,
            selectedcandidateID: item.ItemID,
            jobrequestID: item.jobrequestID,
            IsExpat: item.IsExpat,
        };
        setDrawerOfferOpen(true);
    }, [drawerOfferOpen]);
    var handleAction = (0, react_1.useCallback)(function (item) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ItemID, isEvaluationFlow, today, _a, day, month, year, interviewDate, Validation, interviewLevel, alreadySubmitted, evalutionIDs, routeMap, route;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (processingRef.current)
                        return [2 /*return*/];
                    processingRef.current = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 4, 5]);
                    ItemID = item.ItemID;
                    isEvaluationFlow = activeMetric === ConditionConfig_1.MatricID.EvalutionHR ||
                        activeMetric === ConditionConfig_1.MatricID.EvalutionLM ||
                        activeMetric === ConditionConfig_1.MatricID.EvalutionHOD ||
                        activeMetric === ConditionConfig_1.MatricID.EvalutionEXCO;
                    if (activeMetric === ConditionConfig_1.MatricID.advertExtension) {
                        setAdvertPopupOpen(true);
                        selectedAdvertID.current = item.ItemID;
                        return [2 /*return*/];
                    }
                    if (!isEvaluationFlow) return [3 /*break*/, 3];
                    today = new Date();
                    today.setHours(0, 0, 0, 0);
                    _a = item.interviewDate.split("-"), day = _a[0], month = _a[1], year = _a[2];
                    interviewDate = new Date(Number(year), Number(month) - 1, Number(day));
                    // interviewDate.setHours(0, 0, 0, 0);
                    //           const interviewDate = new Date(item.interviewDate);
                    interviewDate.setHours(0, 0, 0, 0);
                    Validation = interviewDate <= today;
                    interviewLevel = item.statusId === Config_1.StatusId.InterviewLevel2InProgress
                        ? ConditionConfig_1.InterviewLevel.Level2
                        : ConditionConfig_1.InterviewLevel.Level1;
                    return [4 /*yield*/, (0, Evaluationformservice_1.checkIsAlreadySubmitted)(ItemID, ADGroupData.EmailId[0], interviewLevel)];
                case 2:
                    alreadySubmitted = _c.sent();
                    if (!Validation) {
                        showModal({
                            type: "warning",
                            title: strings.InterviewDateNotReached,
                            message: "You can only fill the scorecard after the interview date. {item.interviewDate}",
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    if (alreadySubmitted) {
                        showModal({
                            type: "warning",
                            title: strings.AlreadySubmitted,
                            message: strings.TheScorecardForThisCandidateHasAlreadyBe,
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    _c.label = 3;
                case 3:
                    evalutionIDs = [
                        ConditionConfig_1.MatricID.EvalutionHR,
                        ConditionConfig_1.MatricID.EvalutionLM,
                        ConditionConfig_1.MatricID.EvalutionHOD,
                        ConditionConfig_1.MatricID.EvalutionEXCO,
                    ];
                    routeMap = tslib_1.__assign((_b = {}, _b[ConditionConfig_1.MatricID.InterviewQuestionHR] = "/QuestionCreation", _b[ConditionConfig_1.MatricID.DisqualifiQuesLM] = "/QuestionCreation", _b[ConditionConfig_1.MatricID.InterviewQuestionLM] = "/QuestionCreation", _b[ConditionConfig_1.MatricID.ReviewProfileHR] = "/CandidateTable", _b[ConditionConfig_1.MatricID.ReviewProfileLM] = "/CandidateTable", _b[ConditionConfig_1.MatricID.AssignInterviewPanel] = "/CandidateTable", _b[ConditionConfig_1.MatricID.ReviewScoreCard] = "/ReviewScoreCard", _b), Object.fromEntries(evalutionIDs.map(function (id) { return [
                        id,
                        item.statusId === Config_1.StatusId.InterviewLevel2InProgress
                            ? "/EvalutionL2"
                            : "/Evalution",
                    ]; })));
                    route = routeMap[activeMetric];
                    if (route) {
                        navigate(route, {
                            state: {
                                ID: ItemID,
                                RecruitmentID: item.RecID,
                                department: item.department,
                                StatusID: item.statusId,
                                EmailID: ADGroupData.EmailId[0],
                                InterviewLevels: item === null || item === void 0 ? void 0 : item.interviewLevels,
                            },
                        });
                        return [2 /*return*/];
                    }
                    drawerMeta.current = {
                        isOpen: true,
                        selectedType: item.requestType,
                    };
                    openDrawer(ItemID);
                    return [3 /*break*/, 5];
                case 4:
                    processingRef.current = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        activeMetric,
        navigate,
        openDrawer,
        showModal,
        closeModal,
        ADGroupData.EmailId,
    ]);
    var shouldShowProfile = activeMetric === ConditionConfig_1.MatricID.ReviewProfileHR ||
        activeMetric === ConditionConfig_1.MatricID.ReviewProfileLM ||
        activeMetric === ConditionConfig_1.MatricID.AssignInterviewPanel ||
        activeMetric === ConditionConfig_1.MatricID.ReviewScoreCard;
    var columns = (0, config_1.useRecruitmentColumns)({
        role: activeMetric === ConditionConfig_1.MatricID.EvalutionHR ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionLM ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionHOD ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionEXCO
            ? "evaluation"
            : activeMetric === ConditionConfig_1.MatricID.LabourHire ||
                activeMetric === ConditionConfig_1.MatricID.Kcsa ||
                activeMetric === ConditionConfig_1.MatricID.BackgroundCheck ||
                activeMetric === ConditionConfig_1.MatricID.MySubmissionBGV
                ? "OfferRelease"
                : "default",
        actionMode: "View",
        onAction: activeMetric === ConditionConfig_1.MatricID.LabourHire ||
            activeMetric === ConditionConfig_1.MatricID.Kcsa ||
            activeMetric === ConditionConfig_1.MatricID.BackgroundCheck ||
            activeMetric === ConditionConfig_1.MatricID.MySubmissionBGV
            ? handleActionOffer
            : handleAction,
        hasProfileCount: shouldShowProfile
    });
    var loading = MatricData.length === 0 || trackerLoading || assignmentLoading || advertLoading;
    var hasMetrics = MatricData.length > 0;
    var showAssignmentBar = (activeMetric === ConditionConfig_1.MatricID.AssignHr || activeMetric === ConditionConfig_1.MatricID.AssignAgencies) && selectedIds.length > 0 && members.length > 0;
    var metricsContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: MyTracker_module_scss_1.default.dashboard, key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, loading ? (react_1.default.createElement(loading_1.default, null)) : (react_1.default.createElement(framer_motion_1.motion.div, { key: "dashboard-content", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }, !hasMetrics ? (react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["dashboard-empty"] },
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["dashboard-empty__title"] }, strings.NoDashboardMetricsAvailable),
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["dashboard-empty__subtitle"] }, strings.PleaseCheckYourPermissionsOrTryAgainLate))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: MyTracker_module_scss_1.default["metrics-grid"], variants: metricsContainer, initial: "hidden", animate: "visible" },
                react_1.default.createElement(matric_1.default, { metrics: MatricData, onCardClick: onMetricChange, loading: loading, handleRefresh: handleRefresh, active: activeMetric })),
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker-panel"] },
                react_1.default.createElement(framer_motion_1.motion.div, { className: MyTracker_module_scss_1.default.tracker, key: "tracker", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.3 } },
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header"] },
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header-left"] },
                            react_1.default.createElement("h2", { className: MyTracker_module_scss_1.default["tracker__title"] }, strings.RecruitmentBacklog),
                            react_1.default.createElement("p", { className: MyTracker_module_scss_1.default["tracker__subtitle"] },
                                strings.ResultsFor,
                                " ",
                                react_1.default.createElement("span", { className: MyTracker_module_scss_1.default["tracker__highlight"] }, selectedmatricId !== null && selectedmatricId !== void 0 ? selectedmatricId : "—"))),
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header-actions"] },
                            react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["tracker__action-btn"], onClick: handleRefresh, disabled: trackerLoading, title: strings.RefreshTable, "aria-label": "Refresh table" },
                                react_1.default.createElement(lucide_react_1.RefreshCw, { size: 13, className: trackerLoading ? MyTracker_module_scss_1.default.spin : undefined }),
                                strings.Refresh),
                            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__divider"] }),
                            react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["tracker__action-btn"], onClick: function () {
                                    navigate("/Dashboard");
                                    setActiveMenuID(ConditionConfig_1.menuID.Dashboard);
                                } },
                                react_1.default.createElement(lucide_react_1.RotateCcw, { size: 13 }),
                                strings.BackToDashboard))),
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__table-wrapper"] },
                        react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, enableCheckbox: activeMetric === ConditionConfig_1.MatricID.AssignHr || activeMetric === ConditionConfig_1.MatricID.AssignAgencies, selectedRowIds: selectedIds, getRowId: function (item) { return item.id; }, onToggleRow: handleToggleRow, onToggleAll: handleToggleAll, pageSize: pageSize, currentPage: currentPage, totalCount: totalCount, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
                                setPageSize(size);
                                setCurrentPage(1);
                            }, loading: trackerLoading })))),
            showAssignmentBar && (react_1.default.createElement("div", { className: MyTracker_module_scss_1.default.assignment },
                react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar"] },
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar__left"] },
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar__icon"] },
                            react_1.default.createElement(lucide_react_1.Users, { size: 18 })),
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar__count"] },
                            react_1.default.createElement("strong", null, selectedIds.length),
                            react_1.default.createElement("span", null, strings.VacanciesSelected))),
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar__controls"] },
                        react_1.default.createElement("select", { className: MyTracker_module_scss_1.default["assignment-bar__select"], value: selectedMemberId, onChange: function (e) {
                                return setSelectedMemberId(Number(e.target.value));
                            }, disabled: membersLoading, placeholder: activeMetric === ConditionConfig_1.MatricID.AssignHr ? strings.ChooseHrMember : strings.ChooseAgencyMember }, members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                            member.name,
                            " - ",
                            member.role)); })),
                        react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["assignment-bar__button"], type: "button", onClick: function () { return setIsPopupOpen(true); }, disabled: !selectedMemberId },
                            strings.ExecuteAssignment,
                            react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 })))))),
            isPopupOpen && (react_1.default.createElement(react_1.Suspense, { fallback: null },
                react_1.default.createElement(AssignHRPopup, { isOpen: isPopupOpen, selectedItems: selectedItems, assignedMember: selectedMember, onClose: handleClosePopup, oncancel: handleClosePopup, onConfirm: handleConfirmAssignment }))),
            isadvertPopupOpen && (react_1.default.createElement(react_1.Suspense, { fallback: null },
                react_1.default.createElement(AdvertExtension, { RecruitmentID: selectedAdvertID.current, onClose: function () { return setAdvertPopupOpen(false); }, useDataExtension: function (payload) { return ({
                        triggerExtension: function () {
                            void handleAdvertExtend(payload);
                        },
                    }); } }))),
            drawerMeta.current.isOpen && (react_1.default.createElement(AdvertReviewDrawer_1.AdvertReviewDrawer, { drawerOpen: drawerOpen, selectedJobId: selectedJobId, selectedJobCode: selectedJobCode, selectedType: drawerMeta.current.selectedType, advertLanguage: advertLanguage, reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: closeDrawer, onLanguageChange: setAdvertLanguage, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState, refreshKey: handleRefresh })),
            drawerOfferOpen && (react_1.default.createElement(ReviewDocument_1.ReviewDocument, { drawerOpen: drawerOfferOpen, selectedJobId: (_b = (_a = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _a === void 0 ? void 0 : _a.jobId) !== null && _b !== void 0 ? _b : 0, CandidateID: (_d = (_c = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _c === void 0 ? void 0 : _c.candidateID) !== null && _d !== void 0 ? _d : 0, selectedcandidateID: (_f = (_e = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _e === void 0 ? void 0 : _e.selectedcandidateID) !== null && _f !== void 0 ? _f : 0, IsExpat: (_h = (_g = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _g === void 0 ? void 0 : _g.IsExpat) !== null && _h !== void 0 ? _h : false, jobrequestID: (_k = (_j = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _j === void 0 ? void 0 : _j.jobrequestID) !== null && _k !== void 0 ? _k : "", reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: function () { return setDrawerOfferOpen(false); }, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState, refreshKey: handleRefresh })),
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, assignmentModalState, { onClose: assignmentCloseModal })),
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, advertModalState, { onClose: advertCloseModal })))))))));
};
exports.default = Mytracker;
//# sourceMappingURL=Mytracker.js.map