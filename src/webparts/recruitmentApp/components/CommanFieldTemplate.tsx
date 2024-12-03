import * as React from "react";
import { Card } from "@mui/material";
import { Button } from "primereact/button";
import ReuseButton from "./ReuseButton";
import CheckboxDataTable from "./CheckboxDataTable";
import { StatusId } from "../utilities/Config";
import { getVRRDetails } from "../Services/ServiceExport";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";



const CommanFieldTemplate = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const columnConfig = [
        {
            field: 'Checkbox',
            header: "",
            sortable: false,

        },
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
                    // style={{
                    //     backgroundColor:
                    //         rowData.Status.includes("Pending") === true // "Pending"
                    //             ? GridStatusBackgroundcolor.Pending
                    //             : rowData.Status.includes("Completed") === true
                    //                 ? GridStatusBackgroundcolor.CompletedOrApproved
                    //                 : rowData.Status.includes("Rejected") === true
                    //                     ? GridStatusBackgroundcolor.Rejected
                    //                     : rowData.Status.includes("Reverted") === true
                    //                         ? GridStatusBackgroundcolor.Reverted
                    //                         : rowData.Status.includes("Resubmitted") === true
                    //                             ? GridStatusBackgroundcolor.ReSubmitted
                    //                             : rowData.Status.includes("Draft") === true
                    //                                 ? GridStatusBackgroundcolor.Draft
                    //                                 : "",
                    //     borderRadius: "5px",
                    // }}
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
                return (
                    <span
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
                        <ReuseButton
                            label="Assign"
                        // onClick={AssignPopups}
                        />
                    </span>
                );
            },
        },
    ];

    function handleRedirectView(rowData: any) {
        console.log(`rowDatarowData`, rowData);
        props.navigation("/CommanTemplate/CommanTemplate");
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
                    <CheckboxDataTable
                        data={data}
                        columns={columnConfig}
                        rows={rows}
                        onPageChange={onPageChange}
                        selection={[]}
                    />
                </div>

            ),
        },
    ];


    return (
        <>
            <CustomLoader isLoading={isLoading}>
                <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
                    <React.Fragment>
                        <TabsComponent tabs={tabs} initialTab="tab1" tabClassName={"Tab"} />
                        {console.log(props.masterData, "masterDataDetails")}
                        {console.log(first, "first")}
                    </React.Fragment>
                </Card>
            </CustomLoader>

        </>


    )
}
export default CommanFieldTemplate;