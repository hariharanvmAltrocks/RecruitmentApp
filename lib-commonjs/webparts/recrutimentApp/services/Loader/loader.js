"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
require("./loader.scss");
var Loader = function (_a) {
    var isLoading = _a.isLoading, _b = _a.progress, progress = _b === void 0 ? 0 : _b, _c = _a.statusMessage, statusMessage = _c === void 0 ? "Initializing Application..." : _c, onComplete = _a.onComplete, _d = _a.userName, userName = _d === void 0 ? "" : _d;
    var _e = (0, react_1.useState)(0), displayProgress = _e[0], setDisplayProgress = _e[1];
    var _f = (0, react_1.useState)(false), isFadingOut = _f[0], setIsFadingOut = _f[1];
    var _g = (0, react_1.useState)(false), timerPassed = _g[0], setTimerPassed = _g[1];
    var _h = (0, react_1.useState)(false), showTroubleshoot = _h[0], setShowTroubleshoot = _h[1];
    // Smoothly animate the displayed progress number up to the target progress
    (0, react_1.useEffect)(function () {
        var animationFrameId;
        var animate = function () {
            setDisplayProgress(function (prev) {
                if (prev < progress) {
                    // Decelerating step for smooth acceleration catch-up
                    var step = Math.ceil((progress - prev) / 8);
                    var next = prev + step;
                    return next > progress ? progress : next;
                }
                return prev;
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return function () { return cancelAnimationFrame(animationFrameId); };
    }, [progress]);
    // Coordinate the fade-out trigger once loading is done (100% progress achieved)
    (0, react_1.useEffect)(function () {
        if (progress === 100 && displayProgress === 100 && !isLoading) {
            var fadeOutTimer_1 = setTimeout(function () {
                setIsFadingOut(true);
            }, 600); // Keep at 100% for 600ms for visual satisfaction
            return function () { return clearTimeout(fadeOutTimer_1); };
        }
    }, [progress, displayProgress, isLoading]);
    // Notify parent component when the fade-out animation is complete
    (0, react_1.useEffect)(function () {
        if (isFadingOut) {
            var unmountTimer_1 = setTimeout(function () {
                if (onComplete) {
                    onComplete();
                }
            }, 750); // Matches the 750ms transition in CSS
            return function () { return clearTimeout(unmountTimer_1); };
        }
    }, [isFadingOut, onComplete]);
    // Show troubleshooting link if initialization takes longer than 10 seconds
    (0, react_1.useEffect)(function () {
        var checkTimer = setTimeout(function () {
            setTimerPassed(true);
        }, 10000);
        return function () { return clearTimeout(checkTimer); };
    }, []);
    // Circular progress SVG calculations
    var radius = 52;
    var circumference = 2 * Math.PI * radius; // ~326.72
    var strokeDashoffset = circumference - (displayProgress / 100) * circumference;
    return (react_1.default.createElement("div", { className: "rms-splash-screen ".concat(isFadingOut ? "rms-fade-out" : "") },
        react_1.default.createElement("div", { className: "rms-splash-bg-pattern" }),
        react_1.default.createElement("div", { className: "rms-splash-card" },
            react_1.default.createElement("h1", { className: "rms-splash-brand" }, "HRMS"),
            react_1.default.createElement("p", { className: "rms-splash-app-label" }, "Recruitment Management"),
            react_1.default.createElement("div", { className: "rms-splash-progress-wrapper" },
                react_1.default.createElement("svg", { className: "rms-splash-progress-svg", viewBox: "0 0 120 120" },
                    react_1.default.createElement("defs", null,
                        react_1.default.createElement("linearGradient", { id: "progress-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
                            react_1.default.createElement("stop", { offset: "0%", stopColor: "#0078d4" }),
                            react_1.default.createElement("stop", { offset: "100%", stopColor: "#2b88d8" }))),
                    react_1.default.createElement("circle", { className: "rms-splash-circle-bg", cx: "60", cy: "60", r: radius }),
                    react_1.default.createElement("circle", { className: "rms-splash-circle-fill", cx: "60", cy: "60", r: radius, strokeDasharray: circumference, strokeDashoffset: strokeDashoffset })),
                react_1.default.createElement("div", { className: "rms-splash-percentage" },
                    displayProgress,
                    "%")),
            react_1.default.createElement("div", { className: "rms-splash-status-container" },
                react_1.default.createElement("p", { className: "rms-splash-status-text" }, statusMessage),
                userName && react_1.default.createElement("p", { className: "rms-splash-welcome-user" },
                    "Preparing workspace for ",
                    userName)),
            timerPassed && (react_1.default.createElement("div", { className: "rms-splash-troubleshoot" },
                react_1.default.createElement("button", { type: "button", className: "rms-splash-troubleshoot-btn", onClick: function () { return setShowTroubleshoot(!showTroubleshoot); } }, showTroubleshoot ? "Hide details" : "Connection taking longer than usual?"),
                showTroubleshoot && (react_1.default.createElement("div", { className: "rms-splash-troubleshoot-details" },
                    react_1.default.createElement("p", null, "Ensure you are signed in and have permissions to read M365 resources. If the issue persists, contact IT support."))))))));
};
exports.default = Loader;
//# sourceMappingURL=loader.js.map