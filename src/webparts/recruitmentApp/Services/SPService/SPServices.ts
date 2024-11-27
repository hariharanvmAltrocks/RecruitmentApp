// import { sp } from "@pnp/sp";
import { sp } from "@pnp/sp/presets/all";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import { IAddDocLibFiles, IAddList, IAttachDelete, IDetailsListGroup, IDocFiles, IFilter, IGetDocLibFiles, IListItems, IListItemUsingId, ISPAttachment, ISPList, ISPListChoiceField, IUpdateList } from "./ISPServicesProps";


//import { Web } from "@pnp/sp/webs";


const getAllUsers = async (): Promise<[]> => {
    // sp.setup({   sp: {     
    //   baseUrl: "https://altrocks1.sharepoint.com/sites/HRMSDev2"   }, });
    return await sp.web.siteUsers();
};






const SPAddItem = async (params: IAddList): Promise<IItemAddResult> => {

    return await sp.web.lists
        .getByTitle(params.Listname)
        .items.add(params.RequestJSON);
};
const SPUpdateItem = async (params: IUpdateList): Promise<IItemAddResult> => {
    return await sp.web.lists
        .getByTitle(params.Listname)
        .items.getById(params.ID)
        .update(params.RequestJSON);
};


const SPDeleteItem = async (params: ISPList): Promise<boolean> => {
    try {
        await sp.web.lists
            .getByTitle(params.Listname)
            .items.getById(params.ID)
            .delete();
        return true; // Successfully deleted
    } catch (error) {
        console.error("Error deleting item:", error);
        return false; // Failed to delete
    }
};
const formatInputs = (data: IListItems): IListItems => {
    data.Filter = data.Filter || [];
    !data.Select ? (data.Select = "*") : "";
    !data.Topcount ? (data.Topcount = 5000) : "";
    !data.Orderby ? (data.Orderby = "ID") : "";
    !data.Expand ? (data.Expand = "") : "";
    !data.Orderbydecorasc == true && !data.Orderbydecorasc == false
        ? (data.Orderbydecorasc = true)
        : "";
    !data.PageCount ? (data.PageCount = 10) : "";
    !data.PageNumber ? (data.PageNumber = 1) : "";

    return data;
};
const formatFilterValue = (
    params: IFilter[],
    filterCondition: string
): string => {
    let strFilter: string = "";
    const maxBatchSize = 100; // Define a maximum batch size for the in condition

    if (params) {
        for (let i = 0; i < params.length; i++) {
            if (params[i].FilterKey) {
                if (i != 0) {
                    if (filterCondition == "and" || filterCondition == "or") {
                        strFilter += " " + filterCondition + " ";
                    } else {
                        strFilter += " and ";
                    }
                }

                const operator = params[i].Operator.toLocaleLowerCase();
                const values = params[i].FilterValue instanceof Array ? params[i].FilterValue : [params[i].FilterValue];

                if (
                    operator == "eq" ||
                    operator == "ne" ||
                    operator == "gt" ||
                    operator == "lt" ||
                    operator == "ge" ||
                    operator == "le"
                ) {
                    strFilter +=
                        params[i].FilterKey +
                        " " +
                        params[i].Operator +
                        " '" +
                        params[i].FilterValue +
                        "'";
                } else if (operator == "substringof") {
                    strFilter +=
                        params[i].Operator +
                        "('" +
                        params[i].FilterKey +
                        "','" +
                        params[i].FilterValue +
                        "')";
                } else if (operator == "in") {
                    strFilter += "(";
                    for (let j = 0; j < values.length; j++) {
                        if (j % maxBatchSize === 0 && j !== 0) {
                            strFilter += ") or (";
                        } else if (j !== 0) {
                            strFilter += " or ";
                        }
                        strFilter += params[i].FilterKey + " eq '" + values[j] + "'";

                    }
                    strFilter += ")";
                } else if (operator == "nin") {
                    strFilter += "(";
                    for (let j = 0; j < values.length; j++) {
                        if (j % maxBatchSize === 0 && j !== 0) {
                            strFilter += ") and (";
                        } else if (j !== 0) {
                            strFilter += " and ";
                        }
                        strFilter += params[i].FilterKey + " ne '" + values[j] + "'";

                    }
                    strFilter += ")";
                }
            }
        }
    }
    return strFilter;
};

