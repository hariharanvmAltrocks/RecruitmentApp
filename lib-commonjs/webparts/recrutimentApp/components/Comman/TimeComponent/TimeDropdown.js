"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeDropdown = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var TimeDropdown_module_scss_1 = tslib_1.__importDefault(require("./TimeDropdown.module.scss"));
var TimeDropdown = function (_a) {
    var _b, _c;
    var value = _a.value, onChange = _a.onChange, slots = _a.slots, _d = _a.placeholder, placeholder = _d === void 0 ? "Select time" : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e;
    var _f = (0, react_1.useState)(false), open = _f[0], setOpen = _f[1];
    var wrapperRef = (0, react_1.useRef)(null);
    var activeRef = (0, react_1.useRef)(null);
    // Close on outside click
    (0, react_1.useEffect)(function () {
        var handler = function (e) {
            if (wrapperRef.current &&
                !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return function () { return document.removeEventListener("mousedown", handler); };
    }, []);
    // Scroll active item into view when opening
    (0, react_1.useEffect)(function () {
        if (open && activeRef.current) {
            activeRef.current.scrollIntoView({ block: "center" });
        }
    }, [open]);
    var selectedLabel = (_c = (_b = slots.find(function (s) { return s.value === value; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : "";
    var handleSelect = function (val) {
        onChange(val);
        setOpen(false);
    };
    // Split slots into AM / PM groups
    var amSlots = slots.filter(function (s) {
        var h = parseInt(s.value.split(":")[0]);
        return h < 12;
    });
    var pmSlots = slots.filter(function (s) {
        var h = parseInt(s.value.split(":")[0]);
        return h >= 12;
    });
    return (react_1.default.createElement("div", { className: TimeDropdown_module_scss_1.default.timeDropdownWrapper, ref: wrapperRef },
        react_1.default.createElement("div", { className: [
                TimeDropdown_module_scss_1.default.timeDropdownTrigger,
                open ? TimeDropdown_module_scss_1.default.timeDropdownOpen : "",
                disabled ? TimeDropdown_module_scss_1.default.timeDropdownDisabled : "",
            ]
                .filter(Boolean)
                .join(" "), onClick: function () { return !disabled && setOpen(function (o) { return !o; }); } },
            react_1.default.createElement("span", { className: value ? TimeDropdown_module_scss_1.default.timeDropdownValue : TimeDropdown_module_scss_1.default.timeDropdownPlaceholder }, value ? selectedLabel : placeholder),
            react_1.default.createElement(lucide_react_1.ChevronDown, { size: 16, className: [
                    TimeDropdown_module_scss_1.default.timeDropdownChevron,
                    open ? TimeDropdown_module_scss_1.default.timeDropdownChevronOpen : "",
                ]
                    .filter(Boolean)
                    .join(" ") })),
        open && !disabled && (react_1.default.createElement("div", { className: TimeDropdown_module_scss_1.default.timeDropdownMenu },
            react_1.default.createElement("div", { className: TimeDropdown_module_scss_1.default.timeDropdownScroll },
                amSlots.length > 0 &&
                    amSlots.map(function (slot) {
                        var isActive = slot.value === value;
                        return (react_1.default.createElement("div", { key: slot.value, ref: isActive ? activeRef : undefined, className: [
                                TimeDropdown_module_scss_1.default.timeDropdownOption,
                                isActive ? TimeDropdown_module_scss_1.default.timeDropdownOptionActive : "",
                            ]
                                .filter(Boolean)
                                .join(" "), onClick: function () { return handleSelect(slot.value); } },
                            slot.label,
                            isActive && (react_1.default.createElement(lucide_react_1.CheckCircle, { size: 14, className: TimeDropdown_module_scss_1.default.timeDropdownOptionCheck }))));
                    }),
                amSlots.length > 0 && pmSlots.length > 0 && (react_1.default.createElement("div", { className: TimeDropdown_module_scss_1.default.timeDropdownDivider })),
                pmSlots.length > 0 &&
                    pmSlots.map(function (slot) {
                        var isActive = slot.value === value;
                        return (react_1.default.createElement("div", { key: slot.value, ref: isActive ? activeRef : undefined, className: [
                                TimeDropdown_module_scss_1.default.timeDropdownOption,
                                isActive ? TimeDropdown_module_scss_1.default.timeDropdownOptionActive : "",
                            ]
                                .filter(Boolean)
                                .join(" "), onClick: function () { return handleSelect(slot.value); } },
                            slot.label,
                            isActive && (react_1.default.createElement(lucide_react_1.CheckCircle, { size: 14, className: TimeDropdown_module_scss_1.default.timeDropdownOptionCheck }))));
                    }))))));
};
exports.TimeDropdown = TimeDropdown;
//# sourceMappingURL=TimeDropdown.js.map