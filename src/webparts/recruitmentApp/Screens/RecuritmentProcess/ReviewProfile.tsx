import * as React from "react";
import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { ActionStatus, HRMSAlertOptions, RecuritmentHRMsg } from "../../utilities/Config";




const ReviewProfile = (props: any) => {
    console.log(props, "ReviewProfile");

    const [CandidateData, setCandidateData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
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
            field: 'Shrotlistbtn',
            header: "Action",
            sortable: false,
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
            const data = await getVRRDetails.GetCandidateDetails(filterConditions, Conditions);
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
        };

        void fetchData();
    }, []);


    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const ActionStatusBtnFn = (rowData: any, ActionStatus: string) => {
        const updatedRowData = CandidateData.map((item: any) => {
            if (item.ID === rowData.ID) {

                return {
                    ...item,
                    ShortlistValue: ActionStatus,
                };
            }
            return item;
        });
        setCandidateData(updatedRowData);
    }

    const Submit_fn = async () => {
        const allShortlistValuePresent = CandidateData.every((item) => item.ShortlistValue);
        console.log(allShortlistValuePresent, "allShortlistValuePresent");
        if (allShortlistValuePresent) {
            for (const Candidate of CandidateData) {
                if (Candidate?.ShortlistValue === ActionStatus.Shortlists) {
                    const obj = {
                        BusinessUnitCodeId: RecruitmentDetails[0]?.BusinessUnitCodeId,
                        DepartmentId: RecruitmentDetails[0]?.DepartmentId,
                        SubDepartmentId: RecruitmentDetails[0]?.SubDepartmentId,
                        SectionId: RecruitmentDetails[0]?.SectionId,
                        DepartmentCodeId: RecruitmentDetails[0]?.DepartmentCodeId,
                        EmploymentCategory: RecruitmentDetails[0]?.EmploymentCategory,
                        TypeOfContract: RecruitmentDetails[0]?.TypeOfContract,
                        Nationality: RecruitmentDetails[0]?.Nationality,
                        // DateRequried: RecruitmentDetails[0]?.DateRequried,
                        EnterNumberOfMonths: RecruitmentDetails[0]?.EnterNumberOfMonths,
                        AreaofWork: RecruitmentDetails[0]?.AreaofWork,
                        // JobCodeId: RecruitmentDetails[0].JobCodeId,

                        // ID: RecruitmentDetails[0]?.ID,
                        // JobCode: Candidate?.JobCode,
                        PassportNumber: Candidate?.PassportID,
                        FirstName: Candidate?.FristName,
                        MiddleName: Candidate?.MiddleName,
                        LastName: Candidate?.LastName,
                        RecuritmentHR: Candidate?.ShortlistValue,
                        // LineManagerAction: Candidate?.ShortlistValue,
                    };
                    console.log(obj, "obj");

                    const response = await getVRRDetails.InsertRecruitmentCandidateDetails(obj);
                    console.log(response);
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

    const tabs = [
        {
            label: "Review Profile",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <ReviewProfileDatatable
                        data={CandidateData}
                        columns={columnConfig}
                        rows={rows}
                        onPageChange={onPageChange}
                        ActionBtnFn={ActionStatusBtnFn}
                    />
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
                    props.navigation("/CommanFieldTemplate");
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


        </>


    )
}
export default ReviewProfile;