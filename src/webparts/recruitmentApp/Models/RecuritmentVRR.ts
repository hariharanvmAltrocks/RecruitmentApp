import { CheckboxGroupOption } from "../components/CustomCheckboxGroup";
import { OptionRow } from "../Screens/ReviewProfile/InterviewQuesEdit";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { AutoCompleteItem } from "./Screens";

export type InterviewPanelCandidateDetails = {
  ID: number;
  JobCode: string;
  PassportID: string;
  FristName: string;
  MiddleName: string;
  LastName: string;
  CandidateCVDoc: IDocFiles[];
};

export type IAttachmentExampleState = {
  file: File | any;
  fileName: string;
  fileContent: string | ArrayBuffer | null;
  serverRelativeUrl: string;
  ID: string;
};

export type RecuritmentData = {
  VRRID: number;
  BusinessUnitCodeID: number;
  DepartmentID: number;
  SubDepartmentID: number;
  SectionID: number;
  DepartmentCodeID: number;
  JobNameInEnglishID: number;
  JobNameInFrenchID: number;
  PatersonGradeID: number;
  DRCGradeID: number;
  JobCodeId: number;
  BusinessUnitCode: string;
  BusinessUnitName: string;
  BusinessUnitDescription: string;
  Department: string;
  SubDepartment: string;
  Section: string;
  DepartmentCode: string;
  Nationality: string;
  JobNameInEnglish: string;
  JobNameInFrench: string;
  NoofPositionAssigned: string;
  PatersonGrade: string;
  DRCGrade: string;
  EmployementCategory: string;
  ContractType: string;
  JobCode: string;
  AreaOfWork: string;
  ReasonForVacancy: string;
  RecruitmentAuthorised: string;
  IsPayrollEmailed: string;
  EnterNumberOfMonths: number;
  DateRequried: string;
  IsRevert: string;
  VacancyConfirmed: string;
  RoleProfileDocument: IDocFiles[];
  GradingDocument: IDocFiles[];
  RoleProfileDocument_fr: IDocFiles[];
  GradingDocument_fr: IDocFiles[];
  AdvertisementDocument: any[];
  AssignRecruitmentHR: AutoCompleteItem;
  AssignRecruitmentHROption: AutoCompleteItem[];
  OnamSignedStampsAttchment: IDocFiles[] | null;
  OnamSignedStampsDocument: any[];
  AssignAgencies: AutoCompleteItem;
  AssignAgenciesOption: AutoCompleteItem[];
  CandidateCVAttachment: IDocFiles[] | null;
  Comments: string;
  SignDate?: Date | any;
};

export type AdvDetails = {
  RoleDetailsID: number;
  MinQualificationOption: AutoCompleteItem[];
  PrefeQualificationOption: AutoCompleteItem[];
  RoleSpeKnowledgeoption: AutoCompleteItem[];
  RequiredLeveloption: AutoCompleteItem[];
  TechnicalSkillsOption: AutoCompleteItem[];
  LevelProficiencyOption: AutoCompleteItem[];
  RolePurpose: string;
  JobDescription: string;
  RolePurpose_fr: string;
  JobDescription_fr: string;
  addMasterQualification: string;
  TotalExperience: AutoCompleteItem;
  ExperienceinMiningIndustry: AutoCompleteItem;
  TotalExperienceOption: AutoCompleteItem[];
  ExperienceinMiningIndustryOption: AutoCompleteItem[];
  YearofExperience: any;
  PreferredExperience: any;
  ValidFrom: Date | undefined;
  ValidTo: Date | undefined;
  FunctionType: any;
  JobFunctionalType: AutoCompleteItem;
  JobFunctionalType_fr: AutoCompleteItem;
  JobFunctionalTypeOption: AutoCompleteItem[];
  addMasterMinimumQualification: string;
  AdvertisementAttachement: IDocFiles[] | null;
  JobcodeChecked: boolean;

  JobTitleofFunctionalManager: AutoCompleteItem;
  JobTilteFunctionalManager_fr: AutoCompleteItem;
  JobTitleofFunctionalManagerOption: AutoCompleteItem[];
  FunctionalManagerName: AutoCompleteItem;
  JobTitleofLineManagerSupervisor: AutoCompleteItem;
  JobTitleofLineManagerSupervisorOption: AutoCompleteItem[];
  JobTitleofLineManagerSupervisor_fr: AutoCompleteItem;
  LineManagerSupervisorName: AutoCompleteItem;
  IsMasterData: boolean;
  JobBasedBGVVerification: any[];
};

