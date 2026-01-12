import { AdminPItem, UpsertExternalUser } from "../../Models/AdminPanel";
import { AdvertisementDetails, CheckMyCandidate, COIType, GetProfileByFilter, getQuestionById, initiateLaborHire, profileXagent, sendEmail, UpsertBGV, UpsertMasters, UpsertProfile, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
import { AuthorizationHeader } from "../AxiosService/axiosConfig";
import AxiosInstance from "../AxiosService/AxiosService";

export const InternalSign = {
    InternalSignIn: async function () {
        return await AxiosInstance.post(
            `/hrms/InternalSignIn`, {}, AuthorizationHeader
        );
    }
}

export const getProfileData = {
    GetProfileByJobCode: async function (params: any) {
        return await AxiosInstance.post(
            `/hrms/GetProfileByJobCode?jobCode`, params
        );
    },
    getCandidateProfile: async function (id: any) {
        return await AxiosInstance.post(
            `/hrms/GetMyJobsById?id=${id}`,
        );
    },
    UpdateCandidateStatus: async function (params: WorkflowJson) {
        return await AxiosInstance.post(
            `/hrms/UpdateWorkflowStatus`, params
        );
    }

};

export const postAdveDetails = {
    postUpsertJobs: async function (params: AdvertisementDetails) {
        return await AxiosInstance.post(
            `/hrms/UpsertJobs`, params
        )
    },
    postAgenciesJobs: async function (params: profileXagent) {
        return await AxiosInstance.post(
            `/hrms/UpsertAgentForJobs`, params
        )
    },
    getAllMaster: async function () {
        return await AxiosInstance.get(
            `/hrms/GetAllMasters`,
        );
    },
    getMastersByCategory: async function (id: number) {
        return await AxiosInstance.get(
            `/hrms/GetMastersByCategory?catId=${id}`,
        );
    },
    PostMaster: async function (params: UpsertMasters[]) {
        return await AxiosInstance.post(
            `/hrms/UpsertMasters`, params
        );
    },
}

export const QuestionnaireApi = {
    PostQuestionnaire: async function (params: UpsertQuestions[]) {
        return await AxiosInstance.post(
            `/hrms/UpsertQuestions`, params
        );
    },
    GetQuestionnaire: async function (JobCode: string) {
        return await AxiosInstance.get(
            `/hrms/GetInterviewPanelQuestionsByJobCode?jobCode=${JobCode}`
        );
    },
    GetQuestionaireByScope: async function (params: getQuestionById) {
        return AxiosInstance.post(
            `/hrms/GetQuestionsBank`, params
            ,
        );
    }

}

export const GetStateByCountryApi = {
    GetCountryApi: async function () {
        return await AxiosInstance.get(
            `/jobPortal/GetAllCountries`
        );
    },
    GetStatebyCountry: async function (CountryCode: string) {
        return await AxiosInstance.get(
            `/jobPortal/GetStatesByCountryCode?countryCode=${CountryCode}`,
        );
    },
    GetCitiesbyState: async function (StateCode: string) {
        return await AxiosInstance.get(
            `/jobPortal/GetCitiesByStateId?stateId=${StateCode}`,
        );
    },
}

export const UploadCandidateCVData = {
    CheckMyCandidateAppliedJobs: async function (data: CheckMyCandidate) {
        return await AxiosInstance.get(
            `/Agent/CheckMyCandidateAppliedJobs?email=${data.Email}&jobCode=${data.JobCode}`
        );
    },
    UpsertProfile: async function (params: UpsertProfile[]) {
        return await AxiosInstance.post(
            `/Profile/UpsertProfile`, params,
        );
    },
    UploadDocument: async function (params: any) {
        return await AxiosInstance.postForm(
            `/Profile/CandidateUploadDocument`, params,
        );
    },
    GetCandiateForJobs: async function (jobCode: string, params: GetProfileByFilter) {
        return await AxiosInstance.post(
            `/Agent/GetCandiateForJobs?jobCode=${jobCode}`, params,
        );
    },
    GetQuestionByJobCode: async function (jobCode: string) {
        return await AxiosInstance.post(
            `jobPortal/GetQuestionByJobCode?code=${jobCode}`
        );
    }
}

export const GetJobRequestData = {
    GetJobRequestStatus: async function (params: any[]) {
        return await AxiosInstance.post(
            `/hrms/GetJobRequestStatus`, params
        );
    },
    UpsertCOI: async function (COIType: COIType) {
        return await AxiosInstance.post(
            `/hrms/UpsertCoi`, COIType
        );
    },
};

export const EmailService = {
    emailnotification: async function (params: sendEmail) {
        return await AxiosInstance.post(
            `/hrms/SendEmailNotification`, params
        );
    },
};

export const LaborHire = {
    initiateLaborHire: async function (params: initiateLaborHire) {
        return await AxiosInstance.post(
            `/hrms/UpsertJobsLaborHire`, params
        );
    }
}

export const BGverification = {
    initiateBGVProcess: async function (id: number) {
        return await AxiosInstance.post(
            `/BGVerification/RunBGVerification?jobRequestId=${id}`
        );
    },
    // GetBGVStatus: async function (params: BGVStatus) {
    //     return await AxiosInstance.post(
    //         `/hrms/GetBGVStatus`, params
    //     );
    // },
    UpsertBGVJobMaster: async function (params: UpsertBGV[]) {
        return await AxiosInstance.post(
            `/hrms/UpsertBGVJobMaster`, params
        )
    },
    GetBGVerificationType: async function () {
        return await AxiosInstance.get(
            `hrms/GetBGVerificationType`
        )
    },
    UpdateBGVerification: async function (params: number) {
        return await AxiosInstance.get(
            `BGVerification/ProcessBgvJobs?jobRequestId=${params}`
        )
    },
}

export const AdminPanelServiceApi = {
    GetAdminPanelDashboard: async function (params: AdminPItem) {
        return await AxiosInstance.post(
            `/hrms/GetAllExternalUsers`, params
        );
    },
    UpsertExternalUser: async function (params: UpsertExternalUser) {
        return await AxiosInstance.post(
            `/hrms/UpsertExternalUser`, params
        );
    },
    ResetPassword: async function (Email: any) {
        return await AxiosInstance.get(
            `/Auth/PasswordResetToken?userName=${Email}`
        );
    }
}
export const PPEMasterTable = {
    getPPEMaster: async function () {
        return await AxiosInstance.get(
            '/jobPortal/GetPPEMaster'
        );
    }
}