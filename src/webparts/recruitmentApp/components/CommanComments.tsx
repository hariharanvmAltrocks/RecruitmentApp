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

interface props {
  onClose: () => void;
  Comments: CommentsData[] | undefined;
  TermsAndCondition?: boolean;
}
const boldLabelStyles: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "18px",
};

const labelStyles: React.CSSProperties = {
  fontSize: "15px",
};

function CommanComments({ onClose, Comments }: props) {
  const tabs = [
    {
      label: "My Submission",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            {/* <div
                            className="menu-card"
                            style={{ height: "500px", overflow: "auto" }}
                        > */}
            {/* <div className="ms-Grid-row" style={{ marginLeft: "15%" }}>

                                <div
                                    className="ms-Grid-col ms-lg6"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginLeft: "6%",
                                    }}
                                >
                                    <LabelHeaderComponents
                                        value={"Justification "}
                                    >
                                        {" "}
                                    </LabelHeaderComponents>

                                    <p style={{ padding: "1.2%" }}><b>{ } </b></p>
                                </div>
                                <div
                                    className="ms-Grid-col ms-lg5"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginLeft: "2%",
                                    }}
                                >
                                    <ReuseButton
                                        Style={{
                                            height: "21px",
                                            width: "2%",
                                            minWidth: "auto",
                                            paddingLeft: "10px",
                                            paddingRight: "10px",
                                            backgroundColor: "#EF3340",
                                        }}
                                        imgSrc={require("../assets/Viewicon.svg")}
                                        imgAlt="ssss"
                                        // imgAltHover="Image"
                                        // imgSrcHover={iconclose}
                                        onClick={onClose}
                                    />
                                </div>
                            </div> */}

            {Comments && Comments.length > 0 ? (
              <>
                {Comments.map((item: any, index: number) => (
                  <div
                    key={index} // Ensure each child has a unique key
                    className="sub-menu-card"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <LabelHeaderComponents
                          value={`Submitted by ${item?.RoleName ?? ""}`}
                        />
                      </div>
                    </div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <Labelheader value="Justification" />
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
                      // <div style={{ marginTop: "10px" }}>
                      <Label style={labelStyles}>
                        {moment(item?.Date).format("DD-MMM-YYYY - hh:mm A")}
                      </Label>
                      // </div>
                    )}

                    {/* <div
                      className="ms-Grid-row"
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <div className="ms-Grid-col ms-lg6">
                        <Labelheader value="Job Title in English" />
                        <LabelValue value={item?.JobTitleInEnglish} />
                      </div>
                      <div className="ms-Grid-col ms-lg6">
                        <Labelheader value="Job Title in French" />
                        <LabelValue value={item?.JobTitleInFrench} />
                      </div>
                    </div> */}
                    <div
                      className="ms-Grid-row"
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      {/* <div className="ms-Grid-col ms-lg6">
                        <Labelheader value="Name" />
                        <LabelValue value={item?.Name} />
                      </div> */}
                      {/* <div className="ms-Grid-col ms-lg6">
                        <Labelheader value="Date Submitted" />
                        <LabelValue
                          value={
                            item?.Date
                              ? moment(item?.Date).format("DD/MM/YYYY")
                              : "N/A"
                          }
                        />
                      </div> */}
                    </div>
                  </div>
                ))}
                {/* <div className="ms-Grid-row">
                                         <div
                                             style={{
                                                 marginRight: "10px",
                                                 display: "flex",
                                                 justifyContent: "flex-end",
                                             }}
                                         >
                                             <ReuseButton
                                                 label="Close"
                                                 onClick={this.props.onClose}
                                                 spacing={4}
                                             />
                                         </div>
                                     </div> */}
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
            {/* </div> */}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    // <CustomLoader isLoading={isLoading}>
    <div className="menu-card">
      <TabsComponent tabs={tabs} initialTab="tab1" />
    </div>
    // </CustomLoader>
  );
}

export default CommanComments;
