import React from 'react';
import Dashboard from '../Screens/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import { RecruitmentTable } from '../Screens/RecruitmentTable/RecruitmentTable';
interface AppRoutesProps {
  props: any
  activeMenuId?: number;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ props, activeMenuId }) => (
  <Routes>
    <Route path="/Dashboard" element={<Dashboard {...props} />} />
    <Route path="/RecruitmentTable" element={<RecruitmentTable  />} />
    <Route path="/CandidateDetails" element={<div>Candidate Details</div>} />
    <Route path="/SelectedCandidates" element={<div>Selected Candidates</div>} />
     <Route path="/details" element={<div>Details Page</div>} />
  </Routes>
);

export default AppRoutes;
