import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import ReuseButton from "../../components/ReuseButton";

const ApprovedVRREdit: React.FC = (props: any) => {
    const [tabVisibility, setTabVisibility] = useState({
        tab1: true,
        tab2: false,
        tab3: false,
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState({
        VRRID:0,
        BusinessUnitCodeID:0,
        DepartmentID:0,
        SubDepartmentID:0,
        SectionID:0,
        DepartmentCodeID:0,
        JobNameInEnglishID:0,
        JobNameInFrenchID:0,
        PatersonGradeID:0,
        DRCGradeID:0,
        JobCodeID:0,
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
    });

    const fetchData = async () => {
        if (isLoading) return; // Prevent re-execution if already loading
        setIsLoading(true);
        try {
            const filterConditions = [
                {
                    FilterKey: "ID",
                    Operator: "eq",
                    FilterValue: 4,
                },
            ];
            const Conditions = "";
            const response = await getVRRDetails.GetVacancyDetails(filterConditions, Conditions);
            console.log("Fetched GetVacancyDetails: response", response);
            if (response.status === 200 && response.data !== null) {
                const op = response.data[0][0];
                const NoofPositionAssigned = response.data[1];
                console.log("NoofPositionAssigned", NoofPositionAssigned);
                const BUName: any = props?.BusinessUnitCodeAllColumn.filter(
                    (item: any) => (item.key === op.BusinessUnitCodeId)
                );
                const JobtitleFrench: any = props?.JobInFrenchList.filter(
                    (item: any) => (item.key === op.JobTitleInFrenchId)
                );
                console.log("BUName:", BUName);
                console.log("Fetched GetVacancyDetails:", op);
                setFormState((prevState) => ({
                    ...prevState,
                    VRRID:op.VRRID,
                    BusinessUnitCodeID:op.BusinessUnitCodeId,
                    DepartmentID:op.DepartmentId,
                    SubDepartmentID:op.SubDepartmentId,
                    SectionID:op.SectionId,
                    DepartmentCodeID:op.DepartmentCodeId,
                    JobNameInEnglishID:op.JobTitleInEnglishId,
                    JobNameInFrenchID:op.JobTitleInFrenchId,
                    PatersonGradeID:op.PayrollGradeId,
                    DRCGradeID:op.DRCGradeId,
                    JobCodeID:op.JobCodeId,
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
                }));
            }
        } catch (error) {
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const SaveRecruitment = async () => {
        try {
            let Table1: any = {
                //   VRRID: formState.VRRID,

                BusinessUnitCode: formState.BusinessUnitCode,
                Nationality: formState.Nationality,
                EmploymentCategory: formState.EmployementCategory,
                Department: formState.Department,
                SubDepartment: formState.SubDepartment,
                Section: formState.Section,
                DepartmentCode: formState.DepartmentCode,
                NumberOfPersonNeeded: formState.NoofPositionAssigned,
                EnterNumberOfMonths: formState.NoofPositionAssigned,
                TypeOfContract: formState.ContractType,
                DateRequried: formState.Department,
                IsRevert: formState.AreaOfWork,
                ReasonForVacancy: formState.AreaOfWork,
                AreaofWork: formState.AreaOfWork,
                JobCode: formState.JobCode,
                VacancyConfirmed: formState.AreaOfWork,

            };
            const response = await getVRRDetails.InsertRecruitmentDpt(Table1, []);
            console.log(response);
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
            await fetchData();
        };

        void initialize();
    }, []);





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
                                </div>
                                <div className="ms-Grid-row">
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
                                </div>
                                <div className="ms-Grid-row">
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
                                </div>
                                <div className="ms-Grid-row">
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
                                </div>

                                <div className="ms-Grid-row">
                                    <ReuseButton
                                        spacing={4}
                                        onClick={async () => {
                                            await SaveRecruitment(); // Ensure the promise is awaited
                                        }}
                                        width="100%"
                                        label="Submit"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ),
        },
    ];

    return (
        <CustomLoader isLoading={isLoading}>
            <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
                <TabsComponent tabs={tabs} initialTab="tab1" />
            </Card>
        </CustomLoader>
    );
};

export default ApprovedVRREdit;
