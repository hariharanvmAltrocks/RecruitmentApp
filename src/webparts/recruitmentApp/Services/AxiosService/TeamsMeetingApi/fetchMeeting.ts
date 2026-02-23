
import axios from "axios";
import { IFetchMeeting } from "../axiosConfig";

const MeetingUrl = localStorage.getItem("MeetingUrl") ?? "";
const MeetingCode = localStorage.getItem("MeetingCode") ?? "";


const MeetingsAxiosInstance = axios.create({
    baseURL: MeetingUrl,
    timeout: 60000,
    headers: {
        Accept: "application/json",
    },
});



export const fetchMeetings = async (data: IFetchMeeting): Promise<ApiResponse<string>> => {
    try {
        let AvailableMeeting = data.Email.map(async (item) => {
            //     const api_url_meetings =
            //         `https://dcsdocumentprocessing-a6etdefvdffedrhf.southindia-01.azurewebsites.net/api/GetMeetings` +
            //         `?code=KvQiqUR0tceLcVt2iFcxqFz5Q1H19zNcHNkCVbuJTgQYAzFuEQx5vA==` +
            //         `&user=${encodeURIComponent(item)}` +
            //         `&start=${data.startDate}` +
            //         `&end=${data.endDate}`;

            //     const response = await fetch(api_url_meetings, {
            //         method: "GET",
            //         headers: { "Accept": "application/json" }
            //     });
            let response = await MeetingsAxiosInstance.get(
                `/api/GetMeetings`,
                {
                    params: {
                        code: MeetingCode,  //"G0r2jGUElBdacIOZfcoGxFid_Hu4ReaypulXOIy5oaneAzFuR_0-9g==",
                        user: item,
                        start: data.startDate,
                        end: data.endDate,
                    },
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            return response;
        })

        console.log(AvailableMeeting, "AvailableMeeting");
        return {
            data: "",
            status: 200,
            message: "GetMeeting fetched successfully",
        };
    } catch (error) {
        console.error("Failed to fetch meetings", error);
        return {
            data: "",
            status: 500,
            message: "Error fetching data from GetRoom",
        };
    }
};

