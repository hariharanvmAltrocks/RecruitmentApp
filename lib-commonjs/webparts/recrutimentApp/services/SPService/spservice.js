"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSP = exports.initSP = void 0;
var tslib_1 = require("tslib");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/attachments");
require("@pnp/sp/files");
require("@pnp/sp/folders");
require("@pnp/sp/fields");
require("@pnp/sp/site-users/web");
require("@pnp/sp/site-groups/web");
require("@pnp/sp/batching");
var sp_1 = require("@pnp/sp");
var _sp;
var initSP = function (context) {
    _sp = (0, sp_1.spfi)().using((0, sp_1.SPFx)(context));
};
exports.initSP = initSP;
var getSP = function () {
    if (!_sp) {
        throw new Error("PnPjs has not been initialised. Call initSP(this.context) inside onInit().");
    }
    return _sp;
};
exports.getSP = getSP;
var _formatInputs = function (data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return ({
        Listname: data.Listname,
        Filter: (_a = data.Filter) !== null && _a !== void 0 ? _a : [],
        Select: (_b = data.Select) !== null && _b !== void 0 ? _b : "*",
        Topcount: (_c = data.Topcount) !== null && _c !== void 0 ? _c : 5000,
        Orderby: (_d = data.Orderby) !== null && _d !== void 0 ? _d : "ID",
        Expand: (_e = data.Expand) !== null && _e !== void 0 ? _e : "",
        Orderbydecorasc: (_f = data.Orderbydecorasc) !== null && _f !== void 0 ? _f : true,
        PageCount: (_g = data.PageCount) !== null && _g !== void 0 ? _g : 10,
        PageNumber: (_h = data.PageNumber) !== null && _h !== void 0 ? _h : 1,
        FilterCondition: (_j = data.FilterCondition) !== null && _j !== void 0 ? _j : "and",
    });
};
var _buildODataFilter = function (filters, filterCondition) {
    var _a;
    if (!(filters === null || filters === void 0 ? void 0 : filters.length))
        return "";
    var MAX_BATCH = 100;
    var parts = [];
    var _loop_1 = function (f) {
        // NEW LOGIC FOR OrFilters
        if (f.OrFilters && Array.isArray(f.OrFilters)) {
            var operator = (_a = f.Operator) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var groups = f.OrFilters.map(function (group) {
                var andParts = [];
                for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                    var item = group_1[_i];
                    if (!item.FilterKey)
                        continue;
                    var op_1 = item.Operator.toLowerCase();
                    var value = item.FilterValue;
                    if (["eq", "ne", "gt", "lt", "ge", "le"].includes(op_1)) {
                        andParts.push("".concat(item.FilterKey, " ").concat(item.Operator, " '").concat(value, "'"));
                    }
                }
                // INNER GROUP = AND
                return andParts.length > 1
                    ? "(".concat(andParts.join(" and "), ")")
                    : andParts[0];
            });
            // 🔥 KEY FIX HERE
            if (operator === "and") {
                parts.push("(".concat(groups.join(" and "), ")"));
            }
            else {
                parts.push("(".concat(groups.join(" or "), ")"));
            }
            return "continue";
        }
        // EXISTING LOGIC
        if (!f.FilterKey)
            return "continue";
        var op = f.Operator.toLowerCase();
        var values = Array.isArray(f.FilterValue)
            ? f.FilterValue
            : [f.FilterValue];
        if (["eq", "ne", "gt", "lt", "ge", "le"].includes(op)) {
            parts.push("".concat(f.FilterKey, " ").concat(f.Operator, " '").concat(f.FilterValue, "'"));
        }
        else if (op === "substringof") {
            parts.push("substringof('".concat(f.FilterValue, "','").concat(f.FilterKey, "')"));
        }
        else if (op === "in") {
            var chunks = [];
            for (var j = 0; j < values.length; j += MAX_BATCH) {
                var slice = values.slice(j, j + MAX_BATCH);
                chunks.push("(" + slice.map(function (v) { return "".concat(f.FilterKey, " eq '").concat(v, "'"); }).join(" or ") + ")");
            }
            parts.push(chunks.join(" or "));
        }
        else if (op === "nin") {
            var chunks = [];
            for (var j = 0; j < values.length; j += MAX_BATCH) {
                var slice = values.slice(j, j + MAX_BATCH);
                chunks.push("(" +
                    slice.map(function (v) { return "".concat(f.FilterKey, " ne '").concat(v, "'"); }).join(" and ") +
                    ")");
            }
            parts.push(chunks.join(" and "));
        }
    };
    for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
        var f = filters_1[_i];
        _loop_1(f);
    }
    var glue = filterCondition === "and" || filterCondition === "or"
        ? " ".concat(filterCondition, " ")
        : " and ";
    return parts.length > 1 ? "(".concat(parts.join(glue), ")") : parts[0];
};
// ─── Users ────────────────────────────────────────────────────────────────────
/** Returns all site users. Lazy — fires only when awaited. */
var getAllUsers = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getSP)().web.siteUsers()];
    });
}); };
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
var SPAddItem = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getSP)()
                .web.lists.getByTitle(params.Listname)
                .items.add(params.RequestJSON)];
    });
}); };
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
var SPUpdateItem = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getSP)()
                .web.lists.getByTitle(params.Listname)
                .items.getById(params.ID)
                .update(params.RequestJSON)];
    });
}); };
/**
 * Deletes an item by ID. Returns true on success, false on error.
 *
 * @example
 * const ok = await SPService.SPDeleteItem({ Listname: "Tasks", ID: 42 });
 */
