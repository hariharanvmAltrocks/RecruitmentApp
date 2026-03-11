
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/fields";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/batching";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import { BatchQuery, IAddDocLibFiles, IAddList, IAttachDelete, ICAMLFilter, ICAMLQuery, IDetailsListGroup, IDocFiles, IFilter, IGetDocLibFiles, IItemAddResult, IItemUpdateResult, IListItems, IListItemUsingId, ISPAttachment, ISPList, ISPListChoiceField, IUpdateList } from "./Ispservice";


let _sp: SPFI;

export const initSP = (context: any): void => {
  _sp = spfi().using(SPFx(context));
};

export const getSP = (): SPFI => {
  if (!_sp) {
    throw new Error(
      "PnPjs has not been initialised. Call initSP(this.context) inside onInit()."
    );
  }
  return _sp;
};


const _formatInputs = (data: IListItems): Required<IListItems> => ({
  Listname: data.Listname,
  Filter: data.Filter ?? [],
  Select: data.Select ?? "*",
  Topcount: data.Topcount ?? 5000,
  Orderby: data.Orderby ?? "ID",
  Expand: data.Expand ?? "",
  Orderbydecorasc: data.Orderbydecorasc ?? true,
  PageCount: data.PageCount ?? 10,
  PageNumber: data.PageNumber ?? 1,
  FilterCondition: data.FilterCondition ?? "and",
});

const _buildODataFilter = (filters: IFilter[], filterCondition: string): string => {
  if (!filters?.length) return "";

  const MAX_BATCH = 100;
  const parts: string[] = [];

  for (const f of filters) {
    if (!f.FilterKey) continue;

    const op = f.Operator.toLowerCase();
    const values = Array.isArray(f.FilterValue) ? f.FilterValue : [f.FilterValue];

    if (["eq", "ne", "gt", "lt", "ge", "le"].includes(op)) {
      parts.push(`${f.FilterKey} ${f.Operator} '${f.FilterValue}'`);

    } else if (op === "substringof") {
      parts.push(`substringof('${f.FilterValue}','${f.FilterKey}')`);

    } else if (op === "in") {
      const chunks: string[] = [];
      for (let j = 0; j < values.length; j += MAX_BATCH) {
        const slice = values.slice(j, j + MAX_BATCH);
        chunks.push("(" + slice.map((v) => `${f.FilterKey} eq '${v}'`).join(" or ") + ")");
      }
      parts.push(chunks.join(" or "));

    } else if (op === "nin") {
      const chunks: string[] = [];
      for (let j = 0; j < values.length; j += MAX_BATCH) {
        const slice = values.slice(j, j + MAX_BATCH);
        chunks.push("(" + slice.map((v) => `${f.FilterKey} ne '${v}'`).join(" and ") + ")");
      }
      parts.push(chunks.join(" and "));
    }
  }

  const glue = (filterCondition === "and" || filterCondition === "or")
    ? ` ${filterCondition} `
    : " and ";

  return parts.join(glue);
};

// ─── Users ────────────────────────────────────────────────────────────────────

/** Returns all site users. Lazy — fires only when awaited. */
const getAllUsers = async (): Promise<unknown[]> => {
  return getSP().web.siteUsers();
};

// ─── Single-item CRUD ─────────────────────────────────────────────────────────

/**
 * Adds a single item to a SharePoint list.
 *
 * @example
 * const result = await SPService.SPAddItem({
 *   Listname: "Tasks",
 *   RequestJSON: { Title: "New Task", Status: "Active" }
 * });
 * console.log(result.data.ID);
 */
const SPAddItem = async (params: IAddList): Promise<IItemAddResult> => {
  return getSP().web.lists
    .getByTitle(params.Listname)
    .items.add(params.RequestJSON);
};

/**
 * Updates an existing item by ID.
 *
 * @example
 * await SPService.SPUpdateItem({
 *   Listname: "Tasks",
 *   ID: 42,
 *   RequestJSON: { Status: "Closed" }
 * });
 */
const SPUpdateItem = async (params: IUpdateList): Promise<IItemUpdateResult> => {
  return getSP().web.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .update(params.RequestJSON);
};

/**
 * Deletes an item by ID. Returns true on success, false on error.
 *
 * @example
 * const ok = await SPService.SPDeleteItem({ Listname: "Tasks", ID: 42 });
 */
