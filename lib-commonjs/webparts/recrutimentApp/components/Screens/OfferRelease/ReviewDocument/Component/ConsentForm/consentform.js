"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./consentform.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var ConsentFormSection = function (_a) {
    var _b;
    var consentform = _a.consentform, onFileChange = _a.onFileChange, _c = _a.downloadUrl, downloadUrl = _c === void 0 ? "#" : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.hasFileError, hasFileError = _e === void 0 ? false : _e;
    var fileInputRef = (0, react_1.useRef)(null);
    var _f = (0, react_1.useState)(null), selectedFile = _f[0], setSelectedFile = _f[1];
    var _g = (0, react_1.useState)(false), isReading = _g[0], setIsReading = _g[1];
    var handleUploadClick = function () {
        var _a;
        if (!disabled) {
            (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    };
    var handleFileChange = function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var file, buffer, content, error_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    setSelectedFile(file);
                    setIsReading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    buffer = _b.sent();
                    content = new Uint8Array(buffer);
                    onFileChange({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        content: content,
                        lastModified: file.lastModified,
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.error(strings.ErrorReadingFile, error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsReading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRemove = function () {
        setSelectedFile(null);
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    return (react_1.default.createElement("div", { className: "consent-form-section ".concat(hasFileError ? "has-error" : "", " ").concat(disabled ? "disabled" : "") },
        react_1.default.createElement("div", { className: "consent-form-section__header" },
            react_1.default.createElement("div", { className: "consent-form-section__icon-wrapper" },
                react_1.default.createElement(lucide_react_1.ShieldCheck, { size: 20, className: "consent-form-section__icon" })),
            react_1.default.createElement("h3", { className: "consent-form-section__title" }, strings.CandidateConsentForm)),
        react_1.default.createElement("div", { className: "consent-form-section__content" },
            react_1.default.createElement("div", { className: "consent-card" },
                react_1.default.createElement("div", { className: "consent-card__info" },
                    react_1.default.createElement("span", { className: "consent-card__label" },
                        strings.ConsentForm, consentform === null || consentform === void 0 ? void 0 :
                        consentform.name),
                    react_1.default.createElement("span", { className: "consent-card__name" }, strings.DownloadTheFormAddYourSignatureThenUploa)),
                react_1.default.createElement("a", { href: consentform === null || consentform === void 0 ? void 0 : consentform.downloadUrl, className: "consent-card__download-btn", download: (_b = consentform === null || consentform === void 0 ? void 0 : consentform.name) !== null && _b !== void 0 ? _b : true },
                    react_1.default.createElement(lucide_react_1.Download, { size: 16 }),
                    react_1.default.createElement("span", null, strings.DownloadTemplate))),
            react_1.default.createElement("div", { className: "upload-box ".concat(selectedFile ? "upload-box--has-file" : "", " ").concat(hasFileError ? "upload-box--error" : ""), onClick: handleUploadClick },
                react_1.default.createElement("input", { ref: fileInputRef, type: "file", className: "upload-box__input", accept: ".pdf,.doc,.docx", onChange: handleFileChange, disabled: disabled || isReading }),
                react_1.default.createElement("div", { className: "upload-box__inner" }, selectedFile ? (react_1.default.createElement("div", { className: "upload-box__file-info" },
                    react_1.default.createElement("div", { className: "upload-box__file-icon" },
                        react_1.default.createElement(lucide_react_1.FileText, { size: 24 })),
                    react_1.default.createElement("div", { className: "upload-box__file-details" },
                        react_1.default.createElement("span", { className: "upload-box__filename" }, selectedFile.name),
                        react_1.default.createElement("span", { className: "upload-box__filesize" },
                            (selectedFile.size / 1024).toFixed(1),
                            " ",
                            strings.Kb)),
                    react_1.default.createElement("div", { className: "upload-box__status" }, isReading ? (react_1.default.createElement("div", { className: "upload-box__spinner" })) : (react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 20, className: "upload-box__success-icon" }))))) : (react_1.default.createElement("div", { className: "upload-box__placeholder" },
                    react_1.default.createElement("div", { className: "upload-box__icon-circle" },
                        react_1.default.createElement(lucide_react_1.Upload, { size: 20 })),
                    react_1.default.createElement("div", { className: "upload-box__text" },
                        react_1.default.createElement("span", { className: "upload-box__primary" }, strings.ClickToUploadSignedForm),
                        react_1.default.createElement("span", { className: "upload-box__secondary" }, strings.PdfOrWordDocumentMax5mb)))))),
            react_1.default.createElement(framer_motion_1.AnimatePresence, null, hasFileError && (react_1.default.createElement(framer_motion_1.motion.div, { className: "consent-form-section__error", initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 } },
                react_1.default.createElement(lucide_react_1.AlertCircle, { size: 14 }),
                react_1.default.createElement("span", null, strings.PleaseUploadTheSignedConsentFormToProcee))))),
        selectedFile && !disabled && (react_1.default.createElement("button", { type: "button", className: "consent-form-section__remove-btn", onClick: function (e) {
                e.stopPropagation();
                handleRemove();
            } }, strings.ReplaceDocument))));
};
exports.default = ConsentFormSection;
//# sourceMappingURL=consentform.js.map