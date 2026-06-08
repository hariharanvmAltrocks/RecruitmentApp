"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmployeeDictionary = void 0;
var tslib_1 = require("tslib");
var Config_1 = require("../../utilities/Config");
var spservice_1 = require("../SPService/spservice");
function GetEmployeeDictionary(emails) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var employeeMap, filter, sp, employees, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    employeeMap = new Map();
                    if (!emails.length) {
                        return [2 /*return*/, employeeMap];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    filter = emails
                        .map(function (email) { return "EmailId eq '".concat(email, "'"); })
                        .join(" or ");
                    sp = (0, spservice_1.getSP)();
                    return [4 /*yield*/, sp.web.lists
                            .getByTitle(Config_1.ListNames.HRMSSageList)
                            .items
                            .select("*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,Department/DepartmentName,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade")
                            .expand("JobTitleInEnglish,JobTitleInFrench,Department,PatersonGrade,DRCGrade")
                            .filter(filter)
                            .top(1)()];
                case 2:
                    employees = _a.sent();
                    employees.forEach(function (item) {
                        var _a, _b, _c, _d, _e, _f;
                        employeeMap.set((_a = item.EmailId) === null || _a === void 0 ? void 0 : _a.toLowerCase(), {
                            ID: item.ID,
                            EmailId: item.EmailId,
                            DepartmentId: item.DepartmentId,
                            CurrentPosition: item.CurrentPosition,
                            DepartmentName: ((_b = item.Department) === null || _b === void 0 ? void 0 : _b.DepartmentName) || "",
                            FirstName: item.FirstName || "",
                            MiddleName: item.MiddleName || "",
                            LastName: item.LastName || "",
                            JopTitleEnglish: ((_c = item.JobTitleInEnglish) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) || "",
                            JopTitleFrench: ((_d = item.JobTitleInFrench) === null || _d === void 0 ? void 0 : _d.JobTitleInFrench) || "",
                            DRCGrade: ((_e = item.DRCGrade) === null || _e === void 0 ? void 0 : _e.DRCGrade) || "",
                            PatersonGrade: ((_f = item.PatersonGrade) === null || _f === void 0 ? void 0 : _f.PatersonGrade) || "",
                            BusinessAddress: item.BusinessAddress || "",
                            HomeAddress: item.HomeAddress || "",
                            ContactNumber: item.ContactNumber || "",
                            BusinessUnitCode: item.BusinessUnitCode || "",
                            BusinessUnitID: item.BusinessUnitID || 0,
                            Nationality: item.Nationality || "",
                        });
                    });
                    return [2 /*return*/, employeeMap];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching employee dictionary:", error_1);
                    return [2 /*return*/, employeeMap];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.GetEmployeeDictionary = GetEmployeeDictionary;
//# sourceMappingURL=SageService.js.map