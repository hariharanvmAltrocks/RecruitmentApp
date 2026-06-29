import React, { createContext, useContext, useState } from "react";

interface UIState {
  activeMenuID: number;
  activeTab: string;
  navigationPath: string;
  MatricID: number;
  sideNavflag: boolean;
  currentTabName: string;
}

interface UIContextType extends UIState {
  setActiveMenuID: (id: number) => void;
  setActiveTab: (tab: string) => void;
  setNavigationPath: (path: string) => void;
  setMatricID: (id: number) => void;
  setSideNavflag: (flag: boolean) => void;
  setCurrentTabName: (name: string) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [activeMenuID, setActiveMenuID] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("");
  const [navigationPath, setNavigationPath] = useState<string>("");
  const [MatricID, setMatricID] = useState<number>(0);
  const [sideNavflag, setSideNavflag] = useState<boolean>(false);
  const [currentTabName, setCurrentTabName] = useState<string>("");

  return (
    <UIContext.Provider
      value={{
        activeMenuID,
        activeTab,
        navigationPath,
        MatricID,
        sideNavflag,
        currentTabName,
        setCurrentTabName,
        setSideNavflag,
        setMatricID,
        setActiveMenuID,
        setActiveTab,
        setNavigationPath
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIState = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUIState must be used inside UIProvider");
  return context;
};