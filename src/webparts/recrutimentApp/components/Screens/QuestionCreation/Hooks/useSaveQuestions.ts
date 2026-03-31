import { useState, useCallback } from "react";
import { Question, QuestionMode, SaveQuestionsPayload } from "../QuestionCreation.types";
import { masterService, QuestionService } from "../../../../services/ServiceExport";
import { UpsertQuestions } from "../../../../models/Icareerportal";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { ListNames, RoleID } from "../../../../utilities/Config";
import { QuestionCreatedBy } from "../../../../utilities/ConditionConfig";
import SPServices from "../../../../services/SPService/spservice";
import { WorkflowConfig } from "../../../Hooks/WorkflowConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";

interface UseSaveQuestionsResult {
  saving: boolean;
  error: string | null;
  save: (payload: SaveQuestionsPayload) => Promise<boolean>;
}

const decodeBase64 = (str: string): string => {
  const utf8Bytes: any = new TextEncoder().encode(str);
  const binary = String.fromCharCode(...utf8Bytes);
  return btoa(binary);
}

// const decodeBase64 = (str: string): string => {
//     try {
//         return atob(str);
//     } catch (e) {
//         console.error("Invalid Base64 string:", str);
//         return str; // fallback
//     }
// };

async function transformToUpsertPayload(
  payload: SaveQuestionsPayload,
  userId: string
): Promise<UpsertQuestions[]> {

  const jobCodeKey = await masterService.GetJobUniqueDataValue(
    payload.JobCodeId ?? 0
  );

  const isCareerPortal = payload.mode === "careerPortal" ? true : false;

  const categoryID = payload.mode === "careerPortal" ? "C1" : "C2";

  return payload.questions.map((q, index) => {
    const questionType = q.type === "single" ? "QT1" : q.type === "multiple" ? "QT2" : q.type === "interview" ? "QT3" : "";

    return {
      questionEn: decodeBase64(q.questionEn),
      questionFr: decodeBase64(q.questionFr),

      scopeId: payload.DptCode ?? "",
      categoryId: categoryID ?? "",

      questionTypeId: questionType,

      isQualifier: 1,
      isAnswerValidate: 0,

      sequence: index + 1,
      jobCode: jobCodeKey.data.JobCode ?? "",

      options: isCareerPortal
        ? q.options.map((o, i) => ({
          optionEn: decodeBase64(o.textEn),
          optionFr: decodeBase64(o.textFr),
          sequence: i + 1,
        }))
        : [
          {
            optionEn: decodeBase64(q.answerEn ?? ""),
            optionFr: decodeBase64(q.answerFr ?? ""),
            sequence: 1,
          },
        ],

      answers: isCareerPortal
        ? q.options
          .filter((o) => o.isCorrect)
          .map((o) => ({
            optionEn: decodeBase64(o.textEn),
            optionFr: decodeBase64(o.textFr),
          }))
        : [
          {
            optionEn: decodeBase64(q.answerEn ?? ""),
            optionFr: decodeBase64(q.answerFr ?? ""),
          },
        ],

      createdBy: userId,
    };
  });
}


export const useSaveQuestions = (): UseSaveQuestionsResult => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { roleIDs } = userInfo();
  const { MatricID } = useUIState();

  const save = useCallback(
    async (payload: SaveQuestionsPayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const userId = roleIDs.includes(RoleID.RecruitmentHR)
          ? QuestionCreatedBy.HR
          : QuestionCreatedBy.LM;

        const upsertPayload = await transformToUpsertPayload(payload, userId);

        const response = await QuestionService.UpsertQuestions(upsertPayload);

        if (response.status !== ResponeStatus.SUCCESS) {
          throw new Error("Failed to save questions");
        }

        let updatePayload: any = {};

        if (payload.mode === "careerPortal") {
          let StatusID = WorkflowConfig(MatricID);

          updatePayload = {
            StatusId: StatusID,
            // ItemCreated: "Yes",
          };
        } else {
          updatePayload =
            userId === QuestionCreatedBy.LM
              ? { QuestionByHR: "Yes" }
              : { QuestionByLM: "Yes" };
        }

        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentDptDetails,
          RequestJSON: updatePayload,
          ID: Number(payload.positionId),
        });

        return true;
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Unknown error saving questions");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [roleIDs]
  );

  return { saving, error, save };
};


function buildCareerPortalPayload(payload: SaveQuestionsPayload) {
  return {
    positionId: payload.positionId,
    mode: "careerPortal",
    JobCodeId: payload?.JobCodeId,
    DptCode: payload?.DptCode,
    criteria: payload.questions.map((q) => ({
      type: "C1",
      questionEn: q.questionEn,
      questionFr: q.questionFr,
      questionType: q.type,
      fromBank: q.fromBank,
      sourceId: q.fromBank ? q.id : null,
      options: q.options.map((o) => ({
        textEn: o.textEn,
        textFr: o.textFr,
        isCorrect: o.isCorrect,
      })),
    })),
  };
}

function buildInterviewPayload(payload: SaveQuestionsPayload) {
  return {
    positionId: payload.positionId,
    mode: "interview",
    JobCodeId: payload?.JobCodeId,
    DptCode: payload?.DptCode,
    questions: payload.questions.map((q) => ({
      type: "C2",
      questionEn: q.questionEn,
      questionFr: q.questionFr,
      answerEn: q.answerEn ?? "",
      answerFr: q.answerFr ?? "",
      fromBank: q.fromBank,
      sourceId: q.fromBank ? q.id : null,
    })),
  };
}