const SPReadItems = async (params: IListItems): Promise<any[]> => {
    params = formatInputs(params);
    let filterValue: string = formatFilterValue(
        params.Filter || [],
        params.FilterCondition ? params.FilterCondition : ""
    );

    let allItems: any[] = [];
    let pagedItems = await sp.web.lists
        .getByTitle(params.Listname)
        .items.select(params.Select)
        .filter(filterValue)
        .expand(params.Expand)
        .top(params.Topcount)
        .orderBy(params.Orderby, params.Orderbydecorasc)
        .getPaged();



    allItems = allItems.concat(pagedItems.results);
    while (pagedItems.hasNext) {
        pagedItems = await pagedItems.getNext();
        allItems = allItems.concat(pagedItems.results);
    }
    return allItems;
};

const SPReadItemUsingId = async (params: IListItemUsingId): Promise<[]> => {
    return await sp.web.lists
        .getByTitle(params.Listname)
        .items.getById(params.SelectedId)
        .select(params.Select ? params.Select : "*")
        .expand(params.Expand ? params.Expand : "")
        .get();
};

const SPAddAttachments = async (params: ISPAttachment) => {
    const files: any[] = params.Attachments;
    return await sp.web.lists
        .getByTitle(params.ListName)
        .items.getById(params.ListID)
        .attachmentFiles.addMultiple(files);
};

const getDocLibFiles = async (params: IGetDocLibFiles): Promise<object[]> => {
    let FilesArr: IDocFiles[] = [];
    await sp.web
        .getFolderByServerRelativePath(params.FilePath)
        .files.get()
        .then((DocRes) => {
            if (DocRes.length) {
                DocRes.forEach((item) => {
                    FilesArr.push({
                        name: item.Name,
                        content: item.ServerRelativeUrl,
                        type: "Inlist",
                    });
                });
            }
        })
        .catch((err) => console.log(err, "Get Document Library Files"));
    return FilesArr;
};

const SPGetAttachments = async (params: ISPList) => {
    const item: any = sp.web.lists
        .getByTitle(params.Listname)
        .items.getById(params.ID);
    return await item.attachmentFiles();
};

const SPDeleteAttachments = async (params: IAttachDelete) => {
    return await sp.web.lists
        .getByTitle(params.ListName)
        .items.getById(params.ListID)
        .attachmentFiles.getByName(params.AttachmentName)
        .delete();
};

const SPGetChoices = async (params: ISPListChoiceField) => {
    return await sp.web.lists
        .getByTitle(params.Listname)
        .fields.getByInternalNameOrTitle(params.FieldName)
        .get();
};

const SPDetailsListGroupItems = async (params: IDetailsListGroup) => {
    let newRecords: { Lesson: any, indexValue: number }[] = [];
    params.Data.forEach((arr, index) => {
        newRecords.push({
            Lesson: arr[params.Column],
            indexValue: index,
        });
    });

    let varGroup: { key: any, name: any, startIndex: number, count: number }[] = [];
    let UniqueRecords = newRecords.reduce(function (item: { Lesson: any; indexValue: number }[], e1: { Lesson: any; indexValue: number }) {
        let matches = item.filter(function (e2) {
            return (e1[params.Column as keyof typeof e1] as any) === e2[params.Column as keyof typeof e2];
        });

        if (matches.length === 0) {
            item.push(e1);
        }
        return item;
    }, []);

    UniqueRecords.forEach((ur: { [key: string]: any; indexValue: number }) => {
        let recordLength = newRecords.filter((arr) => {
            return (arr[params.Column as keyof typeof arr] as any) == (ur[params.Column] as any);
        }).length;
        varGroup.push({
            key: ur[params.Column],
            name: ur[params.Column],
            startIndex: ur.indexValue,
            count: recordLength,
        });
    });
    // console.log([...varGroup]);
    return varGroup;
};

