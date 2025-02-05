export interface IFilter {
    FilterKey: string;
    FilterValue: any;
    Operator: string;
}

 
export interface IListItems {
    Listname: string | any;
    Select?: string | any;
    Topcount?: number | any;
    Expand?: string | any;
    Orderby?: string | any;
    Orderbydecorasc?: boolean | any;
    Filter?: IFilter[] | any;
    FilterCondition?: string | any;
    PageCount?: number | any;
    PageNumber?: number | any;
}

export interface IListItemUsingId {
    Listname: string;
    Select?: string;
    Expand?: string;
    SelectedId: number;
}

export interface IAddList {
    Listname: string;
    RequestJSON: object;
}

export interface ISPList {
    Listname: string;
    ID: number;
}

export interface ISPListChoiceField {
    Listname: string;
    FieldName: string;
}

export interface IUpdateList {
    Listname: string;
    RequestJSON: object;
    ID: number;
}

export interface IDetailsListGroup {
    Data: any[];
    Column: string;
}

export interface IPeopleObj {
    key: number,
    imageUrl: string,
    text: string,
    secondaryText: string,
    ID: number,
    isValid: boolean
}

export interface IAttachContents {
    name: string;
    content: [];
}

export interface IAttachDelete {
    ListName: string;
    ListID: number;
    AttachmentName: string;
}

export interface ISPAttachment {
    ListName: string;
    ListID: number;
    Attachments: IAttachContents[]
}

export interface ISPAttachment2 {
    ListName: string;
    ListID: number;
    Attachments: IAttachContents[]
}

export type IGetDocLibFiles = {
    FilePath: string;
}
export type IDocFiles = {
    name: string;
    content: any;
    type: string;

}
export type IAddDocLibFiles = {
    FilePath: string;
    FolderNames: string[];
    Datas: IDocFiles[];
}
