import * as React from "react";
import { Card } from "@mui/material";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { GridStatusBackgroundcolor, StatusId } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
interface ColumnConfig {
    field: string;
    header: string;
    sortable: boolean;
    body?: (item?: {}) => {};
}


const RecruitmentProcess = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
    const [columns, setColumns] = React.useState<ColumnConfig[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const columnConfig = [
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

    function handleRedirectView(rowData: any) {
        console.log(`rowDatarowData`, rowData);
        props.navigation("/RecurimentProcess/ApprovedVRREdit");
    }



    const fetchData = async () => {
     //   await getVRRDetails.GetRecruitmentDetails([],"");
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
        setColumns(columnConfig);
    }, []);


    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const tabs = [
        {
            label: "My Submission",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <SearchableDataTable
                        data={data}
                        columns={columns}
                        rows={rows}
                        onPageChange={onPageChange}
                    />
                </div>

            ),
        },
    ];


    return (
        <CustomLoader isLoading={isLoading}>
            <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
                <React.Fragment>
                    <TabsComponent tabs={tabs} initialTab="tab1" />
                    {console.log(props.masterData, "masterDataDetails")}
                    {console.log(first, "first")}
                </React.Fragment>
            </Card>
        </CustomLoader>

    )
}
export default RecruitmentProcess;