export type ICommonService = {
    uploadAttachmentToLibrary(ID: number, PositionID: number, attach: File, name: string): Promise<ApiResponse<any | null>>;
    GetAttachmentToLibrary(ID: string, listName: string, JobCode?: string, PassportID?: string): Promise<ApiResponse<any | null>>;
    GetADgruopsEmailIDs(ADGroupID: string): Promise<ApiResponse<any | null>>;
}