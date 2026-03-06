import { ISharePointMenuItemAccess, MenuDetailsResponse, MenuResponse, UserAccessDetailsResponse } from "../../models/menu";
import { ListNames } from "../../utilities/Config";
import SPServices from "../SPService/spservice";
import { IMenuService } from "./IMenu";

export default class MenuService implements IMenuService {

    async getSwitchUserMatrix(RoleID: any): Promise<MenuDetailsResponse> {
        try {
            let Conditions = "";
            let FilterConditions: any[] = [];
            let RoleIDs = RoleID.map((role: any) => Number(role.ID))
            FilterConditions.push({
                FilterKey: "RoleId",
                Operator: "in",
                FilterValue: RoleIDs, // Change accordingly if the value should be different
            });
            FilterConditions.push({
                FilterKey: "IsActive",
                Operator: "eq",
                FilterValue: "1"
            });
            Conditions = "and";
            let getjsonUserRole = {
                Listname: ListNames.HRMSRecruitmentSwitchUserMatrix,
                Select: "*,Menu,Menu/Id,Menu/MenuId,Menu/ShortDescription,Menu/LongDescription,Menu/ParentId,Menu/MenuSorting,Menu/Path,Menu/MenuIcon,Menu/InActiveMenuIcon,IsActive,SubMenu/Id,SubMenu/MenuId,SubMenu/ShortDescription,SubMenu/LongDescription,SubMenu/ParentId,SubMenu/MenuSorting,SubMenu/Path,SubMenu/MenuIcon,SubMenu/InActiveMenuIcon,Tab/Id,Tab/TabName,Tab/Sorting,ButtonAction/Id,ButtonAction/ActionDescription,Status/Id,Status/StatusDescription",
                Expand: "Menu,SubMenu,Tab,ButtonAction,Status",
                Filter: FilterConditions,
                FilterConditions: Conditions
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
            const returnData: MenuResponse[] = items.map((item: any) => ({
                Id: item.Menu.MenuId,
                DisplayName: item.Menu.LongDescription,
                Path: item.Menu.Path,
                Icon: `${item.Menu.MenuIcon}`,
                ActiveIcon: `${item.Menu.InActiveMenuIcon}`,
                ParentId: item.Menu.ParentId,
                Sort: item.Menu.MenuSorting,
                IsActive: item.IsActive,
                SubMenu: item?.SubMenu?.MenuId ? {
                    Id: item?.SubMenu?.MenuId,
                    DisplayName: item?.SubMenu?.LongDescription,
                    Path: item?.SubMenu?.Path,
                    Icon: `${item?.SubMenu?.MenuIcon}`,
                    ActiveIcon: `${item?.SubMenu?.InActiveMenuIcon}`,
                    ParentId: item?.SubMenu?.ParentId,
                    Sort: item?.SubMenu?.MenuSorting,
                    IsActive: item?.IsActive,
                    Children: [],
                    TabDetails: []
                } : undefined,
                Tab: {
                    key: item?.Tab?.Id,
                    text: item?.Tab?.TabName,
                    sorting: item?.Tab?.Sorting
                },
                Action: {
                    key: item.ButtonAction?.Id,
                    text: item.ButtonAction?.ActionDescription,
                },
                Status: {
                    key: item.Status?.Id,
                    text: item.Status?.StatusDescription,
                },
                TabDetails: []
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
                    FilterValue: String(userRoleId),
                }],
            };
            const items = await SPServices.SPReadItems(getjsonUserRole)
                .then((res) => {
                    const tempArray: ISharePointMenuItemAccess[] = res.map((item: any) => ({
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

    async GetNav(ITEMS: MenuResponse[], ParentId: number): Promise<MenuResponse[]> {
        const TempArray: MenuResponse[] = [];
        // console.log(ITEMS, "ITEMS in GetNav");

        const uniqueReturnData = Array.from(
            new Map(ITEMS.map((menu) => [menu.Id, menu])).values()
        );

        const filterItem = uniqueReturnData.filter((item) => item?.ParentId === ParentId);
        for (const element of filterItem) {
            if (element.SubMenu) {
                // console.log("Processing submenu for:", element.Id);
                element.Children = await this.getsubmenu(ITEMS, element.Id); // Recursive submenu
            } else {
                element.TabDetails = await this.getsubmenu(ITEMS, element.Id);
            }
            TempArray.push(element);
        }

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

    async getsubmenu(items: MenuResponse[], SubMenuId: number): Promise<MenuResponse[]> {
        const submenuMap = new Map<number, MenuResponse>();

        for (const item of items) {
            const sub = item.SubMenu && item.SubMenu.Id ? item.SubMenu : item;
            const ParentId = item.SubMenu && item.SubMenu.Id ? sub.ParentId : sub.Id;
            if (sub && ParentId === SubMenuId) {
                if (!submenuMap.has(sub.Id)) {
                    submenuMap.set(sub.Id, {
                        ...sub,
                        TabDetails: []
                    });
                }

                const existingSub = submenuMap.get(sub.Id)!;
                const tabName = item.Tab?.text?.trim();
                if (!tabName) continue;

                if (!existingSub.TabDetails) {
                    existingSub.TabDetails = [];
                }

                let tabDetail = existingSub.TabDetails.find(td => td.TabName === tabName);
                if (!tabDetail) {
                    tabDetail = {
                        TabName: tabName,
                        Value: " ",//item.Tab?.sorting?.trim(),
                        StatusDetails: []
                    };
                    existingSub.TabDetails.push(tabDetail);
                }

                const statusId = item.Status?.key;
                const statusText = item.Status?.text?.trim();

                let statusDetail: any;

                if (statusText) {
                    statusDetail = tabDetail.StatusDetails.find((sd: { StatusId: string }) =>
                        sd.StatusId.split(",").includes(String(statusId))
                    );

                    if (!statusDetail) {
                        statusDetail = {
                            Status: statusText,
                            StatusId: String(statusId),
                            ActionId: [],
                            Action: []
                        };
                        tabDetail.StatusDetails.push(statusDetail);
                    } else {
                        const statusParts = statusDetail.Status.split(',').map((s: string) => s.trim());
                        if (!statusParts.includes(statusText)) {
                            statusParts.push(statusText);
                            statusDetail.Status = statusParts.join(',');
                        }

                        const statusIdParts = statusDetail.StatusId.split(',').map((id: any) => id.trim());
                        if (!statusIdParts.includes(String(statusId))) {
                            statusIdParts.push(String(statusId));
                            statusDetail.StatusId = statusIdParts.join(',');
                        }
                    }
                } else {
                    // Allow status to be empty, create a blank entry to hold actions
                    statusDetail = {
                        Status: '',
                        StatusId: '',
                        ActionId: [],
                        Action: []
                    };
                    tabDetail.StatusDetails.push(statusDetail);
                }

                const actionId = item.Action?.key;
                const actionText = item.Action?.text?.trim();

                // if (typeof actionId === 'number' && actionText) {
                if (!statusDetail.ActionId.includes(actionId)) {
                    statusDetail.ActionId.push(actionId);
                }
                if (!statusDetail.Action.includes(actionText)) {
                    statusDetail.Action.push(actionText);
                }
                // }
            }
        }

        // Convert Map to Array
        const submenuList = Array.from(submenuMap.values());

        // Sort TabDetails by 'Value' (e.g., tab1, tab2, tab3)
        for (const submenu of submenuList) {
            submenu.TabDetails?.sort((a, b) => {
                const aNum = parseInt(a.Value?.replace(/\D/g, '') || '0', 10);
                const bNum = parseInt(b.Value?.replace(/\D/g, '') || '0', 10);
                return aNum - bNum;
            });

            if (submenu?.SubMenu) {
                submenu.Children = await this.getsubmenu(items, submenu.Id);
            } // Recursively process children
        }

        return submenuList;
    }


}