import * as React from "react";
import "./CustomAlert.modules.css";
import { HRMSAlertOptions } from "../../utilities/Config";
import ReuseButton from "../ReuseButton";
import CustomPopup from "../CustomPopup/CustomPopup";

export type CustomAlert = {
    ButtonAction: (confirmed: boolean) => void;
    Message: string;
    Type: string;
    onClose: () => void;
    visible: boolean;
}
export default function CustomAlert(
    props: CustomAlert
) {
    React.useEffect(() => { }, [props]);
    const footerContent = (

        <div className="ms-Grid-row"
            style={{ display: "flex", justifyContent: "center", marginTop: "3%", marginBottom: "3%", marginLeft: "4%" }}
        >
            <div className="ms-Grid-col ms-lg3">
                <ReuseButton
                    label="OK"
                    onClick={() => props.ButtonAction && props.ButtonAction(true)}
                    spacing={4}
                    Style={{ border: "0", borderRadius: ".25em", background: " #7066e0", color: "white", fontSize: "1em", display: "inline-block" }}
                />
            </div>


            {props.Type === HRMSAlertOptions.Confirmation && (
                <div className="ms-Grid-col ms-lg3">
                    <ReuseButton
                        label="Cancel"
                        onClick={() => props.ButtonAction && props.ButtonAction(false)}
                        spacing={4}
                        Style={{ border: "0", borderRadius: ".25em", background: "#dc3741", color: "#fff", fontSize: "1em", display: "inline-block" }}
                    />
                </div>

            )}
        </div>
    );

    const headerContent = (
        <div className="ms-Grid-row"
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
    );


    const SuccessPadding: React.CSSProperties = {
        padding: props.Type === HRMSAlertOptions.Success ? '' : '.1em 1em 0',
    };

    const MessageContent = (
        <div
            style={{ display: "flex", justifyContent: "center", }}
        >
            <p className="alertextstyle" style={SuccessPadding}>{props.Message}</p>
        </div>
    );



    return (
        <div className="ms-Grid-row" style={{ display: "flex", justifyContent: "center" }}>
            <CustomPopup
                visible={props.visible}
                onClose={props.onClose}
                width="41%"
                height="35%"
                MessageContent={MessageContent}
                headerContent={headerContent}
                footerContent={footerContent}
            />
        </div>

    );
}
