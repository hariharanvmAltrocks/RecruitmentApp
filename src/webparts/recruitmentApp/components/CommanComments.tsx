import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReuseButton from "./ReuseButton";
import Labelheader from "./LabelHeader";
import LabelValue from "./LabelValue";
import * as moment from "moment";
import LabelHeaderComponents from "./TitleHeader";
import TabsComponent from "./TabsComponent ";
import { CommentsData } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import { Label } from "@fluentui/react";
import { TabName } from "../utilities/Config";

interface props {
  onClose: () => void;
  Comments: CommentsData[] | undefined;
  TermsAndCondition?: boolean;
}
const boldLabelStyles: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "18px",
  margin: 0,
  padding: 0,
};

const labelStyles: React.CSSProperties = {
  fontSize: "15px",
  margin: 0,
  padding: 0,
};

function CommanComments({ onClose, Comments }: props) {
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
                          <LabelHeaderComponents
                            value={`Submitted by ${item?.RoleName ?? ""}`}
                          />
                        </div>
                      </div>
                      <div className="ms-Grid-row">
                        <div
                          className="ms-Grid-col ms-lg12"
                          style={{ marginBottom: "2%" }}
                        >
                          <Labelheader value="Comments" />

                          <LabelValue value={item?.comments ?? "N/A"} />
                        </div>
                      </div>
                      <div className="ms-Grid-row"></div>
                      {item?.Name && (
                        <div>
                          <Label style={boldLabelStyles}>{item?.Name}</Label>
                        </div>
                      )}
                      {item?.JobTitleInEnglish && (
                        <div>
                          <Label className="title" style={labelStyles}>
                            {item?.JobTitleInEnglish}
                          </Label>
                        </div>
                      )}
                      {item?.JobTitleInFrench && (
                        <div>
                          <Label className="title" style={labelStyles}>
                            {item?.JobTitleInFrench}
                          </Label>
                        </div>
                      )}
                      {item.UserRoleName && (
                        <div>
                          <Label style={labelStyles}>{item.UserRoleName}</Label>
                        </div>
                      )}
                      {item.Department && (
                        <div>
                          <Label style={labelStyles}>{item.Department}</Label>
                        </div>
                      )}
                      {item?.Date && (
                        <Label style={labelStyles}>
                          {moment(item?.Date).format("DD-MMM-YYYY - hh:mm A")}
                        </Label>
                      )}
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

export default CommanComments;
