"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignatureDetails = void 0;
var react_1 = require("react");
var useSignatureDetails = function (jobId) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var mockMap = (0, react_1.useMemo)(function () { return ({
        "JOB-001": {
            reviewerName: "Jackson Mulenga",
            reviewerInitial: "JM",
            jobTitleEN: "HOD - Mining",
            jobTitleFR: "Chef de d�partement - Mines",
        },
        "JOB-002": {
            reviewerName: "Alisha Nsimba",
            reviewerInitial: "AN",
            jobTitleEN: "Senior Geologist",
            jobTitleFR: "G�ologue principal",
        },
    }); }, []);
    (0, react_1.useEffect)(function () {
        if (!jobId) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () {
            var _a;
            setData((_a = mockMap[jobId]) !== null && _a !== void 0 ? _a : mockMap["JOB-001"]);
            setLoading(false);
        }, 550);
        return function () { return clearTimeout(timer); };
    }, [jobId, mockMap]);
    return { data: data, loading: loading };
};
exports.useSignatureDetails = useSignatureDetails;
//# sourceMappingURL=getSignatureDetails.js.map