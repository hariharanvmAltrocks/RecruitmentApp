"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripHtml = void 0;
var stripHtml = function (html) {
    var _a, _b;
    if (!html)
        return "";
    var doc = new DOMParser().parseFromString(html, "text/html");
    return (_b = (_a = doc.body.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
};
exports.stripHtml = stripHtml;
//# sourceMappingURL=IRecruitmentService.js.map