// const readItemsFromSharepointListForDashbaord = async (
//   params: IListItems
// ): Promise<[]> => {
//   params = formatInputs(params);
//   let filterValue: string = formatFilterValue(
//     params.Filter || [], 
//     params.FilterCondition ? params.FilterCondition : ""
//   );
//   let skipcount = (params.PageNumber?.valueOf() || 1) * (params.PageCount?.valueOf() || 1) - (params.PageCount?.valueOf() || 1);


//   return await sp.web.lists
//     .getByTitle(params.Listname)
//     .items.select(params.Select)
//     .filter(filterValue)
//     .expand(params.Expand)
//     .skip(skipcount)
//     .top(params.PageCount)
//     .orderBy(params.Orderby, params.Orderbydecorasc)
//     .get();
// };

// const batchInsert = async (params: {
//   ListName: string;
//   responseData: any[];
// }): Promise<any> => {
//   const list = sp.web.lists.getByTitle(params.ListName);
//   const batch = sp.web.createBatch();
//   const promises: any[] = [];

//   for (const data of params.responseData) {
//     const promise = list.items.inBatch(batch).add(data);
//     promises.push(promise);
//   }

//   await batch
//     .execute()
//     .then(() => {
//       return promises;
//     })
//     .catch((error: Error) => console.log(error));

// };



const batchInsert = async (params: {
    ListName: string;
    responseData: any[];
}): Promise<boolean> => {
    try {
        const list = sp.web.lists.getByTitle(params.ListName);
        const batch = sp.web.createBatch();
        const promises: Promise<any>[] = [];

        for (const data of params.responseData) {
            // const promise = list.items.getById(data.ID).inBatch(batch).update(data);
            const promise = list.items.inBatch(batch).add(data);
            promises.push(promise);
        }

        await batch.execute();

        // Wait for all promises to resolve
        await Promise.all(promises);

        return true;
    } catch (error) {
        console.error("Batch batchInsert failed: ", error);
        return false;
    }
};



const batchUpdate = async (params: {
    ListName: string;
    responseData: any[];
}): Promise<boolean> => {
    try {
        const list = sp.web.lists.getByTitle(params.ListName);
        const batch = sp.web.createBatch();
        const promises: Promise<any>[] = [];

        for (const data of params.responseData) {
            const promise = list.items.getById(data.ID).inBatch(batch).update(data);
            promises.push(promise);
        }

        await batch.execute();

        // Wait for all promises to resolve
        await Promise.all(promises);

        return true;
    } catch (error) {
        console.error("Batch update failed: ", error);
        return false;
    }
};

const batchDelete = async (params: {
    ListName: string;
    responseData: any[];
}): Promise<any> => {
    const list = sp.web.lists.getByTitle(params.ListName);
    const batch = sp.web.createBatch();
    const promises: any[] = [];

    for (const data of params.responseData) {
        const promise = list.items.getById(data.ID).inBatch(batch).delete();
        promises.push(promise);
    }

    await batch
        .execute()
        .then(() => {
            return promises;
        })
        .catch((error: Error) => console.log(error));
};







const ArraySpiltInOperator = (ids: any[], Arraylength: number) => {
    const result = [];
    for (let i = 0; i < ids.length; i += Arraylength) {
        const ArraySeparatedValue = ids.slice(i, i + Arraylength);
        result.push(ArraySeparatedValue);
    }
    return result;

}

