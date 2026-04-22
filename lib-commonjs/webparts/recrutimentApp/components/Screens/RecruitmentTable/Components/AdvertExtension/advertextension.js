"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertExtension = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var AdvertExtension_module_scss_1 = tslib_1.__importDefault(require("./AdvertExtension.module.scss"));
var dateConfigfn_1 = require("../../../../Hooks/dateConfigfn");
var getPositionDetails_1 = require("../../AdvertReviewDrawer/Hooks/getPositionDetails");
var loading_1 = tslib_1.__importDefault(require("../../../../Comman/Loading/loading"));
var ModalPopup_1 = require("../../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../../Comman/ModalPopup/useModalPopup");
// ─── Constants ────────────────────────────────────────────────────────────────
var EXTENSION_LABELS = [
    "First Extension Date",
    "Second Extension Date",
    "Third Extension Date",
];
var EMPTY_DATE = { StartDate: undefined, EndDate: undefined };
// ─── Pure Helpers ─────────────────────────────────────────────────────────────
var calculateValidTo = function (startDate, daysToAdd) {
    var result = new Date(startDate !== null && startDate !== void 0 ? startDate : new Date());
    var added = 0;
    while (added < daysToAdd) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0)
            added++;
    }
    if (result.getDay() === 0)
        result.setDate(result.getDate() + 1);
    return result;
};
var formatDateDisplay = function (date) {
    if (!date)
        return "";
    var d = String(date.getDate()).padStart(2, "0");
    var m = String(date.getMonth() + 1).padStart(2, "0");
    return "".concat(d, "/").concat(m, "/").concat(date.getFullYear());
};
var toInputValue = function (date) {
    if (!date)
        return "";
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return "".concat(y, "-").concat(m, "-").concat(d);
};
var checkCannotExtend = function (positionDetails) {
    if (!positionDetails) {
        return { cannotExtend: false, comparisonDate: null };
    }
    var JobPostingEndDate = positionDetails.JobPostingEndDate, JobPostingFirstExtensionEndDate = positionDetails.JobPostingFirstExtensionEndDate, JobPostingSecondExtensionEndDate = positionDetails.JobPostingSecondExtensionEndDate;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var comparisonDate = null;
    if (JobPostingSecondExtensionEndDate) {
        comparisonDate = new Date(JobPostingSecondExtensionEndDate);
    }
    else if (JobPostingFirstExtensionEndDate) {
        comparisonDate = new Date(JobPostingFirstExtensionEndDate);
    }
    else if (JobPostingEndDate) {
        comparisonDate = new Date(JobPostingEndDate);
    }
    if (!comparisonDate) {
        return { cannotExtend: false, comparisonDate: null };
    }
    comparisonDate.setHours(0, 0, 0, 0);
    return {
        cannotExtend: today <= comparisonDate,
        comparisonDate: comparisonDate,
    };
};
var CalendarIcon = function () { return (react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
    react_1.default.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
    react_1.default.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
    react_1.default.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" }))); };
var CloseIcon = function () { return (react_1.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
    react_1.default.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    react_1.default.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }))); };
