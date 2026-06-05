"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
require("./loader.scss");
var Loader = function (_a) {
    var isLoading = _a.isLoading, onComplete = _a.onComplete, _b = _a.userName, userName = _b === void 0 ? "" : _b;
    var _c = (0, react_1.useState)(0), progress = _c[0], setProgress = _c[1];
    var _d = (0, react_1.useState)(false), showTroubleshoot = _d[0], setShowTroubleshoot = _d[1];
    var _e = (0, react_1.useState)(false), timerPassed = _e[0], setTimerPassed = _e[1];
    // Smooth progress animation logic
    (0, react_1.useEffect)(function () {
        var interval;
        var stepTime = isLoading ? 120 : 35; // Accelerate speed when background data is ready
        interval = setInterval(function () {
            setProgress(function (prev) {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (onComplete)
                        onComplete();
                    return 100;
                }
                var maxLimit = isLoading ? 98 : 100;
                // Faster increments if loading is done
                var increment = isLoading
                    ? Math.floor(Math.random() * 2) + 1
                    : Math.floor(Math.random() * 8) + 4;
                var next = prev + increment;
                return next > maxLimit ? maxLimit : next;
            });
        }, stepTime);
        return function () { return clearInterval(interval); };
    }, [isLoading, onComplete]);
    // Show troubleshooting link if load takes too long (e.g. 8 seconds)
    (0, react_1.useEffect)(function () {
        var checkTimer = setTimeout(function () {
            setTimerPassed(true);
        }, 8000);
        return function () { return clearTimeout(checkTimer); };
    }, []);
    // Map progress to status text stages
    var getStatusText = function (p) {
        if (p <= 20)
            return "Initializing Application...";
        if (p <= 40)
            return "Loading User Profile...";
        if (p <= 60)
            return "Fetching Dashboard Data...";
        if (p <= 80)
            return "Preparing Recruitment Workspace...";
        return "Finalizing Setup...";
    };
    // Circular progress stroke calculation
    var radius = 54;
    var circumference = 2 * Math.PI * radius; // ~339.292
    var strokeDashoffset = circumference - (progress / 100) * circumference;
    return (react_1.default.createElement("div", { className: "rms-loader-container" },
        react_1.default.createElement("div", { className: "rms-loader-card" },
            react_1.default.createElement("div", { className: "rms-logo-container" },
                react_1.default.createElement("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M12 2L2 6.5V11C2 17.55 6.27 21.74 12 23C17.73 21.74 22 17.55 22 11V6.5L12 2Z", fill: "#2563eb" }),
                    react_1.default.createElement("path", { d: "M12 4.2L4 7.8V11.2C4 16.3 7.37 19.8 12 20.8V4.2Z", fill: "#3b82f6" }),
                    react_1.default.createElement("circle", { cx: "12", cy: "11", r: "3", fill: "#ffffff" }),
                    react_1.default.createElement("path", { d: "M12 14C9.5 14 7.5 15.5 7.5 17.5H16.5C16.5 15.5 14.5 14 12 14Z", fill: "#ffffff" }))),
            react_1.default.createElement("h2", { className: "rms-welcome-text" }, userName ? "Welcome, ".concat(userName) : "Welcome"),
            react_1.default.createElement("p", { className: "rms-subtitle" }, "Getting your workspace ready..."),
            react_1.default.createElement("div", { className: "rms-progress-wrapper" },
                react_1.default.createElement("svg", { className: "rms-circular-progress", viewBox: "0 0 120 120" },
                    react_1.default.createElement("defs", null,
                        react_1.default.createElement("linearGradient", { id: "rms-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
                            react_1.default.createElement("stop", { offset: "0%", stopColor: "#2563eb" }),
                            react_1.default.createElement("stop", { offset: "100%", stopColor: "#60a5fa" }))),
                    react_1.default.createElement("circle", { className: "rms-circle-bg", cx: "60", cy: "60", r: radius }),
                    react_1.default.createElement("circle", { className: "rms-circle-fill", cx: "60", cy: "60", r: radius, strokeDasharray: circumference, strokeDashoffset: strokeDashoffset })),
                react_1.default.createElement("div", { className: "rms-percentage-text" },
                    progress,
                    "%")),
            react_1.default.createElement("div", { className: "rms-status-container" },
                react_1.default.createElement("p", { className: "rms-status-text" }, getStatusText(progress))),
            timerPassed && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("button", { type: "button", className: "rms-troubleshoot-btn", onClick: function () { return setShowTroubleshoot(!showTroubleshoot); } }, showTroubleshoot ? "Hide troubleshooting guide" : "Taking longer than usual? Click here"),
                showTroubleshoot && (react_1.default.createElement("div", { className: "rms-troubleshoot-content" },
                    react_1.default.createElement("h4", null, "First-Time Setup Troubleshooting"),
                    react_1.default.createElement("ul", null,
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("strong", null, "Check API Access Approval:"),
                            " A tenant admin must approve Graph API permissions in the SharePoint Admin Center (e.g. ",
                            react_1.default.createElement("code", null, "GroupMember.Read.All"),
                            ")."),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("strong", null, "AD Group & Roles:"),
                            " Verify that your user account email is mapped to a designated system role inside the SharePoint user role master list."),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("strong", null, "Empty System Data:"),
                            " If lists like ",
                            react_1.default.createElement("code", null, "CareerPortalLink"),
                            " are missing or empty, default links must be provisioned.")))))))));
};
exports.default = Loader;
//# sourceMappingURL=loader.js.map