const SPGetItems = async (params: IListItems): Promise<any[]> => {
    params = formatInputs(params);
    let filterValue: string = formatFilterValue(
        params.Filter || [],
        params.FilterCondition ? params.FilterCondition : ""
    );
    let allItems: any[] = [];
    let pagedItems = await sp.web.lists
        .getByTitle(params.Listname)
        .items.select(params.Select)
        .filter(filterValue)
        .expand(params.Expand)
        .top(params.Topcount)
        .orderBy(params.Orderby, params.Orderbydecorasc)
        .getPaged();
    allItems = allItems.concat(pagedItems.results);
    while (pagedItems.hasNext) {
        pagedItems = await pagedItems.getNext();
        allItems = allItems.concat(pagedItems.results);
    }
    return allItems;
};




const formatcamelquery = (params: any): any => {
    // Ensure 'params' is an object and not null or undefined
    if (!params || typeof params !== 'object') {
        throw new Error('Invalid parameters: must be an object');
    }

    // Default values for optional parameters
    const defaultParams = {
        Listname: '',
        Select: [],
        Filter: [],
        FilterCondition: '', // Can be 'AND' or 'OR'
        Topcount: 5000, // Default number of items to fetch
        Orderby: 'ID',
        Orderbydecorasc: true, // true for ascending, false for descending
        Expand: [],
    };

    // Merge default parameters with provided parameters
    const formattedParams: any = { ...defaultParams, ...params };

    // Ensure 'Select' is an array of strings
    if (!Array.isArray(formattedParams.Select) || !formattedParams.Select.every((item: any) => typeof item === 'string')) {
        formattedParams.Select = defaultParams.Select;
    }

    // Ensure 'Filter' is an array of filter objects
    if (!Array.isArray(formattedParams.Filter) || !formattedParams.Filter.every((filter: any) => {
        return (
            filter &&
            typeof filter.field === 'string' &&
            typeof filter.type === 'string' &&
            (Array.isArray(filter.value) || typeof filter.value === 'string')
        );
    })) {
        console.log("Invalid filter format:", formattedParams.Filter);
        formattedParams.Filter = defaultParams.Filter;
    }


    // Ensure 'Expand' is an array of strings
    if (!Array.isArray(formattedParams.Expand) || !formattedParams.Expand.every((item: any) => typeof item === 'string')) {
        formattedParams.Expand = defaultParams.Expand;
    }

    // Ensure 'Topcount' is a positive integer
    if (typeof formattedParams.Topcount !== 'number' || formattedParams.Topcount <= 0) {
        formattedParams.Topcount = defaultParams.Topcount;
    }

    // Ensure 'Orderby' is a string
    if (typeof formattedParams.Orderby !== 'string') {
        formattedParams.Orderby = defaultParams.Orderby;
    }

    // Ensure 'Orderbydecorasc' is a boolean
    if (typeof formattedParams.Orderbydecorasc !== 'boolean') {
        formattedParams.Orderbydecorasc = defaultParams.Orderbydecorasc;
    }

    // Ensure 'FilterCondition' is either 'AND' or 'OR'
    if (formattedParams.FilterCondition !== 'AND' && formattedParams.FilterCondition !== 'OR') {
        formattedParams.FilterCondition = defaultParams.FilterCondition;
    }

    return formattedParams;
};

