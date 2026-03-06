"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var loader_1 = tslib_1.__importDefault(require("./loader"));
var CustomLoader = function (_a) {
    var _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, style = _a.style, _c = _a.className, className = _c === void 0 ? "" : _c, children = _a.children;
    if (isLoading) {
        return react_1.default.createElement(loader_1.default, null);
    }
    return (react_1.default.createElement("div", { style: style, className: className }, children));
};
exports.default = CustomLoader;
//# sourceMappingURL=CustomLoader.js.map