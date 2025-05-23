import * as React from "react";
import { Card } from "@mui/material";

import TabsComponent from "./TabsComponent ";

const CommanFieldTemplate = (props: any) => {
  const tabs = [
    {
      label: "My Submission",
      value: "tab1",
      content: <div className="menu-card"></div>,
    },
  ];

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
        <React.Fragment>
          <TabsComponent
            tabs={tabs}
            initialTab="tab1"
            //  tabClassName={"Tab"}
          />
        </React.Fragment>
      </Card>
    </>
  );
};
export default CommanFieldTemplate;
