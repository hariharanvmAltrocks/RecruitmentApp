"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionRoadmap = void 0;
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_1 = tslib_1.__importDefault(require("react"));
var PositionStatusConfig_1 = require("../../../../../utilities/PositionStatusConfig");
var CandidateProgress_1 = require("./CandidateProgress/CandidateProgress");
var RecrutimentAppWebPartStrings_1 = tslib_1.__importDefault(require("RecrutimentAppWebPartStrings"));
var PositionRoadmap = function (_a) {
    var statusId = _a.statusId, recId = _a.recId;
    var currentStage = (0, PositionStatusConfig_1.getStageIndex)(statusId);
    return (react_1.default.createElement("div", { className: "advert-roadmap" },
        react_1.default.createElement("div", { className: "advert-roadmap__container" }, PositionStatusConfig_1.stages.map(function (stage, index) {
            var Icon = stage.icon;
            var isCompleted = index < currentStage;
            var isCurrent = index === currentStage;
            return (react_1.default.createElement(framer_motion_1.motion.div, { key: index, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "advert-roadmap__stage" },
                index < PositionStatusConfig_1.stages.length - 1 && (react_1.default.createElement("div", { className: "advert-roadmap__connector" },
                    react_1.default.createElement(framer_motion_1.motion.div, { initial: { width: 0 }, animate: { width: isCompleted ? "100%" : "0%" }, className: "advert-roadmap__connector-fill", transition: { duration: 0.8, delay: index * 0.1 } }))),
                react_1.default.createElement("div", { className: "advert-roadmap__node-wrapper" },
                    react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { scale: 1.15 }, className: "advert-roadmap__node ".concat(isCompleted
                            ? "advert-roadmap__node--completed"
                            : isCurrent
                                ? "advert-roadmap__node--current"
                                : "advert-roadmap__node--pending") }, isCompleted ? (react_1.default.createElement(lucide_react_1.Check, { size: 18, strokeWidth: 3 })) : (react_1.default.createElement(Icon, { size: 18, strokeWidth: 2 }))),
                    isCurrent && (react_1.default.createElement("div", { className: "advert-roadmap__ping-wrapper" },
                        react_1.default.createElement("span", { className: "advert-roadmap__ping" })))),
                react_1.default.createElement("div", { className: "advert-roadmap__label-wrapper" },
                    react_1.default.createElement("span", { className: "advert-roadmap__label ".concat(isCompleted
                            ? "advert-roadmap__label--completed"
                            : isCurrent
                                ? "advert-roadmap__label--current"
                                : "advert-roadmap__label--pending") }, stage.label),
                    isCompleted && (react_1.default.createElement("span", { className: "advert-roadmap__status-done" }, RecrutimentAppWebPartStrings_1.default.Done)))));
        })),
        react_1.default.createElement(CandidateProgress_1.CandidateProgress, { RecID: recId })));
};
exports.PositionRoadmap = PositionRoadmap;
//# sourceMappingURL=PositionRoadmap.js.map