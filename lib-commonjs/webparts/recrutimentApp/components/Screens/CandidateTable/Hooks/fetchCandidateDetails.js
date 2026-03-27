"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchCandidateDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var cache = new Map();
var useFetchCandidateDetails = function (candidateId, enabled) {
    if (enabled === void 0) { enabled = true; }
    var _a = (0, react_1.useState)({
        data: null,
        loading: false,
        error: null
    }), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        if (!candidateId || !enabled)
            return;
        var isMounted = true;
        setState({ data: null, loading: true, error: null });
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, value;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isMounted) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ServiceExport_1.CandidateTable.fetchCandidateDetails(candidateId)];
                    case 1:
                        response = _b.sent();
                        value = response.data && ((_a = response.data) === null || _a === void 0 ? void 0 : _a.length) > 0 ? response.data[0] : null;
                        setState({ data: value, loading: false, error: null });
                        return [2 /*return*/];
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