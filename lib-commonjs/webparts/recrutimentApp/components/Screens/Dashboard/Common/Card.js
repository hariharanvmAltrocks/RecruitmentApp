"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Card_module_scss_1 = tslib_1.__importDefault(require("./Card.module.scss"));
var Card = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b, onClick = _a.onClick, _c = _a.hoverable, hoverable = _c === void 0 ? false : _c;
    return (react_1.default.createElement("div", { className: "".concat(Card_module_scss_1.default.card, " ").concat(hoverable ? Card_module_scss_1.default["card--hoverable"] : "", " ").concat(onClick ? Card_module_scss_1.default["card--clickable"] : "", " ").concat(className), onClick: onClick }, children));
};
exports.Card = Card;
exports.default = exports.Card;
//# sourceMappingURL=Card.js.map