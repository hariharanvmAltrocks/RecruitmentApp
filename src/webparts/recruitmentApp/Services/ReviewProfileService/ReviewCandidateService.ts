import { AdvertisementDetails } from "../../Models/ApIInterface";
import AxiosInstance from "../AxiosService/AxiosService";

export const getProfileData = {
    GetProfileByJobCode: async function (JobCode: string, params: any) {
        return await AxiosInstance.post(
            `/GetProfileByJobCode?jobCode=${JobCode}`, params
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

};

export const postAdveDetails = {
    postUpsertJobs: async function (params: AdvertisementDetails) {
        return await AxiosInstance.post(
            `/UpsertJobs`, params
        )
    }
}
