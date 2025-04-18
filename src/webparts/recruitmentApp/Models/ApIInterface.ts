import { IDocFiles } from "../Services/SPService/ISPServicesProps";

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
    IsActive: number;
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
    CandidateID: string,
    ApplicantName: string,
    PositionTitle: string,
    JobGrade: string,
    Status: string,
    workflowStatusId: string
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
    ContactNumber: number;
    Email: string;
    ApplicantSurName: string;
    Nationality: string;
    Gender: string;
    HighestQualification: string;
    ExperienceMining: number;
    ExperRelatedfield: number;
    Status: string;
    StatusId: string;
    Agencies: string;
    CandidateResume: IDocFiles[];
    RoleProfile: IDocFiles[];
    Advertisement: IDocFiles[];
    Comments: profileJobsComments[];
    workflowStatusId: string;
    hrComments: string;
    JobVaildFromDate: string;
    JobVaildToDate: string;
}

export type WorkflowJson = {
    workflowStatus: string,
    jobRequestId: number,
    comments: string,
    actionBy: string,
    hrComments?: string
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
