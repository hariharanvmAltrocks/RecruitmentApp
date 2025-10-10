import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { Link, Tooltip } from "@mui/material";
import { Dialog } from "primereact/dialog";
import "../App.css";
import { labelNames } from "../utilities/LabelName";

interface fieldItems {
  Attachment: IDocFiles[];
  Label?: string;
  webUrl?: string;
}

function CustomViewDocument({ Attachment, Label, webUrl }: fieldItems) {
  const [documentPopup, setDocumentPopup] = React.useState<boolean>(false);
  const [documentcontent, setDocumentcontent] = React.useState<string>("");

  function handleFileDownload(event: React.MouseEvent, documentUrl: string) {
    event.preventDefault();
    // const fileExtension = documentUrl.split(".").pop()?.toLowerCase();
    // if (fileExtension === "pdf") {
    //   const link = document.createElement("a");
    //   link.href = documentUrl;
    //   link.download = "";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else {
    //   const viewUrl = documentUrl.includes("?")
    //     ? `${documentUrl}&web=1`
    //     : `${documentUrl}?web=1`;

    //   window.open(viewUrl, "_blank");
    // }
    setDocumentPopup(true);
    setDocumentcontent(documentUrl);
  }

  const getIframeSrc = (fileUrl: string): string => {
    if (fileUrl.endsWith(".pdf")) {
      return fileUrl;
    } else if (fileUrl.endsWith(".docx")) {
      //   const absoluteUrl = fileUrl.startsWith("http")
      // ? fileUrl
      // : `${webUrl.split("/sites")[0]}${fileUrl}`;

      // Build the WOPI Frame URL (keep using relative `fileUrl` in `sourcedoc`)
      const viewerUrl = `${webUrl}/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(
        fileUrl
      )}&action=embedview`;
      // console.log(viewerUrl, "viewerUrl");

      return viewerUrl;
    } else {
      return "";
    }
  };

  return (
    <>
      {Attachment?.length > 0
        ? Attachment?.map((file, index) => {
            const fileName = file.name;
            const truncatedFileName =
              fileName.length > 30
                ? fileName.substring(0, 30) + "..."
                : fileName;

            return (
              <div key={index}>
                <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg12"
                    style={{ marginRight: "1rem" }}
                  >
                    <Tooltip title={fileName} arrow>
                      <Link
                        href="#"
                        onClick={(e) => handleFileDownload(e, file.content)}
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          display: "inline-block",
                          maxWidth: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {truncatedFileName}
                      </Link>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })
        : null}
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
            // header={
            //   <>
            //     <div className="ms-Grid-row">
            //       <div className="ms-Grid-col ms-lg6">
            //         <span
            //           style={{
            //             fontWeight: "bold",
            //             fontSize: "20px",
            //             fontFamily: "Roboto,sans-serif!important",
            //           }}
            //         >
            //         </span>
            //       </div>
            //       <div
            //         className="ms-Grid-col ms-lg6"
            //         style={{ textAlign: "right" }}
            //       >
            //         <ReuseButton
            //           Style={{
            //             height: "24px",
            //             width: "24px",
            //             minWidth: "auto",
            //             backgroundColor: "#597b98",
            //             border: "none",
            //           }}
            //           imgSrc={require("../assets/viewclose.svg")}
            //           imgAlt="close"
            //           onClick={() => setDocumentPopup(false)}
            //         />
            //       </div>
            //     </div>
            //   </>
            // }
            // footer={
            //   <div
            //     className="ms-Grid-row"
            //     style={{
            //       display: "flex",
            //       justifyContent: "center",
            //       padding: "10px 0",
            //       gap: "33px",
            //     }}
            //   >
            //     <ReuseButton
            //       label="Close"
            //       onClick={() => setDocumentPopup(false)}
            //       Style={{
            //         backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
            //         color: "white",
            //         width: "50%",
            //       }}
            //     />
            //   </div>
            // }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default CustomViewDocument;
