import { SpiltDateOnly } from "../../../components/TabMerge";
import { CommonServices, getVRRDetails, laborHireService } from "../../../Services/ServiceExport";
import SPServices from "../../../Services/SPService/SPServices";
import { DocumentLibraray, ListNames, NationalityCode, RecuritmentHRMsg, ResponeStatus, WorkflowAction } from "../../../utilities/Config";

const serialize = (arr: any[], mapFn: (item: any) => object) => 
  (arr && arr.length > 0) ? JSON.stringify(arr.map(mapFn)) : "[]";

export const updateMainRecord = async (form: any, props: any, currentRoleID: number, extraData = {}) => {
  const { formState } = form;
  const payload = { 
    ActionId: WorkflowAction.Approved, 
    ItemCreated: "Yes", 
    ...extraData 
  };
  
  const tasks: Promise<any>[] = [
    SPServices.SPUpdateItem({ 
        Listname: ListNames.HRMSRecruitmentDptDetails, 
        RequestJSON: payload, 
        ID: props.stateValue?.ID 
    })
  ];

  if (formState.Comments) {
    tasks.push(getVRRDetails.InsertCommentsList({ 
        RoleId: currentRoleID, 
        RecruitmentIDId: props.stateValue?.ID, 
        Comments: formState.Comments 
    }));
  }
  return Promise.all(tasks);
};

export const handleHRLeadProcess = async (
  form: any, 
  props: any, 
  currentRoleID: number, 
  finalize: (msg: string, type?: string) => void // Fixed here
) => {
  const { formState, advDetails, bvgVerification } = form;
  const filterConditions = [
                {
                  FilterKey: "JobCode",
                  Operator: "eq",
                  FilterValue: formState.JobCodeId,
                },
              ];
              const Conditions = "";
  const portalRes = await getVRRDetails.UploadAdvertisementInPortal(filterConditions, Conditions, formState, advDetails, props, 1, 0);
  if (portalRes?.status !== 200) throw new Error("Portal Error");

//   const dept = props.Department?.find((i: any) => i.key === formState.DepartmentID);
                  const DepartmentCode = props.Department.find(
                  (item: { key: number }) =>
                    item.key === formState.DepartmentID,
                );
  const bgvData = bvgVerification.checkboxBGVOption
    .filter((i: any) => i.checked)
    .map((i: any) => ({
      jobCode: formState.JobCode,
      verificationType: i.key,
      department: DepartmentCode.code || "",
      nationality: NationalityCode.SouthAfrica, 
      isActive: i.checked 
    }));

  const bgvRes = await laborHireService.UpsertBGVJobMaster(bgvData);
  if (bgvRes.status !== ResponeStatus.SUCCESS) throw new Error("BGV Error");

  await Promise.all([
    updateMainRecord(form, props, currentRoleID, {
      JobPostingStartDate: advDetails.ValidFrom ? SpiltDateOnly(advDetails.ValidFrom) : "",
      JobPostingEndDate: advDetails.ValidTo ? SpiltDateOnly(advDetails.ValidTo) : ""
    }),
    CommonServices.uploadAttachmentToLibrary(
        formState.JobCode, 
        formState.OnamSignedStampsAttchment || [], 
        "ONAMSignedStampDocuments" 
    ),
    SPServices.SPUpdateItem({
      Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
      RequestJSON: { 
        JobBasedBGVVerification: serialize(bvgVerification.checkboxBGVOption, i => ({ verificationType: i.key, isActive: i.checked })) 
      },
      ID: advDetails?.RoleDetailsID
    })
  ]);
  finalize(RecuritmentHRMsg.ONEMDocumentMsg);
};

export const handleHRProcess = async (
  form: any, 
  props: any, 
  currentRoleID: number, 
  finalize: (msg: string, type?: string) => void // Fixed here
) => {
  const { formState, advDetails, qualificationValue, roleSpeKnowledgeValue, technicalSkillValue } = form;

  const advData = {
    Qualification: serialize(qualificationValue.MinQualification, i => ({ MinQualification: String(i.key) })),
    PreferredQualification: serialize(qualificationValue.PrefeQualification, i => ({ PrefeQualification: String(i.key) })),
    RoleSpecificKnowledgeJson: serialize(roleSpeKnowledgeValue, i => ({ RoleSpeKnowledge: String(i.RoleSpeKnowledge.key), RequiredLevel: String(i.RequiredLevel.key) })),
    TechnicalSkillsKnowledgeJson: serialize(technicalSkillValue, i => ({ TechnicalSkills: String(i.TechnicalSkills.key), LevelProficiency: String(i.LevelProficiency.key) })),
    JobDescription: advDetails.JobDescription,
    RoleProfile: advDetails.RolePurpose,
    JobCodeId: formState.JobCodeId,
    TotalPreferredExperienceId: Number(advDetails.TotalExperience.key),
    PreferredExperienceId: Number(advDetails.ExperienceinMiningIndustry.key),
    FunctionTypeId: advDetails.JobFunctionalType.key,
    JobTitleofFunctionalManagerId: advDetails.JobTitleofFunctionalManager.key,
    JobTitleofLMorSupervisorId: advDetails.JobTitleofLineManagerSupervisor.key,
    FunctionalManagerName: advDetails.FunctionalManagerName?.text || "",
    LineManagerorSupervisorName: advDetails.LineManagerSupervisorName?.text || "",
    JobDescriptionFrench: advDetails.JobDescription_fr,
    RoleProfileFrench: advDetails.RolePurpose_fr,
  };

  if (!advDetails.JobcodeChecked) {
    const roleRes = await getVRRDetails.InsertList(advData, ListNames.HRMSRecruitmentRoleProfileDetails);
    if (roleRes?.status !== ResponeStatus.SUCCESS) throw new Error("Role Profile Error");
  }
const filterConditions = [
                {
                  FilterKey: "JobCode",
                  Operator: "eq",
                  FilterValue: formState.JobCodeId,
                },
              ];
              const Conditions = "";
  const portalRes = await getVRRDetails.UploadAdvertisementInPortal(filterConditions, Conditions, formState, advDetails, props, 0, 0);
  if (portalRes.status !== ResponeStatus.SUCCESS) throw new Error("Portal Error");

  await Promise.all([
    updateMainRecord(form, props, currentRoleID),
    CommonServices.uploadAttachmentToLibrary(
        formState.JobCode, 
        advDetails?.AdvertisementAttachement || [], 
        DocumentLibraray.RecruitmentAdvertisementDocument
    )
  ]);

  finalize(formState?.AdvertisementDocument?.length === 0 ? RecuritmentHRMsg.AdvertisementSubmitMsg : RecuritmentHRMsg.AdvertisementReveiwMsg);
};