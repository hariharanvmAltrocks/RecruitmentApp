import { AdvertisementDetails, WorkflowJson } from "../../Models/ApIInterface";
import AxiosInstance from "../AxiosService/AxiosService";

export const getProfileData = {
    GetProfileByJobCode: async function (params: any) {
        return await AxiosInstance.post(
            `/GetProfileByJobCode?jobCode`, params
        );
    },
    getCandidateProfile: async function (id: any) {
        return await AxiosInstance.post(
            `/GetMyJobsById?id=${id}`,
        );
    },
    getAllMaster: async function () {
        return await AxiosInstance.get(
            `/GetAllMasters`,
        );
    },
    UpdateCandidateStatus: async function (params: WorkflowJson) {
        return await AxiosInstance.post(
            `/UpdateWorkflowStatus`, params
        );
    }

};

export const postAdveDetails = {
    postUpsertJobs: async function (params: AdvertisementDetails) {
        return await AxiosInstance.post(
            `/UpsertJobs`, params
        )
    }
}
