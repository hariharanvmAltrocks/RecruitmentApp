"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Config_1 = require("../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var MenuService = /** @class */ (function () {
    function MenuService() {
    }
    MenuService.prototype.getSwitchUserMatrix = function (RoleID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Conditions, FilterConditions, getjsonUserRole, items, returnData, returnData1, MenuSortData, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        Conditions = "";
                        FilterConditions = [];
                        // let RoleIDs = RoleID.map((role: any) => Number(role.ID))
                        FilterConditions.push({
                            FilterKey: "RoleId",
                            Operator: "in",
                            FilterValue: RoleID, // Change accordingly if the value should be different
                        });
                        FilterConditions.push({
                            FilterKey: "IsActive",
                            Operator: "eq",
                            FilterValue: "1"
                        });
                        Conditions = "and";
                        getjsonUserRole = {
                            Listname: Config_1.ListNames.HRMSRecruitmentSwitchUserMatrix,
                            Select: "*,Menu,Menu/Id,Menu/MenuId,Menu/ShortDescription,Menu/LongDescription,Menu/ParentId,Menu/MenuSorting,Menu/Path,Menu/MenuIcon,Menu/InActiveMenuIcon,IsActive,SubMenu/Id,SubMenu/MenuId,SubMenu/ShortDescription,SubMenu/LongDescription,SubMenu/ParentId,SubMenu/MenuSorting,SubMenu/Path,SubMenu/MenuIcon,SubMenu/InActiveMenuIcon,Tab/Id,Tab/TabName,Tab/Sorting,ButtonAction/Id,ButtonAction/ActionDescription,Status/Id,Status/StatusDescription",
                            Expand: "Menu,SubMenu,Tab,ButtonAction,Status",
                            Filter: FilterConditions,
                            FilterConditions: Conditions
                        };
                        return [4 /*yield*/, spservice_1.default.SPReadItems(getjsonUserRole)];
                    case 1:
                        items = _a.sent();
                        returnData = items.map(function (item) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                            return ({
                                Id: item.Menu.MenuId,
                                DisplayName: item.Menu.LongDescription,
                                Path: item.Menu.Path,
                                Icon: "".concat(item.Menu.MenuIcon),
                                ActiveIcon: "".concat(item.Menu.InActiveMenuIcon),
                                ParentId: item.Menu.ParentId,
                                Sort: item.Menu.MenuSorting,
                                IsActive: item.IsActive,
                                SubMenu: ((_a = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _a === void 0 ? void 0 : _a.MenuId) ? {
                                    Id: (_b = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _b === void 0 ? void 0 : _b.MenuId,
                                    DisplayName: (_c = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _c === void 0 ? void 0 : _c.LongDescription,
                                    Path: (_d = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _d === void 0 ? void 0 : _d.Path,
                                    Icon: "".concat((_e = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _e === void 0 ? void 0 : _e.MenuIcon),
                                    ActiveIcon: "".concat((_f = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _f === void 0 ? void 0 : _f.InActiveMenuIcon),
                                    ParentId: (_g = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _g === void 0 ? void 0 : _g.ParentId,
                                    Sort: (_h = item === null || item === void 0 ? void 0 : item.SubMenu) === null || _h === void 0 ? void 0 : _h.MenuSorting,
                                    IsActive: item === null || item === void 0 ? void 0 : item.IsActive,
                                    Children: [],
                                    TabDetails: []
                                } : undefined,
                                Tab: {
                                    key: (_j = item === null || item === void 0 ? void 0 : item.Tab) === null || _j === void 0 ? void 0 : _j.Id,
                                    text: (_k = item === null || item === void 0 ? void 0 : item.Tab) === null || _k === void 0 ? void 0 : _k.TabName,
                                    sorting: (_l = item === null || item === void 0 ? void 0 : item.Tab) === null || _l === void 0 ? void 0 : _l.Sorting
                                },
                                Action: {
                                    key: (_m = item.ButtonAction) === null || _m === void 0 ? void 0 : _m.Id,
                                    text: (_o = item.ButtonAction) === null || _o === void 0 ? void 0 : _o.ActionDescription,
                                },
                                Status: {
                                    key: (_p = item.Status) === null || _p === void 0 ? void 0 : _p.Id,
                                    text: (_q = item.Status) === null || _q === void 0 ? void 0 : _q.StatusDescription,
                                },
                                TabDetails: []
                            });
                        });
                        return [4 /*yield*/, this.GetNav(returnData, 0)];
                    case 2:
                        returnData1 = _a.sent();
                        return [4 /*yield*/, this.sortMenuItems(returnData1)];
                    case 3:
                        MenuSortData = _a.sent();
                        return [2 /*return*/, {
                                data: MenuSortData,
                                status: 200,
                                message: "Data retrived Successfully!",
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.log("MenuItems error", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Data Fetched Failed",
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MenuService.prototype.getMenuDetails = function (MenuId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Conditions, FilterConditions, getjsonUserRole, items, returnData, returnData1, MenuSortData, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        Conditions = "";
                        FilterConditions = [];
                        FilterConditions.push({
                            FilterKey: "RoleIdId",
                            Operator: "eq",
                            FilterValue: MenuId, // Change accordingly if the value should be different
                        });
                        FilterConditions.push({
                            FilterKey: "IsActive",
                            Operator: "eq",
                            FilterValue: "1"
                        });
                        Conditions = "and";
                        getjsonUserRole = {
                            Listname: Config_1.ListNames.HRMSMenuAccess,
                            Select: "*,MenuId,MenuId/Id,MenuId/MenuId, MenuId/ShortDescription ,MenuId/LongDescription, MenuId/ParentId, MenuId/MenuSorting , MenuId/Path, MenuId/MenuIcon, MenuId/InActiveMenuIcon , IsActive",
                            Expand: "MenuId",
                            Filter: FilterConditions,
                            FilterConditions: Conditions
                        };
                        return [4 /*yield*/, spservice_1.default.SPReadItems(getjsonUserRole)];
                    case 1:
                        items = _a.sent();
                        returnData = items.map(function (item) { return ({
                            Id: item.MenuId.MenuId,
                            DisplayName: item.MenuId.LongDescription,
                            Path: item.MenuId.Path,
                            Icon: "".concat(item.MenuId.MenuIcon),
                            ActiveIcon: "".concat(item.MenuId.InActiveMenuIcon),
                            ParentId: item.MenuId.ParentId,
                            Sort: item.MenuId.MenuSorting,
                            IsActive: item.IsActive,
                        }); });
                        return [4 /*yield*/, this.GetNav(returnData, 0)];
                    case 2:
                        returnData1 = _a.sent();
                        return [4 /*yield*/, this.sortMenuItems(returnData1)];
                    case 3:
                        MenuSortData = _a.sent();
                        return [2 /*return*/, {
                                data: MenuSortData,
                                status: 200,
                                message: "Data retrived Successfully!",
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.log("MenuItems error", error_2);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Data Fetched Failed",
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MenuService.prototype.getUserAccess = function (userRoleId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getjsonUserRole, items, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        getjsonUserRole = {
                            Listname: Config_1.ListNames.HRMSMenuAccess,
                            Select: "*,MenuId/MenuId,RoleId/ID",
                            Expand: "MenuId,RoleId",
                            Filter: [{
                                    FilterKey: "RoleId",
                                    Operator: "eq",
                                    FilterValue: String(userRoleId),
                                }],
                        };
                        return [4 /*yield*/, spservice_1.default.SPReadItems(getjsonUserRole)
                                .then(function (res) {
                                var tempArray = res.map(function (item) {
                                    var _a, _b;
                                    return ({
                                        MenuIdId: (_a = item.MenuId) === null || _a === void 0 ? void 0 : _a.MenuId,
                                        RoleIdId: (_b = item.RoleId) === null || _b === void 0 ? void 0 : _b.ID,
                                        IsActive: item.IsActive
                                    });
                                });
                                return tempArray;
                            })];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, {
                                data: items,
                                status: 200,
                                message: "Data Fetched Successfully",
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.log("getUserAccess error", error_3);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Data Fetch Failed",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MenuService.prototype.GetNav = function (ITEMS, ParentId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var TempArray, uniqueReturnData, filterItem, _i, filterItem_1, element, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        TempArray = [];
                        uniqueReturnData = Array.from(new Map(ITEMS.map(function (menu) { return [menu.Id, menu]; })).values());
                        filterItem = uniqueReturnData.filter(function (item) { return (item === null || item === void 0 ? void 0 : item.ParentId) === ParentId; });
                        _i = 0, filterItem_1 = filterItem;
                        _c.label = 1;
                    case 1:
                        if (!(_i < filterItem_1.length)) return [3 /*break*/, 7];
                        element = filterItem_1[_i];
                        if (!element.SubMenu) return [3 /*break*/, 3];
                        // console.log("Processing submenu for:", element.Id);
                        _a = element;
                        return [4 /*yield*/, this.getsubmenu(ITEMS, element.Id)];
                    case 2:
                        // console.log("Processing submenu for:", element.Id);
                        _a.Children = _c.sent(); // Recursive submenu
                        return [3 /*break*/, 5];
                    case 3:
                        _b = element;
                        return [4 /*yield*/, this.getsubmenu(ITEMS, element.Id)];
                    case 4:
                        _b.TabDetails = _c.sent();
                        _c.label = 5;
                    case 5:
                        TempArray.push(element);
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, TempArray];
                }
            });
        });
    };
    MenuService.prototype.sortMenuItems = function (menuItems) {
        var _a;
        // Sort menu items based on the Sort property
        menuItems.sort(function (a, b) { return a.Sort - b.Sort; });
        // Recursively sort children
        for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
            var menuItem = menuItems_1[_i];
            if (menuItem.Children !== undefined && ((_a = menuItem.Children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                menuItem.Children = this.sortMenuItems(menuItem.Children);
            }
        }
        return menuItems;
    };
    MenuService.prototype.getsubmenu = function (items, SubMenuId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var submenuMap, _loop_1, _i, items_1, item, submenuList, _k, submenuList_1, submenu, _l;
            return tslib_1.__generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        submenuMap = new Map();
                        _loop_1 = function (item) {
                            var sub = item.SubMenu && item.SubMenu.Id ? item.SubMenu : item;
                            var ParentId = item.SubMenu && item.SubMenu.Id ? sub.ParentId : sub.Id;
                            if (sub && ParentId === SubMenuId) {
                                if (!submenuMap.has(sub.Id)) {
                                    submenuMap.set(sub.Id, tslib_1.__assign(tslib_1.__assign({}, sub), { TabDetails: [] }));
                                }
                                var existingSub = submenuMap.get(sub.Id);
                                var tabName_1 = (_b = (_a = item.Tab) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim();
                                if (!tabName_1)
                                    return "continue";
                                if (!existingSub.TabDetails) {
                                    existingSub.TabDetails = [];
                                }
                                var tabDetail = existingSub.TabDetails.find(function (td) { return td.TabName === tabName_1; });
                                if (!tabDetail) {
                                    tabDetail = {
                                        TabName: tabName_1,
                                        Value: " ", //item.Tab?.sorting?.trim(),
                                        StatusDetails: []
                                    };
                                    existingSub.TabDetails.push(tabDetail);
                                }
                                var statusId_1 = (_c = item.Status) === null || _c === void 0 ? void 0 : _c.key;
                                var statusText = (_e = (_d = item.Status) === null || _d === void 0 ? void 0 : _d.text) === null || _e === void 0 ? void 0 : _e.trim();
                                var statusDetail = void 0;
                                if (statusText) {
                                    statusDetail = tabDetail.StatusDetails.find(function (sd) {
                                        return sd.StatusId.split(",").includes(String(statusId_1));
                                    });
                                    if (!statusDetail) {
                                        statusDetail = {
                                            Status: statusText,
                                            StatusId: String(statusId_1),
                                            ActionId: [],
                                            Action: []
                                        };
                                        tabDetail.StatusDetails.push(statusDetail);
                                    }
                                    else {
                                        var statusParts = statusDetail.Status.split(',').map(function (s) { return s.trim(); });
                                        if (!statusParts.includes(statusText)) {
                                            statusParts.push(statusText);
                                            statusDetail.Status = statusParts.join(',');
                                        }
                                        var statusIdParts = statusDetail.StatusId.split(',').map(function (id) { return id.trim(); });
                                        if (!statusIdParts.includes(String(statusId_1))) {
                                            statusIdParts.push(String(statusId_1));
                                            statusDetail.StatusId = statusIdParts.join(',');
                                        }
                                    }
                                }
                                else {
                                    // Allow status to be empty, create a blank entry to hold actions
                                    statusDetail = {
                                        Status: '',
                                        StatusId: '',
                                        ActionId: [],
                                        Action: []
                                    };
                                    tabDetail.StatusDetails.push(statusDetail);
                                }
                                var actionId = (_f = item.Action) === null || _f === void 0 ? void 0 : _f.key;
                                var actionText = (_h = (_g = item.Action) === null || _g === void 0 ? void 0 : _g.text) === null || _h === void 0 ? void 0 : _h.trim();
                                // if (typeof actionId === 'number' && actionText) {
                                if (!statusDetail.ActionId.includes(actionId)) {
                                    statusDetail.ActionId.push(actionId);
                                }
                                if (!statusDetail.Action.includes(actionText)) {
                                    statusDetail.Action.push(actionText);
                                }
                                // }
                            }
                        };
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            _loop_1(item);
                        }
                        submenuList = Array.from(submenuMap.values());
                        _k = 0, submenuList_1 = submenuList;
                        _m.label = 1;
                    case 1:
                        if (!(_k < submenuList_1.length)) return [3 /*break*/, 4];
                        submenu = submenuList_1[_k];
                        (_j = submenu.TabDetails) === null || _j === void 0 ? void 0 : _j.sort(function (a, b) {
                            var _a, _b;
                            var aNum = parseInt(((_a = a.Value) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, '')) || '0', 10);
                            var bNum = parseInt(((_b = b.Value) === null || _b === void 0 ? void 0 : _b.replace(/\D/g, '')) || '0', 10);
                            return aNum - bNum;
                        });
                        if (!(submenu === null || submenu === void 0 ? void 0 : submenu.SubMenu)) return [3 /*break*/, 3];
                        _l = submenu;
                        return [4 /*yield*/, this.getsubmenu(items, submenu.Id)];
                    case 2:
                        _l.Children = _m.sent();
                        _m.label = 3;
                    case 3:
                        _k++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, submenuList];
                }
            });
        });
    };
    return MenuService;
}());
exports.default = MenuService;
//# sourceMappingURL=menuService.js.map