import AxiosInstance from "../AxiosService/AxiosService";

export const getProfileData = {
    getProfile: async function (params: any) {
        return await AxiosInstance.get(
            `/Profiles=${params}`,
        );
    },
};
