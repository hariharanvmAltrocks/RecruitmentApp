"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusTooltip = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
require("./StatusTooltip.css");
var StatusTooltip = function (_a) {
    var onHover = _a.onHover, data = _a.data, _b = _a.label, label = _b === void 0 ? "Approver Names" : _b;
    var _c = (0, react_1.useState)(false), visible = _c[0], setVisible = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)({ top: 0, left: 0 }), tooltipPos = _e[0], setTooltipPos = _e[1];
    var fetchedRef = (0, react_1.useRef)(false);
    var anchorRef = (0, react_1.useRef)(null);
    var handleMouseEnter = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var rect;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (anchorRef.current) {
                        rect = anchorRef.current.getBoundingClientRect();
                        setTooltipPos({
                            top: rect.bottom + 8,
                            left: rect.left + rect.width / 2,
                        });
                    }
                    setVisible(true);
                    if (!!fetchedRef.current) return [3 /*break*/, 2];
                    setLoading(true);
                    return [4 /*yield*/, (onHover === null || onHover === void 0 ? void 0 : onHover())];
                case 1:
                    _a.sent();
                    setLoading(false);
                    fetchedRef.current = true;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleMouseLeave = function () { return setVisible(false); };
    var isNoData = !data ||
        (data.HR.Name === "" &&
            data.LineManager.Name === "" &&
            data.HOD.Name === "" &&
            data.Exco.Name === "" &&
            data.HRLead.Name === "");
    return (react_1.default.createElement("div", { ref: anchorRef, className: "status-tooltip__anchor", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
        react_1.default.createElement("button", { className: "status-tooltip__icon", type: "button", "aria-label": "Pending approver info" }, "i"),
        visible && (react_1.default.createElement("div", { className: "status-tooltip__box", style: {
                top: tooltipPos.top,
                left: tooltipPos.left,
                transform: "translateX(-50%)",
            }, role: "tooltip", onMouseEnter: function () { return setVisible(true); }, onMouseLeave: function () { return setVisible(false); } },
            react_1.default.createElement("div", { className: "status-tooltip__title" }, label),
            loading ? (react_1.default.createElement("div", { className: "status-tooltip__loading" },
                react_1.default.createElement("span", { className: "status-tooltip__spinner" }),
                "Loading\u2026")) : isNoData ? (
            /* Empty state */
            react_1.default.createElement("div", { className: "status-tooltip__loading" }, "No data available")) : (
            /* Rows */
            react_1.default.createElement("div", { className: "status-tooltip__list" },
                data.LineManager.Name && (react_1.default.createElement("div", { className: "status-tooltip__row" },
                    react_1.default.createElement("span", { className: "status-tooltip__key" }, data.LineManager.Role),
                    react_1.default.createElement("span", { className: "status-tooltip__separator" }, ":"),
                    react_1.default.createElement("span", { className: "status-tooltip__val" }, data.LineManager.Name))),
                data.HOD.Name && (react_1.default.createElement("div", { className: "status-tooltip__row" },
                    react_1.default.createElement("span", { className: "status-tooltip__key" }, data.HOD.Role),
                    react_1.default.createElement("span", { className: "status-tooltip__separator" }, ":"),
                    react_1.default.createElement("span", { className: "status-tooltip__val" }, data.HOD.Name))),
                data.HR.Name && (react_1.default.createElement("div", { className: "status-tooltip__row" },
                    react_1.default.createElement("span", { className: "status-tooltip__key" }, data.HR.Role),
                    react_1.default.createElement("span", { className: "status-tooltip__separator" }, ":"),
                    react_1.default.createElement("span", { className: "status-tooltip__val" }, data.HR.Name))),
                data.Exco.Name && (react_1.default.createElement("div", { className: "status-tooltip__row" },
                    react_1.default.createElement("span", { className: "status-tooltip__key" }, data.Exco.Role),
                    react_1.default.createElement("span", { className: "status-tooltip__separator" }, ":"),
                    react_1.default.createElement("span", { className: "status-tooltip__val" }, data.Exco.Name))),
                data.HRLead.Name && (react_1.default.createElement("div", { className: "status-tooltip__row" },
                    react_1.default.createElement("span", { className: "status-tooltip__key" }, data.HRLead.Role),
                    react_1.default.createElement("span", { className: "status-tooltip__separator" }, ":"),
                    react_1.default.createElement("span", { className: "status-tooltip__val" }, data.HRLead.Name))))),
            react_1.default.createElement("div", { className: "status-tooltip__arrow" })))));
};
exports.StatusTooltip = StatusTooltip;
//# sourceMappingURL=StatusTooltip.js.map