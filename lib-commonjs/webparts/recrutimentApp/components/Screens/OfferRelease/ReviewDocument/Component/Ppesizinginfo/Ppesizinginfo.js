"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PPESizingTagStrip = exports.PPESizingCard = exports.PPESizingTrigger = void 0;
var tslib_1 = require("tslib");
// components/PPESizingInfo/PPESizingInfo.tsx
var react_1 = tslib_1.__importStar(require("react"));
require("./Ppesizinginfo.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var ShieldIcon = function (_a) {
    var className = _a.className;
    return (react_1.default.createElement("svg", { className: className, width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })));
};
var InfoIcon = function () { return (react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none" },
    react_1.default.createElement("circle", { cx: "8", cy: "8", r: "7", stroke: "#E24B4A", strokeWidth: "1.2" }),
    react_1.default.createElement("text", { x: "8", y: "12", textAnchor: "middle", fontSize: "10", fontWeight: "600", fill: "#E24B4A" }, "i"))); };
var PPESizingTrigger = function (_a) {
    var items = _a.items;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var wrapRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var handler = function (e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return function () { return document.removeEventListener("mousedown", handler); };
    }, []);
    return (react_1.default.createElement("div", { className: "ppe-trigger-wrap", ref: wrapRef },
        react_1.default.createElement("button", { type: "button", className: "ppe-trigger", onClick: function () { return setOpen(function (o) { return !o; }); }, "aria-expanded": open, "aria-haspopup": "true" },
            react_1.default.createElement(InfoIcon, null),
            strings.PersonalProtectiveEquipmentSizingInforma),
        open && (react_1.default.createElement("div", { className: "ppe-popover", role: "dialog", "aria-label": strings.PpeSizingDetails },
            react_1.default.createElement("div", { className: "ppe-popover__header" },
                react_1.default.createElement("span", { className: "ppe-popover__header-icon" },
                    react_1.default.createElement(ShieldIcon, null)),
                react_1.default.createElement("span", { className: "ppe-popover__title" }, strings.PersonalProtectiveEquipment),
                react_1.default.createElement("button", { type: "button", className: "ppe-popover__close", onClick: function () { return setOpen(false); }, "aria-label": strings.Close }, "\u00D7")),
            react_1.default.createElement("table", { className: "ppe-table" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, strings.PpeKit),
                        react_1.default.createElement("th", null, strings.Size))),
                react_1.default.createElement("tbody", null, items.map(function (item) { return (react_1.default.createElement("tr", { key: item.kit },
                    react_1.default.createElement("td", null, item.kit),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: "ppe-size-badge" }, item.size)))); })))))));
};
exports.PPESizingTrigger = PPESizingTrigger;
var PPESizingCard = function (_a) {
    var items = _a.items;
    return (react_1.default.createElement("div", { className: "ppe-card" },
        react_1.default.createElement("div", { className: "ppe-card__header" },
            react_1.default.createElement(ShieldIcon, { className: "ppe-card__header-icon" }),
            react_1.default.createElement("span", { className: "ppe-card__header-text" }, "Personal Protective Equipment")),
        react_1.default.createElement("div", { className: "ppe-card__body" }, items.map(function (item) { return (react_1.default.createElement("div", { key: item.kit, className: "ppe-card__row" },
            react_1.default.createElement("div", { className: "ppe-card__row-left" },
                react_1.default.createElement("span", { className: "ppe-card__dot" }),
                react_1.default.createElement("span", { className: "ppe-card__item-name" }, item.kit)),
            react_1.default.createElement("span", { className: "ppe-card__size-chip" }, item.size))); }))));
};
exports.PPESizingCard = PPESizingCard;
var PPESizingTagStrip = function (_a) {
    var items = _a.items;
    return (react_1.default.createElement("div", { className: "ppe-strip" },
        react_1.default.createElement(ShieldIcon, { className: "ppe-strip__icon" }),
        react_1.default.createElement("span", { className: "ppe-strip__label" }, strings.PpeSizes),
        items.map(function (item) { return (react_1.default.createElement("div", { key: item.kit, className: "ppe-strip__tag" },
            react_1.default.createElement("span", { className: "ppe-strip__tag-name" }, item.kit),
            react_1.default.createElement("span", { className: "ppe-strip__tag-sep" }, "\u00B7"),
            react_1.default.createElement("span", { className: "ppe-strip__tag-size" }, item.size))); })));
};
exports.PPESizingTagStrip = PPESizingTagStrip;
//# sourceMappingURL=Ppesizinginfo.js.map