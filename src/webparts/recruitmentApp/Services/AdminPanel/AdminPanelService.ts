import { AdminCreateUser, AdminPItem, ExternalUserDetails, UpsertExternalUser } from "../../Models/AdminPanel";
import { ListNames, Nationality } from "../../utilities/Config";
import { AdminPanelServiceApi } from "../ReviewProfileService/ReviewCandidateService";
import SPServices from "../SPService/SPServices";
import { IAdminPanelService } from "./IAdminPanelService";


export default class AdminPanelService implements IAdminPanelService {

    async getAdminPanelDashboard(FilterValue: AdminPItem): Promise<ApiResponse<AdminPItem[] | null>> {
        try {
            let GetProfileByJobCodeData: AdminPItem[] = []
            await AdminPanelServiceApi.GetAdminPanelDashboard(FilterValue).then((res) => {
                let TotalItems = res?.data?.pagination?.totalItems;
                GetProfileByJobCodeData = res.data.data.map((item: any, index: number) => {
                    return {
                        SNO: index + 1,
                        TotalItems: TotalItems,
                        exUserCode: item.exUserCode,
                        name: item.name,
                        email: item.email,
                        userId: item.userId,
                        ExternalUsersAccounts: item.tblMstExternalUsersAccounts,
                        contractStartDate: item.contractStartDate,
                        contractEndDate: item.contractEndDate,
                        designation: item.designation,
                        isExpat: item.isExpat === 1 ? Nationality.Expatriate : Nationality.Nationals,
                        noOfUsers: item.noOfUsers,
                        isActive: item.isActive,
                        firstName: item.firstName,
                        lastName: item.lastName,
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
                isEdit: UpsetUserValue.isEdit,
                type: UpsetUserValue.type,
                exUserCode: UpsetUserValue.exUserCode,
                userId: UpsetUserValue.userId,
                isExpat: UpsetUserValue.isExpat,
                noOfUsers: UpsetUserValue.noOfUsers,
                hrUserId: UpsetUserValue.hrUserId,
                externalUserAccounts: UpsetUserValue.externalUserAccounts,
                name: UpsetUserValue.name,
                contractStartDate: UpsetUserValue.contractStartDate,
                contractEndDate: UpsetUserValue.contractEndDate,
                designation: UpsetUserValue.designation
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

    async InsertExternalUser(UpsetUserValue: AdminCreateUser, IsEdit: boolean): Promise<ApiResponse<any>> {
        try {
            const UpsertUserDetails: ExternalUserDetails = {
                AgentCode: UpsetUserValue.AgentCode,
                AgentName: UpsetUserValue.CompanyName,
                EmailID: UpsetUserValue.EmailID,
                Nationality: UpsetUserValue.Nationality?.text || '',
                UserType: UpsetUserValue.UserType,
                IsActive: UpsetUserValue.IsActive ? true : false,
                UserName: UpsetUserValue.FirstName + ' ' + UpsetUserValue.LastName,
                Designation: UpsetUserValue.Designation,
                NoOfUsers: Number(UpsetUserValue.NoOfUsers),
                StartDateOfContract: UpsetUserValue.StartDateOfContract,
                EndDateOfContract: UpsetUserValue.EndDateOfContract,
            };

            let response: any
            if (IsEdit) {
                response = await SPServices.SPUpdateItem({
                    Listname: ListNames.HRMSExternalAgents,
                    RequestJSON: UpsertUserDetails,
                    ID: UpsetUserValue.ExternalID
                });
            } else {
                response = await SPServices.SPAddItem({
                    Listname: ListNames.HRMSExternalAgents,
                    RequestJSON: UpsertUserDetails,
                });
            }
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

    async ResetPassword(UserEmail: string): Promise<ApiResponse<any>> {
        try {
            const response = await AdminPanelServiceApi.ResetPassword(UserEmail)
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