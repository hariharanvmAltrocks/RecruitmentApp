export type QuestionItem = {
  id: number;
  question: string;
  answer: string;
  rating: number | null;
  header?: string;
};
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    totalRecords?:number;
}
export type IQuestionnaireApi = {
 
    getQuestionnaire(JobCode: string): Promise<ApiResponse<QuestionItem[] | null>>;
}