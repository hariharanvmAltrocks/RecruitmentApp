import React, { useState } from 'react';
import MainLayout from './MainLayout';
import AppRoutes from '../SideBar/Approutes';
import { IRecrutimentAppProps } from '../IRecrutimentAppProps';
import { useRoleContext } from '../../utilities/hooks/RoleContext';
import { useUIState } from './UIStateContext';

export default function RecrutimentApp(props: IRecrutimentAppProps) {

  const { roleIDs } = useRoleContext();

  const { activeMenuID, setActiveMenuID } = useUIState();

  return (
    <>
      <MainLayout
        RoleID={roleIDs}
        activeMenuID={activeMenuID}
        setactiveMenuID={setActiveMenuID}
      >
        <AppRoutes
          props={props}
        />
      </MainLayout>
    </>
  );
}
