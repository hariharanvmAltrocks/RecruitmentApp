import { AutoCompleteItem } from "./fieldmodels";
import { GetProfileByFilter } from "./Icareerportal";

export type GetDashboardData = {
  ExternalAgencyCode: string;
  FullName: string;
  ContractStartDate: string;
  ContractEndDate: string;
  Nationality: string;
  NoOfUser: number;
};

export type AdminPItem = {
  hrUserId: string;
  type: string;
  pagination: GetProfileByFilter;
};

export type AddUser = {
  FirstName: string;
  LastName: string;
  PhoneNumber: number;
  EmailID: string;
  Password: string;
  ConfirmPassword: string;
  IsActive: boolean;
  EmailIDValidation: boolean;
  PasswordValidation: boolean;
  ConfirmPWValidation: boolean;
  IsAlreadythere: boolean;
};

export type AdminCreateUser = {
  ExternalID: number;
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
  Nationality: AutoCompleteItem | null;
  AgentCode: string;
  AddUser: AddUser[];
};

export type ValidationAddUser = {
  FirstName: boolean;
  LastName: boolean;
  PhoneNumber: boolean;
  EmailID: boolean;
  Password: boolean;
  ConfirmPassword: boolean;
  IsActive: boolean;
};

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
  AddUserValidation: boolean;
};

export type ExternalUser = {
  firstname: string;
  lastname: string;
  contactNumber: string;
  email: string;
  password: string;
  isActive: number;
  type: string;
  exUserCode: string;
  userId: string;
  name: string;
  hrUserId: string;
};

export type UpsertExternalUser = {
  firstname: string;
  lastname: string;
  contactNumber: string;
  email: string;
  password: string;
  isEdit: boolean;
  isActive: number;
  type: string;
  exUserCode: string;
  userId: string;
  name: string;
  isExpat: number;
  noOfUsers: number;
  hrUserId: string;
  contractStartDate: string;
  contractEndDate: string;
  designation: string;
  externalUserAccounts: ExternalUser[];
};

export type ExternalUserDetails = {
  AgentCode: string;
  AgentName: string;
  EmailID: string;
  Nationality: string;
  UserType: string;
  IsActive: boolean;
  NoOfUsers: number;
  StartDateOfContract: Date | undefined;
  EndDateOfContract: Date | undefined;
  Designation: string;
  UserName: string;
};