const SPReadItemsCamelQuery = async (params: any): Promise<any[]> => {
    // Format inputs if necessary
    params = formatcamelquery(params);
    //console.log("Formatted params:", params);

    // Helper function to create CAML filter for multiple values and handle Neq condition
    const createFilterCAML = (filter: { field: string; type: string; value: any | string, condition?: string }): string => {
        const fieldType = filter.type === 'Choice' ? 'Choice' : filter.type; // Ensure we use 'Choice' type for Choice fields
        const conditionType = filter.condition === 'Neq' ? 'Neq' : 'Eq'; // Use Neq or Eq based on the condition

        if (filter.type === 'Lookup') {
            // Handle Lookup fields
            if (Array.isArray(filter.value)) {
                if (filter.value.length > 0) {
                    const valueList = filter.value.map(val => `<Value Type="Integer">${val}</Value>`).join('');
                    return `<In><FieldRef Name="${filter.field}" LookupId="TRUE" /><Values>${valueList}</Values></In>`;
                }
            } else if (filter.value !== undefined && filter.value !== null) {
                return `<${conditionType}><FieldRef Name="${filter.field}" LookupId="TRUE" /><Value Type="Integer">${filter.value}</Value></${conditionType}>`;
            }
        } else if (Array.isArray(filter.value)) {
            if (filter.value.length > 0) {
                const valueList = filter.value.map(val => `<Value Type="${fieldType}">${val}</Value>`).join('');
                return `<In><FieldRef Name="${filter.field}" /><Values>${valueList}</Values></In>`;
            }
        } else if (filter.value !== undefined && filter.value !== null) {
            return `<${conditionType}><FieldRef Name="${filter.field}" /><Value Type="${fieldType}">${filter.value}</Value></${conditionType}>`;
        }
        return '';
    };

    // Construct the CAML query
    let camlQuery = '<View><Query><Where>';
    let conditions: string[] = [];

    // Process multiple filters dynamically
    if (params.Filter && Array.isArray(params.Filter)) {
        conditions = params.Filter.map((filter: any) => {
            return createFilterCAML(filter);
        }).filter((condition: any) => condition !== '');

        if (conditions.length > 0) {
            // Combine conditions with <And> or <Or> based on FilterCondition
            const conditionOperator = params.FilterCondition ? (params.FilterCondition === 'OR' ? 'Or' : 'And') : "";
            //console.log("Generated CAML Query: conditionOperator", conditionOperator);
            if (conditionOperator !== "") {
                camlQuery += `<${conditionOperator}>`;
                camlQuery += conditions.join('');
                camlQuery += `</${conditionOperator}>`;
            } else {
                camlQuery += conditions.join('');
            }
        }
    }

    camlQuery += '</Where></Query><ViewFields>';

    // Include dynamically selected fields in the ViewFields
    params.Select.forEach((field: string) => {
        if (field.includes('/')) {
            const lookupField = field.split('/')[0]; // Extract the main lookup field
            camlQuery += `<FieldRef Name="${lookupField}" LookupId="TRUE" />`;
        } else {
            camlQuery += `<FieldRef Name="${field}" />`;
        }
    });

    camlQuery += '</ViewFields></View>';
    //console.log("Generated CAML Query:", camlQuery);

    // Define dynamically selected and expanded fields
    const selectFields = params.Select.join(',');
    const expandFields = params.Expand ? params.Expand.join(',') : '';

    try {
        // Fetch items using the CAML query
        const camlResponse = await sp.web.lists
            .getByTitle(params.Listname)
            .getItemsByCAMLQuery({ ViewXml: camlQuery });

        // If there are lookup or other expanded fields, fetch them using select and expand
        if (expandFields) {
            const finalResponse = await sp.web.lists
                .getByTitle(params.Listname)
                .items
                .filter(`ID eq ${camlResponse.map((item: any) => item.ID).join(" or ID eq ")}`)
                .select(selectFields) // Dynamically select fields
                .expand(expandFields)  // Dynamically expand lookup fields
                .get();

            return finalResponse;
        } else {
            return camlResponse;
        }
    } catch (error) {
        console.error("Error fetching items with CAML query:", error);
        throw error;
    }
};


