import { IDocFiles } from "../Services/SPService/ISPServicesProps"
import { AutoCompleteItem } from "./Screens";

export type InterviewPanelCandidateDetails = {
    ID: number;
    JobCode: string;
    PassportID: string;
    FristName: string;
    MiddleName: string;
    LastName: string;
    CandidateCVDoc: IDocFiles[];
}

export type IAttachmentExampleState = {
    file: File | any;
    fileName: string;
    fileContent: string | ArrayBuffer | null;
    serverRelativeUrl: string;
    ID: string;
}

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
    JobCodeID: number;
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
    AdvertisementAttachement: IAttachmentExampleState[];
    PositionDetails: any[];
    RoleProfileDocument: any[];
    GradingDocument: any[];
    AdvertisementDocument: any[];
    AssignRecruitmentHR: AutoCompleteItem;
    AssignRecruitmentHROption: AutoCompleteItem[];
    OnamSignedStampsAttchment: IAttachmentExampleState[]
    OnamSignedStampsDocument: any[];
    AssignAgencies: AutoCompleteItem;
    AssignAgenciesOption: AutoCompleteItem[];
    CandidateCVAttachment: IAttachmentExampleState[];
    Comments: string
}

export type AdvDetails = {
    MinQualificationOption: AutoCompleteItem[];
    PrefeQualificationOption: AutoCompleteItem[];
    RoleSpeKnowledgeoption: AutoCompleteItem[];
    RequiredLeveloption: AutoCompleteItem[];
    TechnicalSkillsOption: AutoCompleteItem[];
    LevelProficiencyOption: AutoCompleteItem[];
    RolePurpose: string;
    JobDescription: string;
    addMasterQualification: string;
    TotalExperience: string;
    ExperienceinMiningIndustry: string;
}

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
}


export type ScoreCardData = {
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
}

export type QualificationValue = {
    MinQualification: AutoCompleteItem;
    PrefeQualification: AutoCompleteItem;
}

export type RoleSpecKnowledge = {
    RoleSpeKnowledge: AutoCompleteItem;
    RequiredLevel: AutoCompleteItem;
}

export type TechnicalSkills = {
    TechnicalSkills: AutoCompleteItem;
    LevelProficiency: AutoCompleteItem;
}

