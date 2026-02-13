import { CommentsData } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import { IDocFiles } from "../Services/SPService/ISPServicesProps";
import { AutoCompleteItem } from "./Screens";

export type AdvertisementDetails = {
    jobCode: string;
    noOfPositions: string;
    validFrom: Date | null;
    validTo: Date | null;
    employmentType: string;
    departmentId: string;
    role: null,
    functionId: string;
    onemdocPath: string;
    experience: string;
    nationality: string;
    Descriptions_en: Descriptions,
    Descriptions_fr: Descriptions,
    RoleAndTechSkills: RoleAndTechSkills[],
    MinAndPreferedQualifications: MinAndPreferedQualifications[];
    isActive: number;
    IsExtened: number;
    // profileXAgent: profileXagent;
}

export type profileXagent = {
    jobCode: string,
    jobsXAgents: jobsXAgents[]
}

export type jobsXAgents = {
    agentId: string,
    // isSuspended: number
}

export type RoleAndTechSkills = {
    skillId: string;
    levelId: string;
}
export type MinAndPreferedQualifications = {
    qualification: string;
    type: number
}
export type Descriptions = {
    jobTitle: string;
    jobShortSummary: string;
    jobSummary: string;
}
export type GetProfileByFilter = {
    filterValue: string,
    sortBy: string,
    sortOrder: number,
    pageSize: number,
    currentPage: number,
    totalItems: number
}
export type FilterItem = {
    jobCode: string;
    workflowStausId: String[];
    pagination: GetProfileByFilter
}

export type GetProfileByJobCode = {
    SNO?: number | string;
    CandidateID: string,
    ApplicantName: string,
    PositionTitle: string,
    JobCode: string,
    Status: string,
    workflowStatusId: string,
    createdOn: Date | undefined,
    applicationStatusId: string,
    applicationStatus: string
}

export type PreviousEmployer = {
    name: string;
    Designation: string;
    Email: string;
    ContractNumber: string;
    CompanyName: string;
}

export type PPEDetail = {
    PPEType: string;
    PPESize: string;
}
export type CandidateProfile = {
    CandidateID: string,
    profileID: number,
    JobCode: string,
    JobTitle: string,
    ApplicantName: string;
    FristName: string;
    MiddleName: string
    ResidentialAddress: string;
    DOB: string;
    ContactNumber: string;
    Email: string;
    ApplicantSurName: string;
    Nationality: string;
    Gender: string;
    HighestQualification: string;
    ExperienceMining: string;
    ExperRelatedfield: number;
    Status: string;
    StatusId: string;
    Agencies: string;
    CandidateResume: IDocFiles[];
    RoleProfile: IDocFiles[];
    Advertisement: IDocFiles[];
    Comments: CommentsData[];
    workflowStatusId: string;
    hrComments: string;
    JobVaildFromDate: string;
    JobVaildToDate: string;
    CandidateResumeLink: string;
    ConflictsOfInterest: string;
    disability: string;
    disabilityReason: string;
    identityValue: string;
    identityType: string;
    NatioCode: string;

    Age: string;
    NumberOftax: string;
    CurrentEmployer: string;
    CurrentPosition: string;
    WillingToRelocate: string;
    previouslyworkedMine: string | undefined;
    familylinks: string;
    businesslinks: string;
    familyDocuments: IDocFiles[];
    businessDocuments: IDocFiles[];
    CountryofOrgin: string;
    Citizenship: string;

    FamilyLink: string;
    BusinessLink: string;
    GPA: number;

    COIAppreve: string;
    COIComments: string;
    COIReason: string;

    countryOfResidency: string;
    residentStatus: string;
    maritalStatus: string;
    childrenDetails: childrenDetails[],
    employeeReferenceDetails: employeeReferenceDetail | undefined,
    maritalStatusId: string;

    joiningDate: string;
    noticePeriod: string;

    hasIvanhoeZijinExperience: string;
    companyDetails: CompanyDetails | undefined,

    businesslinkscompany: string;
    PreviousEmployerDetails: PreviousEmployer | undefined;
    LanguageKnown: string[];

    PPEDetails: PPEDetail[];
}


