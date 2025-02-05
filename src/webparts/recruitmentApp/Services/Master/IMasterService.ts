import { MasterDataResponseDetails, UserRoleResponseDetails } from "../../Models/Master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
    MasterData(EmailId: string, RoleID: number, UserName: string, UserRole: string): Promise<MasterDataResponseDetails>;
};
