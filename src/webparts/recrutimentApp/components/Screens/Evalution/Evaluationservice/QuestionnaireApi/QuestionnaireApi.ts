import { ApiResponse } from "../../../../../models/apimodels";
import { IQuestionnaireApi, QuestionItem } from "./IQuestionnaireApi";
import { QuestionnaireService } from "./QuestionnaireService";


export default class QuestionnaireApi implements IQuestionnaireApi {
  async getQuestionnaire(jobCode: string): Promise<ApiResponse<QuestionItem[] | null>> {
    try {
      const response = await QuestionnaireService.GetQuestionnaire(jobCode);

      const GetQuestionnaire: QuestionItem[] = response.data.data.map(
        (item: any, index: number) => {
          const incrementedIndex = index + 1;

          return {
            id: incrementedIndex,
            question: item?.question?.quesContent?.contentEn,
            answer: item?.question?.questionXAnswers?.[0]?.optContent?.contentEn ?? "",
            rating: 0,
            header: "Q" + incrementedIndex,
          };
        }
      );

      return {
        data: GetQuestionnaire,
        status: response.status,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error("Error Get Candidate details:", error);

      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }
}