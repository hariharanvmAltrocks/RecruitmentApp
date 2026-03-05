import { useState, useEffect } from 'react';
import { useVrrFormState } from './useVrrFormState';
import { CommonServices, getVRRDetails, laborHireService } from '../../../Services/ServiceExport';
import { DataSyncToRecruitmentResponse } from '../../../Services/RecruitmentProcess/IRecruitmentProcessService';
import { Choices, DataFrom, DocumentLibraray, RoleProfileMaster, StatusId } from '../../../utilities/Config';
import { useMasterData } from './useMasterData';
import { mapToAdvOption } from '../CommanFilter';
import { CheckboxGroupOption } from '../../../components/CustomCheckboxGroup';
import { MandatoryCheck } from '../VerificationCard/VerificationCard';

type VrrFormHook = ReturnType<typeof useVrrFormState>;

export const useVrrData = (stateValue: any, props: any, form: VrrFormHook) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!stateValue?.ID) {
            setIsLoading(false);
            return;
        }

        const fetchRoleProfileData = async (JobCodeID: number) => {
            try {
                const filterConditions = [{ FilterKey: "JobCode", Operator: "eq", FilterValue: JobCodeID }];
                const response = await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(filterConditions, "");

                if (response.status === 200 && response.data && response.data.length > 0) {
                    const items = response.data[0];
                    form.setAdvDetails(prevState => ({
                        ...prevState,
                        RoleDetailsID: items?.ID,
                        RolePurpose: items?.RolePurpose || "",
                        JobDescription: items?.JobDescription || "",
                        RolePurpose_fr: items?.RolePurpose_fr || "",
                        JobDescription_fr: items?.JobDescription_fr || "",
                        TotalExperience: items?.TotalExperience || { key: 0, text: "" },
                        ExperienceinMiningIndustry: items?.ExperienceinMiningIndustry || { key: 0, text: "" },
                        JobFunctionalType: items?.JobFunctionalType,
                        JobFunctionalType_fr: items?.JobFunctionalType_fr,
                        JobcodeChecked: true,
                        JobBasedBGVVerification: items.JobBasedBGVVerification,
                    }));
                    form.setRoleSpeKnowledgeValue(items.RoleSpeKnowledgeValue || []);
                    form.setTechnicalSkillValue(items.TechnicalSkillValue || []);
                    form.setQualificationValue(items.qualificationValue || { MinQualification: [], PrefeQualification: [] });
                } else {
                    const {
                        qualification,
                        roleSpecificKnowledge,
                        technicalSkills,
                        levelOfProficiency,
                        experience,
                        jobFunctionType
                    } = useMasterData();


                    form.setAdvDetails(prev => ({
                        ...prev,
                        JobcodeChecked: false,
                        MinQualificationOption: mapToAdvOption(qualification),
                        PrefeQualificationOption: mapToAdvOption(qualification),
                        RoleSpeKnowledgeoption: mapToAdvOption(roleSpecificKnowledge),
                        RequiredLeveloption: mapToAdvOption(levelOfProficiency),
                        TechnicalSkillsOption: mapToAdvOption(technicalSkills),
                        LevelProficiencyOption: mapToAdvOption(levelOfProficiency),
                        TotalExperienceOption: mapToAdvOption(experience),
                        ExperienceinMiningIndustryOption: mapToAdvOption(experience),
                        JobFunctionalTypeOption: mapToAdvOption(jobFunctionType)
                    }));
                    console.warn("No role profile data found for the given filter.");
                }
                    if (
            props.stateValue?.StatusId ===
            StatusId.PendingwithHRLeadtouploadONEMsigneddoc
          ) {
            try {
              const res = await laborHireService.GetBGVerificationType();
              let BGVOPtions: CheckboxGroupOption[] = res.data
                .filter((check: any) => !check.isDefault)
                .map((item: any, index: number) => ({
                  id: index + 1,
                  key: item?.reference,
                  description: item?.displayText,
                  checked: item?.isDefault,
                }));
                let RoleProfileRes = response.data ?? []
const rawVerification = RoleProfileRes?.JobBasedBGVVerification;
const verificationList = Array.isArray(rawVerification) ? rawVerification : [];

const resData = res?.data ?? [];

const RoleBGV = verificationList.flatMap((item: any, index: number) =>
  resData
    .filter((data: any) => data.reference === item.verificationType)
    .map((data: any) => ({
      id: index + 1,
      key: data.reference,
      description: data.displayText,
      checked: !!item?.isDefault, 
    }))
);

              let mandatoryChecks: MandatoryCheck[] = res.data
                .filter((check: any) => check.isDefault)
                .map((check: any, index: number) => ({
                  id: String(index + 1),
                  label: check.displayText || "Unnamed Check",
                  key: check.reference,
                }));

              form.setBvgVerification((prev) => ({
                ...prev,
                checkboxBGVOption: BGVOPtions,
                checkboxBGV: RoleBGV,
                mantoryChecks: mandatoryChecks,
              }));
              // console.log(res, "res");
            } catch (error) {
              console.error("Error in OpenComments:", error);
            }
          }
            } catch (err) {
                console.error("Error fetching role profile data:", err);
                setError("Failed to fetch role profile details.");
            }
        };

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {

                const filterConditionsRecruitment = [{ FilterKey: "ID", Operator: "eq", FilterValue: stateValue?.ID }];
                let filterConditions = [];
                  let Conditions = "and";
                filterConditions.push({
                    FilterKey: "StatusId",
                    Operator: "eq",
                    FilterValue: StatusId.ReadyforRecruitmentProcess,
                });
                filterConditions.push({
                    FilterKey: "IsDataSyncToRecruitment",
                    Operator: "eq",
                    FilterValue: Choices.Yes,
                });
                filterConditions.push({
                    FilterKey: "ItemCreated",
                    Operator: "eq",
                    FilterValue: Choices.No,
                });
                filterConditions.push({
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
                })
                const response =
        props.stateValue?.StatusId === StatusId.ReadyforRecruitmentProcess
          ? props.stateValue?.type === DataFrom.NewPosition
            ? await getVRRDetails.fetchNewPositionRequest(
                filterConditions,
                Conditions,
                props,
              )
            : props.stateValue?.type === DataFrom.ExistingPosition
              ? await getVRRDetails.GetAdditionalExistingPositionEditView(
                  filterConditions,
                  Conditions,
                  props,
                )
              : props.stateValue?.type === DataFrom.VacancyRecruitmentProcess
                ? await getVRRDetails.GetVacancyDetails(
                    filterConditions,
                    Conditions,
                    props,
                  )
                : undefined
          : await getVRRDetails.GetRecruitmentDetails(
              filterConditionsRecruitment,
              "and",
            );
               
                if (response && response.data && response.data.length > 0) {
                    const op: DataSyncToRecruitmentResponse = response.data[0];
                    const BUName = props?.BusinessUnitCodeAllColumn.find((item: any) => item.key === op?.BusinessUnitCodeId) || {};

                    const [
                        RoleProfileDocment,
                        GradingDocument,
                        AdvertismentDocment,
                        OnamSignedStampsDocment,
                    ] = await Promise.all([
                        CommonServices.GetAttachmentToLibrary(DocumentLibraray.RoleProfileMaster, op.JobCode, RoleProfileMaster.RoleProfile),
                        CommonServices.GetAttachmentToLibrary(DocumentLibraray.RoleProfileMaster, op.JobCode, RoleProfileMaster.Grading),
                        CommonServices.GetAttachmentToLibrary(DocumentLibraray.RecruitmentAdvertisementDocument, op.JobCode),
                        CommonServices.GetAttachmentToLibrary(DocumentLibraray.ONAMSignedStampDocuments, op.JobCode),
                    ]);

                    form.setFormState(prevState => ({
                        ...prevState,
                        ID: op.ID,
                        BusinessUnitCodeID: op.BusinessUnitCodeId,
            DepartmentID: op.DepartmentId,
            SubDepartmentID: op.SubDepartmentId,
            SectionID: op.SectionId,
            DepartmentCodeID: op.DepartmentCodeId,
            JobNameInEnglishID: op.JobTitleEnglishId,
            JobNameInFrenchID: op.JobTitleFrenchId,
            PatersonGradeID: op.PatersonGradeId,
            DRCGradeID: op.DRCGradeId,
                        JobCodeId: op.JobCodeId,
                        BusinessUnitCode: op.BusinessUnitCode || "",
                        BusinessUnitName: BUName.Name || "",
                        BusinessUnitDescription: BUName.Description || "",
                        Department: op.Department || "",
                        SubDepartment: op.SubDepartment || "",
                        Section: op.Section || "",
                        DepartmentCode: op.DepartmentCode || "",
                        Nationality: op.Nationality || "",
                        JobNameInEnglish: op.JobTitleEnglish || "",
                        JobNameInFrench: op.JobTitleFrench || "",
                        PatersonGrade: op.PatersonGrade || "",
                        DRCGrade: op.DRCGrade || "",
                        EmployementCategory: op.EmploymentCategory || "",
                        ContractType: op.TypeOfContract || "",
                        JobCode: op.JobCode || "",
                        AreaOfWork: op.AreaofWork || "",
                        NoofPositionAssigned: op.NumberOfPersonNeeded || "",
                        DateRequried: String(op.DateRequried) || "",
                         ReasonForVacancy: op.ReasonForVacancy || "",
            RecruitmentAuthorised: op.RecruitmentAuthorised || "",
            IsPayrollEmailed: op.IsPayrollEmailed || "",
             VacancyConfirmed: op.VacancyConfirmed || "",
                        RoleProfileDocument: RoleProfileDocment.data?.English || [],
                        RoleProfileDocument_fr: RoleProfileDocment.data?.French || [],
                        GradingDocument: GradingDocument.data?.English || [],
                        GradingDocument_fr: GradingDocument.data?.French || [],
                        AdvertisementDocument: AdvertismentDocment.data || [],
                        OnamSignedStampsDocument: OnamSignedStampsDocment.data || [],
                    }));
                    await fetchRoleProfileData(op.JobCodeId);
                  
                } else {
                    throw new Error("No recruitment details found.");
                }
            } catch (err: any) {
                console.error("Failed to fetch Vacancy Details:", err);
                setError(err.message || "An unknown error occurred during data fetching.");
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();

    }, [stateValue?.ID]);

    return { isLoading, error };
};