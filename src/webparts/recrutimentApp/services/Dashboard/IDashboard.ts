import { ApiResponse } from "../../models/apimodels";
import { Metric } from "../../models/IDashboard";
import { BatchQuery } from "../SPService/Ispservice";

export type DataSyncToRecruitmentResponse = {
    ID: number,
    RecordID: number,
    BusinessUnitCode: string,
    BusinessUnitCodeId: number,
    BusinessUnitName: string;
    BusinessUnitDescription: string;
    Nationality: string,
    DepartmentId: number;
    Department: string,
    SubDepartment: string,
    SubDepartmentId: number,
    Section: string,
    SectionId: number,
    DepartmentCodeId: number,
    DepartmentCode: string,
    EmploymentCategory: string,
    TypeOfContract: string,
    NumberOfPersonNeeded: string,
    EnterNumberOfMonths: string,
    AreaofWork: string,
    DateRequried: Date | undefined,
    Type: string,
    Status: string,
    StatusId: number,
    Action: string,
    ActionTypeId: number,
    Location: string,

    JobCodeId: number,
    JobCode: string,
    JobTitleEnglish: string,
    JobTitleFrench: string,
    PatersonGrade: string,
    DRCGrade: string,
    JobTitleEnglishId: number,
    JobTitleFrenchId: number,
    PatersonGradeId: number,
    DRCGradeId: number,

    Checked: boolean,

    VacancyConfirmed: string;
    RecruitmentAuthorised: string;
    IsPayrollEmailed: string;
    AssignedHR: string;
    AssignedHRId: number;
    AssignLineManager: string;
    AssignLineManagerId: number;
    AssignHOD: string;
    ReasonForVacancy: string;

    JobPostingStartDate: string | undefined,
    JobPostingEndDate: string | undefined,
    JobPostingFirstExtensionEndDate: string | undefined,
    JobPostingSecondExtensionEndDate: string | undefined,

    AssignEMail: string,
    AssignHRLead?: string;
    QuestionByHR: string;
    QuestionByLM: string;
    JobAppliedCount: string;
    ReviewScoreCount?: string;
    ModifiedDate: string | undefined;
    CreatedDate: string | undefined
}

export type DashboardData = {
    ID: number,
    RecordID: number,
    BusinessUnitCode: string,
    Nationality: string,
    NumberOfPersonNeeded: string,
    Type: string,
    Status: string,
    StatusId: number,
    JobCode: string,
    JobTitleEnglish: string,
     ModifiedDate: string | undefined;
    CreatedDate: string | undefined
}

export type IDashboard = {
    GetRecruitmentDetails(
        filterParam: any,
        filterConditions: any,
    ): Promise<ApiResponse<DashboardData[]>>;
    GetDashboardCount(
        queries: BatchQuery[],
        CurrentRoleID: number[]
    ): Promise<ApiResponse<Metric[]>>;
    GetNPAEPVRRDetails(
      filterParam: any,
      filterConditions: any
    ): Promise<ApiResponse<DashboardData[]>>;
     GetCandidateDetails(
            filterParam: any,
            filterConditions: any
        ): Promise<ApiResponse<DashboardData[]>>;
        GetSelectedCandidate(
        filterParam: any,
        filterConditions: any
    ): Promise<ApiResponse<DashboardData[]>> ;
    

};