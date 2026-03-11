"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleBasedFilters = void 0;
var react_1 = require("react");
var MenuDataContext_1 = require("../../../../utilities/hooks/MenuDataContext");
var Config_1 = require("../../../../utilities/Config");
var useFilterMatricCard = function () {
    var menuData = (0, MenuDataContext_1.useMenuData)().menuData;
    var tabDetails = (0, react_1.useMemo)(function () {
        var result = [];
        var traverse = function (node) {
            if (!(node === null || node === void 0 ? void 0 : node.TabDetails))
                return;
            node.TabDetails.forEach(function (child) {
                if (child === null || child === void 0 ? void 0 : child.TabName)
                    result.push(child);
                traverse(child);
            });
        };
        menuData === null || menuData === void 0 ? void 0 : menuData.forEach(traverse);
        return result;
    }, [menuData]);
    return { tabDetails: tabDetails };
};
var TAB_LIST_MAP = {
    "Review Job Advertistment": Config_1.ListNames.HRMSRecruitmentDptDetails,
    "Review Score card": Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Evaluation": Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Interviews Scheduled": Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Interview Tracking": Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Offer Letters Released": Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Offers Accepted": Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Offers Rejected": Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Candidates Onboarded": Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
};
var IGNORE_TABS = ["My Submission", "Advert Extension"];
var getRoleBasedFilters = function (role) {
    switch (role) {
        case Config_1.RoleID.LineManager:
            return [
                {
                    StateValue: 'hod-review',
                    ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
                    Filter: [
                        {
                            FilterKey: "StatusId",
                            Operator: "eq",
                            FilterValue: Config_1.StatusId.PendingwithHODtoreviewAdv
                        }
                    ],
                    select: ["Id"]
                },
                {
                    StateValue: 'pos-mapping',
                    ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                    Filter: [
                        {
                            FilterKey: "StatusId",
                            Operator: "eq",
                            FilterValue: Config_1.StatusId.PendingwithHODtoAssignPositionID
                        }
                    ],
                    select: ["Id"]
                },
                {
                    StateValue: 'pending-evaluation',
                    ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                    Filter: [
                        {
                            FilterKey: "StatusId",
                            Operator: "in",
                            FilterValue: [Config_1.StatusId.InterviewScheduled, Config_1.StatusId.InterviewScheduledforLevel2]
                        }
                    ],
                    select: ["Id"]
                },
                {
                    StateValue: 'interviews',
                    ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
                    Filter: [
                        {
                            FilterKey: "StatusId",
                            Operator: "eq",
                            FilterValue: [Config_1.StatusId.InterviewScheduled, Config_1.StatusId.InterviewScheduledforLevel2]
                        }
                    ],
                    select: ["Id"]
                },
            ];
        default:
            return [];
    }
};
exports.getRoleBasedFilters = getRoleBasedFilters;
// export const useQueries = () => {
//     const { tabDetails } = useFilterMatricCard();
//     const queries = useMemo(() => {
//         if (!tabDetails?.length) return [];
//         const Filter = [
//             {
//                 FilterKey: "Interviews Scheduled",
//                 Operator: "eq",
//                 FilterValue: "1"
//             },
//             {
//                 FilterKey: "Interview Tracking",
//                 Operator: "eq",
//                 FilterValue: "1"
//             },
//             {
//                 FilterKey: "Offer Letters Released",
//                 Operator: "eq",
//                 FilterValue: "1"
//             },
//             {
//                 FilterKey: "Offers Accepted",
//                 Operator: "eq",
//                 FilterValue: "1"
//             },
//             {
//                 FilterKey: "Offers Rejected",
//                 Operator: "eq",
//                 FilterValue: "1"
//             },
//             {
//                 FilterKey: "Candidates Onboarded",
//                 Operator: "eq",
//                 FilterValue: "1"
//             }
//         ];
//         return buildQueriesFromTabs(tabDetails, Filter);
//     }, [tabDetails]);
//     return queries;
// };
//# sourceMappingURL=useFilterMatricCard.js.map