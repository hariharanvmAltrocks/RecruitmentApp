import * as moment from "moment";
import { AdminPItem, UpsertExternalUser } from "../../Models/AdminPanel";
import { AdminPanelServiceApi } from "../ReviewProfileService/ReviewCandidateService";
import { IAdminPanelService } from "./IAdminPanelService";


export default class AdminPanelService implements IAdminPanelService {

    async getAdminPanelDashboard(FilterValue: AdminPItem): Promise<ApiResponse<AdminPItem[] | null>> {
        try {
            let GetProfileByJobCodeData: AdminPItem[] = []
            await AdminPanelServiceApi.GetAdminPanelDashboard(FilterValue).then((res) => {
                let TotalItems = res?.data?.pagination?.totalItems;
                GetProfileByJobCodeData = res.data.data.map((item: any, index: number) => {
                    const JobCode = item?.jobCode?.split('-')[0];
                    let createdon = item?.createdOn ? new Date(item.createdOn) : null
                    return {
                        SNO: index + 1,
                        CandidateID: item?.jobRequestId,
                        ApplicantName: item?.applicantName,
                        PositionTitle: item?.jobTitle?.displayText,
                        JobCode: JobCode,
                        Status: item?.workflowStatus?.displayText,
                        workflowStatusId: item?.workflowStatusId,
                        createdOn: moment(createdon).format("DD/MM/YYYY HH:mm:ss"),
                        TotalItems: TotalItems,
                        applicationStatusId: item?.applicationStatusId,
                        applicationStatus: item?.applicationStatus?.displayText
                    }
                })
            }
            ).catch((error) => {
                console.log(error, "error");
            })
            return {
                data: GetProfileByJobCodeData,
                status: 200,
                message: "Get Candidate details",
            };
        } catch (error) {
            console.error(
                "Error Get Candidate details:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error Get Candidate details",
            };
        }
    }

    async UpsertExternalUser(UpsetUserValue: UpsertExternalUser): Promise<ApiResponse<any>> {
        try {
            const UpsertUserDetails: UpsertExternalUser = {
                firstname: UpsetUserValue.firstname,
                lastname: UpsetUserValue.lastname,
                contactNumber: UpsetUserValue.contactNumber,
                email: UpsetUserValue.email,
                password: UpsetUserValue.password,
                isActive: UpsetUserValue.isActive,
                type: UpsetUserValue.type,
                exUserCode: UpsetUserValue.exUserCode,
                userId: UpsetUserValue.userId,
                isExpat: UpsetUserValue.isExpat,
                noOfUsers: UpsetUserValue.noOfUsers,
                hrUserId: UpsetUserValue.hrUserId,
                externalUserAccounts: UpsetUserValue.externalUserAccounts,
            };

            const response = await AdminPanelServiceApi.UpsertExternalUser(UpsertUserDetails)

            return {
                data: response,
                status: 200,
                message: "Get Candidate details",
            };
        } catch (error) {
            console.error(
                "Error Get Candidate details:",
                error
            );
            return {
                data: [],
                status: 500,
                message: "Error Get Candidate details",
            };
        }
    }
}