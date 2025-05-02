import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { Tooltip } from "@mui/material";
import { Icon } from "office-ui-fabric-react";

interface fieldItems {
  Attachment: IDocFiles[];
  StateValue: string;
  handleDelete: (index: number, FileState: string) => void;
}

function CustomViewAttachment({
  Attachment,
  handleDelete,
  StateValue,
}: fieldItems) {
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
                      <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <a
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
                        </a>
                        {/* <Link
                          href={file.content}
                          target="_blank"
                          style={{
                            color: "blue",
                            fontWeight: "bold",
                            display: "inline-block",
                            maxWidth: "75%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {truncatedFileName}
                        </Link> */}
                        <Icon
                          iconName="Delete"
                          style={{
                            marginLeft: "8px",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDelete(index, StateValue)}
                        />
                      </span>
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

export default CustomViewAttachment;
