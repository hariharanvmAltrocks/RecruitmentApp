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
    apiUrlsError: null,
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
        case "SET_API_URLS_ERROR":
            return tslib_1.__assign(tslib_1.__assign({}, state), { apiUrlsError: action.message });
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
function checkUserRoles(allRoles) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var graphClient, groupIds, response, groupSet_1, matchedRole, error_1;
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
                    response = _a.sent();
                    groupSet_1 = new Set(response.value);
                    matchedRole = allRoles
                        .filter(function (role) { return groupSet_1.has(role.ADGroupID); })
                        .map(function (res) { return ({
                        ID: res.ID,
                        RoleTitle: res.RoleTitle,
                        ADGroupID: res.ADGroupID,
                        EmailId: "",
                    }); });
                    return [2 /*return*/, matchedRole.length ? matchedRole : null];
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
                    if (signIn.status !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
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
        EmailId: resolvedRoles.map(function (r) { return r.EmailId; }),
        userDetails: resolvedRoles.map(function (r) { return r.userDetails; }),
    };
}
var NoRoleScreen = function () { return (React.createElement("div", { className: "flex min-h-screen relative bg-gray-100" },
    React.createElement("div", { className: "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" }),
    React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4" },
        React.createElement("div", { className: "relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500" },
            React.createElement("div", { className: "bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" },
                React.createElement("div", { className: "sm:flex sm:items-start" },
                    React.createElement("div", { className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12" },
                        React.createElement("svg", { className: "h-6 w-6 text-amber-600", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", "aria-hidden": "true" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }))),
                    React.createElement("div", { className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left" },
                        React.createElement("h3", { className: "text-xl font-semibold leading-6 text-gray-900" }, "Warning: Access Restricted"),
                        React.createElement("div", { className: "mt-3" },
                            React.createElement("p", { className: "text-sm text-gray-500 mb-2" },
                                React.createElement("span", { className: "font-semibold text-gray-700" }, "You are not assigned to any AD Group for Recruitment App.")))))),
            React.createElement("div", { className: "bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" },
                React.createElement("button", { type: "button", className: "inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors ", onClick: function () { return window.location.reload(); } }, "Refresh Page")))))); };
var ErrorScreen = function (_a) {
    var message = _a.message;
    return (React.createElement("div", { className: "flex min-h-screen relative bg-gray-100" },
        React.createElement("div", { className: "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" }),
        React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4" },
            React.createElement("div", { className: "relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500" },
                React.createElement("div", { className: "bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" },
                    React.createElement("div", { className: "sm:flex sm:items-start" },
                        React.createElement("div", { className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12" },
                            React.createElement("svg", { className: "h-6 w-6 text-amber-600", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", "aria-hidden": "true" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }))),
                        React.createElement("div", { className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left" },
                            React.createElement("h3", { className: "text-xl font-semibold leading-6 text-gray-900" }, "Error: Initialisation Error"),
                            React.createElement("div", { className: "mt-3" },
                                React.createElement("p", { className: "text-sm text-gray-500 mb-2" },
                                    React.createElement("span", { className: "font-semibold text-gray-700" }, message)))))),
                React.createElement("div", { className: "bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" },
                    React.createElement("button", { type: "button", className: "inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors ", onClick: function () { return window.location.reload(); } }, "Refresh Page"))))));
};
var ServerDownError = function (_a) {
    var message = _a.message;
    return (React.createElement("div", { className: "flex min-h-screen relative bg-gray-100" },
        React.createElement("div", { className: "fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" }),
        React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4" },
            React.createElement("div", { className: "relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500" },
                React.createElement("div", { className: "bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" },
                    React.createElement("div", { className: "sm:flex sm:items-start" },
                        React.createElement("div", { className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12" },
                            React.createElement("svg", { className: "h-6 w-6 text-amber-600", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", "aria-hidden": "true" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }))),
                        React.createElement("div", { className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left" },
                            React.createElement("h3", { className: "text-xl font-semibold leading-6 text-gray-900" }, "Error: Server Is Not Responding"),
                            React.createElement("div", { className: "mt-3" },
                                React.createElement("p", { className: "text-sm text-gray-500 mb-2" },
                                    React.createElement("span", { className: "font-semibold text-gray-700" }, message)))))),
                React.createElement("div", { className: "bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" },
                    React.createElement("button", { type: "button", className: "inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors ", onClick: function () { return window.location.reload(); } }, "Refresh Page"))))));
};
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
                                .then(function (success) {
                                if (success) {
                                    dispatch({ type: "SET_API_URLS_READY" });
                                }
                                else {
                                    dispatch({
                                        type: "SET_API_URLS_ERROR",
                                        message: "Server is currently unavailable. Please try again later.",
                                    });
                                }
                            })
                                .catch(function (err) {
                                console.error("[RoleProvider] API URL init failed:", err);
                                dispatch({
                                    type: "SET_API_URLS_ERROR",
                                    message: err instanceof Error
                                        ? err.message
                                        : "Server is currently unavailable. Please try again later.",
                                });
                            }),
                            (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                var _a, displayName, email, allRoles, resolved, Filter, userDetails, resolvedRoles;
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
                                            Filter = [
                                                { FilterKey: "EmailId", Operator: "eq", FilterValue: email },
                                            ];
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails(Filter, "and")];
                                        case 4:
                                            userDetails = _b.sent();
                                            resolvedRoles = resolved === null || resolved === void 0 ? void 0 : resolved.map(function (res) { return ({
                                                ID: res.ID,
                                                RoleTitle: res.RoleTitle,
                                                ADGroupID: res.ADGroupID,
                                                EmailId: email,
                                                userDetails: userDetails.data,
                                            }); });
                                            dispatch({
                                                type: "SET_RESOLVED_ROLES",
                                                roles: resolvedRoles && resolvedRoles.length > 0 ? resolvedRoles : [],
                                            });
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
        React.createElement(CustomLoader_1.default, { isLoading: state.isLoading }, state.apiUrlsError ? ( // ← check this first
        React.createElement(ServerDownError, { message: state.apiUrlsError })) : state.error ? (React.createElement(ErrorScreen, { message: state.error.message })) : isFullyReady ? (React.createElement(React.Suspense, { fallback: React.createElement(CustomLoader_1.default, { isLoading: true }) }, children)) : hasNoRoles ? (React.createElement(NoRoleScreen, null)) : null)));
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