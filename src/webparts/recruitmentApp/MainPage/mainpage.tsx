import * as React from "react";
import SideNavComponent from "../SideNav/SideNavigation";
import MainPageHeader from "./mainPageHeader";
import { Route, Routes } from "react-router-dom";
import RecruitmentProcess from "../Screens/RecuritmentProcess/ApprovedVRRList";
import ApprovedVRRView from "../Screens/RecuritmentProcess/ApprovedVRRView";
import ApprovedVRREdit from "../Screens/RecuritmentProcess/ApprovedVRREdit";
import { userInfo } from "../utilities/RoleContext";
import CommanFieldTemplate from "../components/CommanFieldTemplate";
import CommanTemplate from "../components/CommanTemplate";

export default function MainPage(props: any) {
    console.log(props, "props");
    const { roleID, userName, userRole, masterData, ADGroupData } = userInfo();

    const [isExpanded, setIsExpanded] = React.useState(true);

    const toggleSideNav = () => {
        setIsExpanded((prevState: any) => !prevState);
    };

    return (
        <div className="main-menu-card">
            <div
                style={{ display: "flex", flexDirection: "row", }}
                className=" ms-Grid"
            // dir="ltr"
            >

                <div style={{ width: isExpanded ? "15%" : "6%", height: "auto" }}>
                    <SideNavComponent roleID={roleID} IsExpanded={isExpanded} />
                </div>

                <div style={{ width: isExpanded ? "80%" : "95%", display: "flex", flexDirection: "column" }}>
                    <MainPageHeader toggleSideNav={toggleSideNav} userName={userName} userRole={userRole}>
                        {ADGroupData?.ADGroupIDs ? (
                            <>
                                <Routes>
                                    <Route path="/RecurimentProcess" element={<RecruitmentProcess {...props} {...masterData} />} />
                                    <Route path="/RecurimentProcess/ApprovedVRRView" element={<ApprovedVRRView {...props} {...masterData} />} />
                                    <Route path="/RecurimentProcess/ApprovedVRREdit" element={<ApprovedVRREdit {...props} {...masterData} />} />
                                    <Route path="/CommanFieldTemplate" element={<CommanFieldTemplate {...props} {...masterData} />} />
                                    <Route path="/CommanTemplate/CommanTemplate" element={<CommanTemplate {...props} {...masterData} />} />

                                </Routes>
                            </>
                        ) : (
                            <>
                                <div style={{ minHeight: "100%", alignItems: "center", justifyContent: "center", display: "flex" }}>
                                    <h3 className="title" >
                                        {"You are not assigned to any AD Group for HRMS"}
                                    </h3>
                                </div>
                            </>
                        )}

                    </MainPageHeader>
                </div>
            </div>
        </div>

    );
}
