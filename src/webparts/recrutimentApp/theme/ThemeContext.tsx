import * as React from "react";
import type { AppTheme } from "./ThemeConfig";
import { defaultTheme } from "./ThemeConfig";

interface ThemeProviderProps {
  theme?: Partial<AppTheme>;
  children: React.ReactNode;
}

const ThemeContext = React.createContext<AppTheme>(defaultTheme);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  const mergedTheme = React.useMemo<AppTheme>(() => {
    return {
      ...defaultTheme,
      ...theme
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={mergedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): AppTheme => {
  return React.useContext(ThemeContext);
};

export const useThemeVars = (): React.CSSProperties => {
  const theme = useTheme();

  return React.useMemo(() => {
    return {
      "--app-primary-color": theme.primaryColor,
      "--app-secondary-color": theme.secondaryColor,
      "--app-button-color": theme.buttonColor,
      "--app-sidenav-color": theme.sideNavColor,
      "--app-header-color": theme.headerColor,
      "--app-font-family": theme.fontFamily
    } as React.CSSProperties;
  }, [theme]);
};
