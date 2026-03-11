import moment from "moment";
import { TrackerRow } from "../../models";
import { ApiResponse } from "../../models/apimodels";
import { count, InOperator } from "../../utilities/ApiConfig";
import { ListNames } from "../../utilities/Config";
import SPServices from "../SPService/spservice";
import { DataSyncToRecruitmentResponse, IDashboard } from "./IDashboard";

export default class DashboardService implements IDashboard {

    async GetRecruitmentDetails(
        filterParam: any,
        filterConditions: any
    ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {

        try {

            const res: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                Select: `*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title`,
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
                Topcount: count.Topcount,
                Orderby: "ID",
                Orderbydecorasc: true
            });

            if (!res.length) {
                return {
                    data: [],
                    status: 200,
                    message: "No records found"
                };
            }

            /* -------------------------
               STEP 1 : Map main records
            --------------------------*/

            const GridResult: DataSyncToRecruitmentResponse[] = res.map((item: any, index: number) => ({
                ID: item.ID,
                RecordID: index + 1,

                BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode ?? "",
                BusinessUnitCodeId: item?.BusinessUnitCodeId ?? "",

                BusinessUnitName: "",
                BusinessUnitDescription: "",

                Nationality: item?.Nationality,
                Department: item?.Department?.DepartmentName ?? "",
                DepartmentId: item?.DepartmentId,

                SubDepartment: item?.SubDepartment?.SubDepTitle ?? "",
                SubDepartmentId: item?.SubDepartmentId,

                Section: item?.Section?.SectionName ?? "",
                SectionId: item?.SectionId,

                DepartmentCodeId: item?.DepartmentCodeId,
                DepartmentCode: item?.DepartmentCode?.DptCode ?? "",

                EmploymentCategory: item?.EmploymentCategory,
                TypeOfContract: item?.TypeOfContract,

                NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
                EnterNumberOfMonths: item?.EnterNumberOfMonths,

                AreaofWork: item?.AreaofWork,

                DateRequried: item?.DateRequried ?? "",

                Type: item?.DataFrom ?? "",

                Status: item?.Status?.StatusDescription ?? "",
                StatusId: item?.StatusId,

                Action: item?.Action?.Action ?? "",
                ActionTypeId: item?.ActionId ?? "",

                Location: item?.Location ?? "",

                JobCodeId: item?.JobCode?.ID ?? 0,
                JobCode: item?.JobCode?.JobCode ?? "",

                JobTitleEnglish: "",
                JobTitleFrench: "",
                PatersonGrade: "",
                DRCGrade: "",

                JobTitleEnglishId: 0,
                JobTitleFrenchId: 0,
                PatersonGradeId: 0,
                DRCGradeId: 0,

                Checked: false,

                VacancyConfirmed: item?.VacancyConfirmed ?? "",
                RecruitmentAuthorised: item?.RecruitmentAuthorised ?? "",
                IsPayrollEmailed: item?.IsPayrollEmailed ?? "",

                AssignedHR: "",
                AssignedHRId: 0,

                AssignLineManager: item?.LineManager ?? "",
                AssignLineManagerId: item?.AssignLineManagerId ?? 0,

                ReasonForVacancy: item?.ReasonForVacancy ?? "",

                JobPostingStartDate: item?.JobPostingStartDate ? moment(item.JobPostingStartDate).format("YYYY-MM-DD") : undefined,
                JobPostingEndDate: item?.JobPostingEndDate ? moment(item.JobPostingEndDate).format("YYYY-MM-DD") : undefined,
                JobPostingFirstExtensionEndDate: item?.JobPostingFirstExtensionEndDate ? moment(item.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD") : undefined,
                JobPostingSecondExtensionEndDate: item?.JobPostingSecondExtensionEndDate ? moment(item.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD") : undefined,

                AssignEMail: item?.AssignedHR,
                AssignHOD: item?.HOD,

                AssignHRLead: item?.RecruitmentHRLead ?? "",

                QuestionByHR: item?.QuestionByHR ?? "",
                QuestionByLM: item?.QuestionByLM ?? "",

                JobAppliedCount: "0",
                ReviewScoreCount: "0"
            }));


            /* -------------------------
               STEP 2 : Get Position Details
            --------------------------*/

            const ids = GridResult.map(x => x.ID);

            const idChunks = SPServices.ArraySpiltInOperator(ids, InOperator.arraysize);

            for (const chunk of idChunks) {

                const resdata: any[] = await SPServices.SPReadItems({
                    Listname: ListNames.HRMSRecruitmentPositionDetails,
                    Select: "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
                    Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
                    Filter: [{ FilterKey: "RecruitmentID", Operator: "in", FilterValue: chunk }],
                    Topcount: count.Topcount
                });


                /* -------------------------
                   STEP 3 : Create lookup map
                --------------------------*/

                const positionMap = new Map<number, any>();

                resdata.forEach((r: any) => {
                    positionMap.set(r.RecruitmentIDId, r);
                });


                /* -------------------------
                   STEP 4 : Merge data
                --------------------------*/

                GridResult.forEach(item => {

                    const pos = positionMap.get(item.ID);

                    if (!pos) return;

                    item.JobTitleEnglish = pos?.JobTitleEnglish?.JobTitleInEnglish ?? "";
                    item.JobTitleEnglishId = pos?.JobTitleEnglishId ?? 0;

                    item.JobTitleFrench = pos?.JobTitleFrench?.JobTitleInFrench ?? "";
                    item.JobTitleFrenchId = pos?.JobTitleFrenchId ?? 0;

                    item.PatersonGrade = pos?.PatersonGrade?.PatersonGrade ?? "";
                    item.PatersonGradeId = pos?.PatersonGradeId ?? 0;

                    item.DRCGrade = pos?.DRCGrade?.DRCGrade ?? "";
                    item.DRCGradeId = pos?.DRCGradeId ?? 0;

                });

            }

            return {
                data: GridResult,
                status: 200,
                message: "GetRecruitmentDetails fetched successfully"
            };

        } catch (error) {

            console.error("Error fetching data:", error);

            return {
                data: [],
                status: 500,
                message: "Error fetching data"
            };

        }
    }
};