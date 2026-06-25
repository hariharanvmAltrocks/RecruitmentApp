"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateService = void 0;
var tslib_1 = require("tslib");
var MOCK_CANDIDATE_DATA = {
    "default": {
        appliedPositions: "Underground Shift Supervisor - Engineering",
        applicationStatus: "Interview Scheduled",
        interviewSchedule: "2026-06-28 02:30 PM (Level 2 Interview)",
        offerStatus: "Pending Interview Completion",
        profileCompletion: 85,
        recruiterName: "Altkamoa01 (HR Recruiter)",
        recruiterEmail: "recruitment@kamoacopper.com",
        messages: [
            { sender: "System", text: "Welcome to Kamoa Copper Recruitment Portal!", time: "2026-06-20 09:00 AM" },
            { sender: "Altkamoa01", text: "Hi, please make sure you upload your Police Clearance Certificate before the interview.", time: "2026-06-24 11:30 AM" },
            { sender: "Candidate", text: "Thank you. I have uploaded it now.", time: "2026-06-24 02:15 PM" }
        ],
        timeline: [
            { title: "Application Submitted", status: "completed", date: "2026-06-18", description: "Successfully applied for Underground Shift Supervisor" },
            { title: "Profile Screening", status: "completed", date: "2026-06-19", description: "Passed HR initial screening and credentials check" },
            { title: "Level 1 Interview (LM)", status: "completed", date: "2026-06-22", description: "Completed technical interview with Line Manager - 82% score" },
            { title: "Level 2 Interview (HOD)", status: "active", date: "2026-06-28", description: "Scheduled panel evaluation with Department HOD" },
            { title: "Background Verification (BGV)", status: "pending", description: "Verification of references, qualification, and criminal check" },
            { title: "Offer Release", status: "pending", description: "Pending final approvals and contract signature" }
        ],
        uploadedDocuments: [
            { name: "Curriculum_Vitae.pdf", status: "Approved", date: "2026-06-18" },
            { name: "University_Degree.pdf", status: "Approved", date: "2026-06-18" },
            { name: "Police_Clearance_Certificate.pdf", status: "Pending Verification", date: "2026-06-24" }
        ]
    }
};
var CandidateService = /** @class */ (function () {
    function CandidateService() {
    }
    CandidateService.getCandidateDashboard = function (email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            // Resolve default or specific by email
                            var data = MOCK_CANDIDATE_DATA[email.toLowerCase()] || MOCK_CANDIDATE_DATA["default"];
                            resolve(data);
                        }, 300);
                    })];
            });
        });
    };
    return CandidateService;
}());
exports.CandidateService = CandidateService;
//# sourceMappingURL=candidate.service.js.map