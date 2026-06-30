import { IConsultOption } from "../../components/Screens/OfferRelease/ReviewDocument/Hooks/useConsultOption";
import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";
import { GetAllMaster, GetMasterByCountry } from "../../models/Icareerportal";
import {
  CareerPortalLink,
  IBUCodeEmailIDs,
  IJobGrade,
  ITabdetails,
  IUniqueJobCode,
  IUserDetails,
  UserRoleResponseDetails,
} from "../../models/master";

export interface IJDEDataMappingItem {
  LineManagerId?: number;
  LineManager?: { EMail: string };
  HODId?: number;
  HOD?: { EMail: string };
  HRId?: number;
  HR?: { EMail: string };
  EXCOId?: number;
  EXCO?: { EMail: string };
}

export type IMasterService = {
  userRole(): Promise<UserRoleResponseDetails>;
  // MasterData(EmailId: string, RoleID: number[], UserName: string, UserRole: string[]): Promise<MasterDataResponseDetails>;
  GetCareerPortalIntergLink(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<CareerPortalLink>>;
  GetTabDetails(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<ITabdetails>>;
  GetUserDetails(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<IUserDetails>>;
  GetGradeLevel(gradeId: string): Promise<ApiResponse<IJobGrade>>;
  GetJobUniqueDataValue(
    JobCodeId: number,
  ): Promise<ApiResponse<IUniqueJobCode>>;
  GetAllMaster(id: number): Promise<ApiResponse<GetAllMaster[] | null>>;
  GetMasterRoleProfile (ListName: string): Promise<ApiResponse<any[]>>;
  GetCountryMaster(): Promise<ApiResponse<GetMasterByCountry[] | null>>;
  fetchJDEEmailIDs(BUCodeID: number): Promise<ApiResponse<IBUCodeEmailIDs>>;
  GetConsultingOptions(): Promise<ApiResponse<IConsultOption>>
};

export const buildOptions = (
  data: any[],
  keyField: string,
  textField: string
): AutoCompleteItem[] =>
  data
    .map((item) => ({
      key: item[keyField],
      text: item[textField],
    }))
    .sort((a, b) => String(a.text).localeCompare(String(b.text)));
