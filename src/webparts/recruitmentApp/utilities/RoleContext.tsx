import * as React from "react";
import { sp } from "@pnp/sp";
import { createContext, useContext, useState, useEffect } from "react";
import CustomLoader from "../Services/Loader/CustomLoader";
import GraphService from "../Services/GraphService/GraphService";
import { masterService } from "../Services/ServiceExport";
import { MasterData, UserRoleData } from "../Models/Master";
import { ResponeStatus } from "./Config";
import { IMenuService } from "../Services/MenuService/IMenu";
import MenuService from "../Services/MenuService/MenuService";

export type RoleContextType = {
  roleID: number[] | undefined;
  userName: string | undefined;
  userRole: string[] | undefined;
  masterData: MasterData | undefined;
  ADGroupData: ADGroupData | undefined;
  showRoleSelector: boolean;
  setShowRoleSelector: React.Dispatch<React.SetStateAction<boolean>>;
};

type ADGroupData = {
  roleIDs: number[] | undefined;
  userName: string | undefined;
  userRole: string[] | undefined;
  ADGroupIDs: any;
  RoleDetails: any;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: any) => {
  const [roleID, setRoleID] = useState<number[] | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  // const [userEmail, setuserEmail] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [masterData, setMasterData] = useState<MasterData | undefined>(
    undefined
  );
  const [ADGroupData, setADGroupData] = useState<ADGroupData | undefined>(
    undefined
  );
  const [availableRoles, setAvailableRoles] = useState<UserRoleData[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    void getUserRole();
  }, []);

  const MenuItemsService: IMenuService = new MenuService();

  useEffect(() => {
    // console.log(showRoleSelector, "showRoleSelector");
  }, [showRoleSelector]);

  async function getUserRole() {
    setIsLoading(true);
    try {
      const currentUser = await sp.web.currentUser();
      const userEmail = currentUser.Email;
      setUserName(currentUser.Title);
      // setuserEmail(userEmail);
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
        await finalizeRoleSelection(matchedRoles, userEmail);
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
  ): Promise<{ matchedRoles: UserRoleData[] }> {
    try {
      const graphClient = GraphService.getGraphClient();

      const groupChecks = azureGroupIds
        .filter((groupId) => groupId && groupId !== "0")
        .map(async (groupId) => {
          try {
            const response = await graphClient
              .api(`/groups/${groupId}/members`)
              .get();
            const members = response.value || [];

            const isMember = members.some(
              (member: any) =>
                member.userPrincipalName?.toLowerCase() ===
                userEmail.toLowerCase()
            );

            if (isMember) {
              const matchedRole = userDetails.find(
                (item) => item.ADGroupID === groupId
              );
              return matchedRole || null;
            }

            return null;
          } catch (err) {
            console.error(`Error checking group ${groupId}:`, err);
            return null;
          }
        });

      const results = await Promise.all(groupChecks);
      const matchedRoles = results
        .filter((role): role is UserRoleData => role !== null)
        .map((item) => ({
          ID: item.ID,
          RoleTitle: item.RoleTitle,
          ADGroupID: item.ADGroupID,
          EmailId: userEmail,
        }));

      return { matchedRoles };
    } catch (error) {
      console.error("Error checking user in Azure AD groups:", error);
      return { matchedRoles: [] };
    }
  }

  async function finalizeRoleSelection(
    matchedRoles: UserRoleData[],
    EmailId: string
  ) {
    setIsLoading(true);
    try {
      let RoleIDs = matchedRoles.map((role: any) => Number(role.ID));
      let RoleTitles = matchedRoles.map((role: any) => role.RoleTitle);
      setRoleID(RoleIDs);
      setUserRole(RoleTitles);

      const MasterDataDetails = await masterService.MasterData(
        EmailId ?? "",
        RoleIDs,
        userName ?? "",
        RoleTitles
      );

      if (
        MasterDataDetails.status === ResponeStatus.SUCCESS &&
        MasterDataDetails.data
      ) {
        // let RoleIDs = availableRoles.map((item) => item.ID);
        const dynamicMenu = await MenuItemsService.getSwitchUserMatrix(
          matchedRoles
        );
        MasterDataDetails.data.menuMartixData = dynamicMenu.data;
        setMasterData(MasterDataDetails.data);
        setADGroupData({
          roleIDs: RoleIDs,
          userName: matchedRoles[0].RoleTitle,
          ADGroupIDs: matchedRoles[0].ADGroupID,
          userRole: RoleTitles,
          RoleDetails: availableRoles,
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
    <CustomLoader isLoading={isLoading}>
      <RoleContext.Provider
        value={{
          roleID,
          userName,
          userRole,
          masterData,
          ADGroupData,
          showRoleSelector,
          setShowRoleSelector,
        }}
      >
        {roleID && userName && userRole && masterData && ADGroupData ? (
          children
        ) : (
          <CustomLoader isLoading={isLoading} />
        )}
      </RoleContext.Provider>
    </CustomLoader>
  );
};

export const userInfo = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("userInfo must be used within a RoleProvider");
  }
  return context;
};
