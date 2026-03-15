"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePositionDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var buildMockPosition = function (jobId) { return ({
    jobId: jobId,
    jobTitle: "Head of Mining",
    jobCode: "MIN-001",
    department: "Mining Operations",
    buCode: "BU-OPS",
    buName: "Operations",
    subDepartment: "Open Pit",
    section: "Drilling",
    deptCode: "DEPT-MIN",
    reportsTo: "VP Operations",
    areaOfWork: "Kilimanjaro Site",
    nationality: "Open",
    patersonGrade: "D5",
    drcGrade: "G12",
    employmentCategory: "Permanent",
    contractType: "Full-time",
    numberOfPersons: 2,
    dateRequired: "2026-04-01",
}); };
var usePositionDetails = function (jobId) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var mockMap = (0, react_1.useMemo)(function () { return ({
        "JOB-001": tslib_1.__assign(tslib_1.__assign({}, buildMockPosition("JOB-001")), { jobTitle: "HOD - Mining", jobCode: "HOD-MIN", department: "Mining", areaOfWork: "Kolwezi Site" }),
        "JOB-002": tslib_1.__assign(tslib_1.__assign({}, buildMockPosition("JOB-002")), { jobTitle: "Senior Geologist", jobCode: "GEO-204", department: "Exploration", areaOfWork: "Lubumbashi", numberOfPersons: 1 }),
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
            setData((_a = mockMap[jobId]) !== null && _a !== void 0 ? _a : buildMockPosition(jobId));
            setLoading(false);
        }, 650);
        return function () { return clearTimeout(timer); };
    }, [jobId, mockMap]);
    return { data: data, loading: loading };
};
exports.usePositionDetails = usePositionDetails;
//# sourceMappingURL=getPositionDetails.js.map