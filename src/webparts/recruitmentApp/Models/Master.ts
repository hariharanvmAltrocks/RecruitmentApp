export type UserRoleResponseDetails = {
    data: UserRoleData[] | undefined;
    status: number;
    message: string;
};

export type UserRoleData = {
    ID: number;
    RoleTitle: string;
    ADGroupID: string;
};

export type MasterDataResponseDetails = {
    data: MasterData | undefined;
    status: number;
    message: string;
};

export type AllSubDepartmentList = {
    key: number;
    DepartmentId: number;
    DepartmentName: string;
}

export type IDropDownKeys = {
    key: number;
    text: string;
}

export type IEmployeeKeys = {
    key: number;
    text: string;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    PatersonGrade: string;
    DrcGrade: string;
    JobTitle: string;
    JobTitleInFrench: string;
    BusinessUnitCode: string;
    NumberOfServiceYears: string;
    Department: string;
    Email: string;
    homeAddressEmployee: string;
    businessAddressEmployee: string;
    contactNumberEmployee: number;
}

export type IDropDowJoptitle = {
    key: number;
    text: string;
    JobCode: string;
    // PatersonGrade: string;
}

export type UserDetailsResponse = {
    ID: number;
    EmailId: string;
    DepartmentId: number;
    CurrentPosition: string;
    DepartmentName: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    JopTitleEnglish: string;
    JopTitleFrench: string;
    DRCGrade: string;
    PatersonGrade: string;
    BusinessAddress: string;
    HomeAddress: string;
    ContactNumber: string;
    BusinessUnitCode: string;
    BusinessUnitID: number;
}

export type SubDepartmentResponse = {
    key: number;
    DepartmentId: number;
    DepartmentName: string;
    text: string;
}
export type SectionResponse = {
    key: number;
    text: string;
    SubDepartmentId: number;
    SubDepartmentName: string;

}
export type SectiontoDCodeResponse = {
    key: number;
    SectionId: number;
    SectionName: string;
    text: string;
}
export type LineMangerToBucodeResponse = {
    key: number;
    text: string;
}
export type BuCodeToDepartmentResponse = {
    ID: number;
    key: number;
    DepartmentId: number;
    DepartmentName: string;
    text: string;
    IsWLCreatedAndConsolidated: boolean;
}

export type CompanyCodeDetailsResponse = {
    key: number;
    CompanyCode: string;
    CompanyName: string;
    EmployeeIdPrefix: string;
}


// export type userRole = {
//     roleDetails: any;
//     selectedRole: number | string;
//     roleOptions: [];
// }

// export type MasterData = {
//     userRole: any;
//     EmployeeOption: IDropDownKeys[];
//     EmployeeList: IEmployeeKeys[];
//     JobInEnglishList: IDropDowJoptitle[];
//     JobInFrenchList: IDropDowJoptitle[];
//     PatersonGradeList: IDropDownKeys[];
//     DrcGradeList: IDropDownKeys[];
//     StatusList: IDropDownKeys[];
//     userDetails: UserDetailsResponse;
//     Department: IDropDownKeys[];
//     DepartmentOption: IDropDownKeys[];
//     DepartmentCode: IDropDownKeys[];
//     BusinessUnitCode: IDropDownKeys[];
//     BusinessUnitCodeAllColumn: any[];
//     AllSubDepartmentList: SubDepartmentResponse[];
//     SectionList: SectionResponse[];
//     DepartmentCodeList: SectiontoDCodeResponse[];
//     LineMangerBusinessUnitCodeList: LineMangerToBucodeResponse[];
//     BuCodeToDepartmentMappingList: BuCodeToDepartmentResponse[];
//     CompanyCodeDetailsList: CompanyCodeDetailsResponse[];
// };

export type MasterData = {
    EmployeeOption: IDropDownKeys[];
    EmployeeList: IEmployeeKeys[];
    PatersonGradeList: IDropDownKeys[];
    DrcGradeList: IDropDownKeys[];
    StatusList: IDropDownKeys[];
    userDetails: UserDetailsResponse[];
    JobInEnglishList: IDropDowJoptitle[];
    JobInFrenchList: IDropDowJoptitle[];
    BusinessUnitCode: IDropDownKeys[];
    BusinessUnitCodeAllColumn: any[];
    Department: IDropDownKeys[];
    AllSubDepartmentList: SubDepartmentResponse[];
    SectionList: SectionResponse[];
    DepartmentCodeList: SectiontoDCodeResponse[];
    BuCodeToDepartmentMappingList: BuCodeToDepartmentResponse[];
    CompanyCodeDetailsList: CompanyCodeDetailsResponse[];
};

