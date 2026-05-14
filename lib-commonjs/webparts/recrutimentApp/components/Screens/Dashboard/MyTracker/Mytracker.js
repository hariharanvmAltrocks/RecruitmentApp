"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var moment_1 = tslib_1.__importDefault(require("moment"));
var MyTracker_module_scss_1 = tslib_1.__importDefault(require("./MyTracker.module.scss"));
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var matric_1 = tslib_1.__importDefault(require("../../../Comman/MatricBox/matric"));
var DataTable_1 = require("../../../Comman/DataTable/DataTable");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var useDashboardMetrics_1 = require("../Hooks/useDashboardMetrics");
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
    var _a;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var _b = (0, UIStateContext_1.useUIState)(), activeMetric = _b.MatricID, setNavigationPath = _b.setNavigationPath, setActiveMenuID = _b.setActiveMenuID, setActiveTab = _b.setActiveTab, setMatricID = _b.setMatricID, setCurrentTabName = _b.setCurrentTabName, navigationPath = _b.navigationPath;
    var _c = (0, react_1.useState)(0), refreshKey = _c[0], setRefreshKey = _c[1];
    var _d = (0, react_1.useState)([]), selectedIds = _d[0], setSelectedIds = _d[1];
    var _e = (0, react_1.useState)(10), pageSize = _e[0], setPageSize = _e[1];
    var _f = (0, react_1.useState)(1), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = (0, react_1.useState)(false), isPopupOpen = _g[0], setIsPopupOpen = _g[1];
    var _h = (0, react_1.useState)(false), isadvertPopupOpen = _h[0], setAdvertPopupOpen = _h[1];
    var _j = (0, react_1.useState)(0), selectedMemberId = _j[0], setSelectedMemberId = _j[1];
    var _k = (0, react_1.useState)(""), selectedmatricId = _k[0], setselectedmatricId = _k[1];
    var processingRef = (0, react_1.useRef)(false);
    var selectedAdvertID = (0, react_1.useRef)(0);
    var ref = (0, react_1.useRef)(0);
    var drawerMeta = (0, react_1.useRef)({
        isOpen: false,
        selectedType: "",
    });
    var _l = (0, useRecruitmentDetails_1.useRecruitmentDetails)(refreshKey), trackerData = _l.items, trackerLoading = _l.loading;
    var martics = (0, useDashboardMetrics_1.useDashboardMetrics)(refreshKey);
    var items = trackerData || [];
    var _m = (0, useStateFromManage_1.useStateFromManage)(), drawerOpen = _m.drawerOpen, selectedJobId = _m.selectedJobId, advertLanguage = _m.advertLanguage, reviewerComments = _m.reviewerComments, acknowledgementCheckbox = _m.acknowledgementCheckbox, loadingState = _m.loadingState, openDrawer = _m.openDrawer, closeDrawer = _m.closeDrawer, setAdvertLanguage = _m.setAdvertLanguage, setComments = _m.setComments, toggleAcknowledgement = _m.toggleAcknowledgement, setLoadingState = _m.setLoadingState;
    var _o = (0, useModalPopup_1.useModalPopup)(), modalState = _o.modalState, showModal = _o.showModal, closeModal = _o.closeModal;
    (0, react_1.useEffect)(function () {
        if (martics.metrics.length > 0 && !activeMetric) {
            setNavigationPath(martics.metrics[0].path);
            ref.current = martics.metrics[0].menuId;
            setActiveTab(martics.metrics[0].TabValue);
            setCurrentTabName(martics.metrics[0].TabName);
            setMatricID(martics.metrics[0].id);
            setselectedmatricId(martics.metrics[0].label);
        }
    }, [martics.metrics]);
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
    var _p = (0, useAssignMembers_1.useAssignMembers)(selectedNationality), members = _p.members, membersLoading = _p.loading;
    var selectedMember = (0, react_1.useMemo)(function () { var _a; return (_a = members.find(function (m) { return m.id === selectedMemberId; })) !== null && _a !== void 0 ? _a : null; }, [members, selectedMemberId]);
    var handleToggleRow = (0, react_1.useCallback)(function (id) {
        setSelectedIds(function (prev) {
            return prev.includes(id)
                ? prev.filter(function (itemId) { return itemId !== id; })
                : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false);
        });
    }, []);
    var handleToggleAll = (0, react_1.useCallback)(function () {
        var pageIds = paginatedItems.map(function (item) { return item.id; });
        var allSelected = pageIds.length > 0 && pageIds.every(function (id) { return selectedIds.includes(id); });
        setSelectedIds(function (prev) {
            return allSelected
                ? prev.filter(function (id) { return !pageIds.includes(id); })
                : Array.from(new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), pageIds, true)));
        });
    }, [paginatedItems, selectedIds]);
    var handleClosePopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(false);
    }, []);
    var _q = (0, Useconfirmassignment_1.useConfirmAssignment)(handleClosePopup, handleRefresh), handleConfirmAssignment = _q.handleConfirmAssignment, assignmentModalState = _q.modalState, assignmentCloseModal = _q.closeModal;
    var _r = (0, useadvertextend_1.useAdvertExtends)(handleClosePopup, handleRefresh, setAdvertPopupOpen), handleAdvertExtend = _r.handleAdvertExtend, advertModalState = _r.modalState, advertCloseModal = _r.closeModal;
    var handleAction = (0, react_1.useCallback)(function (item) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ItemID, isEvaluationFlow, today, interviewDate, Validation, interviewLevel, alreadySubmitted, evalutionIDs, routeMap, route;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (processingRef.current)
                        return [2 /*return*/];
                    processingRef.current = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
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
                    interviewDate = new Date(item.interviewDate);
                    interviewDate.setHours(0, 0, 0, 0);
                    Validation = interviewDate <= today;
                    interviewLevel = item.statusId === Config_1.StatusId.InterviewLevel2InProgress
                        ? ConditionConfig_1.InterviewLevel.Level2
                        : ConditionConfig_1.InterviewLevel.Level1;
                    return [4 /*yield*/, (0, Evaluationformservice_1.checkIsAlreadySubmitted)(ItemID, ADGroupData.EmailId[0], interviewLevel)];
                case 2:
                    alreadySubmitted = _b.sent();
                    if (!Validation) {
                        showModal({
                            type: "warning",
                            title: "Interview Date Not Reached",
                            message: "You can only fill the scorecard after the interview date. ".concat((0, moment_1.default)(item.interviewDate).format("YYYY-MM-DD")),
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    if (alreadySubmitted) {
                        showModal({
                            type: "warning",
                            title: "Already Submitted",
                            message: "The scorecard for this candidate has already been submitted.",
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    _b.label = 3;
                case 3:
                    evalutionIDs = [
                        ConditionConfig_1.MatricID.EvalutionHR,
                        ConditionConfig_1.MatricID.EvalutionLM,
                        ConditionConfig_1.MatricID.EvalutionHOD,
                        ConditionConfig_1.MatricID.EvalutionEXCO,
                    ];
                    routeMap = tslib_1.__assign((_a = {}, _a[ConditionConfig_1.MatricID.InterviewQuestionHR] = "/QuestionCreation", _a[ConditionConfig_1.MatricID.DisqualifiQuesLM] = "/QuestionCreation", _a[ConditionConfig_1.MatricID.InterviewQuestionLM] = "/QuestionCreation", _a[ConditionConfig_1.MatricID.ReviewProfileHR] = "/CandidateTable", _a[ConditionConfig_1.MatricID.ReviewProfileLM] = "/CandidateTable", _a[ConditionConfig_1.MatricID.AssignInterviewPanel] = "/CandidateTable", _a[ConditionConfig_1.MatricID.ReviewScoreCard] = "/ReviewScoreCard", _a), Object.fromEntries(evalutionIDs.map(function (id) { return [
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
    var columns = (0, config_1.useRecruitmentColumns)({
        role: activeMetric === ConditionConfig_1.MatricID.EvalutionHR ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionLM ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionHOD ||
            activeMetric === ConditionConfig_1.MatricID.EvalutionEXCO
            ? "evaluation"
            : "default",
        actionMode: "View",
        onAction: handleAction,
    });
    var loading = martics.loading || trackerLoading || martics.metrics.length === 0;
    var hasMetrics = martics.metrics.length > 0;
    var showAssignmentBar = activeMetric === ConditionConfig_1.MatricID.AssignHr && selectedIds.length > 0;
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
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["dashboard-empty__title"] }, "No dashboard metrics available"),
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["dashboard-empty__subtitle"] }, "Please check your permissions or try again later."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: MyTracker_module_scss_1.default["metrics-grid"], variants: metricsContainer, initial: "hidden", animate: "visible" },
                react_1.default.createElement(matric_1.default, { metrics: martics.metrics, onCardClick: onMetricChange, loading: loading, handleRefresh: handleRefresh, active: activeMetric })),
            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker-panel"] },
                react_1.default.createElement(framer_motion_1.motion.div, { className: MyTracker_module_scss_1.default.tracker, key: "tracker", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 }, transition: { duration: 0.3 } },
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header"] },
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header-left"] },
                            react_1.default.createElement("h2", { className: MyTracker_module_scss_1.default["tracker__title"] }, "Recruitment Backlog"),
                            react_1.default.createElement("p", { className: MyTracker_module_scss_1.default["tracker__subtitle"] },
                                "Showing ",
                                react_1.default.createElement("strong", null, (_a = trackerData === null || trackerData === void 0 ? void 0 : trackerData.length) !== null && _a !== void 0 ? _a : 0),
                                " ",
                                "results for",
                                " ",
                                react_1.default.createElement("span", { className: MyTracker_module_scss_1.default["tracker__highlight"] }, selectedmatricId !== null && selectedmatricId !== void 0 ? selectedmatricId : "—"))),
                        react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__header-actions"] },
                            react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["tracker__action-btn"], onClick: handleRefresh, disabled: trackerLoading, title: "Refresh table", "aria-label": "Refresh table" },
                                react_1.default.createElement(lucide_react_1.RefreshCw, { size: 13, className: trackerLoading ? MyTracker_module_scss_1.default.spin : undefined }),
                                "Refresh"),
                            react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__divider"] }),
                            react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["tracker__action-btn"], onClick: function () {
                                    navigate("/Dashboard");
                                    setActiveMenuID(ConditionConfig_1.menuID.Dashboard);
                                } },
                                react_1.default.createElement(lucide_react_1.RotateCcw, { size: 13 }),
                                "Back to Dashboard"))),
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["tracker__table-wrapper"] },
                        react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, enableCheckbox: activeMetric === ConditionConfig_1.MatricID.AssignHr, selectedRowIds: selectedIds, getRowId: function (item) { return item.id; }, onToggleRow: handleToggleRow, onToggleAll: handleToggleAll, pageSize: pageSize, currentPage: currentPage, totalCount: totalCount, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
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
                            react_1.default.createElement("span", null, "Vacancies Selected"))),
                    react_1.default.createElement("div", { className: MyTracker_module_scss_1.default["assignment-bar__controls"] },
                        react_1.default.createElement("select", { className: MyTracker_module_scss_1.default["assignment-bar__select"], value: selectedMemberId, onChange: function (e) {
                                return setSelectedMemberId(Number(e.target.value));
                            }, disabled: membersLoading },
                            react_1.default.createElement("option", { value: "" }, "Choose HR member"),
                            members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                                member.name,
                                " - ",
                                member.role)); })),
                        react_1.default.createElement("button", { className: MyTracker_module_scss_1.default["assignment-bar__button"], type: "button", onClick: function () { return setIsPopupOpen(true); }, disabled: !selectedMemberId },
                            "Execute Assignment",
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
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, assignmentModalState, { onClose: assignmentCloseModal })),
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
            react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, advertModalState, { onClose: advertCloseModal })))))))));
};
exports.default = Mytracker;
//# sourceMappingURL=Mytracker.js.map