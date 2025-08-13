import * as React from "react";
import * as moment from "moment";
import ReuseButton from "./ReuseButton";
import { labelName } from "../utilities/Config";

interface viewProps {
  onClose: () => void;
  Comments: any;
}

function CustomJsonComments({ onClose, Comments }: viewProps) {
  return (
    <>
      <div
        className="ms-Grid"
        style={{
          maxHeight: "18rem",
          minHeight: "8rem",
          maxWidth: "91%",
          minWidth: "20%",
          marginRight: "20px",
          marginLeft: "20px",
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="ms-Grid-row" style={{ flexGrow: 1, overflowY: "auto" }}>
          <div
            className="ms-Grid-col ms-lg12"
            style={{ padding: "30px", fontSize: "18px", paddingTop: "2px" }}
          >
            {Comments && Comments.length > 0 ? (
              Comments.map((comment: any, index: number) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {comment.RoleName && (
                    <p>
                      <b>Submitted by :</b> {comment.RoleName}
                    </p>
                  )}
                  <p>
                    <b>Date:</b>{" "}
                    {comment.createdDate
                      ? moment(comment.createdDate).format(
                          "DD-MMM-YYYY - hh:mm A"
                        )
                      : "N/A"}
                  </p>
                  {/* {comment.Status && <p><b>Stage:</b> {comment.Status?.StatusDescription}</p>} */}
                  <p>
                    <b>{labelName.Comment}:</b> {comment.comments}
                  </p>
                </div>
              ))
            ) : (
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontFamily: "auto",
                }}
              >
                No Records Found
              </p>
            )}
          </div>
        </div>
        <div
          className="ms-Grid-row"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="ms-Grid-col ms-lg2">
            <ReuseButton
              spacing={4}
              onClick={onClose}
              width="100%"
              label="Close"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomJsonComments;
