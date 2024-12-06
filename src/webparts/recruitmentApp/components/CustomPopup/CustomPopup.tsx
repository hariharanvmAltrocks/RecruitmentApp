import * as React from "react";
import "../CustomPopup/PopupStyle.css";
import ReuseButton from "../ReuseButton";

interface DynamicFormDialogProps {
    onClose: () => void;
    children?: JSX.Element;
    visible: boolean;
    header?: string | null;
    width?: string;
    style?: React.CSSProperties;
}

function CustomPopup(props: DynamicFormDialogProps) {

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <div
                        className="popup-close"
                    // style={{
                    //     display: "flex",
                    //     justifyContent: "flex-end",
                    //     marginLeft: "18px",
                    //     bottom: "32px",
                    // }}
                    >
                        {" "}
                        <ReuseButton
                            Style={{
                                height: "21px",
                                width: "2%",
                                minWidth: "auto",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                backgroundColor: "#EF3340",
                            }}
                            imgSrc={("../../assets/Viewicon.svg")}
                            imgAlt=""
                            onClick={props.onClose}
                        >
                            <style>
                                {`
        .MuiButton-startIcon img {
          padding-right: 5px; /* Add padding to the right of the image */
        }
      `}
                            </style>
                        </ReuseButton>
                    </div>
                    {props.header}
                </div>
                {props.children}
            </div>
        </div>
    );
}

export default CustomPopup;
