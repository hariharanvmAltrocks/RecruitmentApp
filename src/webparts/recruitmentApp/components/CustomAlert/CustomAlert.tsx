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
    Notes?: string;
}
export default function CustomAlert(
    props: CustomAlert
) {
    React.useEffect(() => { }, [props]);


    const headerContent = (
        <div className="ms-Grid-row"
            style={{ marginLeft: "34%" }}
        >
            {props.Type === HRMSAlertOptions.Success ? (
                <div className="ms-Grid-col ms-lg12" style={{ marginLeft: "26%" }}>
                    <p className="headerStyle" >{props.Type}</p>

                </div>
            ) : props.Type === HRMSAlertOptions.Error ? (
                <div className="ms-Grid-col ms-lg12" style={{ marginLeft: "26%" }}>
                    <p className="headerStyle" >{props.Type}</p>

                </div>
            ) : props.Type === HRMSAlertOptions.Confirmation ? (
                <div className="ms-Grid-col ms-lg12">
                    <p className="headerStyle" >{props.Type}</p>


                </div>
            ) : props.Type === HRMSAlertOptions.Warning ? (
                <div className="ms-Grid-col ms-lg12" style={{ marginLeft: "26%" }}>
                    <p className="headerStyle" >{props.Type}</p>

                </div>
            ) : null}
        </div>
    );


    const SuccessPadding: React.CSSProperties = {
        padding: props.Type === HRMSAlertOptions.Success ? '' : '.1em 1em 0',
    };

    const MessageContent = (
        <>
            <div
                style={{ display: "flex", justifyContent: "center", marginTop: "3%" }}
            >
                <p className="alertextstyle" style={SuccessPadding}>{props.Message}</p>
            </div>

            <div>
                {props.Type === HRMSAlertOptions.Confirmation && (
                    <>
                        <div className="ms-Grid-row" style={{ padding: "1%", marginLeft: "5%" }}>

                            <div className="ms-Grid-col ms-lg10">
                                <span>
                                    <p className="NoteStyle" >Note :
                                        <span style={{ fontSize: "1em", fontWeight: "600", color: "black", padding: "2%" }}>{props.Notes}</span>
                                    </p>
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="ms-Grid-row"
                style={{ display: "flex", justifyContent: "center", marginTop: "3%", marginBottom: "3%", marginLeft: "4%" }}
            >



                {props.Type === HRMSAlertOptions.Confirmation ? (
                    <>
                        <div className="ms-Grid-col ms-lg3">
                            <ReuseButton
                                label="Yes"
                                onClick={() => props.ButtonAction && props.ButtonAction(true)}
                                spacing={4}
                                backgroundColor="rgb(13 171 13)"
                                Style={{ color: "white", fontSize: "1.5em", fontWeight: "600" }}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                            <ReuseButton
                                label="No"
                                onClick={() => props.ButtonAction && props.ButtonAction(false)}
                                spacing={4}
                                backgroundColor="rgb(205, 45, 45)"
                                Style={{ color: "white", fontSize: "1.5em", fontWeight: "600" }}
                            />
                        </div>
                    </>

                ) : (
                    <div className="ms-Grid-col ms-lg3">
                        <ReuseButton
                            label="OK"
                            onClick={() => props.ButtonAction && props.ButtonAction(true)}
                            spacing={4}
                            backgroundColor="rgb(13 171 13)"
                            Style={{ color: "white", fontSize: "1.5em", fontWeight: "600" }}
                        />
                    </div>
                )}
            </div>
        </>

    );



    return (
        <div className="ms-Grid-row" style={{ display: "flex", justifyContent: "center" }}>
            <CustomPopup
                visible={props.visible}
                onClose={props.onClose}
                width="31%"
                // MessageContent={MessageContent}
                header={headerContent}
                children={MessageContent}
            />
        </div>

    );
}
