export const ApiUrl = "http://20.219.107.162:9121/hrms/api/hrms";
export const AuthorizationHeader = {
    Authorization: "Basic SHJtcyBBcHAgVXNlcjpBbHRyb2Nrc0AxMjM=", // Ensure "Basic " prefix
};

export const AlertMsg = {
    SessionExpird: 'Your session has expired. Please log in again.',
    UnableToConnectToServer: 'The application was unable to process request. Please try again later.',
    ServerUnhandledRequest: 'Service is temporarily unavailable.',
}