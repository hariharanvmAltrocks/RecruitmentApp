import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";
import { IDocFiles } from "../SPService/Ispservice";

export type LanguageFiles = {
    English: IDocFiles[];
    French: IDocFiles[];
};

export type ICommonService = {
    GetAttachmentToLibrary(
        listName: string,
        JobCode?: string,
        ProfileID?: string
    ): Promise<ApiResponse<any | null>>;
    GetADgruopsEmailIDs(ADGroupID: string): Promise<ApiResponse<any | null>>;
    getUserGuidByEmail(
        email: string
    ): Promise<ApiResponse<AutoCompleteItem | null>>;
    getUserIDByEmail(
        userId: number
    ): Promise<ApiResponse<any | null>>;
    GetMasterData(ListName: string, Filter?: any[]): Promise<ApiResponse<any[]>>;
    GetGradeLevel(PatersonGrade: string): Promise<ApiResponse<any | null>>;
    GetAttachmentLink(
        PositionCode: string,
        Listname: string
    ): Promise<ApiResponse<any>>;
    uploadRoleProfileMaster(
        PositionCode: string,
        DocumentName: string,
        AttachFile: IDocFiles[],
        Listname: string
    ): Promise<ApiResponse<any>>;
    GetDocumentinUrl(url: string): Promise<ApiResponse<any[]>>;
    GetUserName(
        email: string
    ): Promise<ApiResponse<any | null>>;
    uploadAttachmentToLibrary (
    PositionCode: string,
    AttachFile: IDocFiles[],
    Listname: string
  ): Promise<ApiResponse<any>>;
  PostCommanDataInsert(
    obj: any,
    ListName: string
  ): Promise<ApiResponse<any>>;
};