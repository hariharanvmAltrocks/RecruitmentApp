import * as React from "react";
import SideNavComponent from "../SideNav/SideNavigation";

export default function MainPage() {
    return (
        <div className="ms-Grid" dir="ltr">
            <div style={{ width: "15%" }}>
                <SideNavComponent />
            </div>
        </div>
    );
}
