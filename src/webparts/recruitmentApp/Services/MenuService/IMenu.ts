import { MenuDetailsResponse, UserAccessDetailsResponse } from "../../Models/Menu";

export type IMenuService = {
    getMenuDetails(MenuId: number): Promise<MenuDetailsResponse>;
    getUserAccess(userRoleId: number): Promise<UserAccessDetailsResponse>;
};
