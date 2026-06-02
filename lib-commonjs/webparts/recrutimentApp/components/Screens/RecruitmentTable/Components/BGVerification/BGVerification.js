"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
require("./BGVerification.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var BGVerification = function (_a) {
    var mandatoryChecks = _a.mandatoryChecks, VerificationChecks = _a.VerificationChecks, onToggleOption = _a.onToggleOption, _b = _a.hasError, hasError = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    var optionalChecks = VerificationChecks.map(function (check) { return ({
        id: String(check.id),
        label: check.description || strings.UnnamedCheck,
        checked: Boolean(check.checked),
    }); });
    return (React.createElement("div", { className: [
            "vc-card-container",
            hasError ? "vc-card-container--error" : "",
        ]
            .filter(Boolean)
            .join(" ") },
        React.createElement("div", { className: "vc-header" },
            React.createElement("h2", { className: "vc-title" },
                strings.BackgroundVerificationRequirements,
                React.createElement("span", { className: "vc-required-asterisk" }, "*")),
            React.createElement("p", { className: "vc-subtitle" }, strings.SelectTheRequiredBackgroundChecksForThis)),
        React.createElement("div", { className: "vc-body" },
            React.createElement("div", { className: "vc-section" },
                React.createElement("h3", { className: "vc-section-title" }, strings.StandardRequirementsPreSelected),
                React.createElement("div", { className: "vc-grid" }, mandatoryChecks.map(function (item) { return (React.createElement("label", { key: item.id, className: "vc-option disabled" },
                    React.createElement("input", { type: "checkbox", className: "vc-checkbox", checked: true, disabled: true, readOnly: true, "aria-label": item.label }),
                    React.createElement("span", { className: "vc-checkbox-wrap" },
                        React.createElement("span", { className: "vc-custom-checkbox", "aria-hidden": "true" })),
                    React.createElement("span", { className: "vc-label-text" }, item.label),
                    React.createElement("span", { className: "vc-badge" }, strings.Required))); }))),
            React.createElement("div", { className: "vc-section" },
                React.createElement("h3", { className: "vc-section-title" }, strings.AdditionalRoleSpecificChecks),
                React.createElement("div", { className: "vc-grid" }, optionalChecks.map(function (item) { return (React.createElement("label", { key: item.id, className: [
                        strings.VcOptionInteractive || "vc-option interactive",
                        item.checked ? "checked" : "",
                    ]
                        .filter(Boolean)
                        .join(" ") },
                    React.createElement("input", { type: "checkbox", className: "vc-checkbox", checked: item.checked, onChange: function () { return onToggleOption(item.id); }, "aria-label": item.label, disabled: disabled }),
                    React.createElement("span", { className: "vc-checkbox-wrap" },
                        React.createElement("span", { className: "vc-custom-checkbox", "aria-hidden": "true" })),
                    React.createElement("span", { className: "vc-label-text" }, item.label))); })))),
        hasError && (React.createElement("p", { className: "vc-error-text" }, strings.PleaseChooseAtLeastOneBgvVerificationOpt))));
};
exports.default = BGVerification;
//# sourceMappingURL=BGVerification.js.map