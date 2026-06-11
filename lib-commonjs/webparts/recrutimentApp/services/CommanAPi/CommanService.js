"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Config_1 = require("../../utilities/Config");
var GraphService_1 = tslib_1.__importDefault(require("../GraphService/GraphService"));
var spservice_1 = tslib_1.__importStar(require("../SPService/spservice"));
var CommonService = /** @class */ (function () {
    function CommonService() {
        var _this = this;
        this.uploadAttachmentToLibrary = function (PositionCode, AttachFile, Listname) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        response = void 0;
                        if (!(AttachFile.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Listname,
                                FolderNames: ["".concat(PositionCode.toString())],
                                Datas: AttachFile,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2: return [2 /*return*/, {
                            data: null,
                            status: 400,
                            message: "No attachments provided",
                        }];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error during file replacement process:", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement: ".concat(error_1),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.uploadRoleProfileMaster = function (PositionCode, DocumentName, AttachFile, Listname) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(AttachFile.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Listname,
                                FolderNames: [
                                    "".concat(PositionCode.toString()),
                                    "".concat(DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: "Successfully Replaced Document",
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2: return [2 /*return*/, {
                            data: null,
                            status: 400,
                            message: "No attachments provided",
                        }];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error during file replacement process:", error_2);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.GetAttachmentLink = function (PositionCode, Listname) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sp, attachmentsLibrary, rootFolder, folderUrl, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sp = (0, spservice_1.getSP)();
                        if (!Listname) return [3 /*break*/, 2];
                        attachmentsLibrary = sp.web.lists.getByTitle(Listname);
                        return [4 /*yield*/, attachmentsLibrary.rootFolder.getItem()];
                    case 1:
                        rootFolder = _a.sent();
                        folderUrl = "".concat(rootFolder.toUrl, "/").concat(PositionCode);
                        return [2 /*return*/, {
                                data: folderUrl,
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2: return [2 /*return*/, {
                            data: null,
                            status: 400,
                            message: "No attachments provided",
                        }];
                    case 3:
                        error_3 = _a.sent();
                        console.error(" Error during file replacement process:", error_3);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.GetAttachmentToLibrary = function (listName, JobCode, RoleProfile, ProfileID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, basePath, EnglishFiles, FrenchFiles, RoleProfileFiles, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        response = void 0;
                        if (!RoleProfile) return [3 /*break*/, 6];
                        basePath = "".concat(listName, "/").concat(JobCode, "/").concat(RoleProfile);
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(basePath, "/English"),
                            })];
                    case 1:
                        EnglishFiles = (_a.sent());
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(basePath, "/French"),
                            })];
                    case 2:
                        FrenchFiles = (_a.sent());
                        if (!((EnglishFiles && EnglishFiles.length > 0) ||
                            (FrenchFiles && FrenchFiles.length > 0))) return [3 /*break*/, 3];
                        response = {
                            English: EnglishFiles || [],
                            French: FrenchFiles || [],
                        };
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: basePath,
                        })];
                    case 4:
                        RoleProfileFiles = (_a.sent());
                        response = {
                            English: RoleProfileFiles,
                            French: [], // or same files if needed
                        };
                        _a.label = 5;
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        if (!ProfileID) return [3 /*break*/, 8];
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(listName, "/").concat(ProfileID, "/$CV/"),
                            })];
                    case 7:
                        response = (_a.sent());
                        return [3 /*break*/, 12];
                    case 8:
                        if (!JobCode) return [3 /*break*/, 10];
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(listName, "/").concat(JobCode),
                            })];
                    case 9:
                        response = (_a.sent());
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(listName),
                        })];
                    case 11:
                        response = (_a.sent());
                        _a.label = 12;
                    case 12: return [2 /*return*/, {
                            data: response,
                            status: 200,
                            message: "Attachments retrieved successfully",
                        }];
                    case 13:
                        error_4 = _a.sent();
                        console.log("Error getting attachments:", error_4);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error getting attachments",
                            }];
                    case 14: return [2 /*return*/];
                }
            });
        }); };
        this.GetADgruopsEmailIDs = function (ADGroupID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var graphClient, response, members, userDetailsPromises, userDetails, validUserDetails, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        graphClient = GraphService_1.default.getGraphClient();
                        return [4 /*yield*/, graphClient
                                .api("/groups/".concat(ADGroupID, "/members"))
                                .get()];
                    case 1:
                        response = _a.sent();
                        members = response.value || [];
                        userDetailsPromises = members.map(function (item) {
                            return getUserGuidByEmail(item.mail);
                        });
                        return [4 /*yield*/, Promise.all(userDetailsPromises)];
                    case 2:
                        userDetails = _a.sent();
                        validUserDetails = userDetails.filter(function (user) { return user !== null; });
                        return [2 /*return*/, {
                                data: validUserDetails,
                                status: 200,
                                message: "ADGroups retrieved successfully",
                            }];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error checking user in groups:", error_5);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error getting ADGroups",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getUserGuidByEmail = function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sp, user, UserID, error_6;
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
                            text: user.Title, //`${UserName?.FirstName || ""} ${UserName?.MiddleName || ""} ${UserName?.LastName || "" }`,
                        };
                        return [2 /*return*/, {
                                data: UserID,
                                status: 200,
                                message: "ADGroups retrieved successfully",
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error fetching user ID by email: ", error_6);
                        // Return null in case of an error
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error getting ADGroups",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getUserIDByEmail = function (userId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var sp, user, UserID, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sp = (0, spservice_1.getSP)();
                        return [4 /*yield*/, sp.web.siteUsers.getById(userId)()];
                    case 1:
                        user = _a.sent();
                        UserID = user.Email;
                        return [2 /*return*/, {
                                data: UserID,
                                status: 200,
                                message: "ADGroups retrieved successfully",
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error fetching user ID by email: ", error_7);
                        // Return null in case of an error
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error getting ADGroups",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.GetMasterData = function (ListName, Filter) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var listItems, error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: ListName,
                                Select: "*",
                                Filter: Filter || [],
                            })];
                    case 1:
                        listItems = _a.sent();
                        return [2 /*return*/, {
                                data: listItems,
                                status: 200,
                                message: "HRMSRecruitmentCandidateDetails fetched successfully",
                            }];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Error fetching data HRMSRecruitmentCandidateDetails:", error_8);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data from HRMSRecruitmentCandidateDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.GetSageMasterData = function (ListName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var listItems, error_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: ListName,
                                Select: "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
                                Expand: "JobTitleInEnglish,JobTitleInFrench"
                            })];
                    case 1:
                        listItems = _a.sent();
                        return [2 /*return*/, {
                                data: listItems,
                                status: 200,
                                message: "HRMSRecruitmentCandidateDetails fetched successfully",
                            }];
                    case 2:
                        error_9 = _a.sent();
                        console.error("Error fetching data HRMSRecruitmentCandidateDetails:", error_9);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data from HRMSRecruitmentCandidateDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.GetDocumentinUrl = function (url) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var filteredFiles, extractedPath, folderPath, FileData, fileName_1, error_10, error_11;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        filteredFiles = [];
                        if (!url) return [3 /*break*/, 4];
                        extractedPath = ((_a = url.split("/root:/")[1]) === null || _a === void 0 ? void 0 : _a.split(":/content")[0]) || "";
                        if (!extractedPath) return [3 /*break*/, 4];
                        folderPath = extractedPath.substring(0, extractedPath.lastIndexOf("/")) || "";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV, "/").concat(folderPath),
                            })];
                    case 2:
                        FileData = (_b.sent());
                        if (FileData && FileData.length > 0) {
                            fileName_1 = extractedPath.split("/").pop();
                            filteredFiles = FileData.filter(function (file) { return file.name === fileName_1; });
                        }
                        else {
                            console.warn("Warning: No files found in the directory");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _b.sent();
                        console.error("Error fetching document library files:", error_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            data: filteredFiles,
                            status: 200,
                            message: "HRMSRecruitmentCandidateDetails fetched successfully",
                        }];
                    case 5:
                        error_11 = _b.sent();
                        console.error("Error fetching data HRMSRecruitmentCandidateDetails:", error_11);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data from HRMSRecruitmentCandidateDetails",
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        this.GetUserName = function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var listItems, UserName, UserRoleName, error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSageList,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "EmailId",
                                        Operator: "eq",
                                        FilterValue: email,
                                    },
                                ],
                            })];
                    case 1:
                        listItems = _a.sent();
                        UserName = listItems.find(function (emp) {
                            var _a;
                            return ((_a = emp.EmailId) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (email === null || email === void 0 ? void 0 : email.toLowerCase());
                        });
                        UserRoleName = "".concat((UserName === null || UserName === void 0 ? void 0 : UserName.FirstName) || "", " ").concat((UserName === null || UserName === void 0 ? void 0 : UserName.MiddleName) || "", " ").concat((UserName === null || UserName === void 0 ? void 0 : UserName.LastName) || "");
                        return [2 /*return*/, {
                                data: UserRoleName,
                                status: 200,
                                message: "ADGroups retrieved successfully",
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error fetching user ID by email: ", error_12);
                        // Return null in case of an error
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error getting ADGroups",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    CommonService.prototype.GetGradeLevel = function (PatersonGrade) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var op_1, error_13;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        op_1 = [];
                        if (!PatersonGrade) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                //Expand: "RoleId,Department,Status,Action",
                                Filter: [
                                    {
                                        FilterKey: "PatersonGrade",
                                        Operator: "eq",
                                        FilterValue: PatersonGrade,
                                    },
                                ],
                            }).then(function (data) {
                                op_1 = data.map(function (item) { return ({
                                    Level: item.Levels,
                                }); });
                                // console.log("data HRMSGradeMaster", op);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            data: op_1,
                            status: 200,
                            message: "HRMSGradeMaster Fetched successfully",
                        }];
                    case 3:
                        error_13 = _a.sent();
                        console.error("Error HRMSGradeMaster:", error_13);
                        throw error_13;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CommonService.prototype.PostCommanDataInsert = function (obj, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_14;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: ListName,
                                RequestJSON: obj,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: 200,
                                message: "Data Submitted successfully",
                            }];
                    case 2:
                        error_14 = _a.sent();
                        console.error("Error posting user data:", error_14);
                        return [2 /*return*/, {
                                data: null,
                                status: 400,
                                message: "Error On Posting Data",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CommonService;
}());
exports.default = CommonService;
function getUserGuidByEmail(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sp, user, listItems, UserName, error_15;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    sp = (0, spservice_1.getSP)();
                    return [4 /*yield*/, sp.web.siteUsers.getByEmail(email)()];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSSageList,
                            Select: "*",
                            Filter: [
                                {
                                    FilterKey: "EmailId",
                                    Operator: "eq",
                                    FilterValue: email,
                                },
                            ],
                            FilterCondition: "and",
                        })];
                case 2:
                    listItems = _a.sent();
                    UserName = listItems.find(function (emp) {
                        var _a;
                        return ((_a = emp.EmailId) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (email === null || email === void 0 ? void 0 : email.toLowerCase());
                    });
                    // console.log(UserName, "UserName");
                    return [2 /*return*/, {
                            key: user.Id,
                            text: "".concat((UserName === null || UserName === void 0 ? void 0 : UserName.FirstName) || "", " ").concat((UserName === null || UserName === void 0 ? void 0 : UserName.MiddleName) || "", " ").concat((UserName === null || UserName === void 0 ? void 0 : UserName.LastName) || ""),
                        }];
                case 3:
                    error_15 = _a.sent();
                    console.error("Error fetching user ID by email: ", error_15);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=CommanService.js.map