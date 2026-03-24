"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapRecruitmentItems = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var _mapRecruitmentItems = function (res) {
    return res.map(function (item, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
        return ({
            ID: item.ID,
            RecordID: index + 1,
            BusinessUnitCode: (_b = (_a = item.BusinessUnitCode) === null || _a === void 0 ? void 0 : _a.BusineesUnitCode) !== null && _b !== void 0 ? _b : "",
            BusinessUnitCodeId: (_c = item.BusinessUnitCodeId) !== null && _c !== void 0 ? _c : "",
            BusinessUnitName: "",
            BusinessUnitDescription: "",
            Nationality: item.Nationality,
            Department: (_e = (_d = item.Department) === null || _d === void 0 ? void 0 : _d.DepartmentName) !== null && _e !== void 0 ? _e : "",
            DepartmentId: item.DepartmentId,
            SubDepartment: (_g = (_f = item.SubDepartment) === null || _f === void 0 ? void 0 : _f.SubDepTitle) !== null && _g !== void 0 ? _g : "",
            SubDepartmentId: item.SubDepartmentId,
            Section: (_j = (_h = item.Section) === null || _h === void 0 ? void 0 : _h.SectionName) !== null && _j !== void 0 ? _j : "",
            SectionId: item.SectionId,
            DepartmentCodeId: item.DepartmentCodeId,
            DepartmentCode: (_l = (_k = item.DepartmentCode) === null || _k === void 0 ? void 0 : _k.DptCode) !== null && _l !== void 0 ? _l : "",
            DeptCode: (_o = (_m = item.Department) === null || _m === void 0 ? void 0 : _m.Code) !== null && _o !== void 0 ? _o : "",
            EmploymentCategory: item.EmploymentCategory,
            TypeOfContract: item.TypeOfContract,
            NumberOfPersonNeeded: item.NumberOfPersonNeeded,
            EnterNumberOfMonths: item.EnterNumberOfMonths,
            AreaofWork: item.AreaofWork,
            DateRequried: (_p = item.DateRequried) !== null && _p !== void 0 ? _p : "",
            Type: (_q = item.DataFrom) !== null && _q !== void 0 ? _q : "",
            Status: (_s = (_r = item.Status) === null || _r === void 0 ? void 0 : _r.StatusDescription) !== null && _s !== void 0 ? _s : "",
            StatusId: item.StatusId,
            Action: (_u = (_t = item.Action) === null || _t === void 0 ? void 0 : _t.Action) !== null && _u !== void 0 ? _u : "",
            ActionTypeId: (_v = item.ActionId) !== null && _v !== void 0 ? _v : "",
            Location: (_w = item.Location) !== null && _w !== void 0 ? _w : "",
            JobCodeId: (_y = (_x = item.JobCode) === null || _x === void 0 ? void 0 : _x.ID) !== null && _y !== void 0 ? _y : 0,
            JobCode: (_0 = (_z = item.JobCode) === null || _z === void 0 ? void 0 : _z.JobCode) !== null && _0 !== void 0 ? _0 : "",
            // Filled after position fetch
            JobTitleEnglish: "",
            JobTitleFrench: "",
            PatersonGrade: "",
            DRCGrade: "",
            JobTitleEnglishId: 0,
            JobTitleFrenchId: 0,
            PatersonGradeId: 0,
            DRCGradeId: 0,
            Checked: false,
            VacancyConfirmed: (_1 = item.VacancyConfirmed) !== null && _1 !== void 0 ? _1 : "",
            RecruitmentAuthorised: (_2 = item.RecruitmentAuthorised) !== null && _2 !== void 0 ? _2 : "",
            IsPayrollEmailed: (_3 = item.IsPayrollEmailed) !== null && _3 !== void 0 ? _3 : "",
            AssignedHR: " ",
            AssignedHRId: 0,
            AssignLineManager: (_4 = item.LineManager) !== null && _4 !== void 0 ? _4 : "",
            AssignLineManagerId: (_5 = item.AssignLineManagerId) !== null && _5 !== void 0 ? _5 : 0,
            ReasonForVacancy: (_6 = item.ReasonForVacancy) !== null && _6 !== void 0 ? _6 : "",
            JobPostingStartDate: item.JobPostingStartDate
                ? (0, moment_1.default)(item.JobPostingStartDate).format("YYYY-MM-DD")
                : undefined,
            JobPostingEndDate: item.JobPostingEndDate
                ? (0, moment_1.default)(item.JobPostingEndDate).format("YYYY-MM-DD")
                : undefined,
            JobPostingFirstExtensionEndDate: item.JobPostingFirstExtensionEndDate
                ? (0, moment_1.default)(item.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD")
                : undefined,
            JobPostingSecondExtensionEndDate: item.JobPostingSecondExtensionEndDate
                ? (0, moment_1.default)(item.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD")
                : undefined,
            AssignEMail: item.AssignedHR,
            AssignHOD: item.HOD,
            AssignHRLead: (_7 = item.RecruitmentHRLead) !== null && _7 !== void 0 ? _7 : "",
            QuestionByHR: (_8 = item.QuestionByHR) !== null && _8 !== void 0 ? _8 : "",
            QuestionByLM: (_9 = item.QuestionByLM) !== null && _9 !== void 0 ? _9 : "",
            ModifiedDate: (_10 = item.ModifiedDate) !== null && _10 !== void 0 ? _10 : "",
            CreatedDate: (_11 = item.CreatedDate) !== null && _11 !== void 0 ? _11 : "",
        });
    });
};
exports._mapRecruitmentItems = _mapRecruitmentItems;
//# sourceMappingURL=mapItems.js.map