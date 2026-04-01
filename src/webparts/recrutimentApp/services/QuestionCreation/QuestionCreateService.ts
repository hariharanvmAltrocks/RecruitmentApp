import { ApiResponse } from "../../models/apimodels";
import { getQuestionById, UpsertQuestions } from "../../models/Icareerportal";
import { DataType } from "../../utilities/ConditionConfig";
import { QuestionnaireApi } from "../AxiosService/CareerPortalAPI";
import { ViewQuestion } from "../CareerPortal/ICareerPortal";
import { stripHtml } from "../RecruitmentTable/IRecruitmentService";
import { CareerPotalServices } from "../ServiceExport";
import { IQuestionCreation } from "./IQuestionCreation";

export default class QuestionCreateService implements IQuestionCreation {

  async GetQuestionaireByScope(
    GetExistingQuestion: getQuestionById
  ): Promise<ApiResponse<ViewQuestion[] | null>> {
    try {
      const response = await QuestionnaireApi.GetQuestionaireByScope(GetExistingQuestion);
      const GetQuestionnaire: ViewQuestion[] = response.data.data.map((item: any, index: number) => {
        const incrementedIndex = index + 1;

        const question = stripHtml(item?.question?.quesContent?.contentEn);
        const questionFr = stripHtml(item?.question?.quesContent?.contentFr);
        const expectedAnswer = item?.question?.questionXAnswers.map((item: any) => stripHtml(item?.optContent?.contentEn));
        const expectedAnswerFr = item?.question?.questionXAnswers.map((item: any) => stripHtml(item?.optContent?.contentFr));

        if (!question || !expectedAnswer) {
          return null;
        }

        const options = item?.question?.questionXOptions.map((item: any) => {
          return {
            key: item?.questionId,
            text: stripHtml(item?.optContent?.contentEn),
            textFr: stripHtml(item?.optContent?.contentFr),
            isCorrect: false,
          };
        });

        const CareerportalAnswer = item?.question?.questionXAnswers?.map((item: any, index: number) => {
          return {
            key: index,
            text: stripHtml(item?.optContent?.contentEn),
            textFr: stripHtml(item?.optContent?.contentFr),
            isCorrect: false,
          };
        });

        return {
          id: incrementedIndex,
          Checked: false,
          header: "Q" + incrementedIndex,
          HeaderLabel: "Question" + incrementedIndex,
          discipline: item?.question?.scopeId,
          scope: item?.question?.questionType?.displayText,
          questionType: item?.question?.questionTypeId,
          question: question,
          questionFr: questionFr,
          expectedAnswer: expectedAnswer,
          expectedAnswerFr: expectedAnswerFr,
          CareerportalAnswer: CareerportalAnswer,
          options: options,
          Disqualification: item?.question?.isQualifier,
          Type: DataType.Existing,
        };
      }).filter((item: null) => item !== null);

      return {
        data: GetQuestionnaire,
        status: response.status,
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