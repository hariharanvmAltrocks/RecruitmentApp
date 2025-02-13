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
    MinAndPreferedQualifications: MinAndPreferedQualifications[]
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