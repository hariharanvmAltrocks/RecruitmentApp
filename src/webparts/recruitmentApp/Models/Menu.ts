export type ISharePointMenuItem = {
    MenuID: number;
    MenuIsActive: boolean;
    MenuActiveIcon: string;
    MenuInactiveIcon: string;
    MenuLabel: string;
    MenuPath: string;
};

export type ISharePointMenuItemAccess = {
    MenuIdId: number;
    RoleIdId: number;
    IsActive: string;

};

export type MenuResponse = {
    Id: number;
    DisplayName: string;
    Path: string;
    Icon: string;
    ActiveIcon: string;
    ParentId: number;
    Sort: number;
    IsActive: boolean;
    SubMenu?: MenuResponse;
    Tab?: ITab;
    Action?: IAction;
    Status?: IStatus;
    Children?: MenuResponse[];
    TabDetails?: any[]
}

interface ITab {
    key: string;
    text: string;
    sorting: string;
}

interface IAction {
    key: number;
    text: string;
}
interface IStatus {
    key: number;
    text: string;
}


export type MenuDetailsResponse = {
    data: MenuResponse[];
    status: number;
    message: string;
};

export type UserAccessDetailsResponse = {
    data: ISharePointMenuItemAccess[];
    status: number;
    message: string;
};
