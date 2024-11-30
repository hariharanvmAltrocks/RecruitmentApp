export type IRecruitmentService = {
    GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>;
    InsertRecruitmentDpt(Tabl1:any,Table2:any):Promise<ApiResponse<any | null>>;
    GetPositionDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>
}