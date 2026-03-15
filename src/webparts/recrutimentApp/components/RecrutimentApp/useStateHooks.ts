import { useState} from 'react';

export const useStateHooks = () => {
    const [activeMenuID, setactiveMenuID] = useState<number>(0);
    const [navigationPath, setNavigationPath] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("");


  return {
    activeMenuID,
    setactiveMenuID,
    navigationPath,
    setNavigationPath,
    activeTab,
    setActiveTab
  };
};