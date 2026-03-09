import * as React from "react";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import "office-ui-fabric-core/dist/css/fabric.css";
import { RoleProvider } from "./utilities/hooks/RoleContext";
import { useState } from "react";
import { IRecrutimentAppProps } from "./components/IRecrutimentAppProps";
import RecrutimentApp from "./components/RecrutimentApp/RecrutimentApp";
import "./External/tailwind.css"
import { MenuDataProvider } from "./utilities/hooks/MenuDataContext";

const FaviconSetter: React.FC<{ webURL: string }> = ({ webURL }) => {
  React.useEffect(() => {
    const faviconURL = `${webURL}/SiteAssets/favicon/favicon.png`;

    document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = faviconURL;
    document.head.appendChild(link);
  }, [webURL]);

  return null;
};

const App: React.FC<IRecrutimentAppProps> = (props) => {

  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  return (
    <RoleProvider>
      <MenuDataProvider>
        <FaviconSetter webURL={props.webURL} />
        <div className="app">
          <React.Suspense fallback={<div>Loading...</div>}>
            <RecrutimentApp {...props} {...state} {...navigate} />
          </React.Suspense>
        </div>
      </MenuDataProvider>
    </RoleProvider>
  );
};

export default function AppWrapper(props: IRecrutimentAppProps) {
  return (
    <HashRouter>
      <App {...props} />
    </HashRouter>
  );
}