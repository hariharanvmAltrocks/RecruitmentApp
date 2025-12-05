import * as React from "react";
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import {
  CommanStyle,
  DisplayFolderName,
  labelNames,
} from "../../utilities/LabelName";
import { Dialog } from "primereact/dialog";
import CustomViewDocument from "../../components/CustomViewDocument";

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

  const renderBackgroundVerificationRow = (
    docs: any,
    index: number,
    handleFileDownload: any,
    view_fn: any
  ) => {
    const subTitle = docs[0];
    const fileObj = docs[1];
    // const fileName = fileObj.name;

    return (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography
          sx={{ fontWeight: 500, mb: 1, fontFamily: CommanStyle.frontFamily }}
        >
          {subTitle}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <CustomViewDocument
              Attachment={[fileObj]}
              // webUrl={props.webURL}
            />
          </Grid>

          <Grid item xs={12} sm={4} textAlign="right">
            <IconButton onClick={() => view_fn(fileObj.content)}>
              <VisibilityIcon color="primary" />
            </IconButton>

            <IconButton component="a" href={fileObj.content} download>
              <DownloadIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderFileRow = (
    doc: any,
    index: number,
    handleFileDownload: any,
    view_fn: any
  ) => {
    // const fileName = doc.name;

    return (
      <Box key={index} sx={{ mb: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <CustomViewDocument
              Attachment={[doc]}
              // webUrl={props.webURL}
            />
          </Grid>

          <Grid item xs={12} sm={4} textAlign="right">
            <IconButton onClick={() => view_fn(doc.content)}>
              <VisibilityIcon color="primary" />
            </IconButton>

            <IconButton component="a" href={doc.content} download>
              <DownloadIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <div style={{ padding: "2%" }}>
        <Card
          sx={{
            mb: 2,
            borderRadius: "6px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {data.length === 0 ? (
              <Typography
                sx={{
                  fontStyle: "italic",
                  color: "gray",
                  textAlign: "center",
                  pt: 3,
                }}
              >
                No documents available.
              </Typography>
            ) : (
              <>
                {data.map((item, index) => {
                  const isExpanded = IsExpanded === index;

                  if (item.data.length === 0) return null;

                  return (
                    <Box
                      key={index}
                      sx={{ border: "1px solid #eee", borderRadius: 2, mb: 2 }}
                    >
                      <Accordion
                        expanded={isExpanded}
                        onChange={() => handleExpand(index)}
                        disableGutters
                        elevation={0}
                        sx={{
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            background: "#fafafa",
                            borderBottom: "1px solid #eee",
                            position: "sticky",
                            top: 0,
                            zIndex: 5,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "16px", fontWeight: 600 }}
                          >
                            {item.Title} ({item.data.length})
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p: 2 }}>
                          {item.Title ===
                          DisplayFolderName.BackgroundVerification
                            ? item.data.map((docs: any, idx: number) =>
                                renderBackgroundVerificationRow(
                                  docs,
                                  idx,
                                  handleFileDownload,
                                  view_fn
                                )
                              )
                            : item.data.map((doc: any, idx: number) =>
                                renderFileRow(
                                  doc,
                                  idx,
                                  handleFileDownload,
                                  view_fn
                                )
                              )}
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>
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
