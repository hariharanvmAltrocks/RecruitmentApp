import { BGVStatus, initiateLaborHire } from "../../Models/ApIInterface"

export type ILaborHireService = {
    initiateLaborHire(data: initiateLaborHire): Promise<ApiResponse<any | null>>;
    CheckBGVerification(data: BGVStatus): Promise<ApiResponse<any | null>>;
    InitiateBGVProcess(id: number): Promise<ApiResponse<any | null>>;
}