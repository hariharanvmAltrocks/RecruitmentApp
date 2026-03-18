"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchCandidateDetails = void 0;
var react_1 = require("react");
var mockDetails = {
    applicantName: "Alyse E",
    classification: "EXPAT",
    nationality: "Malian (Mali)",
    gender: "Female",
    qualification: "BSc Mining Engineering",
    miningExp: "8 Years",
    relatedExp: "5-10 Years",
    interviewDate: "2026-03-05",
    interviewLevels: "Level 1",
    conflicts: "No",
    disability: "No",
    panel: ["Michael Lopez", "Amina Kone", "Ravi Sharma"],
    questionnaires: [
        {
            id: "q1",
            question: "What are the three main financial statements, and how are they connected?",
            rating: "Excellent",
            score: 3,
            maxScore: 3
        },
        {
            id: "q2",
            question: "How would you evaluate a company's financial health using financial ratios?",
            rating: "Excellent",
            score: 3,
            maxScore: 3
        }
    ],
    scores: [
        { label: "Requirements", score: 5, maxScore: 5 },
        { label: "Culture", score: 5, maxScore: 5 },
        { label: "Expat", score: 5, maxScore: 5 },
        { label: "Other", score: 5, maxScore: 5 }
    ],
    recommendation: "Consider for Employment",
    panelFeedback: "Exceptional candidate with deep technical knowledge and strong leadership potential.",
    gpa: 5.0,
    jobCode: "FIN003",
    jobTitle: "Senior Mining Engineer"
};
var useFetchCandidateDetails = function (candidateId) {
    var _a = (0, react_1.useState)({
        data: null,
        loading: false,
        error: null
    }), state = _a[0], setState = _a[1];
    var details = (0, react_1.useMemo)(function () { return mockDetails; }, []);
    (0, react_1.useEffect)(function () {
        if (!candidateId) {
            setState({ data: null, loading: false, error: null });
            return;
        }
        var isMounted = true;
        setState({ data: null, loading: true, error: null });
        var timer = setTimeout(function () {
            if (!isMounted) {
                return;
            }
            setState({ data: details, loading: false, error: null });
        }, 350);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [candidateId, details]);
    return state;
};
exports.useFetchCandidateDetails = useFetchCandidateDetails;
//# sourceMappingURL=fetchCandidateDetails.js.map