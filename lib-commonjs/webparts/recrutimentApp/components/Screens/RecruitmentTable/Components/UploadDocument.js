"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDocument = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./UploadDocument.scss");
var DEFAULT_ACCEPTED = ".pdf,.doc,.docx,.xls,.xlsx";
var DEFAULT_MAX_MB = 15;
var parseAcceptedFormats = function (acceptedFormats) {
    return acceptedFormats
        .split(",")
        .map(function (f) { return f.trim().toLowerCase(); })
        .filter(Boolean);
};
var getExtension = function (name) {
    var idx = name.lastIndexOf(".");
    return idx >= 0 ? name.slice(idx).toLowerCase() : "";
};
var isAcceptedFile = function (file, accepted) {
    if (accepted.length === 0)
        return true;
    var ext = getExtension(file.name);
    var mime = file.type.toLowerCase();
    return accepted.some(function (rule) {
        if (rule.endsWith("/*"))
            return mime.startsWith(rule.replace("/*", "/"));
        if (rule.includes("/"))
            return mime === rule;
        return ext === rule;
    });
};
var UploadDocument = function (_a) {
    var _b = _a.multiple, multiple = _b === void 0 ? false : _b, _c = _a.acceptedFormats, acceptedFormats = _c === void 0 ? DEFAULT_ACCEPTED : _c, _d = _a.maxFileSizeMB, maxFileSizeMB = _d === void 0 ? DEFAULT_MAX_MB : _d, _e = _a.label, label = _e === void 0 ? "Upload documents" : _e, _f = _a.required, required = _f === void 0 ? false : _f, onChange = _a.onChange, _g = _a.hasError, hasError = _g === void 0 ? false : _g;
    var inputRef = (0, react_1.useRef)(null);
    var _h = (0, react_1.useState)([]), files = _h[0], setFiles = _h[1];
    var _j = (0, react_1.useState)([]), errors = _j[0], setErrors = _j[1];
    var _k = (0, react_1.useState)(false), isDragging = _k[0], setIsDragging = _k[1];
    var _l = (0, react_1.useState)(false), touched = _l[0], setTouched = _l[1];
    var acceptedList = (0, react_1.useMemo)(function () { return parseAcceptedFormats(acceptedFormats); }, [acceptedFormats]);
    var maxBytes = (0, react_1.useMemo)(function () { return maxFileSizeMB * 1024 * 1024; }, [maxFileSizeMB]);
    (0, react_1.useEffect)(function () { return function () {
        files.forEach(function (f) { return URL.revokeObjectURL(f.previewUrl); });
    }; }, [files]);
    var updateFiles = (0, react_1.useCallback)(function (nextFiles) {
        setFiles(nextFiles);
        onChange === null || onChange === void 0 ? void 0 : onChange(nextFiles);
    }, [onChange]);
    var buildUploadedFile = (0, react_1.useCallback)(function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var fileContent, previewUrl;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    fileContent = _a.sent();
                    previewUrl = URL.createObjectURL(file);
                    return [2 /*return*/, { name: file.name, file: file, fileContent: fileContent, previewUrl: previewUrl }];
            }
        });
    }); }, []);
    var processFiles = (0, react_1.useCallback)(function (fileList) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var selected, nextErrors, validFiles, mapped, nextFiles;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selected = Array.from(fileList);
                    nextErrors = [];
                    validFiles = [];
                    if (!multiple && selected.length > 1) {
                        nextErrors.push("Only one file is allowed.");
                    }
                    selected.slice(0, multiple ? selected.length : 1).forEach(function (file) {
                        if (!isAcceptedFile(file, acceptedList)) {
                            nextErrors.push("".concat(file.name, ": Invalid file format."));
                            return;
                        }
                        if (file.size > maxBytes) {
                            nextErrors.push("".concat(file.name, ": File size exceeds ").concat(maxFileSizeMB, " MB."));
                            return;
                        }
                        validFiles.push(file);
                    });
                    return [4 /*yield*/, Promise.all(validFiles.map(buildUploadedFile))];
                case 1:
                    mapped = _a.sent();
                    nextFiles = multiple ? tslib_1.__spreadArray(tslib_1.__spreadArray([], files, true), mapped, true) : mapped;
                    setErrors(nextErrors);
                    updateFiles(nextFiles);
                    return [2 /*return*/];
            }
        });
    }); }, [acceptedList, buildUploadedFile, files, maxBytes, maxFileSizeMB, multiple, updateFiles]);
    var handleInputChange = (0, react_1.useCallback)(function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(true);
                    if (!e.target.files || e.target.files.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, processFiles(e.target.files)];
                case 1:
                    _a.sent();
                    if (inputRef.current)
                        inputRef.current.value = "";
                    return [2 /*return*/];
            }
        });
    }); }, [processFiles]);
    var handleRemove = (0, react_1.useCallback)(function (index) {
        var next = tslib_1.__spreadArray([], files, true);
        var removed = next.splice(index, 1)[0];
        if (removed)
            URL.revokeObjectURL(removed.previewUrl);
        updateFiles(next);
        setTouched(true);
    }, [files, updateFiles]);
    var handleClearAll = (0, react_1.useCallback)(function () {
        files.forEach(function (f) { return URL.revokeObjectURL(f.previewUrl); });
        updateFiles([]);
        setTouched(true);
    }, [files, updateFiles]);
    var handleDrop = (0, react_1.useCallback)(function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    setIsDragging(false);
                    setTouched(true);
                    if (!(((_a = e.dataTransfer.files) === null || _a === void 0 ? void 0 : _a.length) > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, processFiles(e.dataTransfer.files)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [processFiles]);
    var requiredError = (0, react_1.useMemo)(function () { return (required && touched && files.length === 0 ? "This field is required." : null); }, [required, touched, files.length]);
    return (react_1.default.createElement("div", { className: "upload-document" },
        react_1.default.createElement("div", { className: "upload-document__header" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "upload-document__label" },
                    label,
                    required && react_1.default.createElement("span", { className: "upload-document__required" }, "*")),
                react_1.default.createElement("div", { className: "upload-document__hint" },
                    multiple ? "Upload one or more files" : "Upload a single file",
                    " \u2014 Max ",
                    maxFileSizeMB,
                    " MB")),
            files.length > 0 && (react_1.default.createElement("button", { type: "button", className: "upload-document__clear", onClick: handleClearAll }, "Clear all"))),
        react_1.default.createElement("div", { className: [
                "upload-document__dropzone",
                isDragging ? "is-dragging" : "",
                hasError ? "upload-document__dropzone--error" : "",
            ]
                .filter(Boolean)
                .join(" "), onClick: function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, onDragOver: function (e) { e.preventDefault(); setIsDragging(true); }, onDragLeave: function () { return setIsDragging(false); }, onDrop: handleDrop, role: "button", tabIndex: 0, onKeyDown: function (e) {
                var _a;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click();
                }
            } },
            react_1.default.createElement("div", { className: "upload-document__icon" },
                react_1.default.createElement(lucide_react_1.FileUpIcon, { size: 22 })),
            react_1.default.createElement("div", { className: "upload-document__title" }, "Drop files here or click to browse"),
            react_1.default.createElement("div", { className: "upload-document__formats" },
                "Accepted: ",
                acceptedFormats)),
        react_1.default.createElement("input", { ref: inputRef, type: "file", className: "upload-document__input", accept: acceptedFormats, multiple: multiple, onChange: handleInputChange }),
        (errors.length > 0 || requiredError) && (react_1.default.createElement("div", { className: "upload-document__errors" },
            requiredError && (react_1.default.createElement("div", { className: "upload-document__error" }, requiredError)),
            errors.map(function (err, idx) { return (react_1.default.createElement("div", { key: "".concat(err, "-").concat(idx), className: "upload-document__error" }, err)); }))),
        hasError && (react_1.default.createElement("span", { className: "upload-document__error-text" }, "Upload document is required.")),
        react_1.default.createElement("div", { className: "upload-document__list" }, files.length === 0 ? (react_1.default.createElement("div", { className: "upload-document__empty" }, "No files selected yet.")) : (files.map(function (file, index) { return (react_1.default.createElement("div", { key: "".concat(file.name, "-").concat(index), className: "upload-document__item" },
            react_1.default.createElement("div", { className: "upload-document__file" },
                react_1.default.createElement(lucide_react_1.FileText, { size: 16 }),
                react_1.default.createElement("span", null, file.name)),
            react_1.default.createElement("button", { type: "button", className: "upload-document__remove", onClick: function () { return handleRemove(index); } },
                react_1.default.createElement(lucide_react_1.X, { size: 14 }),
                "Remove"))); })))));
};
exports.UploadDocument = UploadDocument;
//# sourceMappingURL=UploadDocument.js.map