import * as React from "react";
import SideNavComponent from "../SideNav/SideNavigation";
import MainPageHeader from "./mainPageHeader";
import { Route, Routes } from "react-router-dom";
import RecruitmentProcess from "../Screens/RecuritmentProcess/RecruitmentProcess";

export default function MainPage() {
    return (
        <div
            style={{ display: "flex", flexDirection: "row", height: "100vh", }}
            className=" ms-Grid"
            dir="ltr"
        >
            <div style={{ width: "18%" }}>
                <SideNavComponent />
            </div>
            <div style={{ width: "80%", display: "flex", flexDirection: "column" }}>
                <MainPageHeader>
                    <Routes>
                        <Route path="/RecurimentProcess" element={<RecruitmentProcess />} />
                    </Routes>
                </MainPageHeader>
            </div>
        </div>
    );
}
