"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecruitmentColumns = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_2 = tslib_1.__importDefault(require("react"));
var Config_1 = require("../../../utilities/Config");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var StatusTooltip_1 = require("../../Comman/StatusTooltip/StatusTooltip");
var Config_2 = require("../OfferRelease/Config");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var getActionLabel = function (actionMode, item, matricID) {
    var submissionMatricIds = [
        ConditionConfig_1.MatricID.MySubmission,
        ConditionConfig_1.MatricID.MySubmissionHR,
        ConditionConfig_1.MatricID.MySubmissionLM,
        ConditionConfig_1.MatricID.MySubmissionHOD,
        ConditionConfig_1.MatricID.MySubmissionBGV,
    ];
    if (submissionMatricIds.includes(matricID)) {
        return "VIEW";
    }
    else if (actionMode === "Upload") {
        return "UPLOAD";
    }
    else if (item.statusId === Config_1.StatusId.CareerPortalQuestions ||
        item.statusId === Config_1.StatusId.PendingInterviewquestion) {
        return "CREATE";
    }
    else if (item.statusId === Config_1.StatusId.PendingReviewAdvertHOD ||
        item.statusId === Config_1.StatusId.PendingwithLineManagereviewAdv) {
        return "REVIEW";
    }
    else {
        return "VIEW";
    }
};
var useRecruitmentColumns = function (_a) {
    var _b;
    var role = _a.role, actionMode = _a.actionMode, onAction = _a.onAction, hasProfileCount = _a.hasProfileCount;
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    var onActionRef = (0, react_1.useRef)(onAction);
    (0, react_1.useEffect)(function () {
        onActionRef.current = onAction;
    }, [onAction]);
    var showProfile = (0, react_1.useMemo)(function () {
        if (hasProfileCount !== undefined) {
            return hasProfileCount;
        }
        return (matricID === ConditionConfig_1.MatricID.ReviewProfileHR ||
            matricID === ConditionConfig_1.MatricID.ReviewProfileLM ||
            matricID === ConditionConfig_1.MatricID.AssignInterviewPanel ||
            matricID === ConditionConfig_1.MatricID.ReviewScoreCard);
    }, [hasProfileCount, matricID]);
    var actionColumn = (0, react_1.useMemo)(function () { return ({
        id: "actions",
        header: "Actions",
        align: "left",
        cellClassName: "data-table__cell--actions",
        render: function (item) { return (react_2.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return onActionRef.current(item); }, type: "button", "aria-label": actionMode === strings.Upload ? strings.UploadDocument : strings.ViewVacancy }, getActionLabel(actionMode, item, matricID))); },
    }); }, [actionMode]);
    var defaultColumns = (0, react_1.useMemo)(function () { return tslib_1.__spreadArray(tslib_1.__spreadArray([
        {
            id: "jobCode",
            header: strings.JobCode,
            accessor: "jobCode",
            cellClassName: "data-table__job-code",
        },
        {
            id: "title",
            header: strings.JobTitleDept,
            render: function (item) { return (react_2.default.createElement("div", { className: "data-table__job-title" },
                react_2.default.createElement("span", null, item.title),
                react_2.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        }
    ], (showProfile
        ? [
            {
                id: "ProfileCount",
                header: " Profile Count",
                render: function (item) { var _a; return String((_a = item.ProfileCount) !== null && _a !== void 0 ? _a : 0).padStart(2, "0"); },
                cellClassName: "data-table__cell--count",
                // align: "center",
                hideOnMobile: true,
            },
        ]
        : []), true), [
        {
            id: "count",
            header: "headCount",
            render: function (item) { return String(item.count).padStart(2, "0"); },
            cellClassName: "data-table__cell--count",
            align: "center",
            hideOnMobile: true,
        },
        {
            id: "requestType",
            header: strings.RequestType,
            accessor: "requestType",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "nationality",
            header: "Nationality",
            accessor: "nationality",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) {
                var _a;
                var isTooltipStatus;
                isTooltipStatus = [Config_1.StatusId.ReadyforRecruitmentProcess].includes(item.statusId);
                if (!isTooltipStatus) {
                    return (react_2.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                        react_2.default.createElement(StatusTooltip_1.StatusTooltip, { data: (_a = item.StatusTooltip) !== null && _a !== void 0 ? _a : null }),
                        react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)));
                }
                return (react_2.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                    react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)));
            },
        },
        actionColumn,
    ], false); }, [actionColumn, showProfile]);
    var evaluationColumns = (0, react_1.useMemo)(function () { return [
        {
            id: "applicantName",
            header: strings.ApplicantName,
            accessor: "applicantName",
            cellClassName: "data-table__job-code",
            hideOnMobile: true,
        },
        {
            id: "title",
            header: strings.PositionTitle,
            render: function (item) { return (react_2.default.createElement("div", { className: "data-table__job-title" },
                react_2.default.createElement("span", null, item.title),
                react_2.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "interviewDate",
            header: strings.InterviewDate,
            accessor: "interviewDate",
            align: "center",
            cellClassName: "data-table__cell--count",
            hideOnMobile: true,
        },
        {
            id: "interviewLevels",
            header: strings.InterviewLevels,
            accessor: "interviewLevels",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "grade",
            header: "Grade",
            accessor: "grade",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return (react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)); },
        },
        actionColumn,
    ]; }, [actionColumn]);
    function resolveActionMode(statusID) {
        if (Config_2.Initiate_STAUES.has(statusID))
            return "Initiate";
        if (Config_2.REVIEW_STATUSES.has(statusID))
            return "Review";
        if (Config_2.EDIT_STATUSES.has(statusID))
            return "Edit";
        return "View";
    }
    var ActionCell = react_2.default.memo(function (_a) {
        var item = _a.item, StatusId = _a.StatusId, onAction = _a.onAction;
        var actionMode = (0, react_1.useMemo)(function () { return resolveActionMode(StatusId); }, [StatusId]);
        var isInitiate = actionMode === "Initiate";
        var isReview = actionMode === "Review";
        var ActionIcon = isInitiate ? lucide_react_1.Play : isReview ? lucide_react_1.Pencil : lucide_react_1.Eye;
        var actionLabel = isInitiate ? "INITIATE" : isReview ? "REVIEW" : "VIEW";
        return (react_2.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return onAction(item); }, type: "button", "aria-label": "".concat(actionLabel, " action") }, actionLabel));
    });
    var offerReleaseColumns = (0, react_1.useMemo)(function () { return [
        {
            id: "PositionID",
            header: strings.PositionId,
            accessor: "positionId",
            cellClassName: "data-table__job-code",
            hideOnMobile: true,
        },
        {
            id: "title",
            header: "Job Title & Dept",
            render: function (item) { return (react_2.default.createElement("div", { className: "data-table__job-title" },
                react_2.default.createElement("span", null, item.title),
                react_2.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "buCode",
            header: strings.BusinessUnit,
            render: function (item) { return String(item.buCode || "").padStart(2, "0"); },
            cellClassName: "data-table__cell--muted",
            align: "center",
            hideOnMobile: true,
        },
        {
            id: "applicantName",
            header: "Applicant Name",
            accessor: "applicantName",
            cellClassName: "data-table__cell--count",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return (react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)); },
        },
        {
            id: "actions",
            header: "Actions",
            align: "right",
            cellClassName: "data-table__cell--actions",
            render: function (item) { return (react_2.default.createElement(ActionCell, { item: item, StatusId: item.statusId, onAction: function () { return onActionRef.current(item); } })); },
        },
    ]; }, [onActionRef]);
    var columnMap = {
        default: defaultColumns,
        evaluation: evaluationColumns,
        OfferRelease: offerReleaseColumns,
    };
    return (_b = columnMap[role]) !== null && _b !== void 0 ? _b : defaultColumns;
};
exports.useRecruitmentColumns = useRecruitmentColumns;
//# sourceMappingURL=config.js.map