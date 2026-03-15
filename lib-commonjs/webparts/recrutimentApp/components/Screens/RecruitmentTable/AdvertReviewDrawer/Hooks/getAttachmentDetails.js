"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAttachmentDetails = void 0;
var react_1 = require("react");
var useAttachmentDetails = function (jobId) {
    var _a = (0, react_1.useState)([]), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var mockMap = (0, react_1.useMemo)(function () { return ({
        "JOB-001": [
            {
                title: "Job Description Document",
                type: "PDF",
                versions: [
                    { lang: "EN", label: "English Version", size: "2.4MB" },
                    { lang: "FR", label: "French Version", size: "2.2MB" },
                ],
            },
            {
                title: "Safety Compliance Policy",
                type: "PDF",
                versions: [{ lang: "EN", label: "Policy Document", size: "1.1MB" }],
            },
            {
                title: "Role Expectations",
                type: "DOC",
                versions: [
                    { lang: "EN", label: "Editable Version", size: "430KB" },
                    { lang: "FR", label: "Version FR", size: "415KB" },
                ],
            },
        ],
        "JOB-002": [
            {
                title: "Exploration Overview",
                type: "PDF",
                versions: [{ lang: "EN", label: "Exploration Brief", size: "1.7MB" }],
            },
            {
                title: "Data Collection Sheet",
                type: "XLS",
                versions: [{ lang: "EN", label: "Spreadsheet", size: "920KB" }],
            },
        ],
    }); }, []);
    (0, react_1.useEffect)(function () {
        if (!jobId) {
            setData([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () {
            var _a;
            setData((_a = mockMap[jobId]) !== null && _a !== void 0 ? _a : mockMap["JOB-001"]);
            setLoading(false);
        }, 600);
        return function () { return clearTimeout(timer); };
    }, [jobId, mockMap]);
    return { data: data, loading: loading };
};
exports.useAttachmentDetails = useAttachmentDetails;
//# sourceMappingURL=getAttachmentDetails.js.map