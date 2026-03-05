import { useState, useCallback } from 'react';
import { AdvDetails, BGVState, QualificationValue, RecuritmentData, RoleSpecKnowledge, TechnicalSkills } from '../../../Models/RecuritmentVRR';
import { AutoCompleteItem } from '../../../Models/Screens';
import { calculateValidTo } from '../CommanFilter';
import { IDocFiles } from '../../../Services/SPService/ISPServicesProps';
import IsValid from '../../../components/Validation';
import { Nationality, RoleID, StatusId } from '../../../utilities/Config';


const todaydate = new Date();
const initialAdvDetailsState: AdvDetails = {
    RoleDetailsID: 0,
    MinQualificationOption: [],
    PrefeQualificationOption: [],
    RoleSpeKnowledgeoption: [],
    RequiredLeveloption: [],
    TechnicalSkillsOption: [],
    LevelProficiencyOption: [],
    RolePurpose: "",
    JobDescription: "",
    addMasterQualification: "",
    TotalExperience: { key: 0, text: "" },
    ExperienceinMiningIndustry: { key: 0, text: "" },
    TotalExperienceOption: [],
    ExperienceinMiningIndustryOption: [],
    YearofExperience: " ",
    PreferredExperience: "",
    ValidFrom: todaydate,
    ValidTo: calculateValidTo(todaydate, 13),
    FunctionType: "",
    JobFunctionalType: { key: 0, text: "" },
    JobFunctionalTypeOption: [],
    addMasterMinimumQualification: "",
    AdvertisementAttachement: [],
    JobcodeChecked: false,
    JobTitleofFunctionalManager: { key: 0, text: "" },
    FunctionalManagerName: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor: { key: 0, text: "" },
    LineManagerSupervisorName: { key: 0, text: "" },
    JobFunctionalType_fr: { key: 0, text: "" },
    JobDescription_fr: "",
    RolePurpose_fr: "",
    IsMasterData: false,
    JobTilteFunctionalManager_fr: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor_fr: { key: 0, text: "" },
    JobTitleofFunctionalManagerOption: [],
    JobTitleofLineManagerSupervisorOption: [],
    JobBasedBGVVerification: [],
};

const initialFormState: RecuritmentData = {
    VRRID: 0, BusinessUnitCodeID: 0, DepartmentID: 0, SubDepartmentID: 0, SectionID: 0, DepartmentCodeID: 0,
    JobNameInEnglishID: 0, JobNameInFrenchID: 0, PatersonGradeID: 0, DRCGradeID: 0, JobCodeId: 0,
    BusinessUnitCode: "", BusinessUnitName: "", BusinessUnitDescription: "", Department: "", SubDepartment: "", Section: "", DepartmentCode: "",
    Nationality: "", JobNameInEnglish: "", JobNameInFrench: "", NoofPositionAssigned: "", PatersonGrade: "", DRCGrade: "",
    EmployementCategory: "", ContractType: "", JobCode: "", AreaOfWork: "", ReasonForVacancy: "", RecruitmentAuthorised: "",
    IsPayrollEmailed: "", EnterNumberOfMonths: 0, DateRequried: "", IsRevert: "", VacancyConfirmed: "",
    RoleProfileDocument: [], GradingDocument: [], AdvertisementDocument: [],
    AssignRecruitmentHR: { key: 0, text: "" }, AssignRecruitmentHROption: [], OnamSignedStampsAttchment: [],
    OnamSignedStampsDocument: [], AssignAgencies: { key: 0, text: "" }, AssignAgenciesOption: [],
    CandidateCVAttachment: [], Comments: "", SignDate: todaydate, RoleProfileDocument_fr: [], GradingDocument_fr: [],
};

