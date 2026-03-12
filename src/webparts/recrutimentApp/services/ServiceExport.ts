import CareerPortalService from "./CareerPortal/CareerPortalService";
import { Icareerportal } from "./CareerPortal/ICareerPortal";
import CommonService from "./CommanAPi/CommanService";
import { ICommonService } from "./CommanAPi/Icommanservice";
import DashboardService from "./Dashboard/DashboardService";
import { IDashboard } from "./Dashboard/IDashboard";
import { IMasterService } from "./MasterService/IMasterService";
import MasterService from "./MasterService/MasterService";
import { IMenuService } from "./MenuService/IMenu";
import MenuService from "./MenuService/menuService";

export const masterService: IMasterService = new MasterService();
export const menuService: IMenuService = new MenuService();
export const DashboardServices: IDashboard = new DashboardService();
export const CommonServices: ICommonService = new CommonService();
export const CareerPotalServices: Icareerportal = new CareerPortalService();
