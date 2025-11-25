import { GetProfileByFilter } from "./ApIInterface";

export type GetDashboardData = {
    ExternalAgencyCode: string;
    FullName: string;
    ContractStartDate: string;
    ContractEndDate: string;
    Nationality: string;
    NoOfUser: number;
}

export type AdminPItem = {
    hrUserId: string;
    pagination: GetProfileByFilter
}

export type AddUser = {
    UserName: string;
    PhoneNumber: number;
    EmailID: string;
    Designation: string;
    IsActive: boolean;
}

export type AdminCreateUser = {
    FirstName: string;
    LastName: string;
    CompanyName: string;
    Designation: string;
    EmailID: string;
    UserType: string;
    Password: string;
    ConfirmPassword: string;
    IsActive: boolean;
    NoOfUsers: string;
    StartDateOfContract: Date | undefined;
    EndDateOfContract: Date | undefined;
    Nationality: string;
    AddUser: AddUser[];
}

export type ValidationAddUser = {
    UserName: boolean;
    PhoneNumber: boolean;
    EmailID: boolean;
    Designation: boolean;
    IsActive: boolean;
}

export type validationUser = {
    FirstName: boolean;
    LastName: boolean;
    CompanyName: boolean;
    Designation: boolean;
    EmailID: boolean;
    UserType: boolean;
    Password: boolean;
    ConfirmPassword: boolean;
    IsActive: boolean;
    NoOfUsers: boolean;
    StartDateOfContract: boolean;
    EndDateOfContract: boolean;
    Nationality: boolean;
    AddUser: ValidationAddUser[];
}

export type UpsertExternalUser = {
    firstname: string;
    lastname: string;
    contactNumber: string;
    email: string;
    password: string;
    isActive: number;
    type: string;
    exUserCode: string;
    userId: string;
    isExpat: number;
    noOfUsers: number;
    hrUserId: string;
    externalUserAccounts: UpsertExternalUser[];
}
