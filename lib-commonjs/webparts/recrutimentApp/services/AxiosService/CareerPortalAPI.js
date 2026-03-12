"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PPEMasterTable = exports.AdminPanelServiceApi = exports.BGverification = exports.LaborHire = exports.EmailService = exports.GetJobRequestData = exports.UploadCandidateCVData = exports.GetStateByCountryApi = exports.QuestionnaireApi = exports.postAdveDetails = exports.getProfileData = exports.InternalSign = void 0;
var tslib_1 = require("tslib");
var axiosConfig_1 = require("./axiosConfig");
var AxiosService_1 = tslib_1.__importDefault(require("./AxiosService"));
exports.InternalSign = {
    InternalSignIn: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/InternalSignIn", {}, axiosConfig_1.AuthorizationHeader)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.getProfileData = {
    GetProfileByJobCode: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/GetProfileByJobCode?jobCode", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetJobAppliedCount: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post('/hrms/GetJobAppliedCount', params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getCandidateProfile: function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/GetMyJobsById?id=".concat(id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UpdateCandidateStatus: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpdateWorkflowStatus", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.postAdveDetails = {
    postUpsertJobs: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertJobs", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    postAgenciesJobs: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertAgentForJobs", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getAllMaster: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/hrms/GetAllMasters")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getMastersByCategory: function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/hrms/GetMastersByCategory?catId=".concat(id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    PostMaster: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertMasters", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
exports.QuestionnaireApi = {
    PostQuestionnaire: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertQuestions", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetQuestionnaire: function (JobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/hrms/GetInterviewPanelQuestionsByJobCode?jobCode=".concat(JobCode))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetQuestionaireByScope: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, AxiosService_1.default.post("/hrms/GetQuestionsBank", params)];
            });
        });
    }
};
exports.GetStateByCountryApi = {
    GetCountryApi: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/jobPortal/GetAllCountries")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetStatebyCountry: function (CountryCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/jobPortal/GetStatesByCountryCode?countryCode=".concat(CountryCode))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetCitiesbyState: function (StateCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/jobPortal/GetCitiesByStateId?stateId=".concat(StateCode))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
exports.UploadCandidateCVData = {
    CheckMyCandidateAppliedJobs: function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/Agent/CheckMyCandidateAppliedJobs?email=".concat(data.Email, "&jobCode=").concat(data.JobCode))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UpsertProfile: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/Profile/UpsertProfile", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UploadDocument: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.postForm("/Profile/CandidateUploadDocument", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetCandiateForJobs: function (jobCode, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/Agent/GetCandiateForJobs?jobCode=".concat(jobCode), params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetQuestionByJobCode: function (jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("jobPortal/GetQuestionByJobCode?code=".concat(jobCode))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.GetJobRequestData = {
    GetJobRequestStatus: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/GetJobRequestStatus", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UpsertCOI: function (COIType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertCoi", COIType)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
exports.EmailService = {
    emailnotification: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/SendEmailNotification", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
exports.LaborHire = {
    initiateLaborHire: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertJobsLaborHire", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.BGverification = {
    initiateBGVProcess: function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/BGVerification/RunBGVerification?jobRequestId=".concat(id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // GetBGVStatus: async function (params: BGVStatus) {
    //     return await AxiosInstance.post(
    //         `/hrms/GetBGVStatus`, params
    //     );
    // },
    UpsertBGVJobMaster: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertBGVJobMaster", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    GetBGVerificationType: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("hrms/GetBGVerificationType")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UpdateBGVerification: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("BGVerification/ProcessBgvJobs?jobRequestId=".concat(params))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    PerformCriminalRecordCheck: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("BGVerification/PerformCriminalRecordCheck?jobRequestId=".concat(params))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.AdminPanelServiceApi = {
    GetAdminPanelDashboard: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/GetAllExternalUsers", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    UpsertExternalUser: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.post("/hrms/UpsertExternalUser", params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    ResetPassword: function (Email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get("/Auth/PasswordResetToken?userName=".concat(Email))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
exports.PPEMasterTable = {
    getPPEMaster: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AxiosService_1.default.get('/jobPortal/GetPPEMaster')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
};
//# sourceMappingURL=CareerPortalAPI.js.map