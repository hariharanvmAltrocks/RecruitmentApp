import { ApiResponse } from "../../models/apimodels";
import { getQuestionById, UpsertQuestions } from "../../models/Icareerportal";
import { ViewQuestion } from "../CareerPortal/ICareerPortal";

export type IQuestionCreation = {
    GetQuestionaireByScope(GetExistingQuestion: getQuestionById): Promise<ApiResponse<ViewQuestion[] | null>>;
    UpsertQuestions(data: UpsertQuestions[]): Promise<ApiResponse<any | null>>
};