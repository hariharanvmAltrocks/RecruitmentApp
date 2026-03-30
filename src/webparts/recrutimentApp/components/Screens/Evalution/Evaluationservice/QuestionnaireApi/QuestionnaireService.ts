import { AuthorizationHeader } from "../../../../../services/AxiosService/axiosConfig";
import AxiosInstance from "../../../../../services/AxiosService/AxiosService";


export type UpsertQuestions = {
  questionEn: string;
  questionFr: string;
  scopeId: string;
  categoryId: string;
  questionTypeId: string;
  isQualifier: number;
  isAnswerValidate: number;
  sequence: number;
  jobCode: string;
  options: optionsValue[];
  answers: answersValue[];
  createdBy: string;
};

export type optionsValue = {
  optionEn: string;
  optionFr: string;
  sequence: number;
};

export type answersValue = {
  optionEn: string;
  optionFr: string;
};

export type getQuestionById = {
  discipline: string;
  category?: string;
  createdBy: string;
};

export const InternalSign = {
  InternalSignIn: async function () {
    return await AxiosInstance.post(
      `/hrms/InternalSignIn`,
      {},
      AuthorizationHeader
    );
  },
};

export const QuestionnaireService = {
  PostQuestionnaire: async function (params: UpsertQuestions[]) {
    console.log("[QuestionnaireService] PostQuestionnaire request:", params);

    const response = await AxiosInstance.post(
      `/hrms/UpsertQuestions`,
      params
    );

    console.log("[QuestionnaireService] PostQuestionnaire response:", response);

    return response;
  },

  GetQuestionnaire: async function (jobCode: string) {
    console.log("[QuestionnaireService] GetQuestionnaire request:", jobCode);

    const response = await AxiosInstance.get(
      `/hrms/GetInterviewPanelQuestionsByJobCode?jobCode=${jobCode}`
    );

    console.log("[QuestionnaireService] GetQuestionnaire response:", response);

    return response;
  },

  GetQuestionaireByScope: async function (params: getQuestionById) {
    console.log("[QuestionnaireService] GetQuestionaireByScope request:", params);

    const response = await AxiosInstance.post(
      `/hrms/GetQuestionsBank`,
      params
    );

    console.log("[QuestionnaireService] GetQuestionaireByScope response:", response);

    return response;
  },
};