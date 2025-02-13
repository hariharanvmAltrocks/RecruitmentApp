import * as React from "react";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { Link } from "@mui/material";

interface fieldItems {
    Attachment: IDocFiles[];
    Label?: string;
}

function CustomViewDocument({
    Attachment,
    Label
}: fieldItems) {

    function handleFileDownload(documentUrl: string) {
        const link = document.createElement('a');
        link.href = `${documentUrl}?web=1`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            {Attachment.length > 0
                ? Attachment?.map((file, index) => {
                    const fileName = file.name;
                    return (
                        <div key={index}>
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
                                        style={{ color: "blue", fontWeight: "bold" }}
                                    >
                                        {fileName}
                                    </Link>
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
