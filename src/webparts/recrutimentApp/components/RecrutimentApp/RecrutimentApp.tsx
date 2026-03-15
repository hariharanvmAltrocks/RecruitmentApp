import React, { useState } from 'react';
import MainLayout from './MainLayout';
import AppRoutes from '../SideBar/Approutes';
import { IRecrutimentAppProps } from '../IRecrutimentAppProps';
import { useRoleContext } from '../../utilities/hooks/RoleContext';
import { useStateHooks } from './useStateHooks';

export default function RecrutimentApp(props: IRecrutimentAppProps) {

  const { roleIDs } = useRoleContext();

  const { activeMenuID, setactiveMenuID } = useStateHooks();

  return (
    <>
      <MainLayout
        RoleID={roleIDs}
        activeMenuID={activeMenuID}
        setactiveMenuID={setactiveMenuID}
      >
        <AppRoutes
          props={props}
        />
      </MainLayout>
    </>
  );
}
