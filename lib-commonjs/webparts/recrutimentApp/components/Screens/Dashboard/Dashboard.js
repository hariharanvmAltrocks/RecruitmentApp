"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsContainer = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
require("./Dashboard.scss");
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var loading_1 = tslib_1.__importDefault(require("../../Comman/Loading/loading"));
var HRLeadDashboard_1 = tslib_1.__importDefault(require("./RoleBased/HRLead/HRLeadDashboard"));
var HRDashboard_1 = tslib_1.__importDefault(require("./RoleBased/HR/HRDashboard"));
var LineManagerDashboard_1 = tslib_1.__importDefault(require("./RoleBased/LineManager/LineManagerDashboard"));
var HODashboard_1 = tslib_1.__importDefault(require("./RoleBased/HOD/HODashboard"));
var SeniorHRDashboard_1 = tslib_1.__importDefault(require("./RoleBased/SeniorHR/SeniorHRDashboard"));
var Config_1 = require("../../../utilities/Config");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var react_router_dom_1 = require("react-router-dom");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
exports.metricsContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};
var Dashboard = function (props) {
    var _a = (0, RoleContext_1.useRoleContext)(), userRole = _a.userRole, userName = _a.userName, isLoading = _a.isLoading, ADGroupData = _a.ADGroupData, roleIDs = _a.roleIDs;
    var _b = (0, react_1.useState)(0), activeMetric = _b[0], setActiveMetric = _b[1];
    var _c = (0, react_1.useState)(0), refreshKey = _c[0], setRefreshKey = _c[1];
    var MatricData = (0, RoleContext_1.useRoleContext)().MatricData;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _d = (0, UIStateContext_1.useUIState)(), setActiveMenuID = _d.setActiveMenuID, setNavigationPath = _d.setNavigationPath, setActiveTab = _d.setActiveTab, navigationPath = _d.navigationPath, setMatricID = _d.setMatricID, setCurrentTabName = _d.setCurrentTabName;
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
    var initialRole = (0, react_1.useMemo)(function () {
        if (!roleIDs || roleIDs.length === 0)
            return Config_1.RoleID.RecruitmentHRLead;
        if (roleIDs.includes(Config_1.RoleID.RecruitmentHRLead))
            return Config_1.RoleID.RecruitmentHRLead;
        if (roleIDs.includes(Config_1.RoleID.RecruitmentHR))
            return Config_1.RoleID.RecruitmentHR;
        if (roleIDs.includes(Config_1.RoleID.LineManager, Config_1.RoleID.HOD))
            return Config_1.RoleID.LineManager;
        if (roleIDs.includes(Config_1.RoleID.HOD))
            return Config_1.RoleID.HOD;
        if (roleIDs.includes(Config_1.RoleID.LineManager))
            return Config_1.RoleID.LineManager;
        if (roleIDs.includes(Config_1.RoleID.SeniorHR))
            return Config_1.RoleID.SeniorHR;
        return Config_1.RoleID.RecruitmentHRLead;
    }, [userRole]);
    var _e = (0, react_1.useState)(initialRole), activeRole = _e[0], setActiveRole = _e[1];
    // const userEmail = useMemo(() => {
    //   return ADGroupData?.EmailId?.[0] || `${userName.toLowerCase().replace(/\s+/g, ".")}@kamoacopper.com`;
    // }, [ADGroupData, userName]);
    if (isLoading) {
        return react_1.default.createElement(loading_1.default, null);
    }
    var renderActiveDashboard = function () {
        switch (activeRole) {
            // case "Admin":
            //   return (
            //     <AdminDashboard 
            //       userName={userName} 
            //       roleSwitcher={renderRoleSwitcher} 
            //       notificationCenter={renderNotificationCenter} 
            //     />
            //   );
            case Config_1.RoleID.RecruitmentHRLead:
                return (react_1.default.createElement(HRLeadDashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
            case Config_1.RoleID.RecruitmentHR:
                return (react_1.default.createElement(HRDashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
            case Config_1.RoleID.LineManager:
                return (react_1.default.createElement(LineManagerDashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
            case Config_1.RoleID.HOD:
                return (react_1.default.createElement(HODashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
            case Config_1.RoleID.SeniorHR:
                return (react_1.default.createElement(SeniorHRDashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
            default:
                return (react_1.default.createElement(HRLeadDashboard_1.default, { userName: userName, metrics: MatricData, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric }));
        }
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, { exitBeforeEnter: true },
            react_1.default.createElement(framer_motion_1.motion.div, { key: activeRole, initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, transition: { duration: 0.2 } }, renderActiveDashboard()))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map