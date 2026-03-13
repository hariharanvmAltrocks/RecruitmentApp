"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var sp_1 = require("@pnp/sp");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/site-users/web");
require("@pnp/sp/webs");
require("@pnp/sp/site-users/web");
require("@pnp/sp/site-groups/web");
var App_1 = tslib_1.__importDefault(require("./App"));
var spservice_1 = require("./services/SPService/spservice");
var GraphService_1 = tslib_1.__importDefault(require("./services/GraphService/GraphService"));
require("./External/style.css");
require("./External/tailwind.css");
var RecrutimentAppWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(RecrutimentAppWebPart, _super);
    function RecrutimentAppWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isDarkTheme = false;
        _this._environmentMessage = '';
        _this._sp = new sp_1.SPFI;
        return _this;
    }
    RecrutimentAppWebPart.prototype.render = function () {
        var element = React.createElement(App_1.default, {
            sp: this._sp,
            description: this.properties.description,
            webURL: this.context.pageContext.web.absoluteUrl,
            context: this.context,
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName
        });
        ReactDom.render(element, this.domElement);
    };
    RecrutimentAppWebPart.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var graphClient;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.onInit.call(this)];
                    case 1:
                        _a.sent();
                        (0, spservice_1.initSP)(this.context);
                        return [4 /*yield*/, this.context.msGraphClientFactory.getClient("3")];
                    case 2:
                        graphClient = _a.sent();
                        GraphService_1.default.setGraphClient(graphClient);
                        return [2 /*return*/];
                }
            });
        });
    };
    // protected onInit(): Promise<void> {
    //   return this._getEnvironmentMessage().then(message => {
    //     this._environmentMessage = message;
    //   });
    // }
    RecrutimentAppWebPart.prototype._getEnvironmentMessage = function () {
        var _this = this;
        if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
            return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
                .then(function (context) {
                var environmentMessage = '';
                switch (context.app.host.name) {
                    case 'Office': // running in Office
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                        break;
                    case 'Outlook': // running in Outlook
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                        break;
                    case 'Teams': // running in Teams
                    case 'TeamsModern':
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                        break;
                    default:
                        environmentMessage = strings.UnknownEnvironment;
                }
                return environmentMessage;
            });
        }
        return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    };
    RecrutimentAppWebPart.prototype.onThemeChanged = function (currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        var semanticColors = currentTheme.semanticColors;
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
            this.domElement.style.setProperty('--primaryColor', '#0078d4');
            this.domElement.style.setProperty('--secondaryColor', '#ff8c00');
            this.domElement.style.setProperty('--fontFamily', 'Inter", ui-sans-serif, system-ui, sans-serif');
        }
    };
    RecrutimentAppWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(RecrutimentAppWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    RecrutimentAppWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return RecrutimentAppWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = RecrutimentAppWebPart;
//# sourceMappingURL=RecrutimentAppWebPart.js.map