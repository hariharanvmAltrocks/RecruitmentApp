"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./loading.scss");
var Loading = function (_a) {
    var text = _a.text;
    return (react_1.default.createElement("div", { className: "loadingOverlay" },
        react_1.default.createElement("div", { className: "spinner" }),
        react_1.default.createElement("div", { className: "loadingText" }, text)));
};
exports.default = Loading;
//# sourceMappingURL=loading.js.map