import { evaluationService } from '../../SelectionProcess/services/EvaluationApiService';
import type { EvaluationPayload } from '../State/CommonStateManagement';


export async function handleSubmitEvaluation(
  payload: EvaluationPayload,
  roleId: number
): Promise<{ success: boolean; message: string }> {
  console.log('[handleSubmitEvaluation] start', { payload, roleId });
  const { candidate, answers, scorecard, recommendation, overallFeedback } = payload;

  console.log('[handleSubmitEvaluation] candidate details', {
    currentUserPanelId: candidate.currentUserPanelId,
    currentUserGuid: candidate.currentUserGuid,
    recruitmentId: candidate.recruitmentId,
  });

  if (!candidate.currentUserPanelId) {
    return {
      success: false,
      message: 'Could not identify your panel entry. Please contact HR.',
    };
  }

  const spPayload = {
    RecruitmentIDId: candidate.recruitmentId,
    Qualifications:  scorecard.Qualifications,
    Experience:      scorecard.Experience,
    Knowledge:       scorecard.Knowledge,
    EnergyLevel:     scorecard.EnergyLevel,
    JobRequirements: scorecard.JobRequirements,
    CultureFit:      scorecard.CultureFit,
    ExpatLocal:      scorecard.ExpatLocal,
    OtherCriteria:   scorecard.OtherCriteria,
    Recommendation:
      recommendation === 'consider' ? 'Consider for Employment' : 'Do Not Consider',
    OverallFeedback: overallFeedback,
    QuestionScores: JSON.stringify(
      Object.values(answers).map((a) => ({ id: a.questionId, rating: a.rating }))
    ),
  };

  console.log('[handleSubmitEvaluation] payload-ready', {spPayload});
  const result = await evaluationService.submitScorecard(
    spPayload,
    candidate.currentUserPanelId,
    roleId,
    candidate.currentUserGuid || ''
  );
  console.log('[handleSubmitEvaluation] result', result);
  return result;
}