export type CandidateData = {
  JobCode: string;
  JobCodeId: number;
  PassportID: string;
  FristName: string;
  MiddleName: string;
  LastName: string;
  FullName: string;
  ResidentialAddress: string;
  DOB: string;
  ContactNumber: string;
  Email: string;
  Nationality: string;
  Gender: string;
  TotalYearOfExperiance: string;
  Skills: string;
  LanguageKnown: string;
  ReleventExperience: string;
  Qualification: string;
  CandidateCVDoc: any[];
  RoleProfileDocument: any[];
  AdvertisementDocument: any[];
  ShortlistedValue: string;
  // LevelofInterviewed: string;
};

export type ScoreCardData = {
  InterviewLevels?: any;
  CandidateID: number;
  RecruitmentID: number;
  JobCode: string;
  JobCodeId: number;
  PassportID: string;
  FristName: string;
  MiddleName: string;
  LastName: string;
  FullName: string;
  ResidentialAddress: string;
  DOB: string;
  ContactNumber: string;
  Email: string;
  Nationality: string;
  Gender: string;
  TotalYearOfExperiance: string;
  Skills: string;
  LanguageKnown: string;
  ReleventExperience: string;
  Qualification: string;
  CandidateCVDoc: any[];
  Qualifications: AutoCompleteItem;
  Experience: AutoCompleteItem;
  Knowledge: AutoCompleteItem;
  Energylevel: AutoCompleteItem;
  Requirements: AutoCompleteItem;
  contributeculture: AutoCompleteItem;
  ExpatExperienceCongolese: AutoCompleteItem;
  CriteriaRecognised: AutoCompleteItem;
  Employment: string;
  EvaluationFeedback: string;
  OverAllEvaluationFeedback: string;
  SignDate?: Date | any;
  AdvertisementDocument: any[];
  RoleProfileDocument: any[];
  PositionTitle?: string;
  //InterviewPanalNames?: string[];
  // InterviewPanelNames: string[]; // Array of names (e.g. ["Fathima John N"])
  interviewPanelTitles: string[];
  InterviewDate?: string;
  JobRequestID: string;
  Comments: string;
  ExternalAgentName?: string;
  JobGrade: string;
  PanelFullNames?: string[];
  GPA: string;
  ConflictsOfInterest: string;
  disability: string;
  disabilityReason: string;
};

export type QualificationValue = {
  MinQualification: AutoCompleteItem[];
  PrefeQualification: AutoCompleteItem[];
  MinQualification_fr: AutoCompleteItem[];
  PrefeQualification_fr: AutoCompleteItem[];
};

export type RoleSpecKnowledge = {
  RoleSpeKnowledge: AutoCompleteItem;
  RequiredLevel: AutoCompleteItem;
  RoleSpeKnowledge_fr: AutoCompleteItem;
  RequiredLevel_fr: AutoCompleteItem;
};

export type TechnicalSkills = {
  TechnicalSkills: AutoCompleteItem;
  LevelProficiency: AutoCompleteItem;
  TechnicalSkills_fr: AutoCompleteItem;
  LevelProficiency_fr: AutoCompleteItem;
};

export type JobCodeTilte = {
  JobTitle: string;
  JobCode: string;
  ID?: number | undefined;
  Nationality?: string;
  JobCodeId: number;
};

// export type RecruitementPositionDetails = {
//   JobNameInEnglishID: string;
//   JobNameInFrenchID: string;
//   PatersonGradeID: number;
//   DRCGradeID: number;
//   PositionDetails?: [];
//   Comments: string;
// };

export type RecruitementPositionDetails = {
  PositionDetails: Array<{
    PatersonGradeID: number;
    DRCGradeID: number;
    JobNameInEnglishID: number;
    JobNameInFrenchID: number;
  }>;
  JobNameInEnglishID: number;
  JobNameInFrenchID: number;
  PatersonGradeID: number;
  DRCGradeID: number;
  Comments: string;
};

