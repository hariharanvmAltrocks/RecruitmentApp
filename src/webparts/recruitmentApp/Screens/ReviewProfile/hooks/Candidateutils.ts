
export const splitDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString();
};


export const addWeekdays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
};

/**
 * Convert a local Date to UTC ISO string for API payloads.
 */
export const convertUtc = (date: Date): string => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  ).toISOString();
};

/**
 * Build the interview object for reschedule API calls.
 */
export interface InterviewRescheduleObj {
  ID: number;
  InterviewDate: string;
  InterviewTime: string;
  InterviewLink: string;
  InterviewDateLevel2?: string;
  InterviewTimeLevel2?: string;
  InterviewLinkLevel2?: string;
  ActionId?: number;
  ItemCreated?: string;
}

export const buildInterviewRescheduleObj = (params: {
  isLevel2Pending: boolean;
  isScheduledL1: boolean;
  candidateID: string;
  startDateL1: Date | undefined;
  endDateL1: Date | undefined;
  startDateL2: Date | undefined;
  endDateL2: Date | undefined;
  roomDataKey: string | number;
  roomDateL2Key: string | number;
  workflowApproved: number;
  isAssignInterview: boolean;
  initialTab: string;
  assignInterviewTab: string;
  choicesYes: string;
}): InterviewRescheduleObj => {
  const {
    isLevel2Pending, isScheduledL1,
    candidateID,
    startDateL1, endDateL1, startDateL2, endDateL2,
    roomDataKey, roomDateL2Key,
    workflowApproved, isAssignInterview, initialTab, assignInterviewTab, choicesYes,
  } = params;
  console.log(isAssignInterview,"isAssignInterview");
  

  const useLevel2 = isLevel2Pending || !isScheduledL1;
  const startRaw = useLevel2 ? startDateL2 : startDateL1;
  const endRaw = useLevel2 ? endDateL2 : endDateL1;
  const roomKey = useLevel2 ? roomDateL2Key : roomDataKey;

  const obj: InterviewRescheduleObj = {
    ID: Number(candidateID),
    InterviewDate: splitDateOnly(startRaw ?? new Date()),
    InterviewTime: splitDateOnly(endRaw ?? new Date()),
    InterviewLink: String(roomKey ?? ""),
  };

  if (useLevel2) {
    obj.InterviewDateLevel2 = obj.InterviewDate;
    obj.InterviewTimeLevel2 = obj.InterviewTime;
    obj.InterviewLinkLevel2 = obj.InterviewLink;
  }

  if (isLevel2Pending && initialTab === assignInterviewTab) {
    obj.ActionId = workflowApproved;
    obj.ItemCreated = choicesYes;
  }

  return obj;
};