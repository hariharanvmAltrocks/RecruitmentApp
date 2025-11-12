import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { labelNames } from "../../utilities/LabelName";
import { Dialog } from "primereact/dialog";

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
  const [IsExpanded, setIsExpanded] = React.useState<number | null>(0);

  function view_fn(url: any) {
    setDocumentPopup(true);
    setDocumentcontent(url);
  }

  function handleFileDownload(event: React.MouseEvent, documentUrl: string) {
    event.preventDefault();
    setDocumentPopup(true);
    setDocumentcontent(documentUrl);
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
      return viewerUrl;
    } else {
      return fileUrl;
    }
  };

  const handleExpand = (index: number) => {
    setIsExpanded((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <div className="ms-Grid-row">
        {/* <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            width: "96%",
            marginLeft: "2%",
            // minHeight: "80vh",
          }}
        >
          <CardContent> */}
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
          <Card
            sx={{
              mb: 2,
              borderRadius: "4px",
              borderColor: "#5f5f5f",
              boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
              height: "auto",
              transition: "height 0.3s ease-in-out",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                minHeight: 300,
                maxHeight: 400,
                overflowY: "auto",
                pr: 1,
              }}
            >
              {data.length > 0 ? (
                <>
                  {data.map((item, index) => {
                    const isExpanded = IsExpanded === index;
                    if (item.data.length > 0) {
                      return (
                        <>
                          <Box
                            // key={item.id}
                            sx={{
                              boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                              borderRadius: "4px",
                              borderColor: "#5f5f5f",
                              marginTop: "1%",
                            }}
                          >
                            <Accordion
                              expanded={isExpanded}
                              onChange={() => handleExpand(index)}
                              sx={{
                                boxShadow: "none",
                                borderBottom: "1px solid #ddd",
                                "&:last-of-type": {
                                  borderBottom: "none",
                                },
                                mb: 2,
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                  color: "rgb(50, 49, 48)",
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                    fontSize: "14px",
                                    flexGrow: 1,
                                  }}
                                >
                                  {item?.Title}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails
                                style={{
                                  position: "relative",
                                  bottom: "24px",
                                }}
                              >
                                {item.data.map((docs: any, index: any) => {
                                  const fileName = docs.name;
                                  const truncatedFileName =
                                    fileName.length > 100
                                      ? fileName.substring(0, 30) + "..."
                                      : fileName;
                                  return (
                                    <div key={index}>
                                      <div
                                        className="ms-Grid-row"
                                        style={{
                                          display: "flex",
                                          marginLeft: "1%",
                                          marginTop: "2%",
                                        }}
                                      >
                                        <div
                                          className="ms-Grid-col ms-lg6"
                                          style={{ marginRight: "1rem" }}
                                        >
                                          <Tooltip title={docs.name} arrow>
                                            <Link
                                              href="#"
                                              onClick={(e) =>
                                                handleFileDownload(
                                                  e,
                                                  docs.content
                                                )
                                              }
                                              style={{
                                                color: "blue",
                                                fontWeight: "bold",
                                                display: "inline-block",
                                                // maxWidth: "100%",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              FileName : {truncatedFileName}
                                            </Link>
                                          </Tooltip>
                                        </div>
                                        <div className="ms-Grid-col ms-lg6">
                                          <a
                                            style={{
                                              marginRight: "10px",
                                              color: "antiquewhite",
                                            }}
                                            onClick={() =>
                                              view_fn(docs?.content)
                                            }
                                          >
                                            <img
                                              src={require("../../assets/Viewicon.svg")}
                                              alt="View Icon"
                                              style={{
                                                width: "25px",
                                                // height: "auto",
                                                cursor: "pointer",
                                                marginLeft: "32%",
                                              }}
                                            />
                                          </a>
                                          <a
                                            href={docs?.content}
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
                                                width: "25px",
                                                height: "auto",
                                                maxWidth: "40px",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        </>
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: "gray",
                      textAlign: "center",
                    }}
                  >
                    No documents available.
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* )} */}
        </div>
        {/* </CardContent>
        </Card> */}
      </div>

      {documentPopup ? (
        <>
          <Dialog
            className="document-viewer"
            style={{
              width: "75vw",
              height: "41vw",
              // overflowY: "hidden",
              zIndex: 9999,
              backgroundColor: "white",
              borderRadius: "5px",
            }}
            visible={documentPopup}
            children={
              <iframe
                src={getIframeSrc(documentcontent)}
                width="100%"
                height="600px"
                frameBorder="0"
                style={{ border: "none" }}
              ></iframe>
            }
            onHide={() => setDocumentPopup(false)}
            header={labelNames.DocumentViewer}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
