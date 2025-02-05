
import { IMenuService } from "./IMenu";
import { ISharePointMenuItemAccess, MenuDetailsResponse, MenuResponse, UserAccessDetailsResponse } from "../../Models/Menu";
import { ListNames } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";

export default class MenuService implements IMenuService {

    async getMenuDetails(MenuId: number): Promise<MenuDetailsResponse> {
        try {
            let Conditions = "";
            let FilterConditions: any[] = [];
            FilterConditions.push({
                FilterKey: "RoleIdId",
                Operator: "eq",
                FilterValue: MenuId, // Change accordingly if the value should be different
            });
            FilterConditions.push({
                FilterKey: "IsActive",
                Operator: "eq",
                FilterValue: "1"
            });
            Conditions = "and";
            let getjsonUserRole = {
                Listname: ListNames.HRMSMenuAccess,
                Select: "*,MenuId,MenuId/Id,MenuId/MenuId, MenuId/ShortDescription ,MenuId/LongDescription, MenuId/ParentId, MenuId/MenuSorting , MenuId/Path, MenuId/MenuIcon, MenuId/InActiveMenuIcon , IsActive",
                Expand: "MenuId",
                Filter: FilterConditions,
                FilterConditions: Conditions
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
            const returnData: MenuResponse[] = items.map((item: any) => ({
                Id: item.MenuId.MenuId,
                DisplayName: item.MenuId.LongDescription,
                Path: item.MenuId.Path,
                Icon: `${item.MenuId.MenuIcon}`,
                ActiveIcon: `${item.MenuId.InActiveMenuIcon}`,
                ParentId: item.MenuId.ParentId,
                Sort: item.MenuId.MenuSorting,
                IsActive: item.IsActive,
            }));
            const returnData1 = await this.GetNav(returnData, 0);
            const MenuSortData = await this.sortMenuItems(returnData1);
            return {
                data: MenuSortData,
                status: 200,
                message: "Data retrived Successfully!",
            };
        } catch (error) {
            console.log("MenuItems error", error);
            return {
                data: [],
                status: 500,
                message: "Data Fetched Failed",
            };
        }
    }

    async getUserAccess(userRoleId: number): Promise<UserAccessDetailsResponse> {
        try {
            let getjsonUserRole = {
                Listname: ListNames.HRMSMenuAccess,
                Select: "*,MenuId/MenuId,RoleId/ID",
                Expand: "MenuId,RoleId",
                Filter: [{
                    FilterKey: "RoleId",
                    Operator: "eq",
                    FilterValue: userRoleId,
                }],
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
                .then((res) => {
                    const tempArray: ISharePointMenuItemAccess[] = res.map((item) => ({
                        MenuIdId: item.MenuId?.MenuId,
                        RoleIdId: item.RoleId?.ID,
                        IsActive: item.IsActive
                    }));
                    return tempArray;
                });
            return {
                data: items,
                status: 200,
                message: "Data Fetched Successfully",
            };
        } catch (error) {
            console.log("getUserAccess error", error);
            return {
                data: [],
                status: 500,
                message: "Data Fetch Failed",
            };
        }
    }

    GetNav(ITEMS: MenuResponse[], ParentId: number): MenuResponse[] {
        let TempArray: MenuResponse[] = [];
        const filterItem = ITEMS.filter((item) => item?.ParentId == ParentId);
        filterItem.forEach((element) => {
            element.Children = this.GetNav(ITEMS, element?.Id);
            TempArray.push(element);
        });

        return TempArray;
    }

    sortMenuItems(menuItems: MenuResponse[]): MenuResponse[] {
        // Sort menu items based on the Sort property
        menuItems.sort((a, b) => a.Sort - b.Sort);

        // Recursively sort children

        for (const menuItem of menuItems) {
            if (menuItem.Children != undefined && menuItem.Children?.length > 0) {
                menuItem.Children = this.sortMenuItems(menuItem.Children);
            }

        }

        return menuItems;
    }


}
