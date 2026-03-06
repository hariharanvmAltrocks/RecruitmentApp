"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphService = /** @class */ (function () {
    function GraphService() {
    }
    GraphService.setGraphClient = function (graphClient) {
        this._instance = graphClient;
    };
    GraphService.getGraphClient = function () {
        if (!this._instance) {
            throw new Error("Graph client is not initialized. Call setGraphClient first.");
        }
        return this._instance;
    };
    GraphService._instance = null;
    return GraphService;
}());
exports.default = GraphService;
//# sourceMappingURL=GraphService.js.map