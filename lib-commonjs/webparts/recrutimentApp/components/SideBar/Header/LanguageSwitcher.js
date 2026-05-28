"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSwitcher = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var LanguageContext_1 = require("../../RecrutimentApp/LanguageContext");
var LanguageSwitcher_module_scss_1 = tslib_1.__importDefault(require("./LanguageSwitcher.module.scss"));
var LanguageSwitcher = function () {
    var _a = (0, LanguageContext_1.useLanguage)(), language = _a.language, setLanguage = _a.setLanguage;
    var handleToggle = function () {
        setLanguage(language === "en" ? "fr" : "en");
    };
    return (React.createElement("div", { className: LanguageSwitcher_module_scss_1.default.switcherContainer, title: "Switch Language / Changer de Langue" },
        React.createElement("div", { className: LanguageSwitcher_module_scss_1.default.toggleWrapper, onClick: handleToggle },
            React.createElement("div", { className: "".concat(LanguageSwitcher_module_scss_1.default.slidingPill, " ").concat(language === "fr" ? LanguageSwitcher_module_scss_1.default.fr : "") }),
            React.createElement("span", { className: "".concat(LanguageSwitcher_module_scss_1.default.langOption, " ").concat(language === "en" ? LanguageSwitcher_module_scss_1.default.active : "") }, "EN"),
            React.createElement("span", { className: "".concat(LanguageSwitcher_module_scss_1.default.langOption, " ").concat(language === "fr" ? LanguageSwitcher_module_scss_1.default.active : "") }, "FR"))));
};
exports.LanguageSwitcher = LanguageSwitcher;
exports.default = exports.LanguageSwitcher;
//# sourceMappingURL=LanguageSwitcher.js.map