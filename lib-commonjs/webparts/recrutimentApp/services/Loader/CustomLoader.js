"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var loader_1 = tslib_1.__importDefault(require("./loader"));
var CustomLoader = function (_a) {
    var _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, style = _a.style, _c = _a.className, className = _c === void 0 ? "" : _c, _d = _a.userName, userName = _d === void 0 ? "" : _d, children = _a.children;
    var _e = (0, react_1.useState)(false), isComplete = _e[0], setIsComplete = _e[1];
    (0, react_1.useEffect)(function () {
        if (isLoading) {
            setIsComplete(false);
        }
    }, [isLoading]);
    if (isLoading || !isComplete) {
        return (react_1.default.createElement(loader_1.default, { isLoading: isLoading, onComplete: function () { return setIsComplete(true); }, userName: userName }));
    }
    return (react_1.default.createElement("div", { style: style, className: className }, children));
};
exports.default = CustomLoader;
//# sourceMappingURL=CustomLoader.js.map