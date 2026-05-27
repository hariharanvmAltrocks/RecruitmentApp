"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateMainRecord = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var Config_1 = require("../../../../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../../../../../services/SPService/spservice"));
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var UIStateContext_1 = require("../../../../../RecrutimentApp/UIStateContext");
var WorkflowConfig_1 = require("../../../../../Hooks/WorkflowConfig");
var useUpdateMainRecord = function (form, currentRoleID) {
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    var updateMainRecord = (0, react_1.useCallback)(function (extraData) {
        if (extraData === void 0) { extraData = {}; }
        return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var StatusID, payload, tasks;
            return tslib_1.__generator(this, function (_a) {
                StatusID = (0, WorkflowConfig_1.WorkflowConfig)(form.StatusId);
                payload = tslib_1.__assign({ StatusId: StatusID }, extraData);
                tasks = [
                    spservice_1.default.SPUpdateItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                        RequestJSON: payload,
                        ID: form === null || form === void 0 ? void 0 : form.ID,
                    }),
                ];
                if (form === null || form === void 0 ? void 0 : form.reviewerComments) {
                    tasks.push(ServiceExport_1.RecruitmentServices.PostCommentsData({
                        RoleId: currentRoleID,
                        RecruitmentIDId: form === null || form === void 0 ? void 0 : form.ID,
                        Comments: form === null || form === void 0 ? void 0 : form.reviewerComments,
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