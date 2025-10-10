import * as React from "react";
import { Dialog } from "primereact/dialog";
import ReuseButton from "./ReuseButton";
import { ColorCode } from "../utilities/Config";

interface DynamicFormDialogProps {
  onClose: () => void;
  children?: React.ReactNode;
  visible: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  Style?: React.CSSProperties;
}

export default function CustomDialogbox(props: DynamicFormDialogProps) {
  React.useEffect(() => {}, [props]);

  const DialogStyles: React.CSSProperties = {
    minWidth: "36%",
    overflowY: "hidden",
    zIndex: 9999,
    backgroundColor: "white",
    borderRadius: "26px",
    padding: "20px",
    // height: "37vh",
    ...props.Style,
  };

  const headerContent = (
    <div
      //   className="ms-Grid-row"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "1.3rem",
        // padding: "18px 0 8px 0",
        color: "#FFFF !important",
        backgroundColor: ColorCode.ProfileColorCode.colorCode, //"#597B98",
        // borderBottom: "2px solid  #597B98",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
      }}
    >
      <div
        className="ms-Grid-col ms-lg11"
        style={{
          textAlign: "center",
          paddingLeft: "30px",
          color: "white",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "Roboto, sans-serif",
          fontStyle: "normal",
        }}
      >
        {props.header}
      </div>

      <div className="ms-Grid-col ms-lg1">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ReuseButton
            Style={{
              height: "24px",
              width: "24px",
              minWidth: "auto",
              backgroundColor: "transparent",
              border: "none",
            }}
            imgSrc={require("../assets/viewclose.svg")}
            imgAlt="close"
            onClick={() => props.onClose()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card flex justify-content-center HRMSModal">
      <Dialog
        header={headerContent}
        visible={props.visible}
        style={DialogStyles}
        onHide={() => props.onClose()}
        footer={props.footer}
        closable={false}
        draggable={false}
        resizable={false}
      >
        {props.children}
      </Dialog>
    </div>
  );
}
