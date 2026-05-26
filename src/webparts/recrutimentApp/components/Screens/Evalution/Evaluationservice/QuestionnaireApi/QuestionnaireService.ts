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
    const response = await AxiosInstance.post(
      `/hrms/UpsertQuestions`,
      params
    );

    return response;
  },

  GetQuestionnaire: async function (jobCode: string) {
    const response = await AxiosInstance.get(
      `/hrms/GetInterviewPanelQuestionsByJobCode?jobCode=${jobCode}`
    );
    return response;
  },

  GetQuestionaireByScope: async function (params: getQuestionById) {
    const response = await AxiosInstance.post(
      `/hrms/GetQuestionsBank`,
      params
    );
    return response;
  },
};