var SPDeleteItem = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.getSP)()
                        .web.lists.getByTitle(params.Listname)
                        .items.getById(params.ID)
                        .delete()];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                error_1 = _a.sent();
                console.error("SPDeleteItem error:", error_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
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
var SPReadItems = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var p, filterStr, allItems, skip, pageSize, hasMore, items;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                p = _formatInputs(params);
                filterStr = _buildODataFilter(p.Filter, p.FilterCondition);
                allItems = [];
                skip = 0;
                pageSize = p.Topcount || 500;
                hasMore = true;
                _a.label = 1;
            case 1:
                if (!hasMore) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.getSP)()
                        .web.lists.getByTitle(p.Listname)
                        .items.select(p.Select)
                        .filter(filterStr)
                        .expand(p.Expand)
                        .orderBy(p.Orderby, p.Orderbydecorasc)
                        .top(pageSize)()];
            case 2:
                items = _a.sent();
                // .skip(skip)();
                allItems = tslib_1.__spreadArray(tslib_1.__spreadArray([], allItems, true), items, true);
                if (items.length < pageSize) {
                    hasMore = false;
                }
                else {
                    skip += pageSize;
                }
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, allItems];
        }
    });
}); };
/**
 * Reads a single page of items from a list, using ID-first paging.
 * This is highly optimized for large lists where server-side pagination ($skip) is unsupported.
 */
