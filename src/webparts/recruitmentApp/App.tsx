import * as React from "react";
import MainPage from "./MainPage/mainpage";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import { RoleProvider } from "./utilities/RoleContext";
import "./App.css";
import "office-ui-fabric-core/dist/css/fabric.css";


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
function App(props: any) {
  return (
    <RoleProvider>
      <HashRouter>
        <div className="app">
          <SubMain {...props} />
        </div>
      </HashRouter>
    </RoleProvider>

  );
}



export default App;
