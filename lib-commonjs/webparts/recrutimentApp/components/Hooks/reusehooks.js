"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalExperienceYears = calculateTotalExperienceYears;
exports.getcountryCode = getcountryCode;
function calculateTotalExperienceYears(experiences) {
    var totalMonths = 0;
    experiences.forEach(function (exp) {
        var startDate = new Date(exp.startFrom);
        var endDate;
        if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
            endDate = new Date(); // today
        }
        else {
            endDate = new Date(exp.endTo);
        }
        var months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
        // If end day is before start day, reduce one month
        if (endDate.getDate() < startDate.getDate()) {
            months--;
        }
        totalMonths += months;
    });
    var years = Math.floor(totalMonths / 12);
    var months = totalMonths % 12;
    return "".concat(years, " years and ").concat(months, " months");
}
function getcountryCode(Code, refMobile) {
    if (!refMobile)
        return null;
    var _a = refMobile.split("-"), countryCode = _a[0], mobileNumber = _a[1];
    var country = Code.find(function (item) { return item.code === countryCode; });
    if (!country)
        return null;
    return "".concat(country.id, "-").concat(mobileNumber);
}
//# sourceMappingURL=reusehooks.js.map