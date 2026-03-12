"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var axiosConfig_1 = require("./axiosConfig");
var TokenContext_1 = require("./TokenContext");
var ApiUrls = (_a = localStorage.getItem("CareerPortalLink")) !== null && _a !== void 0 ? _a : "";
var AxiosInstance = axios_1.default.create({
    baseURL: ApiUrls,
    timeout: 10000000
});
AxiosInstance.interceptors.request.use(function (config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var token, tokenParts, tokenPayload, tokenExpiration, res, error_1;
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = (0, TokenContext_1.getToken)();
                if (!token) return [3 /*break*/, 5];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                tokenParts = token.split(".");
                tokenPayload = JSON.parse(atob(tokenParts[1]));
                tokenExpiration = tokenPayload.exp * 1000;
                return [4 /*yield*/, axios_1.default.post("".concat(ApiUrls, "/hrms/InternalSignIn"), {}, axiosConfig_1.AuthorizationHeader)];
            case 2:
                res = _c.sent();
                token = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.tokens) === null || _b === void 0 ? void 0 : _b.jwtToken;
                (0, TokenContext_1.setToken)(token);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.error("Token Refresh Failed:", error_1);
                throw new Error("Token refresh failed");
            case 4: return [3 /*break*/, 6];
            case 5:
                console.warn("No token available, request may fail.");
                _c.label = 6;
            case 6: return [2 /*return*/, config];
        }
    });
}); }, function (error) { return Promise.reject(error); });
AxiosInstance.interceptors.response.use(function (response) { return response; }, function (error) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var status_1, res, newToken, refreshError_1;
    var _a, _b, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log("AXIOSAPIError:", error);
                if (!error.response) return [3 /*break*/, 6];
                status_1 = error.response.status;
                if (!(status_1 === 401)) return [3 /*break*/, 5];
                console.warn("Unauthorized request. Attempting token refresh...");
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("".concat(ApiUrls, "/hrms/InternalSignIn"), {}, axiosConfig_1.AuthorizationHeader)];
            case 2:
                res = _d.sent();
                newToken = (_c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.jwtToken;
                if (newToken) {
                    (0, TokenContext_1.setToken)(newToken);
                }
                if (error.config) {
                    error.config.headers.Authorization = "Bearer ".concat(newToken);
                    return [2 /*return*/, AxiosInstance.request(error.config)];
                }
                return [3 /*break*/, 4];
            case 3:
                refreshError_1 = _d.sent();
                console.error("Error during token refresh:", refreshError_1);
                return [2 /*return*/, Promise.reject(refreshError_1)];
            case 4: return [3 /*break*/, 6];
            case 5:
                if (status_1 >= 500) {
                    console.error(axiosConfig_1.AlertMsg.UnableToConnectToServer);
                }
                _d.label = 6;
            case 6: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
exports.default = AxiosInstance;
//# sourceMappingURL=AxiosService.js.map