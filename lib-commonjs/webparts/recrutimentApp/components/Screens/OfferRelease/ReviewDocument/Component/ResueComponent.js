"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationToggle = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var ResueComponent_module_scss_1 = tslib_1.__importDefault(require("./ResueComponent.module.scss"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var VerificationToggle = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.hasError, hasError = _c === void 0 ? false : _c, _d = _a.label, label = _d === void 0 ? strings.DocumentVerificationStatus : _d;
    return (react_1.default.createElement("div", { className: "".concat(ResueComponent_module_scss_1.default.verificationToggle, " ").concat(hasError ? ResueComponent_module_scss_1.default.error : "") },
        react_1.default.createElement("label", { className: ResueComponent_module_scss_1.default.label }, label),
        react_1.default.createElement("div", { className: ResueComponent_module_scss_1.default.options },
            react_1.default.createElement(framer_motion_1.motion.button, { whileHover: { scale: disabled ? 1 : 1.02 }, whileTap: { scale: disabled ? 1 : 0.98 }, className: "".concat(ResueComponent_module_scss_1.default.option, " ").concat(value === "verified" ? ResueComponent_module_scss_1.default.optionVerified : ""), onClick: function () { return !disabled && onChange("verified"); }, type: "button", disabled: disabled },
                react_1.default.createElement(lucide_react_1.Check, { size: 16, strokeWidth: 3 }),
                strings.Verified),
            react_1.default.createElement(framer_motion_1.motion.button, { whileHover: { scale: disabled ? 1 : 1.02 }, whileTap: { scale: disabled ? 1 : 0.98 }, className: "".concat(ResueComponent_module_scss_1.default.option, " ").concat(value === "rejected" ? ResueComponent_module_scss_1.default.optionRejected : ""), onClick: function () { return !disabled && onChange("rejected"); }, type: "button", disabled: disabled },
                react_1.default.createElement(lucide_react_1.X, { size: 16, strokeWidth: 3 }),
                strings.Rejected)),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, hasError && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, className: ResueComponent_module_scss_1.default.errorText },
            react_1.default.createElement(lucide_react_1.AlertCircle, { size: 14 }),
            strings.PleaseVerifyTheDocumentStatusBeforeProce)))));
};
exports.VerificationToggle = VerificationToggle;
//# sourceMappingURL=ResueComponent.js.map