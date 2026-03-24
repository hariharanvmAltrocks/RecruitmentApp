import type { EvaluationPayload } from '../State/CommonStateManagement';

export interface SubmitResult {
  success: boolean;
  message: string;
}

export interface IEvaluationSubmitService {
  submitEvaluation: (payload: EvaluationPayload) => Promise<void>;
}

const defaultService: IEvaluationSubmitService = {
  submitEvaluation: async () => {
    await wait(300);
  }
};

export async function handleSubmitEvaluation(
  payload: EvaluationPayload,
  service: IEvaluationSubmitService = defaultService
): Promise<SubmitResult> {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    return { success: false, message: validation.message };
  }

  try {
    await service.submitEvaluation(payload);
    return { success: true, message: 'Evaluation submitted successfully.' };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unable to submit evaluation.'
    };
  }
}

function validatePayload(payload: EvaluationPayload): { isValid: boolean; message: string } {
  if (!payload.candidate) {
    return { isValid: false, message: 'Candidate information is missing.' };
  }

  const answers = Object.values(payload.answers);
  if (answers.length === 0) {
    return { isValid: false, message: 'Please answer all interview questions.' };
  }

  const missingRating = answers.some((answer) => answer.rating === null);
  if (missingRating) {
    return { isValid: false, message: 'Please provide ratings for all questions.' };
  }

  return { isValid: true, message: '' };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
