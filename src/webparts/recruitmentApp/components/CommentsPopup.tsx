
import * as React from "react";
import ReuseButton from "./ReuseButton";
import LabelHeaderComponents from "./TitleHeader";
import * as moment from "moment";
import CustomPopup from "./CustomPopup/CustomPopup";

type IProps = {
    CommentsDetail?: [];
    onClose: () => void;
    visible: boolean;
}

function CommentsPopup({
    onClose,
    CommentsDetail,
    visible
}: IProps) {
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
                <CustomPopup
                    visible={visible}
                    onClose={onClose}
                    width="31%"
                    // MessageContent={MessageContent}
                    header={
                        <>
                            <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                <LabelHeaderComponents value="Justifications" />
                            </div>
                            <div className="ms-Grid-row">
                                <div
                                    className="ms-Grid-col ms-lg12"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        marginLeft: "1rem",
                                        // bottom: bottomValue,
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
                                        imgAlt="Close"
                                        onClick={onClose}
                                    >
                                        <style>
                                            {`.MuiButton-startIcon img {padding-right: 5px; /* Add padding to the right of the image */}`}
                                        </style>
                                    </ReuseButton>
                                </div>
                            </div>
                        </>
                    }
                    children={
                        <>
                            <div
                                className="ms-Grid-row"
                                style={{ flexGrow: 1, overflowY: "auto" }}
                            >
                                <div
                                    className="ms-Grid-col ms-lg12"
                                    style={{ padding: "30px", fontSize: "18px", paddingTop: "2px" }}
                                >
                                    {(CommentsDetail && CommentsDetail.length > 0) ? (
                                        CommentsDetail.map((comment: any, index: number) => (
                                            <div key={index} style={{ marginBottom: "20px" }}>
                                                {comment.RoleName && <p><b>Submitted by :</b> {comment.RoleName}</p>}
                                                <p><b> Name: </b>{comment.Name || comment.CreatedBy}</p>
                                                <p><b>Date:</b> {comment.Date ? moment(comment.Date).format("DD-MMM-YYYY - hh:mm A") : "N/A"}</p>
                                                {comment.Status && <p><b>Stage:</b> {comment.Status}</p>}
                                                <p><b>Justifications:</b> {comment.comments || comment.Comments}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ display: "flex", justifyContent: "center", fontSize: "22px", fontFamily: "auto" }}>
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
                                    marginBottom: "12px",
                                    //   marginRight: OkButton,
                                }}
                            >
                                <div className="ms-Grid-col ms-lg2">
                                    <ReuseButton
                                        spacing={4}
                                        onClick={onClose}
                                        width="100%"
                                        label="OK"
                                    />
                                </div>
                            </div>
                        </>
                    }
                />
            </div>
        </>
    );
}

export default CommentsPopup;
