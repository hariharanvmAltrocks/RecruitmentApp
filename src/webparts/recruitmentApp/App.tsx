import * as React from "react";
import MainPage from "./MainPage/mainpage";
import { HashRouter } from "react-router-dom";
import { RoleProvider } from "./utilities/RoleContext";
import "./App.css";

function App() {
    return (
        <RoleProvider>
            <HashRouter>
                <div className="app">
                    <MainPage />
                </div>
            </HashRouter>
        </RoleProvider>

    );
}

export default App;
