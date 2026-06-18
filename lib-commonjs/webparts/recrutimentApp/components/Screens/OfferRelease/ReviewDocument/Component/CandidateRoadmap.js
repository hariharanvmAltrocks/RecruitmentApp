"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateRoadmap = void 0;
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var PositionStatusConfig_1 = require("../../../../../utilities/PositionStatusConfig");
var react_1 = tslib_1.__importDefault(require("react"));
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var RecrutimentAppWebPartStrings_1 = tslib_1.__importDefault(require("RecrutimentAppWebPartStrings"));
var Config_1 = require("../../../../../utilities/Config");
exports.CandidateRoadmap = react_1.default.memo(function (_a) {
    var statusId = _a.statusId, Nationality = _a.Nationality;
    var CandidateStage;
    var currentStage;
    if (Nationality === ConditionConfig_1.NationalityCode.Nationals) {
        CandidateStage = PositionStatusConfig_1.CandidateStagesDRC;
        currentStage = (0, PositionStatusConfig_1.getStageIndexinCandidateDRC)(statusId);
    }
    else {
        CandidateStage = PositionStatusConfig_1.CandidateStages;
        currentStage = (0, PositionStatusConfig_1.getStageIndexinCandidate)(statusId);
    }
    var isRejectedStatus = function (statusId) {
        return (statusId === Config_1.StatusId.BackgroundCheckVerificationFailed ||
            statusId === Config_1.StatusId.CandidateRejectfromRESIProcess ||
            statusId === Config_1.StatusId.offerdecline ||
            statusId === Config_1.StatusId.FailedmedicalscreeningUnfit);
    };
    return (react_1.default.createElement("div", { className: "advert-roadmap" },
        react_1.default.createElement("div", { className: "advert-roadmap__container" }, CandidateStage.map(function (stage, index) {
            var Icon = stage.icon;
            var isCompleted = index < currentStage;
            var isCurrent = index === currentStage;
            var isRejected = isCurrent && isRejectedStatus(statusId);
            return (react_1.default.createElement(framer_motion_1.motion.div, { key: index, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "advert-roadmap__stage" },
                index < PositionStatusConfig_1.stages.length - 1 && (react_1.default.createElement("div", { className: "advert-roadmap__connector" },
                    react_1.default.createElement(framer_motion_1.motion.div, { initial: { width: 0 }, animate: { width: isCompleted ? "100%" : "0%" }, className: "advert-roadmap__connector-fill", transition: { duration: 0.8, delay: index * 0.1 } }))),
                react_1.default.createElement("div", { className: "advert-roadmap__node-wrapper" },
                    react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { scale: 1.15 }, className: "advert-roadmap__node ".concat(isCompleted
                            ? "advert-roadmap__node--completed"
                            : isRejected
                                ? "advert-roadmap__node--rejected"
                                : isCurrent
                                    ? "advert-roadmap__node--current"
                                    : "advert-roadmap__node--pending") }, isCompleted ? (react_1.default.createElement(lucide_react_1.Check, { size: 18, strokeWidth: 3 })) : isRejected ? (react_1.default.createElement(lucide_react_1.X, { size: 18, strokeWidth: 3 })) : (react_1.default.createElement(Icon, { size: 18, strokeWidth: 2 }))),
                    isCurrent && !isRejected && (react_1.default.createElement("div", { className: "advert-roadmap__ping-wrapper" },
                        react_1.default.createElement("span", { className: "advert-roadmap__ping" })))),
                react_1.default.createElement("div", { className: "advert-roadmap__label-wrapper" },
                    react_1.default.createElement("span", { className: "advert-roadmap__label ".concat(isCompleted
                            ? "advert-roadmap__label--completed"
                            : isRejected
                                ? "advert-roadmap__label--rejected"
                                : isCurrent
                                    ? "advert-roadmap__label--current"
                                    : "advert-roadmap__label--pending") }, stage.label),
                    isCompleted && (react_1.default.createElement("span", { className: "advert-roadmap__status-done" }, RecrutimentAppWebPartStrings_1.default.Done)),
                    isRejected && (react_1.default.createElement("span", { className: "advert-roadmap__status-rejected" }, RecrutimentAppWebPartStrings_1.default.Rejected || "Rejected")))));
        }))));
});
exports.CandidateRoadmap.displayName = "CandidateRoadmap";
//# sourceMappingURL=CandidateRoadmap.js.map