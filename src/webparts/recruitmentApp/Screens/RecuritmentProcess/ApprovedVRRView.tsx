import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import { DocumentLibraray, RoleProfileMaster } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TitleHeader from "../../components/TitleHeader";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";
import { RecuritmentData } from "../../Models/RecuritmentVRR";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import CustomLabel from "../../components/CustomLabel";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CommanComments from "../../components/CommanComments";
import ReuseButton from "../../components/ReuseButton";
import CustomViewDocument from "../../components/CustomViewDocument";

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
        IsPayrollEmailed:"",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [MainComponent, setMainComponent] = useState<boolean>(true);
    const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();

    const fetchData = async () => {
        if (isLoading) return; // Prevent re-execution if already loading
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
            const response = await getVRRDetails.GetRecruitmentDetails(filterConditionsVRR, Conditions);
            // console.log("Fetched GetVacancyDetails: response", response);
            // const documentsPromises = getRoleProfile("POS001", DocumentLibraray.HRMSRoleProfile);
            // const documents: any = await documentsPromises;

            if (response.status === 200 && response.data !== null) {
                const op = response.data[0];
                const NoofPositionAssigned = response.data[1];
                const BUName: any = props?.BusinessUnitCodeAllColumn.filter(
                    (item: any) => (item.key === op.BusinessUnitCodeId)
                );
                const JobtitleFrench: any = props?.JobInFrenchList.filter(
                    (item: any) => (item.key === op.JobTitleInFrenchId)
                );
                const RoleProfileDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.RoleProfileMaster,
                    op.JobCode,
                    RoleProfileMaster.RoleProfile
                );
                const GradingDocument = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.RoleProfileMaster,
                    op.JobCode,
                    RoleProfileMaster.Grading
                );
                const AdvertismentDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.RecruitmentAdvertisementDocument,
                    props.stateValue?.ID,
                    op.JobCode,
                );
                const OnamSignedStampsDocment = await CommonServices.GetAttachmentToLibrary(
                    DocumentLibraray.ONAMSignedStampDocuments,
                    props.stateValue?.ID,
                    op.JobCode,
                );
                let RoleProfileDoc: IDocFiles[] = [];
                let AdvertismentDocPromises: IDocFiles[] = [];
                let ONAMSignedStampDoc: IDocFiles[] = [];
                let GradingDoc: IDocFiles[] = [];
                if (RoleProfileDocment.status === 200 && RoleProfileDocment.data || AdvertismentDocment.status === 200 && AdvertismentDocment.data) {
                    RoleProfileDoc = RoleProfileDocment.data;
                    AdvertismentDocPromises = AdvertismentDocment.data;
                    ONAMSignedStampDoc = OnamSignedStampsDocment.data;
                    GradingDoc = GradingDocument.data;
                    console.log(RoleProfileDoc, "candidateCV");
                } else {
                    console.error("Error retrieving attachments:", response.message);
                }

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
                    GradingDocument: GradingDoc,
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
                    setData((prevState) => ({
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

    useEffect(() => {
        const initialize = async () => {
            setTabVisibility({
                tab1: true, // Activate the first tab initially
                tab2: false,
                tab3: false,
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
            console.log(CommentsList.data);
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
                                        <TitleHeader value="Position Details" />
                                    </div>
                                </div>
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Job Code" />
                                        <LabelValue value={data.JobCode} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Business Unit Code" />
                                        <LabelValue value={data.BusinessUnitCode} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Business Unit Name" />
                                        <LabelValue value={data.BusinessUnitName} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Business Unit Description" />
                                        <LabelValue value={data.BusinessUnitDescription} />
                                    </div>
                                </div>

                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Department" />
                                        <LabelValue value={data.Department} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Sub-Department" />
                                        <LabelValue value={data.SubDepartment} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Section" />
                                        <LabelValue value={data.Section} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Department Code" />
                                        <LabelValue value={data.DepartmentCode} />
                                    </div>

                                </div>

                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Nationality" />
                                        <LabelValue value={data.Nationality} />
                                    </div>
                                    {/* <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Position Name (English)" />
                                        <LabelValue value={data.JobNameInEnglish} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Position Name (French)" />
                                        <LabelValue value={data.JobNameInFrench} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Proposed Paterson Grade" />
                                        <LabelValue value={data.PatersonGrade} />
                                    </div> */}
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Employment Category" />
                                        <LabelValue value={data.EmployementCategory} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Type of Contract" />
                                        <LabelValue value={data.ContractType} />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Area of Work" />
                                        <LabelValue value={data.AreaOfWork} />
                                    </div>
                                </div>

                                {/* <div className="ms-Grid-row"> */}
                                {/* <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Proposed DRC Grade" />
                                        <LabelValue value={data.DRCGrade} />
                                    </div> */}

                                {/* </div> */}

                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="No of Position Assigned" />
                                        <LabelValue value={data.NoofPositionAssigned} />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomViewDocument
                                            Attachment={data.RoleProfileDocument}
                                            Label={"Role Profile Documents"}
                                        />
                                    </div>

                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomViewDocument
                                            Attachment={data.GradingDocument}
                                            Label={"Grading Documents"}
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <Labelheader value="Assign RecruitmentHR" />
                                        <LabelValue value={props.stateValue?.AssignedHR} />
                                    </div>
                                </div>
                                {data.AdvertisementDocument && (
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-lg6">
                                            <CustomViewDocument
                                                Attachment={data.AdvertisementDocument}
                                                Label={"Advertisement Documents"}
                                            />
                                        </div>
                                    </div>
                                )}


                                {data.OnamSignedStampsDocument && (
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-lg6">
                                            <CustomViewDocument
                                                Attachment={data.OnamSignedStampsDocument}
                                                Label={"ONEM Signed&Stamps Documents"}
                                            />
                                        </div>
                                    </div>
                                )}

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
                                                    paddingTop: "22px",
                                                }}
                                                label="VIEW"
                                                onClick={OpenComments}
                                                spacing={4}
                                                imgSrc={require("../../assets/Viewicon.svg")}
                                                imgAlt="ssss"
                                                imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                imgAltHover="Image"
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

    return (
        <>
            {MainComponent ? (
                <>

                    <CustomLoader isLoading={isLoading}>
                        <div className="menu-card">
                            <TabsComponent tabs={tabs}
                                initialTab="tab1"
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