var SPReadItemsPaged = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var p, filterStr, pageNumber, pageSize, selectFields, selectStr, lightweightItems, totalCount, start, slicedLightweight, pageIds, idFilter, items, itemsMap, sortedItems;
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                p = _formatInputs(params);
                filterStr = _buildODataFilter(p.Filter, p.FilterCondition);
                pageNumber = (_a = p.PageNumber) !== null && _a !== void 0 ? _a : 1;
                pageSize = (_b = p.PageCount) !== null && _b !== void 0 ? _b : 10;
                selectFields = ["ID"];
                if (p.Orderby && p.Orderby !== "ID" && !p.Orderby.includes("/")) {
                    selectFields.push(p.Orderby);
                }
                selectStr = selectFields.join(",");
                return [4 /*yield*/, (0, exports.getSP)()
                        .web.lists.getByTitle(p.Listname)
                        .items.select(selectStr)
                        .filter(filterStr)
                        .orderBy(p.Orderby, p.Orderbydecorasc)
                        .top(5000)()];
            case 1:
                lightweightItems = _c.sent();
                totalCount = lightweightItems.length;
                if (totalCount === 0) {
                    return [2 /*return*/, { items: [], totalCount: 0 }];
                }
                start = (pageNumber - 1) * pageSize;
                slicedLightweight = lightweightItems.slice(start, start + pageSize);
                if (slicedLightweight.length === 0) {
                    return [2 /*return*/, { items: [], totalCount: totalCount }];
                }
                pageIds = slicedLightweight.map(function (item) { return item.ID; });
                idFilter = pageIds.map(function (id) { return "ID eq ".concat(id); }).join(" or ");
                return [4 /*yield*/, (0, exports.getSP)()
                        .web.lists.getByTitle(p.Listname)
                        .items.select(p.Select)
                        .filter(idFilter)
                        .expand(p.Expand)
                        .orderBy(p.Orderby, p.Orderbydecorasc)()];
            case 2:
                items = _c.sent();
                itemsMap = new Map(items.map(function (item) { return [item.ID, item]; }));
                sortedItems = pageIds.map(function (id) { return itemsMap.get(id); }).filter(Boolean);
                return [2 /*return*/, { items: sortedItems, totalCount: totalCount }];
        }
    });
}); };
var SPGetItems = SPReadItems;
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
var SPReadItemUsingId = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        // In PnPjs v3 a chainable IItem is callable — invoking () executes the request.
        return [2 /*return*/, (0, exports.getSP)()
                .web.lists.getByTitle(params.Listname)
                .items.getById(params.SelectedId)
                .select((_a = params.Select) !== null && _a !== void 0 ? _a : "*")
                .expand((_b = params.Expand) !== null && _b !== void 0 ? _b : "")()];
    });
}); };
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
var SPAddAttachments = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var item, _i, _a, att;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                item = (0, exports.getSP)()
                    .web.lists.getByTitle(params.ListName)
                    .items.getById(params.ListID);
                _i = 0, _a = params.Attachments;
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                att = _a[_i];
                return [4 /*yield*/, item.attachmentFiles.add(att.name, att.content)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
/** Returns attachment metadata for a list item. */
var SPGetAttachments = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getSP)()
                .web.lists.getByTitle(params.Listname)
                .items.getById(params.ID)
                .attachmentFiles()];
    });
}); };
/** Deletes a single named attachment from a list item. */
var SPDeleteAttachments = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSP)()
                    .web.lists.getByTitle(params.ListName)
                    .items.getById(params.ListID)
                    .attachmentFiles.getByName(params.AttachmentName)
                    .delete()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// ─── Field Metadata ───────────────────────────────────────────────────────────
/**
 * Retrieves field metadata (includes Choices array for Choice fields).
 *
 * @example
 * const fieldInfo = await SPService.SPGetChoices({ Listname: "Tasks", FieldName: "Status" });
 * console.log((fieldInfo as any).Choices);
 */
var SPGetChoices = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.getSP)()
                .web.lists.getByTitle(params.Listname)
                .fields.getByInternalNameOrTitle(params.FieldName)()];
    });
}); };
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
var batchGet = function (queries) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, batchedSP_1, execute, results_1, promises, error_2;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = (0, exports.getSP)().batched(), batchedSP_1 = _a[0], execute = _a[1];
                results_1 = {};
                promises = queries.map(function (q) {
                    var _a;
                    var _b, _c, _d;
                    var flatFilters = (q.Filter && q.Filter.flat()) || [];
                    var filterStr = _buildODataFilter(flatFilters, (_b = q.FilterCondition) !== null && _b !== void 0 ? _b : "and");
                    var request = (_a = batchedSP_1.web.lists
                        .getByTitle(q.ListName)
                        .items.filter(filterStr))
                        .select.apply(_a, ((_c = q.select) !== null && _c !== void 0 ? _c : ["*"])).expand((_d = q.expand) !== null && _d !== void 0 ? _d : [])
                        .top(5000);
                    return request().then(function (r) {
                        // console.log(r, "data");
                        if (!results_1[q.StateValue]) {
                            results_1[q.StateValue] = [];
                        }
                        // concat results
                        results_1[q.StateValue] = tslib_1.__spreadArray(tslib_1.__spreadArray([], results_1[q.StateValue], true), r, true);
                    });
                });
                return [4 /*yield*/, execute()];
            case 1:
                _b.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _b.sent();
                return [2 /*return*/, results_1];
            case 3:
                error_2 = _b.sent();
                console.error("batchInsert failed:", error_2);
                return [2 /*return*/, {}];
            case 4: return [2 /*return*/];
        }
    });
}); };
var batchInsert = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, batchedSP, execute, list_1, promises, error_3;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = (0, exports.getSP)().batched(), batchedSP = _a[0], execute = _a[1];
                list_1 = batchedSP.web.lists.getByTitle(params.ListName);
                promises = params.responseData.map(function (data) { return list_1.items.add(data); });
                return [4 /*yield*/, execute()];
            case 1:
                _b.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _b.sent();
                return [2 /*return*/, true];
            case 3:
                error_3 = _b.sent();
                console.error("batchInsert failed:", error_3);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Batch-updates multiple items. Each object must include an ID field.
 *
 * @example
 * await SPService.batchUpdate({
 *   ListName: "Tasks",
 *   responseData: [{ ID: 1, Status: "Closed" }, { ID: 2, Status: "Closed" }]
 * });
 */
