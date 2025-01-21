import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import CustomLabel from "./CustomLabel";
import { Link } from "@mui/material";

interface fieldItems {
    Attachment: IDocFiles[];
    Label: string;
}

function CustomViewDocument({
    Attachment,
    Label
}: fieldItems) {

    function handleFileDownload(documentUrl: string) {
        const link = document.createElement('a');
        link.href = `${documentUrl}?web=1`;  // Optional query string to force web view if needed
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);  // Append the link to the body
        link.click();  // Simulate a click to open the link in a new tab
        document.body.removeChild(link);  // Clean up after the click
    };

    return (
        <>
            {Attachment.length > 0
                ? Attachment?.map((file, index) => {
                    const fileName = file.name;
                    return (
                        <div key={index}>
                            <CustomLabel value={Label} />
                            <div className="ms-Grid-row">
                                <div
                                    className="ms-Grid-col ms-lg12"
                                    style={{
                                        marginRight: "1rem",
                                    }}
                                >
                                    <Link
                                        component="button"
                                        variant="body2"
                                        underline="hover"
                                        onClick={() =>
                                            handleFileDownload(file.content)
                                        }
                                    >
                                        {fileName}
                                    </Link>
                                </div>
                                <div
                                    className="ms-Grid-col ms-lg2"
                                    style={{
                                        marginTop: "8px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                </div>
                            </div>
                        </div>
                    );
                })
                : null
            }
        </>
    );
}

export default CustomViewDocument;
