"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COICard = void 0;
var tslib_1 = require("tslib");
// components/COICard/COICard.tsx
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./Coicard.modules.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var MAX_COMMENT_LENGTH = 256;
var COICard = function (_a) {
    var consultOptions = _a.consultOptions, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b, _c = _a.hasError, hasError = _c === void 0 ? false : _c, onChange = _a.onChange, LabelName = _a.LabelName;
    var fileInputRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)({
        consultedWith: "",
        comments: "",
        attachment: [],
        wishesToProceed: "",
    }), state = _d[0], setState = _d[1];
    var update = function (patch) {
        var next = tslib_1.__assign(tslib_1.__assign({}, state), patch);
        setState(next);
        onChange === null || onChange === void 0 ? void 0 : onChange(next);
    };
    var handleFileChange = function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var target, file, toBase64, base64, docs, error_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    target = e.target;
                    file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    toBase64 = function (file) {
                        return new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                                resolve(reader.result);
                            };
                            reader.onerror = function (error) { return reject(error); };
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, toBase64(file)];
                case 2:
                    base64 = _b.sent();
                    docs = [
                        {
                            name: file.name,
                            content: base64, // ✅ FIXED
                            type: "New", // ✅ FIXED
                        },
                    ];
                    update({ attachment: docs });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error(strings.FileConversionError, error_1);
                    return [3 /*break*/, 4];
                case 4:
                    target.value = "";
                    return [2 /*return*/];
            }
        });
    }); };
    var handleClearFile = function () { return update({ attachment: [] }); };
    var proceedError = hasError && !state.wishesToProceed;
    var consultedWithError = hasError && !state.consultedWith;
    var commentsError = hasError && !state.comments.trim();
    var attachmentError = hasError && state.attachment.length === 0;
    return (react_1.default.createElement("div", { className: "coi-card" },
        react_1.default.createElement("div", { className: "coi-card__titleRow" },
            react_1.default.createElement("span", { className: "coi-card__titleBar" }),
            react_1.default.createElement("h2", { className: "coi-card__title" }, LabelName)),
        react_1.default.createElement("div", { className: "coi-card__fields" },
            react_1.default.createElement("div", { className: "coi-card__field ".concat(consultedWithError ? "coi-card__field--error" : "") },
                react_1.default.createElement("label", { className: "coi-card__label" },
                    strings.ConsultedWith,
                    react_1.default.createElement("span", { className: "coi-card__required" }, "*")),
                react_1.default.createElement("div", { className: "coi-card__select-wrap" },
                    react_1.default.createElement("select", { className: "coi-card__select", value: state.consultedWith, onChange: function (e) { return update({ consultedWith: e.target.value }); }, disabled: isReadOnly },
                        react_1.default.createElement("option", { value: "" }, strings.Select),
                        consultOptions.map(function (opt) { return (react_1.default.createElement("option", { key: opt.value, value: opt.value }, opt.label)); })),
                    react_1.default.createElement(lucide_react_1.ChevronDown, { size: 16, className: "coi-card__select-chevron" })),
                consultedWithError && (react_1.default.createElement("span", { className: "coi-card__error-msg" }, strings.ThisFieldIsRequired))),
            react_1.default.createElement("div", { className: "coi-card__field ".concat(attachmentError ? "coi-card__field--error" : "") },
                react_1.default.createElement("label", { className: "coi-card__label" },
                    strings.ProofOfDiscussion,
                    react_1.default.createElement("span", { className: "coi-card__required" }, "*")),
                !isReadOnly ? (state.attachment.length === 0 ? (react_1.default.createElement("button", { type: "button", className: "coi-card__upload-btn ".concat(attachmentError ? "coi-card__upload-btn--error" : ""), onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); } },
                    react_1.default.createElement("span", { className: "coi-card__upload-icon" },
                        react_1.default.createElement(lucide_react_1.Upload, { size: 16 })),
                    react_1.default.createElement("span", { className: "coi-card__upload-text" },
                        react_1.default.createElement("span", { className: "coi-card__upload-primary" }, strings.ClickToUpload),
                        react_1.default.createElement("span", { className: "coi-card__upload-hint" }, strings.PdfDocDocxPngJpg)))) : (react_1.default.createElement("div", { className: "coi-card__file-preview" },
                    react_1.default.createElement("span", { className: "coi-card__file-icon" },
                        react_1.default.createElement(lucide_react_1.FileText, { size: 16 })),
                    react_1.default.createElement("div", { className: "coi-card__file-info" },
                        react_1.default.createElement("span", { className: "coi-card__file-name" }, state.attachment[0].name),
                        react_1.default.createElement("span", { className: "coi-card__file-ready" },
                            react_1.default.createElement(lucide_react_1.CheckCircle, { size: 11 }),
                            " ",
                            strings.ReadyToSubmit)),
                    react_1.default.createElement("button", { type: "button", className: "coi-card__file-remove", onClick: handleClearFile, "aria-label": strings.RemoveFile },
                        react_1.default.createElement(lucide_react_1.Trash2, { size: 14 }))))) : /* Read-only file display */
                    state.attachment.length > 0 ? (react_1.default.createElement("div", { className: "coi-card__file-preview coi-card__file-preview--readonly" },
                        react_1.default.createElement("span", { className: "coi-card__file-icon" },
                            react_1.default.createElement(lucide_react_1.FileText, { size: 16 })),
                        react_1.default.createElement("span", { className: "coi-card__file-name" }, state.attachment[0].name))) : (react_1.default.createElement("span", { className: "coi-card__empty" }, strings.NoFileUploaded)),
                react_1.default.createElement("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.png,.jpg", style: { display: "none" }, onChange: handleFileChange }),
                attachmentError && (react_1.default.createElement("span", { className: "coi-card__error-msg" }, strings.PleaseUploadProofOfDiscussion)))),
        react_1.default.createElement("div", { className: "coi-card__textarea-wrap ".concat(commentsError ? "coi-card__field--error" : "") },
            react_1.default.createElement("label", { className: "coi-card__label" },
                strings.ReasonComments,
                react_1.default.createElement("span", { className: "coi-card__required" }, "*")),
            react_1.default.createElement("div", { className: "coi-card__textarea-relative" },
                react_1.default.createElement("textarea", { className: "coi-card__textarea ".concat(commentsError ? "coi-card__textarea--error" : ""), maxLength: MAX_COMMENT_LENGTH, placeholder: strings.EnterYourCommentsMax256Characters, value: state.comments, onChange: function (e) { return update({ comments: e.target.value }); }, readOnly: isReadOnly }),
                react_1.default.createElement("span", { className: "coi-card__char-count" },
                    state.comments.length,
                    "/",
                    MAX_COMMENT_LENGTH)),
            commentsError && (react_1.default.createElement("span", { className: "coi-card__error-msg" }, strings.CommentsAreRequired))),
        react_1.default.createElement("div", { className: "coi-card__radio-group ".concat(proceedError ? "coi-card__field--error" : "") },
            react_1.default.createElement("label", { className: "coi-card__label" },
                strings.DoYouWishToProceedWithThisAction,
                " ",
                react_1.default.createElement("span", { className: "coi-card__required" }, "*")),
            react_1.default.createElement("div", { className: "coi-card__radio-options" },
                react_1.default.createElement("label", { className: "coi-card__radio-label" },
                    react_1.default.createElement("input", { type: "radio", name: "proceedAction", value: "Yes", checked: state.wishesToProceed === "Yes", onChange: function () { return update({ wishesToProceed: "Yes" }); }, disabled: isReadOnly }),
                    react_1.default.createElement("span", { className: "coi-card__radio-custom" }),
                    react_1.default.createElement("span", { className: "coi-card__radio-text" }, strings.Yes1)),
                react_1.default.createElement("label", { className: "coi-card__radio-label" },
                    react_1.default.createElement("input", { type: "radio", name: "proceedAction", value: "No", checked: state.wishesToProceed === "No", onChange: function () { return update({ wishesToProceed: "No" }); }, disabled: isReadOnly }),
                    react_1.default.createElement("span", { className: "coi-card__radio-custom" }),
                    react_1.default.createElement("span", { className: "coi-card__radio-text" }, strings.No1))),
            proceedError && (react_1.default.createElement("span", { className: "coi-card__error-msg" }, "This field is required.")))));
};
exports.COICard = COICard;
exports.default = exports.COICard;
//# sourceMappingURL=Coicard.js.map