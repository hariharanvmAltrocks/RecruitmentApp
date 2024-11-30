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
            console.log("UserRoleData", items);

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

    async MasterData(EmailId: any, UserRole: number): Promise<MasterDataResponseDetails> {
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
                .then(async (items: any) => {
                    console.log(items);
                    items.forEach((item: any) => {
                        console.log(item);

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
                .then(async (objGradedata: any) => {
                    await objGradedata.forEach((item: any) => {
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
                .then(async (items: any) => {
                    await items.forEach((item: any) => {
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
                .then(async (res: any) => {
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
                .then(async (items: any) => {
                    await items.forEach((item: any) => {
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
                .then(async (items: any) => {
                    await items.forEach((item: any) => {
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
                .then(async (res: any) => {

                    if (res.length > 0) {
                        res.map((item: any) => {
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
                .then(async (res: any) => {
                    if (res.length > 0) {
                        res.map((item: any) => {
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
                .then(async (Sectionitem: any) => {
                    await Sectionitem.forEach((item: any) => {
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
                .then(async (SectionToDptCodeItem: any) => {

                    await SectionToDptCodeItem.forEach((item: any) => {
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
                .then(async (items: any) => {
                    await items.forEach(async (item: any) => {
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
                .then(async (array: any) => {

                    await array.forEach(async (item: any) => {
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