"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.toUTC = exports.toDate = exports.formatToDateTimeLocal = exports.ConvertUtc = exports.toAttachment = exports.AddCalculateDate = exports.SpiltDateOnly = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
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
function toAttachment(title, docs, lang) {
    if (lang === void 0) { lang = "EN"; }
    return {
        title: title,
        type: "PDF",
        versions: docs.map(function (d) { return ({
            lang: "EN",
            label: d.name,
            content: d.content,
        }); }),
    };
}
exports.toAttachment = toAttachment;
var ConvertUtc = function (date) {
    var startUtc = (0, moment_1.default)(date)
        .hour(date.getHours())
        .minute(date.getMinutes() || 0)
        .second(0)
        .utc()
        .toISOString();
    return startUtc;
};
exports.ConvertUtc = ConvertUtc;
var formatToDateTimeLocal = function (dateString) {
    var date = new Date(dateString);
    var pad = function (n) { return n.toString().padStart(2, "0"); };
    return "".concat(date.getFullYear(), "-").concat(pad(date.getMonth() + 1), "-").concat(pad(date.getDate()), "T").concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()));
};
exports.formatToDateTimeLocal = formatToDateTimeLocal;
var toDate = function (value) {
    return value ? new Date(value) : undefined;
};
exports.toDate = toDate;
var toUTC = function (dateStr) {
    return new Date(dateStr).toISOString();
};
exports.toUTC = toUTC;
var formatDate = function (dateString) {
    if (!dateString)
        return "";
    return new Date(dateString).toISOString().split("T")[0];
};
exports.formatDate = formatDate;
//# sourceMappingURL=dateConfigfn.js.map