export interface IAttachmentExampleState {
    file: File | any,
    fileName: string;
    fileContent: string | ArrayBuffer | null;
    serverRelativeUrl: string;
    ID: string;
 }
 

export type IRecruitmentService = {
    GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>;
    InsertRecruitmentDpt(Tabl1:any,Table2:any):Promise<ApiResponse<any | null>>;
    GetPositionDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>;
    GetRecruitmentDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>>;
    GetAttachedRoleProfile(indexID: any, DocLibrarayName: string): Promise<IAttachmentExampleState[]>;
}