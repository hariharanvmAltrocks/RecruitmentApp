"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = exports.LanguageProvider = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var locales_1 = require("../../loc/locales");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var LanguageContext = (0, react_1.createContext)(undefined);
var LanguageProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(function () {
        var saved = localStorage.getItem("recruitment_lang");
        return saved === "fr" ? "fr" : "en";
    }), language = _b[0], setLanguageState = _b[1];
    var setLanguage = function (lang) {
        localStorage.setItem("recruitment_lang", lang);
        setLanguageState(lang);
    };
    (0, react_1.useEffect)(function () {
        var dict = language === "fr" ? locales_1.FR : locales_1.EN;
        Object.keys(dict).forEach(function (key) {
            strings[key] = dict[key];
        });
    }, [language]);
    return (React.createElement(LanguageContext.Provider, { value: { language: language, setLanguage: setLanguage, strings: strings } }, children));
};
exports.LanguageProvider = LanguageProvider;
var useLanguage = function () {
    var context = (0, react_1.useContext)(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
exports.useLanguage = useLanguage;
//# sourceMappingURL=LanguageContext.js.map