"use strict";
// Hooks/useReviewConditions.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewConditions = void 0;
var react_1 = require("react");
var Reviewdocumentconditions_1 = require("./Reviewdocumentconditions");
var useReviewConditions = function (_a) {
    var statusID = _a.statusID, empCat = _a.empCat, consentVerification = _a.consentVerification, hasDetails = _a.hasDetails, rejectFlag = _a.rejectFlag;
    var is = (0, react_1.useMemo)(function () { return (0, Reviewdocumentconditions_1.buildStatusFlags)(statusID, empCat, consentVerification); }, [statusID, empCat, consentVerification]);
    var vis = (0, react_1.useMemo)(function () { return (0, Reviewdocumentconditions_1.buildVisibilityFlags)(is, hasDetails, rejectFlag); }, [is, hasDetails, rejectFlag]);
    return { is: is, vis: vis };
};
exports.useReviewConditions = useReviewConditions;
//# sourceMappingURL=Usereviewconditions.js.map