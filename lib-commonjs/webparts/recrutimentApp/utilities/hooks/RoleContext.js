"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfo = exports.useRoleContext = exports.RoleProvider = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
require("@pnp/sp/webs");
require("@pnp/sp/site-users/web");
var spservice_1 = require("../../services/SPService/spservice");
var ServiceExport_1 = require("../../services/ServiceExport");
var ApiConfig_1 = require("../ApiConfig");
var GraphService_1 = tslib_1.__importDefault(require("../../services/GraphService/GraphService"));
var CustomLoader_1 = tslib_1.__importDefault(require("../../services/Loader/CustomLoader"));
var CareerPortalAPI_1 = require("../../services/AxiosService/CareerPortalAPI");
var RoleContext = (0, react_1.createContext)(undefined);
var initialState = {
    userName: "",
    userEmail: "",
    resolvedRoles: [],
    apiUrlsReady: false,
    isLoading: true,
    error: null,
};
function providerReducer(state, action) {
    switch (action.type) {
        case "SET_USER":
            return tslib_1.__assign(tslib_1.__assign({}, state), { userName: action.userName, userEmail: action.userEmail });
        case "SET_RESOLVED_ROLES":
            return tslib_1.__assign(tslib_1.__assign({}, state), { resolvedRoles: action.roles });
        case "SET_API_URLS_READY":
            return tslib_1.__assign(tslib_1.__assign({}, state), { apiUrlsReady: true });
        case "SET_ERROR":
            return tslib_1.__assign(tslib_1.__assign({}, state), { error: action.error, isLoading: false });
        case "SET_LOADING":
            return tslib_1.__assign(tslib_1.__assign({}, state), { isLoading: action.isLoading });
        default:
            return state;
    }
}
function fetchCurrentUser() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sp, user;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sp = (0, spservice_1.getSP)();
                    return [4 /*yield*/, sp.web.currentUser()];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, { displayName: user.Title, email: user.Email }];
            }
        });
    });
}
function fetchAllRoles() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ServiceExport_1.masterService.userRole()];
                case 1:
                    result = _a.sent();
                    if (result.status !== ApiConfig_1.ResponeStatus.SUCCESS || !result.data)
                        return [2 /*return*/, []];
                    return [2 /*return*/, result.data];
            }
        });
    });
}
// async function checkGroupMembership(
//   groupId: string,
//   userEmail: string,
//   roleRecord: UserRoleData
// ): Promise<UserRoleData | null> {
//   try {
//     const graphClient = GraphService.getGraphClient();
//     const response = await graphClient.api(`/groups/${groupId}/members`).get() as {
//       value: { userPrincipalName?: string }[];
//     };
//     const members = response.value ?? [];
//    const isMember = members.some((m: any) => {
//   const graphEmail =  m.mail?.toLowerCase().trim();
//     // m.userPrincipalName?.toLowerCase().trim() ||
//   return graphEmail === userEmail.toLowerCase().trim();
// });
//     return isMember ? roleRecord : null;
//   } catch (err) {
//     console.error(`[RoleProvider] Group membership check failed for ${groupId}:`, err);
//     return null;
//   }
// }
// async function resolveUserRoles(
//   allRoles: UserRoleData[],
//   userEmail: string
// ): Promise<ResolvedRole[]> {
//   const checks = allRoles
//     .filter((r) => r.ADGroupID && r.ADGroupID !== "0")
//     .map((r) => checkGroupMembership(r.ADGroupID, userEmail, r));
//   const results = await Promise.all(checks);
//   return results
//     .filter((r): r is UserRoleData => r !== null)
//     .map((r) => ({
//       ID: r.ID,
//       RoleTitle: r.RoleTitle,
//       ADGroupID: r.ADGroupID,
//       EmailId: userEmail,
//     }));
// }
function checkUserRoles(allRoles) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var graphClient, groupIds, response_1, matchedRole, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    graphClient = GraphService_1.default.getGraphClient();
                    groupIds = allRoles
                        .filter(function (r) { return r.ADGroupID && r.ADGroupID !== "0"; })
                        .map(function (r) { return r.ADGroupID; });
                    if (groupIds.length === 0)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, graphClient
                            .api("/me/checkMemberGroups")
                            .post({ groupIds: groupIds })];
                case 2:
                    response_1 = _a.sent();
                    matchedRole = allRoles.find(function (role) {
                        return response_1.value.includes(role.ADGroupID);
                    });
                    return [2 /*return*/, matchedRole !== null && matchedRole !== void 0 ? matchedRole : null];
                case 3:
                    error_1 = _a.sent();
                    console.error("Group membership check failed:", error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function initApiUrls() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, urls, signIn;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ServiceExport_1.masterService.GetCareerPortalIntergLink([], "and")];
                case 1:
                    result = _a.sent();
                    urls = result.data || result;
                    localStorage.setItem("CareerPortalLink", urls.CareerPortalLink);
                    localStorage.setItem("MeetingCode", urls.MeetingCode);
                    localStorage.setItem("MeetingUrl", urls.MeetingUrl);
                    return [4 /*yield*/, CareerPortalAPI_1.InternalSign.InternalSignIn()];
                case 2:
                    signIn = _a.sent();
                    return [2 /*return*/, signIn.status === ApiConfig_1.ResponeStatus.SUCCESS];
            }
        });
    });
}
function buildADGroupData(resolvedRoles, userName) {
    return {
        roleIDs: resolvedRoles.map(function (r) { return r.ID; }),
        userName: userName,
        userRole: resolvedRoles.map(function (r) { return r.RoleTitle; }),
        ADGroupIDs: resolvedRoles.map(function (r) { return r.ADGroupID; }),
        RoleDetails: resolvedRoles,
    };
}
var NoRoleScreen = function () { return (React.createElement("div", { className: "mainPage flex" },
    React.createElement(Sidebar, null),
    React.createElement("div", { className: "w-[85%] flex flex-col items-center justify-center min-h-full" },
        React.createElement("h3", { className: "title" }, "You are not assigned to any AD Group for HRMS")))); };
