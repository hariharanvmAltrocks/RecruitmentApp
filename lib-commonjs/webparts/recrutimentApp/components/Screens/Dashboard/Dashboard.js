"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
require("./Dashboard.scss");
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var loading_1 = tslib_1.__importDefault(require("../../Comman/Loading/loading"));
// Sub-dashboards
var AdminDashboard_1 = tslib_1.__importDefault(require("./RoleBased/Admin/AdminDashboard"));
var HRLeadDashboard_1 = tslib_1.__importDefault(require("./RoleBased/HRLead/HRLeadDashboard"));
var HRDashboard_1 = tslib_1.__importDefault(require("./RoleBased/HR/HRDashboard"));
var DepartmentManagerDashboard_1 = tslib_1.__importDefault(require("./RoleBased/DepartmentManager/DepartmentManagerDashboard"));
var LineManagerDashboard_1 = tslib_1.__importDefault(require("./RoleBased/LineManager/LineManagerDashboard"));
var NotificationCenter_1 = tslib_1.__importDefault(require("./Common/NotificationCenter"));
var Config_1 = require("../../../utilities/Config");
var Dashboard = function (props) {
    var _a = (0, RoleContext_1.useRoleContext)(), userRole = _a.userRole, userName = _a.userName, isLoading = _a.isLoading, ADGroupData = _a.ADGroupData, roleIDs = _a.roleIDs;
    var initialRole = (0, react_1.useMemo)(function () {
        if (!roleIDs || roleIDs.length === 0)
            return Config_1.RoleID.RecruitmentHRLead;
        if (roleIDs.includes(Config_1.RoleID.RecruitmentHRLead))
            return Config_1.RoleID.RecruitmentHRLead;
        if (roleIDs.includes(Config_1.RoleID.RecruitmentHR))
            return Config_1.RoleID.RecruitmentHR;
        if (roleIDs.includes(Config_1.RoleID.HOD))
            return Config_1.RoleID.HOD;
        if (roleIDs.includes(Config_1.RoleID.LineManager))
            return Config_1.RoleID.LineManager;
        return Config_1.RoleID.RecruitmentHRLead;
    }, [userRole]);
    var _b = (0, react_1.useState)(initialRole), activeRole = _b[0], setActiveRole = _b[1];
    var userEmail = (0, react_1.useMemo)(function () {
        var _a;
        return ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0]) || "".concat(userName.toLowerCase().replace(/\s+/g, "."), "@kamoacopper.com");
    }, [ADGroupData, userName]);
    if (isLoading) {
        return react_1.default.createElement(loading_1.default, null);
    }
    // const renderRoleSwitcher = (
    //   <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
    // );
    var renderNotificationCenter = (react_1.default.createElement(NotificationCenter_1.default, null));
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
                return (react_1.default.createElement(HRLeadDashboard_1.default, { userName: userName, notificationCenter: renderNotificationCenter }));
            case Config_1.RoleID.RecruitmentHR:
                return (react_1.default.createElement(HRDashboard_1.default, { userName: userName, notificationCenter: renderNotificationCenter }));
            case Config_1.RoleID.HOD:
                return (react_1.default.createElement(DepartmentManagerDashboard_1.default, { userName: userName, notificationCenter: renderNotificationCenter }));
            case Config_1.RoleID.LineManager:
                return (react_1.default.createElement(LineManagerDashboard_1.default, { userName: userName, notificationCenter: renderNotificationCenter }));
            default:
                return (react_1.default.createElement(AdminDashboard_1.default, { userName: userName, notificationCenter: renderNotificationCenter }));
        }
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, { exitBeforeEnter: true },
            react_1.default.createElement(framer_motion_1.motion.div, { key: activeRole, initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, transition: { duration: 0.2 } }, renderActiveDashboard()))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map