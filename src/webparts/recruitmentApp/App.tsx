import * as React from "react";
import MainPage from "./MainPage/mainpage";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import { RoleProvider } from "./utilities/RoleContext";
import "./App.css";

function App() {
    return (
        <RoleProvider>
            <HashRouter>
                <div className="app">
                    <SubMain />
                </div>
            </HashRouter>
        </RoleProvider>

    );
}

const SubMain = (props: any) => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    return (
      <>
        <MainPage
          {...props}
          location={location}
          navigation={navigate}
          stateValue={state}
        />
      </>
    );
  };

export default App;
