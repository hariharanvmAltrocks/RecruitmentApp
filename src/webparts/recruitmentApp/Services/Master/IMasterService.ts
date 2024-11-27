import { UserRoleResponseDetails } from "../../Models/Master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
};
