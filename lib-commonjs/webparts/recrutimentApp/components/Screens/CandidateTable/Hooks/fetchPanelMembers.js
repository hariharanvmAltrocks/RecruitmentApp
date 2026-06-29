"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchPanelMembers = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var cache = new Map();
var useFetchPanelMembers = function (bucodeId, assignHREmail, candidateID, statusID, enabled) {
    if (enabled === void 0) { enabled = true; }
    var _a = (0, react_1.useState)({
        data: null,
        loading: false,
        error: null
    }), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        if (!bucodeId || !candidateID || !enabled)
            return;
        var isMounted = true;
        setState({ data: null, loading: true, error: null });
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var obj, response, value;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isMounted) {
                            return [2 /*return*/];
                        }
                        obj = {
                            BUCodeID: bucodeId,
                            assignHREmail: assignHREmail,
                            candidateID: candidateID,
                            statusID: statusID
                        };
                        return [4 /*yield*/, ServiceExport_1.CandidateTable.fetchInterviewPanelDetails(obj)];
                    case 1:
                        response = _b.sent();
                        value = (_a = response.data) !== null && _a !== void 0 ? _a : null;
                        setState({ data: value, loading: false, error: null });
                        return [2 /*return*/];
                }
            });
        }); }, 350);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [bucodeId, candidateID, enabled]);
    return state;
};
exports.useFetchPanelMembers = useFetchPanelMembers;
//# sourceMappingURL=fetchPanelMembers.js.map