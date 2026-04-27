"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var AdminPanelService = /** @class */ (function () {
    function AdminPanelService() {
    }
    AdminPanelService.prototype.getAdminPanelDashboard = function (FilterValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetProfileByJobCodeData_1, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        GetProfileByJobCodeData_1 = [];
                        return [4 /*yield*/, CareerPortalAPI_1.AdminPanelServiceApi.GetAdminPanelDashboard(FilterValue)
                                .then(function (res) {
                                var _a, _b;
                                var TotalItems = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.totalItems;
                                GetProfileByJobCodeData_1 = res.data.data.map(function (item, index) {
                                    return {
                                        SNO: index + 1,
                                        TotalItems: TotalItems,
                                        exUserCode: item.exUserCode,
                                        name: item.name,
                                        email: item.email,
                                        userId: item.userId,
                                        ExternalUsersAccounts: item.tblMstExternalUsersAccounts,
                                        contractStartDate: item.contractStartDate,
                                        contractEndDate: item.contractEndDate,
                                        designation: item.designation,
                                        isExpat: item.isExpat === 1
                                            ? ConditionConfig_1.Nationality.Expatriate
                                            : ConditionConfig_1.Nationality.Nationals,
                                        noOfUsers: item.noOfUsers,
                                        isActive: item.isActive,
                                        firstName: item.firstName,
                                        lastName: item.lastName,
                                    };
                                });
                            })
                                .catch(function (error) {
                                console.log(error, "error");
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: GetProfileByJobCodeData_1,
                                status: 200,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error Get Candidate details:", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminPanelService.prototype.UpsertExternalUser = function (UpsetUserValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var UpsertUserDetails, response, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        UpsertUserDetails = {
                            firstname: UpsetUserValue.firstname,
                            lastname: UpsetUserValue.lastname,
                            contactNumber: UpsetUserValue.contactNumber,
                            email: UpsetUserValue.email,
                            password: UpsetUserValue.password,
                            isActive: UpsetUserValue.isActive,
                            isEdit: UpsetUserValue.isEdit,
                            type: UpsetUserValue.type,
                            exUserCode: UpsetUserValue.exUserCode,
                            userId: UpsetUserValue.userId,
                            isExpat: UpsetUserValue.isExpat,
                            noOfUsers: UpsetUserValue.noOfUsers,
                            hrUserId: UpsetUserValue.hrUserId,
                            externalUserAccounts: UpsetUserValue.externalUserAccounts,
                            name: UpsetUserValue.name,
                            contractStartDate: UpsetUserValue.contractStartDate,
                            contractEndDate: UpsetUserValue.contractEndDate,
                            designation: UpsetUserValue.designation,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.AdminPanelServiceApi.UpsertExternalUser(UpsertUserDetails)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error Get Candidate details:", error_2);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminPanelService.prototype.InsertExternalUser = function (UpsetUserValue, IsEdit) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var UpsertUserDetails, response, error_3;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        UpsertUserDetails = {
                            AgentCode: UpsetUserValue.AgentCode,
                            AgentName: UpsetUserValue.CompanyName,
                            EmailID: UpsetUserValue.EmailID,
                            Nationality: ((_a = UpsetUserValue.Nationality) === null || _a === void 0 ? void 0 : _a.text) || "",
                            UserType: UpsetUserValue.UserType,
                            IsActive: UpsetUserValue.IsActive ? true : false,
                            UserName: UpsetUserValue.FirstName + " " + UpsetUserValue.LastName,
                            Designation: UpsetUserValue.Designation,
                            NoOfUsers: Number(UpsetUserValue.NoOfUsers),
                            StartDateOfContract: UpsetUserValue.StartDateOfContract,
                            EndDateOfContract: UpsetUserValue.EndDateOfContract,
                        };
                        response = void 0;
                        if (!IsEdit) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSExternalAgents,
                                RequestJSON: UpsertUserDetails,
                                ID: UpsetUserValue.ExternalID,
                            })];
                    case 1:
                        response = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSExternalAgents,
                            RequestJSON: UpsertUserDetails,
                        })];
                    case 3:
                        response = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, {
                            data: response,
                            status: 200,
                            message: "Get Candidate details",
                        }];
                    case 5:
                        error_3 = _b.sent();
                        console.error("Error Get Candidate details:", error_3);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AdminPanelService.prototype.ResetPassword = function (UserEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.AdminPanelServiceApi.ResetPassword(UserEmail)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error Get Candidate details:", error_4);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AdminPanelService;
}());
exports.default = AdminPanelService;
//# sourceMappingURL=AdminPanelService.js.map