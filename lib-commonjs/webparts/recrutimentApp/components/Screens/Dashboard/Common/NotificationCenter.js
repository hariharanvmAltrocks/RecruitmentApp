"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useNotifications_1 = require("../Hooks/useNotifications");
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Common_module_scss_1 = tslib_1.__importDefault(require("./Common.module.scss"));
var NotificationCenter = function () {
    var _a = (0, useNotifications_1.useNotifications)(), notifications = _a.data, refresh = _a.refresh;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var dropdownRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var handleOutsideClick = function (e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return function () {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);
    var count = notifications ? notifications.length : 0;
    return (react_1.default.createElement("div", { style: { position: "relative" }, ref: dropdownRef },
        react_1.default.createElement("div", { className: Common_module_scss_1.default.notificationBadge, onClick: function () { return setIsOpen(!isOpen); } },
            react_1.default.createElement(Lucide.Bell, { size: 18 }),
            count > 0 && react_1.default.createElement("span", { className: Common_module_scss_1.default.badgeCount }, count)),
        isOpen && (react_1.default.createElement("div", { className: Common_module_scss_1.default.notificationDropdown },
            react_1.default.createElement("div", { className: Common_module_scss_1.default.dropdownHeader },
                react_1.default.createElement("h3", null, "Notifications"),
                count > 0 && (react_1.default.createElement("button", { className: Common_module_scss_1.default.clearAllBtn, onClick: function () {
                        // Simply refresh or clear
                        void refresh();
                    } }, "Clear"))),
            react_1.default.createElement("div", { className: Common_module_scss_1.default.notificationList }, count === 0 ? (react_1.default.createElement("div", { style: { padding: "16px", textAlign: "center", fontSize: "0.75rem", color: "#64748b" } }, "No new notifications")) : (notifications === null || notifications === void 0 ? void 0 : notifications.map(function (item) {
                var iconColor = Common_module_scss_1.default.notifIconBlue;
                var Icon = Lucide.Info;
                if (item.type === "error") {
                    iconColor = Common_module_scss_1.default.notifIconRed;
                    Icon = Lucide.AlertCircle;
                }
                else if (item.type === "warning") {
                    iconColor = Common_module_scss_1.default.notifIconYellow;
                    Icon = Lucide.AlertTriangle;
                }
                else if (item.type === "success") {
                    iconColor = Common_module_scss_1.default.notifIconGreen;
                    Icon = Lucide.CheckCircle;
                }
                return (react_1.default.createElement("div", { key: item.id, className: Common_module_scss_1.default.notificationItem },
                    react_1.default.createElement("div", { className: "".concat(Common_module_scss_1.default.notifIcon, " ").concat(iconColor) },
                        react_1.default.createElement(Icon, { size: 12 })),
                    react_1.default.createElement("div", { style: { display: "flex", flexDirection: "column" } },
                        react_1.default.createElement("span", { className: Common_module_scss_1.default.notifText }, item.text),
                        react_1.default.createElement("span", { className: Common_module_scss_1.default.notifTime }, item.timestamp))));
            })))))));
};
exports.NotificationCenter = NotificationCenter;
exports.default = exports.NotificationCenter;
//# sourceMappingURL=NotificationCenter.js.map