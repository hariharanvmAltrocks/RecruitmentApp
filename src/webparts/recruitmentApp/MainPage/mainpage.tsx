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
// import ReviewProfile from "../Screens/RecuritmentProcess/ReviewProfile";
import ReviewProfile from "../Screens/ReviewProfile/ReviewProfile";
import AssignInterviewPanel from "../Screens/RecuritmentProcess/AssignInterviewPanel";
import InterviewPanelList from "../Screens/InterviewPanel/InterviewPanelList";
import InterviewPanelEdit from "../Screens/InterviewPanel/InterviewPanelEdit";
import Emptypage from "../Screens/EmptyPage/EmptyPage";
import HodScoreCard from "../Screens/RecuritmentProcess/HodScoreCard";
// import HodScoreCard from "../Screens/RecuritmentProcess/HodScoreCard";
export default function MainPage(props: any) {
  const { roleID, userRole, masterData, ADGroupData } = userInfo();

  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleSideNav = () => {
    setIsExpanded((prevState: any) => !prevState);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className=" ms-Grid">
      <div
        style={{ width: isExpanded ? "15%" : "6%" }}
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          setIsExpanded(false);
        }}
      >
        <SideNavComponent roleID={roleID} IsExpanded={isExpanded} />
      </div>
      <div
        style={{
          width: isExpanded ? "85%" : "95%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MainPageHeader
          toggleSideNav={toggleSideNav}
          userName={
            (masterData?.userDetails[0]?.FirstName ?? "") +
            " " +
            (masterData?.userDetails[0]?.MiddleName ?? "") +
            " " +
            (masterData?.userDetails[0]?.LastName ?? "")
          }
          userRole={userRole}
          Department={masterData?.userDetails[0]?.DepartmentName}
        >
          {ADGroupData?.ADGroupIDs ? (
            <>
              <Routes>
                <Route
                  path="/"
                  element={<Emptypage {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess"
                  element={<RecruitmentProcess {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/ApprovedVRRView"
                  element={<ApprovedVRRView {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/ApprovedVRREdit"
                  element={<ApprovedVRREdit {...props} {...masterData} />}
                />
                <Route
                  path="/CommanFieldTemplate"
                  element={<CommanFieldTemplate {...props} {...masterData} />}
                />
                <Route
                  path="/CommanTemplate/CommanTemplate"
                  element={<CommanTemplate {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/ReviewProfile"
                  element={<ReviewProfile {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/AssignInterviewPanel"
                  element={<AssignInterviewPanel {...props} {...masterData} />}
                />
                <Route
                  path="/InterviewPanelList"
                  element={
                    <InterviewPanelList
                      {...props}
                      {...masterData}
                      {...ADGroupData}
                    />
                  }
                />
                <Route
                  path="/InterviewPanelList/InterviewPanelEdit"
                  element={<InterviewPanelEdit {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/HodScoreCard"
                  element={<HodScoreCard {...props} {...masterData} />}
                />
              </Routes>
            </>
          ) : (
            <>
              <div
                style={{
                  minHeight: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <h3 className="title">
                  {"You are not assigned to any AD Group for HRMS"}
                </h3>
              </div>
            </>
          )}
        </MainPageHeader>
      </div>
    </div>
  );
}
