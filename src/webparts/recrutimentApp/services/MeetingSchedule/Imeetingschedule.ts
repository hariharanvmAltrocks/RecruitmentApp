import { ApiResponse } from "../../models/apimodels";
import { ICreateMeeting, IFetchMeeting, IRoom } from "../AxiosService/axiosConfig";

export type IMeetingShedule = {
    fetchRooms(): Promise<ApiResponse<IRoom[]>>;
    fetchMeetings(data: IFetchMeeting): Promise<ApiResponse<any[]>>;
    createMeeting (data: ICreateMeeting): Promise<ApiResponse<string>>;
};