const SPDeleteItem = async (params: ISPList): Promise<boolean> => {
  try {
    await getSP().web.lists
      .getByTitle(params.Listname)
      .items.getById(params.ID)
      .delete();
    return true;
  } catch (error) {
    console.error("SPDeleteItem error:", error);
    return false;
  }
};

// ─── Read — lazy + transparent server-side paging ────────────────────────────

/**
 * Reads ALL items from a list, transparently walking every server page.
 * The query chain is built lazily — no HTTP traffic until awaited.
 *
 * PnPjs v3 note: getPaged() was replaced by getPagedV2().
 *
 * @example
 * const items = await SPService.SPReadItems({
 *   Listname: "Tasks",
 *   Select: "ID,Title,Status",
 *   Filter: [{ FilterKey: "Status", Operator: "eq", FilterValue: "Active" }],
 *   Orderby: "Created",
 *   Orderbydecorasc: false
 * });
 */
const SPReadItems = async (params: IListItems): Promise<unknown[]> => {

  const p = _formatInputs(params);
  const filterStr = _buildODataFilter(p.Filter, p.FilterCondition);

  let allItems: any[] = [];
  let skip = 0;
  const pageSize = p.Topcount || 500;
  let hasMore = true;

  while (hasMore) {

    const items = await getSP().web.lists
      .getByTitle(p.Listname)
      .items
      .select(p.Select)
      .filter(filterStr)
      .expand(p.Expand)
      .orderBy(p.Orderby, p.Orderbydecorasc)
      .top(pageSize)
      .skip(skip)();   // ✅ correct method

    allItems = [...allItems, ...items];

    if (items.length < pageSize) {
      hasMore = false;
    } else {
      skip += pageSize;
    }
  }

  return allItems;
};

const SPGetItems = SPReadItems;

/**
 * Reads a single item by its numeric ID with optional field selection/expand.
 *
 * @example
 * const item = await SPService.SPReadItemUsingId({
 *   Listname: "Tasks",
 *   SelectedId: 42,
 *   Select: "ID,Title,AssignedTo/Title",
 *   Expand: "AssignedTo"
 * });
 */
const SPReadItemUsingId = async (params: IListItemUsingId): Promise<unknown> => {
  // In PnPjs v3 a chainable IItem is callable — invoking () executes the request.
  return getSP().web.lists
    .getByTitle(params.Listname)
    .items.getById(params.SelectedId)
    .select(params.Select ?? "*")
    .expand(params.Expand ?? "")();
};

// ─── Attachments ──────────────────────────────────────────────────────────────

/**
 * Uploads one or more attachments to a list item.
 *
 * PnPjs v3 note: addMultiple was removed from IAttachments.
 * Use individual .add() calls (each maps to one HTTP request — they can be
 * wrapped in a batch if volume is high).
 *
 * @example
 * await SPService.SPAddAttachments({
 *   ListName: "Tasks",
 *   ListID: 42,
 *   Attachments: [{ name: "report.pdf", content: arrayBuffer }]
 * });
 */
const SPAddAttachments = async (params: ISPAttachment): Promise<void> => {
  const item = getSP().web.lists
    .getByTitle(params.ListName)
    .items.getById(params.ListID);

  for (const att of params.Attachments) {
    await item.attachmentFiles.add(att.name, att.content);
  }
};

/** Returns attachment metadata for a list item. */
const SPGetAttachments = async (params: ISPList): Promise<unknown[]> => {
  return getSP().web.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .attachmentFiles();
};

/** Deletes a single named attachment from a list item. */
const SPDeleteAttachments = async (params: IAttachDelete): Promise<void> => {
  await getSP().web.lists
    .getByTitle(params.ListName)
    .items.getById(params.ListID)
    .attachmentFiles.getByName(params.AttachmentName)
    .delete();
};

// ─── Field Metadata ───────────────────────────────────────────────────────────

/**
 * Retrieves field metadata (includes Choices array for Choice fields).
 *
 * @example
 * const fieldInfo = await SPService.SPGetChoices({ Listname: "Tasks", FieldName: "Status" });
 * console.log((fieldInfo as any).Choices);
 */
const SPGetChoices = async (params: ISPListChoiceField): Promise<unknown> => {
  return getSP().web.lists
    .getByTitle(params.Listname)
    .fields.getByInternalNameOrTitle(params.FieldName)();
};

// ─── Batch Operations ─────────────────────────────────────────────────────────
//
// PnPjs v3 batch pattern:
//   const [batchedSP, execute] = getSP().batched();
//   // Queue operations against batchedSP (NOT the original sp instance).
//   // Collect the returned Promises BEFORE calling execute().
//   await execute();          // fires all queued requests in one round-trip
//   await Promise.all(promises); // resolve the individual results