export type ScoreData = {
  SignDate?: Date | any;
};

//QuestionnairesforInterviewerLogin
export type QuestionItem = {
  id: number;
  question: string;
  answer: string;
  rating: number | null;
  header?: string;
};

export type CommanQuestion = {
  id: number;
  question: string;
  questionId: string;
  questionXOptions: optContent[];
  answerContentId: string,
};
export type answerContent = {
  optContentId: string;
  contentEn: string,
  contentFr: string,
}

export type optContent = {
  optContentId: string;
  optContent: string;
}
export type AssignHod = {
  Comments: string;
};
// sneka
export type InterviewQues = {
  Disciplines: AutoCompleteItem;
  QuestionType: AutoCompleteItem;
  QuestionNumber: AutoCompleteItem;
  Question: string;
  ExpectedAnswer: string;
  CareerportalAnswer: OptionRow[]
  Catogry: string;
  PositionTitle?: string;
  // OptionsType?: { text: string }[];
  OptionsType?: AutoCompleteItem;
  Disqualification?: any;
};

export type CandidatedCVDetails = {
  Title: AutoCompleteItem;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DOB: Date | undefined;
  PhoneNumber: number;
  AlternativePhoneNumber: number;
  Nationality: AutoCompleteItem;
  ProofOfIdentity: AutoCompleteItem;
  IdentityNumber: string;
  Gender: string;
  Email: string;
  HighestEducation: AutoCompleteItem;
  WorkExperience: AutoCompleteItem;
  RelevantExperience: string;
  AddressLine: string;
  Country: AutoCompleteItem;
  State: AutoCompleteItem;
  City: AutoCompleteItem;
  PostalCode: string;
  CandidateCV: IDocFiles[] | null;

  CountryCode: string | number;

  NumberOftax: string;
  CurrentEmployer: string;
  CurrentPosition: string;
  WillingToRelocate: string;
  previouslyworkedMine: string;
  familylinks: string;
  businesslinks: string;
  familyDocuments: IDocFiles[];
  businessDocuments: IDocFiles[];

  whichOperation: string;
  YourRole: string;
  RegionProvince: string;

  // CountryofOrgin: string;
  // Citizenship: string;
};

export type stateOption = {
  TitleOption: AutoCompleteItem[];
  NationalityOption: AutoCompleteItem[];
  ProofOfIdentityOption: AutoCompleteItem[];
  HighestEducationOption: AutoCompleteItem[];
  WorkExperienceOption: AutoCompleteItem[];
  CountryOption: AutoCompleteItem[];
  StateOption: AutoCompleteItem[];
  CityOption: AutoCompleteItem[];
  CountryCodeOption: AutoCompleteItem[];
};

export type ValidationErrors = {
  Title: boolean;
  FirstName: boolean;
  MiddleName: boolean;
  LastName: boolean;
  DOB: boolean;
  PhoneNumber: boolean;
  AlternativePhoneNumber: boolean;
  Nationality: boolean;
  ProofOfIdentity: boolean;
  IdentityNumber: boolean;
  Gender: boolean;
  Email: boolean;
  HighestEducation: boolean;
  WorkExperience: boolean;
  RelevantExperience: boolean;
  AddressLine: boolean;
  Country: boolean;
  State: boolean;
  City: boolean;
  PostalCode: boolean;
  CandidateCV: boolean;

  NumberOftax: boolean;
  CurrentEmployer: boolean;
  CurrentPosition: boolean;
  WillingToRelocate: boolean;
  previouslyworkedMine: boolean;
  familylinks: boolean;
  businesslinks: boolean;

  familyDocuments: boolean;
  businessDocuments: boolean;

  whichOperation: boolean;
  YourRole: boolean;
  RegionProvince: boolean;
};

export type tabCount = {
  AssignHRCount?: number;
  UploadONEMCount: number;
  UploadAdvertisementCount: number;
  AssignAgencyCount: number;
  ReviewLineManagerCount: number;
  ReviewHODCount: number;
  lineManagerInterviewCount: number;
  HODReviewScoreCount: number;
  EvaluationCount?: number;
  advertExtensionCount: number;
}

export type BGVState = {
  checkboxBGV: CheckboxGroupOption[];
  checkboxBGVOption: CheckboxGroupOption[];
}