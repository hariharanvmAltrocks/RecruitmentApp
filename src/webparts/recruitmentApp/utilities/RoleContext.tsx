
import * as React from "react";
import { sp } from "@pnp/sp";
import { createContext, useContext, useState, useEffect } from "react";
import CustomLoader from "../Services/Loader/CustomLoader";
import GraphService from "../Services/GraphService/GraphService";
import { masterService } from "../Services/ServiceExport";
import { MasterData, UserRoleData } from "../Models/Master";
import { ResponeStatus } from "./Config";
import RoleSelectionPage from "./RoleSelectionPage";

export type RoleContextType = {
  roleID: number | undefined;
  userName: string | undefined;
  userRole: string | undefined;
  masterData: MasterData | undefined;
  ADGroupData: ADGroupData | undefined;
};

type ADGroupData = {
  roleID: number | undefined;
  userName: string | undefined;
  userRole: string | undefined;
  ADGroupIDs: any;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: any) => {
  const [roleID, setRoleID] = useState<number | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [masterData, setMasterData] = useState<MasterData | undefined>(undefined);
  const [ADGroupData, setADGroupData] = useState<ADGroupData | undefined>(undefined);
  const [availableRoles, setAvailableRoles] = useState<UserRoleData[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    void getUserRole();
  }, []);

  async function getUserRole() {
    setIsLoading(true);
    try {
      const currentUser = await sp.web.currentUser();
      const userEmail = currentUser.Email;
      setUserName(currentUser.Title);

      const userDetails = await masterService.userRole();
      if (userDetails.status === ResponeStatus.SUCCESS && userDetails.data) {
        const azureGroupIdsArray = userDetails.data.map(
          (item: UserRoleData) => item.ADGroupID
        );

        const { matchedRoles } = await getUserRoleFromGroups(
          azureGroupIdsArray,
          userEmail,
          userDetails.data
        );

        setAvailableRoles(matchedRoles);

        if (matchedRoles.length === 1) {
          await finalizeRoleSelection(matchedRoles[0]);
        } else if (matchedRoles.length > 1) {
          setShowRoleSelector(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getUserRoleFromGroups(
    azureGroupIds: string[],
    userEmail: string,
    userDetails: UserRoleData[]
  ): Promise<{
    roleId: number | null;
    userRole: string | null;
    matchedRoles: UserRoleData[];
  }> {
    try {
      const graphClient = GraphService.getGraphClient();
      let matchedRoleId: number | null = null;
      let matchedRoleTitle: string | null = null;
      const matchedRoles: UserRoleData[] = [];

      for (const groupId of azureGroupIds) {
        if (!groupId || groupId === "0" || groupId === "23c6870c-1986-4f19-81ec-6b72e199f6e6") continue;

        const response = await graphClient.api(`/groups/${groupId}/members`).get();
        const members = response.value || [];

        const isMember = members.some(
          (member: any) =>
            member.userPrincipalName?.toLowerCase() === userEmail.toLowerCase()
        );

        if (isMember) {
          const matchedRole = userDetails.find((item) => item.ADGroupID === groupId);
          if (matchedRole) {
            matchedRoles.push(matchedRole);
            console.log(`Matched Role: ${matchedRole.RoleTitle} (Group ID: ${groupId})`);

            if (!matchedRoleId) {
              matchedRoleId = matchedRole.ID;
              matchedRoleTitle = matchedRole.RoleTitle;

              const ADGroupData: ADGroupData = {
                roleID: matchedRole.ID,
                userName: matchedRole.RoleTitle,
                ADGroupIDs: matchedRole.ADGroupID,
                userRole: userName ?? undefined,
              };
              setADGroupData(ADGroupData);
            }
          }
        }
      }

      return { roleId: matchedRoleId, userRole: matchedRoleTitle, matchedRoles };
    } catch (error) {
      console.error("Error checking user in Azure AD groups:", error);
      return { roleId: null, userRole: null, matchedRoles: [] };
    }
  }

  async function finalizeRoleSelection(role: UserRoleData) {
    setIsLoading(true);
    try {
      const currentUser = await sp.web.currentUser();
      const userEmail = currentUser.Email;
      const groupId = role.ADGroupID;
      const graphClient = GraphService.getGraphClient();
      const response = await graphClient.api(`/groups/${groupId}/members`).get();
      const members = response.value || [];

      const isMember = members.some(
        (member: any) =>
          member.userPrincipalName?.toLowerCase() === userEmail.toLowerCase()
      );

      if (!isMember) {
        alert("You are not authorized for this role.");
        return;
      }

      setRoleID(role.ID);
      setUserRole(role.RoleTitle);

      const MasterDataDetails = await masterService.MasterData(
        userEmail,
        role.ID,
        currentUser.Title,
        role.RoleTitle
      );

      if (MasterDataDetails.status === ResponeStatus.SUCCESS && MasterDataDetails.data) {
        setMasterData(MasterDataDetails.data);
        setADGroupData({
          roleID: role.ID,
          userName: role.RoleTitle,
          ADGroupIDs: role.ADGroupID,
          userRole: currentUser.Title,
        });
        setShowRoleSelector(false);
      }
    } catch (error) {
      console.error("Error finalizing role selection:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <RoleContext.Provider value={{ roleID, userName, userRole, masterData, ADGroupData }}>
      {showRoleSelector ? (
        <RoleSelectionPage roles={availableRoles} onRoleSelect={finalizeRoleSelection} />
      ) : roleID && userName && userRole && masterData && ADGroupData ? (
        children
      ) : (
        <CustomLoader isLoading={isLoading} />
      )}
    </RoleContext.Provider>
  );
};

export const userInfo = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("userInfo must be used within a RoleProvider");
  }
  return context;
};