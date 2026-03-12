import { useMemo } from "react";
import { useMenuData } from "../../../../utilities/hooks/MenuDataContext";
import { ListNames, RoleID, StatusId } from "../../../../utilities/Config";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { Choices } from "../../../../utilities/ApiConfig";

const useFilterMatricCard = () => {

    const { menuData } = useMenuData();

    const tabDetails = useMemo(() => {

        const result: any[] = [];

        const traverse = (node: any) => {

            if (!node?.TabDetails) return;

            node.TabDetails.forEach((child: any) => {

                if (child?.TabName) result.push(child);

                traverse(child);

            });

        };

        menuData?.forEach(traverse);

        return result;

    }, [menuData]);

    return { tabDetails };

};

const TAB_LIST_MAP: Record<string, string> = {
    "Review Job Advertistment": ListNames.HRMSRecruitmentDptDetails,
    "Review Score card": ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Evaluation": ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Interviews Scheduled": ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Interview Tracking": ListNames.HRMSRecruitmentCandidatePersonalDetails,
    "Offer Letters Released": ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Offers Accepted": ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Offers Rejected": ListNames.HRMSSelectedCandidateDetailsByHOD,
    "Candidates Onboarded": ListNames.HRMSSelectedCandidateDetailsByHOD,
};

const IGNORE_TABS = ["My Submission", "Advert Extension"];

// const buildQueriesFromTabs = (
//     tabDetails: any[],
//     additionalFilters: any[] = []
// ) => {

//     const statusQueries: any[] = [];
//     const additionalQueries: any[] = [];
//     const statusSet = new Set();

//     // 1️⃣ Build queries from TabDetails
//     tabDetails
//         .filter(tab => !IGNORE_TABS.includes(tab.TabName))
//         .forEach(tab => {

//             const listName = TAB_LIST_MAP[tab.TabName];
//             if (!listName) return;

//             tab.StatusDetails?.forEach((status: any) => {

//                 if (!status?.StatusId || statusSet.has(status.StatusId)) return;

//                 statusSet.add(status.StatusId);

//                 statusQueries.push({
//                     ListName: listName,
//                     filter: [
//                         {
//                             FilterKey: "Status",
//                             Operator: "eq",
//                             FilterValue: Number(status.StatusId)
//                         }
//                     ],
//                     select: ["Id"]
//                 });

//             });

//         });

//     // 2️⃣ Build queries from Additional Filters
//     additionalFilters.forEach((filter: any) => {

//         additionalQueries.push({
//             ListName: filter.ListName,
//             filter: [
//                 {
//                     FilterKey: filter.FilterKey,
//                     Operator: filter.Operator,
//                     FilterValue: filter.FilterValue
//                 }
//             ],
//             select: ["Id"]
//         });

//     });

//     // 3️⃣ Merge both query groups
//     return [...statusQueries, ...additionalQueries];

// };



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