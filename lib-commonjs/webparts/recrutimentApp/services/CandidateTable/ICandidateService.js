"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedupe = dedupe;
exports.resolveName = resolveName;
exports.toPanelEntry = toPanelEntry;
var tslib_1 = require("tslib");
var ServiceExport_1 = require("../ServiceExport");
function dedupe(arr) {
    var seen = new Set();
    return arr.filter(function (item) {
        if (seen.has(item.value))
            return false;
        seen.add(item.value);
        return true;
    });
}
function resolveName(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, _a;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(email)];
                case 1:
                    res = _c.sent();
                    return [2 /*return*/, String((_b = res.data) !== null && _b !== void 0 ? _b : email)];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, email];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function toPanelEntry(item, levelFilter) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var label;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!((_a = item === null || item === void 0 ? void 0 : item.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, resolveName(item.InterviewPanel.EMail)];
                case 1:
                    label = _b.sent();
                    return [2 /*return*/, tslib_1.__assign({ value: item.InterviewPanel.Id, label: label, Email: item.InterviewPanel.EMail, Levels: item.InterviewLevel }, (levelFilter ? { Levels: levelFilter } : {}))];
            }
        });
    });
}
//# sourceMappingURL=ICandidateService.js.map