export type childrenDetails = {
    name: string;
    age: number;
    genderId: string;
}

export type CompanyDetails = {
    operation: string;
    role: string;
    region: string;
}

export type employeeReferenceDetail = {
    empId: string;
    empName: string;
    empEmail: string;
    company: string;
}

export type WorkflowJson = {
    workflowStatus: string,
    jobRequestId: number,
    comments: string,
    actionBy: string,
    hrComments?: string,
    OfferLatterPath?: string,
    EmpContractLatterPath?: string,
    ConsentFormPath?: string,
    HrUserId?: string,
    HrUserEmail?: string,
    proofOfPaymentPath?: string,
    signedWorkPermitPath?: string
}

export type profileJobsComments = {
    comments: number,
    RoleName: string,
    createdDate: string,
    jobRequestId: number
}

export type UpsertMasters = {
    displayText: string,
    displayText_fr: string,
    category: category;
}

export type category = {
    id: number,
    name: string;
}

export type UpsertQuestions = {
    questionEn: string;
    questionFr: string;
    scopeId: string;
    categoryId: string;
    questionTypeId: string;
    isQualifier: number;
    isAnswerValidate: number;
    sequence: number;
    jobCode: string;
    options: optionsValue[];
    answers: answersValue[];
}

export type optionsValue = {
    optionEn: string,
    optionFr: string,
    sequence: number
}

export type answersValue = {
    optionEn: string,
    optionFr: string
}

export type GetAllMaster = {
    id: number;
    value: string;
    displayText: string;
    displayTextFr: string;
}

export type getQuestionById = {
    discipline: string,
    category?: string
}

export type GetMasterByCountry = {
    id: number;
    code: string;
    text: string;
}

export type CheckMyCandidate = {
    Email: string,
    JobCode?: string
}

export type UpsertProfile = {
    contactNumber1: string;
    contactNumber2: string;
    dob: string;
    documentId: string | null;
    educationId: string;
    email: string;
    firstName: string;
    genderId: string;
    identityTypeId: string;
    identityValue: string;
    jobsApplied: jobsApplied[];
    lastName: string;
    middleName: string;
    nationalityId: string;
    profileAddress: ProfileAddress;
    profileDetailDisciplines: [];
    profileDetailDisclosure: null,
    profileDetailEducations: [],
    profileDetailEmploymentHistory: profileDetailEmploymentHistory | null,
    profileDetailExperiences: ProfileDetailsExperience[],
    profileDetailLanguages: [],
    profileDetailSkills: [],
    profileId: number,
    profileXAgent: null,
    profileXOptAnswers: profileXOptAnswers[],
    profileXTxtAnswers: [],
    releventExperience: number,
    title: string,
    totalYearOfExperiance: string,
    profileDetailAttachments: profileDetailAttachments[];
    hasBusinessLinks: string
    hasEmployeeRelation: string
}

export type profileDetailAttachments = {
    AttachmentTypeCoe: string;
    DocumentId: number;
    ProfileId: number;
}

export type profileXOptAnswers = {
    profileId: string,
    questionId: number,
    answerContentId: string,
}

export type profileDetailEmploymentHistory = {
    referralSourceId: string,
    previousExpatStatus: number,
    previousEmployer: string,
    expatWorkDuration: string,
    hasIvanhoeZijinExperienceId: string,
    workedOperation: string,
    workRole: string,
    territory: string,
}

export type ProfileDetailsExperience = {
    profileId: number,
    title: string;
    roleDescription: string;
    company: string;
    location: string;
    startFrom: string;
    endTo: string;
}

export type ProfileAddress = {
    address1: string,
    address2: string,
    cityId: string,
    stateId: string,
    countryId: string,
    postalZipCode: string

}

export type jobsApplied = {
    applicationStatusId: string;
    jobRequestId: number,
    jobCode: string;
    workflowStatusId: string;
    isSuspended: number,
    documentId: number
}

