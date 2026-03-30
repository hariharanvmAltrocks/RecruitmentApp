"use strict";
// import ReviewScoreCardServices, { SubmitScorecardParams } from '../ReviewScoreCardServies/ReviewScoreCardServices';
// export async function handleSubmitReviewScoreCard(
//   payload: SubmitScorecardParams,
//   setSubmitting: (b: boolean) => void,
//   setAlertMsg: (msg: string) => void,
//   setAlertType: (type: 'success' | 'error' | '') => void,
//   onSuccess?: () => void
// ) {
//   setSubmitting(true);
//   try {
//     const result = await ReviewScoreCardServices.submitScorecard(payload);
//     if (result.success) {
//       setAlertMsg(result.message);
//       setAlertType('success');
//       if (onSuccess) onSuccess();
//     } else {
//       setAlertMsg(result.message);
//       setAlertType('error');
//     }
//   } catch (err) {
//     setAlertMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
//     setAlertType('error');
//   } finally {
//     setSubmitting(false);
//   }
// }
//# sourceMappingURL=handleSubmitReviewScoreCard.js.map