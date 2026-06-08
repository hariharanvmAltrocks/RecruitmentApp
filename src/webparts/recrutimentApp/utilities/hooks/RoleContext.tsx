import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { getSP } from "../../services/SPService/spservice";
import { DashboardServices, masterService } from "../../services/ServiceExport";
import { ResponeStatus } from "../ApiConfig";
import GraphService from "../../services/GraphService/GraphService";
import CustomLoader from "../../services/Loader/CustomLoader";
import {
  RoleContextType,
  ResolvedRole,
  UserRoleData,
  ApiUrls,
  ADGroupData,
} from "./IRoleContext";
import { InternalSign } from "../../services/AxiosService/CareerPortalAPI";
import { Metric } from "../../models/IDashboard";
import { useDashboardMetrics } from "../../components/Screens/Dashboard/Hooks/useDashboardMetrics";
import { DepartmentDataItem } from "../../components/Screens/Dashboard/Hooks/Usedepartmentchart";

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface ProviderState {
  userName: string;
  userEmail: string;
  resolvedRoles: ResolvedRole[];
  apiUrlsReady: boolean;
  isLoading: boolean;
  error: Error | null;
  apiUrlsError: string | null;
  MatricData: Metric[];
  DepartmentData: DepartmentDataItem[];
}

type ProviderAction =
  | { type: "SET_USER"; userName: string; userEmail: string }
  | { type: "SET_RESOLVED_ROLES"; roles: ResolvedRole[] }
  | { type: "SET_API_URLS_READY" }
  | { type: "SET_ERROR"; error: Error }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_API_URLS_ERROR"; message: string }
  | { type: "SET_MATRIC_DATA"; MatricData: Metric[] }
  | { type: "SET_DEPARTMENT_DATA"; DepartmentData: DepartmentDataItem[] };

const initialState: ProviderState = {
  userName: "",
  userEmail: "",
  resolvedRoles: [],
  apiUrlsReady: false,
  isLoading: true,
  error: null,
  apiUrlsError: null,
  MatricData: [],
  DepartmentData: []
};

function providerReducer(
  state: ProviderState,
  action: ProviderAction,
): ProviderState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userName: action.userName,
        userEmail: action.userEmail,
      };
    case "SET_RESOLVED_ROLES":
      return { ...state, resolvedRoles: action.roles };
    case "SET_API_URLS_READY":
      return { ...state, apiUrlsReady: true };
    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_API_URLS_ERROR":
      return { ...state, apiUrlsError: action.message };
    case "SET_MATRIC_DATA":
      return { ...state, MatricData: action.MatricData };
    case "SET_DEPARTMENT_DATA":
      return { ...state, DepartmentData: action.DepartmentData };
    default:
      return state;
  }
}

async function fetchCurrentUser(): Promise<{
  displayName: string;
  email: string;
}> {
  const sp = getSP();
  const user = await sp.web.currentUser();
  return { displayName: user.Title, email: user.Email };
}


async function fetchAllRoles(): Promise<UserRoleData[]> {
  const result = await masterService.userRole();
  if (result.status !== ResponeStatus.SUCCESS || !result.data) return [];
  return result.data as UserRoleData[];
}

async function checkUserRoles(
  allRoles: UserRoleData[],
): Promise<UserRoleData[] | null> {
  const graphClient = GraphService.getGraphClient();

  const groupIds = allRoles
    .filter((r) => r.ADGroupID && r.ADGroupID !== "0")
    .map((r) => r.ADGroupID);

  if (groupIds.length === 0) return null;

  try {
    const response = await graphClient
      .api("/me/checkMemberGroups")
      .post({ groupIds });

    const groupSet = new Set(response.value);

    const matchedRole = allRoles
      .filter((role) => groupSet.has(role.ADGroupID))
      .map((res) => ({
        ID: res.ID,
        RoleTitle: res.RoleTitle,
        ADGroupID: res.ADGroupID,
        EmailId: "",
      }));

    return matchedRole.length ? matchedRole : null;
  } catch (error) {
    console.error("Group membership check failed:", error);
    return null;
  }
}

async function initApiUrls(): Promise<boolean> {
  const result = await masterService.GetCareerPortalIntergLink([], "and");
  const urls: ApiUrls = result.data || (result as unknown as ApiUrls);

  localStorage.setItem("CareerPortalLink", urls.CareerPortalLink);
  localStorage.setItem("MeetingCode", urls.MeetingCode);
  localStorage.setItem("MeetingUrl", urls.MeetingUrl);

  const signIn = await InternalSign.InternalSignIn();
  if (signIn.status !== ResponeStatus.SUCCESS) {
    return false;
  }
  return true;
}

function buildADGroupData(
  resolvedRoles: ResolvedRole[],
  userName: string,
): ADGroupData {
  return {
    roleIDs: resolvedRoles.map((r) => r.ID),
    userName,
    userRole: resolvedRoles.map((r) => r.RoleTitle),
    ADGroupIDs: resolvedRoles.map((r) => r.ADGroupID),
    RoleDetails: resolvedRoles,
    EmailId: resolvedRoles.map((r) => r.EmailId),
    userDetails: resolvedRoles.map((r) => r.userDetails),
  };
}

