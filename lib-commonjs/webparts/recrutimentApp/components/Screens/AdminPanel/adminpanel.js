"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanel = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var adminpanel_module_scss_1 = tslib_1.__importDefault(require("./adminpanel.module.scss"));
var Getadminpaneltable_1 = require("./hooks/Getadminpaneltable");
var Drawer_1 = require("./Drawer/Drawer");
var DataTable_1 = require("../../Comman/DataTable/DataTable");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var CLOSED_DRAWER = {
    open: false,
    mode: "new",
    selectedItem: null,
};
var AdminManagement = function (_a) {
    var title = _a.title, type = _a.type, onNewUser = _a.onNewUser, onEditUser = _a.onEditUser, onViewUser = _a.onViewUser;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var setActiveMenuID = (0, UIStateContext_1.useUIState)().setActiveMenuID;
    var _b = (0, react_1.useState)(false), isRefreshing = _b[0], setIsRefreshing = _b[1];
    // ── Data hook ─────────────────────────────────────────────────────────────
    var _c = (0, Getadminpaneltable_1.useAdminPanelTable)({ type: type, initialPageSize: 10 }), data = _c.data, loading = _c.loading, pagination = _c.pagination, fetchPage = _c.fetchPage, setPageSize = _c.setPageSize, refresh = _c.refresh;
    var listLabel = type === "labour-hire" ? "Labour Hire" : "Agencies";
    // ── Handlers ─────────────────────────────────────────────────────────────
    var handleRefresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            setIsRefreshing(true);
            refresh();
            setTimeout(function () { return setIsRefreshing(false); }, 600);
            return [2 /*return*/];
        });
    }); }, [refresh]);
    var handlePageChange = (0, react_1.useCallback)(function (page) { return fetchPage(page); }, [fetchPage]);
    var handlePageSizeChange = (0, react_1.useCallback)(function (size) { return setPageSize(size); }, [setPageSize]);
    // ── Columns ───────────────────────────────────────────────────────────────
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "exUserCode",
            header: "User Code",
            render: function (item) { return (react_1.default.createElement("span", { className: "data-table__job-code" }, item.exUserCode)); },
        },
        {
            id: "name",
            header: "Name",
            render: function (item) {
                var _a, _b;
                return (react_1.default.createElement("div", { className: "data-table__job-title" },
                    react_1.default.createElement("span", null, "".concat((_a = item.firstName) !== null && _a !== void 0 ? _a : "", " ").concat((_b = item.lastName) !== null && _b !== void 0 ? _b : "").trim())));
            },
        },
        {
            id: "email",
            header: "Email ID",
            accessor: "email",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "actions",
            header: "Actions",
            align: "left",
            cellClassName: "data-table__cell--actions",
            render: function (item) { return (react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                react_1.default.createElement(framer_motion_1.motion.button, { type: "button", className: "data-table__action-btn", whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 }, onClick: function () { return onViewUser(item); }, title: "View", "aria-label": "View user" },
                    react_1.default.createElement(lucide_react_1.Eye, { size: 14 }),
                    "View"),
                react_1.default.createElement(framer_motion_1.motion.button, { type: "button", className: "data-table__action-btn data-table__action-btn--secondary", whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 }, onClick: function () { return onEditUser(item); }, title: "Edit", "aria-label": "Edit user" },
                    react_1.default.createElement(lucide_react_1.Pencil, { size: 14 }),
                    "Edit"))); },
        },
    ]; }, 
    // onViewUser / onEditUser are stable callbacks — safe to exclude from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    return (react_1.default.createElement("div", { className: adminpanel_module_scss_1.default.page },
        react_1.default.createElement("header", { className: adminpanel_module_scss_1.default.header },
            react_1.default.createElement("div", { className: adminpanel_module_scss_1.default.headerText },
                react_1.default.createElement("h2", null, title),
                react_1.default.createElement("p", null, "Management Dashboard")),
            react_1.default.createElement("button", { className: adminpanel_module_scss_1.default.newUserBtn, onClick: onNewUser },
                react_1.default.createElement(lucide_react_1.Plus, { size: 15 }),
                "New User")),
        react_1.default.createElement("div", { className: "recruitment-table__table-card" },
            react_1.default.createElement("div", { className: "submission-header" },
                react_1.default.createElement("h2", { className: "submission-header__title" }, listLabel),
                react_1.default.createElement("div", { className: "submission-header__actions" },
                    react_1.default.createElement("button", { className: "submission-header__refresh-btn", onClick: handleRefresh, disabled: loading || isRefreshing, title: "Refresh table", "aria-label": "Refresh table" },
                        react_1.default.createElement(lucide_react_1.RefreshCw, { size: 14, className: loading || isRefreshing ? "spin" : undefined }),
                        "Refresh"),
                    react_1.default.createElement("button", { className: "submission-header__button", onClick: function () {
                            navigate("/Dashboard");
                            setActiveMenuID(ConditionConfig_1.menuID.Dashboard);
                        } },
                        react_1.default.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                        "Back to Dashboard"))),
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: data, loading: loading, pageSize: pagination.pageSize, currentPage: pagination.currentPage, totalCount: pagination.totalItems, onPageChange: handlePageChange, onPageSizeChange: handlePageSizeChange, pageSizeOptions: [10, 20, 50], emptyMessage: "No users found." }))));
};
// ─── AdminPanel (root export) ─────────────────────────────────────────────────
var AdminPanel = function () {
    var activeMenuID = (0, UIStateContext_1.useUIState)().activeMenuID;
    // Derive panel type from the active sidebar menu entry
    var activeType = activeMenuID === ConditionConfig_1.menuID.LabourHire ? "labour-hire" : "agency";
    // ── Single drawer state object controls mode + which item is loaded ───────
    var _a = (0, react_1.useState)(CLOSED_DRAWER), drawer = _a[0], setDrawer = _a[1];
    // ── Openers ───────────────────────────────────────────────────────────────
    var openNew = (0, react_1.useCallback)(function () {
        setDrawer({ open: true, mode: "new", selectedItem: null });
    }, []);
    var openEdit = (0, react_1.useCallback)(function (item) {
        setDrawer({ open: true, mode: "edit", selectedItem: item });
    }, []);
    var openView = (0, react_1.useCallback)(function (item) {
        setDrawer({ open: true, mode: "view", selectedItem: item });
    }, []);
    var closeDrawer = (0, react_1.useCallback)(function () {
        setDrawer(CLOSED_DRAWER);
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(AdminManagement, { title: activeType === "labour-hire"
                ? "Labour Hire Management"
                : "Agency Management", type: activeType, onNewUser: openNew, onEditUser: openEdit, onViewUser: openView }),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawer.open && (react_1.default.createElement(Drawer_1.Drawer, { isOpen: drawer.open, onClose: closeDrawer, type: activeType, isNew: drawer.mode === "new", isEdit: drawer.mode === "edit", isView: drawer.mode === "view", selectedItem: drawer.selectedItem, onSuccess: closeDrawer })))));
};
exports.AdminPanel = AdminPanel;
exports.default = exports.AdminPanel;
//# sourceMappingURL=adminpanel.js.map