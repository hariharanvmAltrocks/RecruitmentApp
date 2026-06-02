"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
require("./Dashboard.scss");
var react_router_1 = require("react-router");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var matric_1 = tslib_1.__importDefault(require("../../Comman/MatricBox/matric"));
var loading_1 = tslib_1.__importDefault(require("../../Comman/Loading/loading"));
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var Departmentchart_1 = tslib_1.__importDefault(require("../../Comman/Departmentchart/Departmentchart"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var Dashboard = function (props) {
    var _a = (0, react_1.useState)(0), activeMetric = _a[0], setActiveMetric = _a[1];
    var _b = (0, react_1.useState)(0), refreshKey = _b[0], setRefreshKey = _b[1];
    var MatricData = (0, RoleContext_1.useRoleContext)().MatricData;
    var navigate = (0, react_router_1.useNavigate)();
    var _c = (0, UIStateContext_1.useUIState)(), setActiveMenuID = _c.setActiveMenuID, setNavigationPath = _c.setNavigationPath, setActiveTab = _c.setActiveTab, navigationPath = _c.navigationPath, setMatricID = _c.setMatricID, setCurrentTabName = _c.setCurrentTabName;
    var ref = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        if (MatricData.length > 0 && !activeMetric) {
            setActiveMetric(MatricData[0].id);
            setNavigationPath(MatricData[0].path);
            ref.current = MatricData[0].menuId;
            // setActiveMenuID(MatricData[0].menuId);
            setActiveTab(MatricData[0].TabValue);
            setCurrentTabName(MatricData[0].TabName);
            setMatricID(MatricData[0].id);
        }
    }, [MatricData]);
    var onMetricChange = function (data) {
        setActiveMetric(data.id);
        setNavigationPath(data.path);
        setActiveMenuID(ConditionConfig_1.menuID.Mytracker);
        ref.current = data.menuId;
        setActiveTab(data.TabValue);
        setCurrentTabName(data.TabName);
        setMatricID(data.id);
        navigate("/MyTracker");
    };
    var handleRefresh = function () {
        setRefreshKey(function (prev) { return prev + 1; });
        setActiveMetric(0);
    };
    var loading = MatricData.length === 0;
    var hasMetrics = MatricData && MatricData.length > 0;
    var metricsContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, loading ? (
        // <DashboardSkeleton key="dashboard-skeleton" />
        react_1.default.createElement(loading_1.default, null)) : (react_1.default.createElement(framer_motion_1.motion.div, { key: "dashboard-content", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }, !hasMetrics ? (react_1.default.createElement("div", { className: "dashboard-empty" },
            react_1.default.createElement("div", { className: "dashboard-empty__title" }, strings.NoDashboardMetricsAvailable),
            react_1.default.createElement("div", { className: "dashboard-empty__subtitle" }, strings.PleaseCheckYourPermissionsOrTryAgainLate))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: metricsContainer, initial: "hidden", animate: "visible" },
                react_1.default.createElement(matric_1.default, { metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric })),
            react_1.default.createElement("div", { className: "dashboard-layout" },
                react_1.default.createElement(Departmentchart_1.default, { itemsPerPage: 7, title: strings.DepartmentalDemand, subtitle: strings.PendingLifecycle, tooltipValueLabel: "Openings" })))))))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map