const NoRoleScreen = (): JSX.Element => (
  <div className="flex min-h-screen relative bg-gray-100">
    <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" />

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Warning: Access Restricted
              </h3>
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold text-gray-700">
                    You are not assigned to any AD Group for Recruitment App.
                  </span>
                </p>
                {/* <p className="text-sm text-gray-500">
                  Please contact your IT support or system administrator to request access to this application.
                </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors "
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ErrorScreen = ({ message }: { message: string }): JSX.Element => (
  <div className="flex min-h-screen relative bg-gray-100">
    <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" />

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Error: Initialisation Error
              </h3>
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold text-gray-700">{message}</span>
                </p>
                {/* <p className="text-sm text-gray-500">
                  Please contact your IT support or system administrator to request access to this application.
                </p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors "
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ServerDownError = ({ message }: { message: string }): JSX.Element => (
  <div className="flex min-h-screen relative bg-gray-100">
    <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity" />

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-t-4 border-amber-500">
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 sm:mx-0 sm:h-12 sm:w-12">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                Error: Server Is Not Responding
              </h3>
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold text-gray-700">{message}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-amber-500 sm:ml-3 sm:w-auto transition-colors "
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const RoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = useReducer(providerReducer, initialState);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roleIDs = React.useMemo(() => {
    return state.resolvedRoles.map((r) => r.ID);
  }, [state.resolvedRoles]);

  const { metrics: matricData, loading: metricsLoading, refresh } = useDashboardMetrics(
    roleIDs,
    state.userEmail,
  );

  const refreshMetrics = useCallback(async (): Promise<void> => {
    if (roleIDs.length === 0 || !state.userEmail) {
      return;
    }
    await refresh();
  }, [refresh, roleIDs, state.userEmail]);

  useEffect(() => {
    if (state.resolvedRoles.length > 0) {
      dispatch({ type: "SET_MATRIC_DATA", MatricData: matricData });
    }
  }, [matricData, state.resolvedRoles.length]);

  const initialise = useCallback(async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", isLoading: true });

    const [, userResult] = await Promise.allSettled([
      initApiUrls()
        .then((success) => {
          if (success) {
            dispatch({ type: "SET_API_URLS_READY" });
          } else {
            dispatch({
              type: "SET_API_URLS_ERROR",
              message:
                "Server is currently unavailable. Please try again later.",
            });
          }
        })
        .catch((err: unknown) => {
          console.error("[RoleProvider] API URL init failed:", err);
          dispatch({
            type: "SET_API_URLS_ERROR",
            message:
              err instanceof Error
                ? err.message
                : "Server is currently unavailable. Please try again later.",
          });
        }),

      (async () => {
        const { displayName, email } = await fetchCurrentUser();
        dispatch({ type: "SET_USER", userName: displayName, userEmail: email });

        const allRoles = await fetchAllRoles();
        const resolved = await checkUserRoles(allRoles);
        const Filter = [
          { FilterKey: "EmailId", Operator: "eq", FilterValue: email },
        ];
        const userDetails = await masterService.GetUserDetails(Filter, "and");
        const resolvedRoles = resolved?.map((res) => ({
          ID: res.ID,
          RoleTitle: res.RoleTitle,
          ADGroupID: res.ADGroupID,
          EmailId: email,
          userDetails: userDetails.data,
        }));
        dispatch({
          type: "SET_RESOLVED_ROLES",
          roles: resolvedRoles && resolvedRoles.length > 0 ? resolvedRoles : [],
        });
      })(),
    ]);

    if (userResult.status === "rejected") {
      const raw = userResult.reason;
      dispatch({
        type: "SET_ERROR",
        error: raw instanceof Error ? raw : new Error(String(raw)),
      });
    }

    try {
      const res = await DashboardServices.GetDepartmentDetails();
      dispatch({ type: "SET_DEPARTMENT_DATA", DepartmentData: res.data });
    } catch (error) {
      console.error("[RoleProvider] Failed to fetch department details:", error);
    }

    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  useEffect(() => {
    void initialise();
  }, [initialise]);

  const ADGroupData = buildADGroupData(state.resolvedRoles, state.userName);

  const combinedLoading =
    state.isLoading || (state.resolvedRoles.length > 0 && metricsLoading && state.MatricData.length === 0);

  const contextValue: RoleContextType = {
    roleIDs: ADGroupData.roleIDs,
    userName: state.userName,
    userRole: ADGroupData.userRole,
    ADGroupData,
    isLoading: combinedLoading,
    error: state.error,
    showRoleSelector,
    setShowRoleSelector,
    MatricData: state.MatricData,
    DepartmentData: state.DepartmentData,
    refreshMetrics
  };

  const isFullyReady =
    !combinedLoading &&
    !state.error &&
    state.userName !== "" &&
    state.resolvedRoles.length > 0 &&
    state.apiUrlsReady;

  const hasNoRoles =
    !combinedLoading &&
    !state.error &&
    state.userName !== "" &&
    state.resolvedRoles.length === 0;

  return (
    <RoleContext.Provider value={contextValue}>
      <CustomLoader isLoading={combinedLoading} userName={state.userName}>
        {state.apiUrlsError ? ( // ← check this first
          // <ServerDownError message={state.apiUrlsError} />
          <></>
        ) : state.error ? (
          // <ErrorScreen message={state.error.message} />
          <></>
        ) : isFullyReady ? (
          <React.Suspense fallback={<CustomLoader isLoading userName={state.userName} />}>
            {children}
          </React.Suspense>
        ) : hasNoRoles ? (
          <NoRoleScreen />
        ) : null}
      </CustomLoader>
    </RoleContext.Provider>
  );
};

export const useRoleContext = (): RoleContextType => {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRoleContext must be called inside a <RoleProvider>.");
  }
  return ctx;
};

export const userInfo = useRoleContext;
