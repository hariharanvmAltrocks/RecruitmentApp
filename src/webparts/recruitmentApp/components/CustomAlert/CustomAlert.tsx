import * as React from "react";
import "./CustomAlert.modules.css";
import { HRMSAlertOptions } from "../../utilities/Config";
import ReuseButton from "../ReuseButton";
import AlertDialogbox from "./AlertDialogbox";
import { ValidationAction } from "../../utilities/LabelName";

export type CustomAlert = {
  ButtonAction: (confirmed: boolean) => void;
  Message: string;
  Type: string;
  onClose: () => void;
  visible: boolean;
  ButtonLebel?: string;
  IsCloseIcon?: boolean;
};
export default function CustomAlert(props: CustomAlert) {
  React.useEffect(() => {}, [props]);
  const SuccessPadding: React.CSSProperties = {
    padding: props.Type === HRMSAlertOptions.Success ? "" : ".1em 1em 0",
  };
  const footerContent = (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "5%" }}
      >
        <p
          className="alertextstyle"
          style={SuccessPadding}
          dangerouslySetInnerHTML={{
            __html: props.Message,
          }}
        />
      </div>

      <div
        className="ms-Grid-row"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "6%",
          marginBottom: "2%",
          marginLeft: "4%",
        }}
      >
        <div className="ms-Grid-col ms-lg3">
          <ReuseButton
            label={
              props.ButtonLebel ? ValidationAction.Yes : ValidationAction.Ok
            }
            onClick={() => props.ButtonAction && props.ButtonAction(true)}
            spacing={4}
            Style={{
              border: "0",
              borderRadius: ".25em",
              background: " #7066e0",
              color: "white",
              fontSize: "1em",
              display: "inline-block",
            }}
          />
        </div>

        {props.Type === HRMSAlertOptions.Confirmation && (
          <div className="ms-Grid-col ms-lg3">
            <ReuseButton
              label={
                props.ButtonLebel
                  ? ValidationAction.No
                  : ValidationAction.Cancel
              }
              onClick={() => props.ButtonAction && props.ButtonAction(false)}
              spacing={4}
              Style={{
                border: "0",
                borderRadius: ".25em",
                background: "#dc3741",
                color: "#fff",
                fontSize: "1em",
                display: "inline-block",
              }}
            />
          </div>
        )}
      </div>
    </>
  );

  const headerContent = (
    <div
      className="ms-Grid-row"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        className="ms-Grid-col ms-lg10"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {props.Type === HRMSAlertOptions.Success ? (
          <div className="ms-Grid-col ms-lg4">
            <div className="sa">
              <div className="sa-success">
                <div className="sa-success-tip"></div>
                <div className="sa-success-long"></div>
                <div className="sa-success-placeholder"></div>
                <div className="sa-success-fix"></div>
              </div>
            </div>
          </div>
        ) : props.Type === HRMSAlertOptions.Error ? (
          <div className="ms-Grid-col ms-lg4">
            <div className="sa">
              <div className="sa-error">
                <div className="sa-error-x">
                  <div className="sa-error-left"></div>
                  <div className="sa-error-right"></div>
                </div>
                <div className="sa-error-placeholder"></div>
                <div className="sa-error-fix"></div>
              </div>
            </div>
          </div>
        ) : props.Type === HRMSAlertOptions.Confirmation ? (
          <div className="ms-Grid-col ms-lg4">
            <div className="sa">
              <div className="sa-question">
                <div className="sa-question-mark"></div>
              </div>
            </div>
          </div>
        ) : props.Type === HRMSAlertOptions.Warning ? (
          <div className="ms-Grid-col ms-lg4">
            <div className="sa">
              <div className="sa-warning">
                <div className="sa-warning-body"></div>
                <div className="sa-warning-dot"></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {props.IsCloseIcon ? (
        <div className="ms-Grid-col ms-lg1" style={{ marginTop: "6%" }}>
          <div>
            <ReuseButton
              Style={{
                height: "24px",
                width: "24px",
                minWidth: "auto",
                backgroundColor: "#597b98",
                border: "none",
              }}
              imgSrc={require("../../assets/viewclose.svg")}
              imgAlt="close"
              onClick={() => props.onClose()}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <div
      className="ms-Grid-row"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <AlertDialogbox
        Style={{ padding: "7px", minHeight: "10%", maxWidth: "28%" }}
        header={headerContent}
        visible={props.visible}
        children={footerContent}
        onClose={props.onClose}
      />
    </div>
  );
}
