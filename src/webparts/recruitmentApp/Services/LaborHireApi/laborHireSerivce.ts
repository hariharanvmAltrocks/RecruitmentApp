import { initiateLaborHire, UpsertBGV } from "../../Models/ApIInterface";
import { BGverification, LaborHire } from "../ReviewProfileService/ReviewCandidateService";
import { ILaborHireService } from "./IlaborHireService";

export default class LaborHireService implements ILaborHireService {

    async initiateLaborHire(data: initiateLaborHire): Promise<ApiResponse<any | null>> {
        try {
            const response = await LaborHire.initiateLaborHire(data);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }
    async InitiateBGVProcess(id: number): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.initiateBGVProcess(id);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

    async CheckBGVerification(JobRequestId: number): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.UpdateBGVerification(JobRequestId);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

    async UpsertBGVJobMaster(UpsertData: UpsertBGV[]): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.UpsertBGVJobMaster(UpsertData);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

    async GetBGVerificationType(): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.GetBGVerificationType();
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }

    async UpdateBGVerification(id: number): Promise<ApiResponse<any | null>> {
        try {
            const response = await BGverification.UpdateBGVerification(id);
            return {
                data: response.data,
                status: response.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error(
                "Error inserting data into AdvertisementDetails:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error inserting data into AdvertisementDetails",
            };
        }
    }
}