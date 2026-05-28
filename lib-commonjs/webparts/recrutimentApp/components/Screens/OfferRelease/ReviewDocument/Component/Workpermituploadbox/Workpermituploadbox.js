"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkPermitUploadBox = void 0;
var tslib_1 = require("tslib");
// Component/WorkPermitUploadBox.tsx
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var FilePreview = function (_a) {
    var file = _a.file, isReading = _a.isReading, disabled = _a.disabled, onClear = _a.onClear;
    return (react_1.default.createElement("div", { className: "upload-box__file-info" },
        react_1.default.createElement("div", { className: "upload-box__file-icon" },
            react_1.default.createElement(lucide_react_1.FileText, { size: 24 })),
        react_1.default.createElement("div", { className: "upload-box__file-details" },
            react_1.default.createElement("span", { className: "upload-box__filename" }, file.name),
            react_1.default.createElement("span", { className: "upload-box__filesize" },
                file.fileSizeMB,
                " ",
                strings.Mb)),
        react_1.default.createElement("div", { className: "upload-box__status" }, isReading ? (react_1.default.createElement("div", { className: "upload-box__spinner" })) : (react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 20, className: "upload-box__success-icon" }))),
        react_1.default.createElement("button", { type: "button", className: "upload-box__clear", disabled: disabled, onClick: function (e) {
                e.stopPropagation();
                onClear();
            } },
            react_1.default.createElement(lucide_react_1.X, { size: 14 }))));
};
var UploadPlaceholder = function () { return (react_1.default.createElement("div", { className: "upload-box__placeholder" },
    react_1.default.createElement("div", { className: "upload-box__icon-circle" },
        react_1.default.createElement(lucide_react_1.Upload, { size: 20 })),
    react_1.default.createElement("div", { className: "upload-box__text" },
        react_1.default.createElement("span", { className: "upload-box__primary" }, strings.ClickToUploadWorkPermitAcknowledgement),
        react_1.default.createElement("span", { className: "upload-box__secondary" }, strings.PdfOrWordDocumentMax5Mb)))); };
var WorkPermitUploadBox = function (_a) {
    var fileInputRef = _a.fileInputRef, selectedFile = _a.selectedFile, isReading = _a.isReading, hasFileError = _a.hasFileError, _b = _a.disabled, disabled = _b === void 0 ? false : _b, onUploadClick = _a.onUploadClick, onFileChange = _a.onFileChange, onClearFile = _a.onClearFile;
    var dropzoneClass = [
        "upload-box",
        selectedFile && "upload-box--has-file",
        hasFileError && "upload-box--error",
    ]
        .filter(Boolean)
        .join(" ");
    return (react_1.default.createElement("div", { className: "upload-workpermit-card" },
        react_1.default.createElement("div", { className: "upload-workpermit-card__header" },
            react_1.default.createElement("div", { className: "upload-workpermit-card__header-icon" },
                react_1.default.createElement(lucide_react_1.FileText, { size: 18 })),
            react_1.default.createElement("div", { className: "upload-workpermit-card__header-text" },
                react_1.default.createElement("p", { className: "upload-workpermit-card__title" }, strings.WorkPermitAcknowledgement),
                react_1.default.createElement("p", { className: "upload-workpermit-card__subtitle" }, strings.UploadTheSignedAcknowledgementDocument))),
        react_1.default.createElement("div", { className: dropzoneClass, onClick: onUploadClick },
            react_1.default.createElement("input", { ref: fileInputRef, type: "file", className: "upload-box__input", accept: ".pdf,.doc,.docx", onChange: onFileChange, disabled: disabled || isReading }),
            react_1.default.createElement("div", { className: "upload-box__inner" }, selectedFile ? (react_1.default.createElement(FilePreview, { file: selectedFile, isReading: isReading, disabled: disabled, onClear: onClearFile })) : (react_1.default.createElement(UploadPlaceholder, null)))),
        hasFileError && (react_1.default.createElement("span", { className: "upload-box__error-text" }, strings.PleaseUploadTheWorkPermitAcknowledgement))));
};
exports.WorkPermitUploadBox = WorkPermitUploadBox;
//# sourceMappingURL=Workpermituploadbox.js.map