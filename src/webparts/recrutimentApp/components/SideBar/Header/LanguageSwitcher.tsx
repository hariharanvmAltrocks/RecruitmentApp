import * as React from "react";
import { useLanguage } from "../../RecrutimentApp/LanguageContext";
import styles from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <div className={styles.switcherContainer} title="Switch Language / Changer de Langue">
      <div className={styles.toggleWrapper} onClick={handleToggle}>
        <div className={`${styles.slidingPill} ${language === "fr" ? styles.fr : ""}`} />
        <span className={`${styles.langOption} ${language === "en" ? styles.active : ""}`}>
          EN
        </span>
        <span className={`${styles.langOption} ${language === "fr" ? styles.active : ""}`}>
          FR
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
