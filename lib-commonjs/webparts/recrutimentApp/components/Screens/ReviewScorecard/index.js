"use strict";
// ─── index.ts ─────────────────────────────────────────────────────────────────
// Barrel export for the Review Scorecard feature module.
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCandidateListData = exports.useReviewScorecardData = exports.ScorecardQuestionsView = exports.ScorecardCommentView = exports.HodViewScorecardDetail = exports.ReviewScorecardCandidateList = exports.ReviewScorecardTab = void 0;
var tslib_1 = require("tslib");
// Main tab entry point
var ReviewScorecardTab_1 = require("./tabs/ScorecardTab/ReviewScorecardTab");
Object.defineProperty(exports, "ReviewScorecardTab", { enumerable: true, get: function () { return tslib_1.__importDefault(ReviewScorecardTab_1).default; } });
// Routed sub-pages (register these in AppRoutes.tsx)
var ReviewScorecardCandidateList_1 = require("./components/ReviewScorecardCandidateList");
Object.defineProperty(exports, "ReviewScorecardCandidateList", { enumerable: true, get: function () { return tslib_1.__importDefault(ReviewScorecardCandidateList_1).default; } });
var HodViewScorecardDetail_1 = require("./components/HodViewScorecardDetail");
Object.defineProperty(exports, "HodViewScorecardDetail", { enumerable: true, get: function () { return tslib_1.__importDefault(HodViewScorecardDetail_1).default; } });
// Sub-views
var ScorecardCommentView_1 = require("./components/ScorecardCommentView");
Object.defineProperty(exports, "ScorecardCommentView", { enumerable: true, get: function () { return tslib_1.__importDefault(ScorecardCommentView_1).default; } });
var ScorecardQuestionsView_1 = require("./components/ScorecardQuestionsView");
Object.defineProperty(exports, "ScorecardQuestionsView", { enumerable: true, get: function () { return tslib_1.__importDefault(ScorecardQuestionsView_1).default; } });
// Hooks (if needed externally)
var useReviewScorecardData_1 = require("./hooks/useReviewScorecardData");
Object.defineProperty(exports, "useReviewScorecardData", { enumerable: true, get: function () { return useReviewScorecardData_1.useReviewScorecardData; } });
var useCandidateListData_1 = require("./hooks/useCandidateListData");
Object.defineProperty(exports, "useCandidateListData", { enumerable: true, get: function () { return useCandidateListData_1.useCandidateListData; } });
// Service layer
tslib_1.__exportStar(require("./services/ScorecardApiService"), exports);
tslib_1.__exportStar(require("./services/IScorecardService"), exports);
// Config
tslib_1.__exportStar(require("./config/ScorecardConfig"), exports);
//# sourceMappingURL=index.js.map