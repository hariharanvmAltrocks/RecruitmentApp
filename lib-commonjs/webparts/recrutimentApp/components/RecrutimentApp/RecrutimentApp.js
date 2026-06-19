"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var MainLayout_1 = tslib_1.__importDefault(require("./MainLayout"));
var Approutes_1 = tslib_1.__importDefault(require("../SideBar/Approutes"));
var RoleContext_1 = require("../../utilities/hooks/RoleContext");
var UIStateContext_1 = require("./UIStateContext");
function RecrutimentApp(props) {
    var roleIDs = (0, RoleContext_1.useRoleContext)().roleIDs;
    var _a = (0, UIStateContext_1.useUIState)(), activeMenuID = _a.activeMenuID, setActiveMenuID = _a.setActiveMenuID;
    console.log("Recruitment App New UI V-1.3 -- 18-06-2026");
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MainLayout_1.default, { RoleID: roleIDs, activeMenuID: activeMenuID, setactiveMenuID: setActiveMenuID },
            react_1.default.createElement(Approutes_1.default, { props: props }))));
}
exports.default = RecrutimentApp;
//# sourceMappingURL=RecrutimentApp.js.map