"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCandidatDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var UIStateContext_1 = require("../../../../RecrutimentApp/UIStateContext");
var useCandidatDetails = function (jobId, candidateID, selectedCandidateID, JobRequestID) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        if (!jobId || !candidateID || !selectedCandidateID || !JobRequestID) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var condition, response, data_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        condition = "and";
                        return [4 /*yield*/, ServiceExport_1.OfferServices.GetSelectedCandidate(jobId, candidateID, selectedCandidateID, JobRequestID)];
                    case 1:
                        response = _a.sent();
                        if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                            data_1 = response.data;
                            setData(data_1);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 650);
        return function () { return clearTimeout(timer); };
    }, [jobId, MatricID]);
    return { data: data, loading: loading };
};
exports.useCandidatDetails = useCandidatDetails;
//# sourceMappingURL=getCandidateDetails.js.map