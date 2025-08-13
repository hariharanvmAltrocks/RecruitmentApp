import * as React from "react";
import { CustomViewDocument } from "../OfferMedicalProcess/UploadCandidateDocument";
import { Card, CardContent } from "@mui/material";
import CustomDialogbox from "../../components/CustomDialogbox";
import { ColorCode } from "../../utilities/Config";
import ReuseButton from "../../components/ReuseButton";

interface AssignPositionDialogProps {
  data: CustomViewDocument[];
  onClose: () => void;
}

export const ViewCandidateDocument = ({
  data,
  onClose,
}: AssignPositionDialogProps) => {
  const [documentPopup, setDocumentPopup] = React.useState<boolean>(false);
  const [documentcontent, setDocumentcontent] = React.useState<string>("");

  function view_fn(url: any) {
    setDocumentPopup(true);
    setDocumentcontent(url);
  }

  const getIframeSrc = (fileUrl: string): string => {
    if (fileUrl.endsWith(".pdf")) {
      return fileUrl;
    } else if (fileUrl.endsWith(".docx")) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        fileUrl
      )}`;
    } else {
      return ""; // or show error
    }
  };
  return (
    <>
      <div className="ms-Grid-row">
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            width: "96%",
            marginLeft: "2%",
            // minHeight: "80vh",
          }}
        >
          <CardContent>
            <div style={{ padding: "2%" }}>
              {data.length === 0 ? (
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  No Candidate Document are found
                </p>
              ) : (
                data.map((item, index) => (
                  <div key={index} style={{ marginBottom: "15px" }}>
                    <div
                      className="ms-Grid-row"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="ms-Grid-col ms-lg10">
                        <div
                          style={{
                            minWidth: 85,
                            fontWeight: "bold",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "17px",
                          }}
                        >
                          {item?.Title}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            // color: "red",
                            marginLeft: "1%",
                            // fontWeight: "bold",
                            // fontSize: "17px",
                          }}
                        >
                          {" "}
                          File Name: {item?.DocumentName ?? "—"}
                        </div>
                      </div>

                      {/* <div className="ms-Grid-col ms-lg2"> */}
                      <a
                        style={{
                          marginRight: "10px",
                          color: "antiquewhite",
                        }}
                      >
                        <img
                          src={require("../../assets/Viewicon.svg")}
                          alt="Stamp Icon"
                          style={{
                            width: "63%", // scales with font size
                            height: "auto",
                            cursor: "pointer",
                            marginLeft: "32%",
                          }}
                          onClick={() => view_fn(item?.DocumentContent)}
                        />
                        {/* <ReuseButton
                              label="View"
                              onClick={() => view_fn(item?.DocumentContent)}
                              Style={{
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                                color: "white",
                                width: "50%",
                              }}
                            /> */}
                      </a>
                      {/* </div> */}

                      {/* <div className="ms-Grid-col ms-lg2"> */}
                      <div>
                        <a
                          href={item?.DocumentContent}
                          download
                          style={{
                            marginRight: "10px",
                            color: "antiquewhite",
                          }}
                        >
                          <img
                            src={require("../../assets/Download.svg")}
                            alt="Stamp Icon"
                            style={{
                              width: "50%", // scales with font size
                              height: "auto",
                              maxWidth: "40px", // limit maximum size
                              cursor: "pointer",
                            }}
                          />
                          {/* <button>Download</button> */}
                        </a>
                      </div>
                      {/* </div> */}
                    </div>

                    <hr />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {documentPopup ? (
        <>
          <CustomDialogbox
            Style={{ width: "45vw", height: "35vw" }}
            visible={documentPopup}
            children={
              <iframe
                src={getIframeSrc(documentcontent)}
                title="PDF Document"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              ></iframe>
            }
            onClose={() => setDocumentPopup(false)}
            header={
              <div style={{ textAlign: "center", width: "100%" }}>
                <h2
                  style={{
                    color: ColorCode.LabelStyleColorCode.LabelStyleColor,
                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                              -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                  }}
                >
                  {" "}
                  Candidate Documents
                </h2>
              </div>
            }
            footer={
              <div
                className="ms-Grid-row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px 0",
                  gap: "33px",
                }}
              >
                <ReuseButton
                  label="Close"
                  onClick={() => setDocumentPopup(false)}
                  Style={{
                    backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                    color: "white",
                    width: "50%",
                  }}
                />
              </div>
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
