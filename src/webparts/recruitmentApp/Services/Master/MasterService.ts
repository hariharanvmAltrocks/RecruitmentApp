import { MasterData, MasterDataResponseDetails, UserRoleResponseDetails } from "../../Models/Master";
import { IMasterService } from "./IMasterService";
import { count, ListNames, ResponeStatus } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";




export default class MasterService implements IMasterService {

    async userRole(): Promise<UserRoleResponseDetails> {
        try {
            const getjsonUserRole = {
                Listname: ListNames.HRMSUserRole,
                Select: "*",
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
            return {
                data: items,
                status: ResponeStatus.SUCCESS,
                message: "Data Fetched Success",
            };
        } catch (error) {
            console.log("userRole error", error);
            return {
                data: undefined,
                status: ResponeStatus.FAILED,
                message: "Data Fetched Failed",
            };
        }
    }

    async MasterData(EmailId: string, RoleID: number, UserName: string, UserRole: string): Promise<MasterDataResponseDetails> {
        try {
            const masterData: MasterData = {
                EmployeeList: [],
                EmployeeOption: [],
                PatersonGradeList: [],
                DrcGradeList: [],
                StatusList: [],
                userDetails: [],
                BusinessUnitCode: [],
                BusinessUnitCodeAllColumn: [],
                JobInEnglishList: [],
                JobInFrenchList: [],
                Department: [],
                AllSubDepartmentList: [],
                SectionList: [],
                DepartmentCodeList: [],
                BuCodeToDepartmentMappingList: [],
                CompanyCodeDetailsList: [],
                CurrentUserEmailId: EmailId,
                CurrentRoleID: RoleID,
                CurrentUserName: UserName,
                CurrentUserRole: UserRole

            };
            await SPServices.SPReadItems({
                Listname: ListNames.HRMSSageList,
                Select:
                    "*,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,Department/DepartmentName,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
                Expand:
                    "PatersonGrade,DRCGrade,Department,JobTitleInEnglish,JobTitleInFrench",
                PageCount: count.Topcount,
                Orderby: "ID",
                Orderbydecorasc: true,
            })
                .then(async (items) => {
                    items.forEach((item) => {
                        masterData.EmployeeList.push({
                            key: item?.ID,
                            text: item?.IdentityNo,
                            FirstName: item?.FirstName,
                            LastName: item?.LastName,
                            MiddleName: item?.MiddleName,
                            PatersonGrade: item?.PatersonGrade ? item?.PatersonGrade?.PatersonGrade : "",
                            DrcGrade: item?.DRCGrade ? item.DRCGrade?.DRCGrade : "",
                            JobTitle: item?.JobTitleInEnglish ? item?.JobTitleInEnglish?.JobTitleInEnglish : "",
                            JobTitleInFrench: item?.JobTitleInFrench ? item?.JobTitleInFrench?.JobTitleInFrench : "",
                            BusinessUnitCode: item?.BusinessUnitCode,
                            NumberOfServiceYears: item?.NumberOfServiceYears,
                            Department: item?.Department ? item?.Department?.DepartmentName : "",
                            Email: item?.EmailId,
                            homeAddressEmployee: item?.HomeAddress,
                            businessAddressEmployee: item?.BusinessAddress,
                            contactNumberEmployee: item?.ContactNumber,
                        });

                        masterData.EmployeeOption.push({
                            key: item?.ID,
                            text: item?.IdentityNo,
                        });
                    });
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSSageList}:`,
                        error
                    );
                });
            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSGradeMaster,
                    Select: "*",
                    Orderby: "PatersonGrade",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (objGradedata) => {
                    await objGradedata.forEach((item) => {
                        masterData.PatersonGradeList.push({
                            key: item?.ID,
                            text: item?.PatersonGrade,
                        });
                        masterData.DrcGradeList.push({
                            key: item?.ID,
                            text: item?.DRCGrade,
                        });
                    })
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSGradeMaster}:`,
                        error
                    );
                });
            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSStatus,
                    Select: "*",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (items) => {
                    await items.forEach((item) => {
                        masterData.StatusList.push({
                            key: item?.ID,
                            text: item?.StatusDescription,
                        });
                    })
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSStatus}:`,
                        error
                    );
                });
            await SPServices.SPReadItems({
                Listname: ListNames.HRMSSageList,
                Select:
                    "*,Department/DepartmentName,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,BusinessUnit/BusineesUnitCode",
                Expand:
                    "Department,PatersonGrade,DRCGrade,JobTitleInEnglish,JobTitleInFrench,BusinessUnit",

                Filter: [
                    {
                        FilterKey: "EmailId",
                        Operator: "eq",
                        FilterValue: EmailId,
                    },
                ],
            })
                .then(async (res) => {
                    if (res.length > 0) {
                        const response = res[0];
                        const UserDetails = {
                            ID: response?.IdentityNo,
                            EmailId: response?.EmailId,
                            DepartmentId: response?.DepartmentId,
                            CurrentPosition: response?.CurrentPosition,
                            DepartmentName: response?.Department
                                ? response.Department?.DepartmentName
                                : "",
                            //  EmployeeName: ` ${response.FirstName} ${response.MiddleName} ${response.LastName} `,
                            FirstName: response?.FirstName,
                            MiddleName: response?.MiddleName,
                            LastName: response?.LastName,
                            JopTitleEnglish: response?.JobTitleInEnglish
                                ? response?.JobTitleInEnglish?.JobTitleInEnglish
                                : "",
                            JopTitleFrench: response?.JobTitleInFrench
                                ? response?.JobTitleInFrench?.JobTitleInFrench
                                : "",
                            PatersonGrade: response?.PatersonGrade?.PatersonGrade,
                            DRCGrade: response?.DRCGrade?.DRCGrade,

                            BusinessAddress: response?.BusinessAddress,
                            HomeAddress: response?.HomeAddress,
                            ContactNumber: response?.ContactNumber,
                            BusinessUnitCode:
                                response?.BusinessUnit?.BusineesUnitCode ? response?.BusinessUnit?.BusineesUnitCode : "",
                            BusinessUnitID: response?.BusinessUnitId,
                        };
                        masterData.userDetails.push(UserDetails)
                    }
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSSageList}:`,
                        error
                    );
                });

            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSJobTitleMaster,
                    Select: "*",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (items) => {
                    await items.forEach((item) => {
                        masterData.JobInEnglishList.push({
                            key: item?.ID,
                            text: item?.JobTitleInEnglish,
                            JobCode: item?.JobCode,
                        });

                        masterData.JobInFrenchList.push({
                            key: item?.ID,
                            text: item?.JobTitleInFrench,
                            JobCode: item?.JobCode,
                        });
                    });
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSJobTitleMaster}:`,
                        error
                    );
                });

            await SPServices.SPGetItems(
                {
                    Listname: ListNames.BusinessUnitMaster,
                    Select: "*,Activity/Activity",
                    Expand: "Activity",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (items) => {
                    await items.forEach((item) => {
                        masterData.BusinessUnitCode.push({
                            key: item?.ID,
                            text: item?.BusineesUnitCode,
                        })
                        masterData.BusinessUnitCodeAllColumn.push({
                            key: item?.ID,
                            text: item?.BusineesUnitCode,
                            Name: item?.BUCName,
                            Description: item?.BUCDescription,
                            Activity: item?.Activity
                                ? item?.Activity?.Activity
                                : "",
                        })

                    })
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.BusinessUnitMaster}:`,
                        error
                    );
                });

            await SPServices.SPReadItems({
                Listname: ListNames.HRMSDepartment,
                Select: "*",
                Filter: [
                    {
                        FilterKey: "IsActive",
                        Operator: "eq",
                        FilterValue: 1,
                    },
                ],
            })
                .then(async (res) => {

                    if (res.length > 0) {
                        res.map((item) => {
                            masterData.Department.push({
                                key: item.Id ? item.Id : "",
                                text: item?.DepartmentName ? item?.DepartmentName : "",
                            })
                        })
                    }
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSDepartment}:`,
                        error
                    );
                });

            await SPServices.SPReadItems({
                Listname: ListNames.HRMSSubDepartment,
                Select:
                    "*,Department/DepartmentName",
                Expand:
                    "Department",
            })
                .then(async (res) => {
                    if (res.length > 0) {
                        res.map((item) => {
                            masterData.AllSubDepartmentList.push({
                                key: item?.Id,
                                DepartmentId: item?.DepartmentId,
                                DepartmentName: item?.Department
                                    ? item?.Department?.DepartmentName
                                    : "",
                                text: item?.SubDepTitle,
                            })
                        })
                    }
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSSubDepartment}:`,
                        error
                    );
                });

            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSSectionMaster,
                    Select: "*,SubDepartmentID/SubDepTitle",
                    Expand: "SubDepartmentID",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount,
                    Filter: [
                        {
                            FilterKey: "IsActive",
                            Operator: "eq",
                            FilterValue: "Yes",
                        },
                    ],
                }
            )
                .then(async (Sectionitem) => {
                    await Sectionitem.forEach((item) => {
                        masterData.SectionList.push({
                            key: item?.ID,
                            text: item?.SectionName,
                            SubDepartmentId: item?.SubDepartmentIDId,
                            SubDepartmentName: item?.SubDepartmentID
                                ? item?.SubDepartmentID?.SubDepTitle
                                : "",
                        })
                    })
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSSectionMaster}:`,
                        error
                    );
                });

            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSSectionToDptCodeMapping,
                    Select: "*,Section/SectionName",
                    Expand: "Section",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount,
                }
            )
                .then(async (SectionToDptCodeItem) => {

                    await SectionToDptCodeItem.forEach((item) => {
                        masterData.DepartmentCodeList.push({
                            key: item?.ID,
                            text: item?.DptCode,
                            SectionId: item?.SectionId,
                            SectionName: item?.Section
                                ? item?.Section?.SectionName
                                : "",
                        });
                    })
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSSectionToDptCodeMapping}:`,
                        error
                    );
                });

            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSBUCToDepartmentMapping,
                    Select: "*,BUC/BusineesUnitCode,Department/DepartmentName",
                    Expand:
                        "BUC,Department",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (items) => {
                    await items.forEach(async (item) => {
                        masterData.BuCodeToDepartmentMappingList.push({
                            ID: item?.ID,
                            key: item?.BUCId,
                            text: item?.BUC.BusineesUnitCode ? item?.BUC?.BusineesUnitCode : "",
                            DepartmentId: item?.DepartmentId,
                            DepartmentName: item?.Department
                                ? item?.Department?.DepartmentName
                                : "",
                            IsWLCreatedAndConsolidated: item?.IsWLCreatedAndConsolidated,
                        });

                    });
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSBUCToDepartmentMapping}:`,
                        error
                    );
                });
            await SPServices.SPGetItems(
                {
                    Listname: ListNames.HRMSCompanyCodeDetails,
                    Select: "*",
                    Orderby: "ID",
                    Orderbydecorasc: true,
                    PageCount: count.Topcount
                }
            )
                .then(async (array) => {

                    await array.forEach(async (item) => {
                        masterData.CompanyCodeDetailsList.push({
                            key: item?.ID,
                            CompanyCode: item?.CompanyCode,
                            CompanyName: item?.CompanyName,
                            EmployeeIdPrefix: item?.EmployeeIdPrefix,

                        });

                    });
                }).catch((error) => {
                    console.error(
                        `Error fetching data from ${ListNames.HRMSBUCToDepartmentMapping}:`,
                        error
                    );
                });

            return {
                data: masterData,
                status: ResponeStatus.SUCCESS,
                message: "Data Fetched Success",
            };

        } catch (error) {
            console.log("userRole error", error);
            return {
                data: undefined,
                status: ResponeStatus.FAILED,
                message: "Data Fetched Failed",
            };
        }
    }



}