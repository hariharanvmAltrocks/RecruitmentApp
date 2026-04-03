"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkPermitUpload = void 0;
// Hooks/useWorkPermitUpload.ts
var react_1 = require("react");
var useWorkPermitUpload = function () {
    var fileInputRef = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(null), selectedFile = _a[0], setSelectedFile = _a[1];
    var _b = (0, react_1.useState)(false), isReading = _b[0], setIsReading = _b[1];
    var _c = (0, react_1.useState)(false), hasFileError = _c[0], setHasFileError = _c[1];
    var handleUploadClick = function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); };
    var handleFileChange = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        setIsReading(true);
        setHasFileError(false);
        // Simulate brief read delay — replace with real async read if needed
        setTimeout(function () {
            setSelectedFile(file);
            setIsReading(false);
        }, 500);
    };
    var clearFile = function () {
        setSelectedFile(null);
        setHasFileError(false);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    return {
        fileInputRef: fileInputRef,
        selectedFile: selectedFile,
        isReading: isReading,
        hasFileError: hasFileError,
        setHasFileError: setHasFileError,
        handleUploadClick: handleUploadClick,
        handleFileChange: handleFileChange,
        clearFile: clearFile,
    };
};
exports.useWorkPermitUpload = useWorkPermitUpload;
//# sourceMappingURL=Useworkpermitupload.js.map