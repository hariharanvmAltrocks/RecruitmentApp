"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSignatureDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var useSignatureDetails = function () {
    var _a;
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var emailId = (_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0];
    // const mockMap = useMemo(() => ({
    //   "JOB-001": {
    //     reviewerName: "Jackson Mulenga",
    //     reviewerInitial: "JM",
    //     jobTitleEN: "HOD - Mining",
    //     jobTitleFR: "Chef de d�partement - Mines",
    //   },
    //   "JOB-002": {
    //     reviewerName: "Alisha Nsimba",
    //     reviewerInitial: "AN",
    //     jobTitleEN: "Senior Geologist",
    //     jobTitleFR: "G�ologue principal",
    //   },
    // }) as { [key: string]: SignatureDetails }, []);
    (0, react_1.useEffect)(function () {
        if (!emailId) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var Filter, response, data_1, UserName, mappedData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Filter = [
                            { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId }
                        ];
                        return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails(Filter, "and")];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200 && response.data) {
                            data_1 = response.data;
                            UserName = [data_1 === null || data_1 === void 0 ? void 0 : data_1.FirstName, data_1 === null || data_1 === void 0 ? void 0 : data_1.LastName]
                                .filter(Boolean)
                                .join(" ");
                            mappedData = {
                                reviewerName: UserName, //data.FirstName + " " + data.MiddleName + " " + data.LastName,
                                reviewerInitial: (data_1.LastName || "").charAt(0).toUpperCase(),
                                jobTitleEN: data_1.JopTitleEnglish || "",
                                jobTitleFR: data_1.JopTitleFrench || "",
                            };
                            setData(mappedData);
                            setLoading(false);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 550);
        return function () { return clearTimeout(timer); };
    }, [emailId]);
    return { data: data, loading: loading };
};
exports.useSignatureDetails = useSignatureDetails;
//# sourceMappingURL=getSignatureDetails.js.map