// import * as React from "react";
// import { IDocFiles } from "../Services/SPService/ISPServicesProps";
// import { Link } from "@mui/material";

// interface fieldItems {
//     Attachment: IDocFiles[];
//     Label?: string;
// }

// function CustomViewDocument({
//     Attachment,
//     Label
// }: fieldItems) {

//     function handleFileDownload(documentUrl: string) {
//         const link = document.createElement('a');
//         link.href = `${documentUrl}?web=1`;
//         link.target = '_blank';
//         link.rel = 'noopener noreferrer';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }

//     return (
//         <>
//             {Attachment.length > 0
//                 ? Attachment?.map((file, index) => {
//                     const fileName = file.name;
//                     return (
//                         <div key={index}>
//                             <div className="ms-Grid-row">
//                                 <div
//                                     className="ms-Grid-col ms-lg12"
//                                     style={{
//                                         marginRight: "1rem",
//                                     }}
//                                 >
//                                     <Link
//                                         component="button"
//                                         variant="body2"
//                                         underline="hover"
//                                         onClick={() =>
//                                             handleFileDownload(file.content)
//                                         }
//                                         style={{ color: "blue", fontWeight: "bold" }}
//                                     >
//                                         {fileName}
//                                     </Link>
//                                 </div>

//                             </div>
//                         </div>
//                     );
//                 })
//                 : null
//             }
//         </>
//     );
// }

// export default CustomViewDocument;
import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { Link, Tooltip } from "@mui/material";

interface fieldItems {
  Attachment: IDocFiles[];
  Label?: string;
}

function CustomViewDocument({ Attachment, Label }: fieldItems) {
  function handleFileDownload(documentUrl: string) {
    const link = document.createElement("a");
    link.href = `${documentUrl}?web=1`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.open(documentUrl, "_blank");
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
                        href={`${file.content}?web=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleFileDownload(file.content)}
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