// ─── Custom Hook: date state ──────────────────────────────────────────────────
function useDateExtensionState(RecuritmentData) {
    var _a = (0, react_1.useState)(EMPTY_DATE), Level1Date = _a[0], setLevel1Date = _a[1];
    var _b = (0, react_1.useState)(EMPTY_DATE), Level2Date = _b[0], setLevel2Date = _b[1];
    var _c = (0, react_1.useState)(EMPTY_DATE), Level3Date = _c[0], setLevel3Date = _c[1];
    var _d = (0, react_1.useState)(false), showLevel3 = _d[0], setShowLevel3 = _d[1];
    (0, react_1.useEffect)(function () {
        if (!RecuritmentData) {
            setLevel1Date(EMPTY_DATE);
            setLevel2Date(EMPTY_DATE);
            setLevel3Date(EMPTY_DATE);
            setShowLevel3(false);
            return;
        }
        var startDate = (0, dateConfigfn_1.toDate)(RecuritmentData.JobPostingStartDate);
        var endDate = (0, dateConfigfn_1.toDate)(RecuritmentData.JobPostingEndDate);
        setLevel1Date({ StartDate: startDate, EndDate: endDate });
        var secondEnd = endDate ? calculateValidTo(endDate, 14) : undefined;
        setLevel2Date({ StartDate: startDate, EndDate: secondEnd });
        if (RecuritmentData.JobPostingFirstExtensionEndDate) {
            var firstExtEnd = (0, dateConfigfn_1.toDate)(RecuritmentData.JobPostingFirstExtensionEndDate);
            var thirdEnd = calculateValidTo(firstExtEnd, 14);
            setLevel3Date({ StartDate: startDate, EndDate: thirdEnd });
            setShowLevel3(true);
        }
        else {
            setLevel3Date(EMPTY_DATE);
            setShowLevel3(false);
        }
    }, [RecuritmentData]);
    return { Level1Date: Level1Date, Level2Date: Level2Date, Level3Date: Level3Date, showLevel3: showLevel3 };
}
var DateField = react_1.default.memo(function (_a) {
    var label = _a.label, date = _a.date;
    return (react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.dateField },
        react_1.default.createElement("label", { className: AdvertExtension_module_scss_1.default.fieldLabel }, label),
        react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.inputWrap },
            react_1.default.createElement("input", { type: "date", className: AdvertExtension_module_scss_1.default.dateInput, value: toInputValue(date), disabled: true, readOnly: true }),
            react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.calIcon },
                react_1.default.createElement(CalendarIcon, null))),
        react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.displayDate }, formatDateDisplay(date))));
});
var AdvertExtension = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var RecruitmentID = _a.RecruitmentID, onClose = _a.onClose, useDataExtension = _a.useDataExtension;
    var _q = (0, getPositionDetails_1.usePositionDetails)(RecruitmentID, "Recruitment"), positionDetails = _q.data, positionLoading = _q.loading;
    var _r = (0, useModalPopup_1.useModalPopup)(), modalState = _r.modalState, showModal = _r.showModal, closeModal = _r.closeModal;
    var _s = useDateExtensionState(positionDetails !== null && positionDetails !== void 0 ? positionDetails : null), Level1Date = _s.Level1Date, Level2Date = _s.Level2Date, Level3Date = _s.Level3Date, showLevel3 = _s.showLevel3;
    var _t = checkCannotExtend(positionDetails), cannotExtend = _t.cannotExtend, comparisonDate = _t.comparisonDate;
    (0, react_1.useEffect)(function () {
        if (cannotExtend && comparisonDate) {
            showModal({
                title: "Extension Not Allowed",
                message: "You cannot extend the advertisement as the posting period has ".concat(formatDateDisplay(comparisonDate), " already ended."),
                type: "error",
                confirmLabel: "OK",
                onConfirm: function () {
                    closeModal();
                    onClose();
                },
            });
        }
    }, [cannotExtend, positionLoading]);
    var form = {
        ID: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ID) !== null && _b !== void 0 ? _b : 0,
        JobCodeId: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _c !== void 0 ? _c : 0,
        JobCode: (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _d !== void 0 ? _d : "",
        JobTitleEnglish: (_e = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _e !== void 0 ? _e : "",
        JobTitleFrench: (_f = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleFrench) !== null && _f !== void 0 ? _f : "",
        DepartmentID: (_g = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentId) !== null && _g !== void 0 ? _g : 0,
        Nationality: (_h = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) !== null && _h !== void 0 ? _h : "",
        NumberOfPersonNeeded: (_j = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NumberOfPersonNeeded) !== null && _j !== void 0 ? _j : "",
        Dptcode: (_k = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentCode) !== null && _k !== void 0 ? _k : "",
        reviewerComments: "",
        StatusId: (_l = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusId) !== null && _l !== void 0 ? _l : 0,
    };
    var activeStart = (_m = (showLevel3 ? Level3Date.StartDate : Level2Date.StartDate)) !== null && _m !== void 0 ? _m : new Date();
    var activeEnd = (_o = (showLevel3 ? Level3Date.EndDate : Level2Date.EndDate)) !== null && _o !== void 0 ? _o : new Date();
    var advertArgs = {
        filterConditions: [
            { FilterKey: "JobCodeId", Operator: "eq", FilterValue: form.JobCodeId },
        ],
        Conditions: "",
        form: form,
        IsActive: 0,
        IsExtened: 0,
        extendStartDate: activeStart,
        extendEndDate: activeEnd,
        isSecondExtension: showLevel3,
    };
    var triggerExtension = useDataExtension(advertArgs).triggerExtension;
    var extensionRows = tslib_1.__spreadArray([
        {
            label: EXTENSION_LABELS[0],
            start: Level1Date.StartDate,
            end: Level1Date.EndDate,
        },
        {
            label: EXTENSION_LABELS[1],
            start: Level1Date.StartDate,
            end: Level2Date.EndDate,
        }
    ], (showLevel3
        ? [
            {
                label: EXTENSION_LABELS[2],
                start: Level1Date.StartDate,
                end: Level3Date.EndDate,
            },
        ]
        : []), true);
    var hideSubmit = Boolean(positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobPostingSecondExtensionEndDate);
    if (positionLoading) {
        return react_1.default.createElement(loading_1.default, null);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.overlay },
            react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.modal },
                react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.header },
                    react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.headerLeft },
                        react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.iconWrap },
                            react_1.default.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#7c3aed", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                                react_1.default.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                                react_1.default.createElement("polyline", { points: "12 6 12 12 16 14" }))),
                        react_1.default.createElement("h2", { className: AdvertExtension_module_scss_1.default.title }, "Advertisement Extension")),
                    react_1.default.createElement("button", { className: AdvertExtension_module_scss_1.default.closeBtn, onClick: onClose, "aria-label": "Close" },
                        react_1.default.createElement(CloseIcon, null))),
                react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.jobSubtitle },
                    react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.jobLabel }, "Job Title"),
                    react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.jobName }, (_p = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _p !== void 0 ? _p : "—")),
                react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.body }, extensionRows.map(function (row, i) { return (react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.extensionBlock, key: i },
                    react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.extensionLabelRow },
                        react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.extensionIndex }, i + 1),
                        react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.extensionLabel }, row.label)),
                    react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.dateRow },
                        react_1.default.createElement(DateField, { label: "Start Date", date: row.start }),
                        react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.dateDivider },
                            react_1.default.createElement("span", { className: AdvertExtension_module_scss_1.default.arrowLine })),
                        react_1.default.createElement(DateField, { label: "End Date", date: row.end })),
                    i < extensionRows.length - 1 && (react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.divider })))); })),
                react_1.default.createElement("div", { className: AdvertExtension_module_scss_1.default.footer },
                    react_1.default.createElement("button", { className: AdvertExtension_module_scss_1.default.cancelBtn, onClick: onClose }, "Close"),
                    !hideSubmit && !cannotExtend && (react_1.default.createElement("button", { className: AdvertExtension_module_scss_1.default.submitBtn, onClick: triggerExtension },
                        react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" },
                            react_1.default.createElement("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
                            react_1.default.createElement("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })),
                        "Submit"))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.AdvertExtension = AdvertExtension;
exports.default = exports.AdvertExtension;
//# sourceMappingURL=advertextension.js.map