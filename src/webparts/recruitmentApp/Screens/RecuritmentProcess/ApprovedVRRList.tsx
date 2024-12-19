import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { GridStatusBackgroundcolor, RoleID, StatusId, tabType } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
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
        const ID = rowData?.ID
        if ((props.CurrentRoleID === RoleID.RecruitmentHR && tab === 'tab2') || (props.CurrentRoleID === RoleID.LineManager && tab === 'tab1')) {
            props.navigation("/RecurimentProcess/ReviewProfile", { state: { ID, tab } });
        } else if (props.CurrentRoleID === RoleID.RecruitmentHR && tab === 'tab3') {
            props.navigation("/RecurimentProcess/AssignInterviewPanel", { state: { ID, tab } });
        } else {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", { state: { rowData, tab } });
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
            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue: StatusId.InitiatedforRecruitmentProcess
            });
            const data = await getVRRDetails.GetVacancyDetails(filterConditions, Conditions);
            const RecruitmentDetails = await getVRRDetails.GetRecruitmentDetails([], "");
            console.log("RecruitmentDetails", RecruitmentDetails);
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
    }, []);


    const onPageChange = (event: any, Type: string) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const handleRefresh = () => {
        void fetchData();
    };

    const tabs = [
        ...(props.CurrentRoleID === RoleID.RecruitmentHRLead ? [
            {
                label: "Approved VRR",
                value: "tab1",
                content: (
                    <div className="menu-card">
                        <SearchableDataTable
                            data={data}
                            columns={columnConfig("tab1")}
                            rows={rows}
                            onPageChange={(event) => onPageChange(event, "Recruitment")}
                            handleRefresh={handleRefresh}
                        />
                    </div>
                ),
            },
            {
                label: "My Submission",
                value: "tab2",
                content: (
                    <div className="menu-card">
                        <SearchableDataTable
                            data={RecruitmentDetails}
                            columns={columnConfig("tab2")}
                            rows={rows}
                            onPageChange={(event) => onPageChange(event, "VRR")}
                            handleRefresh={handleRefresh}

                        />
                    </div>
                ),
            },
        ] : [
            ...(props.CurrentRoleID === RoleID.LineManager ? [
                {
                    label: "Review Profiles",
                    value: "tab1",
                    content: (
                        <div className="menu-card">
                            <SearchableDataTable
                                data={RecruitmentDetails}
                                columns={columnConfig("tab1")}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "VRR")}
                                handleRefresh={handleRefresh}
                            />
                        </div>
                    ),
                },
            ] : [
                {
                    label: "My Submission",
                    value: "tab1",
                    content: (
                        <div className="menu-card">
                            <SearchableDataTable
                                data={RecruitmentDetails}
                                columns={columnConfig("tab1")}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "VRR")}
                                handleRefresh={handleRefresh}
                            />
                        </div>
                    ),
                },
                ...(props.CurrentRoleID === RoleID.RecruitmentHR ? [
                    {
                        label: "Review Profiles",
                        value: "tab2",
                        content: (
                            <div className="menu-card">
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab2")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={handleRefresh}
                                />
                            </div>
                        ),
                    },
                    {
                        label: "Assign interviewPanel",
                        value: "tab3",
                        content: (
                            <div className="menu-card">
                                <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab3")}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={handleRefresh}
                                />
                            </div>
                        ),
                    },
                ] : []),
            ])
        ])
    ];




    return (
        <CustomLoader isLoading={isLoading}>
            <React.Fragment>
                <div className="menu-card">
                    <TabsComponent tabs={tabs} initialTab="tab1" tabtype={tabType.Dashboard} />
                    {console.log(first, "first")}
                </div>
            </React.Fragment>
        </CustomLoader>

    )
}
export default RecruitmentProcess;