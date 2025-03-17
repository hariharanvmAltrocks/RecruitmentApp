import { AdvertisementDetails, profileXagent, UpsertMasters, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
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
    },
    postAgenciesJobs: async function (params: profileXagent) {
        return await AxiosInstance.post(
            `/UpsertAgentForJobs`, params
        )
    },
    getAllMaster: async function () {
        return await AxiosInstance.get(
            `/GetAllMasters`,
        );
    },
    PostMaster: async function (params: UpsertMasters[]) {
        return await AxiosInstance.post(
            `/UpsertMasters`, params
        );
    },
    PostQuestion: async function (params: UpsertQuestions[]) {
        return await AxiosInstance.post(
            `/UpsertQuestions`, params
        );
    },

}
