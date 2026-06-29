"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var MenuDataContext_1 = require("../../../../utilities/hooks/MenuDataContext");
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
//# sourceMappingURL=useFilterMatricCard.js.map