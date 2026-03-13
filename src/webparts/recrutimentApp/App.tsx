import * as React from "react";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import "office-ui-fabric-core/dist/css/fabric.css";
import { RoleProvider } from "./utilities/hooks/RoleContext";
import { IRecrutimentAppProps } from "./components/IRecrutimentAppProps";
import RecrutimentApp from "./components/RecrutimentApp/RecrutimentApp";
import "./External/tailwind.css"
import { MenuDataProvider } from "./utilities/hooks/MenuDataContext";
import { ThemeProvider, useThemeVars } from "./theme/ThemeContext";

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

const FontLoader: React.FC = () => {
  React.useEffect(() => {
    const linkId = "app-theme-font";
    if (document.getElementById(linkId)) {
      return;
    }

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  return null;
};

const App: React.FC<IRecrutimentAppProps> = (props) => {

  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const themeVars = useThemeVars();

  return (
    <RoleProvider>
      <MenuDataProvider>
        <FaviconSetter webURL={props.webURL} />
        <FontLoader />
        <div className="app" style={themeVars}>
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
      <ThemeProvider>
        <App {...props} />
      </ThemeProvider>
    </HashRouter>
  );
}
