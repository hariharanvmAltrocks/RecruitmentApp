"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ApiConfig_1 = require("../../utilities/ApiConfig");
var Config_1 = require("../../utilities/Config");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var MasterService = /** @class */ (function () {
    function MasterService() {
    }
    MasterService.prototype.userRole = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getjsonUserRole, items, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        getjsonUserRole = {
                            Listname: Config_1.ListNames.HRMSRecruitmentUserRole,
                            Select: "*",
                        };
                        return [4 /*yield*/, spservice_1.default.SPReadItems(getjsonUserRole)];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, {
                                data: items,
                                status: ApiConfig_1.ResponeStatus.SUCCESS,
                                message: "Data Fetched Success",
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.log("userRole error", error_1);
                        return [2 /*return*/, {
                                data: undefined,
                                status: ApiConfig_1.ResponeStatus.FAILED,
                                message: "Data Fetched Failed",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // async MasterData(EmailId: string, RoleID: number[], UserName: string, UserRole: string[]): Promise<MasterDataResponseDetails> {
    //     try {
    //         const masterData: MasterData = {
    //             EmployeeList: [],
    //             EmployeeOption: [],
    //             PatersonGradeList: [],
    //             DrcGradeList: [],
    //             StatusList: [],
    //             userDetails: [],
    //             BusinessUnitCode: [],
    //             BusinessUnitCodeAllColumn: [],
    //             JobInEnglishList: [],
    //             JobInFrenchList: [],
    //             Department: [],
    //             AllSubDepartmentList: [],
    //             SectionList: [],
    //             DepartmentCodeList: [],
    //             BuCodeToDepartmentMappingList: [],
    //             CompanyCodeDetailsList: [],
    //             CurrentUserEmailId: EmailId,
    //             CurrentRoleID: RoleID,
    //             CurrentUserName: UserName,
    //             CurrentUserRole: UserRole,
    //             menuMartixData: [],
    //             TabDetails: [],
    //             CurrentMenuID: 0,
    //         };
    //         await SPServices.SPReadItems({
    //             Listname: ListNames.HRMSSageList,
    //             Select:
    //                 "*,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,Department/DepartmentName,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
    //             Expand:
    //                 "PatersonGrade,DRCGrade,Department,JobTitleInEnglish,JobTitleInFrench",
    //             PageCount: count.Topcount,
    //             Orderby: "ID",
    //             Orderbydecorasc: true,
    //         })
    //             .then(async (items) => {
    //                 items.forEach((item:any) => {
    //                     masterData.EmployeeList.push({
    //                         key: item?.ID,
    //                         text: item?.IdentityNo,
    //                         FirstName: item?.FirstName,
    //                         LastName: item?.LastName,
    //                         MiddleName: item?.MiddleName,
    //                         PatersonGrade: item?.PatersonGrade ? item?.PatersonGrade?.PatersonGrade : "",
    //                         DrcGrade: item?.DRCGrade ? item.DRCGrade?.DRCGrade : "",
    //                         JobTitle: item?.JobTitleInEnglish ? item?.JobTitleInEnglish?.JobTitleInEnglish : "",
    //                         JobTitleInFrench: item?.JobTitleInFrench ? item?.JobTitleInFrench?.JobTitleInFrench : "",
    //                         BusinessUnitCode: item?.BusinessUnitCode,
    //                         NumberOfServiceYears: item?.NumberOfServiceYears,
    //                         Department: item?.Department ? item?.Department?.DepartmentName : "",
    //                         Email: item?.EmailId,
    //                         homeAddressEmployee: item?.HomeAddress,
    //                         businessAddressEmployee: item?.BusinessAddress,
    //                         contactNumberEmployee: item?.ContactNumber,
    //                     });
    //                     masterData.EmployeeOption.push({
    //                         key: item?.ID,
    //                         text: item?.IdentityNo,
    //                     });
    //                 });
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSSageList}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSGradeMaster,
    //                 Select: "*",
    //                 Orderby: "PatersonGrade",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (objGradedata) => {
    //                 await objGradedata.forEach((item) => {
    //                     masterData.PatersonGradeList.push({
    //                         key: item?.ID,
    //                         text: item?.PatersonGrade,
    //                     });
    //                     masterData.DrcGradeList.push({
    //                         key: item?.ID,
    //                         text: item?.DRCGrade,
    //                     });
    //                 })
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSGradeMaster}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSStatus,
    //                 Select: "*",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (items) => {
    //                 await items.forEach((item) => {
    //                     masterData.StatusList.push({
    //                         key: item?.ID,
    //                         text: item?.StatusDescription,
    //                     });
    //                 })
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSStatus}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPReadItems({
    //             Listname: ListNames.HRMSSageList,
    //             Select:
    //                 "*,Department/DepartmentName,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,BusinessUnit/BusineesUnitCode",
    //             Expand:
    //                 "Department,PatersonGrade,DRCGrade,JobTitleInEnglish,JobTitleInFrench,BusinessUnit",
    //             Filter: [
    //                 {
    //                     FilterKey: "EmailId",
    //                     Operator: "eq",
    //                     FilterValue: EmailId,
    //                 },
    //             ],
    //         })
    //             .then(async (res) => {
    //                 if (res.length > 0) {
    //                     const response = res[0];
    //                     const UserDetails = {
    //                         ID: response?.ID,
    //                         EmailId: response?.EmailId,
    //                         DepartmentId: response?.DepartmentId,
    //                         CurrentPosition: response?.CurrentPosition,
    //                         DepartmentName: response?.Department
    //                             ? response.Department?.DepartmentName
    //                             : "",
    //                         //  EmployeeName: ` ${response.FirstName} ${response.MiddleName} ${response.LastName} `,
    //                         FirstName: response?.FirstName,
    //                         MiddleName: response?.MiddleName,
    //                         LastName: response?.LastName,
    //                         JopTitleEnglish: response?.JobTitleInEnglish
    //                             ? response?.JobTitleInEnglish?.JobTitleInEnglish
    //                             : "",
    //                         JopTitleFrench: response?.JobTitleInFrench
    //                             ? response?.JobTitleInFrench?.JobTitleInFrench
    //                             : "",
    //                         PatersonGrade: response?.PatersonGrade?.PatersonGrade,
    //                         DRCGrade: response?.DRCGrade?.DRCGrade,
    //                         BusinessAddress: response?.BusinessAddress,
    //                         HomeAddress: response?.HomeAddress,
    //                         ContactNumber: response?.ContactNumber,
    //                         BusinessUnitCode:
    //                             response?.BusinessUnit?.BusineesUnitCode ? response?.BusinessUnit?.BusineesUnitCode : "",
    //                         BusinessUnitID: response?.BusinessUnitId,
    //                     };
    //                     masterData.userDetails.push(UserDetails)
    //                 }
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSSageList}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSJobTitleMaster,
    //                 Select: "*,JobTitleInFrench/JobTitleInFrench",
    //                 Expand: "JobTitleInFrench",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (items) => {
    //                 await items.forEach((item) => {
    //                     masterData.JobInEnglishList.push({
    //                         key: item?.ID,
    //                         text: item?.JobTitleInEnglish,
    //                         JobCode: item?.JobCode,
    //                     });
    //                     masterData.JobInFrenchList = items.flatMap((item: any) =>
    //                         item.JobTitleInFrench.length > 1
    //                             ? item.JobTitleInFrench.map((fr: any) => ({
    //                                 key: item.ID,
    //                                 text: fr.JobTitleInFrench,
    //                                 JobCode: item.JobCode,
    //                             }))
    //                             : [{
    //                                 key: item.ID,
    //                                 text: item.JobTitleInFrench[0]?.JobTitleInFrench,
    //                                 JobCode: item.JobCode,
    //                             }]
    //                     );
    //                 });
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSJobTitleMaster}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.BusinessUnitMaster,
    //                 Select: "*,Activity/Activity",
    //                 Expand: "Activity",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (items) => {
    //                 await items.forEach((item) => {
    //                     masterData.BusinessUnitCode.push({
    //                         key: item?.ID,
    //                         text: item?.BusineesUnitCode,
    //                     })
    //                     masterData.BusinessUnitCodeAllColumn.push({
    //                         key: item?.ID,
    //                         text: item?.BusineesUnitCode,
    //                         Name: item?.BUCName,
    //                         Description: item?.BUCDescription,
    //                         Activity: item?.Activity
    //                             ? item?.Activity?.Activity
    //                             : "",
    //                     })
    //                 })
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.BusinessUnitMaster}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPReadItems({
    //             Listname: ListNames.HRMSDepartment,
    //             Select: "*",
    //             Filter: [
    //                 {
    //                     FilterKey: "IsActive",
    //                     Operator: "eq",
    //                     FilterValue: 1,
    //                 },
    //             ],
    //         })
    //             .then(async (res) => {
    //                 if (res.length > 0) {
    //                     res.map((item) => {
    //                         masterData.Department.push({
    //                             key: item.Id ? item.Id : "",
    //                             text: item?.DepartmentName ? item?.DepartmentName : "",
    //                             code: item?.Code ? item?.Code : ""
    //                         })
    //                     })
    //                 }
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSDepartment}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPReadItems({
    //             Listname: ListNames.HRMSSubDepartment,
    //             Select:
    //                 "*,Department/DepartmentName",
    //             Expand:
    //                 "Department",
    //         })
    //             .then(async (res) => {
    //                 if (res.length > 0) {
    //                     res.map((item) => {
    //                         masterData.AllSubDepartmentList.push({
    //                             key: item?.Id,
    //                             DepartmentId: item?.DepartmentId,
    //                             DepartmentName: item?.Department
    //                                 ? item?.Department?.DepartmentName
    //                                 : "",
    //                             text: item?.SubDepTitle,
    //                         })
    //                     })
    //                 }
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSSubDepartment}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSSectionMaster,
    //                 Select: "*,SubDepartmentID/SubDepTitle",
    //                 Expand: "SubDepartmentID",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount,
    //                 Filter: [
    //                     {
    //                         FilterKey: "IsActive",
    //                         Operator: "eq",
    //                         FilterValue: "Yes",
    //                     },
    //                 ],
    //             }
    //         )
    //             .then(async (Sectionitem) => {
    //                 await Sectionitem.forEach((item) => {
    //                     masterData.SectionList.push({
    //                         key: item?.ID,
    //                         text: item?.SectionName,
    //                         SubDepartmentId: item?.SubDepartmentIDId,
    //                         SubDepartmentName: item?.SubDepartmentID
    //                             ? item?.SubDepartmentID?.SubDepTitle
    //                             : "",
    //                     })
    //                 })
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSSectionMaster}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSSectionToDptCodeMapping,
    //                 Select: "*,Section/SectionName",
    //                 Expand: "Section",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount,
    //             }
    //         )
    //             .then(async (SectionToDptCodeItem) => {
    //                 await SectionToDptCodeItem.forEach((item) => {
    //                     masterData.DepartmentCodeList.push({
    //                         key: item?.ID,
    //                         text: item?.DptCode,
    //                         SectionId: item?.SectionId,
    //                         SectionName: item?.Section
    //                             ? item?.Section?.SectionName
    //                             : "",
    //                     });
    //                 })
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSSectionToDptCodeMapping}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSBUCToDepartmentMapping,
    //                 Select: "*,BUC/BusineesUnitCode,Department/DepartmentName",
    //                 Expand:
    //                     "BUC,Department",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (items) => {
    //                 await items.forEach(async (item) => {
    //                     masterData.BuCodeToDepartmentMappingList.push({
    //                         ID: item?.ID,
    //                         key: item?.BUCId,
    //                         text: item?.BUC.BusineesUnitCode ? item?.BUC?.BusineesUnitCode : "",
    //                         DepartmentId: item?.DepartmentId,
    //                         DepartmentName: item?.Department
    //                             ? item?.Department?.DepartmentName
    //                             : "",
    //                         IsWLCreatedAndConsolidated: item?.IsWLCreatedAndConsolidated,
    //                     });
    //                 });
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSBUCToDepartmentMapping}:`,
    //                     error
    //                 );
    //             });
    //         await SPServices.SPGetItems(
    //             {
    //                 Listname: ListNames.HRMSCompanyCodeDetails,
    //                 Select: "*",
    //                 Orderby: "ID",
    //                 Orderbydecorasc: true,
    //                 PageCount: count.Topcount
    //             }
    //         )
    //             .then(async (array) => {
    //                 await array.forEach(async (item) => {
    //                     masterData.CompanyCodeDetailsList.push({
    //                         key: item?.ID,
    //                         CompanyCode: item?.CompanyCode,
    //                         CompanyName: item?.CompanyName,
    //                         EmployeeIdPrefix: item?.EmployeeIdPrefix,
    //                     });
    //                 });
    //             }).catch((error) => {
    //                 console.error(
    //                     `Error fetching data from ${ListNames.HRMSBUCToDepartmentMapping}:`,
    //                     error
    //                 );
    //             });
    //         return {
    //             data: masterData,
    //             status: ResponeStatus.SUCCESS,
    //             message: "Data Fetched Success",
    //         };
    //     } catch (error) {
    //         console.log("userRole error", error);
    //         return {
    //             data: undefined,
    //             status: ResponeStatus.FAILED,
    //             message: "Data Fetched Failed",
    //         };
    //     }
    // }
    MasterService.prototype.GetCareerPortalIntergLink = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitmentCareerPortalLink,
                                Select: "*",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Topcount: ApiConfig_1.count.Topcount,
                            })];
                    case 1:
                        res = _a.sent();
                        GridResult = {
                            CareerPortalLink: "",
                            MeetingUrl: "",
                            MeetingCode: ""
                        };
                        if (res.length > 0) {
                            res.map(function (item) {
                                GridResult = {
                                    CareerPortalLink: item === null || item === void 0 ? void 0 : item.CareerPortalLink,
                                    MeetingUrl: item === null || item === void 0 ? void 0 : item.MeetingUrl,
                                    MeetingCode: item === null || item === void 0 ? void 0 : item.MeetingCode
                                };
                                return GridResult;
                            });
                        }
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching data in GetRecruitmentDetails:", error_2);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching data from GetRecruitmentDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MasterService.prototype.GetTabDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentTabMaster,
                                Select: "*",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Topcount: ApiConfig_1.count.Topcount,
                            })];
                    case 1:
                        res = _a.sent();
                        GridResult = {
                            ID: 0,
                            LabeName: ""
                        };
                        if (res.length > 0) {
                            res.map(function (item) {
                                GridResult = {
                                    ID: item.ID,
                                    LabeName: item.TabName
                                };
                                return GridResult;
                            });
                        }
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error fetching data in GetRecruitmentDetails:", error_3);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching data from GetRecruitmentDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MasterService.prototype.GetUserDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GridResult = {
                            ID: 0,
                            EmailId: "",
                            DepartmentId: 0,
                            CurrentPosition: "",
                            DepartmentName: "",
                            FirstName: "",
                            MiddleName: "",
                            LastName: "",
                            JopTitleEnglish: "",
                            JopTitleFrench: "",
                            DRCGrade: "",
                            PatersonGrade: "",
                            BusinessAddress: "",
                            HomeAddress: "",
                            ContactNumber: "",
                            BusinessUnitCode: "",
                            BusinessUnitID: 0,
                            Nationality: ""
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSageList,
                                Select: "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,Department/DepartmentName,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade",
                                Expand: "JobTitleInEnglish,JobTitleInFrench,Department,PatersonGrade,DRCGrade",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Topcount: ApiConfig_1.count.Topcount,
                            })];
                    case 2:
                        res = _a.sent();
                        if (res.length > 0) {
                            res.map(function (item) {
                                var _a, _b, _c, _d, _e;
                                GridResult = {
                                    ID: item.ID,
                                    EmailId: item.EmailId,
                                    DepartmentId: item.DepartmentId,
                                    CurrentPosition: item.CurrentPosition,
                                    DepartmentName: (_a = item.Department) === null || _a === void 0 ? void 0 : _a.DepartmentName,
                                    FirstName: item.FirstName,
                                    MiddleName: item.MiddleName,
                                    LastName: item.LastName,
                                    JopTitleEnglish: (_b = item.JobTitleInEnglish) === null || _b === void 0 ? void 0 : _b.JobTitleInEnglish,
                                    JopTitleFrench: (_c = item.JobTitleInFrench) === null || _c === void 0 ? void 0 : _c.JobTitleInFrench,
                                    DRCGrade: (_d = item.DRCGrade) === null || _d === void 0 ? void 0 : _d.DRCGrade,
                                    PatersonGrade: (_e = item.PatersonGrade) === null || _e === void 0 ? void 0 : _e.PatersonGrade,
                                    BusinessAddress: item.BusinessAddress,
                                    HomeAddress: item.HomeAddress,
                                    ContactNumber: item.ContactNumber,
                                    BusinessUnitCode: item.BusinessUnitCode,
                                    BusinessUnitID: item.BusinessUnitID,
                                    Nationality: item.Nationality
                                };
                                return GridResult;
                            });
                        }
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error fetching data in GetRecruitmentDetails:", error_4);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching data from GetRecruitmentDetails",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MasterService.prototype.GetGradeLevel = function (gradeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult_1, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        GridResult_1 = {
                            GradeLevel: ""
                        };
                        if (!gradeId) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "DRCGrade",
                                        Operator: "eq",
                                        FilterValue: gradeId,
                                    },
                                ],
                            }).then(function (data) {
                                GridResult_1 = data[0].Levels;
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            data: GridResult_1,
                            status: 200,
                            message: "GetRecruitmentDetails fetched successfully",
                        }];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error fetching data in GetRecruitmentDetails:", error_5);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching data from GetRecruitmentDetails",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MasterService.prototype.GetJobUniqueDataValue = function (JobCodeId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult_2, portalItems, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        GridResult_2 = {
                            JobCode: ""
                        };
                        if (!JobCodeId) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Select: "*,JobCode/JobCode",
                                Filter: [{ FilterKey: "JobCodeId", Operator: "in", FilterValue: JobCodeId }],
                                FilterCondition: "and",
                                Expand: "JobCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            }).then(function (data) {
                                GridResult_2 = data && data.length > 0 ? {
                                    JobCode: data[0].JobUniqueKey
                                } : { JobCode: "" };
                            })];
                    case 1:
                        portalItems = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, {
                            data: GridResult_2,
                            status: 200,
                            message: "GetRecruitmentDetails fetched successfully",
                        }];
                    case 3:
                        error_6 = _a.sent();
                        console.error("Error fetching data in GetRecruitmentDetails:", error_6);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching data from GetRecruitmentDetails",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MasterService.prototype.GetAllMaster = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetAllMasterData, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.postAdveDetails.getMastersByCategory(id)];
                    case 1:
                        response = _a.sent();
                        GetAllMasterData = response.data.data.map(function (item) { return ({
                            id: item.id,
                            value: item.value,
                            displayText: item.displayText,
                            displayTextFr: item.displayText_fr,
                        }); });
                        // console.log(GetAllMasterData, "GetAllMasterData");
                        return [2 /*return*/, {
                                data: GetAllMasterData,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error Get Candidate details:", error_7);
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
    MasterService.prototype.GetCountryMaster = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetAllMasterData, error_8;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetStateByCountryApi.GetCountryApi()];
                    case 1:
                        response = _c.sent();
                        GetAllMasterData = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (item) { return ({
                            id: item.isdcode,
                            code: item.countryCode,
                            text: item.countryName,
                        }); });
                        // console.log(GetAllMasterData, "GetCountryMaster");
                        return [2 /*return*/, {
                                data: GetAllMasterData,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_8 = _c.sent();
                        console.error("Error Get Candidate details:", error_8);
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
    return MasterService;
}());
exports.default = MasterService;
//# sourceMappingURL=MasterService.js.map