// const initialValidationErrors = {
//     AssignRecruitmentHR: false, AssignAgencies: false, Comments: false, AdvertisementAttachement: false,
//     OnamSignedStampsAttchment: false, MinQualification: false, PrefeQualification: false,
//     RoleSpeKnowledgeValidation: [], technicalSkillsKnowledge: [], RolePurpose: false, JobDescription: false,
//     TotalExperience: false, ExperienceinMiningIndustry: false, addMasterQualification: false,
//     Checkboxalidation: false, ValidFrom: false, ValidTo: false, JobFunctionalType: false,
//     addMasterMinimumQualification: false, RoleProfile: false, Grading: false,
//     JobTitleofFunctionalManager: false, FunctionalManagerName: false, JobTitleofLineManagerSupervisor: false,
//     LineManagerSupervisorName: false, BVGVerification: false, RolePurpose_fr: false, JobDescription_fr: false,
// };
export type ValidationErrorsType = {
    AssignRecruitmentHR: boolean;
    AssignAgencies: boolean;
    Comments: boolean;
    AdvertisementAttachement: boolean;
    OnamSignedStampsAttchment: boolean;
    MinQualification: boolean;
    PrefeQualification: boolean;

    RoleSpeKnowledgeValidation: {
        RoleSpeKnowledge: boolean;
        RequiredLevel: boolean;
    }[];

    technicalSkillsKnowledge: {
        TechnicalSkills: boolean;
        LevelProficiency: boolean;
    }[];

    RolePurpose: boolean;
    JobDescription: boolean;
    TotalExperience: boolean;
    ExperienceinMiningIndustry: boolean;
    addMasterQualification: boolean;
    isSignatureChecked: boolean;
    ValidFrom: boolean;
    ValidTo: boolean;
    JobFunctionalType: boolean;
    addMasterMinimumQualification: boolean;
    RoleProfile: boolean;
    Grading: boolean;
    JobTitleofFunctionalManager: boolean;
    FunctionalManagerName: boolean;
    JobTitleofLineManagerSupervisor: boolean;
    LineManagerSupervisorName: boolean;
    BVGVerification: boolean;
    RolePurpose_fr: boolean;
    JobDescription_fr: boolean;
};


const initialValidationErrors: ValidationErrorsType = {
    AssignRecruitmentHR: false,
    AssignAgencies: false,
    Comments: false,
    AdvertisementAttachement: false,
    OnamSignedStampsAttchment: false,
    MinQualification: false,
    PrefeQualification: false,

    RoleSpeKnowledgeValidation: [],
    technicalSkillsKnowledge: [],

    RolePurpose: false,
    JobDescription: false,
    TotalExperience: false,
    ExperienceinMiningIndustry: false,
    addMasterQualification: false,
    isSignatureChecked: false,
    ValidFrom: false,
    ValidTo: false,
    JobFunctionalType: false,
    addMasterMinimumQualification: false,
    RoleProfile: false,
    Grading: false,
    JobTitleofFunctionalManager: false,
    FunctionalManagerName: false,
    JobTitleofLineManagerSupervisor: false,
    LineManagerSupervisorName: false,
    BVGVerification: false,
    RolePurpose_fr: false,
    JobDescription_fr: false,
};


