"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredAttachments = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var RequiredAttachments = function (_a) {
    var attachments = _a.attachments, isLoading = _a.isLoading;
    var attachmentCards = (0, react_1.useMemo)(function () {
        return attachments.map(function (doc, index) { return (react_1.default.createElement("div", { key: "".concat(doc.title, "-").concat(index), className: "advert-review-drawer__attachment-card" },
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-type advert-review-drawer__attachment-type--".concat(doc.type.toLowerCase()) },
                    react_1.default.createElement(lucide_react_1.FileText, { size: 14 }),
                    react_1.default.createElement("span", null, doc.type)),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-meta" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-title", title: doc.title }, doc.title),
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-tag" }, "Recruitment"))),
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" }, doc.versions.map(function (version, idx) { return (react_1.default.createElement("div", { key: "".concat(version.lang, "-").concat(idx), className: "advert-review-drawer__attachment-version" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-lang advert-review-drawer__attachment-lang--".concat(version.lang.toLowerCase()) }, version.lang),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-info" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__attachment-label" }, version.label)),
                react_1.default.createElement(lucide_react_1.Download, { size: 12 }))); })))); });
    }, [attachments]);
    return (react_1.default.createElement("section", { className: "advert-review-drawer__section" },
        react_1.default.createElement("div", { className: "advert-review-drawer__section-header advert-review-drawer__section-header--plain" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(lucide_react_1.Paperclip, { size: 12 }),
                "Required Attachments")),
        isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, Array.from({ length: 3 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "attachment-skeleton-".concat(idx), className: "advert-review-drawer__attachment-card" },
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
                react_1.default.createElement(SkeletonBlock, { width: "60%" })),
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" },
                react_1.default.createElement(SkeletonBlock, { width: "80%" }),
                react_1.default.createElement(SkeletonBlock, { width: "65%" })))); }))) : (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, attachmentCards))));
};
exports.RequiredAttachments = RequiredAttachments;
//# sourceMappingURL=RequiredAttachments.js.map