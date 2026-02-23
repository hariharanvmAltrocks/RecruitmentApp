import axios from "axios";
import { IRoom } from "../axiosConfig";
import { ResponeStatus } from "../../../utilities/Config";
const MeetingUrl = localStorage.getItem("MeetingUrl") ?? "";
const MeetingCode = localStorage.getItem("MeetingCode") ?? "";


const MeetingsAxiosInstance = axios.create({
    baseURL: MeetingUrl,
    timeout: 60000,
    headers: {
        Accept: "application/json",
    },
});

export const fetchRooms = async (): Promise<ApiResponse<IRoom[]>> => {
    try {
        let data: IRoom[] = []
        const response = await MeetingsAxiosInstance.get(
            `api/GetRooms`,
            {
                params: {
                    code: MeetingCode,  //"G0r2jGUElBdacIOZfcoGxFid_Hu4ReaypulXOIy5oaneAzFuR_0-9g==",
                },
                headers: {
                    Accept: "application/json",
                },
            }
        );
        if (response.status === ResponeStatus.SUCCESS) {
            let res = response.data?.value
            let availableRoom = res.map((item: any) => {
                return {
                    id: item.id,
                    RoomName: item.displayName,
                    RoomEmailId: item.emailAddress,
                    bookingType: item.bookingType
                }
            })
            data = availableRoom

        }
        return {
            data: data,
            status: response.status,
            message: "GetRoom fetched successfully",
        };
    } catch (error) {
        console.error("Failed to fetch meetings", error);
        return {
            data: [],
            status: 500,
            message: "Error fetching data from GetRoom",
        };
    }
};
