import * as React from "react";
import SideNavComponent from "../SideNav/SideNavigation";
import MainPageHeader from "./mainPageHeader";
import { Route, Routes } from "react-router-dom";
import RecruitmentProcess from "../Screens/RecuritmentProcess/ApprovedVRRList";
import ApprovedVRRView from "../Screens/RecuritmentProcess/ApprovedVRRView";

export default function MainPage(props: any) {
    console.log(props, "props");

    const [isExpanded, setIsExpanded] = React.useState(true);

    const toggleSideNav = () => {
        setIsExpanded((prevState: any) => !prevState);
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "row", height: "100%", }}
            className=" ms-Grid"
            dir="ltr"
        >

            <div style={{ width: isExpanded ? "18%" : "10%" }}>
                <SideNavComponent IsExpanded={isExpanded} />
            </div>

            <div style={{ width: isExpanded ? "80%" : "95%", display: "flex", flexDirection: "column" }}>
                <MainPageHeader toggleSideNav={toggleSideNav} isExpanded={isExpanded}>
                    <Routes>
                        <Route path="/RecurimentProcess" element={<RecruitmentProcess {...props} />} />
                        <Route path="/RecurimentProcess/ApprovedVRRView" element={<ApprovedVRRView {...props} />} />
                    </Routes>
                </MainPageHeader>
            </div>
        </div>
    );
}
