export type ICommonService = {
    uploadAttachmentToLibrary(PositionID: number, attach: File, name: string): Promise<ApiResponse<any | null>>;
    GetAttachmentToLibrary(listName: string, JobCode?: string, PassportID?: string): Promise<ApiResponse<any | null>>;
    GetADgruopsEmailIDs(ADGroupID: string): Promise<ApiResponse<any | null>>;
}