/**
 * Batch-inserts multiple items in a single HTTP round-trip.
 *
 * @example
 * await SPService.batchInsert({
 *   ListName: "Tasks",
 *   responseData: [{ Title: "Task A" }, { Title: "Task B" }]
 * });
 */
const batchGet = async (queries: BatchQuery[]): Promise<Record<string, number>> => {
  try {
    const [batchedSP, execute] = getSP().batched();

    const results: Record<string, number> = {};
    const promises = queries.map((q: any) => {

      const filterStr = _buildODataFilter(q.Filter, "and");

      let request = batchedSP.web.lists
        .getByTitle(q.ListName)
        .items
        .filter(filterStr)
        .select(...q.select);

      return request().then(r => {
        results[q.StateValue] = r.length;
      });

    });

    await execute();
    await Promise.all(promises);

    return results;
  } catch (error) {
    console.error("batchInsert failed:", error);
    return {};
  }
};

const batchInsert = async (params: {
  ListName: string;
  responseData: Record<string, unknown>[];
}): Promise<boolean> => {
  try {
    const [batchedSP, execute] = getSP().batched();
    const list = batchedSP.web.lists.getByTitle(params.ListName);

    // Queue operations — must happen BEFORE execute().
    const promises = params.responseData.map((data) => list.items.add(data));

    await execute();
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("batchInsert failed:", error);
    return false;
  }
};

/**
 * Batch-updates multiple items. Each object must include an ID field.
 *
 * @example
 * await SPService.batchUpdate({
 *   ListName: "Tasks",
 *   responseData: [{ ID: 1, Status: "Closed" }, { ID: 2, Status: "Closed" }]
 * });
 */
const batchUpdate = async (params: {
  ListName: string;
  responseData: (Record<string, unknown> & { ID: number })[];
}): Promise<boolean> => {
  try {
    const [batchedSP, execute] = getSP().batched();
    const list = batchedSP.web.lists.getByTitle(params.ListName);

    const promises = params.responseData.map(({ ID, ...rest }) =>
      list.items.getById(ID).update(rest)
    );

    await execute();
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("batchUpdate failed:", error);
    return false;
  }
};

/**
 * Batch-deletes multiple items. Each object must include an ID field.
 *
 * @example
 * await SPService.batchDelete({
 *   ListName: "Tasks",
 *   responseData: [{ ID: 1 }, { ID: 2 }]
 * });
 */
const batchDelete = async (params: {
  ListName: string;
  responseData: { ID: number }[];
}): Promise<boolean> => {
  try {
    const [batchedSP, execute] = getSP().batched();
    const list = batchedSP.web.lists.getByTitle(params.ListName);

    const promises = params.responseData.map(({ ID }) =>
      list.items.getById(ID).delete()
    );

    await execute();
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("batchDelete failed:", error);
    return false;
  }
};

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Splits an array into chunks. Useful when building batched "in" OData filters.
 *
 * @example
 * const chunks = SPService.ArraySpiltInOperator([1,2,3,4,5], 2);
 * // → [[1,2],[3,4],[5]]
 */
const ArraySpiltInOperator = <T>(ids: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    result.push(ids.slice(i, i + chunkSize));
  }
  return result;
};

// ─── Grouped List Helper ─────────────────────────────────────────────────────

/**
 * Produces Fluent UI DetailsList group metadata from a flat data array.
 *
 * The fix for the implicit-any TS error: declare indexed rows as
 * Record<string,unknown> so bracket-notation access is always typed.
 *
 * @example
 * const groups = SPService.SPDetailsListGroupItems({ Data: items, Column: "Department" });
 */
const SPDetailsListGroupItems = (
  params: IDetailsListGroup
): { key: unknown; name: unknown; startIndex: number; count: number }[] => {
  // Explicitly type as Record<string,unknown> so `row[params.Column]` compiles.
  type IndexedRow = Record<string, unknown> & { __idx: number };

  const indexed: IndexedRow[] = params.Data.map((row, idx) => ({
    ...row,
    __idx: idx,
  }));

  // Deduplicate preserving first-occurrence order.
  const seen = new Set<unknown>();
  const unique: IndexedRow[] = [];
  for (const row of indexed) {
    const val = row[params.Column];
    if (!seen.has(val)) {
      seen.add(val);
      unique.push(row);
    }
  }

  return unique.map((ur) => {
    const key = ur[params.Column];
    const count = indexed.filter((r) => r[params.Column] === key).length;
    return { key, name: key, startIndex: ur.__idx, count };
  });
};

