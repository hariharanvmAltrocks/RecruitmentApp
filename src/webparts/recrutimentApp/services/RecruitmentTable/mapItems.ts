import moment from "moment";
import { DataSyncToRecruitmentResponse } from "./IRecruitmentService";

export const _mapRecruitmentItems = (res: any[]): DataSyncToRecruitmentResponse[] => {
  return res.map((item, index) => ({
    ID:                             item.ID,
    RecordID:                       index + 1,
    BusinessUnitCode:               item.BusinessUnitCode?.BusineesUnitCode    ?? "",
    BusinessUnitCodeId:             item.BusinessUnitCodeId                    ?? "",
    BusinessUnitName:               "",
    BusinessUnitDescription:        "",
    Nationality:                    item.Nationality,
    Department:                     item.Department?.DepartmentName            ?? "",
    DepartmentId:                   item.DepartmentId,
    SubDepartment:                  item.SubDepartment?.SubDepTitle            ?? "",
    SubDepartmentId:                item.SubDepartmentId,
    Section:                        item.Section?.SectionName                 ?? "",
    SectionId:                      item.SectionId,
    DepartmentCodeId:               item.DepartmentCodeId,
    DepartmentCode:                 item.DepartmentCode?.DptCode              ?? "",
    EmploymentCategory:             item.EmploymentCategory,
    TypeOfContract:                 item.TypeOfContract,
    NumberOfPersonNeeded:           item.NumberOfPersonNeeded,
    EnterNumberOfMonths:            item.EnterNumberOfMonths,
    AreaofWork:                     item.AreaofWork,
    DateRequried:                   item.DateRequried                         ?? "",
    Type:                           item.DataFrom                             ?? "",
    Status:                         item.Status?.StatusDescription            ?? "",
    StatusId:                       item.StatusId,
    Action:                         item.Action?.Action                       ?? "",
    ActionTypeId:                   item.ActionId                             ?? "",
    Location:                       item.Location                             ?? "",
    JobCodeId:                      item.JobCode?.ID                          ?? 0,
    JobCode:                        item.JobCode?.JobCode                     ?? "",

    // Filled after position fetch
    JobTitleEnglish:                "",
    JobTitleFrench:                 "",
    PatersonGrade:                  "",
    DRCGrade:                       "",
    JobTitleEnglishId:              0,
    JobTitleFrenchId:               0,
    PatersonGradeId:                0,
    DRCGradeId:                     0,

    Checked:                        false,
    VacancyConfirmed:               item.VacancyConfirmed                     ?? "",
    RecruitmentAuthorised:          item.RecruitmentAuthorised                ?? "",
    IsPayrollEmailed:               item.IsPayrollEmailed                     ?? "",
    AssignedHR:                     " ",
    AssignedHRId:                   0,
    AssignLineManager:              item.LineManager                          ?? "",
    AssignLineManagerId:            item.AssignLineManagerId                  ?? 0,
    ReasonForVacancy:               item.ReasonForVacancy                     ?? "",
    JobPostingStartDate:            item.JobPostingStartDate
                                      ? moment(item.JobPostingStartDate).format("YYYY-MM-DD")
                                      : undefined,
    JobPostingEndDate:              item.JobPostingEndDate
                                      ? moment(item.JobPostingEndDate).format("YYYY-MM-DD")
                                      : undefined,
    JobPostingFirstExtensionEndDate: item.JobPostingFirstExtensionEndDate
                                      ? moment(item.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD")
                                      : undefined,
    JobPostingSecondExtensionEndDate: item.JobPostingSecondExtensionEndDate
                                      ? moment(item.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD")
                                      : undefined,
    AssignEMail:                    item.AssignedHR,
    AssignHOD:                      item.HOD,
    AssignHRLead:                   item.RecruitmentHRLead                    ?? "",
    QuestionByHR:                   item.QuestionByHR                         ?? "",
    QuestionByLM:                   item.QuestionByLM                         ?? "",
    ModifiedDate:                   item.ModifiedDate                         ?? "",
    CreatedDate:                    item.CreatedDate                          ?? "",
  }));
}