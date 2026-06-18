"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var loader_1 = tslib_1.__importDefault(require("./loader"));
var CustomLoader = function (_a) {
    var _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.progress, progress = _c === void 0 ? 0 : _c, _d = _a.statusMessage, statusMessage = _d === void 0 ? "Initializing Application..." : _d, style = _a.style, _e = _a.className, className = _e === void 0 ? "" : _e, _f = _a.userName, userName = _f === void 0 ? "" : _f, children = _a.children;
    var _g = (0, react_1.useState)(false), isComplete = _g[0], setIsComplete = _g[1];
    (0, react_1.useEffect)(function () {
        if (isLoading) {
            setIsComplete(false);
        }
    }, [isLoading]);
    var showLoader = isLoading || !isComplete;
    var showContent = !isLoading;
    return (react_1.default.createElement("div", { style: tslib_1.__assign(tslib_1.__assign({}, style), { position: "relative", minHeight: "100vh" }), className: className },
        showContent && (react_1.default.createElement("div", { className: "rms-app-content-fade-in" }, children)),
        showLoader && (react_1.default.createElement(loader_1.default, { isLoading: isLoading, progress: progress, statusMessage: statusMessage, onComplete: function () { return setIsComplete(true); }, userName: userName }))));
};
exports.default = CustomLoader;
//# sourceMappingURL=CustomLoader.js.map