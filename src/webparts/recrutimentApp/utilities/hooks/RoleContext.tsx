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
import { masterService } from "../../services/ServiceExport";
import { ResponeStatus } from "../ApiConfig";
import GraphService from "../../services/GraphService/GraphService";
import CustomLoader from "../../services/Loader/CustomLoader";
import { RoleContextType, ResolvedRole, UserRoleData, ApiUrls, ADGroupData } from "./IRoleContext";
import { InternalSign } from "../../services/AxiosService/CareerPortalAPI";



const RoleContext = createContext<RoleContextType | undefined>(undefined);


interface ProviderState {
  userName: string;
  userEmail: string;
  resolvedRoles: ResolvedRole[];
  apiUrlsReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

type ProviderAction =
  | { type: "SET_USER"; userName: string; userEmail: string }
  | { type: "SET_RESOLVED_ROLES"; roles: ResolvedRole[] }
  | { type: "SET_API_URLS_READY" }
  | { type: "SET_ERROR"; error: Error }
  | { type: "SET_LOADING"; isLoading: boolean };

const initialState: ProviderState = {
  userName: "",
  userEmail: "",
  resolvedRoles: [],
  apiUrlsReady: false,
  isLoading: true,
  error: null,
};

function providerReducer(
  state: ProviderState,
  action: ProviderAction
): ProviderState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userName: action.userName, userEmail: action.userEmail };
    case "SET_RESOLVED_ROLES":
      return { ...state, resolvedRoles: action.roles };
    case "SET_API_URLS_READY":
      return { ...state, apiUrlsReady: true };
    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

async function fetchCurrentUser(): Promise<{ displayName: string; email: string }> {
  const sp = getSP();
  const user = await sp.web.currentUser();
  return { displayName: user.Title, email: user.Email };
}


async function fetchAllRoles(): Promise<UserRoleData[]> {
  const result = await masterService.userRole();
  if (result.status !== ResponeStatus.SUCCESS || !result.data) return [];
  return result.data as UserRoleData[];
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

async function checkUserRoles(allRoles: UserRoleData[]): Promise<UserRoleData | null> {

  const graphClient = GraphService.getGraphClient();

  const groupIds = allRoles
    .filter((r) => r.ADGroupID && r.ADGroupID !== "0")
    .map((r) => r.ADGroupID);

  if (groupIds.length === 0) return null;

  try {

    const response = await graphClient
      .api("/me/checkMemberGroups")
      .post({ groupIds });

    const matchedRole = allRoles.find((role) =>
      response.value.includes(role.ADGroupID)
    );

    return matchedRole ?? null;

  } catch (error) {
    console.error("Group membership check failed:", error);
    return null;
  }
}


async function initApiUrls(): Promise<boolean> {
  const result = await masterService.GetCareerPortalIntergLink([],"and");
  const urls: ApiUrls = result.data || result;

  localStorage.setItem("CareerPortalLink", urls.CareerPortalLink);
  localStorage.setItem("MeetingCode", urls.MeetingCode);
  localStorage.setItem("MeetingUrl", urls.MeetingUrl);

  const signIn = await InternalSign.InternalSignIn();
  return signIn.status === ResponeStatus.SUCCESS;
}


function buildADGroupData(
  resolvedRoles: ResolvedRole[],
  userName: string
): ADGroupData {
  return {
    roleIDs:    resolvedRoles.map((r) => r.ID),
    userName,
    userRole:   resolvedRoles.map((r) => r.RoleTitle),
    ADGroupIDs: resolvedRoles.map((r) => r.ADGroupID),
    RoleDetails: resolvedRoles,
  };
}

const NoRoleScreen = (): JSX.Element => (
  <div className="mainPage flex">
    <Sidebar />

    <div className="w-[85%] flex flex-col items-center justify-center min-h-full">
      <h3 className="title">
        You are not assigned to any AD Group for HRMS
      </h3>
    </div>
  </div>
);

const ErrorScreen = ({ message }: { message: string }): JSX.Element => (
  <div className="mainPage">
    <Sidebar />
    <div
      style={{
        width: "85%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        gap: "12px",
      }}
    >
      <h3 className="title" style={{ color: "#c0392b" }}>
        Initialisation Error
      </h3>
      <p style={{ color: "#7f8c8d", fontSize: "14px", maxWidth: "480px", textAlign: "center" }}>
        {message}
      </p>
    </div>
  </div>
);

const Sidebar = (): JSX.Element => (
  <div className="w-[15%]">
    <div className="overflow-hidden flex flex-col justify-between rounded-r-[30px] transition-all duration-1000 bg-[#597b98] h-[90vh] w-full">
      
      <div>
        <div className="flex justify-center items-center h-[68px] p-[3px] bg-white rounded-tr-[14px] rounded-br-[14px] w-[90%] my-[20px] transition-all duration-1000">
          
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img
            className="h-[76px] w-[84%] object-contain"
            src={require("../../assets/komoa-logo-name.png")}
            alt="HRMS Logo"
          />

        </div>
      </div>

      <div className="text-white text-[15px] self-center mb-[10px]">
        Version-1.3
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


  const initialise = useCallback(async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", isLoading: true });

    const [, userResult] = await Promise.allSettled([
      initApiUrls()
        .then(() => dispatch({ type: "SET_API_URLS_READY" }))
        .catch((err: unknown) => {
          console.error("[RoleProvider] API URL init failed:", err);
        }),

      (async () => {
        const { displayName, email } = await fetchCurrentUser();
        dispatch({ type: "SET_USER", userName: displayName, userEmail: email });

        const allRoles = await fetchAllRoles();
        const resolved = await checkUserRoles(allRoles);
        const resolvedRoles = resolved ? [{
          ID: resolved.ID,
          RoleTitle: resolved.RoleTitle,
          ADGroupID: resolved.ADGroupID,
          EmailId: email,
        }] : [];
        dispatch({ type: "SET_RESOLVED_ROLES", roles: resolvedRoles });
      })(),
    ]);

    if (userResult.status === "rejected") {
      const raw = userResult.reason;
      dispatch({
        type: "SET_ERROR",
        error: raw instanceof Error ? raw : new Error(String(raw)),
      });
    }

    dispatch({ type: "SET_LOADING", isLoading: false });
  }, []);

  useEffect(() => {
    void initialise();
  }, [initialise]);


  const ADGroupData = buildADGroupData(state.resolvedRoles, state.userName);

  const contextValue: RoleContextType = {
    roleIDs:          ADGroupData.roleIDs,
    userName:         state.userName,
    userRole:         ADGroupData.userRole,
    ADGroupData,
    isLoading:        state.isLoading,
    error:            state.error,
    showRoleSelector,
    setShowRoleSelector,
  };


  const isFullyReady =
    !state.isLoading &&
    !state.error &&
    state.userName !== "" &&
    state.resolvedRoles.length > 0 &&
    state.apiUrlsReady;

  const hasNoRoles =
    !state.isLoading &&
    !state.error &&
    state.userName !== "" &&
    state.resolvedRoles.length === 0;

  return (
    <RoleContext.Provider value={contextValue}>
      <CustomLoader isLoading={state.isLoading}>
        {state.error ? (
          <ErrorScreen message={state.error.message} />
        ) : isFullyReady ? (
          <React.Suspense fallback={<CustomLoader isLoading />}>
            {children}
          </React.Suspense>
        ) : hasNoRoles ? (
          <NoRoleScreen />
        ) : (
          // Still initialising — CustomLoader handles the visual
          null
        )}
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