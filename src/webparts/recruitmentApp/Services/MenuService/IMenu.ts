import { MenuDetailsResponse, UserAccessDetailsResponse } from "../../Models/Menu";

export type IMenuService = {
    getSwitchUserMatrix(RoleID: any[]): Promise<MenuDetailsResponse>;
    getMenuDetails(MenuId: number): Promise<MenuDetailsResponse>;
    getUserAccess(userRoleId: number): Promise<UserAccessDetailsResponse>;
};
export function GetRoleKeysArray(array: any[]): number[] {
    return array.map(role => Number(role.ID));
}