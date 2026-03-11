export interface IFilter {
  FilterKey: string;
  Operator: string;
  FilterValue: string | string[] | number | number[] | boolean | boolean[];
}

export interface IListItems {
  Listname: string;
  Select?: string;
  Filter?: IFilter[];
  FilterCondition?: string;
  Topcount?: number;
  Orderby?: string;
  Orderbydecorasc?: boolean;
  Expand?: string;
  PageCount?: number;
  PageNumber?: number;
}

export interface IAddList {
  Listname: string;
  RequestJSON: Record<string, unknown>;
}

export interface IUpdateList {
  Listname: string;
  ID: number;
  RequestJSON: Record<string, unknown>;
}

export interface ISPList {
  Listname: string;
  ID: number;
}

export interface IListItemUsingId {
  Listname: string;
  SelectedId: number;
  Select?: string;
  Expand?: string;
}

export interface IAttachmentFile {
  name: string;
  content: ArrayBuffer | string;
}

export interface ISPAttachment {
  ListName: string;
  ListID: number;
  Attachments: IAttachmentFile[];
}

export interface IAttachDelete {
  ListName: string;
  ListID: number;
  AttachmentName: string;
}

export interface ISPListChoiceField {
  Listname: string;
  FieldName: string;
}

export interface IDocFiles {
  name: string;
  content: string | ArrayBuffer;
  type: "New" | "Delete" | "Inlist";
}

export interface IGetDocLibFiles {
  FilePath: string;
}

export interface IAddDocLibFiles {
  FilePath: string;
  FolderNames: string[];
  Datas: IDocFiles[];
}

export interface IDetailsListGroup {
  Data: Record<string, unknown>[];
  Column: string;
}

export interface ICAMLFilter {
  field: string;
  /** Text | Integer | Choice | Lookup | DateTime | Boolean */
  type: string;
  value: string | string[] | number | number[];
  condition?: "Eq" | "Neq" | "Gt" | "Lt" | "Geq" | "Leq";
}

export interface ICAMLQuery {
  Listname: string;
  Select?: string[];
  Filter?: ICAMLFilter[];
  FilterCondition?: "AND" | "OR";
  Topcount?: number;
  Orderby?: string;
  Orderbydecorasc?: boolean;
  Expand?: string[];
}

export interface IItemAddResult {
  data: { ID: number } & Record<string, unknown>;
}

// update() always resolves to { etag: string | undefined }
export interface IItemUpdateResult {
  etag: string | undefined;
}

export interface BatchInsertParams {
  ListName: string;
  responseData: Record<string, unknown>[];
}

export interface BatchQuery {
  StateValue: string;
  ListName: string;
  Filter?: IFilter[];
  Select?: string[];
  FilterCondition?: string;
}
