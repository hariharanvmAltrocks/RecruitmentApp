import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import {
    CommonServices,
    GetPortalJobsService,
    getVRRDetails,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import { Icon, Label } from "office-ui-fabric-react";
import AttachmentButton from "../../components/AttachmentButton";
import {
    DocumentLibraray,
    HRMSAlertOptions,
    ListNames,
    Nationality,
    RecuritmentHRMsg,
    RoleDescription,
    RoleDescriptionData,
    RoleID,
    RoleProfileMaster,
    StatusId,
    TabName,
    WorkflowAction,
} from "../../utilities/Config";

import CustomAutoComplete from "../../components/CustomAutoComplete";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import {
    AdvDetails,
    QualificationValue,
    RecuritmentData,
    RoleSpecKnowledge,
    TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import ReuseButton from "../../components/ReuseButton";
import CommanComments from "../../components/CommanComments";
import {
    CommentsData,
    InsertComments,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomViewDocument from "../../components/CustomViewDocument";
import RichTextEditor from "../../components/CustomRichTextEditor";
import PreviewScreen from "./PreviewScreen";
import { Dialog } from "primereact/dialog";
import SPServices from "../../Services/SPService/SPServices";
import BreadcrumbsComponent, {
    TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomPreviewScreen from "./CustomPreviewScreen";
import CustomDatePicker from "../../components/CustomDatePicker";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import * as moment from "moment";
import {
    AdvertisementDetails,
    Descriptions,
    MinAndPreferedQualifications,
    RoleAndTechSkills,
} from "../../Models/ApIInterface";
import CustomButton from "../../components/CustomButton";
import CustomMultiSelect from "../../components/CustomMultiSelect";
// import { AdvertisementDetails, Descriptions, MinAndPreferedQualifications, RoleAndTechSkills } from "../../Models/ApIInterface";

type formValidation = {
    AssignRecruitmentHR: boolean;
    AssignAgencies: boolean;
    Comments: boolean;
    AdvertisementAttachement: boolean;
    OnamSignedStampsAttchment: boolean;
    MinQualification: boolean;
    PrefeQualification: boolean;
    RoleSpeKnowledge: boolean;
    RequiredLevel: boolean;
    TechnicalSkills: boolean;
    LevelProficiency: boolean;
    RolePurpose: boolean;
    JobDescription: boolean;
    TotalExperience: boolean;
    ExperienceinMiningIndustry: boolean;
    addMasterQualification: boolean;
    Checkboxalidation: boolean;
    ValidFrom: boolean;
    ValidTo: boolean;
    JobFunctionalType: boolean;
};

const ApprovedVRREdit: React.FC = (props: any) => {
    console.log(props, "propsApprovedVRREdit");

    const todaydate = new Date();
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [alertProps, setalertProps] = React.useState<alertPropsData>({
        Message: "",
        Type: "",
        ButtonAction: null,
        visible: false,
    });
    // const [ButtonLabel, setButtonLabel] = useState<string>("Submit");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [advDetails, setAdvDetails] = useState<AdvDetails>({
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
        ValidFrom: undefined,
        ValidTo: undefined,
        FunctionType: "",
        JobFunctionalType: { key: 0, text: "" },
        JobFunctionalTypeOption: [],
    });
    const [formState, setFormState] = useState<RecuritmentData>({
        VRRID: 0,
        BusinessUnitCodeID: 0,
        DepartmentID: 0,
        SubDepartmentID: 0,
        SectionID: 0,
        DepartmentCodeID: 0,
        JobNameInEnglishID: 0,
        JobNameInFrenchID: 0,
        PatersonGradeID: 0,
        DRCGradeID: 0,
        JobCodeID: 0,
        BusinessUnitCode: "",
        BusinessUnitName: "",
        BusinessUnitDescription: "",
        Department: "",
        SubDepartment: "",
        Section: "",
        DepartmentCode: "",
        Nationality: "",
        JobNameInEnglish: "",
        JobNameInFrench: "",
        NoofPositionAssigned: "",
        PatersonGrade: "",
        DRCGrade: "",
        EmployementCategory: "",
        ContractType: "",
        JobCode: "",
        AreaOfWork: "",
        ReasonForVacancy: "",
        RecruitmentAuthorised: "",
        IsPayrollEmailed: "",
        EnterNumberOfMonths: 0,
        DateRequried: "",
        IsRevert: "",
        VacancyConfirmed: "",
        AdvertisementAttachement: [],
        PositionDetails: [],
        RoleProfileDocument: [],
        GradingDocument: [],
        AdvertisementDocument: [],
        AssignRecruitmentHR: { key: 0, text: "" },
        AssignRecruitmentHROption: [],
        OnamSignedStampsAttchment: [],
        OnamSignedStampsDocument: [],
        AssignAgencies: { key: 0, text: "" },
        AssignAgenciesOption: [],
        CandidateCVAttachment: [],
        Comments: "",
        SignDate: new Date(
            todaydate.getFullYear(),
            todaydate.getMonth(),
            todaydate.getDate(),
            todaydate.getHours(),
            todaydate.getMinutes(),
            todaydate.getSeconds()
        ),
    });
    const [validationErrors, setValidationError] = React.useState<formValidation>(
        {
            AssignRecruitmentHR: false,
            AssignAgencies: false,
            Comments: false,
            AdvertisementAttachement: false,
            OnamSignedStampsAttchment: false,
            MinQualification: false,
            PrefeQualification: false,
            RoleSpeKnowledge: false,
            RequiredLevel: false,
            TechnicalSkills: false,
            LevelProficiency: false,
            RolePurpose: false,
            JobDescription: false,
            TotalExperience: false,
            ExperienceinMiningIndustry: false,
            addMasterQualification: false,
            Checkboxalidation: false,
            ValidFrom: false,
            ValidTo: false,
            JobFunctionalType: false,
        }
    );
    const [MainComponent, setMainComponent] = useState<boolean>(true);
    const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
    const [PreviewBtn, setPreviewBtn] = useState<boolean>(false);
    const [SubmitBtn, setSubmitBtn] = useState<boolean>(true);
    const [AddQualifbtn, setAddQualifbtn] = useState<boolean>(false);
    const [activeTab, setactiveTab] = useState<string>("tab1");
    const [RoleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<
        RoleSpecKnowledge[]
    >([
        {
            RoleSpeKnowledge: { key: 0, text: "" },
            RequiredLevel: { key: 0, text: "" },
        },
    ]);
    const [qualificationValue, setQualificationValue] =
        useState<QualificationValue>({
            MinQualification: [],
            PrefeQualification: [],
        });
    const [TechnicalSkillValue, setTechnicalSkillValue] = useState<
        TechnicalSkills[]
    >([
        {
            TechnicalSkills: { key: 0, text: "" },
            LevelProficiency: { key: 0, text: "" },
        },
    ]);
    const [HeaderValue, setHeaderValue] = useState<string>("");
    const [LabelValue, setLabelValue] = useState<string>("");
    const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
    const [Checkbox, setCheckbox] = useState<boolean>(false);
    const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
    const [Preview, setPreview] = useState<boolean>(false);

    const handleAddRow = (stateValue: string) => {
        switch (stateValue) {
            case RoleDescription.RoleSpeKnowledgeValue:
                {
                    setRoleSpeKnowledgeValue((prevState) => [
                        ...prevState,
                        {
                            RoleSpeKnowledge: { key: 0, text: "" },
                            RequiredLevel: { key: 0, text: "" },
                        },
                    ]);
                }
                break;
            //   case RoleDescription.QualificationValue:
            //     {
            //       setQualificationValue((prevState) => [
            //         ...prevState,
            //         {
            //           MinQualification: { key: 0, text: "" },
            //           PrefeQualification: { key: 0, text: "" },
            //         },
            //       ]);
            //     }
            //     break;
            case RoleDescription.TechnicalSkillValue: {
                setTechnicalSkillValue((prevState) => [
                    ...prevState,
                    {
                        TechnicalSkills: { key: 0, text: "" },
                        LevelProficiency: { key: 0, text: "" },
                    },
                ]);
            }
        }
    };

    const handleDeleteRow = (index: number, stateValue: string) => {
        switch (stateValue) {
            case RoleDescription.RoleSpeKnowledgeValue:
                {
                    setRoleSpeKnowledgeValue((prevState) =>
                        prevState.filter((_, i) => i !== index)
                    );
                }
                break;
            //   case RoleDescription.QualificationValue:
            //     {
            //       setQualificationValue((prevState) =>
            //         prevState.filter((_, i) => i !== index)
            //       );
            //     }
            //     break;
            case RoleDescription.TechnicalSkillValue: {
                setTechnicalSkillValue((prevState) =>
                    prevState.filter((_, i) => i !== index)
                );
            }
        }
    };

    const handleAutoComplete = (
        item: AutoCompleteItem | null,
        StateValue: string
    ) => {
        setAdvDetails((prevState) => ({
            ...prevState,
            [StateValue]: item,
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [StateValue]: false,
        }));
    };

    const handleAutoCompleterow = (
        item: AutoCompleteItem | null,
        key: string, // Generalized key
        index: number,
        stateKey:
            | "RoleSpeKnowledgeValue"
            | "QualificationValue"
            | "TechnicalSkillValue"
    ) => {
        if (stateKey === "RoleSpeKnowledgeValue") {
            setRoleSpeKnowledgeValue((prevState) => {
                const updatedRows = [...prevState];
                if (key === "RoleSpeKnowledge" || key === "RequiredLevel") {
                    updatedRows[index][key] = item || { key: 0, text: "" };
                }
                return updatedRows;
            });
            if (key === "RoleSpeKnowledge") {
                setValidationError((prevState) => ({
                    ...prevState,
                    RoleSpeKnowledge: false,
                }));
            } else if (key === "RequiredLevel") {
                setValidationError((prevState) => ({
                    ...prevState,
                    RequiredLevel: false,
                }));
            }
        }

        // if (stateKey === "QualificationValue") {
        //   setQualificationValue((prevState) => {
        //     const updatedRows = [...prevState];
        //     if (key === "MinQualification" || key === "PrefeQualification") {
        //       updatedRows[index][key] = item || { key: 0, text: "" };
        //     }
        //     return updatedRows;
        //   });
        //   if (key === "MinQualification") {
        //     setValidationError((prevState) => ({
        //       ...prevState,
        //       MinQualification: false,
        //     }));
        //   } else if (key === "PrefeQualification") {
        //     setValidationError((prevState) => ({
        //       ...prevState,
        //       PrefeQualification: false,
        //     }));
        //   }
        // }

        if (stateKey === "TechnicalSkillValue") {
            setTechnicalSkillValue((prevState) => {
                const updatedRows = [...prevState];
                if (key === "TechnicalSkills" || key === "LevelProficiency") {
                    updatedRows[index][key] = item || { key: 0, text: "" };
                }
                return updatedRows;
            });
            if (key === "TechnicalSkills") {
                setValidationError((prevState) => ({
                    ...prevState,
                    TechnicalSkills: false,
                }));
            } else if (key === "LevelProficiency") {
                setValidationError((prevState) => ({
                    ...prevState,
                    LevelProficiency: false,
                }));
            }
        }
    };

    const fetchData = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const filterConditionsVRR = [
                {
                    FilterKey: "ID",
                    Operator: "eq",
                    FilterValue: props.stateValue?.ID,
                },
            ];
            const Conditions = "";

            const response =
                props.stateValue?.type === "VRR"
                    ? await getVRRDetails.GetVacancyDetails(
                        filterConditionsVRR,
                        Conditions
                    )
                    : await getVRRDetails.GetRecruitmentDetails(
                        filterConditionsVRR,
                        Conditions
                    );

            if (response.data) {
                const op =
                    props.stateValue?.type === "VRR"
                        ? response.data[0][0]
                        : response.data[0];
                const NoofPositionAssigned = response.data[1];

                const BUName =
                    props?.BusinessUnitCodeAllColumn.find(
                        (item: any) => item.key === op.BusinessUnitCodeId
                    ) || {};
                const JobtitleFrench =
                    props?.JobInFrenchList.find(
                        (item: any) => item.key === op.JobTitleInFrenchId
                    ) || {};

                const [
                    RoleProfileDocment,
                    GradingDocument,
                    AdvertismentDocment,
                    OnamSignedStampsDocment,
                ] = await Promise.all([
                    CommonServices.GetAttachmentToLibrary(
                        DocumentLibraray.RoleProfileMaster,
                        op.JobCode,
                        RoleProfileMaster.RoleProfile
                    ),
                    CommonServices.GetAttachmentToLibrary(
                        DocumentLibraray.RoleProfileMaster,
                        op.JobCode,
                        RoleProfileMaster.Grading
                    ),
                    CommonServices.GetAttachmentToLibrary(
                        DocumentLibraray.RecruitmentAdvertisementDocument,
                        op.JobCode
                    ),
                    CommonServices.GetAttachmentToLibrary(
                        DocumentLibraray.ONAMSignedStampDocuments,
                        op.JobCode
                    ),
                ]);

                if (
                    RoleProfileDocment.status === 200 ||
                    AdvertismentDocment.status === 200
                ) {
                    const RoleProfileDoc = RoleProfileDocment.data || [];
                    const AdvertismentDocPromises = AdvertismentDocment.data || [];
                    const ONAMSignedStampDoc = OnamSignedStampsDocment.data || [];
                    const GradingDoc = GradingDocument.data || [];

                    setFormState((prevState) => ({
                        ...prevState,
                        VRRID: op.VRRID,
                        BusinessUnitCodeID: op.BusinessUnitCodeId,
                        DepartmentID: op.DepartmentId,
                        SubDepartmentID: op.SubDepartmentId,
                        SectionID: op.SectionId,
                        DepartmentCodeID: op.DepartmentCodeId,
                        JobNameInEnglishID: op.JobTitleInEnglishId,
                        JobNameInFrenchID: op.JobTitleInFrenchId,
                        PatersonGradeID: op.PayrollGradeId,
                        DRCGradeID: op.DRCGradeId,
                        JobCodeID: op.JobCodeId,
                        BusinessUnitCode: op.BusinessUnitCode || "",
                        BusinessUnitName: BUName.Name || "",
                        BusinessUnitDescription: BUName.Description || "",
                        Department: op.Department || "",
                        SubDepartment: op.SubDepartment || "",
                        Section: op.Section || "",
                        DepartmentCode: op.DepartmentCode || "",
                        Nationality: op.Nationality || "",
                        JobNameInEnglish: op.JobTitleInEnglish || "",
                        JobNameInFrench: JobtitleFrench.text || "",
                        PatersonGrade: op.PayrollGrade || "",
                        DRCGrade: op.DRCGrade || "",
                        EmployementCategory: op.EmploymentCategory || "",
                        ContractType: op.TypeOfContract || "",
                        JobCode: op.JobCode || "",
                        AreaOfWork: op.AreaofWork || "",
                        NoofPositionAssigned: op.NumberOfPersonNeeded || 0,
                        ReasonForVacancy: op.ReasonForVacancy || "",
                        RecruitmentAuthorised: op.RecruitmentAuthorised || "",
                        IsPayrollEmailed: op.IsPayrollEmailed || "",
                        EnterNumberOfMonths: op.EnterNumberOfMonths || 0,
                        DateRequried: op.DateRequried || null,
                        IsRevert: op.IsRevert || "",
                        VacancyConfirmed: op.VacancyConfirmed || "",
                        RoleProfileDocument: RoleProfileDoc,
                        GradingDocument: GradingDoc,
                        AdvertisementDocument: AdvertismentDocPromises,
                        OnamSignedStampsDocument: ONAMSignedStampDoc,
                    }));

                    if (NoofPositionAssigned?.length > 0) {
                        const updatedPositions = NoofPositionAssigned.map(
                            (position: any) => ({
                                ...position,
                                PatersonGradeID: op.PayrollGradeId,
                                DRCGradeID: op.DRCGradeId,
                            })
                        );

                        setFormState((prevState) => ({
                            ...prevState,
                            PositionDetails: updatedPositions,
                        }));
                    }
                } else {
                    console.error("Error retrieving attachments:", response);
                }
            }
        } catch (error) {
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const Validation = (): boolean => {
        const {
            AssignRecruitmentHR,
            Comments,
            AdvertisementAttachement,
            OnamSignedStampsAttchment,
        } = formState;

        let errors = {
            AssignRecruitmentHR: false,
            Comments: false,
            AdvertisementAttachement: false,
            OnamSignedStampsAttchment: false,
            MinQualification: false,
            PrefeQualification: false,
            RoleSpeKnowledge: false,
            RequiredLevel: false,
            TechnicalSkills: false,
            LevelProficiency: false,
            RolePurpose: false,
            JobDescription: false,
            ExperienceinMiningIndustry: false,
            TotalExperience: false,
            Checkboxalidation: false,
            ValidFrom: false,
            ValidTo: false,
            JobFunctionalType: false,
        };

        switch (props.CurrentRoleID) {
            case RoleID.RecruitmentHRLead: {
                if (props.stateValue?.tab === "tab1") {
                    errors.AssignRecruitmentHR = !IsValid(AssignRecruitmentHR.text);
                    errors.Comments = !IsValid(Comments);
                    errors.Checkboxalidation = !IsValid(Checkbox);
                } else if (props.stateValue?.tab === "tab2") {
                    errors.OnamSignedStampsAttchment = !IsValid(
                        OnamSignedStampsAttchment
                    );
                    errors.Comments = !IsValid(Comments);
                    errors.Checkboxalidation = !IsValid(Checkbox);
                }
                break;
            }

            case RoleID.RecruitmentHR: {
                if (
                    props.stateValue?.StatusId ===
                    StatusId.PendingwithRecruitmentHRtouploadAdv
                ) {
                    errors.Comments = !IsValid(Comments);
                    errors.AdvertisementAttachement = !IsValid(AdvertisementAttachement);
                    errors.Comments = !IsValid(Comments);
                    errors.MinQualification = !IsValid(
                        qualificationValue.MinQualification[0].text
                    );
                    errors.PrefeQualification = !IsValid(
                        qualificationValue.PrefeQualification[0].text
                    );
                    errors.RoleSpeKnowledge = !IsValid(
                        RoleSpeKnowledgeValue[0].RoleSpeKnowledge.text
                    );
                    errors.RequiredLevel = !IsValid(
                        RoleSpeKnowledgeValue[0].RequiredLevel.text
                    );
                    errors.TechnicalSkills = !IsValid(
                        TechnicalSkillValue[0].TechnicalSkills.text
                    );
                    errors.LevelProficiency = !IsValid(
                        TechnicalSkillValue[0].LevelProficiency.text
                    );
                    errors.RolePurpose = !IsValid(advDetails.RolePurpose);
                    errors.JobDescription = !IsValid(advDetails.JobDescription);
                    errors.ExperienceinMiningIndustry = !IsValid(
                        advDetails.ExperienceinMiningIndustry
                    );
                    errors.TotalExperience = !IsValid(advDetails.TotalExperience);
                    errors.Checkboxalidation = !IsValid(Checkbox);
                    errors.ValidFrom = !IsValid(advDetails.ValidFrom);
                    errors.ValidTo = !IsValid(advDetails.ValidTo);
                    errors.JobFunctionalType = !IsValid(
                        advDetails.JobFunctionalType.text
                    );
                }

                break;
            }

            case RoleID.HOD: {
                if (props.stateValue?.tab === "tab1") {
                    errors.Comments = !IsValid(Comments);
                    errors.Checkboxalidation = !IsValid(Checkbox);
                }
                break;
            }
        }

        setValidationError((prevState) => ({
            ...prevState,
            ...errors,
        }));

        return Object.values(errors).some((error) => error);
    };

    const MasterDataValidation = (): boolean => {
        const { addMasterQualification } = advDetails;

        let errors = {
            addMasterQualification: false,
        };

        errors.addMasterQualification = !IsValid(addMasterQualification);

        setValidationError((prevState) => ({
            ...prevState,
            ...errors,
        }));

        return Object.values(errors).some((error) => error);
    };

    const resetForm = () => {
        setFormState((prevState) => ({
            ...prevState,
            Comments: "",
        }));
    };

    const SaveRecruitment = async () => {
        try {
            const isValid = !Validation();

            if (isValid) {
                let Table1: any = {
                    // VRRID: formState.VRRID,
                    BusinessUnitCodeId: formState.BusinessUnitCodeID,
                    Nationality: formState.Nationality,
                    EmploymentCategory: formState.EmployementCategory,
                    DepartmentId: formState.DepartmentID,
                    SubDepartmentId: formState.SubDepartmentID,
                    SectionId: formState.SectionID,
                    DepartmentCodeId: formState.DepartmentCodeID,
                    NumberOfPersonNeeded: formState.NoofPositionAssigned,
                    EnterNumberOfMonths: formState.EnterNumberOfMonths,
                    TypeOfContract: formState.ContractType,
                    DateRequried: formState.DateRequried,
                    IsRevert: formState.IsRevert,
                    ReasonForVacancy: formState.ReasonForVacancy,
                    AreaofWork: formState.AreaOfWork,
                    JobCodeId: formState.JobCodeID,
                    VacancyConfirmed: formState.VacancyConfirmed,
                    RecruitmentAuthorised: formState.RecruitmentAuthorised,
                    IsPayrollEmailed: formState.IsPayrollEmailed,
                    AssignedHRId: formState.AssignRecruitmentHR.key,
                    ActionId: WorkflowAction.Approved,
                };
                console.log(Table1, "Table1");

                const obj: any = {
                    ActionId: WorkflowAction.Approved,
                };
                if (formState.Comments) {
                    const commentsData: InsertComments = {
                        RoleId: props.CurrentRoleID,
                        RecruitmentIDId: props.stateValue?.ID,
                        Comments: formState.Comments,
                    };

                    await getVRRDetails.InsertCommentsList(commentsData);
                }

                switch (props.CurrentRoleID) {
                    case RoleID.RecruitmentHRLead: {
                        if (
                            props.stateValue?.StatusId ===
                            StatusId.PendingwithHRLeadtouploadONEMsigneddoc
                        ) {
                            await PostAdvertisement();
                            await CommonServices.uploadAttachmentToLibrary(
                                formState.JobCode,
                                formState.OnamSignedStampsAttchment ?? [],
                                DocumentLibraray.ONAMSignedStampDocuments
                            );
                            await SPServices.SPUpdateItem({
                                Listname: ListNames.HRMSRecruitmentDptDetails,
                                RequestJSON: obj,
                                ID: props.stateValue?.ID,
                            });
                            resetForm();
                            let CancelAlert = {
                                Message: RecuritmentHRMsg.ONEMDocumentMsg,
                                Type: HRMSAlertOptions.Success,
                                visible: true,
                                ButtonAction: async (userClickedOK: boolean) => {
                                    if (userClickedOK) {
                                        props.navigation("/RecurimentProcess");
                                        setAlertPopupOpen(false);
                                    }
                                },
                            };

                            setAlertPopupOpen(true);
                            setalertProps(CancelAlert);
                            setIsLoading(false);
                        }
                        break;
                    }
                    case RoleID.RecruitmentHR: {
                        await CommonServices.uploadAttachmentToLibrary(
                            formState.JobCode,
                            formState?.AdvertisementAttachement ?? [],
                            DocumentLibraray.RecruitmentAdvertisementDocument
                        );
                        await SPServices.SPUpdateItem({
                            Listname: ListNames.HRMSRecruitmentDptDetails,
                            RequestJSON: obj,
                            ID: props.stateValue?.ID,
                        });
                        let QualificatioDetails: {
                            MinQualification: string;
                        }[] = [];
                        let PrefeQualification: {
                            PrefeQualification: string;
                        }[] = [];
                        let RoleSpecificKnowledgeJson: {
                            RoleSpeKnowledge: string;
                            RequiredLevel: string;
                        }[] = [];

                        let TechnicalSkillsKnowledgeJson: {
                            TechnicalSkills: string;
                            LevelProficiency: string;
                        }[] = [];

                        TechnicalSkillValue.forEach((item) => {
                            let TechnicalSkillsData = {
                                TechnicalSkills: String(item.TechnicalSkills.key),
                                LevelProficiency: String(item.LevelProficiency.key),
                            };
                            TechnicalSkillsKnowledgeJson.push(TechnicalSkillsData);
                        });

                        RoleSpeKnowledgeValue.forEach((item) => {
                            let details = {
                                RoleSpeKnowledge: String(item.RoleSpeKnowledge.key),
                                RequiredLevel: String(item.RequiredLevel.key),
                            };
                            RoleSpecificKnowledgeJson.push(details);
                        });

                        qualificationValue.MinQualification.forEach((item) => {
                            const details = {
                                MinQualification: String(item.key),
                            };
                            QualificatioDetails.push(details);
                        });
                        qualificationValue.PrefeQualification.forEach((item) => {
                            const details = {
                                PrefeQualification: String(item.key),
                            };
                            PrefeQualification.push(details);
                        });

                        let AdvData: any = {
                            Qualification: JSON.stringify(QualificatioDetails),
                            PreferredQualification: JSON.stringify(PrefeQualification),
                            JobDescription: advDetails.JobDescription,
                            RoleProfile: advDetails.RolePurpose,
                            RoleSpecificKnowledgeJson: JSON.stringify(
                                RoleSpecificKnowledgeJson
                            ),
                            TechnicalSkillsKnowledgeJson: JSON.stringify(
                                TechnicalSkillsKnowledgeJson
                            ),
                            RecruitmentIDId: props.stateValue?.ID,
                            TotalPreferredExperienceId: Number(
                                advDetails.TotalExperience.key
                            ),
                            PreferredExperienceId: Number(
                                advDetails.ExperienceinMiningIndustry.key
                            ),
                            ValidFrom: moment(advDetails.ValidFrom).format("YYYY-MM-DD"),
                            ValidTo: moment(advDetails.ValidTo).format("YYYY-MM-DD"),
                            FunctionTypeId: advDetails.JobFunctionalType.key,
                        };
                        console.log(AdvData, "AdvData");
                        await getVRRDetails.InsertList(
                            AdvData,
                            ListNames.HRMSRecruitmentRoleProfileDetails
                        );
                        resetForm();
                        let UpdateAlert = {
                            Message: RecuritmentHRMsg.AdvertisementSubmitMsg,
                            Type: HRMSAlertOptions.Success,
                            visible: true,
                            ButtonAction: async (userClickedOK: boolean) => {
                                if (userClickedOK) {
                                    props.navigation("/RecurimentProcess");
                                    setAlertPopupOpen(false);
                                }
                            },
                        };

                        setAlertPopupOpen(true);
                        setalertProps(UpdateAlert);
                        setIsLoading(false);

                        break;
                    }
                    case RoleID.HOD: {
                        await SPServices.SPUpdateItem({
                            Listname: ListNames.HRMSRecruitmentDptDetails,
                            RequestJSON: obj,
                            ID: props.stateValue?.ID,
                        });
                        resetForm();

                        let approveAlert = {
                            Message: RecuritmentHRMsg.ApprovedMsg,
                            Type: HRMSAlertOptions.Success,
                            visible: true,
                            ButtonAction: async (userClickedOK: boolean) => {
                                if (userClickedOK) {
                                    props.navigation("/RecurimentProcess");
                                    setAlertPopupOpen(false);
                                }
                            },
                        };

                        setAlertPopupOpen(true);
                        setalertProps(approveAlert);
                        setIsLoading(false);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await fetchData();
        };

        void initialize();
    }, []);

    useEffect(() => {
        const MasterDataOption = async () => {
            // Fetch Qualification data
            const Qualification = await CommonServices.GetMasterData(
                ListNames.HRMSQualification
            );
            // const QualificationOption: AutoCompleteItem[] = Qualification.data.map((item: any) => ({
            //     key: item.Code,
            //     text: item.Qualification,
            // }));
            const QualificationOption: AutoCompleteItem[] = Qualification.data
                .filter(
                    (Qualitem) =>
                        !qualificationValue.MinQualification.some(
                            (item) => item.key === Qualitem.QualificationCode
                        )
                )
                .map((item: any) => ({
                    key: item.QualificationCode,
                    text: item.Qualification,
                }));
            const PrefeQualificationOption: AutoCompleteItem[] = Qualification.data
                .filter(
                    (Qualitem) =>
                        // !QualificationValue.some((item) => item.MinQualification.key === Qualitem.QualificationCode)
                        !qualificationValue.MinQualification.some(
                            (item) => item.key === Qualitem.QualificationCode
                        )
                )
                .map((item: any) => ({
                    key: item.QualificationCode,
                    text: item.Qualification,
                }));

            // Fetch RoleSpecificKnowledge data
            const RoleSpecificKnowlege = await CommonServices.GetMasterData(
                ListNames.HRMSRoleSpecificKnowlegeMaster
            );
            const RoleSpecificKnowlegeOption: AutoCompleteItem[] =
                RoleSpecificKnowlege.data.map((item: any) => ({
                    key: item.Code,
                    text: item.RoleSpecificKnowledge,
                }));

            // Fetch TechnicalSkills data
            const TechnicalSkills = await CommonServices.GetMasterData(
                ListNames.HRMSTechnicalSkills
            );
            const TechnicalSkillsOption: AutoCompleteItem[] =
                TechnicalSkills.data.map((item: any) => ({
                    key: item.Code,
                    text: item.TechnicalSkills,
                }));

            // Fetch LevelOfProficiency data
            const LevelOfProficiency = await CommonServices.GetMasterData(
                ListNames.HRMSLevelOfProficiency
            );
            const LevelOfProficiencyOption: AutoCompleteItem[] =
                LevelOfProficiency.data.map((item: any) => ({
                    key: item.Code,
                    text: item.Levels,
                }));

            const YearofExperiance = await CommonServices.GetMasterData(
                ListNames.HRMSExperienceMaster
            );
            const YearofExperianceOption: AutoCompleteItem[] =
                YearofExperiance.data.map((item: any) => ({
                    key: item.Id,
                    text: item.ExperienceInYearRange,
                }));

            const ExperienceinMiningOption: AutoCompleteItem[] = YearofExperiance.data
                .filter((exper) => advDetails.TotalExperience.key != exper.Id) // Correct filter syntax
                .map((item: any) => ({
                    key: item.Id,
                    text: item.ExperienceInYearRange,
                }));

            const JobTitleFunctionType = await CommonServices.GetMasterData(
                ListNames.HRMSJobTitleFunctionType
            );
            const JobTitleFunctionTypeOption: AutoCompleteItem[] =
                JobTitleFunctionType.data.map((item: any) => ({
                    key: item.Id,
                    text: item.FunctionType,
                }));

            setAdvDetails((prevState) => ({
                ...prevState,
                MinQualificationOption: QualificationOption,
                PrefeQualificationOption: PrefeQualificationOption,
                RoleSpeKnowledgeoption: RoleSpecificKnowlegeOption,
                TechnicalSkillsOption: TechnicalSkillsOption,
                LevelProficiencyOption: LevelOfProficiencyOption,
                RequiredLeveloption: LevelOfProficiencyOption,
                TotalExperienceOption: YearofExperianceOption,
                ExperienceinMiningIndustryOption: ExperienceinMiningOption,
                JobFunctionalTypeOption: JobTitleFunctionTypeOption,
            }));
        };

        if (
            props.CurrentRoleID === RoleID.RecruitmentHR &&
            props.stateValue?.StatusId ===
            StatusId.PendingwithRecruitmentHRtouploadAdv
        ) {
            void MasterDataOption();
        }
    }, [AddQualifbtn, qualificationValue, advDetails.TotalExperience]);

    useEffect(() => {
        // if (
        //     (props.CurrentRoleID === RoleID.HOD && props.stateValue?.StatusId === StatusId.PendingwithHODtoreviewAdv) || (props.CurrentRoleID === RoleID.RecruitmentHR && props.stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoAssignExternalAgency)
        // ) {
        const fetchData = async () => {
            try {
                let filterConditions = [
                    {
                        FilterKey: "RecruitmentIDId",
                        Operator: "eq",
                        FilterValue: props.stateValue.ID,
                    },
                ];
                const response =
                    await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
                        filterConditions,
                        ""
                    );

                if (response.status === 200) {
                    const data = response.data;
                    console.log("API Response Data:", data);

                    if (data && data.length > 0) {
                        const rawData = data[0];
                        const roleSpecificKnowledge = Array.isArray(
                            rawData.RoleSpecificKnowledge
                        )
                            ? rawData.RoleSpecificKnowledge
                            : [];

                        const RoleSpeKnowledgeValues = roleSpecificKnowledge.map(
                            (item: any) => item.RoleSpecificKnowledge
                        );
                        const RequiredLevelValues = roleSpecificKnowledge.map(
                            (item: any) => item.RequiredLevel
                        );
                        const technicalSkillsKnowledge = Array.isArray(
                            rawData.TechnicalSkillsKnowledge
                        )
                            ? rawData.TechnicalSkillsKnowledge
                            : [];

                        const TechnicalSkillsOption = technicalSkillsKnowledge.map(
                            (item: any, index: number) => ({
                                key: index,
                                text: item.TechnicalSkills,
                            })
                        );

                        const LevelProficiencyOption = technicalSkillsKnowledge.map(
                            (item: any, index: number) => ({
                                key: index,
                                text: item.LevelProficiency,
                            })
                        );
                        //   const MinQualificationOption = Array.isArray(rawData.Qualification)
                        //     ? rawData.Qualification.map((item: any, index: any) => ({
                        //         key: index,
                        //         text: item.text || "N/A",
                        //       }))
                        //     : [];
                        //   const PrefeQualificationOption = Array.isArray(
                        //     rawData.PreferredQualification
                        //   )
                        //     ? rawData.PreferredQualification.map((item: any, index: any) => ({
                        //         key: index,
                        //         text: item.text || "N/A",
                        //       }))
                        //     : [];
                        // Set Qualification as comma-separated values
                        const MinQualificationOption = rawData.Qualification
                            ? [{ key: 0, text: rawData.Qualification }]
                            : [];

                        // Set Preferred Qualification as comma-separated values
                        const PrefeQualificationOption = rawData.PreferredQualification
                            ? [{ key: 0, text: rawData.PreferredQualification }]
                            : [];

                        const mappedData: AdvDetails = {
                            RolePurpose: rawData.RoleProfile || "",
                            JobDescription: rawData.JobDescription || "",
                            RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
                            RequiredLeveloption: RequiredLevelValues,
                            MinQualificationOption,
                            PrefeQualificationOption,
                            TotalExperience: rawData.YearofExperience || "",
                            ExperienceinMiningIndustry: rawData.PreferredExperience || "",
                            TechnicalSkillsOption,
                            LevelProficiencyOption,
                            addMasterQualification: "",
                            YearofExperience: rawData.YearofExperience || "",
                            PreferredExperience: rawData.PreferredExperience || "",
                            ValidFrom: rawData.ValidFrom,
                            ValidTo: rawData.ValidTo,
                            FunctionType: rawData.FunctionType,
                            TotalExperienceOption: [],
                            ExperienceinMiningIndustryOption: [],
                            JobFunctionalType: {
                                key: 0,
                                text: "",
                            },
                            JobFunctionalTypeOption: [],
                        };

                        setAdvDetails(mappedData);
                    } else {
                        console.warn("No data found for the given filter.");
                    }
                } else {
                    console.error("Error fetching data:", response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        void fetchData();
    }, [props.CurrentRoleID, props.stateValue?.StatusId]);
    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         let filterConditions = [
    //           {
    //             FilterKey: "RecruitmentIDId",
    //             Operator: "eq",
    //             FilterValue: props.stateValue.ID,
    //           },
    //         ];
    //         const response =
    //           await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
    //             filterConditions,
    //             ""
    //           );

    //         if (response.status === 200) {
    //           const data = response.data;

    //           if (data && data.length > 0) {
    //             const rawData = data[0];

    //             // Set Qualification as comma-separated values
    //             const MinQualificationOption = rawData.Qualification
    //               ? [{ key: 0, text: rawData.Qualification }]
    //               : [];

    //             // Set Preferred Qualification as comma-separated values
    //             const PrefeQualificationOption = rawData.PreferredQualification
    //               ? [{ key: 0, text: rawData.PreferredQualification }]
    //               : [];

    //             const mappedData: AdvDetails = {
    //               RolePurpose: rawData.RoleProfile || "",
    //               JobDescription: rawData.JobDescription || "",
    //               MinQualificationOption,
    //               PrefeQualificationOption,
    //               TotalExperience: rawData.YearofExperience || "",
    //               ExperienceinMiningIndustry: rawData.PreferredExperience || "",
    //               addMasterQualification: "",
    //               YearofExperience: rawData.YearofExperience || "",
    //               PreferredExperience: rawData.PreferredExperience || "",
    //               ValidFrom: rawData.ValidFrom,
    //               ValidTo: rawData.ValidTo,
    //               FunctionType: rawData.FunctionType,
    //               RoleSpeKnowledgeoption: [],
    //               RequiredLeveloption: [],
    //               TechnicalSkillsOption: [],
    //               LevelProficiencyOption: [],
    //               TotalExperienceOption: [],
    //               ExperienceinMiningIndustryOption: [],
    //               JobFunctionalType: {
    //                 key: 0,
    //                 text: "",
    //               },
    //               JobFunctionalTypeOption: [],
    //             };

    //             setAdvDetails(mappedData);
    //             console.log("mappedData", mappedData);
    //           } else {
    //             console.warn("No data found for the given filter.");
    //           }
    //         } else {
    //           console.error("Error fetching data:", response.message);
    //         }
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     };

    //     void fetchData();
    //   }, [props.CurrentRoleID, props.stateValue?.StatusId]);
    const handleDelete = (
        index: number,
        attachmentType:
            | "AdvertisementAttachement"
            | "OnamSignedStampsAttchment"
            | "CandidateCVAttachment"
    ) => {
        setFormState((prevState) => {
            const updatedAttachments = [...(prevState[attachmentType] ?? [])];
            updatedAttachments.splice(index, 1);

            return {
                ...prevState,
                [attachmentType]: updatedAttachments,
            };
        });
    };

    const handleInputChangeTextArea = (
        value: string | any,
        StateValue: string
    ) => {
        setFormState((prevState) => ({
            ...prevState,
            [StateValue]: value,
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [StateValue]: false,
        }));
    };

    const handleMulitiSelect = (
        value: AutoCompleteItem[],
        StateValue: string
    ) => {
        setQualificationValue((prevState: any) => ({
            ...prevState,
            [StateValue]: value,
        }));

        setValidationError((prevState) => ({
            ...prevState,
            [StateValue]: false,
        }));
    };

    const OpenComments = async () => {
        setMainComponent(false);
        let filterConditions = [];
        let Conditions = "";

        filterConditions.push({
            FilterKey: "RecruitmentID",
            Operator: "eq",
            FilterValue: props.stateValue.ID,
        });
        const CommentsList = await getVRRDetails.GetCommentsData(
            props.EmployeeList,
            Conditions,
            filterConditions
        );
        if (CommentsList.status === 200) {
            setCommentsData(CommentsList.data);
        }
    };

    const AddMasterData_fn = (Header: string, LabelValue: string) => {
        setAddQualifbtn(true);
        setHeaderValue(Header);
        setLabelValue(LabelValue);
    };

    const handleRichTextEditor = (value: string | any, StateValue: string) => {
        setAdvDetails((prevState) => ({
            ...prevState,
            [StateValue]: value,
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [StateValue]: false,
        }));
    };

    //   const handleDateChange = (value: Date | null, StateValue: string) => {
    //     setAdvDetails((prevState) => {
    //       const updatedState = { ...prevState, [StateValue]: value };

    //       if (StateValue === "ValidFrom" && value) {
    //         const maxValidToDate = new Date(value);
    //         maxValidToDate.setDate(maxValidToDate.getDate() + 14);

    //         if (updatedState.ValidTo && updatedState.ValidTo > maxValidToDate) {
    //           updatedState.ValidTo = maxValidToDate;
    //         }
    //       }

    //       return updatedState;
    //     });

    //     setValidationError((prevState) => ({
    //       ...prevState,
    //       [StateValue]: false,
    //     }));
    //   };

    const calculateValidTo = (startDate: Date, daysToAdd: number): Date => {
        let validToDate = new Date(startDate);
        let addedDays = 0;

        while (addedDays < daysToAdd) {
            validToDate.setDate(validToDate.getDate() + 1);

            if (validToDate.getDay() === 0) {
                continue;
            }

            addedDays++;
        }

        if (validToDate.getDay() === 0) {
            validToDate.setDate(validToDate.getDate() + 1);
        }

        return validToDate;
    };
    const handleDateChange = (value: Date | null, stateKey: string) => {
        setAdvDetails((prevState) => {
            const updatedState = { ...prevState, [stateKey]: value };

            if (stateKey === "ValidFrom" && value) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                const newValidTo = calculateValidTo(value, 13);
                updatedState.ValidTo = newValidTo;
            }

            return updatedState;
        });

        setValidationError((prevState) => ({
            ...prevState,
            [stateKey]: false,
        }));
    };

    const handleCheckbox = (value: boolean) => {
        setCheckbox(value);
        setValidationError((prevState) => ({
            ...prevState,
            Checkboxalidation: false,
        }));
    };

    const handleFileAttachment = (StateValue: string, value: IDocFiles[]) => {
        setFormState((prevState) => ({
            ...prevState,
            [StateValue]: value,
        }));
        setValidationError((prevState: any) => ({
            ...prevState,
            [StateValue]: false,
        }));
    };

    async function PostAdvertisement() {
        try {
            let filterConditions = [
                {
                    FilterKey: "RecruitmentIDId",
                    Operator: "eq",
                    FilterValue: props.stateValue.ID,
                },
            ];
            await getVRRDetails
                .GetDataInList(
                    ListNames.HRMSRecruitmentRoleProfileDetails,
                    filterConditions,
                    "",
                    "*,RecruitmentID/ID,JobDescription,RoleProfile,TotalPreferredExperience/ExperienceInYearRange,PreferredExperience/ExperienceInYearRange,FunctionType/Code",
                    "RecruitmentID,PreferredExperience,TotalPreferredExperience,FunctionType"
                )
                .then(async (res) => {
                    console.log(res, "res");
                    const data = res.data[0];
                    const roleSpecificKnowledge = data.RoleSpecificKnowledgeJson
                        ? JSON.parse(data.RoleSpecificKnowledgeJson)
                        : [];
                    const technicalSkill = data.TechnicalSkillsKnowledgeJson
                        ? JSON.parse(data.TechnicalSkillsKnowledgeJson)
                        : [];
                    let technicalSkillsValues = technicalSkill.map(
                        (item: any) => item.TechnicalSkills
                    );
                    let LevelProficiency = technicalSkill.map(
                        (item: any) => item.LevelProficiency
                    );

                    const RoleSpeKnowledgeValues = roleSpecificKnowledge.map(
                        (item: any) => item.RoleSpeKnowledge
                    );
                    const RequiredLevelValues = roleSpecificKnowledge.map(
                        (item: any) => item.RequiredLevel
                    );

                    const roleSpecificSkills: RoleAndTechSkills[] =
                        RoleSpeKnowledgeValues.map((role: any, index: number) => ({
                            skillId: String(role || ""),
                            levelId: String(RequiredLevelValues[index] || ""),
                        }));

                    const technicalSkills: RoleAndTechSkills[] =
                        technicalSkillsValues.map((tech: any, index: number) => ({
                            skillId: String(tech || ""),
                            levelId: String(LevelProficiency[index] || ""),
                        }));

                    const Roleandtechnical: RoleAndTechSkills[] = [
                        ...roleSpecificSkills,
                        ...technicalSkills,
                    ];

                    const minQualifications: MinAndPreferedQualifications[] =
                        data.Qualification
                            ? JSON.parse(data.Qualification).map((item: any) => ({
                                qualification: item.MinQualification, // Adjust as needed
                                type: 0,
                            }))
                            : [];

                    const preferredQualifications: MinAndPreferedQualifications[] =
                        data.PreferredQualification
                            ? JSON.parse(data.PreferredQualification).map((item: any) => ({
                                qualification: item.PrefeQualification, // Adjust as needed
                                type: 1,
                            }))
                            : [];

                    // Combine the two arrays into one
                    const MinAndPreferedQualification: MinAndPreferedQualifications[] = [
                        ...minQualifications,
                        ...preferredQualifications,
                    ];

                    const Description: Descriptions = {
                        jobTitle: formState.JobNameInEnglish,
                        jobShortSummary: String(data.RoleProfile || ""),
                        jobSummary: String(data.JobDescription || ""),
                    };

                    const onamdocpathfile = await CommonServices.GetAttachmentLink(
                        formState.JobCode,
                        DocumentLibraray.ONAMSignedStampDocuments
                    );

                    const onemdocPath = String(onamdocpathfile.data);
                    const DepartmentCode = props.Department.filter(
                        (item: { text: string }) => item.text === formState.Department
                    );
                    let NationalityValue =
                        formState.Nationality === Nationality.Nationals
                            ? "Congolese"
                            : formState.Nationality;
                    const AdvertisementDetails: AdvertisementDetails = {
                        jobCode: formState.JobCode,
                        noOfPositions: String(formState.NoofPositionAssigned),
                        validFrom: data.ValidFrom,
                        validTo: data.ValidTo,
                        employmentType: "Full Time",
                        departmentId: DepartmentCode[0]?.code || "",
                        role: null,
                        functionId: String(data.FunctionType?.Code || ""),
                        onemdocPath: String(onemdocPath),
                        experience: String(
                            data.TotalPreferredExperience?.ExperienceInYearRange || ""
                        ),
                        nationality: NationalityValue,
                        Descriptions_en: Description,
                        Descriptions_fr: Description,
                        RoleAndTechSkills: Roleandtechnical,
                        MinAndPreferedQualifications: MinAndPreferedQualification,
                    };

                    console.log(AdvertisementDetails, "AdvertisementDetails");
                    await GetPortalJobsService.UpsertJobs(AdvertisementDetails)
                        .then((res) => {
                            console.log(res, "res");
                        })
                        .catch((error) => {
                            console.log("Candidate details doesn't fetch the data", error);
                        });
                })
                .catch((error) => {
                    console.log(
                        "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
                        error
                    );
                });
        } catch { }
    }

    const tabs = [
        {
            label: TabName.PositionDetails, //"Position Details",
            value: "tab1",
            content: (
                <Card
                    variant="outlined"
                    sx={{
                        boxShadow: "0px 7px 4px 3px #d3d3d3",
                        borderRadius: "10px",
                        marginTop: "2%",
                    }}
                >
                    <CardContent>
                        <div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                    <LabelHeaderComponents
                                        value={`Job Title - ${formState.JobNameInEnglish} (${formState.JobCode})`}
                                    >
                                        {" "}
                                    </LabelHeaderComponents>
                                </div>
                                <div className="ms-Grid-col ms-lg6">
                                    <LabelHeaderComponents
                                        value={`Status - ${props.stateValue?.Status}`}
                                    >
                                        {" "}
                                    </LabelHeaderComponents>
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Business Unit Code"
                                        value={formState.BusinessUnitCode}
                                        error={false}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                BusinessUnitCode: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Business Unit Name"
                                        value={formState.BusinessUnitName}
                                        disabled={true}
                                        error={false}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                BusinessUnitName: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Business Unit Description"
                                        value={formState.BusinessUnitDescription}
                                        error={false}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                BusinessUnitDescription: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Department"
                                        value={formState.Department}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                Department: value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Sub-Department"
                                        value={formState.SubDepartment}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                SubDepartment: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Section"
                                        value={formState.Section}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                Section: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Department Code"
                                        value={formState.DepartmentCode}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                DepartmentCode: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Nationality"
                                        value={formState.Nationality}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                Nationality: value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                {/*                                    
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (English)"
                                            value={formState.JobNameInEnglish}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInEnglish: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (French)"
                                            value={formState.JobNameInFrench}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInFrench: value }))
                                            }
                                        />
                                    </div> */}
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Paterson Grade"
                                        value={formState.PatersonGrade}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                PatersonGrade: value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="DRC Grade"
                                        value={formState.DRCGrade}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                DRCGrade: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Employment Category"
                                        value={formState.EmployementCategory}
                                        disabled={true}
                                        error={false}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                EmployementCategory: value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Type of Contract"
                                        value={formState.ContractType}
                                        disabled={true}
                                        error={false}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                ContractType: value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="Area of Work"
                                        value={formState.AreaOfWork}
                                        disabled={true}
                                        error={false}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                AreaOfWork: value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="ms-Grid-col ms-lg3">
                                    <CustomInput
                                        label="No of Position Assigned"
                                        value={formState.NoofPositionAssigned}
                                        disabled={true}
                                        error={false}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                NoofPositionAssigned: value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                                <LabelHeaderComponents value={"Attachments"} />
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomLabel value={"RoleProfile Documents"} />
                                    <CustomViewDocument
                                        Attachment={formState.RoleProfileDocument}
                                    />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <CustomLabel value={"Grading Documents"} />
                                    <CustomViewDocument Attachment={formState.GradingDocument} />
                                </div>

                                {(props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                                    props.stateValue?.StatusId ===
                                    StatusId.PendingwithHRLeadtouploadONEMsigneddoc) ||
                                    (props.CurrentRoleID === RoleID.HOD &&
                                        props.stateValue?.StatusId ===
                                        StatusId.PendingwithHODtoreviewAdv && (
                                            <>
                                                {/* <div
                          className="ms-Grid-col ms-lg3 custom-document-column"
                          title={
                            Array.isArray(formState.AdvertisementDocument)
                              ? formState.AdvertisementDocument.join(", ")
                              : formState.AdvertisementDocument
                          }
                        >
                          <CustomLabel value={"Advertisement Documents"} />
                          <CustomViewDocument
                            Attachment={formState.AdvertisementDocument}
                          />
                        </div> */}
                                                <div className="ms-Grid-col ms-lg3 custom-document-column">
                                                    <CustomLabel value={"Advertisement Documents"} />
                                                    <div
                                                        className="document-wrapper"
                                                        title={
                                                            Array.isArray(formState.AdvertisementDocument)
                                                                ? formState.AdvertisementDocument.join(", ")
                                                                : formState.AdvertisementDocument
                                                        }
                                                    >
                                                        <CustomViewDocument
                                                            Attachment={formState.AdvertisementDocument}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ))}

                                {props.stateValue?.StatusId ===
                                    StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                                        <>
                                            {console.log(
                                                formState.AdvertisementDocument,
                                                "formState.AdvertisementDocument"
                                            )}
                                            <div className="ms-Grid-col ms-lg3">
                                                <CustomLabel value={"Advertisement Documents"} />
                                                <CustomViewDocument
                                                    Attachment={formState.AdvertisementDocument}
                                                />
                                            </div>
                                        </>
                                    )}
                            </div>

                            {props.CurrentRoleID === RoleID.RecruitmentHR &&
                                props.stateValue?.StatusId ===
                                StatusId.PendingwithRecruitmentHRtouploadAdv ? (
                                <></>
                            ) : (
                                <>
                                    {props.stateValue?.StatusId ===
                                        StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg1.8">
                                                        <CustomLabel
                                                            value={"ONEM Signed Doc"}
                                                            mandatory={true}
                                                        />
                                                        <AttachmentButton
                                                            label="Upload"
                                                            iconName="CloudUpload"
                                                            iconNameHover="CloudUpload"
                                                            AttachState={(newAttachment: any) => {
                                                                let attachment: IDocFiles[] = newAttachment.map(
                                                                    (item: any) => {
                                                                        return {
                                                                            name: item.name,
                                                                            content: item.file,
                                                                            type: "New",
                                                                        };
                                                                    }
                                                                );
                                                                const attachments = [
                                                                    ...(formState.OnamSignedStampsAttchment || []),
                                                                    ...attachment,
                                                                ];
                                                                handleFileAttachment(
                                                                    "OnamSignedStampsAttchment",
                                                                    attachments
                                                                );
                                                            }}
                                                            mandatory={true}
                                                            error={validationErrors.OnamSignedStampsAttchment}
                                                            Style={{
                                                                backgroundColor: "rgb(239, 51, 64)",
                                                                color: "white",
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="ms-Grid-col ms-lg6"
                                                    //   style={{ marginTop: "4%" }}
                                                    >
                                                        {formState.OnamSignedStampsAttchment?.map(
                                                            (file: any, index: number) => {
                                                                const fileName = file.fileName || file.name;

                                                                return (
                                                                    <div key={index} className="ms-Grid-row">
                                                                        <div className="ms-Grid-col ms-lg12">
                                                                            <Label style={{ color: "blue" }}>
                                                                                {fileName}
                                                                                <span>
                                                                                    <Icon
                                                                                        iconName="Delete"
                                                                                        style={{
                                                                                            marginLeft: "8px",
                                                                                            fontSize: "16px",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        onClick={() =>
                                                                                            handleDelete(
                                                                                                index,
                                                                                                "OnamSignedStampsAttchment"
                                                                                            )
                                                                                        } // Call the delete function
                                                                                    />
                                                                                </span>
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    {/* {props.stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoAssignExternalAgency && (
                                        <>
                                            <div className="ms-Grid-row">
                                                <div className="ms-Grid-col ms-lg6">
                                                    <CustomViewDocument
                                                        Attachment={formState.AdvertisementDocument}
                                                        Label={"Advertisement Documents"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="ms-Grid-row">
                                                <div className="ms-Grid-col ms-lg6">
                                                    <CustomViewDocument
                                                        Attachment={formState.OnamSignedStampsDocument}
                                                        Label={"ONEM Signed&Stamps Documents"}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )} */}

                                    {props.stateValue?.StatusId ===
                                        StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg12">
                                                        <div
                                                            className="ms-Grid-col ms-lg4"
                                                            style={{ marginLeft: "-5px" }}
                                                        >
                                                            <CustomLabel value={" View Justifications"} />
                                                            <ReuseButton
                                                                Style={{
                                                                    minWidth: "117px",
                                                                    fontSize: "13px",
                                                                    paddingBottom: "24px",
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    height: "41px",
                                                                    paddingTop: "23px",
                                                                    backgroundColor: "#EF3340",
                                                                    color: "white",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}
                                                                label="VIEW"
                                                                imgSrc={require("../../assets/viewSubmision-white.svg")}
                                                                imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                                imgAlt="View"
                                                                imgAltHover="Hovered View"
                                                                onClick={OpenComments}
                                                                spacing={4}
                                                            />
                                                            {/* <ReuseButton
                                                                label="VIEW"
                                                                onClick={OpenComments}
                                                                spacing={4}
                                                            // imgSrc={require("../../assets/Viewicon.svg")}
                                                            // imgAlt="ViewIcon"
                                                            // imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                            // imgAltHover="Image"
                                                            /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    {props.stateValue?.StatusId ===
                                        StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg12">
                                                        <CustomTextArea
                                                            label="Justification"
                                                            value={formState.Comments}
                                                            error={validationErrors.Comments}
                                                            onChange={(value) =>
                                                                handleInputChangeTextArea(value, "Comments")
                                                            }
                                                            mandatory={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="ms-Grid-row"
                                                    style={{
                                                        padding: "3px",
                                                        marginTop: "20px",
                                                        marginBottom: "-33px",
                                                    }}
                                                >
                                                    <div className="ms-Grid-col ms-lg12">
                                                        <SignatureCheckbox
                                                            label={"I hereby agree for submitted this request"}
                                                            checked={Checkbox}
                                                            error={validationErrors.Checkboxalidation}
                                                            onChange={(value: boolean) => setCheckbox(value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg12">
                                                        <CustomSignature
                                                            Name={
                                                                (props.userDetails[0].FirstName ?? "") +
                                                                " " +
                                                                (props.userDetails[0]?.MiddleName ?? "") +
                                                                " " +
                                                                (props.userDetails[0]?.LastName ?? "")
                                                            }
                                                            JobTitleInEnglish={
                                                                props.userDetails[0].JopTitleEnglish
                                                            }
                                                            JobTitleInFrench={
                                                                props.userDetails[0].JopTitleFrench
                                                            }
                                                            Department={props.userDetails[0].DepartmentName}
                                                            Date={formState.SignDate.toString()}
                                                            TermsAndCondition={Checkbox}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ),
        },
        ...(props.CurrentRoleID === RoleID.RecruitmentHR &&
            props.stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv
            ? [
                {
                    label: TabName.AdvertisementDetails, //"Advertisement Details",
                    value: "tab2",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{
                                boxShadow: "0px 7px 4px 3px #d3d3d3",
                                borderRadius: "10px",
                                marginTop: "2%",
                            }}
                        >
                            <CardContent>
                                <div>
                                    <>
                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <CustomLabel
                                                    value={"Advertisement"}
                                                    mandatory={true}
                                                />
                                                <AttachmentButton
                                                    label="Upload"
                                                    iconName="CloudUpload"
                                                    iconNameHover="CloudUpload"
                                                    AttachState={(newAttachment: any) => {
                                                        let attachment: IDocFiles[] = newAttachment.map(
                                                            (item: any) => {
                                                                return {
                                                                    name: item.name,
                                                                    content: item.file,
                                                                    type: "New",
                                                                };
                                                            }
                                                        );
                                                        const attachments = [
                                                            ...(formState.AdvertisementAttachement || []),
                                                            ...attachment,
                                                        ];
                                                        handleFileAttachment(
                                                            "AdvertisementAttachement",
                                                            attachments
                                                        );
                                                    }}
                                                    mandatory={true}
                                                    error={validationErrors.AdvertisementAttachement}
                                                    Style={{
                                                        backgroundColor: "rgb(239, 51, 64)",
                                                        color: "white",
                                                    }}
                                                />
                                            </div>
                                            <div
                                                className="ms-Grid-col ms-lg6"
                                            //   style={{ marginTop: "4%" }}
                                            >
                                                {formState.AdvertisementAttachement?.map(
                                                    (file: any, index: number) => {
                                                        const fileName = file.fileName || file.name; // Ensure proper name display
                                                        return (
                                                            <div key={index} className="ms-Grid-row">
                                                                <div className="ms-Grid-col ms-lg12">
                                                                    <Label style={{ color: "blue" }}>
                                                                        {fileName}
                                                                        <span>
                                                                            <Icon
                                                                                iconName="Delete"
                                                                                style={{
                                                                                    marginLeft: "8px",
                                                                                    fontSize: "16px",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        index,
                                                                                        "AdvertisementAttachement"
                                                                                    )
                                                                                } // Call the delete function
                                                                            />
                                                                        </span>
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg4">
                                                <CustomDatePicker
                                                    selectedDate={advDetails.ValidFrom}
                                                    label="Valid From"
                                                    error={validationErrors.ValidFrom}
                                                    minDate={todaydate}
                                                    mandatory={true}
                                                    onChange={(date) =>
                                                        handleDateChange(date, "ValidFrom")
                                                    }
                                                />
                                            </div>
                                            <div className="ms-Grid-col ms-lg4">
                                                <CustomDatePicker
                                                    selectedDate={advDetails.ValidTo}
                                                    label="Valid To"
                                                    error={validationErrors.ValidTo}
                                                    minDate={
                                                        advDetails.ValidFrom
                                                            ? new Date(
                                                                advDetails.ValidFrom.getTime() +
                                                                13 * 24 * 60 * 60 * 1000
                                                            )
                                                            : undefined
                                                    }
                                                    // maxDate={}
                                                    disabled={true}
                                                    mandatory={false}
                                                    onChange={(date) =>
                                                        handleDateChange(date, "ValidTo")
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <RichTextEditor
                                                    label="Role Purpose"
                                                    value={advDetails.RolePurpose}
                                                    mandatory={true}
                                                    onChange={(value) =>
                                                        handleRichTextEditor(value, "RolePurpose")
                                                    }
                                                    error={validationErrors.RolePurpose}
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <RichTextEditor
                                                    label="Job Description"
                                                    value={advDetails.JobDescription}
                                                    mandatory={true}
                                                    onChange={(value) =>
                                                        handleRichTextEditor(value, "JobDescription")
                                                    }
                                                    error={validationErrors.JobDescription}
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg10">
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg5">
                                                        <CustomAutoComplete
                                                            label="Preferred Total Experience"
                                                            options={advDetails.TotalExperienceOption}
                                                            value={advDetails.TotalExperience}
                                                            disabled={false}
                                                            mandatory={true}
                                                            onChange={(item) =>
                                                                handleAutoComplete(item, "TotalExperience")
                                                            }
                                                            error={validationErrors.TotalExperience}
                                                        />
                                                    </div>
                                                    <div className="ms-Grid-col ms-lg5">
                                                        <CustomAutoComplete
                                                            label="Preferred Experience in Mining Industry (Years)"
                                                            options={
                                                                advDetails.ExperienceinMiningIndustryOption
                                                            }
                                                            value={advDetails.ExperienceinMiningIndustry}
                                                            disabled={false}
                                                            mandatory={true}
                                                            onChange={(item) =>
                                                                handleAutoComplete(
                                                                    item,
                                                                    "ExperienceinMiningIndustry"
                                                                )
                                                            }
                                                            error={
                                                                validationErrors.ExperienceinMiningIndustry
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className="ms-Grid-col ms-lg2"
                                                        style={{ textAlign: "right", marginTop: "45px" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="ms-Grid-col ms-lg2"></div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg10">
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg5">
                                                        <CustomMultiSelect
                                                            label="Minimum Qualification"
                                                            value={qualificationValue.MinQualification}
                                                            options={advDetails.MinQualificationOption}
                                                            onChange={(value) =>
                                                                handleMulitiSelect(value, "MinQualification")
                                                            }
                                                            disabled={false}
                                                            mandatory={true}
                                                            error={validationErrors.MinQualification}
                                                        />
                                                    </div>
                                                    <div className="ms-Grid-col ms-lg5">
                                                        <CustomMultiSelect
                                                            label="Preferred Qualification"
                                                            value={qualificationValue.PrefeQualification}
                                                            options={advDetails.MinQualificationOption}
                                                            onChange={(value) =>
                                                                handleMulitiSelect(
                                                                    value,
                                                                    "PrefeQualification"
                                                                )
                                                            }
                                                            disabled={false}
                                                            // mandatory={true}
                                                            error={validationErrors.PrefeQualification}
                                                        />
                                                    </div>
                                                    <div
                                                        className="ms-Grid-col ms-lg2"
                                                        style={{ textAlign: "right", marginTop: "45px" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div
                                                className="ms-Grid-col ms-lg2"
                                                style={{
                                                    marginTop: "45px",
                                                }}
                                            >
                                                <CustomButton
                                                    text="Add new Qualification"
                                                    onClick={() =>
                                                        AddMasterData_fn(
                                                            RoleDescriptionData.Qualification,
                                                            "Add Qualification"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg10">
                                                {RoleSpeKnowledgeValue.map((row, index) => (
                                                    <div className="ms-Grid-row" key={index}>
                                                        <div className="ms-Grid-col ms-lg5">
                                                            <CustomAutoComplete
                                                                label="Role Specific Knowledge"
                                                                options={advDetails.RoleSpeKnowledgeoption}
                                                                value={row.RoleSpeKnowledge}
                                                                disabled={false}
                                                                mandatory={true}
                                                                onChange={(item) =>
                                                                    handleAutoCompleterow(
                                                                        item,
                                                                        "RoleSpeKnowledge",
                                                                        index,
                                                                        "RoleSpeKnowledgeValue"
                                                                    )
                                                                }
                                                                error={validationErrors.RoleSpeKnowledge}
                                                            />
                                                        </div>
                                                        <div className="ms-Grid-col ms-lg5">
                                                            <CustomAutoComplete
                                                                label="Required Level"
                                                                options={advDetails.RequiredLeveloption}
                                                                value={row.RequiredLevel}
                                                                disabled={false}
                                                                mandatory={true}
                                                                onChange={(item) =>
                                                                    handleAutoCompleterow(
                                                                        item,
                                                                        "RequiredLevel",
                                                                        index,
                                                                        "RoleSpeKnowledgeValue"
                                                                    )
                                                                }
                                                                error={validationErrors.RequiredLevel}
                                                            />
                                                        </div>
                                                        <div
                                                            className="ms-Grid-col ms-lg2"
                                                            style={{
                                                                textAlign: "right",
                                                                marginTop: "42px",
                                                                display: "flex",
                                                                gap: "15px",
                                                            }}
                                                        >
                                                            {index > 0 ? (
                                                                <>
                                                                    <CustomButton
                                                                        onClick={() =>
                                                                            handleDeleteRow(
                                                                                index,
                                                                                RoleDescription.RoleSpeKnowledgeValue
                                                                            )
                                                                        }
                                                                        iconName="Delete"
                                                                        style={{ marginRight: "4%" }}
                                                                    />
                                                                    <CustomButton
                                                                        onClick={() =>
                                                                            handleAddRow(
                                                                                RoleDescription.RoleSpeKnowledgeValue
                                                                            )
                                                                        }
                                                                        iconName="Add"
                                                                    />
                                                                </>
                                                            ) : (
                                                                <CustomButton
                                                                    onClick={() =>
                                                                        handleAddRow(
                                                                            RoleDescription.RoleSpeKnowledgeValue
                                                                        )
                                                                    }
                                                                    iconName="Add"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div
                                                className="ms-Grid-col ms-lg2"
                                                style={{ marginTop: "42px" }}
                                            >
                                                <CustomButton
                                                    text="Add new Role Specific Knowledge"
                                                    onClick={() =>
                                                        AddMasterData_fn(
                                                            RoleDescriptionData.RoleSpeKnowledge,
                                                            "Add Role Specific Knowledge"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg10">
                                                {TechnicalSkillValue.map((row, index) => (
                                                    <div className="ms-Grid-row" key={index}>
                                                        <div className="ms-Grid-col ms-lg5">
                                                            <CustomAutoComplete
                                                                label="Technical Skills - Ability to apply Knowledge"
                                                                options={advDetails.TechnicalSkillsOption}
                                                                value={row.TechnicalSkills}
                                                                disabled={false}
                                                                mandatory={true}
                                                                onChange={(item) =>
                                                                    handleAutoCompleterow(
                                                                        item,
                                                                        "TechnicalSkills",
                                                                        index,
                                                                        "TechnicalSkillValue"
                                                                    )
                                                                }
                                                                error={validationErrors.TechnicalSkills}
                                                            />
                                                        </div>
                                                        <div className="ms-Grid-col ms-lg5">
                                                            <CustomAutoComplete
                                                                label="Level of Proficiency"
                                                                options={advDetails.LevelProficiencyOption}
                                                                value={row.LevelProficiency}
                                                                disabled={false}
                                                                mandatory={true}
                                                                onChange={(item) =>
                                                                    handleAutoCompleterow(
                                                                        item,
                                                                        "LevelProficiency",
                                                                        index,
                                                                        "TechnicalSkillValue"
                                                                    )
                                                                }
                                                                error={validationErrors.LevelProficiency}
                                                            />
                                                        </div>
                                                        <div
                                                            className="ms-Grid-col ms-lg2"
                                                            style={{
                                                                textAlign: "right",
                                                                marginTop: "42px",
                                                                display: "flex",
                                                                gap: "15px",
                                                            }}
                                                        >
                                                            {index > 0 ? (
                                                                <>
                                                                    <CustomButton
                                                                        onClick={() =>
                                                                            handleDeleteRow(
                                                                                index,
                                                                                RoleDescription.TechnicalSkillValue
                                                                            )
                                                                        }
                                                                        iconName="Delete"
                                                                        style={{
                                                                            borderRadius: "5px",
                                                                            marginRight: "4%",
                                                                            minWidth: "60px",
                                                                        }}
                                                                    />
                                                                    <CustomButton
                                                                        onClick={() =>
                                                                            handleAddRow(
                                                                                RoleDescription.TechnicalSkillValue
                                                                            )
                                                                        }
                                                                        iconName="Add"
                                                                        style={{
                                                                            borderRadius: "5px",
                                                                            minWidth: "60px",
                                                                        }}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <CustomButton
                                                                    onClick={() =>
                                                                        handleAddRow(
                                                                            RoleDescription.TechnicalSkillValue
                                                                        )
                                                                    }
                                                                    iconName="Add"
                                                                    style={{
                                                                        borderRadius: "5px",
                                                                        minWidth: "60px",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div
                                                className="ms-Grid-col ms-lg2"
                                                style={{
                                                    marginTop: "42px",
                                                }}
                                            >
                                                <CustomButton
                                                    text="Add new Technical Skills"
                                                    onClick={() =>
                                                        AddMasterData_fn(
                                                            RoleDescriptionData.TechnicalSkill,
                                                            "Add Technical Skills"
                                                        )
                                                    }
                                                // iconName="Add"
                                                // style={{
                                                //   borderRadius: "10px",
                                                // }}
                                                />
                                            </div>
                                        </div>

                                        <div className="ms-Grid-row">
                                            <div
                                                className="ms-Grid-col ms-lg5"
                                                style={{ width: "34.9%" }}
                                            >
                                                <CustomAutoComplete
                                                    label="Job Functional Type"
                                                    options={advDetails.JobFunctionalTypeOption}
                                                    value={advDetails.JobFunctionalType}
                                                    disabled={false}
                                                    mandatory={true}
                                                    onChange={(item) =>
                                                        handleAutoComplete(item, "JobFunctionalType")
                                                    }
                                                    error={validationErrors.JobFunctionalType}
                                                />
                                            </div>
                                        </div>
                                        <CustomLabel value={" View Justifications"} />
                                        <ReuseButton
                                            Style={{
                                                minWidth: "117px",
                                                fontSize: "13px",
                                                paddingBottom: "24px",
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "41px",
                                                paddingTop: "23px",
                                                backgroundColor: "#EF3340",
                                                color: "white",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                            label="VIEW"
                                            imgSrc={require("../../assets/viewSubmision-white.svg")}
                                            imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                            imgAlt="View"
                                            imgAltHover="Hovered View"
                                            onClick={OpenComments}
                                            spacing={4}
                                        />

                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <CustomTextArea
                                                    label="Justification"
                                                    value={formState.Comments}
                                                    error={validationErrors.Comments}
                                                    onChange={(value) =>
                                                        handleInputChangeTextArea(value, "Comments")
                                                    }
                                                    mandatory={true}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="ms-Grid-row"
                                            style={{
                                                padding: "3px",
                                                marginTop: "20px",
                                                marginBottom: "-33px",
                                            }}
                                        >
                                            <div className="ms-Grid-col ms-lg12">
                                                <SignatureCheckbox
                                                    label={"I hereby agree for submitted this request"}
                                                    checked={Checkbox}
                                                    error={validationErrors.Checkboxalidation}
                                                    onChange={(value: boolean) => handleCheckbox(value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <CustomSignature
                                                    Name={
                                                        (props.userDetails[0].FirstName ?? "") +
                                                        " " +
                                                        (props.userDetails[0]?.MiddleName ?? "") +
                                                        " " +
                                                        (props.userDetails[0]?.LastName ?? "")
                                                    }
                                                    JobTitleInEnglish={
                                                        props.userDetails[0].JopTitleEnglish
                                                    }
                                                    JobTitleInFrench={
                                                        props.userDetails[0].JopTitleFrench
                                                    }
                                                    Department={props.userDetails[0].DepartmentName}
                                                    Date={formState.SignDate.toString()}
                                                    TermsAndCondition={Checkbox}
                                                />
                                            </div>
                                        </div>
                                    </>
                                </div>
                            </CardContent>
                        </Card>
                    ),
                },
            ]
            : []),
        ...(props.CurrentRoleID === RoleID.HOD &&
            props.stateValue?.StatusId === StatusId.PendingwithHODtoreviewAdv
            ? [
                {
                    label: TabName.ReviewONEMAdvertisement,
                    value: "tab2",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{
                                boxShadow: "0px 7px 4px 3px #d3d3d3",
                                borderRadius: "10px",
                                marginTop: "2%",
                            }}
                        >
                            <CardContent>
                                <div>
                                    <>
                                        {/* <div className="ms-Grid-row">
                                        <CustomLabel value={"Advertisement Documents"} mandatory={true} />
                                    </div>
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-lg6">
                                            <CustomViewDocument
                                                Attachment={formState.AdvertisementDocument}
                                            />
                                        </div>
                                    </div> */}
                                        <div className="ms-Grid-row">
                                            <div
                                                className="ms-Grid-col ms-lg2"
                                                style={{ position: "relative", right: "1px" }}
                                            >
                                                <div>
                                                    <Label>View Advertisement</Label>
                                                    {/* <ReuseButton
                              Style={{
                                minWidth: "117px",
                                fontSize: "13px",
                                paddingBottom: "24px",
                                display: "flex",
                                flexDirection: "column",
                                height: "41px",
                                paddingTop: "22px",
                              }}
                              label="VIEW"
                              imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                              onClick={async () => {
                                setPreview(true);
                                setMainComponent(false);
                              }}
                              imgAltHover="Image"
                              spacing={4}
                              imgSrc={require("../../assets/Viewicon.svg")}
                              imgAlt="ssss"
                            /> */}
                                                    <ReuseButton
                                                        Style={{
                                                            minWidth: "117px",
                                                            fontSize: "13px",
                                                            paddingBottom: "24px",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            height: "41px",
                                                            paddingTop: "23px",
                                                            backgroundColor: "#EF3340",
                                                            color: "white",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                        label="VIEW"
                                                        imgSrc={require("../../assets/viewSubmision-white.svg")}
                                                        imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                        imgAlt="View"
                                                        imgAltHover="Hovered View"
                                                        onClick={async () => {
                                                            setPreview(true);
                                                            setMainComponent(false);
                                                        }}
                                                        spacing={4}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <CustomLabel value={" View Justifications"} />
                                        <ReuseButton
                                            Style={{
                                                minWidth: "117px",
                                                fontSize: "13px",
                                                paddingBottom: "24px",
                                                display: "flex",
                                                flexDirection: "column",
                                                height: "41px",
                                                paddingTop: "23px",
                                                backgroundColor: "#EF3340",
                                                color: "white",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                            label="VIEW"
                                            imgSrc={require("../../assets/viewSubmision-white.svg")}
                                            imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                            imgAlt="View"
                                            imgAltHover="Hovered View"
                                            onClick={OpenComments}
                                            spacing={4}
                                        />
                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <CustomTextArea
                                                    label="Justification"
                                                    value={formState.Comments}
                                                    error={validationErrors.Comments}
                                                    onChange={(value) =>
                                                        handleInputChangeTextArea(value, "Comments")
                                                    }
                                                    mandatory={true}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="ms-Grid-row"
                                            style={{
                                                padding: "3px",
                                                marginTop: "20px",
                                                marginBottom: "-33px",
                                            }}
                                        >
                                            <div className="ms-Grid-col ms-lg12">
                                                <SignatureCheckbox
                                                    label={"I hereby agree for submitted this request"}
                                                    checked={Checkbox}
                                                    error={validationErrors.Checkboxalidation}
                                                    onChange={(value: boolean) => setCheckbox(value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="ms-Grid-row">
                                            <div className="ms-Grid-col ms-lg12">
                                                <CustomSignature
                                                    Name={
                                                        (props.userDetails[0].FirstName ?? "") +
                                                        " " +
                                                        (props.userDetails[0]?.MiddleName ?? "") +
                                                        " " +
                                                        (props.userDetails[0]?.LastName ?? "")
                                                    }
                                                    JobTitleInEnglish={
                                                        props.userDetails[0].JopTitleEnglish
                                                    }
                                                    JobTitleInFrench={
                                                        props.userDetails[0].JopTitleFrench
                                                    }
                                                    Department={props.userDetails[0].DepartmentName}
                                                    Date={formState.SignDate.toString()}
                                                    TermsAndCondition={Checkbox}
                                                />
                                            </div>
                                        </div>
                                    </>
                                </div>
                            </CardContent>
                        </Card>
                    ),
                },
            ]
            : []),
    ];

    useEffect(() => {
        const activeTabObj = tabs.find((item) => item.value === activeTab);
        const prevTabObj = tabs.find((item) => item.value === prevActiveTab);
        if (activeTab === "tab1") {
            setTabNameData((prevTabNames) => {
                const newTabNames = [
                    { tabName: props.stateValue?.TabName },
                    { tabName: props.stateValue?.ButtonAction },
                    { tabName: activeTabObj?.label },
                ];
                return newTabNames;
            });
        } else {
            setTabNameData((prevTabNames) => {
                const newTabNames = [
                    { tabName: props.stateValue?.TabName },
                    { tabName: props.stateValue?.ButtonAction },
                    { tabName: prevTabObj?.label },
                    { tabName: activeTabObj?.label },
                ];

                const uniqueTabNames = newTabNames.filter(
                    (item, index, self) =>
                        item.tabName &&
                        self.findIndex((t) => t.tabName === item.tabName) === index
                );

                return uniqueTabNames;
            });
        }

        if (activeTab !== prevActiveTab) {
            setPrevActiveTab(activeTab);
        }
    }, [activeTab]);

    const handleCancel = () => {
        setIsLoading(true);
        let CancelAlert = {
            Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
            Type: HRMSAlertOptions.Confirmation,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                    props.navigation("/RecurimentProcess");
                    setAlertPopupOpen(false);
                } else {
                    setAlertPopupOpen(false);
                }
            },
        };

        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
        setIsLoading(false);
    };

    async function InsertMasterData(Value: string) {
        const isValid = !MasterDataValidation();
        if (isValid) {
            let MasterData;
            switch (Value) {
                case RoleDescriptionData.Qualification:
                    {
                        MasterData = {
                            Qualification: advDetails.addMasterQualification,
                        };
                        await getVRRDetails.InsertList(
                            MasterData,
                            ListNames.HRMSQualification
                        );
                    }
                    break;
                case RoleDescriptionData.RoleSpeKnowledge:
                    {
                        MasterData = {
                            RoleSpecificKnowledge: advDetails.addMasterQualification,
                        };
                        await getVRRDetails.InsertList(
                            MasterData,
                            ListNames.HRMSRoleSpecificKnowlegeMaster
                        );
                    }
                    break;
                case RoleDescriptionData.TechnicalSkill:
                    {
                        MasterData = {
                            TechnicalSkills: advDetails.addMasterQualification,
                        };
                        await getVRRDetails.InsertList(
                            MasterData,
                            ListNames.HRMSTechnicalSkills
                        );
                    }
                    break;
            }
            setAddQualifbtn(false);
            setAdvDetails((prevState) => ({
                ...prevState,
                addMasterQualification: "",
            }));
        }
    }

    const handleBreadcrumbChange = (newItem: string) => {
        setactiveTab(newItem);
    };

    return (
        <>
            {MainComponent ? (
                <>
                    <CustomLoader isLoading={isLoading}>
                        <div className="menu-card">
                            <BreadcrumbsComponent
                                items={tabs}
                                initialItem={activeTab}
                                TabName={TabNameData}
                                handleCancel={handleCancel}
                                onBreadcrumbChange={handleBreadcrumbChange}
                                additionalButtons={
                                    (props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                                        props.stateValue?.StatusId ===
                                        StatusId.PendingwithHRLeadtoAssignRecruitmentHR) ||
                                        (props.CurrentRoleID === RoleID.RecruitmentHR &&
                                            props.stateValue?.StatusId ===
                                            StatusId.PendingwithRecruitmentHRtoAssignExternalAgency)
                                        ? [
                                            {
                                                label: "Close",
                                                onClick: async () => {
                                                    props.navigation("/RecurimentProcess");
                                                },
                                            },
                                        ]
                                        : props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                                            props.stateValue?.StatusId ===
                                            StatusId.PendingwithHRLeadtouploadONEMsigneddoc
                                            ? [
                                                {
                                                    label: "Upload",
                                                    onClick: async () => {
                                                        await SaveRecruitment();
                                                    },
                                                },
                                            ]
                                            : props.CurrentRoleID === RoleID.RecruitmentHR &&
                                                props.stateValue?.StatusId ===
                                                StatusId.PendingwithRecruitmentHRtouploadAdv
                                                ? [
                                                    {
                                                        label: "Preview",
                                                        onClick: async () => {
                                                            setPreviewBtn(true);
                                                            setMainComponent(false);
                                                        },
                                                    },
                                                    {
                                                        label: "Submit",
                                                        onClick: async () => {
                                                            await SaveRecruitment();
                                                        },
                                                        disable: SubmitBtn,
                                                    },
                                                ]
                                                : props.CurrentRoleID === RoleID.HOD &&
                                                    props.stateValue?.StatusId ===
                                                    StatusId.PendingwithHODtoreviewAdv
                                                    ? [
                                                        {
                                                            label: "Approve",
                                                            onClick: async () => {
                                                                await SaveRecruitment();
                                                            },
                                                        },
                                                    ]
                                                    : []
                                }
                            />
                            {/* <TabsComponent
                                tabs={tabs}
                                initialTab={activeTab}
                                handleCancel={handleCancel}
                                additionalButtons={
                                    advDetails.RolePurpose
                                        ? [
                                            {
                                                label: "Preview",
                                                onClick: async () => {
                                                    setPreviewBtn(true);
                                                    setMainComponent(false);
                                                },
                                            },
                                            {
                                                label: ButtonLabel,
                                                onClick: async () => {
                                                    await SaveRecruitment();
                                                },
                                                disable: SubmitBtn
                                            },
                                        ]
                                        : [
                                            {
                                                label: ButtonLabel,
                                                onClick: async () => {
                                                    await SaveRecruitment();
                                                },
                                                // disable: SubmitBtn
                                            },
                                        ]
                                }
                            /> */}
                        </div>
                    </CustomLoader>
                </>
            ) : PreviewBtn ? (
                <>
                    <PreviewScreen
                        data={advDetails}
                        onclose={() => {
                            setPreviewBtn(false);
                            setMainComponent(true);
                            setactiveTab("tab2");
                        }}
                        Ok_btnfn={() => {
                            setSubmitBtn(false);
                            setPreviewBtn(false);
                            setMainComponent(true);
                            setactiveTab("tab2");
                        }}
                        RoleSpec={RoleSpeKnowledgeValue}
                        Qualification={qualificationValue}
                        TechinicalSkills={TechnicalSkillValue}
                        JobTitle={formState.JobNameInEnglish}
                    />
                </>
            ) : Preview ? (
                <CustomPreviewScreen
                    data={advDetails}
                    onclose={() => {
                        setPreview(false);
                        setMainComponent(true);
                        setactiveTab("tab2");
                    }}
                    Ok_btnfn={() => {
                        setPreview(false);
                        setSubmitBtn(false);
                        setMainComponent(true);
                        setactiveTab("tab2");
                    }}
                    JobTitle={formState.JobNameInEnglish}
                />
            ) : (
                <>
                    <CommanComments
                        onClose={() => {
                            setMainComponent(true);
                            setactiveTab(activeTab);
                        }}
                        Comments={CommentData}
                    />
                </>
            )}
            {AlertPopupOpen ? (
                <>
                    <CustomAlert
                        {...alertProps}
                        onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
                    />
                </>
            ) : (
                <></>
            )}

            {AddQualifbtn && (
                <>
                    <Dialog
                        header={
                            <>
                                <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                    <div className="ms-Grid-col ms-lg12">
                                        <LabelHeaderComponents value={HeaderValue} />
                                    </div>
                                </div>
                            </>
                        }
                        visible={AddQualifbtn}
                        style={{
                            width: "26vw",
                            backgroundColor: "white",
                            borderRadius: "26px",
                            padding: "20px",
                        }}
                        onHide={() => setAddQualifbtn(false)}
                    >
                        <div className="ms-Grid-row" style={{ marginLeft: "6%" }}>
                            <div className="ms-Grid-col ms-lg8">
                                <CustomInput
                                    label={LabelValue}
                                    value={advDetails.addMasterQualification}
                                    disabled={false}
                                    mandatory={true}
                                    onChange={(value) =>
                                        setAdvDetails((prevState) => ({
                                            ...prevState,
                                            addMasterQualification: value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div
                            className="ms-Grid-row"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "5%",
                            }}
                        >
                            <ReuseButton
                                label="Add"
                                onClick={() => InsertMasterData(HeaderValue)}
                                spacing={4}
                            />
                        </div>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default ApprovedVRREdit;
