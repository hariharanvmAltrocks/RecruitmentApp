"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewScheduleInput = exports.QuestionCard = exports.InfoItem = exports.SectionHeader = exports.sectionVariants = exports.cardVariants = exports.backdropVariants = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
var ShowCandidateDetailsPopup_module_scss_1 = tslib_1.__importDefault(require("./ShowCandidateDetailsPopup.module.scss"));
var react_1 = tslib_1.__importDefault(require("react"));
exports.backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};
exports.cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};
exports.sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: function (i) { return ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
    }); },
};
var SectionHeader = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, _b = _a.accent, accent = _b === void 0 ? "orange" : _b;
    var accentClass = {
        orange: ShowCandidateDetailsPopup_module_scss_1.default.accentOrange,
        blue: ShowCandidateDetailsPopup_module_scss_1.default.accentBlue,
        green: ShowCandidateDetailsPopup_module_scss_1.default.accentGreen,
        red: ShowCandidateDetailsPopup_module_scss_1.default.accentRed,
    }[accent];
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionHeader },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionHeaderRow },
            react_1.default.createElement("div", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.sectionAccentBar, " ").concat(accentClass) }),
            react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionTitle }, title)),
        subtitle && react_1.default.createElement("p", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionSubtitle }, subtitle)));
};
exports.SectionHeader = SectionHeader;
var InfoItem = function (_a) {
    var label = _a.label, value = _a.value, icon = _a.icon;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoItem },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoLabel },
            icon && react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoLabelIcon }, icon),
            label),
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoValue }, value !== null && value !== void 0 ? value : "--")));
};
exports.InfoItem = InfoItem;
var QuestionCard = function (_a) {
    var index = _a.index, question = _a.question, answer = _a.answer;
    var isYes = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "yes";
    var isNo = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "no";
    var badgeClass = isYes
        ? ShowCandidateDetailsPopup_module_scss_1.default.answerYes
        : isNo
            ? ShowCandidateDetailsPopup_module_scss_1.default.answerNo
            : ShowCandidateDetailsPopup_module_scss_1.default.answerNeutral;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionRow },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionInner },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionPill },
                react_1.default.createElement("span", null,
                    "Q",
                    index)),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionBody },
                react_1.default.createElement("h4", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionText }, question),
                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.answerRow },
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.answerLabel }, "Answer:"),
                    react_1.default.createElement("span", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.answerBadge, " ").concat(badgeClass) }, answer !== null && answer !== void 0 ? answer : "--"))))));
};
exports.QuestionCard = QuestionCard;
var toDateTimeLocal = function (date) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return "".concat(date.getFullYear(), "-").concat(pad(date.getMonth() + 1), "-").concat(pad(date.getDate()), "T").concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()));
};
var InterviewScheduleInput = function (_a) {
    var form = _a.form, onChange = _a.onChange, panelOptions = _a.panelOptions, onToggleMember = _a.onToggleMember, _b = _a.minPanelCount, minPanelCount = _b === void 0 ? 3 : _b, Disable = _a.Disable;
    var needsMore = form.panelMembers.length < minPanelCount;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 5);
    maxDay.setHours(23, 59, 0, 0);
    var minDateTime = toDateTimeLocal(today);
    var maxDateTime = toDateTimeLocal(maxDay);
    var handleStartDateChange = function (e) {
        var _a, _b;
        var newStart = e.target.value;
        var datePart = newStart.split("T")[0];
        var currentEndTime = (_b = (_a = form.endDate) === null || _a === void 0 ? void 0 : _a.split("T")[1]) !== null && _b !== void 0 ? _b : "00:00";
        var newEnd = "".concat(datePart, "T").concat(currentEndTime);
        onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { startDate: newStart, endDate: newEnd })); });
    };
    var endDateMin = form.startDate ? "".concat(form.startDate.split("T")[0], "T00:00") : minDateTime;
    var endDateMax = form.startDate ? "".concat(form.startDate.split("T")[0], "T23:59") : maxDateTime;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.scheduleCard },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelMembersWrap },
            react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                "Interview panel members ",
                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelTagsWrap }, panelOptions.map(function (opt) {
                var selected = form.panelMembers.includes(opt.value);
                return (react_1.default.createElement("button", { key: opt.value, type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.panelTag, " ").concat(selected ? ShowCandidateDetailsPopup_module_scss_1.default.panelTagSelected : ShowCandidateDetailsPopup_module_scss_1.default.panelTagUnselected), onClick: function () { return onToggleMember(opt.value); }, disabled: Disable },
                    selected && react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16, className: ShowCandidateDetailsPopup_module_scss_1.default.panelTagIcon }),
                    opt.label));
            })),
            needsMore && (react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.panelWarning },
                "Please select at least ",
                minPanelCount,
                " panel members \u2022 ",
                form.panelMembers.length,
                " selected"))),
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateRow },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                    "Start date & time ",
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", className: ShowCandidateDetailsPopup_module_scss_1.default.dateInput, value: form.startDate, min: maxDateTime, onChange: handleStartDateChange, disabled: Disable })),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.dateField },
                react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                    "End date & time ",
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", className: ShowCandidateDetailsPopup_module_scss_1.default.dateInput, value: form.endDate, min: endDateMin, max: endDateMax, disabled: !form.startDate || Disable, onChange: function (e) { return onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { endDate: e.target.value })); }); } })))));
};
exports.InterviewScheduleInput = InterviewScheduleInput;
//# sourceMappingURL=reuseUI.js.map