"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var useRecruitmentDetails_1 = require("../RecruitmentTable/Hooks/useRecruitmentDetails");
var useTabDetails_1 = require("../RecruitmentTable/Hooks/useTabDetails");
var ReviewDocument_1 = require("./ReviewDocument/ReviewDocument");
require("./OfferTable.scss");
var DataTable_1 = require("../../Comman/DataTable/DataTable");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var react_router_dom_1 = require("react-router-dom");
var ModalPopup_1 = require("../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../Comman/ModalPopup/useModalPopup");
var Tabs_1 = tslib_1.__importDefault(require("../../Comman/Tabs/Tabs"));
var useStateFromManage_1 = require("./StateManage/useStateFromManage");
var Config_1 = require("./Config");
var Useupdatelistportal_1 = require("./ReviewDocument/Hooks/Useupdatelistportal");
function resolveActionMode(statusID) {
    if (Config_1.Initiate_STAUES.has(statusID))
        return "Initiate";
    if (Config_1.REVIEW_STATUSES.has(statusID))
        return "Review";
    if (Config_1.EDIT_STATUSES.has(statusID))
        return "Edit";
    return "View";
}
var ActionCell = react_1.default.memo(function (_a) {
    var item = _a.item, StatusId = _a.StatusId, onAction = _a.onAction;
    var actionMode = (0, react_1.useMemo)(function () { return resolveActionMode(StatusId); }, [StatusId]);
    var isInitiate = actionMode === "Initiate";
    var isReview = actionMode === "Review";
    var ActionIcon = isInitiate ? lucide_react_1.Play : isReview ? lucide_react_1.Pencil : lucide_react_1.Eye;
    var actionLabel = isInitiate ? "Initiate" : isReview ? "REVIEW" : "VIEW";
    return (react_1.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return onAction(item); }, type: "button", "aria-label": "".concat(actionLabel, " action") }, actionLabel));
});
function buildColumns(onAction) {
    return [
        {
            id: "PositionID",
            header: "Position ID",
            accessor: "positionId",
            render: function (item) { return (react_1.default.createElement("div", { className: "data-table__job-code" },
                react_1.default.createElement("span", { className: "offer-table__code" }, item.positionId))); },
        },
        {
            id: "title",
            header: "Job Title & Dept",
            render: function (item) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, item.title),
                react_1.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "buCode",
            header: "Business Unit",
            render: function (item) { return String(item.buCode || "").padStart(2, "0"); },
            cellClassName: "data-table__cell--muted",
            align: "center",
            hideOnMobile: true,
        },
        {
            id: "applicantName",
            header: "Applicant Name",
            accessor: "applicantName",
            cellClassName: "data-table__cell--count",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return (react_1.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)); },
        },
        {
            id: "actions",
            header: "Actions",
            align: "right",
            cellClassName: "data-table__cell--actions",
            render: function (item) { return (react_1.default.createElement(ActionCell, { item: item, StatusId: item.statusId, onAction: onAction })); },
        },
    ];
}
var OfferTable = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l = (0, useTabDetails_1.useTabDetails)(), tabs = _l.tabs, tabsLoading = _l.loading;
    var _m = (0, UIStateContext_1.useUIState)(), activeTab = _m.activeTab, matricID = _m.MatricID, setMatricID = _m.setMatricID, sideNavflag = _m.sideNavflag, setCurrentTabName = _m.setCurrentTabName, currentTabName = _m.currentTabName;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _o = (0, useModalPopup_1.useModalPopup)(), modalState = _o.modalState, closeModal = _o.closeModal;
    var _p = (0, react_1.useState)(activeTab), activeTabKey = _p[0], setActiveTabKey = _p[1];
    var _q = (0, react_1.useState)(0), refreshKey = _q[0], setRefreshKey = _q[1];
    var _r = (0, react_1.useState)([]), selectedIds = _r[0], setSelectedIds = _r[1];
    var _s = (0, react_1.useState)(5), pageSize = _s[0], setPageSize = _s[1];
    var _t = (0, react_1.useState)(1), currentPage = _t[0], setCurrentPage = _t[1];
    var _u = (0, useRecruitmentDetails_1.useRecruitmentDetails)(activeTabKey, refreshKey), items = _u.items, tableLoading = _u.loading;
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
    (0, react_1.useEffect)(function () {
        if (!tableLoading && updateList.length > 0) {
            void updateListPortal();
        }
    }, [updateList, tableLoading, refreshKey]);
    var _v = (0, useStateFromManage_1.useStateOfferRelease)(), drawerOpen = _v.drawerOpen, reviewerComments = _v.reviewerComments, acknowledgementCheckbox = _v.acknowledgementCheckbox, loadingState = _v.loadingState, openDrawer = _v.openDrawer, closeDrawer = _v.closeDrawer, setComments = _v.setComments, toggleAcknowledgement = _v.toggleAcknowledgement, setLoadingState = _v.setLoadingState;
    var activeTabs = (0, react_1.useMemo)(function () { return tabs.find(function (t) { return t.key === activeTabKey; }); }, [activeTabKey, tabs]);
    var totalCount = items.length;
    var totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    var paginatedItems = (0, react_1.useMemo)(function () {
        var start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [currentPage, items, pageSize]);
    (0, react_1.useEffect)(function () {
        if (!tabs.length)
            return;
        if (!tabs.some(function (t) { return t.key === activeTabKey; })) {
            setActiveTabKey(tabs[0].key);
        }
        if (!tableLoading) {
            void updateListPortal();
        }
    }, [tabs, tableLoading]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (sideNavflag && tabs.length > 0 && !currentTabName) {
            setMatricID(tabs[0].matricId);
            setCurrentTabName((_b = (_a = tabs[1]) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : "");
        }
    }, [tabs.length, sideNavflag, currentTabName]);
    (0, react_1.useEffect)(function () {
        if (currentPage > totalPages)
            setCurrentPage(totalPages);
    }, [totalPages]);
    var handleRefresh = (0, react_1.useCallback)(function () { return setRefreshKey(function (k) { return k + 1; }); }, []);
    var handleTabChange = (0, react_1.useCallback)(function (tab) {
        setActiveTabKey(tab.key);
        setSelectedIds([]);
        setCurrentPage(1);
        setMatricID(tab.matricId);
        setCurrentTabName(tab.description);
    }, [setMatricID, setCurrentTabName]);
    var selectedItemRef = (0, react_1.useRef)(null);
    var handleAction = (0, react_1.useCallback)(function (item) {
        selectedItemRef.current = {
            jobId: item.RecID,
            candidateID: item.CandidateID,
            selectedcandidateID: item.ItemID,
            jobrequestID: item.jobrequestID,
            IsExpat: item.IsExpat,
        };
        openDrawer(item.ItemID);
    }, [openDrawer]);
    var columns = (0, react_1.useMemo)(function () { return buildColumns(handleAction); }, [handleAction]);
    return (react_1.default.createElement("section", { className: "offer-table" },
        react_1.default.createElement("div", { className: "offer-table__tabs" },
            react_1.default.createElement(Tabs_1.default, { tabs: tabs, activeKey: activeTabKey, onChange: handleTabChange, loading: tabsLoading, variant: "boxed" })),
        react_1.default.createElement("div", { className: "offer-table__table-card" },
            react_1.default.createElement("div", { className: "submission-header" },
                react_1.default.createElement("h2", { className: "submission-header__title" }, currentTabName),
                react_1.default.createElement("div", { className: "submission-header__actions" },
                    react_1.default.createElement("button", { className: "submission-header__refresh-btn", onClick: handleRefresh, disabled: tableLoading, title: "Refresh table", "aria-label": "Refresh table" },
                        react_1.default.createElement(lucide_react_1.RefreshCw, { size: 14, className: tableLoading ? "spin" : undefined }),
                        "Refresh"),
                    react_1.default.createElement("button", { onClick: function () { return navigate("/Dashboard"); }, className: "submission-header__button" },
                        react_1.default.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                        "Back to Dashboard"))),
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, enableCheckbox: false, pageSize: pageSize, currentPage: currentPage, totalCount: totalCount, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
                    setPageSize(size);
                    setCurrentPage(1);
                }, loading: tableLoading })),
        drawerOpen && (react_1.default.createElement(ReviewDocument_1.ReviewDocument, { drawerOpen: drawerOpen, selectedJobId: (_b = (_a = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _a === void 0 ? void 0 : _a.jobId) !== null && _b !== void 0 ? _b : 0, CandidateID: (_d = (_c = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _c === void 0 ? void 0 : _c.candidateID) !== null && _d !== void 0 ? _d : 0, selectedcandidateID: (_f = (_e = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _e === void 0 ? void 0 : _e.selectedcandidateID) !== null && _f !== void 0 ? _f : 0, IsExpat: (_h = (_g = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _g === void 0 ? void 0 : _g.IsExpat) !== null && _h !== void 0 ? _h : false, jobrequestID: (_k = (_j = selectedItemRef === null || selectedItemRef === void 0 ? void 0 : selectedItemRef.current) === null || _j === void 0 ? void 0 : _j.jobrequestID) !== null && _k !== void 0 ? _k : "", reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: closeDrawer, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState, refreshKey: handleRefresh })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.OfferTable = OfferTable;
//# sourceMappingURL=OfferTable.js.map