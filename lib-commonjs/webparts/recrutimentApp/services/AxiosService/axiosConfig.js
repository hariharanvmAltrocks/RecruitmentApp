"use strict";
// export const ApiUrl = "https://hrmscp.tmicloud.net:9192/hrms/api"; // Dev
// export const ApiUrl = "https://hrmscp.tmicloud.net:9141/hrms/api";  // SIT
// export const ApiUrl = "https://careeruat.kamoacopper.com/hrms/api";  // UAT
// export const ApiUrl = "https://careers.kamoacopper.com/hrms/api";  // Production
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertMsg = exports.AuthorizationHeader = void 0;
exports.AuthorizationHeader = {
    headers: {
        "Authorization": "Basic SHJtcyBBcHAgVXNlcjpBbHRyb2Nrc0AxMjM=",
        "Content-Type": "application/json",
    },
    withCredentials: true,
};
exports.AlertMsg = {
    SessionExpird: 'Your session has expired. Please log in again.',
    UnableToConnectToServer: 'The application was unable to process request. Please try again later.',
    ServerUnhandledRequest: 'Service is temporarily unavailable.',
};
//# sourceMappingURL=axiosConfig.js.map