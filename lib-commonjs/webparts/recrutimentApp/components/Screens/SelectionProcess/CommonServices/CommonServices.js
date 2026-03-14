"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var spservice_1 = require("../../../../services/SPService/spservice");
var CommonService = /** @class */ (function () {
    function CommonService() {
        var _this = this;
        this.getUserGuidByEmail = function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sp, user, UserID, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sp = (0, spservice_1.getSP)();
                        return [4 /*yield*/, sp.web.siteUsers.getByEmail(email)()];
                    case 1:
                        user = _a.sent();
                        UserID = {
                            key: user.Id,
                            text: user.Title
                        };
                        return [2 /*return*/, {
                                data: UserID,
                                status: 200,
                                message: "User ID retrieved successfully",
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching user ID by email: ", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error getting User ID",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    return CommonService;
}());
exports.default = CommonService;
//# sourceMappingURL=CommonServices.js.map