import * as React from "react";
import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { HRMSAlertOptions, ListNames, RecuritmentHRMsg } from "../../utilities/Config";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import AssignRecuritmentHR, { HeaderValue } from "../../components/AssignRecuritmentHR";
import { Button } from "primereact/button";

const AssignInterviewPanel = (props: any) => {
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


    const columnConfig = [
        {
            field: 'Checkbox',
            header: "",
            sortable: false,

        },
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
            field: '',
            header: 'Action',
            sortable: true,
            body: (rowData: any) => {
                return <span>
                    <Button
                        // onClick={() => handleRedirectView(rowData, tab)}
                        className="table_btn"
                        icon="pi pi-eye"
                        style={{
                            width: "30px",
                            marginRight: "7px",
                            padding: "3px",
                        }}
                    />
                </span>
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
        let Conditions = "";
        filterConditions.push({
            FilterKey: "ID",
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
export default AssignInterviewPanel;