"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppWrapper;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
require("office-ui-fabric-core/dist/css/fabric.css");
var RoleContext_1 = require("./utilities/hooks/RoleContext");
var RecrutimentApp_1 = tslib_1.__importDefault(require("./components/RecrutimentApp/RecrutimentApp"));
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
var App = function (props) {
    var location = (0, react_router_dom_1.useLocation)();
    var state = location.state;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (React.createElement(RoleContext_1.RoleProvider, null,
        React.createElement(FaviconSetter, { webURL: props.webURL }),
        React.createElement("div", { className: "app" },
            React.createElement(React.Suspense, { fallback: React.createElement("div", null, "Loading...") },
                React.createElement(RecrutimentApp_1.default, tslib_1.__assign({}, props))))));
};
function AppWrapper(props) {
    return (React.createElement(react_router_dom_1.HashRouter, null,
        React.createElement(App, tslib_1.__assign({}, props))));
}
//# sourceMappingURL=App.js.map