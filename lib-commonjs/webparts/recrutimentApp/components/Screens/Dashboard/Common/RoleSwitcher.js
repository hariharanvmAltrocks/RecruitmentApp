"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleSwitcher = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Common_module_scss_1 = tslib_1.__importDefault(require("./Common.module.scss"));
var RoleSwitcher = function (_a) {
    var currentRole = _a.currentRole, onRoleChange = _a.onRoleChange;
    return (react_1.default.createElement("div", { className: Common_module_scss_1.default.roleSwitcherWrapper },
        react_1.default.createElement(Lucide.ShieldAlert, { size: 14, style: { color: "#d97706" } }),
        react_1.default.createElement("label", null, "Dev Role Swapping:"),
        react_1.default.createElement("select", { className: Common_module_scss_1.default.roleSelect, value: currentRole, onChange: function (e) { return onRoleChange(e.target.value); } },
            react_1.default.createElement("option", { value: "Admin" }, "Super Admin"),
            react_1.default.createElement("option", { value: "HRLead" }, "HR Lead"),
            react_1.default.createElement("option", { value: "HR" }, "HR Recruiter"),
            react_1.default.createElement("option", { value: "DepartmentManager" }, "Department Manager (HOD)"),
            react_1.default.createElement("option", { value: "LineManager" }, "Line Manager"),
            react_1.default.createElement("option", { value: "Candidate" }, "Candidate"))));
};
exports.RoleSwitcher = RoleSwitcher;
exports.default = exports.RoleSwitcher;
//# sourceMappingURL=RoleSwitcher.js.map