"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredAttachments = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("../RecruitmentTable.scss");
var reusehooks_1 = require("../../../Hooks/reusehooks");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var isSharePointUrl = function (url) { return /\.sharepoint\.com\//i.test(url); };
var isPdfUrl = function (url) {
    var clean = url.split("?")[0].toLowerCase();
    return clean.endsWith(".pdf");
};
var buildWopiUrl = function (url) {
    try {
        var parsed = new URL(url);
        return "".concat(parsed.origin, "/_layouts/15/WopiFrame.aspx?sourcedoc=").concat(encodeURIComponent(url), "&action=embedview");
    }
    catch (_a) {
        return url;
    }
};
var buildOfficeViewerUrl = function (url) { return "https://view.officeapps.live.com/op/embed.aspx?src=".concat(encodeURIComponent(url)); };
var getViewerUrl = function (url) {
    if (isSharePointUrl(url)) {
        return buildWopiUrl(url);
    }
    if (isPdfUrl(url)) {
        return url;
    }
    return buildOfficeViewerUrl(url);
};
var getVersionUrl = function (version) { return version.fileUrl || version.content || ""; };
var RequiredAttachments = function (_a) {
    var attachments = _a.attachments, isLoading = _a.isLoading;
    var _b = (0, react_1.useState)(null), viewerFile = _b[0], setViewerFile = _b[1];
    var _c = (0, react_1.useState)(false), viewerLoading = _c[0], setViewerLoading = _c[1];
    var openViewer = (0, react_1.useCallback)(function (file) {
        setViewerFile(file);
        setViewerLoading(true);
    }, []);
    var closeViewer = (0, react_1.useCallback)(function () {
        setViewerFile(null);
        setViewerLoading(false);
    }, []);
    (0, react_1.useEffect)(function () {
        if (!viewerFile) {
            return;
        }
        var handleKey = function (event) {
            if (event.key === "Escape") {
                closeViewer();
            }
        };
        document.addEventListener("keydown", handleKey);
        return function () { return document.removeEventListener("keydown", handleKey); };
    }, [viewerFile, closeViewer]);
    var attachmentCards = (0, react_1.useMemo)(function () {
        return attachments.map(function (doc, index) { return (react_1.default.createElement("div", { key: "".concat(doc.title, "-").concat(index), className: "advert-review-drawer__attachment-card" },
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-type advert-review-drawer__attachment-type--".concat(doc.type.toLowerCase()) },
                    react_1.default.createElement(lucide_react_1.FileText, { size: 14 }),
                    react_1.default.createElement("span", null, doc.type)),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-meta" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-title", title: doc.title }, doc.title),
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-tag" }, "Recruitment"))),
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" }, doc.versions.map(function (version, idx) {
                var fileUrl = getVersionUrl(version);
                return (react_1.default.createElement("div", { key: "".concat(version.lang, "-").concat(idx), className: "advert-review-drawer__attachment-version", onClick: function () { return fileUrl && openViewer({
                        url: fileUrl,
                        title: doc.title,
                        label: version.label,
                        lang: version.lang,
                    }); }, onKeyDown: function (event) {
                        if (!fileUrl) {
                            return;
                        }
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openViewer({
                                url: fileUrl,
                                title: doc.title,
                                label: version.label,
                                lang: version.lang,
                            });
                        }
                    } },
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-lang advert-review-drawer__attachment-lang--".concat(version.lang.toLowerCase()) }, version.lang),
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-info" },
                        react_1.default.createElement("span", { className: "advert-review-drawer__attachment-label advert-review-drawer__attachment-label--link", 
                            // onClick={() => fileUrl && window.open(fileUrl, "_blank")}
                            role: "button", "aria-disabled": !fileUrl, style: { cursor: fileUrl ? "pointer" : "not-allowed", opacity: fileUrl ? 1 : 0.5 } }, (0, reusehooks_1.truncateText)(version.label, 20))),
                    react_1.default.createElement(lucide_react_1.Download, { size: 12 })));
            })))); });
    }, [attachments, openViewer]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("section", { className: "advert-review-drawer__section" },
            react_1.default.createElement("div", { className: "advert-review-drawer__section-header advert-review-drawer__section-header--plain" },
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(lucide_react_1.Paperclip, { size: 12 }),
                    "Required Attachments")),
            isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, Array.from({ length: 3 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "attachment-skeleton-".concat(idx), className: "advert-review-drawer__attachment-card" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
                    react_1.default.createElement(SkeletonBlock, { width: "60%" })),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" },
                    react_1.default.createElement(SkeletonBlock, { width: "80%" }),
                    react_1.default.createElement(SkeletonBlock, { width: "65%" })))); }))) : (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, attachmentCards))),
        viewerFile && (react_1.default.createElement("div", { className: "attachment-viewer", role: "presentation" },
            react_1.default.createElement("div", { className: "attachment-viewer__backdrop", onClick: closeViewer }),
            react_1.default.createElement("div", { className: "attachment-viewer__panel", role: "dialog", "aria-modal": "true", "aria-label": viewerFile.title },
                react_1.default.createElement("div", { className: "attachment-viewer__header" },
                    react_1.default.createElement("div", { className: "attachment-viewer__meta" },
                        react_1.default.createElement("div", { className: "attachment-viewer__title" }, viewerFile.title),
                        react_1.default.createElement("div", { className: "attachment-viewer__subtitle" },
                            viewerFile.label,
                            " \uFFFD ",
                            viewerFile.lang)),
                    react_1.default.createElement("div", { className: "attachment-viewer__actions" },
                        react_1.default.createElement("a", { className: "attachment-viewer__button", href: viewerFile.url, download: true },
                            react_1.default.createElement(lucide_react_1.Download, { size: 14 }),
                            "Download"),
                        react_1.default.createElement("button", { type: "button", className: "attachment-viewer__button attachment-viewer__button--ghost", onClick: closeViewer },
                            react_1.default.createElement(lucide_react_1.X, { size: 14 }),
                            "Close"))),
                react_1.default.createElement("div", { className: "attachment-viewer__body" },
                    viewerLoading && (react_1.default.createElement("div", { className: "attachment-viewer__loading" },
                        react_1.default.createElement("div", { className: "attachment-viewer__spinner" }),
                        react_1.default.createElement("span", null, "Loading document..."))),
                    react_1.default.createElement("iframe", { className: "attachment-viewer__iframe", src: getViewerUrl(viewerFile.url), title: viewerFile.title, onLoad: function () { return setViewerLoading(false); }, allow: "fullscreen" })))))));
};
exports.RequiredAttachments = RequiredAttachments;
//# sourceMappingURL=RequiredAttachments.js.map