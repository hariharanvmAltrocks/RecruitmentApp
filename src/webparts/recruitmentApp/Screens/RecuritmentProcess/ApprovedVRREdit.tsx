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
import { Icon, Label } from "office-ui-fabric-react";
import AttachmentButton from "../../components/AttachmentButton";
import { sp } from "@pnp/sp";
import { DocumentLibraray } from "../../utilities/Config";
import Labelheader from "../../components/LabelHeader";
import LabelValue from "../../components/LabelValue";

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
        RoleProfileDocument:any[];
        AdvertisementDocument:any[];
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
        RoleProfileDocument:[],
        AdvertisementDocument:[],
    });

    const getRoleProfile = async (id: any,DocLibraray:string) => {
        try {
          const data = await getVRRDetails.GetAttachedRoleProfile(id, DocLibraray);
          //const data = await this.getCommentsdocument(Config.DocumentLibraray.NewPositionRoleProfile, id);
          console.log('getRoleProfile', data);
          const getRoleProfileDocument = data?.map((item: any) => ({
            id: id,
            name: item.fileName,
            checked: false,
            documentUrl: item.ServerRelativeUrl
          }));
          return getRoleProfileDocument;
        } catch (error) {
          console.error('Error in getRoleProfileDocument:', error);
          throw error; // Re-throwing error for the caller to handle
        }
      }

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
            console.log("Fetched GetVacancyDetails: response", response);
            const documentsPromises = getRoleProfile("POS001",DocumentLibraray.HRMSRoleProfile);
            const documents: any = await documentsPromises;
           
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
                const AdvertismentDocPromises = getRoleProfile("167",DocumentLibraray.HRMSRoleProfile);
                const AdvertismentDoc: any = await AdvertismentDocPromises;
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
                    RoleProfileDocument:documents,
                    AdvertisementDocument:AdvertismentDoc,
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

    const uploadAttachmentToLibrary = async (
        ItemID: number,
        attach: File,
        name: string
    ) => {
        try {
            const fileReader = new FileReader();
            fileReader.onload = async (event: any) => {
                const fileContent = event.target.result;
                const folderName = ItemID.toString();
                const attachmentsLibrary = sp.web.lists.getByTitle(name);
                const folderResult = await attachmentsLibrary.rootFolder.folders.add(
                    folderName
                );
                // Get the folder's server-relative URL
                const folderUrl = folderResult.data.ServerRelativeUrl;
                // Upload the attachment to the folder
                await attachmentsLibrary.rootFolder.files.add(
                    `${folderUrl}/${attach.name}`,
                    fileContent
                );
            };

            fileReader.readAsArrayBuffer(attach);
        } catch (error) {
            console.log("Error uploading attachment:", error);
        } finally {
            console.log("Attachments upload process completed");
        }
    };

    const handleAttachement = async (ID: any, ParentFolder: string) => {
        try {
            console.log("IDID", ID);
            // console.log("Attachments in state:", formState.Attachement);
            if (ID && formState.Attachement.length > 0) {
                for (const attachment of formState.Attachement) {
                    await uploadAttachmentToLibrary(
                        ID,
                        attachment.file, // TypeScript now recognizes this property
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

            };
            // let Table2: any = {
            //     JobTitleEnglish: formState.JobNameInEnglishID,
            //     PatersonGrade: formState.PatersonGradeID,
            //     DRCGrade: formState.DRCGradeID,
            // }
            const response = await getVRRDetails.InsertRecruitmentDpt(Table1, formState.PositionDetails).then(async (ret: any) => {
                await handleAttachement(
                    ret.data.data.ID,
                    DocumentLibraray.HRMSRecruitment
                )
            });
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


    const handleDelete = (index: number) => {
        console.log("Deleting attachment at index:", index);

        setFormState((prevState) => {
            const updatedAttachments = [...prevState.Attachement];
            updatedAttachments.splice(index, 1); // Remove the attachment at the specified index

            return {
                ...prevState,
                Attachement: updatedAttachments, // Update the state with the new attachments array
            };
        });
    };


    const handleChange = async (event: any) => {
        console.log("FileUpload----------------");
        const fileInput = event.target;

        if (fileInput.files && fileInput.files.length > 0) {
            const files = fileInput.files;
            const newAttachments: IAttachmentExampleState[] = [...formState.Attachement];

            let filesProcessed = 0;

            const processFile = (file: File, fileContent: ArrayBuffer) => {
                newAttachments.push({
                    ID: "",
                    file: file,
                    fileName: file.name,
                    fileContent: fileContent,
                    serverRelativeUrl: "",
                });
                filesProcessed++;

                if (filesProcessed === files.length) {
                    // Update the state after all files are processed
                    setFormState((prevState: any) => ({
                        ...prevState,
                        Attachement: newAttachments,
                    }));
                    console.log("Updated Attachments:", newAttachments);
                }
            };

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileReader = new FileReader();
                fileReader.onload = (event: any) => {
                    const fileContent = event.target.result;
                    console.log("fileContent:", fileContent);
                    processFile(file, fileContent);
                };
                fileReader.readAsArrayBuffer(file);
            }
        } else {
            console.warn("No files selected.");
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
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="VRR ID"
                                            value={formState.VRRID}
                                            disabled={true}

                                            mandatory={false}
                                            onChange={(value: any) =>
                                                setFormState((prevState) => ({ ...prevState, VRRID: value }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="ms-Grid-row">
                                          <div className="ms-Grid-col ms-lg6">
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
                                    <div className="ms-Grid-col ms-lg4" style={{ marginTop: "2rem" }}>
                                        <AttachmentButton
                                            label="Attach Documents"
                                            onChange={(event: any) => handleChange(event)}
                                            iconName="CloudUpload"
                                            iconNameHover="CloudUpload"
                                            AttachState={(newAttachments: Item[]) => {
                                                // Directly update state here
                                                setFormState((prevState: any) => ({
                                                    ...prevState,
                                                    Attachement: [...prevState.Attachement, ...newAttachments],
                                                }));
                                            }}
                                            mandatory={true}
                                            error={false}
                                        />


                                    </div>
                                    <div className="ms-Grid-col ms-lg6" style={{ marginTop: "2rem" }}>
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
                                                                    onClick={() => handleDelete(index)} // Call the delete function
                                                                />
                                                            </span>
                                                        </Label>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                                <div className="ms-Grid-row" style={{ marginTop: "3%" }}>
                                    <div className="ms-Grid-col ms-lg2">
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
