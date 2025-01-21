import * as React from "react";
import { Card, Link } from "@mui/material";
import CheckboxDataTable from "./CheckboxDataTable";
import { StatusId } from "../utilities/Config";
import { getVRRDetails } from "../Services/ServiceExport";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";
import { Button } from "primereact/button";




const CommanFieldTemplate = (props: any) => {
    const [data, setData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    // const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const HRFileHandle = (serverUrl: string, fileName: string) => {
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
            header: "Action",
            sortable: false,
            body: (rowData: any) => {
                const handleRedirect = (rowData: any) => {
                    props.navigation("/CommanTemplate/CommanTemplate");
                }

                return (
                    <span>
                        <Button
                            onClick={() =>
                                handleRedirect(rowData)
                            }
                            className="table_btn"
                            icon="pi pi-eye"
                            style={{
                                width: "30px",
                                marginRight: "7px",
                                padding: "3px",
                            }}
                        />
                    </span>
                );
            },
        },
    ];


    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue: StatusId.PendingwithHRLeadtoAssignRecruitmentHR
            });
            const data = await getVRRDetails.GetCandidateDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                setData(data.data);

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
        // setFirst(event.first);
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
                        onPageChange={onPageChange} handleAssignBtn={function (): void {
                            throw new Error("Function not implemented.");
                        }} AssignBtnValidation={false} handleCheckbox={function (value: any, rowData: any): void {
                            throw new Error("Function not implemented.");
                        }} onSelectAllChange={function (value: any): void {
                            throw new Error("Function not implemented.");
                        }} selectAll={false} />
                    {/* <ReviewProfileDatatable
                        data={data}
                        columns={columnConfig}
                        rows={rows}
                        onPageChange={onPageChange}
                    /> */}
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
                    </React.Fragment>
                </Card>
            </CustomLoader>

        </>


    )
}
export default CommanFieldTemplate;