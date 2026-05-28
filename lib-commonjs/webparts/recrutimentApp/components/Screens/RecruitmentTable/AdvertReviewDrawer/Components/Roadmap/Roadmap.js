"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roadmap = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var Roadmap_module_scss_1 = tslib_1.__importDefault(require("./Roadmap.module.scss"));
var PositionStatusConfig_1 = require("../../../../../../utilities/PositionStatusConfig");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var Roadmap = function (_a) {
    var _b;
    var statusId = _a.statusId;
    var currentStageIndex = (0, PositionStatusConfig_1.getStageIndex)(statusId);
    var activeStatusLabel = ((_b = PositionStatusConfig_1.stages[currentStageIndex]) === null || _b === void 0 ? void 0 : _b.label) || strings.UnknownStatus;
    return (react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.roadmapContainer },
        react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.lifecycleCard },
            react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.headerRow },
                react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.title },
                    react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.accentBar }),
                    strings.RecruitmentLifecycleRoadmap),
                react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.statusBadge },
                    react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.dot }),
                    strings.ActiveStatus,
                    activeStatusLabel)),
            react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.stepperContainer }, PositionStatusConfig_1.stages.map(function (stage, index) {
                var Icon = stage.icon;
                var isCompleted = index < currentStageIndex;
                var isActive = index === currentStageIndex;
                var iconClass = Roadmap_module_scss_1.default.iconContainer;
                if (isCompleted)
                    iconClass += " ".concat(Roadmap_module_scss_1.default["iconContainer--completed"]);
                else if (isActive)
                    iconClass += " ".concat(Roadmap_module_scss_1.default["iconContainer--active"]);
                // Prevent green line extending past the last completed node if next is active
                var isLastCompletedBeforeActive = isCompleted && index === currentStageIndex - 1;
                if (isLastCompletedBeforeActive) {
                    iconClass += " ".concat(Roadmap_module_scss_1.default["no-line"]);
                }
                var nameClass = Roadmap_module_scss_1.default.stageName;
                if (isCompleted)
                    nameClass += " ".concat(Roadmap_module_scss_1.default["stageName--completed"]);
                else if (isActive)
                    nameClass += " ".concat(Roadmap_module_scss_1.default["stageName--active"]);
                return (react_1.default.createElement("div", { key: index, className: Roadmap_module_scss_1.default.stageWrapper },
                    react_1.default.createElement("div", { className: iconClass },
                        isActive && react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.ripple }),
                        isCompleted ? (react_1.default.createElement(lucide_react_1.Check, { size: 20, strokeWidth: 3 })) : (react_1.default.createElement(Icon, { size: 20, strokeWidth: 2.5 }))),
                    react_1.default.createElement("div", { className: Roadmap_module_scss_1.default.labelContainer },
                        react_1.default.createElement("span", { className: nameClass }, stage.label),
                        isCompleted && (react_1.default.createElement("span", { className: Roadmap_module_scss_1.default.statusText }, strings.Done)))));
            })))));
};
exports.Roadmap = Roadmap;
//# sourceMappingURL=Roadmap.js.map