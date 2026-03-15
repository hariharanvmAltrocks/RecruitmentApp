"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssignMembers = void 0;
var react_1 = require("react");
var mockMembers = [
    {
        id: "hr-1",
        name: "Alex Mwamba",
        role: "Senior HR Partner",
        initials: "AM",
    },
    {
        id: "hr-2",
        name: "Sara Mensah",
        role: "Recruitment Specialist",
        initials: "SM",
    },
    {
        id: "hr-3",
        name: "Rahul Perera",
        role: "Talent Acquisition",
        initials: "RP",
    },
    {
        id: "hr-4",
        name: "Maria Okoro",
        role: "HR Business Partner",
        initials: "MO",
    },
];
var useAssignMembers = function () {
    var _a = (0, react_1.useState)([]), members = _a[0], setMembers = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        setLoading(true);
        var timer = setTimeout(function () {
            if (!isMounted) {
                return;
            }
            setMembers(mockMembers);
            setLoading(false);
        }, 900);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);
    var memoizedMembers = (0, react_1.useMemo)(function () { return members; }, [members]);
    return {
        members: memoizedMembers,
        loading: loading,
    };
};
exports.useAssignMembers = useAssignMembers;
//# sourceMappingURL=useAssignMembers.js.map