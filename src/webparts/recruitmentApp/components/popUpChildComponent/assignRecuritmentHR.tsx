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

function assignRecuritmentHR(props: DynamicFormDialogProps) {
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

export default assignRecuritmentHR;
