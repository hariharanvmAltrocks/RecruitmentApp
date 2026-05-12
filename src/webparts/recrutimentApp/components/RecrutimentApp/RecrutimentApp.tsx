import React, { useState } from "react";
import MainLayout from "./MainLayout";
import AppRoutes from "../SideBar/Approutes";
import { IRecrutimentAppProps } from "../IRecrutimentAppProps";
import { useRoleContext } from "../../utilities/hooks/RoleContext";
import { useUIState } from "./UIStateContext";

export default function RecrutimentApp(props: IRecrutimentAppProps) {
  const { roleIDs } = useRoleContext();

  const { activeMenuID, setActiveMenuID } = useUIState();

  console.log("Recruitment App V-1.2 -- 13-05-2026");

  return (
    <>
      <MainLayout
        RoleID={roleIDs}
        activeMenuID={activeMenuID}
        setactiveMenuID={setActiveMenuID}
      >
        <AppRoutes props={props} />
      </MainLayout>
    </>
  );
}
