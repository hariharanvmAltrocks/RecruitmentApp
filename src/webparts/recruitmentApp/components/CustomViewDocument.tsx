import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { Link, Tooltip } from "@mui/material";

interface fieldItems {
  Attachment: IDocFiles[];
  Label?: string;
}

function CustomViewDocument({ Attachment, Label }: fieldItems) {
  function handleFileDownload(event: React.MouseEvent, documentUrl: string) {
    event.preventDefault();
    const fileExtension = documentUrl.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      const link = document.createElement("a");
      link.href = documentUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const viewUrl = documentUrl.includes("?")
        ? `${documentUrl}&web=1`
        : `${documentUrl}?web=1`;

      window.open(viewUrl, "_blank");
    }
  }

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
    </>
  );
}

export default CustomViewDocument;
