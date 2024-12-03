import * as React from "react";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react";
import "../App.css";

interface DynamicFormDialogProps {
    onClose: () => void;
    children?: React.ReactNode;
    visible: boolean;
    header: string | null;
    width?: string;
    Style?: React.CSSProperties;
}

function CustomPopup(props: DynamicFormDialogProps) {
    const footerContent = (
        <DialogFooter>
            <button onClick={props.onClose}>Close</button>
        </DialogFooter>
    );

    const DialogStyles: React.CSSProperties = {
        minWidth: props.width || "300px",
        overflowY: "hidden",
        zIndex: 9999,
        borderRadius: "20px",
        ...props.Style,
    };

    // const header = (
    //     <div className="ms-Grid-row">
    //         <div
    //             className="ms-Grid-col ms-lg12"
    //             style={{
    //                 display: "flex",
    //                 justifyContent: "flex-end",
    //                 marginLeft: "18px",
    //                 bottom: "32px",
    //             }}
    //         >
    //             {" "}
    //             <ReuseButton
    //                 Style={{
    //                     height: "21px",
    //                     width: "2%",
    //                     minWidth: "auto",
    //                     paddingLeft: "10px",
    //                     paddingRight: "10px",
    //                     backgroundColor: "#EF3340",
    //                 }}
    //                 imgSrc={("../assets/viewclose.svg")}
    //                 imgAlt="ssss"
    //                 onClick={props.onClose}
    //             >
    //                 <style>
    //                     {`
    //   .MuiButton-startIcon img {
    //     padding-right: 5px; /* Add padding to the right of the image */
    //   }
    // `}
    //                 </style>
    //             </ReuseButton>
    //         </div>
    //     </div>
    // )
    return (
        <div className="Model">
            <Dialog
                hidden={!props.visible}
                onDismiss={props.onClose}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: props.header || "",
                    styles: DialogStyles,
                }}
                modalProps={{
                    isBlocking: true,
                    styles: {
                        main: {
                            borderRadius: "20px",
                        },
                    },
                }}
            >
                {props.children}
                {footerContent}
            </Dialog>
        </div>
    );
}

export default CustomPopup;
