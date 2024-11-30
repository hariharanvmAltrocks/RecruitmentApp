import { MasterDataResponseDetails, UserRoleResponseDetails } from "../../Models/Master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
    MasterData(EmailId: any, UserRole: number): Promise<MasterDataResponseDetails>;
};
