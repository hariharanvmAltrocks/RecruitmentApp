import * as React from "react";
import { userInfo } from "../utilities/RoleContext";
import "../App.css";


interface MainPageHeaderProps {
    children?: React.ReactNode;
}

const MainPageHeader: React.FC<MainPageHeaderProps> = ({ children }) => {
    // const [isExpandedNav, setIsExpandedNav] = React.useState<boolean>(false);
    const { userName, userRole } = userInfo();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                padding: "10px",
                height: "100%",
            }}>
            <div
                style={{
                    display: "flex",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <h1 style={{ color: "#ef3340", fontFamily: "Roboto, sans-serif", fontSize: "22px", fontWeight: "600" }}>Recuritment Process</h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: "white",
                        // borderRadius: "20px",
                        padding: "5px",
                        height: "30px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        // boxShadow: "0px 5px 10px 0px #0F4B8426",
                    }}>
                    <div
                    >
                        <h3 style={{ color: "#ef3340", fontFamily: "Roboto, sans-serif", fontSize: "18px", fontWeight: "600" }}>
                            Welcome {userName}
                        </h3>
                        <p
                            style={{
                                //display: "flex",
                                //alignItems: "center",
                                // margin: "5px",
                                color: "black",  //#e65f2b
                                fontWeight: "400",
                                fontSize: "13px",
                                marginTop: " -18px",
                                marginLeft: "5px"
                            }}
                        >
                            ({userRole} - )
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>{children}</div>
        </div>
        // <div >
        //     {/* <div
        //         className="ms-Grid-row">
        //         <div className="ms-Grid-col ms-lg6"
        //             style={{ flex: 1 }}>
        //             <Stack horizontal tokens={{ childrenGap: 15 }} style={{ alignItems: "center" }}>
        //                 <svg
        //                     xmlns="http://www.w3.org/2000/svg"
        //                     width="31"
        //                     height="31"
        //                     viewBox="0 0 31 31"
        //                     fill="none"
        //                     onClick={() => setIsExpandedNav(!isExpandedNav)}
        //                     style={{ cursor: "pointer" }}
        //                 >
        //                     <path
        //                         d="M2.45312 7.90625H24.7344..."
        //                         fill="#EF3340"
        //                     />
        //                 </svg>
        //                 <h6 style={{ color: "#ef3340", fontFamily: "Roboto, sans-serif", fontSize: "22px", fontWeight: "600" }}>
        //                     Recuritment Process
        //                 </h6>
        //             </Stack>
        //             <div className="ms-Grid-col ms-lg6">
        //                 <div style={{ flex: 1, textAlign: "right" }}>
        //                     <h3 style={{ color: "#ef3340", fontFamily: "Roboto, sans-serif", fontSize: "22px", fontWeight: "600" }}>
        //                         Welcome {userName}
        //                     </h3>
        //                     <h6 style={{ color: "#999" }}>({userRole})</h6>
        //                 </div>
        //             </div>
        //         </div>

        //     </div> */}
        //     {isExpandedNav && (
        //         <div style={{ position: "absolute", top: "70px", right: "15px", backgroundColor: "#fff", padding: "10px", border: "1px solid #ef3340" }}>
        //             <p>Karthikeyan</p>
        //         </div>
        //     )}
        // </div>
    );
};

export default MainPageHeader;
