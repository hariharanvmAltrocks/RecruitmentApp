import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import { Icon, Label } from "office-ui-fabric-react";
import AttachmentButton from "../../components/AttachmentButton";
import { ADGroupID, DocumentLibraray, HRMSAlertOptions, RecuritmentHRMsg, RoleID } from "../../utilities/Config";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import CustomLabel from "../../components/CustomLabel";

interface IAttachmentExampleState {
    file: File | any;
    fileName: string;
    fileContent: string | ArrayBuffer | null;
    serverRelativeUrl: string;
    ID: string;
}

interface Item {
    name: string;
    fileContent: ArrayBuffer;
    file?: File | any;
    serverRelativeUrl?: string;
    ID?: string;
}

type formValidation = {
    AssignRecruitmentHR: boolean,
    AssignAgencies: boolean
}

const ApprovedVRREdit: React.FC = (props: any) => {
    const [tabVisibility, setTabVisibility] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
    });
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [alertProps, setalertProps] = React.useState<alertPropsData>({
        Message: "",
        Type: "",
        ButtonAction: null,
        visible: false,
    });

    // const [BusinessUnitCode, setBusinessUnitCode] = useState<string>("");
    // const [BusinessUnitName, setBusinessUnitName] = useState<string>("");
    // const [BusinessUnitDescription, setBusinessUnitDescription] = useState<string>("");
    // const [Department, setDepartment] = useState<string>("");
    // const [SubDepartment, setSubDepartment] = useState<string>("");
    // const [Section, setSection] = useState<string>("");
    // const [DepartmentCode, setDepartmentCode] = useState<string>("");
    // const [Nationality, setNationality] = useState<string>("");
    // const [JobNameInEnglish, setJobNameInEnglish] = useState<string>("");
    // const [JobNameInFrench, setJobNameInFrench] = useState<string>("");
    // const [PatersonGrade, setPatersonGrade] = useState<string>("");
    // const [DRCGrade, setDRCGrade] = useState<string>("");
    // const [EmployementCategory, setEmployementCategory] = useState<string>("");
    // const [ContractType, setContractType] = useState<string>("");
    // const [JobCode, setJobCode] = useState<string>("");
    // const [AreaOfWork, setAreaOfWork] = useState<string>("");
    // const [PositionName, setPositionName] = useState<string>("");
    //const [data, setData] = useState<any[]>([]);
    const [ButtonLabel, setButtonLabel] = useState<string>("Submit");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState<{
        VRRID: number;
        BusinessUnitCodeID: number;
        DepartmentID: number;
        SubDepartmentID: number;
        SectionID: number;
        DepartmentCodeID: number;
        JobNameInEnglishID: number;
        JobNameInFrenchID: number;
        PatersonGradeID: number;
        DRCGradeID: number;
        JobCodeID: number;
        BusinessUnitCode: string;
        BusinessUnitName: string;
        BusinessUnitDescription: string;
        Department: string;
        SubDepartment: string;
        Section: string;
        DepartmentCode: string;
        Nationality: string;
        JobNameInEnglish: string;
        JobNameInFrench: string;
        NoofPositionAssigned: string;
        PatersonGrade: string;
        DRCGrade: string;
        EmployementCategory: string;
        ContractType: string;
        JobCode: string;
        AreaOfWork: string;
        ReasonForVacancy: string;
        RecruitmentAuthorised: string;
        EnterNumberOfMonths: number;
        DateRequried: string;
        IsRevert: string;
        VacancyConfirmed: string;
        Attachement: IAttachmentExampleState[];
        PositionDetails: any[];
        RoleProfileDocument: any[];
        AdvertisementDocument: any[];
        AssignRecruitmentHR: AutoCompleteItem;
        AssignRecruitmentHROption: AutoCompleteItem[];
        OnamSignedStampsAttchment: IAttachmentExampleState[]
        OnamSignedStampsDocument: any[];
        AssignAgencies: AutoCompleteItem;
        AssignAgenciesOption: AutoCompleteItem[];
        CandidateCVAttachment: IAttachmentExampleState[];
    }>({
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
        EnterNumberOfMonths: 0,
        DateRequried: "",
        IsRevert: "",
        VacancyConfirmed: "",
        Attachement: [],
        PositionDetails: [],
        RoleProfileDocument: [],
        AdvertisementDocument: [],
        AssignRecruitmentHR: { key: 0, text: "" },
        AssignRecruitmentHROption: [],
        OnamSignedStampsAttchment: [],
        OnamSignedStampsDocument: [],
        AssignAgencies: { key: 0, text: "" },
        AssignAgenciesOption: [],
        CandidateCVAttachment: [],
    });
    const [validationErrors, setValidationError] = React.useState<formValidation>({
        AssignRecruitmentHR: false,
        AssignAgencies: false
    })

    // const getRoleProfile = async (id: any, DocLibraray: string) => {
    //     try {
    //         const data = await getVRRDetails.GetAttachedRoleProfile(id, DocLibraray);
    //         //const data = await this.getCommentsdocument(Config.DocumentLibraray.NewPositionRoleProfile, id);
    //         console.log('getRoleProfile', data);
    //         const getRoleProfileDocument = data?.map((item: any) => ({
    //             id: id,
    //             name: item.fileName,
    //             checked: false,
    //             documentUrl: item.ServerRelativeUrl
    //         }));
    //         return getRoleProfileDocument;
    //     } catch (error) {
    //         console.error('Error in getRoleProfileDocument:', error);
    //         throw error;
    //     }
    // }

    const fetchData = async () => {
        if (isLoading) return; // Prevent re-execution if already loading
        setIsLoading(true);
        try {
            const filterConditionsVRR = [
                {
                    FilterKey: "ID",
                    Operator: "eq",
                    FilterValue: 4,
                },
            ];
            const Conditions = "";
            const response = await getVRRDetails.GetVacancyDetails(filterConditionsVRR, Conditions);
            // console.log("Fetched GetVacancyDetails: response", response);
            // const documentsPromises = getRoleProfile("POS001", DocumentLibraray.HRMSRoleProfile);
            // const documents: any = await documentsPromises;

            if (response.status === 200 && response.data !== null) {
                const op = response.data[0][0];
                const NoofPositionAssigned = response.data[1];
                const BUName: any = props?.BusinessUnitCodeAllColumn.filter(
                    (item: any) => (item.key === op.BusinessUnitCodeId)
                );
                const JobtitleFrench: any = props?.JobInFrenchList.filter(
                    (item: any) => (item.key === op.JobTitleInFrenchId)
                );
                const RoleProfileDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.HRMSRoleProfile,
                    op.JobCode,
                );
                const AdvertismentDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.RecruitmentAdvertisementDocument,
                    op.JobCode,
                );
                const OnamSignedStampsDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.ONAMSignedStampDocuments,
                    op.JobCode,
                );
                let RoleProfileDoc: IDocFiles[] = [];
                let AdvertismentDocPromises: IDocFiles[] = [];
                let ONAMSignedStampDoc: IDocFiles[] = [];
                if (RoleProfileDocment.status === 200 && RoleProfileDocment.data || AdvertismentDocment.status === 200 && AdvertismentDocment.data) {
                    RoleProfileDoc = RoleProfileDocment.data;
                    AdvertismentDocPromises = AdvertismentDocment.data;
                    ONAMSignedStampDoc = OnamSignedStampsDocment.data;
                    console.log(RoleProfileDoc, "candidateCV");
                } else {
                    console.error("Error retrieving attachments:", response.message);
                }

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
                    BusinessUnitName: BUName[0]?.Name || "",
                    BusinessUnitDescription: BUName[0]?.Description || "",
                    Department: op.Department || "",
                    SubDepartment: op.SubDepartment || "",
                    Section: op.Section || "",
                    DepartmentCode: op.DepartmentCode || "",
                    Nationality: op.Nationality || "",
                    JobNameInEnglish: op.JobTitleInEnglish || "",
                    JobNameInFrench: JobtitleFrench[0]?.text || "",
                    PatersonGrade: op.PayrollGrade || "",
                    DRCGrade: op.DRCGrade || "",
                    EmployementCategory: op.EmploymentCategory || "",
                    ContractType: op.TypeOfContract || "",
                    JobCode: op.JobCode || "",
                    AreaOfWork: op.AreaofWork || "",
                    NoofPositionAssigned: NoofPositionAssigned?.length || 0,
                    ReasonForVacancy: op.ReasonForVacancy || "",
                    RecruitmentAuthorised: op.RecruitmentAuthorised || "",
                    EnterNumberOfMonths: op.EnterNumberOfMonths || 0,
                    DateRequried: op.DateRequried || null,
                    IsRevert: op.IsRevert || "",
                    VacancyConfirmed: op.VacancyConfirmed || "",
                    RoleProfileDocument: RoleProfileDoc,
                    AdvertisementDocument: AdvertismentDocPromises,
                    OnamSignedStampsDocument: ONAMSignedStampDoc
                }));
                if (response.data[1]?.length > 0 && response.data[1] !== null) {
                    const updatedPositions = response.data[1].map((position: any) => ({
                        ...position,
                        PatersonGradeID: op.PayrollGradeId,
                        DRCGradeID: op.DRCGradeId,
                    }));
                    console.log("updatedPositions", updatedPositions);
                    setFormState((prevState) => ({
                        ...prevState,
                        PositionDetails: updatedPositions,
                    }));
                }
            }

        } catch (error) {
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttachement = async (ID: any, ParentFolder: string, Attachment: IAttachmentExampleState[]) => {
        try {
            console.log("IDID", ID);
            if (ID && Attachment && Attachment.length > 0) {
                for (const attachment of Attachment) {
                    await CommonServices.uploadAttachmentToLibrary(
                        ID,
                        attachment.file,
                        ParentFolder
                    );
                }
            }
        } catch (error) {
            console.error("Error handling form submission:", error);
        } finally {
            console.log("Attachments upload process completed");
        }
    };


    const SaveRecruitment = async () => {
        try {
            let Table1: any = {
                VRRID: formState.VRRID,
                BusinessUnitCode: formState.BusinessUnitCodeID,
                Nationality: formState.Nationality,
                EmploymentCategory: formState.EmployementCategory,
                Department: formState.DepartmentID,
                SubDepartment: formState.SubDepartmentID,
                Section: formState.SectionID,
                DepartmentCode: formState.DepartmentCodeID,
                NumberOfPersonNeeded: formState.NoofPositionAssigned,
                EnterNumberOfMonths: formState.EnterNumberOfMonths,
                TypeOfContract: formState.ContractType,
                DateRequried: formState.DateRequried,
                IsRevert: formState.IsRevert,
                ReasonForVacancy: formState.ReasonForVacancy,
                AreaofWork: formState.AreaOfWork,
                JobCode: formState.JobCodeID,
                VacancyConfirmed: formState.VacancyConfirmed,
                AssignedHRId: formState.AssignRecruitmentHR.key

            };
            // let Table2: any = {
            //     JobTitleEnglish: formState.JobNameInEnglishID,
            //     PatersonGrade: formState.PatersonGradeID,
            //     DRCGrade: formState.DRCGradeID,
            // }
            console.log(Table1, "Table1")
            switch (props.CurrentRoleID) {
                case RoleID.RecruitmentHRLead: {
                    if (formState.OnamSignedStampsAttchment.length > 0) {
                        await handleAttachement(
                            formState.JobCode,
                            DocumentLibraray.ONAMSignedStampDocuments,
                            formState.OnamSignedStampsAttchment
                        )
                    } else {
                        const response = await getVRRDetails.InsertRecruitmentDpt(Table1, formState.PositionDetails);
                        console.log(response);

                    }

                    setIsLoading(true);
                    let CancelAlert = {
                        Message: RecuritmentHRMsg.RecuritmentSubmitMsg,
                        Type: HRMSAlertOptions.Success,
                        visible: true,
                        ButtonAction: async (userClickedOK: boolean) => {
                            if (userClickedOK) {
                                props.navigation("/RecurimentProcess");
                                setAlertPopupOpen(false);
                            }
                        }
                    }

                    setAlertPopupOpen(true);
                    setalertProps(CancelAlert);
                    setIsLoading(false);

                    break;
                }
                case RoleID.RecruitmentHR: {
                    const AttachDocument = await handleAttachement(formState.JobCode, DocumentLibraray.RecruitmentAdvertisementDocument, formState.Attachement);
                    let UpdateAlert = {
                        Message: RecuritmentHRMsg.AdvertisementSubmitMsg,
                        Type: HRMSAlertOptions.Success,
                        visible: true,
                        ButtonAction: async (userClickedOK: boolean) => {
                            if (userClickedOK) {
                                props.navigation("/RecurimentProcess");
                                setAlertPopupOpen(false);
                            }
                        }
                    }

                    setAlertPopupOpen(true);
                    setalertProps(UpdateAlert);
                    setIsLoading(false);
                    console.log(AttachDocument, "AttachDocument");

                    break;
                }
                case RoleID.HOD: {
                    let approveAlert = {
                        Message: RecuritmentHRMsg.ApprovedMsg,
                        Type: HRMSAlertOptions.Success,
                        visible: true,
                        ButtonAction: async (userClickedOK: boolean) => {
                            if (userClickedOK) {
                                props.navigation("/RecurimentProcess");
                                setAlertPopupOpen(false);
                            }
                        }
                    }

                    setAlertPopupOpen(true);
                    setalertProps(approveAlert);
                    setIsLoading(false);
                    break;
                }
            }
        } catch (error) {
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const isInitialized = useRef(false);

    useEffect(() => {
        const initialize = async () => {
            if (isInitialized.current) return; // Skip if already initialized
            isInitialized.current = true;

            setTabVisibility({
                tab1: true,
                tab2: false,
                tab3: false,
            });
            if (props.CurrentRoleID === RoleID.HOD) {
                setButtonLabel("Approve")
            } else if ((props.CurrentRoleID === RoleID.RecruitmentHR)) {
                setButtonLabel("Submit")
            }
            await fetchData();
        };

        void initialize();
    }, []);



    useEffect(() => {
        const getADGroupsOption = async () => {
            try {
                const AssignRecurtimentHROption = await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSRecruitmentHR);
                const AssignAgenciesOption = await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSHOD);

                if (
                    (AssignRecurtimentHROption.status === 200 && AssignRecurtimentHROption.data) ||
                    (AssignAgenciesOption.status === 200 && AssignAgenciesOption.data)
                ) {
                    const AssignRecrutiment = AssignRecurtimentHROption.data.filter(
                        (item: { key: any }) => item.key === props.stateValue?.rowData?.AssignedHRId
                    );
                    console.log(AssignRecrutiment, "AssignRecrutiment");

                    const AssignRecrutimentObject = AssignRecrutiment.reduce(
                        (acc: { [key: string]: any }, item: { key: any }) => {
                            return item;
                        },
                        {}
                    );
                    // const AssignAgencies = AssignAgenciesOption.data.filter(
                    //     (item: { key: any }) => item.key === props.stateValue?.rowData?.AssignedHRId
                    // );
                    // console.log(AssignAgencies, "AssignAgencies");

                    // const AssignAgenciesObject = AssignAgencies.reduce(
                    //     (acc: { [key: string]: any }, item: { key: any }) => {
                    //         return item;
                    //     },
                    //     {}
                    // );

                    console.log(AssignRecrutimentObject, "AssignRecrutimentObject");
                    setFormState((prevState: any) => ({
                        ...prevState,
                        AssignRecruitmentHROption: AssignRecurtimentHROption.data,
                        AssignRecruitmentHR: AssignRecrutimentObject,
                        AssignAgenciesOption: AssignAgenciesOption.data,
                        // AssignAgencies: AssignAgenciesObject
                    }));
                } else {
                    console.error("Error retrieving attachments:", AssignRecurtimentHROption.data.message);
                }
            } catch (error) {
                console.error("Error in fetching data:", error);
            }
        };

        void getADGroupsOption();
    }, []);


    const handleDelete = (index: number, attachmentType: 'Attachement' | 'OnamSignedStampsAttchment' | 'CandidateCVAttachment') => {
        console.log("Deleting attachment at index:", index, "from", attachmentType);

        setFormState((prevState) => {
            const updatedAttachments = [...prevState[attachmentType]];
            updatedAttachments.splice(index, 1);

            return {
                ...prevState,
                [attachmentType]: updatedAttachments,
            };
        });
    };



    const handleAutoComplete = async (
        item: AutoCompleteItem | null,
        StateValue: string
    ) => {
        if (item) {
            setFormState((prevState) => ({
                ...prevState,
                [StateValue]: item
            }))
            setValidationError((prevState) => ({
                ...prevState,
                [StateValue]: false
            }))
        }
    };


    const tabs = [
        {
            label: "Approved VRR",
            value: "tab1",
            content: (
                <Card
                    variant="outlined"
                    sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                >
                    <CardContent>
                        {tabVisibility.tab1 && (
                            <div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg6">
                                        <LabelHeaderComponents
                                            value={
                                                "Position Details"
                                            }
                                        >
                                            {" "}
                                        </LabelHeaderComponents>
                                    </div>
                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Job Code"
                                            value={formState.JobCode}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobCode: value }))
                                            }
                                        />

                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Business Unit Code"
                                            value={formState.BusinessUnitCode}
                                            error={false}
                                            disabled={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, BusinessUnitCode: value }))
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
                                                setFormState((prevState) => ({ ...prevState, BusinessUnitName: value }))
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
                                                setFormState((prevState) => ({ ...prevState, BusinessUnitDescription: value }))
                                            }
                                        />
                                    </div>

                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Department"
                                            value={formState.Department}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, Department: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Sub-Department"
                                            value={formState.SubDepartment}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, SubDepartment: value }))
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
                                                setFormState((prevState) => ({ ...prevState, Section: value }))
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
                                                setFormState((prevState) => ({ ...prevState, DepartmentCode: value }))
                                            }
                                        />

                                    </div>

                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Nationality"
                                            value={formState.Nationality}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, Nationality: value }))
                                            }
                                        />
                                    </div>
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
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Paterson Grade"
                                            value={formState.PatersonGrade}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, PatersonGrade: value }))
                                            }
                                        />
                                    </div>

                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="DRC Grade"
                                            value={formState.DRCGrade}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, DRCGrade: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Employee Category"
                                            value={formState.EmployementCategory}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, EmployementCategory: value }))
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
                                                setFormState((prevState) => ({ ...prevState, ContractType: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Area of Work"
                                            value={formState.AreaOfWork}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, AreaOfWork: value }))
                                            }
                                        />
                                    </div>

                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="No.Of Position Assigned"
                                            value={formState.NoofPositionAssigned}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, NoofPositionAssigned: value }))
                                            }
                                        />
                                    </div>
                                    {props.CurrentRoleID === RoleID.RecruitmentHRLead ? (
                                        <>
                                            <div className="ms-Grid-col ms-lg3">
                                                <CustomAutoComplete
                                                    label="Assign RecuritmentHR"
                                                    options={formState.AssignRecruitmentHROption}
                                                    value={formState.AssignRecruitmentHR}
                                                    disabled={props.stateValue?.rowData?.AssignedHRId > 0}
                                                    mandatory={true}
                                                    onChange={(item) => handleAutoComplete(item, "AssignRecruitmentHR")}
                                                    error={validationErrors.AssignRecruitmentHR}
                                                />
                                            </div>
                                        </>
                                    ) : (<></>)}
                                    {props.CurrentRoleID === RoleID.RecruitmentHR && formState.OnamSignedStampsDocument.length > 0 ? (
                                        <>
                                            <div className="ms-Grid-col ms-lg3">
                                                <CustomAutoComplete
                                                    label="Assign Agencies"
                                                    options={formState.AssignAgenciesOption}
                                                    value={formState.AssignAgencies}
                                                    disabled={false}
                                                    mandatory={true}
                                                    onChange={(item) => handleAutoComplete(item, "AssignAgencies")}
                                                    error={validationErrors.AssignAgencies}
                                                />
                                            </div>
                                        </>
                                    ) : (<></>)}

                                    {/* <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="VRR ID"
                                            value={formState.VRRID}
                                            disabled={true}

                                            mandatory={false}
                                            onChange={(value: any) =>
                                                setFormState((prevState) => ({ ...prevState, VRRID: value }))
                                            }
                                        />
                                    </div> */}

                                </div>

                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg4">
                                        <Labelheader value={"Role Profile Documents"}> </Labelheader>
                                        {console.log(formState.RoleProfileDocument, "NewPositionAttachment")}
                                        {formState.RoleProfileDocument?.map((attachment: any) => (
                                            <div key={attachment.documentUrl}>
                                                <p>
                                                    <a href={attachment.documentUrl} target="_blank" rel="noopener noreferrer">
                                                        <LabelValue value={attachment.name} > </LabelValue>
                                                    </a>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {props.stateValue?.tab === "tab1" && props.CurrentRoleID === RoleID.RecruitmentHRLead ? (
                                    <></>
                                ) : (
                                    <>
                                        {props.CurrentRoleID === RoleID.RecruitmentHR ? (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg6" style={{ marginTop: "2rem" }}>
                                                        <CustomLabel value={"Attach Advertisement Documents"} mandatory={true} />
                                                        <AttachmentButton
                                                            label="Attach Documents"
                                                            iconName="CloudUpload"
                                                            iconNameHover="CloudUpload"
                                                            AttachState={(newAttachments: Item[]) => {
                                                                setFormState((prevState: any) => ({
                                                                    ...prevState,
                                                                    Attachement: [...prevState.Attachement, ...newAttachments],
                                                                }));
                                                            }}
                                                            mandatory={true}
                                                            error={false}
                                                        />


                                                    </div>
                                                </div>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg6">
                                                        {console.log("checking", formState.Attachement)}
                                                        {formState.Attachement?.map((file: any, index: number) => {
                                                            const fileName = file.fileName || file.name; // Ensure proper name display
                                                            console.log("Rendering file:", fileName);

                                                            return (
                                                                <div key={index} className="ms-Grid-row">
                                                                    <div className="ms-Grid-col ms-lg12">
                                                                        <Label>
                                                                            {fileName}
                                                                            <span>
                                                                                <Icon
                                                                                    iconName="Delete"
                                                                                    style={{
                                                                                        marginLeft: "8px",
                                                                                        fontSize: "16px",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                    onClick={() => handleDelete(index, 'Attachement')} // Call the delete function
                                                                                />
                                                                            </span>
                                                                        </Label>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                    </div>
                                                </div>

                                            </>
                                        ) : (props.CurrentRoleID === RoleID.HOD || props.CurrentRoleID === RoleID.RecruitmentHRLead) && formState.AdvertisementDocument.length > 0 ? (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg4">
                                                        <Labelheader value={"Advertisement Documents"}> </Labelheader>
                                                        {console.log(formState.AdvertisementDocument, "AdvertisementDocument")}
                                                        {formState.AdvertisementDocument?.map((attachment: any) => (
                                                            <div key={attachment.documentUrl}>
                                                                <p>
                                                                    <a href={attachment.documentUrl} target="_blank" rel="noopener noreferrer">
                                                                        <LabelValue value={attachment.name} > </LabelValue>
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}



                                        {props.CurrentRoleID === RoleID.RecruitmentHRLead && formState.AdvertisementDocument.length > 0 ? (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg6" style={{ marginTop: "2rem" }}>
                                                        <CustomLabel value={"Attach ONAM Signed & Stamps Documents"} mandatory={true} />
                                                        <AttachmentButton
                                                            label="Attach Documents"
                                                            iconName="CloudUpload"
                                                            iconNameHover="CloudUpload"
                                                            AttachState={(newAttachments: Item[]) => {
                                                                // Directly update state here
                                                                setFormState((prevState: any) => ({
                                                                    ...prevState,
                                                                    OnamSignedStampsAttchment: [...prevState.OnamSignedStampsAttchment, ...newAttachments],
                                                                }));
                                                            }}
                                                            mandatory={true}
                                                            error={false}
                                                        />

                                                        <div className="ms-Grid-row">
                                                            <div className="ms-Grid-col ms-lg6">
                                                                {console.log("OnamSignedStampsAttchment", formState.OnamSignedStampsAttchment)}
                                                                {formState.OnamSignedStampsAttchment?.map((file: any, index: number) => {
                                                                    const fileName = file.fileName || file.name; // Ensure proper name display
                                                                    console.log("Rendering file:", fileName);

                                                                    return (
                                                                        <div key={index} className="ms-Grid-row">
                                                                            <div className="ms-Grid-col ms-lg12">
                                                                                <Label>
                                                                                    {fileName}
                                                                                    <span>
                                                                                        <Icon
                                                                                            iconName="Delete"
                                                                                            style={{
                                                                                                marginLeft: "8px",
                                                                                                fontSize: "16px",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() => handleDelete(index, 'OnamSignedStampsAttchment')} // Call the delete function
                                                                                        />
                                                                                    </span>
                                                                                </Label>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}

                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </>
                                        ) : (<></>)}

                                        {formState.OnamSignedStampsDocument.length > 0 && props.CurrentRoleID === RoleID.RecruitmentHR ? (
                                            <>
                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg6">
                                                        <Labelheader value={"Advertisement Documents"}> </Labelheader>
                                                        {console.log(formState.AdvertisementDocument, "AdvertisementDocument")}
                                                        {formState.AdvertisementDocument?.map((attachment: any) => (
                                                            <div key={attachment.documentUrl}>
                                                                <p>
                                                                    <a href={attachment.documentUrl} target="_blank" rel="noopener noreferrer">
                                                                        <LabelValue value={attachment.name} > </LabelValue>
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="ms-Grid-row">
                                                    <div className="ms-Grid-col ms-lg6">
                                                        <Labelheader value={"ONAM Signed&Stamps Documents"}> </Labelheader>
                                                        {console.log(formState.OnamSignedStampsDocument, "AdvertisementDocument")}
                                                        {formState.OnamSignedStampsDocument?.map((attachment: any) => (
                                                            <div key={attachment.documentUrl}>
                                                                <p>
                                                                    <a href={attachment.documentUrl} target="_blank" rel="noopener noreferrer">
                                                                        <LabelValue value={attachment.name} > </LabelValue>
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (<></>)}



                                    </>
                                )}

                            </div>
                        )}
                    </CardContent>
                </Card>
            ),
        },
    ];

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
            }
        }

        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
        setIsLoading(false);

    };

    return (
        <>
            <CustomLoader isLoading={isLoading}>
                <div className="menu-card">
                    <TabsComponent
                        tabs={tabs}
                        initialTab="tab1"
                        handleCancel={handleCancel}
                        additionalButtons={[
                            {
                                label: ButtonLabel,
                                onClick: async () => {
                                    await SaveRecruitment();
                                }
                            }
                        ]}
                    />
                </div>
            </CustomLoader>


            {AlertPopupOpen ? (
                <>
                    <CustomAlert
                        {...alertProps}
                        onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
                    />
                </>
            ) : <></>}

        </>

    );
};

export default ApprovedVRREdit;

