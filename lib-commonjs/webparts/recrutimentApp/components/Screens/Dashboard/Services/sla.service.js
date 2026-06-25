"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlaService = void 0;
var tslib_1 = require("tslib");
var MOCK_SLA_STATS = {
    overallSla: 78,
    onTrack: 25,
    dueSoon: 47,
    overdue: 20,
    avgCompletionTime: 42, // Average hiring/contract completion time in days
    avgDaysRemaining: 38
};
var SlaService = /** @class */ (function () {
    function SlaService() {
    }
    SlaService.getSlaStats = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(MOCK_SLA_STATS);
                        }, 300);
                    })];
            });
        });
    };
    return SlaService;
}());
exports.SlaService = SlaService;
//# sourceMappingURL=sla.service.js.map