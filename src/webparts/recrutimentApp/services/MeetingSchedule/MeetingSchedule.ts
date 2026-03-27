import axios from "axios";
import { ApiResponse } from "../../models/apimodels";
import { ICreateMeeting, IFetchMeeting, IRoom } from "../AxiosService/axiosConfig";
import { IMeetingShedule } from "./Imeetingschedule";
import { ResponeStatus } from "../../utilities/ApiConfig";

const MeetingUrl = localStorage.getItem("MeetingUrl") ?? "";
const MeetingCode = localStorage.getItem("MeetingCode") ?? "";

const MeetingsAxiosInstance = axios.create({
    baseURL: MeetingUrl,
    timeout: 60000,
    headers: {
        Accept: "application/json",
    },
});

export default class MeetingSchdule implements IMeetingShedule { 

    async fetchRooms(): Promise<ApiResponse<IRoom[]>> {
      try {
        let data: IRoom[] = []
        const response = await MeetingsAxiosInstance.get(
            `api/GetRooms`,
            {
                params: {
                    code: MeetingCode,
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
        console.error("Error Get Candidate details:", error);
        return { data: [], status: 500, message: "Error Get Candidate details" };
      }
    }
    
   async fetchMeetings(data: IFetchMeeting): Promise<ApiResponse<any[]>> {
  try {
    const responses = await Promise.all(
      data.Email.map(async (item) => {
        return MeetingsAxiosInstance.get(`/api/GetMeetings`, {
          params: {
            code: MeetingCode,
            user: item,
            start: data.startDate,
            end: data.endDate,
          },
          headers: {
            Accept: "application/json",
          },
        });
      })
    );

    const AvailableMeeting = responses.map(res => res.data);

    return {
      data: AvailableMeeting,
      status: 200,
      message: "GetMeeting fetched successfully",
    };

  } catch (error) {
    console.error("Failed to fetch meetings", error);
    return {
      data: [],
      status: 500,
      message: "Error fetching data from GetRoom",
    };
  }
}

    async createMeeting  (data: ICreateMeeting): Promise<ApiResponse<string>> {
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

        console.log(response, "CreateMeetingResponse");
        return {
            data: response.ok ? await response.json() : "",
            status: response.status,
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
    }

}