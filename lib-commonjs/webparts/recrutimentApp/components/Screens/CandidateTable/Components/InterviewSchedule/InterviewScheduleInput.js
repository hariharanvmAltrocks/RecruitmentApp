"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewScheduleInput = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var InterviewScheduleInput_module_scss_1 = tslib_1.__importDefault(require("./InterviewScheduleInput.module.scss"));
var TimeDropdown_1 = require("../../../../Comman/TimeComponent/TimeDropdown");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var WORK_START_H = 9;
var WORK_END_H = 18;
function buildTimeSlots(startH, endH) {
    var slots = [];
    for (var h = startH; h < endH; h++) {
        for (var _i = 0, _a = [0, 30]; _i < _a.length; _i++) {
            var m = _a[_i];
            var hh = String(h).padStart(2, "0");
            var mm = String(m).padStart(2, "0");
            var value = "".concat(hh, ":").concat(mm);
            var ampm = h < 12 ? "AM" : "PM";
            var displayH = h % 12 === 0 ? 12 : h % 12;
            var label = "".concat(displayH, ":").concat(mm, " ").concat(ampm);
            slots.push({ value: value, label: label });
        }
    }
    return slots;
}
function addThirtyMins(time) {
    var _a = time.split(":").map(Number), h = _a[0], m = _a[1];
    var totalMins = h * 60 + m + 30;
    var newH = Math.floor(totalMins / 60) % 24;
    var newM = totalMins % 60;
    return "".concat(String(newH).padStart(2, "0"), ":").concat(String(newM).padStart(2, "0"));
}
/** Today's date as "YYYY-MM-DD" */
function todayStr() {
    return new Date().toISOString().split("T")[0];
}
/** Max date (today + 5 days) as "YYYY-MM-DD" */
function maxDateStr() {
    var d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
}
// ─── Component ────────────────────────────────────────────────────────────────
var InterviewScheduleInput = function (_a) {
    var form = _a.form, onChange = _a.onChange, panelOptions = _a.panelOptions, onToggleMember = _a.onToggleMember, _b = _a.minPanelCount, minPanelCount = _b === void 0 ? 3 : _b, Disable = _a.Disable;
    var needsMore = form.panelMembers.length < minPanelCount;
    // All start time options (09:00 – 17:30)
    var startSlots = (0, react_1.useMemo)(function () { return buildTimeSlots(WORK_START_H, WORK_END_H); }, []);
    // End time options: everything AFTER the selected start time (up to 18:00)
    var endSlots = (0, react_1.useMemo)(function () {
        if (!form.startTime)
            return buildTimeSlots(WORK_START_H, WORK_END_H);
        var _a = form.startTime.split(":").map(Number), sh = _a[0], sm = _a[1];
        var startMins = sh * 60 + sm;
        return buildTimeSlots(WORK_START_H, WORK_END_H).filter(function (_a) {
            var value = _a.value;
            var _b = value.split(":").map(Number), h = _b[0], m = _b[1];
            return h * 60 + m > startMins;
        });
    }, [form.startTime]);
    // ── Handlers ────────────────────────────────────────────────────────────────
    var handleDateChange = (0, react_1.useCallback)(function (e) {
        var newDate = e.target.value;
        onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { startDate: newDate, startTime: "", endTime: "" })); });
    }, [onChange]);
    var handleStartTimeChange = (0, react_1.useCallback)(function (newStart) {
        var autoEnd = addThirtyMins(newStart);
        var endH = autoEnd.split(":").map(Number)[0];
        var validEnd = endH <= WORK_END_H ? autoEnd : newStart;
        onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { startTime: newStart, endTime: validEnd })); });
    }, [onChange]);
    var handleEndTimeChange = (0, react_1.useCallback)(function (e) {
        onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { endTime: e.target.value })); });
    }, [onChange]);
    return (react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.scheduleCard },
        react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.panelMembersWrap },
            react_1.default.createElement("label", { className: InterviewScheduleInput_module_scss_1.default.fieldLabel },
                strings.InterviewPanelMembers,
                react_1.default.createElement("span", { className: InterviewScheduleInput_module_scss_1.default.fieldRequired }, " *")),
            react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.panelTagsWrap }, panelOptions.map(function (opt) {
                var selected = form.panelMembers.includes(opt.value);
                return (react_1.default.createElement("button", { key: opt.value, type: "button", className: "".concat(InterviewScheduleInput_module_scss_1.default.panelTag, " ").concat(selected ? InterviewScheduleInput_module_scss_1.default.panelTagSelected : InterviewScheduleInput_module_scss_1.default.panelTagUnselected), onClick: function () { return onToggleMember(opt.value); }, disabled: Disable },
                    selected && (react_1.default.createElement(lucide_react_1.CheckCircle, { size: 15, className: InterviewScheduleInput_module_scss_1.default.panelTagIcon })),
                    opt.label));
            })),
            needsMore && (react_1.default.createElement("span", { className: InterviewScheduleInput_module_scss_1.default.panelWarning },
                strings.SelectAtLeast,
                minPanelCount,
                " ",
                strings.PanelMembers,
                " ",
                form.panelMembers.length,
                " ",
                strings.Selected))),
        react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.dateRow },
            react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: InterviewScheduleInput_module_scss_1.default.timeFieldLabel },
                    strings.Date,
                    react_1.default.createElement("span", { className: InterviewScheduleInput_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement("input", { type: "date", className: InterviewScheduleInput_module_scss_1.default.dateInput, value: form.startDate, min: maxDateStr(), onChange: handleDateChange, disabled: Disable })),
            react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: InterviewScheduleInput_module_scss_1.default.timeFieldLabel },
                    strings.StartTime,
                    react_1.default.createElement("span", { className: InterviewScheduleInput_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement(TimeDropdown_1.TimeDropdown, { value: form.startTime, onChange: function (val) { return handleStartTimeChange(val); }, slots: startSlots, placeholder: strings.SelectTime, disabled: !form.startDate || Disable })),
            react_1.default.createElement("div", { className: InterviewScheduleInput_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: InterviewScheduleInput_module_scss_1.default.timeFieldLabel },
                    strings.EndTime,
                    react_1.default.createElement("span", { className: InterviewScheduleInput_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement(TimeDropdown_1.TimeDropdown, { value: form.endTime, onChange: function (val) { return onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { endTime: val })); }); }, slots: endSlots, placeholder: "Select time", disabled: !form.startTime || Disable })))));
};
exports.InterviewScheduleInput = InterviewScheduleInput;
//# sourceMappingURL=InterviewScheduleInput.js.map