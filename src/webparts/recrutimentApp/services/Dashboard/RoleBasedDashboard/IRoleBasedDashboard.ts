import { IHRLeadDashboard, IHRDashboardData, IHODDashbaord } from "../../../components/Screens/Dashboard/Types";
import { ApiResponse } from "../../../models/apimodels";

export type IRoleBasedDashboard = {
  GetHRLeadDashboard(EmailId: string): Promise<ApiResponse<IHRLeadDashboard>>;
  GetHRDashboardData(EmailId: string): Promise<ApiResponse<IHRDashboardData>>;
  GetLMDashboardData(EmailId: string): Promise<ApiResponse<any>>;
  GetHODDashboardData(EmailId: string): Promise<ApiResponse<IHODDashbaord>>;
  GetSeniorHRDashboardData(EmailId: string): Promise<ApiResponse<any>>;
};