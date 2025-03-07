import { IDocFiles } from "../Services/SPService/ISPServicesProps";

export type AdvertisementDetails = {
    jobCode: string;
    noOfPositions: string;
    validFrom: Date | undefined;
    validTo: Date | undefined;
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
    // profileXAgent: profileXagent;
}

export type profileXagent = {
    jobCode: string,
    agent: jobsXAgents[]
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
    Agencies: string;
    CandidateResume: IDocFiles[];
    RoleProfile: IDocFiles[];
    Advertisement: IDocFiles[];
    Comments: profileJobsComments[];
    workflowStatusId: string;
}

export type WorkflowJson = {
    workflowStatus: string,
    jobRequestId: number,
    comments: string,
    actionBy: string
}

export type profileJobsComments = {
    comments: number,
    RoleName: string,
    createdDate: string,
    jobRequestId: number
}