export const useVrrFormState = () => {
    const [formState, setFormState] = useState<RecuritmentData>(initialFormState);
    const [advDetails, setAdvDetails] = useState<AdvDetails>(initialAdvDetailsState);
    const [qualificationValue, setQualificationValue] = useState<QualificationValue>({ MinQualification: [], PrefeQualification: [], MinQualification_fr: [], PrefeQualification_fr: [] });
    const [roleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<RoleSpecKnowledge[]>([{ RoleSpeKnowledge: { key: 0, text: "" }, RequiredLevel: { key: 0, text: "" }, RoleSpeKnowledge_fr: { key: 0, text: "" }, RequiredLevel_fr: { key: 0, text: "" } }]);
    const [technicalSkillValue, setTechnicalSkillValue] = useState<TechnicalSkills[]>([{ TechnicalSkills: { key: 0, text: "" }, LevelProficiency: { key: 0, text: "" }, TechnicalSkills_fr: { key: 0, text: "" }, LevelProficiency_fr: { key: 0, text: "" } }]);
    const [validationErrors, setValidationErrors] = useState<any>(initialValidationErrors);
    const [bvgVerification, setBvgVerification] = useState<BGVState>({ checkboxBGV: [], checkboxBGVOption: [], mantoryChecks: [] });
    const [isSignatureChecked, setSignatureChecked] = useState<boolean>(false);
    const [experienceValidationError, setExperienceValidationError] = useState<boolean>(false);


    

    const clearError = (field: string) => {
        setValidationErrors((prev: any) => ({ ...prev, [field]: false }));
    };

    const handleFormStateChange = useCallback((value: any, field: keyof RecuritmentData) => {
        setFormState(prev => ({ ...prev, [field]: value }));
        clearError(field as string);
    }, []);

    const handleAdvDetailsChange = useCallback((value: any, field: keyof AdvDetails) => {
        setAdvDetails(prev => ({ ...prev, [field]: value }));
        clearError(field as string);
    }, []);

    const handleDateChange = useCallback((date: Date | null, field: keyof AdvDetails) => {
        setAdvDetails((prev) => {
            const updated = { ...prev, [field]: date };
            if (field === "ValidFrom" && date) {
                updated.ValidTo = calculateValidTo(date, 13);
            }
            return updated;
        });
        clearError(field as string);
    }, []);

    const handleFileAction = useCallback((field: string, files: IDocFiles[], action: 'upload' | 'delete', index?: number) => {
        const isAdvField = field === "AdvertisementAttachement";
        const setter = isAdvField ? setAdvDetails : setFormState;

        setter((prev: any) => {
            if (action === 'upload') return { ...prev, [field]: files };
            if (action === 'delete' && index !== undefined) {
                const updated = [...(prev[field] || [])];
                updated.splice(index, 1);
                return { ...prev, [field]: updated };
            }
            return prev;
        });
        clearError(field);
    }, []);

    const handleRichTextEditor = useCallback((value: string, field: string, currentTab: number) => {
        const targetField = currentTab === 1 ? `${field}_fr` : field;
        setAdvDetails(prev => ({ ...prev, [targetField]: value }));
        clearError(targetField);
    }, []);

    const handleAutoComplete = useCallback((item: AutoCompleteItem | null, field: string, currentTab: number) => {
        let targetField = field;
        if (currentTab === 1) {
            if (field === "JobTitleofFunctionalManager") targetField = "JobTilteFunctionalManager_fr";
            if (field === "JobTitleofLineManagerSupervisor") targetField = "JobTitleofLineManagerSupervisor_fr";
        }

        setAdvDetails(prev => ({ ...prev, [targetField]: item || { key: 0, text: "" } }));
        clearError(targetField);
    }, []);

    const handleMultiSelect = useCallback((value: AutoCompleteItem[], field: keyof QualificationValue) => {
        setQualificationValue(prev => ({ ...prev, [field]: value }));
        clearError(field);
    }, []);

    const handleDynamicRowUpdate = useCallback((
        type: 'role' | 'skill',
        index: number,
        field: string,
        item: AutoCompleteItem | null
    ) => {
        const setter = type === 'role' ? setRoleSpeKnowledgeValue : setTechnicalSkillValue;
        setter((prev: any) => prev.map((row: any, i: number) => i === index ? { ...row, [field]: item } : row));

        setValidationErrors((prev: any) => {
            const errKey = type === 'role' ? 'RoleSpeKnowledgeValidation' : 'technicalSkillsKnowledge';
            const newErrors = [...(prev[errKey] || [])];
            if (newErrors[index]) newErrors[index][field] = false;
            return { ...prev, [errKey]: newErrors };
        });
    }, []);

    const handleBvgToggle = useCallback((id: string) => {
        setBvgVerification(prev => ({
            ...prev,
            checkboxBGVOption: prev.checkboxBGVOption.map(check =>
                String(check.id) === String(id) ? { ...check, checked: !check.checked } : check
            )
        }));
        clearError('BVGVerification');
    }, []);

    const handleAddRow = useCallback((type: 'role' | 'skill') => {
        if (type === 'role') {
            const index = roleSpeKnowledgeValue.length - 1;
            const currentItem = roleSpeKnowledgeValue[index];
            const isRoleKnowledgeValid = IsValid(currentItem?.RoleSpeKnowledge.text);
            const isRequiredLevelValid = IsValid(currentItem?.RequiredLevel.text);

            setValidationErrors((prevErrors: { RoleSpeKnowledgeValidation: any; }) => {
                const updatedErrors = [...prevErrors.RoleSpeKnowledgeValidation];
                updatedErrors[index] = {
                    RoleSpeKnowledge: !isRoleKnowledgeValid,
                    RequiredLevel: !isRequiredLevelValid,
                };
                return { ...prevErrors, RoleSpeKnowledgeValidation: updatedErrors };
            });

            if (isRoleKnowledgeValid && isRequiredLevelValid) {
                setRoleSpeKnowledgeValue(prevState => [...prevState, { RoleSpeKnowledge: { key: 0, text: "" }, RequiredLevel: { key: 0, text: "" }, RoleSpeKnowledge_fr: { key: 0, text: "" }, RequiredLevel_fr: { key: 0, text: "" } }]);
                setValidationErrors((prevErrors: { RoleSpeKnowledgeValidation: any; }) => ({ ...prevErrors, RoleSpeKnowledgeValidation: [...prevErrors.RoleSpeKnowledgeValidation, { RoleSpeKnowledge: false, RequiredLevel: false }] }));
            }
        } else if (type === 'skill') {
            const index = technicalSkillValue.length - 1;
            const currentItem = technicalSkillValue[index];
            const isTechnicalSkillValid = IsValid(currentItem?.TechnicalSkills.text);
            const isLevelProficiencyValid = IsValid(currentItem?.LevelProficiency.text);

            setValidationErrors((prevErrors: { technicalSkillsKnowledge: any; }) => {
                const updatedErrors = [...prevErrors.technicalSkillsKnowledge];
                updatedErrors[index] = {
                    TechnicalSkills: !isTechnicalSkillValid,
                    LevelProficiency: !isLevelProficiencyValid,
                };
                return { ...prevErrors, technicalSkillsKnowledge: updatedErrors };
            });

            if (isTechnicalSkillValid && isLevelProficiencyValid) {
                setTechnicalSkillValue(prevState => [...prevState, { TechnicalSkills: { key: 0, text: "" }, LevelProficiency: { key: 0, text: "" }, TechnicalSkills_fr: { key: 0, text: "" }, LevelProficiency_fr: { key: 0, text: "" } }]);
                setValidationErrors((prevErrors: { technicalSkillsKnowledge: any; }) => ({ ...prevErrors, technicalSkillsKnowledge: [...prevErrors.technicalSkillsKnowledge, { TechnicalSkills: false, LevelProficiency: false }] }));
            }
        }
    }, [roleSpeKnowledgeValue, technicalSkillValue]); 

    const handleDeleteRow = useCallback((type: 'role' | 'skill', index: number) => {
        if (type === 'role') {
            setRoleSpeKnowledgeValue(prevState => prevState.filter((_, i) => i !== index));
            setValidationErrors((prev: { RoleSpeKnowledgeValidation: any[]; }) => ({ ...prev, RoleSpeKnowledgeValidation: prev.RoleSpeKnowledgeValidation.filter((_, i) => i !== index) }));
        } else if (type === 'skill') {
            setTechnicalSkillValue(prevState => prevState.filter((_, i) => i !== index));
            setValidationErrors((prev: { technicalSkillsKnowledge: any[]; }) => ({ ...prev, technicalSkillsKnowledge: prev.technicalSkillsKnowledge.filter((_, i) => i !== index) }));
        }
    }, []);

    const handleInputChangeTextArea = useCallback((
        value: string | any,
        StateValue: string,
    ) => {
        setFormState((prevState) => ({
            ...prevState,
            [StateValue]: value,
        }));
        setValidationErrors((prevState: any) => ({
            ...prevState,
            [StateValue]: false,
        }));
    }, []);

     const handlecheckChanges = useCallback((
        value: boolean,
        StateValue: string,
    ) => {
        setSignatureChecked(value);
        setValidationErrors((prevState: any) => ({
            ...prevState,
            [StateValue]: false,
        }));
    }, []);

       const validateandSubmit = useCallback((currentRoleID: number, statusId: number, currentTab: string) => {
        let errors: ValidationErrorsType = { ...initialValidationErrors };
        const { AssignRecruitmentHR, Comments, OnamSignedStampsAttchment, Nationality: nation, AdvertisementDocument } = formState;
        const isCheckValid = isSignatureChecked;

        switch (currentRoleID) {
            case RoleID.RecruitmentHRLead:
                errors.Comments = !IsValid(Comments);
                errors.isSignatureChecked = !isCheckValid;
                if (currentTab === "tab1") {
                    errors.AssignRecruitmentHR = !IsValid(AssignRecruitmentHR.text);
                } else if (currentTab === "tab2") {
                    errors.OnamSignedStampsAttchment = !IsValid(OnamSignedStampsAttchment);
                    if (nation === Nationality.Expatriate) {
                        errors.BVGVerification = !bvgVerification.checkboxBGVOption?.some(opt => opt.checked);
                    }
                }
                break;

            case RoleID.RecruitmentHR:
                if (statusId === StatusId.PendingwithRecruitmentHRtouploadAdv) {
                    errors.Comments = !IsValid(Comments);
                    errors.isSignatureChecked = !isCheckValid;

                    // Ad Attachment check
                    if (AdvertisementDocument.length === 0) {
                        errors.AdvertisementAttachement = !IsValid(advDetails.AdvertisementAttachement);
                    }

                    if (!advDetails.JobcodeChecked) {
                        errors.MinQualification = !IsValid(qualificationValue.MinQualification[0]?.text);
                        errors.PrefeQualification = !IsValid(qualificationValue.PrefeQualification[0]?.text);
                        errors.RolePurpose = !IsValid(advDetails.RolePurpose);
                        errors.JobDescription = !IsValid(advDetails.JobDescription);
                        errors.RolePurpose_fr = !IsValid(advDetails.RolePurpose_fr);
                        errors.JobDescription_fr = !IsValid(advDetails.JobDescription_fr);
                        errors.ExperienceinMiningIndustry = !IsValid(advDetails.ExperienceinMiningIndustry.text);
                        errors.TotalExperience = !IsValid(advDetails.TotalExperience.text);
                        errors.JobFunctionalType = !IsValid(advDetails.JobFunctionalType.text);
                        errors.JobTitleofFunctionalManager = !IsValid(advDetails.JobTitleofFunctionalManager.text);
                        errors.FunctionalManagerName = !IsValid(advDetails.FunctionalManagerName);
                        errors.JobTitleofLineManagerSupervisor = !IsValid(advDetails.JobTitleofLineManagerSupervisor.text);
                        errors.LineManagerSupervisorName = !IsValid(advDetails.LineManagerSupervisorName);

                        // Validate every row in dynamic arrays
                        errors.RoleSpeKnowledgeValidation = roleSpeKnowledgeValue.map(row => ({
                            RoleSpeKnowledge: !IsValid(row.RoleSpeKnowledge.text),
                            RequiredLevel: !IsValid(row.RequiredLevel.text)
                        }));
                        errors.technicalSkillsKnowledge = technicalSkillValue.map(row => ({
                            TechnicalSkills: !IsValid(row.TechnicalSkills.text),
                            LevelProficiency: !IsValid(row.LevelProficiency.text)
                        }));
                    }
                }
                break;

            case RoleID.HOD:
            case RoleID.LineManager:
                if (currentTab === "tab1") {
                    errors.Comments = !IsValid(Comments);
                    errors.isSignatureChecked = !isCheckValid;
                }
                break;
        }

        setValidationErrors(errors);

        const hasStaticErrors = (Object.keys(errors) as Array<keyof ValidationErrorsType>).some(key => 
            typeof errors[key] === 'boolean' && errors[key] === true
        );
        const hasKnowledgeErrors = errors.RoleSpeKnowledgeValidation.some(e => e.RoleSpeKnowledge || e.RequiredLevel);
        const hasSkillErrors = errors.technicalSkillsKnowledge.some(e => e.TechnicalSkills || e.LevelProficiency);

        return hasStaticErrors || hasKnowledgeErrors || hasSkillErrors;
    }, [formState, advDetails, qualificationValue, roleSpeKnowledgeValue, technicalSkillValue, bvgVerification, isSignatureChecked]);

  
    const NextValidation = useCallback((tab: string): boolean => {
        let tabErrors = {
            AdvertisementAttachement: false,
            RoleProfile: false,
            Grading: false,
        };

        if (tab === "tab1") {
            if (formState.AdvertisementDocument.length === 0) {
                tabErrors.AdvertisementAttachement = IsValid(advDetails.AdvertisementAttachement);
            }
        }

        setValidationErrors((prev: any) => ({ ...prev, ...tabErrors }));
        return Object.values(tabErrors).some(err => err === true);
    }, [formState.AdvertisementDocument, advDetails.AdvertisementAttachement]);

    return {
        formState, advDetails, qualificationValue, roleSpeKnowledgeValue, technicalSkillValue,
        validationErrors, bvgVerification, isSignatureChecked, experienceValidationError, 
        setFormState, setAdvDetails, setValidationErrors, setSignatureChecked,setBvgVerification,
        // Methods
        handleFormStateChange,
        handleAdvDetailsChange,
        handleDateChange,
        handleFileAction,
        handleRichTextEditor,
        handleAutoComplete,
        handleMultiSelect,
        handleDynamicRowUpdate,
        handleBvgToggle,
        setExperienceValidationError,
        handleAddRow,
        handleDeleteRow,
        handleInputChangeTextArea,
        handlecheckChanges,

        setQualificationValue,
        setRoleSpeKnowledgeValue,
        setTechnicalSkillValue,

        handleFileAttachment: (field: string, files: IDocFiles[]) =>
            handleFileAction(field, files, 'upload'),

        handleDelete: (index: number, field: string) =>
            handleFileAction(field, [], 'delete', index),

        handleMulitiSelect: handleMultiSelect, // Correcting the 'i' typo used in your UI

        handleInputChange: handleAdvDetailsChange,

        handleAutoCompleterow: (item: AutoCompleteItem | null, key: string, index: number, stateKey: string) =>
            handleDynamicRowUpdate(stateKey === 'TechnicalSkillValue' ? 'skill' : 'role', index, key, item),

         validateandSubmit,
        NextValidation
    };
};
export type VrrFormHook = ReturnType<typeof useVrrFormState>;