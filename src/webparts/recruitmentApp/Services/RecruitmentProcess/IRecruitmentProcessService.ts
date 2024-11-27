export type IRecruitmentService = {
    GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>;
}