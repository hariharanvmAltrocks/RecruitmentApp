import { IMasterService } from "./MasterService/IMasterService";
import MasterService from "./MasterService/MasterService";
import { IMenuService } from "./MenuService/IMenu";
import MenuService from "./MenuService/menuService";

export const masterService: IMasterService = new MasterService();
export const menuService: IMenuService = new MenuService();