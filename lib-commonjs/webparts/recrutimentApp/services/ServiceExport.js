"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerPotalServices = exports.CommonServices = exports.DashboardServices = exports.menuService = exports.masterService = void 0;
var tslib_1 = require("tslib");
var CareerPortalService_1 = tslib_1.__importDefault(require("./CareerPortal/CareerPortalService"));
var CommanService_1 = tslib_1.__importDefault(require("./CommanAPi/CommanService"));
var DashboardService_1 = tslib_1.__importDefault(require("./Dashboard/DashboardService"));
var MasterService_1 = tslib_1.__importDefault(require("./MasterService/MasterService"));
var menuService_1 = tslib_1.__importDefault(require("./MenuService/menuService"));
exports.masterService = new MasterService_1.default();
exports.menuService = new menuService_1.default();
exports.DashboardServices = new DashboardService_1.default();
exports.CommonServices = new CommanService_1.default();
exports.CareerPotalServices = new CareerPortalService_1.default();
//# sourceMappingURL=ServiceExport.js.map