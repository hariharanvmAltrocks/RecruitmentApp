import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { EN, FR } from "../../loc/locales";
import * as strings from "RecrutimentAppWebPartStrings";

export type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: typeof strings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("recruitment_lang");
    return saved === "fr" ? "fr" : "en";
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem("recruitment_lang", lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    const dict = language === "fr" ? FR : EN;
    Object.keys(dict).forEach((key) => {
      (strings as any)[key] = dict[key];
    });
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, strings }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
