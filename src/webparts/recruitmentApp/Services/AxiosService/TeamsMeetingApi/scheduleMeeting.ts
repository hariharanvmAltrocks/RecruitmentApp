
import { ICreateMeeting } from "../axiosConfig";

const MeetingUrl = localStorage.getItem("MeetingUrl") ?? "";
const MeetingCode = localStorage.getItem("MeetingCode") ?? "";


// const MeetingsAxiosInstance = axios.create({
//     baseURL: MeetingUrl,
//     timeout: 60000,
//     headers: {
//         Accept: "application/json",
//     },
// });


export const createMeeting = async (data: ICreateMeeting): Promise<ApiResponse<string>> => {
    try {

        const apiUrl = `${MeetingUrl}/api/CreateMeeting?code=${MeetingCode}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // let response = await MeetingsAxiosInstance.post(
        //     `/api/CreateMeeting?code=${MeetingCode}`,
        //     {
        //         params: {
        //             code: MeetingCode,  //"G0r2jGUElBdacIOZfcoGxFid_Hu4ReaypulXOIy5oaneAzFuR_0-9g==",
        //         },
        //         headers: {
        //             "Accept": "application/json",
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(data),
        //     }
        // );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return {
            data: "",
            status: 500,
            message: "Meeting created successfully",
        };
    } catch (error) {
        console.error("Failed to create meeting", error);
        return {
            data: "",
            status: 500,
            message: "Error creating meeting",
        };
    }
};

