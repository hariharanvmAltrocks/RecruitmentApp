import * as React from "react";
import { X, Palette, RefreshCw } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { predefinedThemes, AppTheme } from "../../theme/ThemeConfig";
import styles from "./ThemeSwitcher.module.scss";

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isOpen, onClose }) => {
  const { setTheme, ...currentTheme } = useTheme();

  // If switcher is not open, render nothing
  if (!isOpen) return null;

  // Helper to safely cast currentTheme as AppTheme
  const getThemeConfig = (): AppTheme => {
    return {
      primaryColor: currentTheme.primaryColor,
      secondaryColor: currentTheme.secondaryColor,
      buttonColor: currentTheme.buttonColor,
      sideNavColor: currentTheme.sideNavColor,
      headerColor: currentTheme.headerColor,
      textColor: currentTheme.textColor,
      cardColor: currentTheme.cardColor,
      fontFamily: currentTheme.fontFamily,
      name: currentTheme.name,
      isCustom: currentTheme.isCustom
    };
  };

  const themeConfig = getThemeConfig();

  // Check if current theme matches a predefined theme
  const getActiveThemeKey = (): string => {
    for (const [key, value] of Object.entries(predefinedThemes)) {
      if (
        value.primaryColor.toLowerCase() === themeConfig.primaryColor.toLowerCase() &&
        value.secondaryColor.toLowerCase() === themeConfig.secondaryColor.toLowerCase() &&
        value.buttonColor.toLowerCase() === themeConfig.buttonColor.toLowerCase() &&
        value.sideNavColor.toLowerCase() === themeConfig.sideNavColor.toLowerCase() &&
        value.headerColor.toLowerCase() === themeConfig.headerColor.toLowerCase() &&
        value.textColor.toLowerCase() === themeConfig.textColor.toLowerCase() &&
        value.cardColor.toLowerCase() === themeConfig.cardColor.toLowerCase()
      ) {
        return key;
      }
    }
    return "custom";
  };

  const activeKey = getActiveThemeKey();

  const handlePredefinedSelect = (key: string): void => {
    setTheme(predefinedThemes[key]);
  };

  const handleCustomColorChange = (key: keyof AppTheme, color: string): void => {
    const updatedTheme: AppTheme = {
      ...themeConfig,
      [key]: color,
      isCustom: true,
      name: "Custom Theme"
    };
    setTheme(updatedTheme);
  };

  const handleReset = (): void => {
    setTheme(predefinedThemes.classic);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <Palette className={styles.titleIcon} size={22} />
            <h2>Theme Customizer</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close customizer">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Predefined Themes</h3>
            <div className={styles.themesGrid}>
              {Object.entries(predefinedThemes).map(([key, theme]) => {
                const isActive = activeKey === key;
                return (
                  <div
                    key={key}
                    className={`${styles.themeCard} ${isActive ? styles.active : ""}`}
                    onClick={() => handlePredefinedSelect(key)}
                  >
                    <div className={styles.previewContainer}>
                      {/* Mini Mockup */}
                      <div className={styles.miniSidebar} style={{ background: theme.sideNavColor }} />
                      <div className={styles.miniMain}>
                        <div className={styles.miniHeader} style={{ background: theme.headerColor }} />
                        <div className={styles.miniBody} style={{ background: theme.secondaryColor }}>
                          <div className={styles.miniCard} style={{ background: theme.cardColor }} />
                          <div className={styles.miniButton} style={{ background: theme.buttonColor }} />
                        </div>
                      </div>
                    </div>
                    <span className={styles.themeName}>{theme.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Custom Palette</h3>
              {activeKey === "custom" && (
                <button className={styles.resetBtn} onClick={handleReset}>
                  <RefreshCw size={14} /> Reset
                </button>
              )}
            </div>
            
            <div className={styles.customGrid}>
              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>Sidebar Background</span>
                  <small>{themeConfig.sideNavColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.sideNavColor }}>
                  <input
                    type="color"
                    value={themeConfig.sideNavColor}
                    onChange={(e) => handleCustomColorChange("sideNavColor", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>Header / Navbar</span>
                  <small>{themeConfig.headerColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.headerColor }}>
                  <input
                    type="color"
                    value={themeConfig.headerColor}
                    onChange={(e) => handleCustomColorChange("headerColor", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>Primary Button</span>
                  <small>{themeConfig.buttonColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.buttonColor }}>
                  <input
                    type="color"
                    value={themeConfig.buttonColor}
                    onChange={(e) => handleCustomColorChange("buttonColor", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>App Background</span>
                  <small>{themeConfig.secondaryColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.secondaryColor }}>
                  <input
                    type="color"
                    value={themeConfig.secondaryColor}
                    onChange={(e) => handleCustomColorChange("secondaryColor", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>Text Color</span>
                  <small>{themeConfig.textColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.textColor }}>
                  <input
                    type="color"
                    value={themeConfig.textColor}
                    onChange={(e) => handleCustomColorChange("textColor", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.colorRow}>
                <div className={styles.colorLabel}>
                  <span>Card Background</span>
                  <small>{themeConfig.cardColor}</small>
                </div>
                <div className={styles.swatch} style={{ backgroundColor: themeConfig.cardColor }}>
                  <input
                    type="color"
                    value={themeConfig.cardColor}
                    onChange={(e) => handleCustomColorChange("cardColor", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section> */}
        </div>
        
        <div className={styles.footer}>
          <button className={styles.applyBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