var ErrorScreen = function (_a) {
    var message = _a.message;
    return (React.createElement("div", { className: "mainPage" },
        React.createElement(Sidebar, null),
        React.createElement("div", { style: {
                width: "85%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                gap: "12px",
            } },
            React.createElement("h3", { className: "title", style: { color: "#c0392b" } }, "Initialisation Error"),
            React.createElement("p", { style: { color: "#7f8c8d", fontSize: "14px", maxWidth: "480px", textAlign: "center" } }, message))));
};
var Sidebar = function () { return (React.createElement("div", { className: "w-[15%]" },
    React.createElement("div", { className: "overflow-hidden flex flex-col justify-between rounded-r-[30px] transition-all duration-1000 bg-[#597b98] h-[90vh] w-full" },
        React.createElement("div", null,
            React.createElement("div", { className: "flex justify-center items-center h-[68px] p-[3px] bg-white rounded-tr-[14px] rounded-br-[14px] w-[90%] my-[20px] transition-all duration-1000" },
                React.createElement("img", { className: "h-[76px] w-[84%] object-contain", src: require("../../assets/komoa-logo-name.png"), alt: "HRMS Logo" }))),
        React.createElement("div", { className: "text-white text-[15px] self-center mb-[10px]" }, "Version-1.3")))); };
var RoleProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(providerReducer, initialState), state = _b[0], dispatch = _b[1];
    var _c = (0, react_1.useState)(false), showRoleSelector = _c[0], setShowRoleSelector = _c[1];
    var initialise = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, userResult, raw;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dispatch({ type: "SET_LOADING", isLoading: true });
                    return [4 /*yield*/, Promise.allSettled([
                            initApiUrls()
                                .then(function () { return dispatch({ type: "SET_API_URLS_READY" }); })
                                .catch(function (err) {
                                console.error("[RoleProvider] API URL init failed:", err);
                            }),
                            (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                var _a, displayName, email, allRoles, resolved, resolvedRoles;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, fetchCurrentUser()];
                                        case 1:
                                            _a = _b.sent(), displayName = _a.displayName, email = _a.email;
                                            dispatch({ type: "SET_USER", userName: displayName, userEmail: email });
                                            return [4 /*yield*/, fetchAllRoles()];
                                        case 2:
                                            allRoles = _b.sent();
                                            return [4 /*yield*/, checkUserRoles(allRoles)];
                                        case 3:
                                            resolved = _b.sent();
                                            resolvedRoles = resolved ? [{
                                                    ID: resolved.ID,
                                                    RoleTitle: resolved.RoleTitle,
                                                    ADGroupID: resolved.ADGroupID,
                                                    EmailId: email,
                                                }] : [];
                                            dispatch({ type: "SET_RESOLVED_ROLES", roles: resolvedRoles });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })(),
                        ])];
                case 1:
                    _a = _b.sent(), userResult = _a[1];
                    if (userResult.status === "rejected") {
                        raw = userResult.reason;
                        dispatch({
                            type: "SET_ERROR",
                            error: raw instanceof Error ? raw : new Error(String(raw)),
                        });
                    }
                    dispatch({ type: "SET_LOADING", isLoading: false });
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        void initialise();
    }, [initialise]);
    var ADGroupData = buildADGroupData(state.resolvedRoles, state.userName);
    var contextValue = {
        roleIDs: ADGroupData.roleIDs,
        userName: state.userName,
        userRole: ADGroupData.userRole,
        ADGroupData: ADGroupData,
        isLoading: state.isLoading,
        error: state.error,
        showRoleSelector: showRoleSelector,
        setShowRoleSelector: setShowRoleSelector,
    };
    var isFullyReady = !state.isLoading &&
        !state.error &&
        state.userName !== "" &&
        state.resolvedRoles.length > 0 &&
        state.apiUrlsReady;
    var hasNoRoles = !state.isLoading &&
        !state.error &&
        state.userName !== "" &&
        state.resolvedRoles.length === 0;
    return (React.createElement(RoleContext.Provider, { value: contextValue },
        React.createElement(CustomLoader_1.default, { isLoading: state.isLoading }, state.error ? (React.createElement(ErrorScreen, { message: state.error.message })) : isFullyReady ? (React.createElement(React.Suspense, { fallback: React.createElement(CustomLoader_1.default, { isLoading: true }) }, children)) : hasNoRoles ? (React.createElement(NoRoleScreen, null)) : (
        // Still initialising — CustomLoader handles the visual
        null))));
};
exports.RoleProvider = RoleProvider;
var useRoleContext = function () {
    var ctx = (0, react_1.useContext)(RoleContext);
    if (!ctx) {
        throw new Error("useRoleContext must be called inside a <RoleProvider>.");
    }
    return ctx;
};
exports.useRoleContext = useRoleContext;
exports.userInfo = exports.useRoleContext;
//# sourceMappingURL=RoleContext.js.map