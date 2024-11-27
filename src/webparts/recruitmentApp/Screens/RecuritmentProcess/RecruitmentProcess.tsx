import * as React from "react";
import { Card } from "@mui/material";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";

interface ColumnConfig {
    field: string;
    header: string;
    sortable: boolean;
    body?: (item?: any) => any;
}

const RecruitmentProcess = () => {

    const [data, setData] = React.useState<any[]>([]);
    const [columns, setColumns] = React.useState<ColumnConfig[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);



    React.useEffect(() => {
        const fetchData = async () => {
            const dataResponse = [
                { Id: 1, JobTitleInEnglish: 'Developer', Department: 'IT', Status: 'Pending', BusinessUnitCode: 'BU01', NumberOfPersonnelNeeded: 2 },
                { Id: 2, JobTitleInEnglish: 'Manager', Department: 'HR', Status: 'Completed', BusinessUnitCode: 'BU02', NumberOfPersonnelNeeded: 1 },
                { Id: 3, JobTitleInEnglish: 'Designer', Department: 'Design', Status: 'Rejected', BusinessUnitCode: 'BU03', NumberOfPersonnelNeeded: 1 },
            ];
            const columnConfig = [
                { field: 'Id', header: 'Job Id', sortable: true },
                { field: 'JobTitleInEnglish', header: 'Job Title', sortable: true },
                { field: 'Department', header: 'Department', sortable: true },
                { field: 'Status', header: 'Status', sortable: true },
                { field: 'BusinessUnitCode', header: 'BU Code', sortable: true },
                {
                    field: "column6",
                    header: "Status",
                    fieldName: "Status",
                    sortable: false,  // Add `sortable: false` explicitly
                    onRender: (item: any) => {
                        return (
                            <div style={{ display: "flex", alignItems: "center", paddingBottom: "11px" }}>
                                <div
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                        marginTop: "3px",
                                    }}
                                ></div>
                                <span>"Pending"</span>
                            </div>
                        );
                    },
                },
                {
                    field: "column9",
                    header: "Actions",
                    sortable: false,
                    body: (item: any) => {
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
                                <div
                                    style={{ cursor: "pointer", paddingLeft: "10px" }}
                                >
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="2 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.9993 21.3337C18.9449 21.3337 21.3327 18.9458 21.3327 16.0003C21.3327 13.0548 18.9449 10.667 15.9993 10.667C13.0538 10.667 10.666 13.0548 10.666 16.0003C10.666 18.9458 13.0538 21.3337 15.9993 21.3337Z"
                                            fill="#0CA1FF"
                                        />
                                        <path
                                            d="M28 15.9999C28 15.9999 26.6667 5.33325 16 5.33325C5.33333 5.33325 4 15.9999 4 15.9999"
                                            stroke="#0CA1FF"
                                            strokeWidth="4"
                                        />
                                    </svg>
                                </div>
                            </div>
                        );
                    },
                },
            ];

            setData(dataResponse);
            setColumns(columnConfig);
        };

        void fetchData();
    }, []);

    const onPageChange = (event: any) => {
        debugger;
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
        {
            label: "Another Tab",
            value: "tab2",
            content: (
                <div className="menu-card">
                    <p>Some other content goes here.</p>
                </div>
            ),
        },
    ];


    return (
        <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
            <React.Fragment>
                <TabsComponent tabs={tabs} initialTab="tab1" />
                {console.log(first)}
                {/* <div style={{ marginRight: "10px" }}>
                    <ReuseButton
                        label="Cancel"
                        // onClick={handleCancel}
                        spacing={4}
                    />
                </div> */}
            </React.Fragment>
        </Card>
    )
}
export default RecruitmentProcess;