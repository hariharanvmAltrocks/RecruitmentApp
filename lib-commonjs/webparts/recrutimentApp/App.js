"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppWrapper;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
require("office-ui-fabric-core/dist/css/fabric.css");
var RoleContext_1 = require("./utilities/hooks/RoleContext");
var RecrutimentApp_1 = tslib_1.__importDefault(require("./components/RecrutimentApp/RecrutimentApp"));
require("./External/tailwind.css");
var MenuDataContext_1 = require("./utilities/hooks/MenuDataContext");
var ThemeContext_1 = require("./theme/ThemeContext");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var UIStateContext_1 = require("./components/RecrutimentApp/UIStateContext");
var FaviconSetter = function (_a) {
    var webURL = _a.webURL;
    React.useEffect(function () {
        var faviconURL = "".concat(webURL, "/SiteAssets/favicon/favicon.png");
        document.querySelectorAll("link[rel*='icon']").forEach(function (el) { return el.remove(); });
        var link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/x-icon";
        link.href = faviconURL;
        document.head.appendChild(link);
    }, [webURL]);
    return null;
};
var FontLoader = function () {
    React.useEffect(function () {
        var linkId = "app-theme-font";
        if (document.getElementById(linkId)) {
            return;
        }
        var link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
};
var App = function (props) {
    var location = (0, react_router_dom_1.useLocation)();
    var state = location.state;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var themeVars = (0, ThemeContext_1.useThemeVars)();
    return (React.createElement(UIStateContext_1.UIProvider, null,
        React.createElement(RoleContext_1.RoleProvider, null,
            React.createElement(MenuDataContext_1.MenuDataProvider, null,
                React.createElement(FaviconSetter, { webURL: props.webURL }),
                React.createElement(FontLoader, null),
                React.createElement("div", { className: "app", style: themeVars },
                    React.createElement(React.Suspense, { fallback: React.createElement("div", null, strings.LoadingLabel) },
                        React.createElement(RecrutimentApp_1.default, tslib_1.__assign({}, props, state, navigate))))))));
};
function AppWrapper(props) {
    return (React.createElement(react_router_dom_1.HashRouter, null,
        React.createElement(ThemeContext_1.ThemeProvider, null,
            React.createElement(App, tslib_1.__assign({}, props)))));
}
//# sourceMappingURL=App.js.map