var batchUpdate = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, batchedSP, execute, list_2, promises, error_4;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = (0, exports.getSP)().batched(), batchedSP = _a[0], execute = _a[1];
                list_2 = batchedSP.web.lists.getByTitle(params.ListName);
                promises = params.responseData.map(function (_a) {
                    var ID = _a.ID, rest = tslib_1.__rest(_a, ["ID"]);
                    return list_2.items.getById(ID).update(rest);
                });
                return [4 /*yield*/, execute()];
            case 1:
                _b.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _b.sent();
                return [2 /*return*/, true];
            case 3:
                error_4 = _b.sent();
                console.error("batchUpdate failed:", error_4);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Batch-deletes multiple items. Each object must include an ID field.
 *
 * @example
 * await SPService.batchDelete({
 *   ListName: "Tasks",
 *   responseData: [{ ID: 1 }, { ID: 2 }]
 * });
 */
var batchDelete = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, batchedSP, execute, list_3, promises, error_5;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = (0, exports.getSP)().batched(), batchedSP = _a[0], execute = _a[1];
                list_3 = batchedSP.web.lists.getByTitle(params.ListName);
                promises = params.responseData.map(function (_a) {
                    var ID = _a.ID;
                    return list_3.items.getById(ID).delete();
                });
                return [4 /*yield*/, execute()];
            case 1:
                _b.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _b.sent();
                return [2 /*return*/, true];
            case 3:
                error_5 = _b.sent();
                console.error("batchDelete failed:", error_5);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
// ─── Utility ──────────────────────────────────────────────────────────────────
/**
 * Splits an array into chunks. Useful when building batched "in" OData filters.
 *
 * @example
 * const chunks = SPService.ArraySpiltInOperator([1,2,3,4,5], 2);
 * // → [[1,2],[3,4],[5]]
 */
