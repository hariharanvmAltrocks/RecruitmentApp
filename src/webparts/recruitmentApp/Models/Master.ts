export type UserRoleResponseDetails = {
    data: UserRoleData[] | null;
    status: number;
    message: string;
};

export type UserRoleData = {
    ID: number;
    RoleTitle: string;
    ADGroupID: string;
};