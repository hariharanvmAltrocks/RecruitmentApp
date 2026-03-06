"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Loader = function () {
    return (react_1.default.createElement("div", { className: "flex h-[80vh] w-full items-center justify-center" },
        react_1.default.createElement("div", { className: "h-12 w-12 animate-[spin_1s_steps(10)_infinite] rounded-full p-[1px]", style: {
                background: "conic-gradient(#0000 10%, #597b98) content-box",
                WebkitMask: "\n            repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),\n            radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px))\n          ",
                WebkitMaskComposite: "destination-in",
                maskComposite: "intersect",
            } })));
};
exports.default = Loader;
//# sourceMappingURL=loader.js.map