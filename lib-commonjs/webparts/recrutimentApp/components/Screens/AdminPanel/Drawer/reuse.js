"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordField = exports.PASSWORD_RULES = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var Drawer_module_scss_1 = tslib_1.__importDefault(require("./Drawer.module.scss"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
exports.PASSWORD_RULES = [
    {
        key: "length",
        label: strings.AtLeast10CharactersLong,
        test: function (pw) { return pw.length >= 10; },
    },
    {
        key: "uppercase",
        label: strings.ContainsAnUppercaseLetterAZ,
        test: function (pw) { return /[A-Z]/.test(pw); },
    },
    {
        key: "lowercase",
        label: strings.ContainsALowercaseLetterAZ,
        test: function (pw) { return /[a-z]/.test(pw); },
    },
    {
        key: "number",
        label: strings.ContainsANumber09,
        test: function (pw) { return /[0-9]/.test(pw); },
    },
    {
        key: "special",
        label: strings.ContainsASpecialCharacter,
        test: function (pw) { return /[^A-Za-z0-9]/.test(pw); },
    },
];
var PasswordField = function (_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, error = _a.error, _b = _a.placeholder, placeholder = _b === void 0 ? "••••••••" : _b, _c = _a.readOnly, readOnly = _c === void 0 ? false : _c, _d = _a.passwordValue, passwordValue = _d === void 0 ? "" : _d, _e = _a.showRules, showRules = _e === void 0 ? false : _e;
    var _f = (0, react_1.useState)(false), show = _f[0], setShow = _f[1];
    // Count how many rules pass
    var passCount = showRules
        ? exports.PASSWORD_RULES.filter(function (r) { return r.test(passwordValue); }).length
        : 0;
    var strengthIndex = passCount - 1; // -1 when 0 pass = no segments lit
    var strengthClasses = [
        Drawer_module_scss_1.default.active0,
        Drawer_module_scss_1.default.active1,
        Drawer_module_scss_1.default.active2,
        Drawer_module_scss_1.default.active3,
        Drawer_module_scss_1.default.active4,
    ];
    return (react_1.default.createElement("div", { className: Drawer_module_scss_1.default.field },
        react_1.default.createElement("div", { style: { display: "flex", alignItems: "center" } },
            react_1.default.createElement("span", { className: Drawer_module_scss_1.default.label }, label),
            showRules && (react_1.default.createElement("span", { className: Drawer_module_scss_1.default.tooltipAnchor, tabIndex: 0, role: "button", "aria-label": strings.PasswordRequirements },
                react_1.default.createElement(lucide_react_1.Info, { size: 14, className: Drawer_module_scss_1.default.tooltipIcon }),
                react_1.default.createElement("div", { className: Drawer_module_scss_1.default.tooltipBox, role: "tooltip" },
                    react_1.default.createElement("div", { className: Drawer_module_scss_1.default.tooltipTitle }, "Password requirements"),
                    react_1.default.createElement("div", { className: Drawer_module_scss_1.default.tooltipRuleList }, exports.PASSWORD_RULES.map(function (rule) {
                        var pass = rule.test(passwordValue);
                        return (react_1.default.createElement("div", { key: rule.key, className: "".concat(Drawer_module_scss_1.default.tooltipRule, " ").concat(pass ? Drawer_module_scss_1.default.pass : "") },
                            react_1.default.createElement("span", { className: Drawer_module_scss_1.default.tooltipRuleDot }, pass && (react_1.default.createElement(lucide_react_1.Check, { size: 9, strokeWidth: 3, color: "#fff" }))),
                            rule.label));
                    })))))),
        react_1.default.createElement("div", { className: Drawer_module_scss_1.default.passwordInputRow },
            react_1.default.createElement("input", { type: show ? "text" : "password", className: "".concat(Drawer_module_scss_1.default.input, " ").concat(Drawer_module_scss_1.default.passwordInput, " ").concat(error ? Drawer_module_scss_1.default.hasError : ""), placeholder: placeholder, value: value, readOnly: readOnly, onChange: function (e) { return onChange(e.target.value); } }),
            !readOnly && (react_1.default.createElement("button", { type: "button", className: Drawer_module_scss_1.default.passwordToggleBtn, onClick: function () { return setShow(function (s) { return !s; }); }, tabIndex: -1, "aria-label": show ? strings.HidePassword : strings.ShowPassword }, show ? react_1.default.createElement(lucide_react_1.EyeOff, { size: 15 }) : react_1.default.createElement(lucide_react_1.Eye, { size: 15 })))),
        showRules && passwordValue.length > 0 && (react_1.default.createElement("div", { className: Drawer_module_scss_1.default.strengthBarWrap, "aria-hidden": "true" }, exports.PASSWORD_RULES.map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "".concat(Drawer_module_scss_1.default.strengthSegment, " ").concat(i <= strengthIndex ? strengthClasses[strengthIndex] : "") })); }))),
        error && react_1.default.createElement("span", { className: Drawer_module_scss_1.default.errorText }, error)));
};
exports.PasswordField = PasswordField;
//# sourceMappingURL=reuse.js.map