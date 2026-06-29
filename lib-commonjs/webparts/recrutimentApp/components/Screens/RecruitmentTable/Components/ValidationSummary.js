"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSummary = void 0;
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_1 = tslib_1.__importDefault(require("react"));
require("../AdvertReviewDrawer/AdvertReviewDrawer.scss");
var ValidationSummary = function (_a) {
    var show = _a.show, messages = _a.messages;
    var invalidMessages = messages.filter(function (message) { return !message.valid; });
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, show && invalidMessages.length > 0 && (react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__validation", initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 } },
        react_1.default.createElement("div", { className: "advert-review-drawer__validation-header" },
            react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 14 }),
            react_1.default.createElement("span", null, "Please fix the following:")),
        invalidMessages.map(function (message) { return (react_1.default.createElement("div", { key: message.key, className: "advert-review-drawer__validation-message" },
            react_1.default.createElement(lucide_react_1.XCircle, { size: 13 }),
            react_1.default.createElement("span", null, message.text))); })))));
};
exports.ValidationSummary = ValidationSummary;
//# sourceMappingURL=ValidationSummary.js.map