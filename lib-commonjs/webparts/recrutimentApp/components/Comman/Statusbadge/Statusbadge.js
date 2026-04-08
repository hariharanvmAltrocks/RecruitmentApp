"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var StatusBadge_module_scss_1 = tslib_1.__importDefault(require("./StatusBadge.module.scss"));
var DoneIcon = function (_a) {
    var color = _a.color;
    return (react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("polyline", { points: "3 8 6.5 11.5 13 4.5" })));
};
var PendingIcon = function (_a) {
    var color = _a.color;
    return (react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: color, strokeWidth: "1.7", strokeLinecap: "round" },
        react_1.default.createElement("circle", { cx: "8", cy: "8", r: "5.5" }),
        react_1.default.createElement("path", { d: "M8 5.5v3l1.5 1.5" })));
};
var WarningIcon = function (_a) {
    var color = _a.color;
    return (react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: color, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M8 2.5L14 13H2L8 2.5z" }),
        react_1.default.createElement("path", { d: "M8 7v3M8 11.5v.5" })));
};
var ICON_MAP = {
    done: react_1.default.createElement(DoneIcon, { color: "#1D9E75" }),
    pending: react_1.default.createElement(PendingIcon, { color: "#7C8BAA" }),
    warning: react_1.default.createElement(WarningIcon, { color: "#BA7517" }),
};
var BADGE_LABEL = {
    done: "Verified",
    pending: "Pending",
    warning: "Rejected",
};
var INFO_ICON = (react_1.default.createElement("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", stroke: "#7C8BAA", strokeWidth: "1.5", strokeLinecap: "round" },
    react_1.default.createElement("circle", { cx: "8", cy: "8", r: "6.5" }),
    react_1.default.createElement("path", { d: "M8 5v4M8 11v.5" })));
var CIRCUMFERENCE = 113;
var StatusBadge = function (_a) {
    var steps = _a.steps;
    var _b = (0, react_1.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_1.useState)(false), animated = _c[0], setAnimated = _c[1];
    var panelRef = (0, react_1.useRef)(null);
    var doneCount = steps.filter(function (s) { return s.state === "done"; }).length;
    var total = steps.length;
    var ringOffset = CIRCUMFERENCE - (doneCount / total) * CIRCUMFERENCE;
    // close on outside click
    (0, react_1.useEffect)(function () {
        var handler = function (e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return function () { return document.removeEventListener("mousedown", handler); };
    }, []);
    var handleToggle = function () {
        var next = !open;
        setOpen(next);
        if (next && !animated)
            setAnimated(true);
    };
    return (react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.root, ref: panelRef },
        react_1.default.createElement("button", { className: StatusBadge_module_scss_1.default.triggerBtn, onClick: handleToggle, "aria-expanded": open, "aria-haspopup": "true" },
            react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.ringWrap },
                react_1.default.createElement("svg", { className: StatusBadge_module_scss_1.default.ringSvg, viewBox: "0 0 44 44" },
                    react_1.default.createElement("circle", { className: StatusBadge_module_scss_1.default.ringBg, cx: "22", cy: "22", r: "18" }),
                    react_1.default.createElement("circle", { className: "".concat(StatusBadge_module_scss_1.default.ringFill, " ").concat(animated ? StatusBadge_module_scss_1.default.ringAnimated : ""), cx: "22", cy: "22", r: "18", style: {
                            strokeDashoffset: animated ? ringOffset : CIRCUMFERENCE,
                        } })),
                react_1.default.createElement("span", { className: StatusBadge_module_scss_1.default.ringCount },
                    doneCount,
                    "/",
                    total)),
            react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.triggerText },
                react_1.default.createElement("span", { className: StatusBadge_module_scss_1.default.triggerLabel }, "Verification Status"),
                react_1.default.createElement("span", { className: StatusBadge_module_scss_1.default.triggerSub },
                    doneCount,
                    " of ",
                    total,
                    " complete")),
            react_1.default.createElement("svg", { className: "".concat(StatusBadge_module_scss_1.default.chevron, " ").concat(open ? StatusBadge_module_scss_1.default.chevronOpen : ""), width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
                react_1.default.createElement("polyline", { points: "6 9 12 15 18 9" }))),
        react_1.default.createElement("div", { className: "".concat(StatusBadge_module_scss_1.default.panel, " ").concat(open ? StatusBadge_module_scss_1.default.panelOpen : ""), role: "dialog", "aria-label": "Verification checklist" },
            react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.panelHeader },
                react_1.default.createElement("span", { className: StatusBadge_module_scss_1.default.panelTitle }, "Verification checklist"),
                react_1.default.createElement("span", { className: StatusBadge_module_scss_1.default.panelCountPill },
                    doneCount,
                    " / ",
                    total,
                    " done")),
            react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.stepList }, steps.map(function (step, idx) { return (react_1.default.createElement(react_1.default.Fragment, { key: step.id },
                idx > 0 && (react_1.default.createElement("div", { className: "".concat(StatusBadge_module_scss_1.default.connector, " ").concat(steps[idx - 1].state === "done" ? StatusBadge_module_scss_1.default.connectorDone : "") })),
                react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.stepItem },
                    react_1.default.createElement("div", { className: "".concat(StatusBadge_module_scss_1.default.stepIcon, " ").concat(StatusBadge_module_scss_1.default["stepIcon_".concat(step.state)], " ").concat(animated ? StatusBadge_module_scss_1.default.stepIconAnimate : ""), style: { animationDelay: "".concat(idx * 0.08 + 0.1, "s") } }, ICON_MAP[step.state]),
                    react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.stepInfo },
                        react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.stepName }, step.name),
                        react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.stepSub }, step.sub)),
                    react_1.default.createElement("span", { className: "".concat(StatusBadge_module_scss_1.default.stepBadge, " ").concat(StatusBadge_module_scss_1.default["badge_".concat(step.state)]) }, BADGE_LABEL[step.state])))); })),
            react_1.default.createElement("div", { className: StatusBadge_module_scss_1.default.panelFooter },
                INFO_ICON,
                "Pending steps require document upload"))));
};
exports.default = StatusBadge;
//# sourceMappingURL=Statusbadge.js.map