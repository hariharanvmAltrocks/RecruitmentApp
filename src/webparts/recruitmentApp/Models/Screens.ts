export type AutoCompleteItem = {
  key: number;
  text: string;
};

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
  CandidateID: number;
  RecruitmentID: number;
  InterviewLevel: string;
  InterviewPanel: number;
  InterviewPanalNames: string[];
};
