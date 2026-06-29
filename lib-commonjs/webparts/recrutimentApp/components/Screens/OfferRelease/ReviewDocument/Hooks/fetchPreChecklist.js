"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreChecklist = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var getInitials = function (title) {
    return title
        .split(" ")
        .map(function (w) { return w[0]; })
        .join("")
        .toUpperCase()
        .slice(0, 3);
};
var mockNationalData = [
    {
        ID: 1,
        Title: "Background Checks",
        Initials: "BC",
        value: null,
        type: "national",
    },
    {
        ID: 2,
        Title: "Medical Checks",
        Initials: "MC",
        value: null,
        type: "national",
    },
    {
        ID: 3,
        Title: "Signed Offer Letter",
        Initials: "SOL",
        value: null,
        type: "national",
    },
    {
        ID: 4,
        Title: "Employment Contract",
        Initials: "EC",
        value: null,
        type: "national",
    },
    {
        ID: 5,
        Title: "Ready for Onboarding",
        Initials: "RFO",
        value: null,
        type: "national",
    },
];
var mockExpatData = [
    {
        ID: 1,
        Title: "Background Checks",
        Initials: "BC",
        value: null,
        type: "expat",
    },
    {
        ID: 2,
        Title: "Signed Offer Letter",
        Initials: "SOL",
        value: null,
        type: "expat",
    },
    {
        ID: 3,
        Title: "Employment Contract",
        Initials: "EC",
        value: null,
        type: "expat",
    },
    {
        ID: 4,
        Title: "Work Permit Approved",
        Initials: "WPA",
        value: null,
        type: "expat",
    },
    {
        ID: 5,
        Title: "Visa Process",
        Initials: "RFO",
        value: null,
        type: "expat",
    },
    {
        ID: 6,
        Title: "Accommodation Booked",
        Initials: "AB",
        value: null,
        type: "expat",
    },
    {
        ID: 7,
        Title: "Travel Process",
        Initials: "TP",
        value: null,
        type: "expat",
    },
    {
        ID: 8,
        Title: "Ready for Onboarding",
        Initials: "RFO",
        value: null,
        type: "expat",
    },
];
var usePreChecklist = function (isExpat, preChecklist, IsActive) {
    var initialList = isExpat ? mockExpatData : mockNationalData;
    var _a = (0, react_1.useState)(initialList), checklist = _a[0], setChecklist = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var updateCheckItem = function (id, value) {
        setChecklist(function (prev) {
            return prev.map(function (item) { return (item.ID === id ? tslib_1.__assign(tslib_1.__assign({}, item), { value: value }) : item); });
        });
    };
    (0, react_1.useEffect)(function () {
        if (!isExpat || !IsActive || !preChecklist) {
            setChecklist(mockNationalData);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var ExpatData, NationalData;
            return tslib_1.__generator(this, function (_a) {
                ExpatData = [
                    {
                        ID: 1,
                        Title: "Background Checks",
                        Initials: "BC",
                        value: preChecklist.BackgroundChecks,
                        type: "expat",
                    },
                    {
                        ID: 2,
                        Title: "Signed Offer Letter",
                        Initials: "SOL",
                        value: preChecklist.SignedOfferLetterVerified,
                        type: "expat",
                    },
                    {
                        ID: 3,
                        Title: "Employment Contract",
                        Initials: "EC",
                        value: preChecklist.SignedEmploymentContract,
                        type: "expat",
                    },
                    {
                        ID: 4,
                        Title: "Work Permit Approved",
                        Initials: "WPA",
                        value: preChecklist.WorkPermitApproved,
                        type: "expat",
                    },
                    {
                        ID: 5,
                        Title: "Visa Process",
                        Initials: "RFO",
                        value: preChecklist.VisaProcess,
                        type: "expat",
                    },
                    {
                        ID: 6,
                        Title: "Accommodation Booked",
                        Initials: "AB",
                        value: preChecklist.AccommodationBooked,
                        type: "expat",
                    },
                    {
                        ID: 7,
                        Title: "Travel Process",
                        Initials: "TP",
                        value: preChecklist.TravelProcess,
                        type: "expat",
                    },
                    {
                        ID: 8,
                        Title: "Ready for Onboarding",
                        Initials: "RFO",
                        value: preChecklist.ReadyForOnboarding,
                        type: "expat",
                    },
                ];
                NationalData = [
                    {
                        ID: 1,
                        Title: "Background Checks",
                        Initials: "BC",
                        value: preChecklist.BackgroundChecks,
                        type: "national",
                    },
                    {
                        ID: 2,
                        Title: "Medical Checks",
                        Initials: "MC",
                        value: preChecklist.MedicalCheckStatus,
                        type: "national",
                    },
                    {
                        ID: 3,
                        Title: "Signed Offer Letter",
                        Initials: "SOL",
                        value: preChecklist.SignedOfferLetterVerified,
                        type: "national",
                    },
                    {
                        ID: 4,
                        Title: "Employment Contract",
                        Initials: "EC",
                        value: preChecklist.SignedEmploymentContract,
                        type: "national",
                    },
                    {
                        ID: 5,
                        Title: "Ready for Onboarding",
                        Initials: "RFO",
                        value: preChecklist.ReadyForOnboarding,
                        type: "national",
                    },
                ];
                setChecklist(isExpat ? ExpatData : NationalData);
                return [2 /*return*/];
            });
        }); }, 650);
        return function () { return clearTimeout(timer); };
    }, [isExpat, IsActive, preChecklist]);
    var allChecked = checklist.length > 0 && checklist.every(function (item) { return item.value === true; });
    return { checklist: checklist, allChecked: allChecked, loading: loading, updateCheckItem: updateCheckItem };
};
exports.usePreChecklist = usePreChecklist;
//# sourceMappingURL=fetchPreChecklist.js.map