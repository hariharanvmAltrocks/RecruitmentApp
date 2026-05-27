"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageTitle = exports.MOCK_MENU = void 0;
exports.MOCK_MENU = [
    {
        Id: 27, DisplayName: "Selection Process", ParentId: 0,
        Path: "/RecurimentProcess", Icon: null, ActiveIcon: null,
        Sort: 1, IsActive: true, TabDetails: [], SubMenu: null,
        Children: [
            {
                Id: 30, DisplayName: "Pre-Selection Process", ParentId: 27,
                Path: "/RecurimentProcess", Icon: null, ActiveIcon: null,
                Sort: 1.1, IsActive: true, Children: [],
                TabDetails: [
                    { TabName: "Job Advertisement", Value: " ", StatusDetails: [{}] },
                    { TabName: "Assign Agencies", Value: " ", StatusDetails: [{}] },
                    { TabName: "Upload CV", Value: " ", StatusDetails: [{}] },
                    { TabName: "My Submission", Value: " ", StatusDetails: [{}] },
                ],
            },
            {
                Id: 31, DisplayName: "Post-Selection Process", ParentId: 27,
                Path: "/ReviewProfileList", Icon: null, ActiveIcon: null,
                Sort: 1.2, IsActive: true, Children: [],
                TabDetails: [
                    { TabName: "Review Profile", Value: " ", StatusDetails: [{}] },
                    { TabName: "Assign Interview Panel", Value: " ", StatusDetails: [{}] },
                    { TabName: "Interview Questions", Value: " ", StatusDetails: [{}] },
                    { TabName: "Evaluation", Value: " ", StatusDetails: [{}] },
                ],
            },
        ],
    },
    {
        Id: 28, DisplayName: "Recruitment Process", ParentId: 0,
        Path: "/UploadOfferDocumentList", Icon: null, ActiveIcon: null,
        Sort: 2, IsActive: true, SubMenu: null, Children: [],
        TabDetails: [
            { TabName: "Background Verification", Value: " ", StatusDetails: [{}] },
            { TabName: "Offer Letter - Labour Hire", Value: " ", StatusDetails: [{}] },
            { TabName: "Offer Letter - KCSA", Value: " ", StatusDetails: [{}] },
            { TabName: "My Submission", Value: " ", StatusDetails: [{}] },
        ],
    },
    {
        Id: 29, DisplayName: "Onboarding", ParentId: 0,
        Path: "/Onboarding", Icon: null, ActiveIcon: null,
        Sort: 3, IsActive: true, TabDetails: [], SubMenu: null,
        Children: [
            {
                Id: 40, DisplayName: "Document Collection", ParentId: 29,
                Path: "/Onboarding/Documents", Icon: null, ActiveIcon: null,
                Sort: 3.1, IsActive: true, Children: [],
                TabDetails: [
                    { TabName: "ID Documents", Value: " ", StatusDetails: [{}] },
                    { TabName: "Contracts", Value: " ", StatusDetails: [{}] },
                ],
            },
            {
                Id: 41, DisplayName: "IT Setup", ParentId: 29,
                Path: "/Onboarding/IT", Icon: null, ActiveIcon: null,
                Sort: 3.2, IsActive: true, Children: [],
                TabDetails: [
                    { TabName: "Equipment Request", Value: " ", StatusDetails: [{}] },
                    { TabName: "Access Rights", Value: " ", StatusDetails: [{}] },
                ],
            },
        ],
    },
    {
        Id: 32, DisplayName: "Reports", ParentId: 0,
        Path: "/Reports", Icon: null, ActiveIcon: null,
        Sort: 4, IsActive: true, SubMenu: null, Children: [],
        TabDetails: [
            { TabName: "Monthly Summary", Value: " ", StatusDetails: [{}] },
            { TabName: "Headcount Report", Value: " ", StatusDetails: [{}] },
            { TabName: "Audit Log", Value: " ", StatusDetails: [{}] },
        ],
    },
];
var PATH_TITLES = {
    "/RecurimentProcess": "Selection Process",
    "/ReviewProfileList": "Post-Selection Process",
    "/UploadOfferDocumentList": "Recruitment Process",
    "/Onboarding": "Onboarding",
    "/Reports": "Reports",
};
function getPageTitle(path) {
    if (PATH_TITLES[path])
        return PATH_TITLES[path];
    var match = Object.keys(PATH_TITLES).find(function (k) { return path.startsWith(k); });
    return match ? PATH_TITLES[match] : "HRMS";
}
exports.getPageTitle = getPageTitle;
//# sourceMappingURL=sidebar.js.map