"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCalculateDate = exports.SpiltDateOnly = void 0;
var SpiltDateOnly = function (date) {
    var updatedDate = date;
    var year = updatedDate === null || updatedDate === void 0 ? void 0 : updatedDate.getFullYear();
    var month = String((updatedDate === null || updatedDate === void 0 ? void 0 : updatedDate.getMonth()) + 1).padStart(2, "0");
    var day = String(updatedDate === null || updatedDate === void 0 ? void 0 : updatedDate.getDate()).padStart(2, "0");
    var dateOnly = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))); //`${year}-${month}-${day}`;
    return dateOnly.toISOString();
};
exports.SpiltDateOnly = SpiltDateOnly;
var AddCalculateDate = function (startDate, daysToAdd) {
    var validToDate = new Date(startDate);
    var addedDays = 0;
    while (addedDays < daysToAdd) {
        validToDate.setDate(validToDate.getDate() + 1);
        if (validToDate.getDay() === 0) {
            continue;
        }
        addedDays++;
    }
    if (validToDate.getDay() === 0) {
        validToDate.setDate(validToDate.getDate() + 1);
    }
    return validToDate;
};
exports.AddCalculateDate = AddCalculateDate;
//# sourceMappingURL=dateConfigfn.js.map