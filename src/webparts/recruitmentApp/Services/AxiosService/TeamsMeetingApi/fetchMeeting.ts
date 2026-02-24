
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

            let response = await MeetingsAxiosInstance.get(
                `/api/GetMeetings`,
                {
                    params: {
                        code: MeetingCode,
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

