import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { GridStatusBackgroundcolor, StatusId, tabType } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
// interface ColumnConfig {
//     field: string;
//     header: string;
//     sortable: boolean;
//     body?: (item?: {}) => {};
// }


const InterviewPanelList = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
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
                    </div>
                );
            },
        },
    ];


    function handleRedirectView(rowData: any, tab: string) {
        debugger;
        const ID = rowData?.JobCodeId
        props.navigation("/InterviewPanelList/InterviewPanelEdit", { state: { ID, tab } });

    }



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
        {
            label: "My Submission",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <SearchableDataTable
                        data={data}
                        columns={columnConfig("tab1")}
                        rows={rows}
                        onPageChange={(event) => onPageChange(event, "VRR")}
                        handleRefresh={handleRefresh}
                    />
                </div>
            ),
        },
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
export default InterviewPanelList;