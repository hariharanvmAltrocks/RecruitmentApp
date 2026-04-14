"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAttachmentDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var Config_1 = require("../../../../../utilities/Config");
var IDocument_1 = require("../../../../../models/IDocument");
var useAttachmentDetails = function (jobId, options) {
    var _a;
    var _b = (0, react_1.useState)([]), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var enabled = (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true;
    (0, react_1.useEffect)(function () {
        if (!jobId || !enabled) {
            setData([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var _a, RoleProfileDocment, GradingDocument, AdvertismentDocment, OnamSignedStampsDocment, mappedData;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.RoleProfileMaster, jobId, IDocument_1.RoleProfileMaster.RoleProfile),
                            ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.RoleProfileMaster, jobId, IDocument_1.RoleProfileMaster.Grading),
                            ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.RecruitmentAdvertisementDocument, jobId),
                            ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.ONAMSignedStampDocuments, jobId),
                        ])];
                    case 1:
                        _a = _b.sent(), RoleProfileDocment = _a[0], GradingDocument = _a[1], AdvertismentDocment = _a[2], OnamSignedStampsDocment = _a[3];
                        mappedData = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (RoleProfileDocment.data.English.length > 0 ||
                            RoleProfileDocment.data.French.length > 0
                            ? [
                                {
                                    title: "Role Profile Document",
                                    type: "PDF",
                                    versions: RoleProfileDocment.data.English.map(function (d) { return ({
                                        lang: "EN",
                                        label: d.name,
                                        content: d.content,
                                    }); }).concat(RoleProfileDocment.data.French.map(function (d) { return ({
                                        lang: "FR",
                                        label: d.name,
                                        content: d.content,
                                    }); })),
                                },
                            ]
                            : []), true), (GradingDocument.data.English.length > 0 ||
                            GradingDocument.data.French.length > 0
                            ? [
                                {
                                    title: "Grading Document",
                                    type: "PDF",
                                    versions: GradingDocument.data.English.map(function (d) { return ({
                                        lang: "EN",
                                        label: d.name,
                                        content: d.content,
                                    }); }).concat(GradingDocument.data.French.map(function (d) { return ({
                                        lang: "FR",
                                        label: d.name,
                                        content: d.content,
                                    }); })),
                                },
                            ]
                            : []), true), (AdvertismentDocment.data.length > 0
                            ? [
                                {
                                    title: "Advertisement Document",
                                    type: "PDF",
                                    versions: AdvertismentDocment.data.map(function (d) { return ({
                                        lang: "EN",
                                        label: d.name,
                                        content: d.content,
                                    }); }),
                                },
                            ]
                            : []), true), (OnamSignedStampsDocment.data.length > 0
                            ? [
                                {
                                    title: "ONAM Signed Stamps",
                                    type: "PDF",
                                    versions: OnamSignedStampsDocment.data.map(function (d) { return ({
                                        lang: "EN",
                                        label: d.name,
                                        content: d.content,
                                    }); }),
                                },
                            ]
                            : []), true);
                        setData(mappedData);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 600);
        return function () { return clearTimeout(timer); };
    }, [jobId, enabled]);
    return { data: data, loading: loading };
};
exports.useAttachmentDetails = useAttachmentDetails;
//# sourceMappingURL=getAttachmentDetails.js.map