const addDocLibFiles = async (params: IAddDocLibFiles) => {
    let getFilePath: string = params.FilePath;
    let delAttachments: IDocFiles[] = [];
    let addAttachments: IDocFiles[] = [];
    if (params.Datas.length) {
        delAttachments = params.Datas.filter((files: IDocFiles) => {
            return files.type == "Delete";
        });

        addAttachments = params.Datas.filter((files: IDocFiles) => {
            return files.type == "New";
        });
    }
    if (params.FolderNames.length) {
        for (let j: number = 0; j < params.FolderNames.length; j++) {
            await sp.web
                .getFolderByServerRelativePath(getFilePath)
                .folders.addUsingPath(params.FolderNames[j], true)
                .then(async (res) => {
                    getFilePath = res.data.ServerRelativeUrl;
                    if (j === params.FolderNames.length - 1 && delAttachments.length) {
                        for (let k: number = 0; k < delAttachments.length; k++) {
                            await sp.web
                                .getFolderByServerRelativePath(getFilePath)
                                .files.getByName(delAttachments[k].name)
                                .delete()
                                .then(async (res: any) => {
                                    if (
                                        addAttachments.length &&
                                        delAttachments.length - 1 === k
                                    ) {
                                        for (let i: number = 0; i < addAttachments.length; i++) {
                                            await sp.web
                                                .getFolderByServerRelativePath(getFilePath)
                                                .files.addUsingPath(
                                                    addAttachments[i].name,
                                                    addAttachments[i].content,
                                                    {
                                                        Overwrite: true,
                                                    }
                                                )
                                                .then((file: any) => { })
                                                .catch((error) => {
                                                    console.log("Error creating file", error);
                                                });
                                        }
                                    }
                                })
                                .catch((error) => {
                                    console.log("Delete  attachements", error);
                                });
                        }
                    } else if (
                        j === params.FolderNames.length - 1 &&
                        addAttachments.length
                    ) {
                        for (let z: number = 0; z < addAttachments.length; z++) {
                            await sp.web
                                .getFolderByServerRelativePath(getFilePath)
                                .files.addUsingPath(
                                    addAttachments[z].name,
                                    addAttachments[z].content,
                                    {
                                        Overwrite: true,
                                    }
                                )
                                .then((file: any) => { })
                                .catch((error) => {
                                    console.log("Error creating file", error);
                                });
                        }
                    }
                })
                .catch((err) => console.log("creating folder", err));
        }
    } else {
        getFilePath = params.FilePath;
        if (delAttachments.length) {
            for (let i: number = 0; i < delAttachments.length; i++) {
                await sp.web
                    .getFolderByServerRelativePath(getFilePath)
                    .files.getByName(delAttachments[i].name)
                    .delete()
                    .then(async (res: any) => {
                        if (addAttachments.length && delAttachments.length - 1 === i) {
                            for (let j: number = 0; j < addAttachments.length; j++) {
                                await sp.web
                                    .getFolderByServerRelativePath(getFilePath)
                                    .files.addUsingPath(
                                        addAttachments[j].name,
                                        addAttachments[j].content,
                                        {
                                            Overwrite: true,
                                        }
                                    )
                                    .then((file: any) => { })
                                    .catch((error) => {
                                        console.log("Error creating file", error);
                                    });
                            }
                        }
                    })
                    .catch((error) => console.log("Delete attachements", error));
            }
        } else if (addAttachments.length) {
            for (let i: number = 0; i < addAttachments.length; i++) {
                await sp.web
                    .getFolderByServerRelativePath(params.FilePath)
                    .files.addUsingPath(
                        addAttachments[i].name,
                        addAttachments[i].content,
                        {
                            Overwrite: true,
                        }
                    )
                    .then((file: any) => { })
                    .catch((error) => {
                        console.log("Error creating file", error);
                    });
            }
        }
    }

    return getFilePath ? getDocLibFiles({ FilePath: getFilePath }) : [];
    // return getFilePath
};


export default {
    getAllUsers,
    SPAddItem,
    SPUpdateItem,
    SPDeleteItem,
    SPReadItems,
    SPDetailsListGroupItems,
    SPGetChoices,
    SPAddAttachments,
    SPGetAttachments,
    SPDeleteAttachments,
    SPReadItemUsingId,
    batchInsert,
    batchUpdate,
    batchDelete,
    ArraySpiltInOperator,
    SPGetItems,
    SPReadItemsCamelQuery,
    getDocLibFiles,
    addDocLibFiles
};
