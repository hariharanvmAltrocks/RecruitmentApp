import React from "react";
import Dashboard from "../Screens/Dashboard/Dashboard";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { RecruitmentTable } from "../Screens/RecruitmentTable/RecruitmentTable";
import QuestionCreation from "../Screens/QuestionCreation/Questioncreation";
import { CandidateTable } from "../Screens/CandidateTable/CandidateTable";
import { Evalution } from "../Screens/Evalution/Evalution";
import RecruitmentProcess from "../Screens/SelectionProcess/RecruitmentProcess";
import ReviewScoreCard from "../Screens/ReviewScoreCard/ReviewScoreCard";
import { OfferTable } from "../Screens/OfferRelease/OfferTable";
import EvalutionL2 from "../Screens/Evalution/EvalutionL2/EvalutionL2";
import AdminPanel from "../Screens/AdminPanel/adminpanel";
interface AppRoutesProps {
  props: any;
  activeMenuId?: number;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ props, activeMenuId }) => (
  console.log("Rendering AppRoutes with activeMenuId:", activeMenuId),
  console.log("Props passed to AppRoutes:", props),
  (
    <Routes>
      <Route path="/Dashboard" element={<Dashboard {...props} />} />
      <Route path="/RecruitmentTable" element={<RecruitmentTable />} />
      <Route
        path="/QuestionCreation"
        element={<QuestionCreation {...props} />}
      />
      <Route path="/CandidateTable" element={<CandidateTable {...props} />} />
      <Route path="/Evalution" element={<Evalution {...props} />} />
      <Route path="/ReviewScoreCard" element={<ReviewScoreCard {...props} />} />
      <Route
        path="/RecurimentProcess"
        element={<RecruitmentProcess {...props} />}
      />
      <Route path="/OfferTable" element={<OfferTable {...props} />} />
      <Route path="/EvalutionL2" element={<EvalutionL2 {...props} />} />

      <Route path="/AdminPanelDashboard" element={<AdminPanel {...props} />} />
    </Routes>
  )
);

export default AppRoutes;
