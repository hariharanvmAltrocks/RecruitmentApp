// export const ApiUrl = "https://hrmscp.tmicloud.net:9192/hrms/api"; // Dev
// export const ApiUrl = "https://hrmscp.tmicloud.net:9141/hrms/api";  // SIT
export const ApiUrl = "https://careeruat.kamoacopper.com/hrms/api";  // UAT


export const AuthorizationHeader = {
    headers: {
        "Authorization": "Basic SHJtcyBBcHAgVXNlcjpBbHRyb2Nrc0AxMjM=",
        "Content-Type": "application/json",
    },
    withCredentials: true,
}

export const AlertMsg = {
    SessionExpird: 'Your session has expired. Please log in again.',
    UnableToConnectToServer: 'The application was unable to process request. Please try again later.',
    ServerUnhandledRequest: 'Service is temporarily unavailable.',
} 