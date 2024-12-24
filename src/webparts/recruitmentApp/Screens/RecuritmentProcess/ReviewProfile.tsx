import * as React from "react";
import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { ActionStatus, HRMSAlertOptions, ListNames, RecuritmentHRMsg, RoleID } from "../../utilities/Config";
import { Button } from "primereact/button";
import ReiewProfilePopup from "../../components/ReiewProfilePopup";
import ReuseButton from "../../components/ReuseButton";
import SPServices from "../../Services/SPService/SPServices";
// import CheckIcon from '../../assets/CheckIcon.svg';
// import RejectedIcon from '../../assets/RejectedIcon.svg';




const ReviewProfile = (props: any) => {
    console.log(props, "ReviewProfile");

    const [CandidateData, setCandidateData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [ReviewProfile, setReviewProfile] = React.useState<boolean>(false);
    const [CandidateID, setCandidateID] = React.useState<number>(0);
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
                        .toLocaleLowerCase() === "pdf"
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
            field: 'Nationality',
            header: 'Nationality',
            sortable: true
        },
        {
            field: 'PassportID',
            header: 'PassportID',
            sortable: true
        },
        {
            field: 'FullName',
            header: 'Name',
            sortable: true,
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
            header: 'Shortlist/Rejected',
            sortable: true,
            body: (rowData: any) => {
                return (
                    <span style={{ display: "flex", justifyContent: "center" }}>
                        {rowData.ProfileStatus === ActionStatus.Shortlists ? (
                            <ReuseButton
                                label="Shortlisted"
                                // onClick={() => ActionBtnFn(rowData, ActionStatus.Shortlists)}
                                backgroundColor="rgb(205, 45, 45)"
                                Style={{ color: "white" }}
                                width="80%"

                            />
                        ) : rowData.ProfileStatus === ActionStatus.Rejected ? (

                            <ReuseButton
                                label="Rejected"
                                // onClick={() => ActionBtnFn(rowData, ActionStatus.Rejected)}
                                backgroundColor="rgb(205, 45, 45)"
                                Style={{ color: "white" }}
                                width="80%"
                            />
                        ) : (
                            <></>
                        )}

                    </span>
                );
            }
        },
        {
            field: '',
            header: "Action",
            sortable: false,
            body: (rowData: any) => {
                function handleRedirectView(rowData: any): void {
                    console.log(rowData)
                    setReviewProfile(true)
                    setCandidateID(rowData.ID)
                }

                return (
                    <div>
                        <Button
                            onClick={() => handleRedirectView(rowData)}
                            className="table_btn"
                            icon="pi pi-eye"
                            style={{
                                width: "30px",
                                marginRight: "7px",
                                padding: "3px",
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    const fetchCandidateData = async (RecruitmentDetails: any) => {
        setIsLoading(true);
        try {
            console.log(RecruitmentDetails, "RecruitmentDetails");

            const filterConditions = [];
            let Conditions = "";

            if (props.CurrentRoleID === RoleID.LineManager) {
                filterConditions.push({
                    FilterKey: "JobCodeId",
                    Operator: "eq",
                    FilterValue: RecruitmentDetails[0]?.JobCodeId
                });
                filterConditions.push({
                    FilterKey: "RecruitmentID",
                    Operator: "eq",
                    FilterValue: RecruitmentDetails[0]?.ID,
                });
                Conditions = "and"
                const data = await getVRRDetails.GetInterviewPanelCandidateDetails(filterConditions, Conditions);
                if (data.status === 200 && data.data !== null) {
                    console.log(data.data, "GetVacancyDetails");
                    setCandidateData(data.data);

                }

            } else {
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
            }

        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);

    };

    const fetchRecuritmentData = async () => {
        const filterConditions = [];
        const Conditions = "";
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


    const Submit_fn = async () => {
        const allShortlistValuePresent = CandidateData.every((item) => item.ProfileStatus);
        console.log(allShortlistValuePresent, "allShortlistValuePresent");
        if (allShortlistValuePresent) {
            for (const Candidate of CandidateData) {
                if (props.CurrentRoleID === RoleID.LineManager) {
                    const obj = {
                        RecruitmentIDId: RecruitmentDetails[0]?.ID,
                        LineManagerAction: Candidate?.ProfileStatus
                    }
                    const response = await SPServices.SPUpdateItem({
                        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
                        RequestJSON: obj,
                        ID: Candidate?.ID,
                    }).then(async (res: any) => {
                        console.log(response);
                        const CancelAlert = {
                            Message: RecuritmentHRMsg.RecuritmentSubmitMsg,
                            Type: HRMSAlertOptions.Success,
                            visible: true,
                            ButtonAction: async (userClickedOK: boolean) => {
                                if (userClickedOK) {
                                    props.navigation("/RecurimentProcess");
                                    setAlertPopupOpen(false);
                                }
                            }
                        };
                        setAlertPopupOpen(true);
                        setalertProps(CancelAlert);
                    })
                        .catch(error => {
                            console.error("Error inserting data into RecruitmentCandidateDetails:", error);
                            setIsLoading(false);

                        });
                    console.log(response);
                } else {
                    if (Candidate?.ProfileStatus === ActionStatus.Shortlists) {
                        const obj = {

                            JobCodeId: RecruitmentDetails[0]?.JobCodeId,
                            PassportID: Candidate?.PassportID,
                            FristName: Candidate?.FristName,
                            MiddleName: Candidate?.MiddleName,
                            LastName: Candidate?.LastName,
                            // FullName: Candidate?.FullName,
                            ResidentialAddress: Candidate?.ResidentialAddress,
                            DOB: Candidate?.DOB,
                            ContactNumber: Candidate?.ContactNumber,
                            Email: Candidate?.Email,
                            Nationality: Candidate?.Nationality,
                            Gender: Candidate?.Gender,
                            TotalYearOfExperiance: Candidate?.TotalYearOfExperiance,
                            Skills: Candidate?.Skills,
                            LanguageKnown: Candidate?.LanguageKnown,
                            ReleventExperience: Candidate?.ReleventExperience,
                            Qualification: Candidate?.Qualification,
                            RecuritmentHR: Candidate?.ProfileStatus,
                            LineManagerAction: ""
                        };
                        console.log(obj, "obj");
                        try {
                            setIsLoading(true);
                            const response = await getVRRDetails.InsertRecruitmentCandidateDetails(obj).then(response => {
                                console.log(response);
                                const CancelAlert = {
                                    Message: RecuritmentHRMsg.RecuritmentSubmitMsg,
                                    Type: HRMSAlertOptions.Success,
                                    visible: true,
                                    ButtonAction: async (userClickedOK: boolean) => {
                                        if (userClickedOK) {
                                            props.navigation("/RecurimentProcess");
                                            setAlertPopupOpen(false);
                                        }
                                    }
                                };
                                setAlertPopupOpen(true);
                                setalertProps(CancelAlert);
                            })
                                .catch(error => {
                                    console.error("Error inserting data into RecruitmentCandidateDetails:", error);
                                    setIsLoading(false);

                                });
                            console.log(response);

                        } catch (error) {
                            console.error("Error inserting data into RecruitmentCandidateDetails:", error);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            }
        } else {
            const CancelAlert = {
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
                    />
                </div>

            ),
        },
    ];

    const handleCancel = () => {
        setIsLoading(true);
        const CancelAlert = {
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

    function Shortlists_fn() {
        const updatedRowData = CandidateData.map((item: any) => {
            if (item.ID === CandidateID) {

                return {
                    ...item,
                    ProfileStatus: ActionStatus.Shortlists,
                };
            }
            return item;
        });
        setCandidateData(updatedRowData);
        setReviewProfile(false);

    }

    function Rejected_fn() {
        const updatedRowData = CandidateData.map((item: any) => {
            if (item.ID === CandidateID) {

                return {
                    ...item,
                    ProfileStatus: ActionStatus.Rejected,
                };
            }
            return item;
        });
        setCandidateData(updatedRowData);
        setReviewProfile(false);

    }

    console.log(RecruitmentDetails, "RecruitmentDetails");
    return (
        <>
            {ReviewProfile ? (
                <>
                    <ReiewProfilePopup
                        ID={CandidateID}
                        Shortlists_fn={Shortlists_fn}
                        Rejected_fn={Rejected_fn}
                        back_fn={() => setReviewProfile(false)}
                    />
                </>
            ) : (
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
                </>
            )}


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