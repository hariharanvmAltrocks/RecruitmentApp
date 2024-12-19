import * as React from "react";
import { sp } from "@pnp/sp";
import { createContext, useContext, useState, useEffect } from "react";
import CustomLoader from "../Services/Loader/CustomLoader";
import GraphService from "../Services/GraphService/GraphService";
import { masterService } from "../Services/ServiceExport";
import { MasterData, UserRoleData } from "../Models/Master";
import { ResponeStatus } from "./Config";

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
    ADGroupIDs: any
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: any) => {
    const [roleID, setRoleID] = useState<number | undefined>(undefined);
    const [userName, setUserName] = useState<string | undefined>(undefined);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [masterData, setMasterData] = useState<MasterData | undefined>(undefined);
    const [ADGroupData, setADGroupData] = useState<ADGroupData | undefined>(undefined);

    useEffect(() => {
        void getUserRole();
    }, [userRole]);

    async function getUserRole() {
        setIsLoading(true);
        try {
            const currentUser = await sp.web.currentUser();
            setUserName(currentUser.Title);
            const userEmail = currentUser.Email
            const userDetails = await masterService.userRole();

            if (userDetails.status === ResponeStatus.SUCCESS && userDetails.data) {
                const azureGroupIdsArray = userDetails.data.map(
                    (item: UserRoleData) => item.ADGroupID
                );

                const { roleId, userRole } = await getUserRoleFromGroups(
                    azureGroupIdsArray,
                    userEmail,
                    userDetails.data
                );

                if (roleId && userRole) {
                    setRoleID(roleId);
                    setUserRole(userRole);
                    const MasterDataDetails = await masterService.MasterData(userEmail, roleId, currentUser.Title, userRole);
                    if (MasterDataDetails.status === ResponeStatus.SUCCESS && MasterDataDetails.data) {
                        setMasterData(MasterDataDetails.data)
                    }


                } else {
                    console.warn("User is not a member of the specified groups.");
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
    ): Promise<{ roleId: number | null; userRole: string | null }> {
        try {
            const graphClient = GraphService.getGraphClient();

            for (const groupId of azureGroupIds) {
                if (!groupId || groupId === "0") {
                    continue;
                }
                const response = await graphClient
                    .api(`/groups/${groupId}/members`)
                    .get();
                const members = response.value || [];
                if (
                    members.some(
                        (member: any) => member.userPrincipalName?.toLowerCase() === userEmail.toLowerCase()
                    )
                ) {
                    const currentLogin = userDetails.find(
                        (item) => item.ADGroupID === groupId
                    );

                    const ADGroupData: ADGroupData = {
                        roleID: currentLogin?.ID ?? undefined,
                        userName: currentLogin?.RoleTitle ?? undefined,
                        ADGroupIDs: currentLogin?.ADGroupID ?? undefined,
                        userRole: userName ?? undefined
                    }
                    setADGroupData(ADGroupData)
                    return {
                        roleId: currentLogin?.ID ?? null,
                        userRole: currentLogin?.RoleTitle ?? null,
                    };

                }
            }
            return { roleId: null, userRole: null };
        } catch (error) {
            console.error("Error checking user in groups:", error);
            return { roleId: null, userRole: null };
        }
    }

    return (
        <RoleContext.Provider value={{ roleID, userName, userRole, masterData, ADGroupData }}>
            {roleID && userName && userRole && masterData && ADGroupData ? (
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

