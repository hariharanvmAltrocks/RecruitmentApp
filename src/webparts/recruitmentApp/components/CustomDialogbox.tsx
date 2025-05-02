import * as React from "react";
import { Dialog } from "primereact/dialog";

interface DynamicFormDialogProps {
  onClose: () => void;
  children?: React.ReactNode;
  visible: boolean;
  header: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  Style?: React.CSSProperties;
}

export default function CustomDialogbox(props: DynamicFormDialogProps) {
  React.useEffect(() => {}, [props]);

  const DialogStyles: React.CSSProperties = {
    minWidth: "10%",
    overflowY: "hidden",
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: "26px",
    padding: "20px",
    height: "37vh",
    ...props.Style,
  };

  return (
    <div className="card flex justify-content-center HRMSModal">
      <Dialog
        header={props.header}
        visible={props.visible}
        style={DialogStyles}
        onHide={() => props.onClose()}
        footer={props.footer}
        closable={false}
      >
        {props.children}
      </Dialog>
    </div>
  );
}
