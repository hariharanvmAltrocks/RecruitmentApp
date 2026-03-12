import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AlertMsg, AuthorizationHeader } from "./axiosConfig";
import { getToken, setToken } from "./TokenContext";


const ApiUrls = localStorage.getItem("CareerPortalLink") ?? "";
const AxiosInstance = axios.create({
  baseURL: ApiUrls,
  timeout: 10000000
});

AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getToken();
    if (token) {
      try {
        const tokenParts = token.split(".");
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const tokenExpiration = tokenPayload.exp * 1000;

        // if (Date.now() > tokenExpiration) {
        const res = await axios.post<{ tokens: { jwtToken: string } }>(
          `${ApiUrls}/hrms/InternalSignIn`,
          {},
          AuthorizationHeader
        );

        token = res?.data?.tokens?.jwtToken;
        setToken(token);
        // }

        // config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Token Refresh Failed:", error);
        throw new Error("Token refresh failed");
      }
    } else {
      console.warn("No token available, request may fail.");
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    console.log("AXIOSAPIError:", error);
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized request. Attempting token refresh...");
        try {
          const res = await axios.post<{ data: { tokens: { jwtToken: string } }, code: number }>(
            `${ApiUrls}/hrms/InternalSignIn`,
            {},
            AuthorizationHeader
          );

          const newToken = res.data?.data?.tokens?.jwtToken;
          if (newToken) {
            setToken(newToken);
          }

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return AxiosInstance.request(error.config);
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          return Promise.reject(refreshError);
        }
      } else if (status >= 500) {
        console.error(AlertMsg.UnableToConnectToServer);
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
