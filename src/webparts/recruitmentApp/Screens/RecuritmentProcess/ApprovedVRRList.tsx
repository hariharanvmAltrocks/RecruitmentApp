import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { GridStatusBackgroundcolor, RoleID, StatusId, tabType } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
import { Card, CardContent } from "@mui/material";
// interface ColumnConfig {
//     field: string;
//     header: string;
//     sortable: boolean;
//     body?: (item?: {}) => {};
// }


const RecruitmentProcess = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
    const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<string>("tab1");


    const columnConfig = (tab: string) => [
        {
            field: 'BusinessUnitCode',
            header: 'BusinessUnit Code',
            sortable: true
        },
        {
            field: 'Department',
            header: 'Department',
            sortable: true
        },
        {
            field: 'JobCode',
            header: 'Job Code',
            sortable: true
        },
        // {
        //     field: 'JobTitleInEnglish',
        //     header: 'Job Title',
        //     sortable: true
        // },       
        // {
        //     field: 'ReasonForVacancy',
        //     header: 'ReasonForVacancy',
        //     sortable: true
        // },
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
                                rowData.Status.includes("Pending") === true // "Pending"
                                    ? GridStatusBackgroundcolor.Pending
                                    : rowData.Status.includes("Completed") ===
                                        true
                                        ? GridStatusBackgroundcolor
                                            .CompletedOrApproved
                                        : rowData.Status.includes("Rejected") === true
                                            ? GridStatusBackgroundcolor.Rejected
                                            : rowData.Status.includes("Reverted") === true
                                                ? GridStatusBackgroundcolor.Reverted
                                                : rowData.Status.includes("Resubmitted") === true
                                                    ? GridStatusBackgroundcolor.ReSubmitted
                                                    : rowData.Status.includes("Draft") === true
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
            field: "Action",
            header: "Action",
            sortable: false,
            body: (rowData: any) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                        }}
                    >
                        <Button
                            onClick={() => handleRedirectView(rowData, tab)}
                            className="table_btn"
                            icon="pi pi-eye"
                            style={{
                                width: "30px",
                                marginRight: "7px",
                                padding: "3px",
                            }}
                        />
                        {/* <Button
                            onClick={() => handleDeletedView(rowData, tab)}
                            className="table_btn"
                            icon="pi pi-eye"
                            style={{
                                width: "30px",
                                marginRight: "7px",
                                padding: "3px",
                            }}
                        /> */}

                    </div>
                );
            },
        },
    ];


    function handleRedirectView(rowData: any, tab: string) {
        console.log(rowData, "rowData");
        switch (props.CurrentRoleID) {
            case RoleID.RecruitmentHRLead: {
                if (tab === 'tab1') {
                    props.navigation("/RecurimentProcess/ApprovedVRREdit", { state: { type: "VRR", ID: rowData?.VRRID, tab, StatusId: rowData?.StatusId } });
                } else if (tab === 'tab2') {
                    props.navigation("/RecurimentProcess/ApprovedVRREdit", { state: { ID: rowData?.ID, AssignedHRId: rowData?.AssignedHRId, tab, StatusId: rowData?.StatusId } });
                } else {
                    props.navigation("/RecurimentProcess/ApprovedVRRView", { state: { ID: rowData?.ID, AssignedHR: rowData?.AssignedHR, tab, StatusId: rowData?.StatusId } });
                }
            }
                break;

            case RoleID.RecruitmentHR: {
                if (tab === 'tab1' || tab === 'tab2') {
                    props.navigation("/RecurimentProcess/ApprovedVRREdit", { state: { ID: rowData?.ID, tab, StatusId: rowData?.StatusId } });
                } else if (tab === 'tab4') {
                    props.navigation("/RecurimentProcess/ApprovedVRRView", { state: { ID: rowData?.ID, tab, StatusId: rowData?.StatusId } });
                } else if (tab === 'tab3') {
                    props.navigation("/RecurimentProcess/ReviewProfile", { state: { ID: rowData?.ID, tab, StatusId: rowData?.StatusId } });
                }
            }
                break;

            case RoleID.HOD: {
                if (tab === 'tab1') {
                    props.navigation("/RecurimentProcess/ApprovedVRREdit", { state: { ID: rowData?.ID, tab, StatusId: rowData?.StatusId } });
                }
            }
                break;
            case RoleID.LineManager: {
                if (tab === 'tab1') {
                    props.navigation("/RecurimentProcess/ReviewProfile", { state: { ID: rowData?.ID, tab, StatusId: rowData?.StatusId } });
                }
            }
                break;

        }
    }
    // async function handleDeletedView(rowData: any, tab: string) {
    //     const ID = rowData?.ID
    //     const deleteResult = await SPServices.SPDeleteItem({
    //         Listname: ListNames.HRMSRecruitmentDptDetails,
    //         ID: ID
    //     });
    //     console.log(deleteResult, "deleteResult");

    // }





    const fetchData = async () => {
        setIsLoading(true);
        try {
            console.log(activeTab, "activeTabactiveTab");

            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue: StatusId.PendingwithHRLeadtoAssignRecruitmentHR
            });

            const dataPromise = getVRRDetails.GetVacancyDetails(filterConditions, Conditions);

            let filterConditionsRecuritment = [];
            let RecuritmentConditions = "";
            if (activeTab === "tab3") {
                filterConditionsRecuritment = [];
                RecuritmentConditions = "";
            } else {
                switch (props.CurrentRoleID) {
                    case RoleID.RecruitmentHRLead: {
                        filterConditionsRecuritment.push({
                            FilterKey: "StatusId",
                            Operator: "eq",
                            FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc
                        });
                        break;
                    }
                    case RoleID.RecruitmentHR: {
                        if (activeTab === "tab1") {
                            filterConditionsRecuritment.push({
                                FilterKey: "StatusId",
                                Operator: "eq",
                                FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv
                            });
                        } else if (activeTab === "tab2") {
                            filterConditionsRecuritment.push({
                                FilterKey: "StatusId",
                                Operator: "eq",
                                FilterValue: StatusId.PendingwithRecruitmentHRtoAssignExternalAgency
                            });
                        }
                        break;
                    }
                    case RoleID.HOD: {
                        filterConditionsRecuritment.push({
                            FilterKey: "StatusId",
                            Operator: "eq",
                            FilterValue: StatusId.PendingwithHODtoreviewAdv
                        });
                        break;
                    }
                }
            }


            const recruitmentDetailsPromise = getVRRDetails.GetRecruitmentDetails(filterConditionsRecuritment, RecuritmentConditions);

            const [data, RecruitmentDetails] = await Promise.all([dataPromise, recruitmentDetailsPromise]);

            if (data.status === 200 && data.data !== null) {
                console.log(data, "GetVacancyDetails");
                setData(data.data[0]);
            }

            if (RecruitmentDetails.status === 200 && RecruitmentDetails.data !== null) {
                console.log(RecruitmentDetails, "GetVacancyDetails");
                setRecruitmentDetails(RecruitmentDetails.data);
            }

        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);
    };


    React.useEffect(() => {
        void fetchData();

    }, [activeTab]);

    const onPageChange = (event: any, Type: string) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleRefresh = (tab: string) => {
        void fetchData();
        // setActiveTab(tab);
    };

    const tabs = [
        ...(props.CurrentRoleID === RoleID.RecruitmentHRLead ? [
            {
                label: "Assign Recuritment HR",
                value: "tab1",
                content: (
                    <Card
                        variant="outlined"
                        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                    >
                        <CardContent>
                            <SearchableDataTable
                                data={data}
                                columns={columnConfig("tab1")}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "Recruitment")}
                                handleRefresh={() => handleRefresh("tab1")}
                            />
                        </CardContent>

                    </Card>

                ),
            },
            {
                label: "upload Signed Doc",
                value: "tab2",
                content: (
                    <Card
                        variant="outlined"
                        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                    >
                        <CardContent>
                            <SearchableDataTable
                                data={RecruitmentDetails}
                                columns={columnConfig("tab2")}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "VRR")}
                                handleRefresh={() => handleRefresh("tab2")}

                            />
                        </CardContent>

                    </Card>
                ),
            },
            {
                label: "My Submission",
                value: "tab3",
                content: (
                    <Card
                        variant="outlined"
                        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                    >
                        <CardContent>
                            <SearchableDataTable
                                data={RecruitmentDetails}
                                columns={columnConfig("tab3")}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "VRR")}
                                handleRefresh={() => handleRefresh("tab3")}

                            />
                        </CardContent>

                    </Card>
                ),
            },
        ] : [
            ...(props.CurrentRoleID === RoleID.RecruitmentHR ? [
                {
                    label: "Upload Advertisement",
                    value: "tab1",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                        >
                            <CardContent>
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab1")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab1")}
                                />
                            </CardContent>

                        </Card>

                    ),
                },
                {
                    label: "Assigne Agencies",
                    value: "tab2",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                        >
                            <CardContent>
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab2")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab2")}
                                />
                            </CardContent>

                        </Card>

                    ),
                },
                {
                    label: "Review Profiles",
                    value: "tab3",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                        >
                            <CardContent>
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab3")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab3")}
                                />
                            </CardContent>

                        </Card>

                    ),
                },
                {
                    label: "My submission",
                    value: "tab4",
                    content: (
                        <Card
                            variant="outlined"
                            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                        >
                            <CardContent>
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab4")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab4")}
                                />
                            </CardContent>

                        </Card>

                    ),
                },
            ] : [
                ...(props.CurrentRoleID === RoleID.HOD ? [
                    {
                        label: "Pending Approval",
                        value: "tab1",
                        content: (
                            <Card
                                variant="outlined"
                                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                            >
                                <CardContent>
                                    <SearchableDataTable
                                        data={RecruitmentDetails}
                                        columns={columnConfig("tab1")}
                                        rows={rows}
                                        onPageChange={(event) => onPageChange(event, "VRR")}
                                        handleRefresh={() => handleRefresh("tab1")}
                                    />
                                </CardContent>

                            </Card>
                        ),
                    },

                ] : [
                    ...(props.CurrentRoleID === RoleID.LineManager ? [
                        {
                            label: "Review Profiles",
                            value: "tab1",
                            content: (
                                <Card
                                    variant="outlined"
                                    sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
                                >
                                    <CardContent>
                                        <SearchableDataTable
                                            data={RecruitmentDetails}
                                            columns={columnConfig("tab1")}
                                            rows={rows}
                                            onPageChange={(event) => onPageChange(event, "VRR")}
                                            handleRefresh={() => handleRefresh("tab1")}
                                        />
                                    </CardContent>

                                </Card>

                            ),
                        },
                    ] : [])
                ])
            ]),

        ])
    ];

    const handleTabChange = (newTab: string) => {
        debugger;
        setActiveTab(newTab);
        console.log("Active Tab:", newTab);
    };


    return (
        <CustomLoader isLoading={isLoading}>
            <React.Fragment>
                <div className="menu-card">
                    <TabsComponent tabs={tabs} initialTab={activeTab} tabtype={tabType.Dashboard} onTabChange={handleTabChange} />
                    {console.log(first, "first")}
                </div>
            </React.Fragment>
        </CustomLoader>

    )
}
export default RecruitmentProcess;