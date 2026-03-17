"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapRecruitmentItems = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var _mapRecruitmentItems = function (res) {
    return res.map(function (item, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
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
            EmploymentCategory: item.EmploymentCategory,
            TypeOfContract: item.TypeOfContract,
            NumberOfPersonNeeded: item.NumberOfPersonNeeded,
            EnterNumberOfMonths: item.EnterNumberOfMonths,
            AreaofWork: item.AreaofWork,
            DateRequried: (_m = item.DateRequried) !== null && _m !== void 0 ? _m : "",
            Type: (_o = item.DataFrom) !== null && _o !== void 0 ? _o : "",
            Status: (_q = (_p = item.Status) === null || _p === void 0 ? void 0 : _p.StatusDescription) !== null && _q !== void 0 ? _q : "",
            StatusId: item.StatusId,
            Action: (_s = (_r = item.Action) === null || _r === void 0 ? void 0 : _r.Action) !== null && _s !== void 0 ? _s : "",
            ActionTypeId: (_t = item.ActionId) !== null && _t !== void 0 ? _t : "",
            Location: (_u = item.Location) !== null && _u !== void 0 ? _u : "",
            JobCodeId: (_w = (_v = item.JobCode) === null || _v === void 0 ? void 0 : _v.ID) !== null && _w !== void 0 ? _w : 0,
            JobCode: (_y = (_x = item.JobCode) === null || _x === void 0 ? void 0 : _x.JobCode) !== null && _y !== void 0 ? _y : "",
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
            VacancyConfirmed: (_z = item.VacancyConfirmed) !== null && _z !== void 0 ? _z : "",
            RecruitmentAuthorised: (_0 = item.RecruitmentAuthorised) !== null && _0 !== void 0 ? _0 : "",
            IsPayrollEmailed: (_1 = item.IsPayrollEmailed) !== null && _1 !== void 0 ? _1 : "",
            AssignedHR: " ",
            AssignedHRId: 0,
            AssignLineManager: (_2 = item.LineManager) !== null && _2 !== void 0 ? _2 : "",
            AssignLineManagerId: (_3 = item.AssignLineManagerId) !== null && _3 !== void 0 ? _3 : 0,
            ReasonForVacancy: (_4 = item.ReasonForVacancy) !== null && _4 !== void 0 ? _4 : "",
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
            AssignHRLead: (_5 = item.RecruitmentHRLead) !== null && _5 !== void 0 ? _5 : "",
            QuestionByHR: (_6 = item.QuestionByHR) !== null && _6 !== void 0 ? _6 : "",
            QuestionByLM: (_7 = item.QuestionByLM) !== null && _7 !== void 0 ? _7 : "",
            ModifiedDate: (_8 = item.ModifiedDate) !== null && _8 !== void 0 ? _8 : "",
            CreatedDate: (_9 = item.CreatedDate) !== null && _9 !== void 0 ? _9 : "",
        });
    });
};
exports._mapRecruitmentItems = _mapRecruitmentItems;
//# sourceMappingURL=mapItems.js.map