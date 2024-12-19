import * as React from "react";
import "../CustomPopup/PopupStyle.css";
import ReuseButton from "../ReuseButton";
import { Dialog, useMediaQuery, useTheme } from "@mui/material";

interface DynamicFormDialogProps {
    onClose: () => void;
    children?: JSX.Element;
    visible: boolean;
    header?: string | null;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
    headerContent?: JSX.Element;
    MessageContent?: JSX.Element;
    footerContent?: JSX.Element;
}

function CustomPopup(props: DynamicFormDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (


        <div className="ms-Grid-row" style={{ display: "flex", justifyContent: "center" }}>

            <Dialog
                fullScreen={fullScreen}
                open={props.visible}
                onClose={() => props.onClose()}
                PaperProps={{ style: { borderRadius: 20, overflow: "hidden", width: props.width } }}
                disableEscapeKeyDown
                aria-labelledby="responsive-dialog-title"
            // hideBackdrop={true}
            >
                <div
                    style={{
                        alignSelf: "end",
                        marginRight: "5%",
                        marginTop: "2%",
                        cursor: "pointer",
                    }}
                    onClick={() => props.onClose()}
                >
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
                <div style={{ width: "100%", marginBottom: "4%" }}>
                    {props.headerContent}
                    {props.MessageContent}
                    {props.footerContent}
                </div>
            </Dialog>

        </div>
    );
}

export default CustomPopup;


// import * as React from "react";
// import "../CustomPopup/PopupStyle.css";
// import ReuseButton from "../ReuseButton";

// interface DynamicFormDialogProps {
//     onClose: () => void;
//     children?: JSX.Element;
//     visible: boolean;
//     header?: string | null;
//     width?: string;
//     style?: React.CSSProperties;
// }

// function CustomPopup(props: DynamicFormDialogProps) {

//     return (
//         <div className="popup-overlay">
//             <div className="popup-container">
//                 <div className="popup-header">
//                     <div
//                         className="popup-close"
//                     // style={{
//                     //     display: "flex",
//                     //     justifyContent: "flex-end",
//                     //     marginLeft: "18px",
//                     //     bottom: "32px",
//                     // }}
//                     >
//                         {" "}
//                         <ReuseButton
//                             Style={{
//                                 height: "21px",
//                                 width: "2%",
//                                 minWidth: "auto",
//                                 paddingLeft: "10px",
//                                 paddingRight: "10px",
//                                 backgroundColor: "#EF3340",
//                             }}
//                             imgSrc={("../../assets/Viewicon.svg")}
//                             imgAlt=""
//                             onClick={props.onClose}
//                         >
//                             <style>
//                                 {`
//         .MuiButton-startIcon img {
//           padding-right: 5px; /* Add padding to the right of the image */
//         }
//       `}
//                             </style>
//                         </ReuseButton>
//                     </div>
//                     {props.header}
//                 </div>
//                 {props.children}
//             </div>
//         </div>
//     );
// }

// export default CustomPopup;

