import * as React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface FormFields {
  userName: string | undefined;
  userRole: string | undefined;
  Department: string | undefined;
}

function CustomProfileComponent({
  userName,
  userRole,
  Department,
}: FormFields) {
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "47%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "5px",
          paddingLeft: "10px",
          paddingRight: "10px",
          boxShadow: "0px 5px 10px 0px #0F4B8426",
        }}
      >
        <AccountCircleIcon style={{ fontSize: 46, color: "#597b98" }} />

        <div>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "5px",
              color: "#597b98", //"#0D547B",
              fontWeight: "400",
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            Welcome,
            <p
              style={{
                fontWeight: "bold",
                color: "#597b98", // "#0D547B",
              }}
            >
              {userName}
            </p>
          </p>
          <div style={{ marginTop: "-9%" }}>
            <p
              style={{
                //display: "flex",
                //alignItems: "center",
                // margin: "5px",
                fontWeight: "400",
                fontSize: "12px",
                marginLeft: "5px",
                color: "#597b98", //"#0D547B",
              }}
            >
              ({userRole} - {Department?.split("-")[1] ?? ""})
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomProfileComponent;
