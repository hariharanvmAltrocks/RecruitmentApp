import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AlertMsg, ApiUrl, AuthorizationHeader } from "./axiosConfig";
// import { AlertMsg, AuthorizationHeader } from "./axiosConfig";

const AxiosInstance = axios.create({
  baseURL: ApiUrl,
  timeout: 10000
})

AxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      // const { setToken } = useToken();

      //  Handle Unauthorized (401) errors 
      if (status === 401) {
        try {
          // setToken(null);
          localStorage.removeItem('access_token')
          const response = await axios.post(ApiUrl +
            `/InternalSignIn`,
            { headers: { ...AuthorizationHeader } }
          ).then((response) => {
            localStorage.setItem('access_token', response.data.token)
            // setToken(response.data.token);
          })
            .catch((error) => {
              console.error('Error:', error);
            });
          console.log(response);

        } catch (error) {
          console.error("Token refresh failed", error);
        }
      } else if (status >= 500) {
        console.log(AlertMsg.UnableToConnectToServer);
      } else if (status === 400) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // const { token, setToken } = useToken();
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const tokenParts = token.split(".");
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        const tokenExpiration = tokenPayload.exp * 1000;

        console.log("tokenExpiration", tokenExpiration);

        //  Refresh token if expired
        if (Date.now() > tokenExpiration) {
          const response = await axios.post<{ token: string }>(
            `${ApiUrl}/InternalSignIn`,
            { AccessToken: token }
          );
          localStorage.setItem('access_token', response.data.token)
          // setToken(response.data.token);
          config.headers.Authorization = `Bearer ${response.data.token}`;
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error(error);
        throw new Error("Refresh failed");
      }
    } else {
      console.log("Token Doesn't get");

    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default AxiosInstance;
