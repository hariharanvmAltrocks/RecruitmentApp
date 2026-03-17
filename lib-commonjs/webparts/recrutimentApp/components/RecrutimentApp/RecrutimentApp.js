"use strict";
// import React, { useState } from 'react';
// import MainLayout from './MainLayout';
// import AppRoutes from '../SideBar/Approutes';
// import { IRecrutimentAppProps } from '../IRecrutimentAppProps';
// import { useRoleContext } from '../../utilities/hooks/RoleContext';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecrutimentApp;
var tslib_1 = require("tslib");
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
var react_1 = tslib_1.__importStar(require("react"));
var MainLayout_1 = tslib_1.__importDefault(require("./MainLayout"));
var Approutes_1 = tslib_1.__importDefault(require("../SideBar/Approutes"));
var RoleContext_1 = require("../../utilities/hooks/RoleContext");
function RecrutimentApp(props) {
    var roleIDs = (0, RoleContext_1.useRoleContext)().roleIDs;
    var _a = (0, react_1.useState)(0), activeMenuID = _a[0], setactiveMenuID = _a[1];
    var _b = (0, react_1.useState)(false), isFormOpen = _b[0], setIsFormOpen = _b[1];
    var combinedProps = tslib_1.__assign(tslib_1.__assign({}, props), { onFormStateChange: setIsFormOpen });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MainLayout_1.default, { RoleID: roleIDs, activeMenuID: activeMenuID, setactiveMenuID: setactiveMenuID, isFormOpen: isFormOpen },
            react_1.default.createElement(Approutes_1.default, { props: combinedProps }))));
}
//# sourceMappingURL=RecrutimentApp.js.map