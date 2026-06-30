"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConsultOption = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var useConsultOption = function () {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var response, data_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ServiceExport_1.masterService.GetConsultingOptions()];
                    case 1:
                        response = _a.sent();
                        if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                            data_1 = response.data;
                            setData(data_1);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 650);
        return function () { return clearTimeout(timer); };
    }, []);
    return { data: data, loading: loading };
};
exports.useConsultOption = useConsultOption;
//# sourceMappingURL=useConsultOption.js.map