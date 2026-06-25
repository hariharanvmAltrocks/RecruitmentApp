"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
var tslib_1 = require("tslib");
var MOCK_NOTIFICATIONS = [
    {
        id: "notif-1",
        type: "error",
        text: "Contract SLA Overdue: ERP SYSTEM MAINTENANCE AGREEMENT (1013-CT-14-011)",
        timestamp: "10 mins ago"
    },
    {
        id: "notif-2",
        type: "warning",
        text: "Contract expires in 5 days: FINANCIAL AUDITING & COMPLIANCE (1013-CT-16-012)",
        timestamp: "1 hour ago"
    },
    {
        id: "notif-3",
        type: "success",
        text: "Position completed: GEOLOGICAL DRILLING & TESTING CONTRACT (1013-CT-15-001)",
        timestamp: "4 hours ago"
    },
    {
        id: "notif-4",
        type: "info",
        text: "New candidate assigned to Mobile App Development: John Doe",
        timestamp: "Yesterday"
    },
    {
        id: "notif-5",
        type: "error",
        text: "Department demand increased: TECHNOLOGY department request +5 roles",
        timestamp: "2 days ago"
    }
];
var MOCK_KPI_METRICS = {
    assignedContracts: 92,
    candidates: 184,
    openPositions: 88,
    filledPositions: 112,
    balance: 38,
    todayInterviews: 6,
    upcomingSLA: 47,
    overdueContracts: 8,
    avgHiringTime: 34,
    monthlyHiring: 22
};
var MOCK_DEPARTMENT_PERFORMANCE = [
    { name: "TECHNOLOGY", required: 44, filled: 15, open: 29 },
    { name: "MINING OPERATIONS", required: 22, filled: 11, open: 11 },
    { name: "SENIOR MANAGEMENT", required: 14, filled: 10, open: 4 },
    { name: "EXPLORATION", required: 25, filled: 25, open: 0 },
    { name: "SAFETY & HEALTH", required: 30, filled: 28, open: 2 },
    { name: "FINANCE", required: 5, filled: 0, open: 5 }
];
var MOCK_SUPPLIER_PERFORMANCE = [
    { name: "KAMOA IT SOLUTIONS", contracts: 2, SLA: 33.5 },
    { name: "ACCENTURE", contracts: 1, SLA: 86.0 },
    { name: "CAPGEMINI", contracts: 1, SLA: 64.0 },
    { name: "DELOITTE", contracts: 1, SLA: 71.0 },
    { name: "GEODRILL", contracts: 1, SLA: 100.0 },
    { name: "SAFEWORK", contracts: 1, SLA: 93.0 }
];
var DashboardService = /** @class */ (function () {
    function DashboardService() {
    }
    DashboardService.getNotifications = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(MOCK_NOTIFICATIONS);
                        }, 300);
                    })];
            });
        });
    };
    DashboardService.getKPIMetrics = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(MOCK_KPI_METRICS);
                        }, 300);
                    })];
            });
        });
    };
    DashboardService.getDepartmentPerformance = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(MOCK_DEPARTMENT_PERFORMANCE);
                        }, 300);
                    })];
            });
        });
    };
    DashboardService.getSupplierPerformance = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(MOCK_SUPPLIER_PERFORMANCE);
                        }, 300);
                    })];
            });
        });
    };
    return DashboardService;
}());
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map