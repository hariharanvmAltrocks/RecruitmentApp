import * as React from "react";
import type { AppTheme } from "./ThemeConfig";
import { defaultTheme } from "./ThemeConfig";

interface ThemeProviderProps {
  theme?: Partial<AppTheme>;
  children: React.ReactNode;
}

// Function to normalize hex color (handles 3-digit hex shorthand)
export function normalizeHex(hex: string): string {
  let cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  return "#" + cleanHex;
}

// Helper to determine if a hex color is dark
export function isDarkColor(hexColor: string): boolean {
  if (!hexColor) return false;
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  if (hex.length < 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

interface ThemeContextType extends AppTheme {
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {}
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  const [currentTheme, setCurrentTheme] = React.useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem("kamoa-app-theme");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load theme from localStorage", e);
    }
    return {
      ...defaultTheme,
      ...theme
    };
  });

  const setTheme = React.useCallback((newTheme: AppTheme) => {
    setCurrentTheme(newTheme);
    try {
      localStorage.setItem("kamoa-app-theme", JSON.stringify(newTheme));
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const isDark = isDarkColor(currentTheme.sideNavColor);

    // Apply main theme variables to :root
    root.style.setProperty("--app-primary-color", currentTheme.primaryColor);
    root.style.setProperty("--app-secondary-color", currentTheme.secondaryColor);
    root.style.setProperty("--app-button-color", currentTheme.buttonColor);
    root.style.setProperty("--app-sidenav-color", currentTheme.sideNavColor);
    root.style.setProperty("--app-header-color", currentTheme.headerColor);
    root.style.setProperty("--app-text-color", currentTheme.textColor);
    root.style.setProperty("--app-card-color", currentTheme.cardColor);
    root.style.setProperty("--app-font-family", currentTheme.fontFamily);

    // Apply derived sidebar variables
    if (isDark) {
      root.style.setProperty("--app-sidenav-bg-hover", "rgba(255, 255, 255, 0.08)");
      root.style.setProperty("--app-sidenav-text", "rgba(255, 255, 255, 0.65)");
      root.style.setProperty("--app-sidenav-text-active", "#ffffff");
      root.style.setProperty("--app-sidenav-icon-muted", "rgba(255, 255, 255, 0.4)");
      root.style.setProperty("--app-sidenav-section-label", "rgba(255, 255, 255, 0.8)");
      root.style.setProperty("--app-sidenav-border", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty("--app-sidenav-footer-bg", "rgba(0, 0, 0, 0.2)");
      root.style.setProperty("--app-sidenav-tooltip-bg", "rgba(15, 14, 46, 0.95)");
      root.style.setProperty("--app-sidenav-chevron", "rgba(255, 255, 255, 0.5)");
    } else {
      root.style.setProperty("--app-sidenav-bg-hover", "rgba(0, 0, 0, 0.05)");
      root.style.setProperty("--app-sidenav-text", "#475569");
      root.style.setProperty("--app-sidenav-text-active", "#0f172a");
      root.style.setProperty("--app-sidenav-icon-muted", "#94a3b8");
      root.style.setProperty("--app-sidenav-section-label", "#334155");
      root.style.setProperty("--app-sidenav-border", "rgba(0, 0, 0, 0.06)");
      root.style.setProperty("--app-sidenav-footer-bg", "rgba(0, 0, 0, 0.03)");
      root.style.setProperty("--app-sidenav-tooltip-bg", "#1e293b");
      root.style.setProperty("--app-sidenav-chevron", "#64748b");
    }
  }, [currentTheme]);

  const contextValue = React.useMemo<ThemeContextType>(() => {
    return {
      ...currentTheme,
      setTheme
    };
  }, [currentTheme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
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
      "--app-text-color": theme.textColor,
      "--app-card-color": theme.cardColor,
      "--app-font-family": theme.fontFamily
    } as React.CSSProperties;
  }, [theme]);
};
