import * as React from "react";
import { useMediaQuery } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ColorCode } from "../utilities/Config";

interface FormFields {
  userName?: string;
  userRole?: string[];
  Department?: string;
}

function CustomProfileComponent({
  userName,
  userRole,
  Department,
}: FormFields) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div
      style={{
        display: "flex",
        // width: isMobile ? "90%" : "47%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: isMobile ? "flex-start" : "center",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: isMobile ? "10px" : "5px 10px",
        boxShadow: "0px 5px 10px 0px #0F4B8426",
        margin: isMobile ? "10px auto" : "0",
      }}
    >
      <AccountCircleIcon
        style={{
          fontSize: isMobile ? 36 : 46,
          color: ColorCode.ProfileColorCode.colorCode,
          marginRight: "10px",
        }}
      />
      <div>
        <p
          style={{
            margin: 0,
            color: ColorCode.ProfileColorCode.colorCode,
            fontWeight: "400",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          Welcome,&nbsp;
          <span style={{ fontWeight: "bold" }}>{userName}</span>
        </p>
        <p
          style={{
            margin: 0,
            fontWeight: "400",
            fontSize: isMobile ? "11px" : "12px",
            color: ColorCode.ProfileColorCode.colorCode,
            marginTop: "4px",
          }}
        >
          ({Department?.split("-")[1] ?? ""})
        </p>
      </div>
    </div>
  );
}

export default CustomProfileComponent;

//  {ADGroupData?.RoleDetails.length > 1 ? (
//         <div className="ms-Grid-row">
//           <div className="ms-Grid-col ms-lg8">
//             <p
//               style={{
//                 margin: 0,
//                 color: ColorCode.ProfileColorCode.colorCode,
//                 fontWeight: "400",
//                 fontSize: isMobile ? "12px" : "14px",
//               }}
//             >
//               Welcome,&nbsp;
//               <span style={{ fontWeight: "bold" }}>{userName}</span>
//             </p>
//           </div>
//           {/* <div className="ms-Grid-col ms-lg4">
//             <img
//               src={require("../assets/logout.png")}
//               alt="Logout"
//               style={{
//                 width: isMobile ? "40px" : "40px",
//                 marginLeft: isMobile ? "10px" : "20%",
//                 cursor: "pointer",
//               }}
//               onClick={() => setShowRoleSelector(true)}
//             />
//           </div> */}
//           <p
//             style={{
//               margin: 0,
//               fontWeight: "400",
//               fontSize: isMobile ? "11px" : "12px",
//               color: ColorCode.ProfileColorCode.colorCode,
//               marginTop: "4px",
//             }}
//           >
//             ({userRole} - {Department?.split("-")[1] ?? ""})
//           </p>
//         </div>
//       ) : (
//         <div>
//           <p
//             style={{
//               margin: 0,
//               color: ColorCode.ProfileColorCode.colorCode,
//               fontWeight: "400",
//               fontSize: isMobile ? "12px" : "14px",
//             }}
//           >
//             Welcome,&nbsp;
//             <span style={{ fontWeight: "bold" }}>{userName}</span>
//           </p>
//           <p
//             style={{
//               margin: 0,
//               fontWeight: "400",
//               fontSize: isMobile ? "11px" : "12px",
//               color: ColorCode.ProfileColorCode.colorCode,
//               marginTop: "4px",
//             }}
//           >
//             ({userRole} - {Department?.split("-")[1] ?? ""})
//           </p>
//         </div>
//       )}
