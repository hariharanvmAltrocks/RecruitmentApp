import { AutoCompleteItem } from "../../Models/Screens";
import { IDocFiles } from "../SPService/ISPServicesProps";

export type ICommonService = {
    uploadAttachmentToLibrary(PositionCode: string, AttachFile: IDocFiles[], ListName: string): Promise<ApiResponse<any | null>>;
    GetAttachmentToLibrary(listName: string, JobCode?: string, PassportID?: string): Promise<ApiResponse<any | null>>;
    GetADgruopsEmailIDs(ADGroupID: string): Promise<ApiResponse<any | null>>;
    getUserGuidByEmail(email: string): Promise<ApiResponse<AutoCompleteItem | null>>;
    GetMasterData(ListName: string,): Promise<ApiResponse<any[]>>;
    GetGradeLevel(PatersonGrade: string): Promise<ApiResponse<any | null>>;
}