// ─── Document Library ────────────────────────────────────────────────────────

/**
 * Returns IDocFiles metadata for every file in a document library folder.
 *
 * @example
 * const files = await SPService.getDocLibFiles({
 *   FilePath: "/sites/HR/Shared Documents/Policies"
 * });
 */
const getDocLibFiles = async (params: IGetDocLibFiles): Promise<IDocFiles[]> => {
  try {
    const files = await getSP().web
      .getFolderByServerRelativePath(params.FilePath)
      .files();

    return files.map((f) => ({
      name: f.Name,
      content: f.ServerRelativeUrl,
      type: "Inlist" as const,
    }));
  } catch (err) {
    console.error("getDocLibFiles error:", err);
    return [];
  }
};

/**
 * Creates sub-folders, deletes marked files, then uploads new files.
 *
 * PnPjs v3 note: folders.addUsingPath() returns IFolderInfo directly.
 * ServerRelativeUrl is a top-level property — there is NO .data wrapper
 * as there was in PnPjs v2.
 *
 * @example
 * await SPService.addDocLibFiles({
 *   FilePath: "/sites/HR/Shared Documents",
 *   FolderNames: ["2024", "Q1"],
 *   Datas: [
 *     { name: "old.pdf", content: "", type: "Delete" },
 *     { name: "new.pdf", content: arrayBuffer, type: "New" }
 *   ]
 * });
 */
const addDocLibFiles = async (params: IAddDocLibFiles): Promise<IDocFiles[]> => {
  const sp = getSP();
  let currentPath = params.FilePath;

  const toDelete = params.Datas.filter((f) => f.type === "Delete");
  const toAdd = params.Datas.filter((f) => f.type === "New");

  // Create sub-folder hierarchy.
  if (params.FolderNames.length) {
    for (const folderName of params.FolderNames) {
      // v3: addUsingPath returns IFolderInfo — access ServerRelativeUrl directly.
      const folderInfo = await sp.web
        .getFolderByServerRelativePath(currentPath)
        .folders.addUsingPath(folderName, true);
      currentPath = folderInfo.ServerRelativeUrl;
    }
  }

  // Delete files first.
  for (const file of toDelete) {
    try {
      await sp.web
        .getFolderByServerRelativePath(currentPath)
        .files.getByUrl(file.name)
        .delete();
    } catch (err) {
      console.error("addDocLibFiles — delete error:", err);
    }
  }

  // Upload new files.
  for (const file of toAdd) {
    try {
      await sp.web
        .getFolderByServerRelativePath(currentPath)
        .files.addUsingPath(file.name, file.content as string, { Overwrite: true });
    } catch (err) {
      console.error("addDocLibFiles — upload error:", err);
    }
  }

  return currentPath ? getDocLibFiles({ FilePath: currentPath }) : [];
};

// ─── CAML Query ──────────────────────────────────────────────────────────────

const _formatCamlQuery = (params: ICAMLQuery): Required<ICAMLQuery> => ({
  Listname: params.Listname,
  Select: params.Select ?? [],
  Filter: params.Filter ?? [],
  FilterCondition: params.FilterCondition ?? "AND",
  Topcount: params.Topcount ?? 5000,
  Orderby: params.Orderby ?? "ID",
  Orderbydecorasc: params.Orderbydecorasc ?? true,
  Expand: params.Expand ?? [],
});

const _buildCAMLCondition = (filter: ICAMLFilter): string => {
  const condOp = filter.condition ?? "Eq";
  const isLookup = filter.type === "Lookup";
  const values = Array.isArray(filter.value) ? filter.value : [filter.value];
  const fieldType = isLookup ? "Integer" : filter.type;
  const lookupAttr = isLookup ? ' LookupId="TRUE"' : "";

  if (values.length > 1) {
    const valueNodes = values.map((v) => `<Value Type="${fieldType}">${v}</Value>`).join("");
    return `<In><FieldRef Name="${filter.field}"${lookupAttr} /><Values>${valueNodes}</Values></In>`;
  }

  return (
    `<${condOp}><FieldRef Name="${filter.field}"${lookupAttr} />` +
    `<Value Type="${fieldType}">${values[0]}</Value></${condOp}>`
  );
};

