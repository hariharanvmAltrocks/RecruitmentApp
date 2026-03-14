"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var spservice_1 = require("../../../../services/SPService/spservice");
var CommonService = /** @class */ (function () {
    function CommonService() {
    }
    CommonService.prototype.getUserGuidByEmail = function (email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sp, user, userData, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🟢 [CommonService] getUserGuidByEmail called with:", email);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        sp = (0, spservice_1.getSP)();
                        console.log("🟢 [CommonService] SP instance:", sp);
                        return [4 /*yield*/, sp.web.siteUsers.getByEmail(email)()];
                    case 2:
                        user = _a.sent();
                        console.log("🟢 [CommonService] SharePoint User:", user);
                        userData = {
                            key: user.Id,
                            text: user.Title
                        };
                        console.log("🟢 [CommonService] Processed User Data:", userData);
                        return [2 /*return*/, {
                                data: userData,
                                status: 200,
                                message: "User fetched successfully"
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error("❌ [CommonService] Error fetching user by email:", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error fetching user"
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CommonService;
}());
exports.default = new CommonService();
//# sourceMappingURL=CommonService.js.map