"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecruitmentDetails = void 0;
var react_1 = require("react");
var mockRecruitmentItems = [
    {
        id: "vac-1",
        jobCode: "MIN-100",
        title: "Senior Mining Engineer - Mining",
        department: "Mining",
        count: 1,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-2",
        jobCode: "ENG-101",
        title: "Underground Shift Supervisor - Engineering",
        department: "Engineering",
        count: 2,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-3",
        jobCode: "SHE-102",
        title: "Geotechnical Technician - SHEQ",
        department: "SHEQ",
        count: 3,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-4",
        jobCode: "PRO-103",
        title: "Mechanical Foreman - Processing",
        department: "Processing",
        count: 4,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-5",
        jobCode: "HUM-104",
        title: "Safety Officer - Human Resources",
        department: "Human Resources",
        count: 5,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-6",
        jobCode: "SUP-105",
        title: "Plant Electrician - Supply Chain",
        department: "Supply Chain",
        count: 1,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
    {
        id: "vac-7",
        jobCode: "ICT-106",
        title: "HR Coordinator - ICT",
        department: "ICT",
        count: 2,
        requestType: "New Position",
        nationality: "Local",
        status: "READY FOR RECRUITMENT",
    },
];
var useRecruitmentDetails = function (tabKey) {
    var _a = (0, react_1.useState)([]), items = _a[0], setItems = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        setLoading(true);
        var timer = setTimeout(function () {
            if (!isMounted) {
                return;
            }
            setItems(mockRecruitmentItems);
            setLoading(false);
        }, 1100);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [tabKey]);
    var memoizedItems = (0, react_1.useMemo)(function () { return items; }, [items]);
    return {
        items: memoizedItems,
        loading: loading,
    };
};
exports.useRecruitmentDetails = useRecruitmentDetails;
//# sourceMappingURL=useRecruitmentDetails.js.map