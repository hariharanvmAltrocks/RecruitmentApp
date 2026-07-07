"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupedHRLead = exports.groupedHR = exports.isFiveMonthsBeforeCurrent = exports.getDueMonthRatio = exports.getMonthDifference = exports.isCurrentMonthAndYear2 = exports.isCurrentMonthAndYear = exports.currentMonthLong = exports.currentMonthAbbr = exports.monthsArray = exports.currentMonthIndex = exports.currentYear = exports.currentDate = void 0;
var Config_1 = require("../../../utilities/Config");
exports.currentDate = new Date();
exports.currentYear = exports.currentDate.getFullYear();
exports.currentMonthIndex = exports.currentDate.getMonth(); // 0-11
exports.monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
exports.currentMonthAbbr = exports.monthsArray[exports.currentMonthIndex];
exports.currentMonthLong = exports.currentDate.toLocaleString("default", { month: "long" }).toLowerCase();
var isCurrentMonthAndYear = function (itemMonth, itemYear) {
    if (!itemMonth)
        return false;
    var y = Number(itemYear) || exports.currentYear;
    if (y !== exports.currentYear)
        return false;
    var m = String(itemMonth).toLowerCase();
    return m.startsWith(exports.currentMonthAbbr.toLowerCase()) || m === exports.currentMonthLong;
};
exports.isCurrentMonthAndYear = isCurrentMonthAndYear;
var isCurrentMonthAndYear2 = function (dateValue) {
    if (!dateValue)
        return false;
    var date = new Date(dateValue);
    // Invalid date
    if (isNaN(date.getTime()))
        return false;
    return (date.getFullYear() === exports.currentYear &&
        date.getMonth() === exports.currentMonthIndex);
};
exports.isCurrentMonthAndYear2 = isCurrentMonthAndYear2;
var getMonthDifference = function (d1, d2) {
    return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
};
exports.getMonthDifference = getMonthDifference;
var getDueMonthRatio = function (month, recruitmentProcess) {
    var matchingItems = recruitmentProcess.filter(function (item) {
        if (!item.DateRequried)
            return false;
        var date = new Date(item.DateRequried);
        return !isNaN(date.getTime()) && date.getMonth() === month;
    });
    var total = matchingItems.length;
    var onboarded = matchingItems.filter(function (item) { return Number(item.StatusId) === Config_1.StatusId.Onboarded; }).length;
    return "".concat(onboarded, " / ").concat(total);
};
exports.getDueMonthRatio = getDueMonthRatio;
var isFiveMonthsBeforeCurrent = function (dateRequired) {
    if (!dateRequired)
        return false;
    var requiredDate = new Date(dateRequired);
    requiredDate.setMonth(requiredDate.getMonth() - 5);
    var currentDate = new Date();
    return (requiredDate.getMonth() === currentDate.getMonth() &&
        requiredDate.getFullYear() === currentDate.getFullYear());
};
exports.isFiveMonthsBeforeCurrent = isFiveMonthsBeforeCurrent;
var groupedHR = function (rec) {
    return rec.reduce(function (acc, item) {
        var email = item.AssignedHR;
        if (!email)
            return acc;
        if (!acc[email])
            acc[email] = [];
        acc[email].push(item);
        return acc;
    }, {});
};
exports.groupedHR = groupedHR;
var groupedHRLead = function (rec) {
    return rec.reduce(function (acc, item) {
        var email = item.RecruitmentHRLead;
        if (!email)
            return acc;
        if (!acc[email])
            acc[email] = [];
        acc[email].push(item);
        return acc;
    }, {});
};
exports.groupedHRLead = groupedHRLead;
// const _hrNameCache = new Map<string, string>();
//   const _getHRName = async (email: string) => {
//     if (!email) return "N/A";
//     const normalizedEmail = email.toLowerCase().trim();
//     if (this._hrNameCache.has(normalizedEmail)) {
//       return this._hrNameCache.get(normalizedEmail)!;
//     }
//     try {
//       const hrRes = await CommonServices.GetUserName(email);
//       const name = hrRes.data ?? email;
//       this._hrNameCache.set(normalizedEmail, name);
//       return name;
//     } catch (error) {
//       console.error(`Error resolving HR name for ${email}:`, error);
//       return email;
//     }
//   }
//# sourceMappingURL=DashboardConfig.js.map