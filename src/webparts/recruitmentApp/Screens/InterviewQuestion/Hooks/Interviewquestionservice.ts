import { GetPortalJobsService, getVRRDetails } from "../../../Services/ServiceExport";
import SPServices from "../../../Services/SPService/SPServices";
import { CategoryID, CatogryOptionCode, DataType, displayTextOptionCode, ListNames, ResponeStatus, RoleID } from "../../../utilities/Config";
import { QuestionCreatedBy } from "../../../utilities/LabelName";
import { AutoCompleteItem, GetQuestionByIdPayload, MasterOption, UpsertQuestionsPayload, ViewQuestion } from "./Interviewtypes";
import { encodeBase64 } from "./Questionutils";


export async function fetchMasterData(
  catogry: string,
  departments: any[],
): Promise<MasterOption> {
  const [CategoryData, QuestionType] = await Promise.all([
    GetPortalJobsService.GetAllMaster(CategoryID.QuestionCategory),
    GetPortalJobsService.GetAllMaster(CategoryID.QuestionType),
  ]);

  if (CategoryData.status !== ResponeStatus.SUCCESS) {
    throw new Error("Failed to fetch category data");
  }

  const category: AutoCompleteItem[] = (CategoryData.data ?? []).map(
    (opt: any) => ({ key: opt.value, text: opt.displayText }),
  );

  const ScopeOption: AutoCompleteItem[] = (departments ?? []).map(
    (opt: any) => ({ key: opt.code, text: opt.text }),
  );

  const QueType: AutoCompleteItem[] = (QuestionType.data ?? [])
    .filter((opt: any) => {
      if (catogry === CatogryOptionCode.InterviewPanel)
        return opt.displayText === displayTextOptionCode.CustomAnswer;
      if (catogry === CatogryOptionCode.CareerPortalCandidate)
        return (
          opt.displayText === displayTextOptionCode.MultiAnswer ||
          opt.displayText === displayTextOptionCode.SingleAnswer
        );
      return false;
    })
    .map((opt: any) => ({ key: opt.value, text: opt.displayText }));

  return {
    category,
    categoryOption: category.map((c) => c.text),
    ScopeOption,
    QueType,
  };
}

export async function fetchQuestionnaire(
  payload: GetQuestionByIdPayload,
): Promise<ViewQuestion[]> {
  const res = await GetPortalJobsService.GetQuestionaireByScope(payload);
  if (res.status !== ResponeStatus.SUCCESS) {
    throw new Error("Failed to fetch questionnaire");
  }
  return res.data ?? [];
}


export async function fetchJobUniqueKey(jobCodeID: string): Promise<string> {
  const filter = [
    { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
    { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
  ];
  const result = await getVRRDetails.GetJobUniqueDataValue(filter, "and");
  return result.data[0]?.JobUniqueKey ?? "";
}


export async function submitQuestions(
  questions: UpsertQuestionsPayload[],
): Promise<void> {
  const response = await GetPortalJobsService.UpsertQuestions(questions);
  if (response.status !== ResponeStatus.SUCCESS) {
    throw new Error("Failed to submit questions");
  }
}

export async function updateWorkflowItem(
  id: number,
  payload: Record<string, any>,
): Promise<void> {
  await SPServices.SPUpdateItem({
    Listname: ListNames.HRMSRecruitmentDptDetails,
    RequestJSON: payload,
    ID: id,
  });
}


export function buildQuestionsPayload(
  questionnaire: ViewQuestion[],
  category: AutoCompleteItem | undefined,
  catogry: string,
  jobCode: string,
  currentRoleID: number[],
): UpsertQuestionsPayload[] {
  return questionnaire.map((item) => {
    const isCareerPortal =
      category?.text === CatogryOptionCode.CareerPortalCandidate;
    const isExisting = item.Type === DataType.Existing;

    const options = isCareerPortal
      ? (item.options ?? []).map((opt, i) => ({
          optionEn: encodeBase64(opt.text),
          optionFr: encodeBase64(opt.textFr ?? opt.text),
          sequence: i + 1,
        }))
      : [
          {
            optionEn: encodeBase64(
              isExisting
                ? (item.expectedAnswer as any)[0]
                : item.expectedAnswer,
            ),
            optionFr: encodeBase64(
              isExisting
                ? (item.expectedAnswer as any)[0]
                : item.expectedAnswer,
            ),
            sequence: 1,
          },
        ];

    const answers = isCareerPortal
      ? (item.CareerportalAnswer ?? []).map((ans) => ({
          optionEn: encodeBase64(ans.text),
          optionFr: encodeBase64(ans.textFr ?? ans.text),
        }))
      : [
          {
            optionEn: encodeBase64(
              isExisting
                ? (item.expectedAnswer as any)[0]
                : item.expectedAnswer,
            ),
            optionFr: encodeBase64(
              isExisting
                ? (item.expectedAnswerFr as any)?.[0]
                : item.expectedAnswerFr ?? item.expectedAnswer,
            ),
          },
        ];

    return {
      questionEn: encodeBase64(item.question),
      questionFr: encodeBase64(item.questionFr ?? item.question),
      scopeId: isExisting
        ? String(item.discipline)
        : String((item.discipline as AutoCompleteItem).key),
      categoryId: String(category?.key),
      questionTypeId: isExisting
        ? String(item.questionType)
        : String((item.questionType as AutoCompleteItem).key),
      isQualifier: catogry === CatogryOptionCode.CareerPortalCandidate ? 1 : 0,
      isAnswerValidate: item.Disqualification === "No" ? 0 : 1,
      sequence: item.id,
      jobCode,
      options,
      answers,
      createdBy: currentRoleID.includes(RoleID.LineManager)
        ? QuestionCreatedBy.LM
        : QuestionCreatedBy.HR,
    };
  });
}