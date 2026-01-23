import { initiateLaborHire, UpsertBGV } from "../../Models/ApIInterface"

export type ILaborHireService = {
    initiateLaborHire(data: initiateLaborHire): Promise<ApiResponse<any | null>>;
    CheckBGVerification(JobRequestId: number): Promise<ApiResponse<any | null>>
    InitiateBGVProcess(id: number): Promise<ApiResponse<any | null>>;
    UpsertBGVJobMaster(UpsertData: UpsertBGV[]): Promise<ApiResponse<any | null>>;
    GetBGVerificationType(): Promise<ApiResponse<any | null>>;
    UpdateBGVerification(id: number): Promise<ApiResponse<any | null>>;
    PerformCriminalRecordCheck(id: number): Promise<ApiResponse<any | null>>;
}