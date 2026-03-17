// import React, { useState } from 'react';
// import MainLayout from './MainLayout';
// import AppRoutes from '../SideBar/Approutes';
// import { IRecrutimentAppProps } from '../IRecrutimentAppProps';
// import { useRoleContext } from '../../utilities/hooks/RoleContext';

// export default function RecrutimentApp(props: IRecrutimentAppProps) {

//   const { roleIDs } = useRoleContext();
//   const [activeMenuID, setactiveMenuID] = useState<number>(0);
//   console.log(activeMenuID, "activeMenuID")
//   return (
//     <>
//       <MainLayout
//         RoleID={roleIDs}
//         activeMenuID={activeMenuID}
//         setactiveMenuID={setactiveMenuID}
//       >
//         <AppRoutes
//           props={props}
//         />
//       </MainLayout>
//     </>
//   );
// }
//========================
import React, { useState } from 'react';
import MainLayout from './MainLayout';
import AppRoutes from '../SideBar/Approutes';
import { IRecrutimentAppProps } from '../IRecrutimentAppProps';
import { useRoleContext } from '../../utilities/hooks/RoleContext';

export default function RecrutimentApp(props: IRecrutimentAppProps) {
  const { roleIDs } = useRoleContext();
  const [activeMenuID, setactiveMenuID] = useState<number>(0);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const combinedProps = {
    ...props,
    onFormStateChange: setIsFormOpen
  };

  return (
    <>
      <MainLayout
        RoleID={roleIDs}
        activeMenuID={activeMenuID}
        setactiveMenuID={setactiveMenuID}
        isFormOpen={isFormOpen}
      >
        <AppRoutes
          props={combinedProps}
        />
      </MainLayout>
    </>
  );
}