/**
 * Executes a dynamically-built CAML query.
 * Preferred over OData for large lists or complex Lookup/multi-value filters.
 * Performs a second OData pass when Expand fields are present.
 *
 * @example
 * const items = await SPService.SPReadItemsCamelQuery({
 *   Listname: "Tasks",
 *   Select: ["ID", "Title", "AssignedTo/Title"],
 *   Expand: ["AssignedTo"],
 *   Filter: [{ field: "Status", type: "Choice", value: "Active" }],
 *   FilterCondition: "AND"
 * });
 */
const SPReadItemsCamelQuery = async (rawParams: ICAMLQuery): Promise<unknown[]> => {
  const params = _formatCamlQuery(rawParams);

  const conditions = params.Filter.map(_buildCAMLCondition).filter(Boolean);

  let whereXml = "";
  if (conditions.length === 1) {
    whereXml = conditions[0];
  } else if (conditions.length > 1) {
    const op = params.FilterCondition === "OR" ? "Or" : "And";
    whereXml = `<${op}>${conditions.join("")}</${op}>`;
  }

  const viewFieldsXml = params.Select.map((f) => {
    const fieldName = f.includes("/") ? f.split("/")[0] : f;
    const lookupAttr = f.includes("/") ? ' LookupId="TRUE"' : "";
    return `<FieldRef Name="${fieldName}"${lookupAttr} />`;
  }).join("");

  const camlQuery = [
    "<View>",
    `<Query><Where>${whereXml}</Where></Query>`,
    `<ViewFields>${viewFieldsXml}</ViewFields>`,
    `<RowLimit>${params.Topcount}</RowLimit>`,
    "</View>",
  ].join("");

  const sp = getSP();
  const camlResults: Record<string, unknown>[] = await sp.web.lists
    .getByTitle(params.Listname)
    .getItemsByCAMLQuery({ ViewXml: camlQuery });

  // Second pass with OData expand when lookup fields are requested.
  const expandFields = params.Expand.join(",");
  if (expandFields && camlResults.length) {
    const idFilter = camlResults
      .map((i) => `ID eq ${i["ID"] as number}`)
      .join(" or ");

    return sp.web.lists
      .getByTitle(params.Listname)
      .items.filter(idFilter)
      .select(params.Select.join(","))
      .expand(expandFields)();
  }

  return camlResults;
};

// ─── Default Export ───────────────────────────────────────────────────────────

const SPServices = {
  initSP,
  getSP,
  getAllUsers,
  SPAddItem,
  SPUpdateItem,
  SPDeleteItem,
  SPReadItems,
  SPGetItems,
  SPReadItemUsingId,
  SPAddAttachments,
  SPGetAttachments,
  SPDeleteAttachments,
  SPGetChoices,
  batchGet,
  batchInsert,
  batchUpdate,
  batchDelete,
  ArraySpiltInOperator,
  SPDetailsListGroupItems,
  getDocLibFiles,
  addDocLibFiles,
  SPReadItemsCamelQuery,
} as const;

export default SPServices;

// ─── React Hook Example (useSPList.ts) ───────────────────────────────────────
//
//  import { useState, useEffect } from "react";
//  import SPService, { IListItems } from "./SPService";
//
//  export function useSPList<T = unknown>(params: IListItems) {
//    const [items,   setItems]   = useState<T[]>([]);
//    const [loading, setLoading] = useState(true);
//    const [error,   setError]   = useState<Error | null>(null);
//
//    useEffect(() => {
//      let cancelled = false;
//      setLoading(true);
//      SPService.SPReadItems(params)
//        .then((data) => { if (!cancelled) setItems(data as T[]); })
//        .catch((err) => { if (!cancelled) setError(err as Error); })
//        .finally(()  => { if (!cancelled) setLoading(false); });
//      return () => { cancelled = true; }; // prevents stale state on unmount
//    // eslint-disable-next-line react-hooks/exhaustive-deps
//    }, [params.Listname]);
//
//    return { items, loading, error };
//  }
//
//  // Usage inside a component:
//  // interface ITask { ID: number; Title: string; Status: string; }
//  //
//  // const { items, loading, error } = useSPList<ITask>({
//  //   Listname: "Tasks",
//  //   Select: "ID,Title,Status",
//  //   Filter: [{ FilterKey: "Status", Operator: "eq", FilterValue: "Active" }],
//  // });
//  //
//  // if (loading) return <Spinner />;
//  // if (error)   return <MessageBar>{error.message}</MessageBar>;
//  // return <DetailsList items={items} ... />;