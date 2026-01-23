import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReuseButton from "./ReuseButton";
import Labelheader from "./LabelHeader";
import LabelValue from "./LabelValue";
import LabelHeaderComponents from "./TitleHeader";
import TabsComponent from "./TabsComponent ";
import { TabName } from "../utilities/Config";

export type BGVComment = {
  BGVCode?: string;
  BGVType: string;
  Remarks: string;
};
interface props {
  onClose: () => void;
  Comments: BGVComment[] | undefined;
  TermsAndCondition?: boolean;
}

function BGVComments({ onClose, Comments }: props) {
  const tabs = [
    {
      label: TabName.ViewJustification,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div
              style={{
                height: "calc(-156px + 80vh)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {Comments && Comments.length > 0 ? (
                <>
                  {Comments.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="sub-menu-card"
                      style={{ marginTop: "20px", overflowY: "auto" }}
                    >
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg12">
                          <LabelHeaderComponents value={item?.BGVType ?? ""} />
                        </div>
                      </div>
                      <div className="ms-Grid-row">
                        <div
                          className="ms-Grid-col ms-lg12"
                          style={{ marginBottom: "2%" }}
                        >
                          <Labelheader value="Remarks" />

                          <LabelValue value={item?.Remarks ?? "N/A"} />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "1.2%",
                    fontSize: "1.3em",
                    marginTop: "16%",
                    marginBottom: "18%",
                  }}
                >
                  No Comments Found
                </p>
              )}
              <div className="ms-Grid-row">
                <div
                  style={{
                    marginRight: "10px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ReuseButton label="Close" onClick={onClose} spacing={4} />
                </div>
              </div>
            </div>

            {/* </div> */}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="menu-card">
      <TabsComponent tabs={tabs} initialTab="tab1" />
    </div>
  );
}

export default BGVComments;