export type UploadDocument = {
    CandidateID: number;
    ApplicantName: string;
    ApplicantSurName: string;
    positionID: string;
    BusinessUnitCode: string;
    Department: string;
    SubDepartment: string;
    Section: string;
    DepartmentCode: string;
    EmploymentCategory: string;
    TypeOfCOntract: string;
    Nationalty: string;
    AreaOfWork: string;
    Location: string;
    Email: string;
    ProofOfIdentity: string;
    IdentityNumber: string;
    ProfileID: string;
    Gender: string;

    comments: string;
    Checkbox: boolean;
    SignDate: Date | any;
    OfferLetterDoc: IDocFiles[];
    jobRequestID: string;
    EmployementDoc: IDocFiles[];
    PersonalDocs: DocumentName[];
    MedicalDocs: IDocFiles[];
    ConsentDocs: IDocFiles[];
    PaymentDocs: IDocFiles[];

    RadioAction: string;
    CheckboxContent: string;

    TrainingSystem?: TrainingSystem;
    TASystem?: TASystem;
    ITSystem?: ITSystem;
    MedicalSystem?: MedicalSystem;

    ITRequired?: string;

    JoiningDate: string;
    NoticePeriod: string;

    BGVRadioBtn: string;
    BGVRadioBtnlabel: string;
    PaymentReview: string;
    RecNationality: string;

    DotAfricaCF: IDocFiles[];
    WorkpermitDoc: IDocFiles[];
    NationalityCode: string;

    EmployeeName: string;
    EmployeeDesignation: string;
    EmployeeEmail: string;
    EmployeeCN: string;
    EmployeeCompany: string;
    LabourHire: string;

    BGVStatusProcess: AutoCompleteItem;
    BGVStatusProcessOption: AutoCompleteItem[];
    BGVProofAttachment: IDocFiles[];
    BGVComments: string;
    PPEDetails: PPEDetail[];
}

export type DocumentName = {
    [category: string]: IDocFiles[];
}

export type TrainingSystem = {
    Inductiontype: AutoCompleteItem;
    StartDate: Date | any;
    EndDate: Date | any;
    Region: AutoCompleteItem[];
    Zone: AutoCompleteItem[];
    Comments: string;
}

export type TASystem = {
    StartDate: Date | any;
    EndDate: Date | any;
    Region: AutoCompleteItem[];
    Zone: AutoCompleteItem[];
    Comments: string;
}

export type ITSystem = {
    StartDate: Date | any;
    Hardware: AutoCompleteItem[];
    Region: AutoCompleteItem[];
    Zone: AutoCompleteItem[];
    Comments: string;
    ITStatus: string;
}

export type MedicalSystem = {
    StartDate: Date | any;
    EndDate: Date | any;
    Region: AutoCompleteItem[];
    Zone: AutoCompleteItem[];
    Comments: string;
    MedicalStatus: string;
}

export type COIType = {
    profileId: number;
    approver: string;
    comments: string;
    attachmentPath: string;
}

export type sendEmail = {
    jobRequestId: number;
    templateCode: string;
    dynamicFields?: {
        InterviewDate?: string;
        InterviewTime?: string;
        MeetingLink?: string;
        InterviewLevel?: string;
        Department?: string;
    }
}

export type initiateLaborHire = {
    jobRequestID: number;
    positionId: string;
    location: string;
    businessUnit: string;
    department: string;
    section: string;
    patersonGrade: string;
    drcGrade: string;
    reportingManager: string;
    dateOfJoining?: Date | null;
    typeOfContract: string;
    noOfMonths?: string;
    netPay: number;
    lhCode: string;
    createdOn: Date;
    createdBy: string;
    createrEmail: string;
}

export type BGVStatus = {
    hrUserId: string;
    pagination: GetProfileByFilter
}

export type UpsertBGV = {
    jobCode: string;
    verificationType: string;
    department: string;
    nationality: string;
    isActive: boolean;
}


