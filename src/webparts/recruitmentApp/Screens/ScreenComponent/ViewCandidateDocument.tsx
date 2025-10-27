import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { ColorCode } from "../../utilities/Config";
import ReuseButton from "../../components/ReuseButton";
import AlertDialogbox from "../../components/CustomAlert/AlertDialogbox";
import { DisplayFolderName } from "../../utilities/LabelName";

interface AssignPositionDialogProps {
  data: any[];
  onClose: () => void;
  webUrl: string;
}

export const ViewCandidateDocument = ({
  data,
  onClose,
  webUrl,
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
      // const absoluteUrl = fileUrl.startsWith("http")
      //   ? fileUrl
      //   : `${webUrl.split("/sites")[0]}${fileUrl}`;
      const viewerUrl = `${webUrl}/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(
        fileUrl
      )}&action=embedview`;
      // Office viewer requires a publicly accessible link
      return viewerUrl;
    } else {
      return fileUrl;
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
              {/* {data.length === 0 ? (
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
              ) : ( */}
              {data.map((item, index) => {
                if (item[0]?.Title === DisplayFolderName.PersonalDocument) {
                  return item[0].data.map((subitem: any, subindex: any) => (
                    <div key={subindex} style={{ marginBottom: "15px" }}>
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
                            {subitem?.Title}
                          </div>
                          <div
                            style={{
                              fontFamily: '"Roboto", sans-serif',
                              marginLeft: "1%",
                            }}
                          >
                            File Name: {subitem?.DocumentName ?? "—"}
                          </div>
                        </div>

                        <a
                          style={{ marginRight: "10px", color: "antiquewhite" }}
                          onClick={() => view_fn(subitem?.DocumentContent)}
                        >
                          <img
                            src={require("../../assets/Viewicon.svg")}
                            alt="View Icon"
                            style={{
                              width: "63%",
                              height: "auto",
                              cursor: "pointer",
                              marginLeft: "32%",
                            }}
                          />
                        </a>

                        <div>
                          <a
                            href={subitem?.DocumentContent}
                            download
                            style={{
                              marginRight: "10px",
                              color: "antiquewhite",
                            }}
                          >
                            <img
                              src={require("../../assets/Download.svg")}
                              alt="Download Icon"
                              style={{
                                width: "50%",
                                height: "auto",
                                maxWidth: "40px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ));
                } else {
                  return (
                    <div
                      key={`other-${index}`}
                      style={{ marginBottom: "15px" }}
                    >
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
                              marginLeft: "1%",
                            }}
                          >
                            File Name: {item?.DocumentName ?? "—"}
                          </div>
                        </div>

                        <a
                          style={{ marginRight: "10px", color: "antiquewhite" }}
                          onClick={() => view_fn(item?.DocumentContent)}
                        >
                          <img
                            src={require("../../assets/Viewicon.svg")}
                            alt="View Icon"
                            style={{
                              width: "63%",
                              height: "auto",
                              cursor: "pointer",
                              marginLeft: "32%",
                            }}
                          />
                        </a>

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
                              alt="Download Icon"
                              style={{
                                width: "50%",
                                height: "auto",
                                maxWidth: "40px",
                                cursor: "pointer",
                              }}
                            />
                          </a>
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                }
              })}

              {/* )} */}
            </div>
          </CardContent>
        </Card>
      </div>

      {documentPopup ? (
        <>
          <AlertDialogbox
            Style={{ width: "75vw", height: "41vw" }}
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
