"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchCandidateDashboardDetails = void 0;
var react_1 = require("react");
var mockCandidates = [
    {
        id: "c1",
        applicantName: "Alyse E",
        jobCode: "SEN-100",
        jobTitle: "Senior Mining Engineer",
        businessUnitCode: "MIN-01",
        positionRequest: "Level 1",
        nationality: "Malian (Mali)",
        statusLabel: "Pending with LM to select the candidate",
        statusTone: "warning"
    },
    {
        id: "c2",
        applicantName: "John Smith",
        jobCode: "SEN-100",
        jobTitle: "Senior Mining Engineer",
        businessUnitCode: "MIN-01",
        positionRequest: "Level 1",
        nationality: "British",
        statusLabel: "Pending with LM to select the candidate",
        statusTone: "warning"
    },
    {
        id: "c3",
        applicantName: "Sarah Johnson",
        jobCode: "SEN-100",
        jobTitle: "Senior Mining Engineer",
        businessUnitCode: "MIN-01",
        positionRequest: "Level 1",
        nationality: "Canadian",
        statusLabel: "Reviewed - Ready",
        statusTone: "success"
    }
];
var useFetchCandidateDashboardDetails = function () {
    var _a = (0, react_1.useState)({
        data: [],
        loading: true,
        error: null
    }), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        var timer = setTimeout(function () {
            if (!isMounted) {
                return;
            }
            setState({ data: mockCandidates, loading: false, error: null });
        }, 450);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);
    return state;
};
exports.useFetchCandidateDashboardDetails = useFetchCandidateDashboardDetails;
//# sourceMappingURL=fetchCandidateDashboardDetails.js.map