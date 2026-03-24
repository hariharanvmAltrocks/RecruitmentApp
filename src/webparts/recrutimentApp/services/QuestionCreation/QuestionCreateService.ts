import { ApiResponse } from "../../models/apimodels";
import { getQuestionById, UpsertQuestions } from "../../models/Icareerportal";
import { DataType } from "../../utilities/ConditionConfig";
import { QuestionnaireApi } from "../AxiosService/CareerPortalAPI";
import { ViewQuestion } from "../CareerPortal/ICareerPortal";
import { CareerPotalServices } from "../ServiceExport";
import { IQuestionCreation } from "./IQuestionCreation";

export default class QuestionCreateService implements IQuestionCreation {

   async GetQuestionaireByScope(
  GetExistingQuestion: getQuestionById
): Promise<ApiResponse<ViewQuestion[] | null>> {
  try {
    const serviceResponse  = await CareerPotalServices.GetQuestionaireByScope(GetExistingQuestion);

     const rawData: any[] = (serviceResponse as any)?.data?.data ?? [];
    if (!rawData?.length) {
      return { data: [], status: serviceResponse?.status ?? 200, message: "Get Candidate details" };
    }

    const GetQuestionnaire: ViewQuestion[] = rawData.reduce(
      (acc: ViewQuestion[], item: any, index: number) => {
        const q = item?.question;
        const content = q?.quesContent;

        const question = content?.contentEn;
        const expectedAnswer = q?.questionXAnswers;
        if (!question || !expectedAnswer?.length) return acc;

        const incrementedIndex = index + 1;

        const mappedAnswers = expectedAnswer.map((ans: any, i: number) => ({
          key: i,
          text: ans?.optContent?.contentEn,
          textFr: ans?.optContent?.contentFr,
          isCorrect: false,
        }));

        const options = q?.questionXOptions?.map((opt: any) => ({
          key: opt?.questionId,
          text: opt?.optContent?.contentEn,
          textFr: opt?.optContent?.contentFr,
          isCorrect: false,
        })) ?? [];

        acc.push({
          id: incrementedIndex,
          Checked: false,
          header: `Q${incrementedIndex}`,
          HeaderLabel: `Question${incrementedIndex}`,
          discipline: q?.scopeId,
          scope: q?.questionType?.displayText,
          questionType: q?.questionTypeId,
          question,
          questionFr: content?.contentFr,
          expectedAnswer: mappedAnswers.map((a: any) => a.text),
          expectedAnswerFr: mappedAnswers.map((a: any) => a.textFr),
          CareerportalAnswer: mappedAnswers,
          options,
          Disqualification: q?.isQualifier,
          Type: DataType.Existing,
          createdBy: item.createdBy
        });

        return acc;
      },
      []
    );

    return {
      data: GetQuestionnaire,
      status: serviceResponse.status,
      message: "Get Candidate details",
    };
  } catch (error) {
    console.error("Error Get Candidate details:", error);
    return { data: [], status: 500, message: "Error Get Candidate details" };
  }
}

 async UpsertQuestions(data: UpsertQuestions[]): Promise<ApiResponse<any | null>> {
    try {
      let UpsertQuestions: UpsertQuestions[] = data.map((item) => ({
        questionEn: item.questionEn,
        questionFr: item.questionFr,
        scopeId: item.scopeId,
        categoryId: item.categoryId,
        questionTypeId: item.questionTypeId,
        isQualifier: item.isQualifier,
        isAnswerValidate: item.isAnswerValidate,
        sequence: item.sequence,
        jobCode: item.jobCode,
        options: item.options,
        answers: item.answers,
        createdBy: item.createdBy,
      }));

      const response = await QuestionnaireApi.PostQuestionnaire(UpsertQuestions);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

}