"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPanelEntry = exports.resolveName = exports.dedupe = void 0;
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
exports.dedupe = dedupe;
function resolveName(email) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(email)];
                case 1:
                    res = _c.sent();
                    return [2 /*return*/, String((_a = res.data) !== null && _a !== void 0 ? _a : email)];
                case 2:
                    _b = _c.sent();
                    return [2 /*return*/, email];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.resolveName = resolveName;
function toPanelEntry(item, levelFilter) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var label;
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
exports.toPanelEntry = toPanelEntry;
//# sourceMappingURL=ICandidateService.js.map