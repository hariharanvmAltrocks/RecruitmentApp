"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = exports.masterService = void 0;
var tslib_1 = require("tslib");
var MasterService_1 = tslib_1.__importDefault(require("./MasterService/MasterService"));
var menuService_1 = tslib_1.__importDefault(require("./MenuService/menuService"));
exports.masterService = new MasterService_1.default();
exports.menuService = new menuService_1.default();
//# sourceMappingURL=ServiceExport.js.map