// ─────────────────────────────────────────────
// types/candidateTypes.ts
// ─────────────────────────────────────────────

export interface AutoCompleteItem {
  key: number | string;
  text: string;
}

export interface IDocFile {
  name: string;
  content: string;
  type?: string;
  url?: string;
}

// ─── Candidate Profile ───────────────────────────────────────────────────────

export interface CandidateProfileState {
  CandidateID: string;
  profileID: number;
  JobCode: string;
  JobTitle: string;
  ApplicantName: string;
  ApplicantSurName: string;
  Nationality: string;
  FristName: string;
  MiddleName: string;
  ResidentialAddress: string;
  DOB: string;
  ContactNumber: string;
  Email: string;
  Gender: string;
  HighestQualification: string;
  ExperienceMining: string;
  ExperRelatedfield: number | string;
  Status: string;
  StatusId?: string;
  Agencies: string;
  CandidateResume: any[];
  RoleProfile: any[];
  Advertisement: any[];
  Comments: any[];
  workflowStatusId: string | number;
  hrComments: string;
  JobVaildFromDate: string;
  JobVaildToDate: string;
  CandidateResumeLink: string;
  ConflictsOfInterest: string;
  disability: string;
  disabilityReason: string;
  identityValue: string;
  identityType: string;
  Age: string | number;
  NumberOftax: string | number;
  CurrentEmployer: string;
  CurrentPosition: string;
  WillingToRelocate: string;
  previouslyworkedMine: string;
  familylinks: string;
  businesslinks: string;
  familyDocuments: any[];
  businessDocuments: any[];
  CountryofOrgin: string;
  Citizenship: string;
  FamilyLink: string;
  BusinessLink: string;
  GPA: number;
  COIAppreve?: string;
  COIComments?: string;
  COIReason?: string;
  countryOfResidency: string;
  residentStatus: string;
  maritalStatus: string;
  maritalStatusId: string;
  childrenDetails: any[];
  employeeReferenceDetails: any;
  joiningDate?: string;
  noticePeriod?: string;
  hasIvanhoeZijinExperience: string;
  companyDetails: any;
  businesslinkscompany: string;
  NatioCode: string;
  PreviousEmployerDetails?: any;
  LanguageKnown: any[];
  PPEDetails: any[];
}

export const INITIAL_CANDIDATE_PROFILE: CandidateProfileState = {
  CandidateID: "",
  profileID: 0,
  JobCode: "",
  JobTitle: "",
  ApplicantName: "",
  ApplicantSurName: "",
  Nationality: "",
  FristName: "",
  MiddleName: "",
  ResidentialAddress: "",
  DOB: "",
  ContactNumber: "",
  Email: "",
  Gender: "",
  HighestQualification: "",
  ExperienceMining: "",
  ExperRelatedfield: 0,
  Status: "",
  Agencies: "",
  CandidateResume: [],
  RoleProfile: [],
  Advertisement: [],
  Comments: [],
  workflowStatusId: "",
  hrComments: "",
  JobVaildFromDate: "",
  JobVaildToDate: "",
  CandidateResumeLink: "",
  ConflictsOfInterest: "",
  disability: "",
  disabilityReason: "",
  identityValue: "",
  identityType: "",
  Age: "",
  NumberOftax: "",
  CurrentEmployer: "",
  CurrentPosition: "",
  WillingToRelocate: "",
  previouslyworkedMine: "",
  familylinks: "",
  businesslinks: "",
  familyDocuments: [],
  businessDocuments: [],
  CountryofOrgin: "",
  Citizenship: "",
  FamilyLink: "",
  BusinessLink: "",
  GPA: 0,
  countryOfResidency: "",
  residentStatus: "",
  maritalStatus: "",
  maritalStatusId: "",
  childrenDetails: [],
  employeeReferenceDetails: undefined,
  hasIvanhoeZijinExperience: "",
  companyDetails: undefined,
  businesslinkscompany: "",
  NatioCode: "",
  LanguageKnown: [],
  PPEDetails: [],
};

// ─── Interview Level ─────────────────────────────────────────────────────────

export interface InterviewedLevelState {
  Levels: string;
  Grade: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
  CandidateScoreValue: AutoCompleteItem;
  CandidateScoreOption: AutoCompleteItem[];
  COIProfileLabel: AutoCompleteItem;
  COIProfileLabelOption: AutoCompleteItem[];
  COIAttachment: IDocFile[];
  COIComments: string;
  COIReason: string;
}

export interface DateScheduleState {
  startDateL1: Date | undefined;
  endDateL1: Date | undefined;
  startDateL2: Date | undefined;
  endDateL2: Date | undefined;
  RoomData: AutoCompleteItem;
  RoomDateL2: AutoCompleteItem;
  RoomDataOption: AutoCompleteItem[];
}

export interface ActionValueState {
  CandidateStatus: string;
  Comments: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationErrorState {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
  AssignInterviewLevel1: boolean;
  InterviewTime: boolean;
  CandidateScoreValue: boolean;
  COIProfileLabel: boolean;
  COIAttachment: boolean;
  COIComments: boolean;
  RoomData: boolean;
  startDateL1: boolean;
  endDateL1: boolean;
  startDateL2: boolean;
  endDateL2: boolean;
  RoomDateL2: boolean;
}

export const INITIAL_VALIDATION_ERRORS: ValidationErrorState = {
  Comments: false,
  Checkboxalidation: false,
  CandidateStatus: false,
  AssignInterviewLevel1: false,
  InterviewTime: false,
  CandidateScoreValue: false,
  COIProfileLabel: false,
  COIAttachment: false,
  COIComments: false,
  RoomData: false,
  startDateL1: false,
  endDateL1: false,
  startDateL2: false,
  endDateL2: false,
  RoomDateL2: false,
};

// ─── Alert ───────────────────────────────────────────────────────────────────

export interface AlertPropsData {
  Message: string;
  Type: string;
  ButtonAction: ((clicked: boolean) => Promise<void>) | null;
  visible: boolean;
  ButtonLebel?: string;
  IsCloseIcon?: boolean;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ViewCandidateDetailsProps {
  stateValue: any;
  CurrentRoleID: number[];
  EmployeeList: any[];
  navigation: (path: string, options?: any) => void;
  webURL: string;
  userDetails: any[];
}