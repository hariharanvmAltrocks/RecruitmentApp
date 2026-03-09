import React from 'react';
import Dashboard from '../Screens/Dashboard/Dashboard';
import { Route, Routes } from 'react-router-dom';
interface AppRoutesProps {
  props: any
}

const AppRoutes: React.FC<AppRoutesProps> = ({ props }) => (
  <Routes>
    <Route path="/Dashboard" element={<Dashboard {...props} />} />
  </Routes>
);

export default AppRoutes;
