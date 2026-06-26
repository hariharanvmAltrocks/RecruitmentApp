"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchableDropdown = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
var react_1 = tslib_1.__importStar(require("react"));
var SearchableDropdown = function (_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, error = _a.error, onAddCustom = _a.onAddCustom;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(""), searchTerm = _c[0], setSearchTerm = _c[1];
    var dropdownRef = (0, react_1.useRef)(null);
    var searchInputRef = (0, react_1.useRef)(null);
    var filteredOptions = options.filter(function (opt) {
        return (opt.displayText || "").toLowerCase().includes(searchTerm.toLowerCase());
    });
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        var handleKeyDown = function (event) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    (0, react_1.useEffect)(function () {
        if (!isOpen) {
            setSearchTerm("");
        }
        else {
            var timer_1 = setTimeout(function () {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 50);
            return function () { return clearTimeout(timer_1); };
        }
    }, [isOpen]);
    var handleSelect = function (opt) {
        onChange({ key: opt.id, text: opt.displayText });
        setIsOpen(false);
    };
    var truncateDropdownOption = function (text, maxLength) {
        if (maxLength === void 0) { maxLength = 45; }
        if (!text)
            return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };
    return (react_1.default.createElement("div", { className: "searchableDropdown ".concat(error ? "error" : "", " ").concat(isOpen ? "open" : ""), ref: dropdownRef },
        react_1.default.createElement("button", { type: "button", className: "dropdownTrigger", onClick: function () { return setIsOpen(!isOpen); }, title: value ? value.text : "" },
            react_1.default.createElement("span", { className: "triggerText ".concat(!value ? "placeholder" : "") }, value ? truncateDropdownOption(value.text, 45) : placeholder),
            react_1.default.createElement(lucide_react_1.ChevronDown, { size: 16, className: "chevronIcon" })),
        isOpen && (react_1.default.createElement("div", { className: "dropdownMenu" },
            react_1.default.createElement("div", { className: "searchWrapper" },
                react_1.default.createElement(lucide_react_1.Search, { size: 14, className: "searchIcon" }),
                react_1.default.createElement("input", { ref: searchInputRef, type: "text", className: "searchInput", placeholder: "Search...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, onClick: function (e) { return e.stopPropagation(); } }),
                searchTerm && (react_1.default.createElement("button", { type: "button", className: "clearSearchBtn", onClick: function (e) {
                        e.stopPropagation();
                        setSearchTerm("");
                    } }, "\u00D7"))),
            react_1.default.createElement("div", { className: "optionsList" },
                filteredOptions.length === 0 ? (react_1.default.createElement("div", { className: "noOptions" }, "No options found")) : (filteredOptions.map(function (opt) {
                    var isSelected = value ? opt.id === value.key : false;
                    return (react_1.default.createElement("button", { key: opt.id, type: "button", className: "optionItem ".concat(isSelected ? "selected" : ""), onClick: function () { return handleSelect(opt); }, title: opt.displayText },
                        react_1.default.createElement("span", { className: "optionText" }, opt.displayText),
                        isSelected && react_1.default.createElement(lucide_react_1.Check, { size: 14, className: "checkIcon" })));
                })),
                onAddCustom && (react_1.default.createElement("button", { type: "button", className: "addCustomOptionBtn", onClick: function () {
                        setIsOpen(false);
                        onAddCustom();
                    }, style: {
                        width: "100%",
                        padding: "10px 12px",
                        background: "#eff6ff",
                        border: "none",
                        borderTop: "1px solid #e2e8f0",
                        color: "#2563eb",
                        fontWeight: 600,
                        fontSize: "13px",
                        textAlign: "center",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        position: "sticky",
                        bottom: 0,
                    } },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 14 }),
                    " Add Custom")))))));
};
exports.SearchableDropdown = SearchableDropdown;
//# sourceMappingURL=SearchableDropdown.js.map