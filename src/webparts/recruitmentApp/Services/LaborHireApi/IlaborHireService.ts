import { initiateLaborHire } from "../../Models/ApIInterface"

export type ILaborHireService = {
    initiateLaborHire(data: initiateLaborHire): Promise<ApiResponse<any | null>>;
}