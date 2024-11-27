import * as React from "react";
import { Dialog } from "primereact/dialog";
import "../Common/ModalStyle.css";
import { HRMSAlertOptions } from "../../utilities/Config";
import ReuseButton from "../ReuseButton";

interface CustomAlert {
    ButtonAction: Function;
    Message: string;
    Type: string;
    onClose: Function;
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
            style={{ display: "flex", justifyContent: "center", marginTop: "4%" }}
        >
            {props.Type === HRMSAlertOptions.Success ? (
                <div className="ms-Grid-col ms-lg4">
                    {/* <img
                        src={Success}
                        className="flip-animation"
                        alt="Success"
                        style={{
                            width: '100%',
                            height: '100%',
                        }} 
                    /> */}
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
                    {/* <img
                        src={Error}
                        className="flip-animation"
                        alt="Error"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    /> */}
                </div>
            ) : props.Type === HRMSAlertOptions.Confirmation ? (
                <div className="ms-Grid-col ms-lg4">
                    {/* <img
                        src={Confirmation}
                        className="flip-animation"
                        alt="Confirmation"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    /> */}
                    <div className="sa">
                        <div className="sa-question">
                            {/* <div className="sa-question-body"></div> */}
                            <div className="sa-question-mark"></div>
                            {/* <div className="sa-question-dot"></div> */}
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
                    {/* <img
                        src={Warning}
                        className="flip-animation"
                        alt="Warning"
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    /> */}
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

    const DialogStyles: React.CSSProperties = {
        width: "90vw",
        maxWidth: "500px",
        // padding: "20px",
        overflow: "hidden",
        zIndex: 9999,
        borderRadius: "20px",
    };


    return (
        < div className="card flex justify-content-center HRMSModal" >
            <Dialog
                header={headerContent}
                visible={props.visible}
                style={DialogStyles}
                onHide={() => props.onClose()}
                footer={footerContent}
                closable={false} // Set closable to false to hide the close button
            >
                {MessageContent}
            </Dialog>
        </div >

    );
}
