import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
    ActionStatus,
    GridStatusBackgroundcolor,
    ProfileStatus,
    RoleID,
    TabName,
} from "../../utilities/Config";
import CommentsPopup from "../../components/CommentsPopup";
import { Button } from "primereact/button";
import BreadcrumbsComponent, { TabNameData } from "../../components/CustomBreadcrumps";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import ViewCandidateDetails from "./ViewCandidateDetails";

export type BreadcrumbTabData = {
    tab: string,
    TabName: string,
    ButtonAction: string,
    CurrectTab: string;
    currectAction: string,
}
const ReviewCandidateList = (props: any) => {

    const [CandidateData, setCandidateData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    // const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
    // const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [ReviewProfile, setReviewProfile] = React.useState<boolean>(false);
    const [CommentsPopups, setCommentsPopup] = React.useState<boolean>(false);
    const [CandidateID, setCandidateID] = React.useState<number>(0);
    const [activeTab, setactiveTab] = React.useState<string>("tab1");
    const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
    const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
    const [BreadcrumbTab, setBreadcrumbTab] = React.useState<BreadcrumbTabData>({
        tab: "",
        TabName: "",
        ButtonAction: "",
        CurrectTab: "",
        currectAction: "",
    })
    // const [alertProps, setalertProps] = React.useState<alertPropsData>({
    //     Message: "",
    //     Type: "",
    //     ButtonAction: null,
    //     visible: false,
    // });

    const columnConfig = (tab: string, ButtonAction: string, TabNamed: string) => [
        {
            field: "Candidate ID",
            header: "Candidate ID",
            sortable: true,
        },
        {
            field: "Position Title",
            header: "Position Title",
            sortable: true,
        },
        {
            field: "Job Grade",
            header: "Job Grade",
            sortable: true,
        },

        {
            field: "Status",
            header: "Status",
            fieldName: "Status",
            sortable: false,
            body: (rowData: any) => {
                return (
                    <span
                        style={{
                            backgroundColor:
                                rowData?.Status?.includes("Pending") === true // "Pending"
                                    ? GridStatusBackgroundcolor.Pending
                                    : rowData?.Status?.includes("Completed") === true
                                        ? GridStatusBackgroundcolor.CompletedOrApproved
                                        : rowData?.Status?.includes("Rejected") === true
                                            ? GridStatusBackgroundcolor.Rejected
                                            : rowData?.Status?.includes("Reverted") === true
                                                ? GridStatusBackgroundcolor.Reverted
                                                : rowData?.Status?.includes("Resubmitted") === true
                                                    ? GridStatusBackgroundcolor.ReSubmitted
                                                    : rowData?.Status?.includes("Draft") === true
                                                        ? GridStatusBackgroundcolor.Draft
                                                        : "",
                            borderRadius: "5px",
                        }}
                    >
                        {rowData.Status}
                    </span>
                );
            },
        },
        {
            field: "",
            header: "Action",
            sortable: false,
            body: (rowData: any) => {
                function handleRedirectView(
                    rowData: any,
                    tab: string,
                    TabNamed: string,
                    ButtonAction: string
                ): void {
                    setReviewProfile(true);
                    setCandidateID(rowData.ID);
                    let Breadcrumbs: BreadcrumbTabData = {
                        tab: tab,
                        TabName: TabNamed,
                        ButtonAction: ButtonAction,
                        CurrectTab: TabName.ViewCandidateDetails,
                        currectAction: "Edit"
                    }
                    setBreadcrumbTab(Breadcrumbs)
                }

                return (
                    <div>
                        <span>

                            <Button
                                onClick={() => handleRedirectView(rowData, tab, TabNamed, ButtonAction)}
                                className="table_btn"
                                // icon="pi pi-eye"
                                style={{
                                    width: "30px",
                                    marginRight: "7px",
                                    padding: "3px",
                                }}
                            >
                                <img
                                    src={require("../../assets/edit_icon.png")}
                                    alt="Stamp Icon"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </Button>
                        </span>
                    </div>
                );
            },
        },
    ];

    // function OpenCommentsPopup(): void {
    //     setCommentsPopup(true);
    // }

    const fetchCandidateData = async (RecruitmentDetails: any) => {
        setIsLoading(true);
        try {

            const filterConditions = [];
            let Conditions = "";

            if (props.CurrentRoleID === RoleID.LineManager) {
                filterConditions.push({
                    FilterKey: "JobCodeId",
                    Operator: "eq",
                    FilterValue: RecruitmentDetails[0]?.JobCodeId,
                });
                filterConditions.push({
                    FilterKey: "RecruitmentID",
                    Operator: "eq",
                    FilterValue: RecruitmentDetails[0]?.ID,
                });
                Conditions = "and";
                const data = await getVRRDetails.GetInterviewPanelCandidateDetails(
                    filterConditions,
                    Conditions
                );
                if (data.status === 200 && data.data !== null) {
                    setCandidateData(data.data);
                }
            } else {
                filterConditions.push({
                    FilterKey: "JobCodeId",
                    Operator: "eq",
                    FilterValue: RecruitmentDetails[0]?.JobCodeId,
                });
                const data = await getVRRDetails.GetCandidateDetails(
                    filterConditions,
                    Conditions
                );
                if (data.status === 200 && data.data !== null) {
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
            FilterValue: props.stateValue.ID,
        });
        const RecruitmentDetails = await getVRRDetails.GetRecruitmentDetails(
            filterConditions,
            Conditions
        );
        if (RecruitmentDetails.status === 200 && RecruitmentDetails.data !== null) {
            setRecruitmentDetails(RecruitmentDetails.data);
            await fetchCandidateData(RecruitmentDetails.data);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchRecuritmentData();
        };

        void fetchData();
    }, []);

    const onPageChange = (event: any) => {
        // setFirst(event.first);
        setRows(event.rows);
    };


    const tabs = [
        {
            label: TabName.ViewCandidateDetails,
            value: "tab1",
            content: (
                <Card
                    variant="outlined"
                    sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                >
                    <CardContent>
                        <ReviewProfileDatatable
                            data={CandidateData}
                            columns={columnConfig(
                                "tab1",
                                "view",
                                TabName.ReviewProfile
                            )}
                            rows={rows}
                            onPageChange={onPageChange}
                        />
                    </CardContent>
                </Card>
            ),
        },
    ];

    // const handleCancel = () => {
    //     setIsLoading(true);
    //     const CancelAlert = {
    //         Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
    //         Type: HRMSAlertOptions.Confirmation,
    //         visible: true,
    //         ButtonAction: async (userClickedOK: boolean) => {
    //             if (userClickedOK) {
    //                 props.navigation("/RecurimentProcess");
    //                 setAlertPopupOpen(false);
    //             } else {
    //                 setAlertPopupOpen(false);
    //             }
    //         },
    //     };

    //     setAlertPopupOpen(true);
    //     setalertProps(CancelAlert);
    //     setIsLoading(false);
    // };

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

    console.log(RecruitmentDetails, "RecruitmentDetails");

    const handleBreadcrumbChange = (newItem: string) => {
        setactiveTab(newItem)
    };

    React.useEffect(() => {
        const activeTabObj = tabs.find((item) => item.value === activeTab);
        const prevTabObj = tabs.find((item) => item.value === prevActiveTab);
        if (activeTab === "tab1") {
            setTabNameData(() => {
                const newTabNames = [
                    { tabName: props.stateValue?.TabName },
                    { tabName: props.stateValue?.ButtonAction },
                    { tabName: activeTabObj?.label },
                ];
                return newTabNames;
            });
        } else {
            setTabNameData(() => {
                const newTabNames = [
                    { tabName: props.stateValue?.TabName },
                    { tabName: props.stateValue?.ButtonAction },
                    { tabName: prevTabObj?.label },
                    { tabName: activeTabObj?.label },
                ];

                const uniqueTabNames = newTabNames.filter(
                    (item, index, self) =>
                        item.tabName &&
                        self.findIndex(t => t.tabName === item.tabName) === index
                );

                return uniqueTabNames;
            });
        }


        if (activeTab !== prevActiveTab) {
            setPrevActiveTab(activeTab);
        }
    }, [activeTab]);
    return (
        <>
            {ReviewProfile ? (
                <>
                    <ViewCandidateDetails
                        ID={CandidateID}
                        Submit_fn={Shortlists_fn}
                        back_fn={() => setReviewProfile(false)}
                        Status={props.CurrentRoleID === RoleID.LineManager ? ProfileStatus.LM : ProfileStatus.HR}
                        RecuritmentID={RecruitmentDetails[0].ID}
                        MasterData={props}
                        TabNames={BreadcrumbTab}
                    />
                </>
            ) : (
                <>
                    <CustomLoader isLoading={isLoading}>
                        <div className="menu-card">
                            <React.Fragment>
                                <BreadcrumbsComponent
                                    items={tabs}
                                    initialItem={activeTab}
                                    TabName={TabNameData}
                                    onBreadcrumbChange={handleBreadcrumbChange}
                                />
                            </React.Fragment>
                        </div>
                    </CustomLoader>
                </>
            )}

            {/* {AlertPopupOpen ? (
                <>
                    <CustomAlert
                        {...alertProps}
                        onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
                    />
                </>
            ) : (
                <></>
            )} */}

            {CommentsPopups ? (
                <>
                    <CommentsPopup
                        onClose={() => setCommentsPopup(false)}
                        visible={CommentsPopups}
                    />
                </>
            ) : (
                <></>
            )}
        </>
    );
};
export default ReviewCandidateList;
