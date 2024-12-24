import * as React from "react";
import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData, AutoCompleteItem, Item } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { HRMSAlertOptions, ListNames, RecuritmentHRMsg } from "../../utilities/Config";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import AssignRecuritmentHR, { HeaderValue } from "../../components/AssignRecuritmentHR";
import AttachmentButton from "../../components/AttachmentButton";
import { Icon, Label } from "office-ui-fabric-react";

const InterviewPanelEdit = (props: any) => {
    console.log(props, "ReviewProfile");

    const [CandidateData, setCandidateData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [checkedValue, setCheckedValue] = React.useState<any[]>([]);
    const [AssignPopup, setAssignPopup] = React.useState<boolean>(false);
    const [AssignBtnValidation, setAssignBtnValidation] = React.useState<boolean>(false);
    const [HeaderValueData, setHeaderValueData] = React.useState<HeaderValue | null>(null);
    const [selectAll, setSelectAll] = React.useState<boolean>(false);
    const [AssignRecuritmentHRValue, setAssignRecuritmentHRValue] = React.useState<AutoCompleteItem | null>(null);
    const [alertProps, setalertProps] = React.useState<alertPropsData>({
        Message: "",
        Type: "",
        ButtonAction: null,
        visible: false,
    });

    const HRFileHandle = (serverUrl: string, fileName: string) => {
        console.log(serverUrl, "ServerUrl");
        try {
            if (serverUrl) {

                if (
                    fileName
                        .split(".")[fileName.split(".").length - 1]
                        .toLocaleLowerCase() == "pdf"
                ) {
                    window.open(serverUrl);
                } else {
                    window.open(serverUrl + "?web=1");
                }
            }
        } catch (error) {
            console.error("Error setting up SharePoint:", error);
        }
    };

    const handleAttachmentState = (newAttachments: Item[], rowData: any) => {
        const updatedRowAttachment = CandidateData.map((item: any) => {
            if (item.ID === rowData.ID) {
                if (item.Checked === true) {
                    return item;
                }
                return {
                    ...item,
                    ScoreCardAttch: [...(item.ScoreCardAttch || []), ...newAttachments],
                };
            }
            return item;
        });
        setCandidateData(updatedRowAttachment);
    };

    const handleDelete = (index: number, rowData: any) => {
        console.log("Deleting attachment at index:", index);
        const updatedCandidateData = CandidateData.map((item: any) => {
            if (item.ID === rowData.ID) {
                const updatedAttachments = item.ScoreCardAttch.filter((_: any, i: number) => i !== index);
                return {
                    ...item,
                    ScoreCardAttch: updatedAttachments,
                };
            }
            return item;
        });

        setCandidateData(updatedCandidateData);
    };


    const columnConfig = [

        {
            field: 'JobCode',
            header: 'JobCode',
            sortable: true
        },
        {
            field: 'PassportID',
            header: 'PassportID',
            sortable: true
        },
        {
            field: 'FristName',
            header: 'FristName',
            sortable: true,
            body: (rowData: any) => {
                return <span>{rowData.FristName ?? "" + " " + rowData.MiddleName ?? "" + " " + rowData.LastName ?? ""}</span>
            }
        },
        {
            field: "",
            header: "CV",
            sortable: false,
            body: (rowData: any) => {
                if (rowData?.CandidateCVDoc?.[0] && rowData?.CandidateCVDoc?.[0]?.name) {
                    return (
                        <div>
                            <Link
                                onClick={() =>
                                    HRFileHandle(
                                        rowData?.CandidateCVDoc[0]?.content || "",
                                        rowData?.CandidateCVDoc[0]?.name || ""
                                    )
                                }
                            >
                                {rowData?.CandidateCVDoc?.[0]?.name}
                            </Link>
                        </div>
                    );
                } else {
                    return <span>No CV available</span>;
                }
            },
        },
        {
            field: 'Interviewed',
            header: "Interviewed",
            sortable: false,

        },
        {
            field: '',
            header: 'Action',
            sortable: true,
            body: (rowData: any) => {


                return (
                    <span>
                        <AttachmentButton
                            label="Attach"
                            iconName="CloudUpload"
                            iconNameHover="CloudUpload"
                            AttachState={(newAttachments) => handleAttachmentState(newAttachments, rowData)}
                            mandatory={true}
                            error={false}
                        />

                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                                {rowData?.ScoreCardAttch?.map((file: any, index: number) => {
                                    const fileName = file?.fileName || file?.name;
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
                                                            onClick={() => handleDelete(index, rowData)}
                                                        />
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </span>
                );

            }
        },
    ];

    const fetchCandidateData = async (RecruitmentDetails: any) => {
        setIsLoading(true);
        try {
            console.log(RecruitmentDetails, "RecruitmentDetails");

            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "JobCodeId",
                Operator: "eq",
                FilterValue: RecruitmentDetails[0]?.JobCodeId
            });
            const data = await getVRRDetails.GetInterviewPanelCandidateDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                console.log(data.data, "GetVacancyDetails");
                setCandidateData(data.data);

            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);

    };

    const fetchRecuritmentData = async () => {
        let filterConditions = [];
        let Conditions = "and";
        filterConditions.push({
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: props.stateValue.ID
        });

        const RecruitmentDetails = await getVRRDetails.GetRecruitmentDetails(filterConditions, Conditions);
        console.log("RecruitmentDetails", RecruitmentDetails);
        if (RecruitmentDetails.status === 200 && RecruitmentDetails.data !== null) {
            console.log(RecruitmentDetails, "GetVacancyDetails");
            setRecruitmentDetails(RecruitmentDetails.data);
            await fetchCandidateData(RecruitmentDetails.data);
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchRecuritmentData();
            const HeaderValue = {
                JobCode: "POS001",
                JobTitle: "Position English",
                Headcount: "01"
            }
            setHeaderValueData(HeaderValue)
        };

        void fetchData();
    }, []);


    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const Submit_fn = async () => {
        const allAssignByPresent = CandidateData.every((item) => item.AssignBy);
        console.log(allAssignByPresent, "allShortlistValuePresent");
        if (allAssignByPresent) {
            for (const Candidate of CandidateData) {
                if (Candidate?.AssignBy) {
                    const obj = {
                        ID: Candidate.ID,
                        AssignById: Candidate?.AssignBy
                    };
                    console.log(obj, "obj");

                    try {
                        const data = await getVRRDetails.AssignCandidateRecuritmentHR(obj.ID, obj, ListNames.HRMSRecruitmentCandidateDetails);
                        if (data.status === 200 && data.data !== null) {
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
                        }
                    } catch (error) {
                        console.log("GetVacancyDetails doesn't fetch the data", error);
                    }


                }
            }
        } else {
            let CancelAlert = {
                Message: RecuritmentHRMsg.ValidationErrorMsg,
                Type: HRMSAlertOptions.Warning,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                        setAlertPopupOpen(false);
                    }
                }
            }

            setAlertPopupOpen(true);
            setalertProps(CancelAlert);
            setIsLoading(false);
        }

    }

    const handleCheckbox = (value: boolean, rowData: any) => {
        const updatedRowData = CandidateData.map((item: any) => {
            if (item.ID === rowData.ID) {
                if (item.Checked === true && value === true) {
                    return item;
                }

                return {
                    ...item,
                    Checked: value,
                    Assigned: value,
                };
            }
            return item;
        });
        let CheckedValue = updatedRowData.filter((item) => item.Checked === true)
        const updatedCheckedValues = CheckedValue
            ? [...checkedValue, CheckedValue]
            : []

        setCheckedValue(updatedCheckedValues)
        setCandidateData(updatedRowData);
    };

    function handleAssignBtn() {
        let CheckedDataValue = CandidateData.some((item) => item.Checked)
        if (CheckedDataValue) {
            setAssignPopup(!AssignPopup)
            setAssignBtnValidation(AssignBtnValidation)
        } else {
            setAssignBtnValidation(!AssignBtnValidation)
        }
    }

    const onSelectAllChange = (value: boolean) => {
        const updatedRowData: any[] = CandidateData.map((item: any) => {
            return {
                ...item,
                Checked: value,
                AssignBy: value ? AssignRecuritmentHRValue?.key : null,
            };
        });

        setCandidateData(updatedRowData);
        setSelectAll(value);
    };


    const assignbtnfn = async () => {
        setIsLoading(true);
        const updatedRowData = await Promise.all(CandidateData.map(async (item: any) => {
            if (item.Assigned === true) {
                return {
                    ...item,
                    AssignBy: AssignRecuritmentHRValue?.key,
                };
            }
            return item;
        }));

        setCandidateData(updatedRowData);
        setAssignPopup(false);

        setIsLoading(false);
    };

    const tabs = [
        {
            label: "Assign Interview Panel",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <CheckboxDataTable
                        data={CandidateData}
                        columns={columnConfig}
                        rows={rows}
                        onPageChange={onPageChange}
                        handleAssignBtn={handleAssignBtn}
                        AssignBtnValidation={AssignBtnValidation}
                        handleCheckbox={handleCheckbox}
                        selectAll={selectAll}
                        onSelectAllChange={onSelectAllChange} />
                </div>

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
                    props.navigation("/InterviewPanelList");
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

    const handleAutoComplete = async (
        item: AutoCompleteItem
    ) => {
        if (item) {
            setAssignRecuritmentHRValue(item);
        }
    };

    console.log(RecruitmentDetails, "RecruitmentDetails");
    return (
        <>
            <CustomLoader isLoading={isLoading}>
                <div className="menu-card">
                    <React.Fragment>
                        <TabsComponent
                            tabs={tabs}
                            initialTab="tab1"
                            tabClassName={"Tab"}
                            handleCancel={handleCancel}
                            additionalButtons={[
                                {
                                    label: "Submit",
                                    onClick: async () => {
                                        await Submit_fn();
                                    }
                                },
                            ]}
                        />
                        {console.log(props.masterData, "masterDataDetails")}
                        {console.log(first, "first")}
                    </React.Fragment>
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

            {AssignPopup ? (
                <>
                    <AssignRecuritmentHR
                        handleAutoComplete={handleAutoComplete}
                        AssignRecuritmentHRValue={AssignRecuritmentHRValue}
                        onClose={handleAssignBtn}
                        HeaderValueData={HeaderValueData}
                        assignbtnfn={assignbtnfn}
                        visible={AssignPopup}
                    />
                </>
            ) : (
                <></>
            )}



        </>


    )
}
export default InterviewPanelEdit;