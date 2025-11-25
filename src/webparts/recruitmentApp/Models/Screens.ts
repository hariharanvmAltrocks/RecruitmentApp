export type AutoCompleteItem = {
  key: number;
  text: string;
};

export type InterviewPanelItem = {
  key: number;
  text: string;
  Role: string;
  Levels?: string;
};

export type InterviewPanelMember = {
  Level1Panel: AutoCompleteItem[];
  Level2Panel: AutoCompleteItem[];
  InterviewPanel: AutoCompleteItem[];
};

export type tooltipData = {
  Role: string;
  Name: string;
}

export type tooltipInterviewPanel = {
  LineManager: tooltipData;
  HOD: tooltipData;
  HR: tooltipData;
  Exco: tooltipData;
}

export type alertPropsData = {
  Message: string;
  Type: string;
  ButtonAction: any;
  visible: boolean;
};

export type Item = {
  name: string;
  fileContent: ArrayBuffer;
  file?: File | any;
  serverRelativeUrl?: string;
  ID?: string;
};

export type InterviewPanaldata = {
  ID: number;
  CandidateID: number;
  RecruitmentID: number;
  InterviewLevel: string;
  InterviewPanel: number;
  InterviewPanalNames: string[];
  InterviewPanelTitle: string;
  IsScoreSheetUploaded: string;
};

export type SelectedCandidateData = {
  FullName: string;
  PositionTitle: string;
  JobCode: string;
  Comments?: string;
};

export type checklist = {
  id: number,
  label: string,
  value: boolean
}

export type ComplianceCheck = {
  BackgroundChecks: checklist,
  SignedOfferLetter: checklist,
  SignedEmploymentContract: checklist,
  WorkPermitApproved: checklist,
}

export type EmployeeSupport = {
  VisaProcess: checklist,
  AccommodationBooked: checklist,
  TravelProcess: checklist
}

export type FinalStatus = {
  ReadyforOnboarding: checklist
}
export type DocumentCheck = {
  label: string,
  DocumentComplianceChecks: ComplianceCheck
}
export type LogisticsSupport = {
  label: string,
  LogisticsEmployeeSupport: EmployeeSupport,
}
export type FinalStatuse = {
  label: string,
  FinalStatus: FinalStatus
}

export type OnboardingChecklisttype = {
  DocumentComplianceChecks: DocumentCheck,
  LogisticsEmployeeSupport: LogisticsSupport,
  FinalStatus: FinalStatuse,
}

