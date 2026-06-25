"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPICard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Cards_module_scss_1 = tslib_1.__importDefault(require("./Cards.module.scss"));
var KPICard = function (_a) {
    var title = _a.title, value = _a.value, iconName = _a.iconName, _b = _a.iconTheme, iconTheme = _b === void 0 ? "blue" : _b, footerText = _a.footerText, onClick = _a.onClick;
    // Retrieve Lucide icon dynamically
    var IconComponent = Lucide[iconName];
    var themeClass = Cards_module_scss_1.default.iconBlue;
    if (iconTheme === "purple")
        themeClass = Cards_module_scss_1.default.iconPurple;
    else if (iconTheme === "orange")
        themeClass = Cards_module_scss_1.default.iconOrange;
    else if (iconTheme === "red")
        themeClass = Cards_module_scss_1.default.iconRed;
    else if (iconTheme === "green")
        themeClass = Cards_module_scss_1.default.iconGreen;
    else if (iconTheme === "gray")
        themeClass = Cards_module_scss_1.default.iconGray;
    return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.glassCard, onClick: onClick },
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.cardHeader },
            react_1.default.createElement("span", { className: Cards_module_scss_1.default.cardTitle }, title),
            react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.cardIconContainer, " ").concat(themeClass) }, IconComponent && react_1.default.createElement(IconComponent, { size: 20 }))),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.cardBody },
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.cardValue }, value)),
        footerText && (react_1.default.createElement("div", { className: Cards_module_scss_1.default.cardFooter },
            react_1.default.createElement("span", null, footerText),
            react_1.default.createElement("span", { style: { fontSize: "10px" } }, "\u2794")))));
};
exports.KPICard = KPICard;
exports.default = exports.KPICard;
//# sourceMappingURL=KPICard.js.map