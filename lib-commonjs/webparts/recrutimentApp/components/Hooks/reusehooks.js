"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatricID = void 0;
exports.calculateTotalExperienceYears = calculateTotalExperienceYears;
exports.getcountryCode = getcountryCode;
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
function calculateTotalExperienceYears(experiences) {
    var totalMonths = 0;
    experiences.forEach(function (exp) {
        var startDate = new Date(exp.startFrom);
        var endDate;
        if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
            endDate = new Date(); // today
        }
        else {
            endDate = new Date(exp.endTo);
        }
        var months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
        // If end day is before start day, reduce one month
        if (endDate.getDate() < startDate.getDate()) {
            months--;
        }
        totalMonths += months;
    });
    var years = Math.floor(totalMonths / 12);
    var months = totalMonths % 12;
    return "".concat(years, " years and ").concat(months, " months");
}
function getcountryCode(Code, refMobile) {
    if (!refMobile)
        return null;
    var _a = refMobile.split("-"), countryCode = _a[0], mobileNumber = _a[1];
    var country = Code.find(function (item) { return item.code === countryCode; });
    if (!country)
        return null;
    return "".concat(country.id, "-").concat(mobileNumber);
}
var findMatricID = function (statusID, TabName) {
    switch (statusID) {
        case Config_1.StatusId.ReadyforRecruitmentProcess:
            return ConditionConfig_1.MatricID.AssignHr;
        case Config_1.StatusId.PendingUploadONEM:
            return ConditionConfig_1.MatricID.UploadONEM;
        case Config_1.StatusId.PendingUploadAdvert:
            return ConditionConfig_1.MatricID.JobAdvert;
        case Config_1.StatusId.PendingReviewAdvertHOD:
            return ConditionConfig_1.MatricID.AdvertReviewHOD;
        case Config_1.StatusId.PendingwithLineManagereviewAdv:
            return ConditionConfig_1.MatricID.AdvertReviewLM;
        case Config_1.StatusId.PendingInterviewquestion:
            return ConditionConfig_1.MatricID.InterviewQuestionHR;
        case Config_1.StatusId.CareerPortalQuestions:
            return ConditionConfig_1.MatricID.InterviewQuestionLM;
        case Config_1.StatusId.InterviewScheduled:
        case Config_1.StatusId.InterviewScheduledforLevel2:
            return ConditionConfig_1.MatricID.EvalutionHR;
        case Config_1.StatusId.RecruitmentInProgress:
            if (TabName === ConditionConfig_1.TabNames.ReviewProfile) {
                return ConditionConfig_1.MatricID.ReviewProfile;
            }
            else if (TabName === ConditionConfig_1.TabNames.AssignInterviewPanel) {
                return ConditionConfig_1.MatricID.AssignInterviewPanel;
            }
            else if (TabName === ConditionConfig_1.TabNames.ReviewScorecard) {
                return ConditionConfig_1.MatricID.ReviewScoreCard;
            }
            else {
                return 0;
            }
        default:
            return 0;
    }
};
exports.findMatricID = findMatricID;
//# sourceMappingURL=reusehooks.js.map