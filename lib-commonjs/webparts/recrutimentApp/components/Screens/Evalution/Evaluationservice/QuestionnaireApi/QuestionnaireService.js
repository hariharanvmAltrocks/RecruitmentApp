"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireService = exports.InternalSign = void 0;
var tslib_1 = require("tslib");
var axiosConfig_1 = require("../../../../../services/AxiosService/axiosConfig");
var AxiosService_1 = tslib_1.__importDefault(require("../../../../../services/AxiosService/AxiosService"));
exports.InternalSign = {
    InternalSignIn: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/InternalSignIn", {}, axiosConfig_1.AuthorizationHeader)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
exports.QuestionnaireService = {
    PostQuestionnaire: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertQuestions", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    },
    GetQuestionnaire: function (jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/hrms/GetInterviewPanelQuestionsByJobCode?jobCode=".concat(jobCode))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    },
    GetQuestionaireByScope: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/GetQuestionsBank", params)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    },
};
//# sourceMappingURL=QuestionnaireService.js.map