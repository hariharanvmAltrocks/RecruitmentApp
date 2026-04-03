"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var CandidateDocumentsRepository_module_scss_1 = tslib_1.__importDefault(require("./CandidateDocumentsRepository.module.scss"));
var reusehooks_1 = require("../../../Hooks/reusehooks");
// ─── Icon Registry ────────────────────────────────────────────────────────────
var ICONS = {
    fingerprint: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round" },
        react_1.default.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12c0 2.76 1.12 5.26 2.93 7.07" }),
        react_1.default.createElement("path", { d: "M12 6c-3.31 0-6 2.69-6 6 0 1.54.58 2.94 1.53 4" }),
        react_1.default.createElement("path", { d: "M12 10c-1.1 0-2 .9-2 2 0 .55.22 1.05.58 1.42" }),
        react_1.default.createElement("path", { d: "M12 10c1.1 0 2 .9 2 2 0 1.8-.8 3.6-2 4.8" }),
        react_1.default.createElement("path", { d: "M12 6c3.31 0 6 2.69 6 6 0 .88-.19 1.72-.52 2.48" }),
        react_1.default.createElement("path", { d: "M12 2c5.52 0 10 4.48 10 10 0 1.93-.55 3.73-1.5 5.25" }))); },
    "offer-letter": function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        react_1.default.createElement("polyline", { points: "14 2 14 8 20 8" }),
        react_1.default.createElement("line", { x1: "8", y1: "13", x2: "14", y2: "13" }),
        react_1.default.createElement("line", { x1: "8", y1: "17", x2: "11", y2: "17" }),
        react_1.default.createElement("polyline", { points: "13.5 13.5 12 15 12.5 17 14 16.5 15.5 17 16 15 14.5 13.5 13.5 13.5" }))); },
    "work-permit": function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round" },
        react_1.default.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        react_1.default.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
        react_1.default.createElement("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" }),
        react_1.default.createElement("path", { d: "M5.5 6.5a17 17 0 0 0 13 0M5.5 17.5a17 17 0 0 0 13 0", strokeOpacity: "0.45" }))); },
    contract: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        react_1.default.createElement("polyline", { points: "14 2 14 8 20 8" }),
        react_1.default.createElement("line", { x1: "8", y1: "12", x2: "16", y2: "12" }),
        react_1.default.createElement("line", { x1: "8", y1: "16", x2: "16", y2: "16" }),
        react_1.default.createElement("line", { x1: "8", y1: "8", x2: "11", y2: "8" }),
        react_1.default.createElement("line", { x1: "10", y1: "7", x2: "10", y2: "9" }))); },
    vaccination: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("line", { x1: "19", y1: "2", x2: "22", y2: "5" }),
        react_1.default.createElement("path", { d: "M17 4l3 3" }),
        react_1.default.createElement("path", { d: "m15 6 1 1-7.5 7.5a2 2 0 0 0-.5 1L8 18l2.5-.5a2 2 0 0 0 1-.5L19 9.5l-1-1" }),
        react_1.default.createElement("line", { x1: "2", y1: "22", x2: "8", y2: "16" }),
        react_1.default.createElement("line", { x1: "12", y1: "8", x2: "16", y2: "12", strokeDasharray: "1.5 2" }))); },
    police: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M12 2l7 3v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V5l7-3z" }),
        react_1.default.createElement("polyline", { points: "9 12 11 14 15 10" }))); },
    payment: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
        react_1.default.createElement("line", { x1: "2", y1: "10", x2: "22", y2: "10" }),
        react_1.default.createElement("line", { x1: "6", y1: "15", x2: "8", y2: "15" }),
        react_1.default.createElement("line", { x1: "10", y1: "15", x2: "14", y2: "15" }))); },
    generic: function (c) { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
        react_1.default.createElement("path", { d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }),
        react_1.default.createElement("polyline", { points: "13 2 13 9 20 9" }),
        react_1.default.createElement("line", { x1: "8", y1: "13", x2: "14", y2: "13" }),
        react_1.default.createElement("line", { x1: "8", y1: "17", x2: "11", y2: "17" }))); },
};
var IframeModal = function (_a) {
    var url = _a.url, fileName = _a.fileName, onClose = _a.onClose;
    if (!url)
        return null;
    var getViewerUrl = function (url) {
        if ((0, reusehooks_1.isSharePointUrl)(url)) {
            return (0, reusehooks_1.buildWopiUrl)(url);
        }
        if ((0, reusehooks_1.isPdfUrl)(url)) {
            return url;
        }
        return (0, reusehooks_1.buildOfficeViewerUrl)(url);
    };
    return (react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.modalOverlay, onClick: onClose, role: "dialog", "aria-modal": "true", "aria-label": "Preview: ".concat(fileName) },
        react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.modalBox, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.modalHeader },
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.modalFileIcon },
                    react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
                        react_1.default.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                        react_1.default.createElement("polyline", { points: "14 2 14 8 20 8" }))),
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.modalFileName }, fileName),
                react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.modalHeaderActions },
                    react_1.default.createElement("a", { href: url, download: true, className: CandidateDocumentsRepository_module_scss_1.default.modalDownloadBtn, title: "Download file", onClick: function (e) { return e.stopPropagation(); } },
                        react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
                            react_1.default.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                            react_1.default.createElement("polyline", { points: "7 10 12 15 17 10" }),
                            react_1.default.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "3" })),
                        "Download"),
                    react_1.default.createElement("button", { className: CandidateDocumentsRepository_module_scss_1.default.modalCloseBtn, onClick: onClose, "aria-label": "Close preview" },
                        react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
                            react_1.default.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                            react_1.default.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }))))),
            react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.modalIframeWrap },
                react_1.default.createElement("iframe", { src: getViewerUrl(url), title: "Preview of ".concat(fileName), className: CandidateDocumentsRepository_module_scss_1.default.modalIframe, sandbox: "allow-scripts allow-same-origin allow-forms" })))));
};
var DocumentRow = function (_a) {
    var doc = _a.doc, onView = _a.onView;
    return (react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.docRow },
        react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.docRowIcon },
            react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" },
                react_1.default.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                react_1.default.createElement("polyline", { points: "14 2 14 8 20 8" }))),
        react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.docRowContent },
            react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.docRowName }, doc.fileName),
            react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.docRowMeta },
                doc.fileSizeMB,
                " MB \u00A0\u00B7\u00A0 ",
                doc.uploadedDate)),
        react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.docRowActions },
            react_1.default.createElement("button", { className: CandidateDocumentsRepository_module_scss_1.default.docActionBtn, title: "Preview document", "aria-label": "Preview ".concat(doc.fileName), onClick: function () { return onView(doc.downloadUrl, doc.fileName); } },
                react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
                    react_1.default.createElement("path", { d: "M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" }),
                    react_1.default.createElement("circle", { cx: "12", cy: "12", r: "3" }))),
            react_1.default.createElement("a", { href: doc.downloadUrl, download: true, className: CandidateDocumentsRepository_module_scss_1.default.docActionBtn, title: "Download document", "aria-label": "Download ".concat(doc.fileName) },
                react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" },
                    react_1.default.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                    react_1.default.createElement("polyline", { points: "7 10 12 15 17 10" }),
                    react_1.default.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "3" }))))));
};
var CategoryCard = function (_a) {
    var _b;
    var category = _a.category, _c = _a.defaultOpen, defaultOpen = _c === void 0 ? false : _c, onView = _a.onView;
    var _d = (0, react_1.useState)(defaultOpen), open = _d[0], setOpen = _d[1];
    var iconRenderer = (_b = ICONS[category.icon]) !== null && _b !== void 0 ? _b : ICONS.generic;
    return (react_1.default.createElement("div", { className: "".concat(CandidateDocumentsRepository_module_scss_1.default.categoryCard, " ").concat(open ? CandidateDocumentsRepository_module_scss_1.default.categoryCardOpen : ""), style: { "--accent": category.accentColor } },
        react_1.default.createElement("button", { className: CandidateDocumentsRepository_module_scss_1.default.categoryHeader, onClick: function () { return setOpen(function (o) { return !o; }); }, "aria-expanded": open, "aria-controls": "docs-".concat(category.categoryId) },
            react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.categoryIconWrap }, iconRenderer(category.accentColor)),
            react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.categoryMeta },
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.categoryName }, category.categoryName),
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.categoryCount },
                    category.documents.length,
                    " DOCUMENTS AVAILABLE")),
            react_1.default.createElement("span", { className: "".concat(CandidateDocumentsRepository_module_scss_1.default.chevronBtn, " ").concat(open ? CandidateDocumentsRepository_module_scss_1.default.chevronOpen : "") },
                react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
                    react_1.default.createElement("polyline", { points: "18 15 12 9 6 15" })))),
        open && (react_1.default.createElement("div", { id: "docs-".concat(category.categoryId), className: CandidateDocumentsRepository_module_scss_1.default.docGrid }, category.documents.map(function (doc) { return (react_1.default.createElement(DocumentRow, { key: doc.id, doc: doc, onView: onView })); })))));
};
var CandidateDocumentsRepository = function (_a) {
    var data = _a.data;
    var _b = (0, react_1.useState)(null), previewUrl = _b[0], setPreviewUrl = _b[1];
    var _c = (0, react_1.useState)(""), previewFileName = _c[0], setPreviewFileName = _c[1];
    var handleView = function (url, fileName) {
        setPreviewUrl(url);
        setPreviewFileName(fileName);
    };
    var handleClose = function () {
        setPreviewUrl(null);
        setPreviewFileName("");
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(IframeModal, { url: previewUrl, fileName: previewFileName, onClose: handleClose }),
        react_1.default.createElement("section", { className: CandidateDocumentsRepository_module_scss_1.default.repository },
            react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.titleRow },
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.titleBar }),
                react_1.default.createElement("h2", { className: CandidateDocumentsRepository_module_scss_1.default.title }, "CANDIDATE DOCUMENTS REPOSITORY"),
                react_1.default.createElement("span", { className: CandidateDocumentsRepository_module_scss_1.default.totalBadge }, data === null || data === void 0 ? void 0 :
                    data.totalFiles,
                    " Total Files")),
            react_1.default.createElement("div", { className: CandidateDocumentsRepository_module_scss_1.default.categoryList }, data === null || data === void 0 ? void 0 : data.categories.map(function (cat, idx) { return (react_1.default.createElement(CategoryCard, { key: cat.categoryId, category: cat, defaultOpen: idx === 0, onView: handleView })); })))));
};
exports.default = CandidateDocumentsRepository;
//# sourceMappingURL=CandidateDocumentsRepository.js.map