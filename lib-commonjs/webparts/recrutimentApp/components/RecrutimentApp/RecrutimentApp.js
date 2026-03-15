"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecrutimentApp;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var MainLayout_1 = tslib_1.__importDefault(require("./MainLayout"));
var Approutes_1 = tslib_1.__importDefault(require("../SideBar/Approutes"));
var RoleContext_1 = require("../../utilities/hooks/RoleContext");
var useStateHooks_1 = require("./useStateHooks");
function RecrutimentApp(props) {
    var roleIDs = (0, RoleContext_1.useRoleContext)().roleIDs;
    var _a = (0, useStateHooks_1.useStateHooks)(), activeMenuID = _a.activeMenuID, setactiveMenuID = _a.setactiveMenuID;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MainLayout_1.default, { RoleID: roleIDs, activeMenuID: activeMenuID, setactiveMenuID: setactiveMenuID },
            react_1.default.createElement(Approutes_1.default, { props: props }))));
}
//# sourceMappingURL=RecrutimentApp.js.map