var ArraySpiltInOperator = function (ids, chunkSize) {
    var result = [];
    for (var i = 0; i < ids.length; i += chunkSize) {
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
var SPDetailsListGroupItems = function (params) {
    var indexed = params.Data.map(function (row, idx) { return (tslib_1.__assign(tslib_1.__assign({}, row), { __idx: idx })); });
    // Deduplicate preserving first-occurrence order.
    var seen = new Set();
    var unique = [];
    for (var _i = 0, indexed_1 = indexed; _i < indexed_1.length; _i++) {
        var row = indexed_1[_i];
        var val = row[params.Column];
        if (!seen.has(val)) {
            seen.add(val);
            unique.push(row);
        }
    }
    return unique.map(function (ur) {
        var key = ur[params.Column];
        var count = indexed.filter(function (r) { return r[params.Column] === key; }).length;
        return { key: key, name: key, startIndex: ur.__idx, count: count };
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
var getDocLibFiles = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var files, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.getSP)()
                        .web.getFolderByServerRelativePath(params.FilePath)
                        .files()];
            case 1:
                files = _a.sent();
                return [2 /*return*/, files.map(function (f, index) {
                        var _a, _b;
                        var bytes = Number(f.Length) || 0;
                        var mb = (bytes / (1024 * 1024)).toFixed(2);
                        var dateStr = f.TimeCreated
                            ? new Date(f.TimeCreated).toLocaleDateString()
                            : "Unknown";
                        var modified = f.TimeLastModified
                            ? new Date(f.TimeLastModified).toLocaleString()
                            : "Unknown";
                        return {
                            name: f.Name,
                            content: f.ServerRelativeUrl,
                            type: "Inlist",
                            id: (_a = f.UniqueId) !== null && _a !== void 0 ? _a : "file-".concat(index),
                            fileSizeBytes: bytes,
                            fileSizeMB: "".concat(mb, " MB"),
                            uploadedDate: dateStr,
                            downloadUrl: (_b = f.ServerRelativeUrl) !== null && _b !== void 0 ? _b : "#",
                            timeModified: modified,
                        };
                    })];
            case 2:
                err_1 = _a.sent();
                console.error("getDocLibFiles error:", err_1);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
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
var addDocLibFiles = function (params) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var sp, currentPath, toDelete, toAdd, _i, _a, folderName, folderInfo, _b, toDelete_1, file, err_2, _c, toAdd_1, file, err_3;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                sp = (0, exports.getSP)();
                currentPath = params.FilePath;
                toDelete = params.Datas.filter(function (f) { return f.type === "Delete"; });
                toAdd = params.Datas.filter(function (f) { return f.type === "New"; });
                if (!params.FolderNames.length) return [3 /*break*/, 4];
                _i = 0, _a = params.FolderNames;
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                folderName = _a[_i];
                return [4 /*yield*/, sp.web
                        .getFolderByServerRelativePath(currentPath)
                        .folders.addUsingPath(folderName, true)];
            case 2:
                folderInfo = _d.sent();
                currentPath = folderInfo.ServerRelativeUrl;
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                _b = 0, toDelete_1 = toDelete;
                _d.label = 5;
            case 5:
                if (!(_b < toDelete_1.length)) return [3 /*break*/, 10];
                file = toDelete_1[_b];
                _d.label = 6;
            case 6:
                _d.trys.push([6, 8, , 9]);
                return [4 /*yield*/, sp.web
                        .getFolderByServerRelativePath(currentPath)
                        .files.getByUrl(file.name)
                        .delete()];
            case 7:
                _d.sent();
                return [3 /*break*/, 9];
            case 8:
                err_2 = _d.sent();
                console.error("addDocLibFiles — delete error:", err_2);
                return [3 /*break*/, 9];
            case 9:
                _b++;
                return [3 /*break*/, 5];
            case 10:
                _c = 0, toAdd_1 = toAdd;
                _d.label = 11;
            case 11:
                if (!(_c < toAdd_1.length)) return [3 /*break*/, 16];
                file = toAdd_1[_c];
                _d.label = 12;
            case 12:
                _d.trys.push([12, 14, , 15]);
                return [4 /*yield*/, sp.web
                        .getFolderByServerRelativePath(currentPath)
                        .files.addUsingPath(file.name, file.content, {
                        Overwrite: true,
                    })];
            case 13:
                _d.sent();
                return [3 /*break*/, 15];
            case 14:
                err_3 = _d.sent();
                console.error("addDocLibFiles — upload error:", err_3);
                return [3 /*break*/, 15];
            case 15:
                _c++;
                return [3 /*break*/, 11];
            case 16: return [2 /*return*/, currentPath ? getDocLibFiles({ FilePath: currentPath }) : []];
        }
    });
}); };
// ─── CAML Query ──────────────────────────────────────────────────────────────
var _formatCamlQuery = function (params) {
    var _a, _b, _c, _d, _e, _f, _g;
    return ({
        Listname: params.Listname,
        Select: (_a = params.Select) !== null && _a !== void 0 ? _a : [],
        Filter: (_b = params.Filter) !== null && _b !== void 0 ? _b : [],
        FilterCondition: (_c = params.FilterCondition) !== null && _c !== void 0 ? _c : "AND",
        Topcount: (_d = params.Topcount) !== null && _d !== void 0 ? _d : 5000,
        Orderby: (_e = params.Orderby) !== null && _e !== void 0 ? _e : "ID",
        Orderbydecorasc: (_f = params.Orderbydecorasc) !== null && _f !== void 0 ? _f : true,
        Expand: (_g = params.Expand) !== null && _g !== void 0 ? _g : [],
    });
};
var _buildCAMLCondition = function (filter) {
    var _a;
    var condOp = (_a = filter.condition) !== null && _a !== void 0 ? _a : "Eq";
    var isLookup = filter.type === "Lookup";
    var values = Array.isArray(filter.value) ? filter.value : [filter.value];
    var fieldType = isLookup ? "Integer" : filter.type;
    var lookupAttr = isLookup ? ' LookupId="TRUE"' : "";
    if (values.length > 1) {
        var valueNodes = values
            .map(function (v) { return "<Value Type=\"".concat(fieldType, "\">").concat(v, "</Value>"); })
            .join("");
        return "<In><FieldRef Name=\"".concat(filter.field, "\"").concat(lookupAttr, " /><Values>").concat(valueNodes, "</Values></In>");
    }
    return ("<".concat(condOp, "><FieldRef Name=\"").concat(filter.field, "\"").concat(lookupAttr, " />") +
        "<Value Type=\"".concat(fieldType, "\">").concat(values[0], "</Value></").concat(condOp, ">"));
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
var SPReadItemsCamelQuery = function (rawParams) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var params, conditions, whereXml, op, viewFieldsXml, camlQuery, sp, camlResults, expandFields, idFilter;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = _formatCamlQuery(rawParams);
                conditions = params.Filter.map(_buildCAMLCondition).filter(Boolean);
                whereXml = "";
                if (conditions.length === 1) {
                    whereXml = conditions[0];
                }
                else if (conditions.length > 1) {
                    op = params.FilterCondition === "OR" ? "Or" : "And";
                    whereXml = "<".concat(op, ">").concat(conditions.join(""), "</").concat(op, ">");
                }
                viewFieldsXml = params.Select.map(function (f) {
                    var fieldName = f.includes("/") ? f.split("/")[0] : f;
                    var lookupAttr = f.includes("/") ? ' LookupId="TRUE"' : "";
                    return "<FieldRef Name=\"".concat(fieldName, "\"").concat(lookupAttr, " />");
                }).join("");
                camlQuery = [
                    "<View>",
                    "<Query><Where>".concat(whereXml, "</Where></Query>"),
                    "<ViewFields>".concat(viewFieldsXml, "</ViewFields>"),
                    "<RowLimit>".concat(params.Topcount, "</RowLimit>"),
                    "</View>",
                ].join("");
                sp = (0, exports.getSP)();
                return [4 /*yield*/, sp.web.lists
                        .getByTitle(params.Listname)
                        .getItemsByCAMLQuery({ ViewXml: camlQuery })];
            case 1:
                camlResults = _a.sent();
                expandFields = params.Expand.join(",");
                if (expandFields && camlResults.length) {
                    idFilter = camlResults
                        .map(function (i) { return "ID eq ".concat(i.ID); })
                        .join(" or ");
                    return [2 /*return*/, sp.web.lists
                            .getByTitle(params.Listname)
                            .items.filter(idFilter)
                            .select(params.Select.join(","))
                            .expand(expandFields)()];
                }
                return [2 /*return*/, camlResults];
        }
    });
}); };
// ── SPServices.ts ─────────────────────────────────────────────────────────
var SPServices = {
    initSP: exports.initSP,
    getSP: exports.getSP,
    getAllUsers: getAllUsers,
    SPAddItem: SPAddItem,
    SPUpdateItem: SPUpdateItem,
    SPDeleteItem: SPDeleteItem,
    SPReadItems: SPReadItems,
    SPGetItems: SPGetItems,
    SPReadItemUsingId: SPReadItemUsingId,
    SPAddAttachments: SPAddAttachments,
    SPGetAttachments: SPGetAttachments,
    SPDeleteAttachments: SPDeleteAttachments,
    SPGetChoices: SPGetChoices,
    batchGet: batchGet,
    batchInsert: batchInsert,
    batchUpdate: batchUpdate,
    batchDelete: batchDelete,
    ArraySpiltInOperator: ArraySpiltInOperator,
    SPDetailsListGroupItems: SPDetailsListGroupItems,
    getDocLibFiles: getDocLibFiles,
    addDocLibFiles: addDocLibFiles,
    SPReadItemsCamelQuery: SPReadItemsCamelQuery,
    SPReadItemsPaged: SPReadItemsPaged,
};
exports.default = SPServices;
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
//# sourceMappingURL=spservice.js.map