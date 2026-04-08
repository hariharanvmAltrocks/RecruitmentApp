"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchCandidateDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var cache = new Map();
var useFetchCandidateDetails = function (candidateId, recruitmentID, enabled) {
    if (enabled === void 0) { enabled = true; }
    var _a = (0, react_1.useState)({
        data: null,
        loading: false,
        error: null,
    }), state = _a[0], setState = _a[1];
    var matricId = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        if (!candidateId || !enabled)
            return;
        var isMounted = true;
        setState({ data: null, loading: true, error: null });
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, value, value;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!isMounted) {
                            return [2 /*return*/];
                        }
                        if (!(matricId === ConditionConfig_1.MatricID.AssignInterviewPanel)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ServiceExport_1.CandidateTable.getCandidateDetailsL2(Number(candidateId))];
                    case 1:
                        response = _c.sent();
                        value = response.data && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.length) > 0 ? response.data[0] : null;
                        setState({ data: value, loading: false, error: null });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, ServiceExport_1.CandidateTable.fetchCandidateDetails(candidateId)];
                    case 3:
                        response = _c.sent();
                        value = response.data && ((_b = response.data) === null || _b === void 0 ? void 0 : _b.length) > 0 ? response.data[0] : null;
                        setState({ data: value, loading: false, error: null });
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }, 350);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [candidateId, enabled]);
    return state;
};
exports.useFetchCandidateDetails = useFetchCandidateDetails;
//# sourceMappingURL=fetchCandidateDetails.js.map