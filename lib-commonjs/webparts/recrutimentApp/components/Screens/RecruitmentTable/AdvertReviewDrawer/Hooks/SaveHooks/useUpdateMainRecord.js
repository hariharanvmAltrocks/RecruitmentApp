"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateMainRecord = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var Config_1 = require("../../../../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../../../../../services/SPService/spservice"));
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var useUpdateMainRecord = function (form, currentRoleID) {
    var updateMainRecord = (0, react_1.useCallback)(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(void 0, tslib_1.__spreadArray([], args_1, true), void 0, function (extraData) {
            var formState, payload, tasks;
            if (extraData === void 0) { extraData = {}; }
            return tslib_1.__generator(this, function (_a) {
                formState = form.formState;
                payload = tslib_1.__assign({ ActionId: Config_1.WorkflowAction.Approved, ItemCreated: "Yes" }, extraData);
                tasks = [
                    spservice_1.default.SPUpdateItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                        RequestJSON: payload,
                        ID: formState.ID,
                    }),
                ];
                if (formState.Comments) {
                    tasks.push(ServiceExport_1.RecruitmentServices.PostCommentsData({
                        RoleId: currentRoleID,
                        RecruitmentIDId: formState.ID,
                        Comments: formState.Comments,
                    }));
                }
                return [2 /*return*/, Promise.all(tasks)];
            });
        });
    }, [form, currentRoleID]);
    return { updateMainRecord: updateMainRecord };
};
exports.useUpdateMainRecord = useUpdateMainRecord;
//# sourceMappingURL=useUpdateMainRecord.js.map