import React from 'react';
import Dashboard from '../Screens/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
import { RecruitmentTable } from '../Screens/RecruitmentTable/RecruitmentTable';
import QuestionCreation from '../Screens/QuestionCreation/Questioncreation';
import { CandidateTable } from '../Screens/CandidateTable/CandidateTable';
import Evalution from '../Screens/Evalution/Evalution';
interface AppRoutesProps {
  props: any
  activeMenuId?: number;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ props, activeMenuId }) => (
  <Routes>
    <Route path="/Dashboard" element={<Dashboard {...props} />} />
    <Route path="/RecruitmentTable" element={<RecruitmentTable  />} />
    <Route path="/QuestionCreation" element={<QuestionCreation {...props} />}/>
    <Route path="/CandidateTable" element={<CandidateTable />}/>
    <Route path="/Evalution" element={<Evalution />} />
  </Routes>
);

export default AppRoutes;
