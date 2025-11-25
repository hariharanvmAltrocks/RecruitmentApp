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
import AssignInterviewPanel from "../Screens/RecuritmentProcess/AssignInterviewPanel";
import InterviewPanelList from "../Screens/InterviewPanel/InterviewPanelList";
import InterviewPanelEdit from "../Screens/InterviewPanel/InterviewPanelEdit";
// import Emptypage from "../Screens/EmptyPage/EmptyPage";
import CandidateList from "../Screens/RecuritmentProcess/CandidateList";
import ReviewProfileList from "../Screens/ReviewProfile/ReviewProfileList";
import ReviewCandidateList from "../Screens/ReviewProfile/ReviewCandidateList";
import ViewCandidateDetails from "../Screens/ReviewProfile/ViewCandidateDetails";
import HodViewScorecard from "../Screens/RecuritmentProcess/HodViewScorecard";
import InterviewQuesEdit from "../Screens/ReviewProfile/InterviewQuesEdit";
import ReviewProfileEdit from "../Screens/ReviewProfile/ReviewProfileEdit";
import UploadCandidateCV from "../Screens/UploadCandidateCV/UploadCandidateCV";
import UploadCandidateList from "../Screens/UploadCandidateCV/UploadCandidateList";
import UploadOfferDocumentList from "../Screens/OfferMedicalProcess/UploadOfferDocumentList";
import UploadCandidateDocument from "../Screens/OfferMedicalProcess/UploadCandidateDocument";
import { ApiUrl } from "../components/TabMerge";
import AdminPanelDashboard from "../Screens/AdminPanel/AdminPanelDashboard";
import AdminPanelPage from "../Screens/AdminPanel/NewAdminPanelPage";

export default function MainPage(props: any) {
  const { roleID, userRole, masterData, ADGroupData } = userInfo();

  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleSideNav = () => {
    setIsExpanded((prevState: any) => !prevState);
  };
  console.log("Recruitment-App(18-Nov-2025) V-1.2.1 SIT");
  // let ApiUrls = ApiUrl(props.webURL);
  // console.log("ApiUrl", ApiUrls);
  React.useEffect(() => {
    const fetchApiUrl = async () => {
      const ApiUrls = await ApiUrl();
      let ApiURL = localStorage.getItem("ApiUrl");
      if (ApiURL) {
        localStorage.removeItem("ApiUrl");
        localStorage.setItem("ApiUrl", ApiUrls);
      } else {
        localStorage.setItem("ApiUrl", ApiUrls);
      }
    };
    void fetchApiUrl();
  }, []);

  return (
    <div className="mainPage">
      <div
        style={{ width: isExpanded ? "15%" : "6%" }}
        // onMouseEnter={() => { setIsExpanded(true) }}
        // onMouseLeave={() => { setIsExpanded(false) }}
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
        <div style={{ position: "fixed", width: "84%" }}>
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
          />
        </div>
        <div style={{ marginTop: "7%" }}>
          {ADGroupData?.ADGroupIDs ? (
            <>
              <Routes>
                {/* <Route
                        path="/"
                        element={<Emptypage {...props} {...masterData} />}
                      /> */}
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
                  path="/RecurimentProcess/ReviewCandidateList"
                  element={<ReviewCandidateList {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/ReviewCandidateList/ViewCandidateDetails"
                  element={<ViewCandidateDetails {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList"
                  element={<ReviewProfileList {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/ReviewCandidateList"
                  element={<ReviewCandidateList {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/ReviewCandidateList/ViewCandidateDetails"
                  element={<ViewCandidateDetails {...props} {...masterData} />}
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
                  path="/RecurimentProcess/InterviewPanelList/InterviewPanelEdit"
                  element={<InterviewPanelEdit {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/InterviewPanelList/InterviewPanelEdit"
                  element={<InterviewPanelEdit {...props} {...masterData} />}
                />

                <Route
                  path="/RecurimentProcess/HodScoreCard/CandidateList"
                  element={
                    <CandidateList
                      {...props}
                      {...masterData}
                      {...ADGroupData}
                    />
                  }
                />
                <Route
                  path="/RecurimentProcess/HodViewScorecard"
                  element={<HodViewScorecard {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/HodViewScorecard"
                  element={<HodViewScorecard {...props} {...masterData} />}
                />
                <Route
                  path="/InterviewPanelList/HodViewScorecard"
                  element={<HodViewScorecard {...props} {...masterData} />}
                />
                {/* sneka */}
                <Route
                  path="/RecurimentProcess/InterviewQuesEdit"
                  element={<InterviewQuesEdit {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/InterviewQuesEdit"
                  element={<InterviewQuesEdit {...props} {...masterData} />}
                />
                <Route
                  path="/ReviewProfileList/ReviewProfileEdit"
                  element={<ReviewProfileEdit {...props} {...masterData} />}
                />

                {/* Upload CV */}
                <Route
                  path="/RecurimentProcess/UploadCandidateList/UploadCandidateCV"
                  element={<UploadCandidateCV {...props} {...masterData} />}
                />
                <Route
                  path="/RecurimentProcess/UploadCandidateList"
                  element={<UploadCandidateList {...props} {...masterData} />}
                />

                {/* Offer Letter */}
                <Route
                  path="/UploadOfferDocumentList"
                  element={
                    <UploadOfferDocumentList {...props} {...masterData} />
                  }
                />
                <Route
                  path="/UploadOfferDocumentList/UploadDocument"
                  element={
                    <UploadCandidateDocument {...props} {...masterData} />
                  }
                />
                <Route
                  path="/AdminPanelDashboard"
                  element={<AdminPanelDashboard {...props} {...masterData} />}
                />
                <Route
                  path="/AdminPanelDashboard/AdminPanelPage"
                  element={<AdminPanelPage {...props} {...masterData} />}
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
        </div>
      </div>
    </div>
  );
}
