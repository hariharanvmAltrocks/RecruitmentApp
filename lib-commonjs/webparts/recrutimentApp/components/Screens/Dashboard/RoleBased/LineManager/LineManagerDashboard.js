"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineManagerDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var LineManagerDashboard = function (_a) {
    var userName = _a.userName;
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null, "Line Manager Console \u2022 Interview Evaluations & Approvals")),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.actionsSection },
                react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton },
                    react_1.default.createElement(Lucide.CalendarClock, { size: 14 }),
                    "My Calendar")))));
};
exports.LineManagerDashboard = LineManagerDashboard;
exports.default = exports.LineManagerDashboard;
//# sourceMappingURL=LineManagerDashboard.js.map