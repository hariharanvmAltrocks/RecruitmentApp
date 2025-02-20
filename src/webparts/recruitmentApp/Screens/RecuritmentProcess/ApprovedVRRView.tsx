import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import { DocumentLibraray, RoleProfileMaster } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { RecuritmentData } from "../../Models/RecuritmentVRR";
import CustomLabel from "../../components/CustomLabel";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CommanComments from "../../components/CommanComments";
import ReuseButton from "../../components/ReuseButton";
import CustomViewDocument from "../../components/CustomViewDocument";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import BreadcrumbsComponent, { TabNameData } from "../../components/CustomBreadcrumps";

const ApprovedVRRView: React.FC = (props: any) => {
    const [tabVisibility, setTabVisibility] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
    });

    const [data, setData] = useState<RecuritmentData>({
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

    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [MainComponent, setMainComponent] = useState<boolean>(true);
    const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
    const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
    const [activeTab, setactiveTab] = useState<string>("tab1");

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

            const response = await getVRRDetails.GetRecruitmentDetails(
                filterConditionsVRR,
                Conditions
            );

            if (response.data) {
                const op = response.data[0]
                // const NoofPositionAssigned = response.data[1];

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

                    setData((prevState) => ({
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

    useEffect(() => {
        const initialize = async () => {
            setTabVisibility({
                tab1: true, // Activate the first tab initially
                tab2: false,
                tab3: false,
            });
            setTabNameData((prevTabNames) => {
                const newTabNames = [
                    { tabName: props.stateValue?.TabName },
                ];
                return newTabNames;
            });
            try {
                await fetchData(); // Await the asynchronous fetchData
            } catch (error) {
                console.error("Error fetching data:", error); // Handle errors
            }
        };

        void initialize(); // Mark the call as intentionally unawaited
    }, []);

    const OpenComments = async () => {
        setMainComponent(false);
        let filterConditions = []
        let Conditions = "";

        filterConditions.push({
            FilterKey: "RecruitmentID",
            Operator: "eq",
            FilterValue: props.stateValue.ID,
        })
        const CommentsList =
            await getVRRDetails.GetCommentsData(props.EmployeeList, Conditions, filterConditions)
        if (CommentsList.status === 200) {
            setCommentsData(CommentsList.data)
        }
    }

    const tabs = [
        {
            label: "My Submission",
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
                                            value={`Job Title - ${data.JobNameInEnglish} (${data.JobCode})`}
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
                                            value={data.BusinessUnitCode}
                                            error={false}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    BusinessUnitCode: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Business Unit Name"
                                            value={data.BusinessUnitName}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    BusinessUnitName: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Business Unit Description"
                                            value={data.BusinessUnitDescription}
                                            error={false}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    BusinessUnitDescription: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Department"
                                            value={data.Department}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
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
                                            value={data.SubDepartment}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    SubDepartment: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Section"
                                            value={data.Section}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    Section: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Department Code"
                                            value={data.DepartmentCode}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    DepartmentCode: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Nationality"
                                            value={data.Nationality}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
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
                                            value={data.PatersonGrade}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    PatersonGrade: value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="DRC Grade"
                                            value={data.DRCGrade}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    DRCGrade: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Employment Category"
                                            value={data.EmployementCategory}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    EmployementCategory: value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Type of Contract"
                                            value={data.ContractType}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
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
                                            value={data.AreaOfWork}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    AreaOfWork: value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="No of Position Assigned"
                                            value={data.NoofPositionAssigned}
                                            disabled={true}
                                            error={false}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setData((prevState) => ({
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
                                            Attachment={data.RoleProfileDocument}
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomLabel value={"Grading Documents"} />
                                        <CustomViewDocument Attachment={data.GradingDocument} />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomLabel value={"Advertisement Documents"} />
                                        <CustomViewDocument
                                            Attachment={data.AdvertisementDocument}
                                        />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomLabel value={"ONEM Signed&Stamps Documents"} />
                                        <CustomViewDocument
                                            Attachment={data.OnamSignedStampsDocument}
                                        />
                                    </div>

                                </div>

                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg12">
                                        <div className="ms-Grid-col ms-lg4">
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
                                                imgSrc={require("../../assets/Viewicon.svg")}
                                                imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                imgAlt="View"
                                                imgAltHover="Hovered View"
                                                onClick={OpenComments}
                                                spacing={4}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </CardContent>
                </Card>
            ),
        },
    ];
    const back_fn = () => {
        props.navigation("/RecurimentProcess");
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
                                onBreadcrumbChange={handleBreadcrumbChange}
                                additionalButtons={[
                                    {
                                        label: "Back",
                                        onClick: () => {
                                            back_fn();
                                        }
                                    }
                                ]}
                            />
                        </div>
                    </CustomLoader>
                </>
            ) : (<>
                <CommanComments
                    onClose={() => setMainComponent(true)}
                    Comments={CommentData} />
            </>)}
        </>


    );
};

export default ApprovedVRRView;

