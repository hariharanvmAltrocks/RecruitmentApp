import * as React from "react";
import { Card, Link } from "@mui/material";
import CheckboxDataTable from "./CheckboxDataTable";
import { StatusId } from "../utilities/Config";
import { getVRRDetails } from "../Services/ServiceExport";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";
import CustomPopup from "./CustomPopup";
import AssignRecuritmentHR from "./AssignRecuritmentHR";




const CommanFieldTemplate = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isAssign, setIsAssign] = React.useState<boolean>(false);

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

    const isAssignfn = () => {
        setIsAssign(!isAssign)
    }

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
            sortable: true
        },
        {
            field: "",
            header: "CV",
            sortable: false,
            body: (rowData: any) => {
                console.log(rowData, "rowDataCandidateCVDoc");
                if (rowData?.CandidateCVDoc[0] && rowData?.CandidateCVDoc[0]?.name) {
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
                                {rowData?.CandidateCVDoc[0]?.name}
                            </Link>
                        </div>
                    );
                } else {
                    return <span>No CV available</span>;  // Fallback text in case there is no CV
                }
            },
        },
        {
            field: "Shrotlistbtn",
            header: "Action",
            sortable: false,
            body: (rowData: any) => {
                return (
                    <span>
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
                FilterValue: StatusId.InitiatedforRecruitmentProcess
            });
            const data = await getVRRDetails.GetCandidateDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                console.log(data.data, "GetVacancyDetails");
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

            {isAssign && (
                <>
                    <CustomPopup
                        visible={isAssign}
                        onClose={isAssignfn} // Pass handleCloseDialog as a prop to CustomPopup
                        header=''
                        width="500px"
                        children={
                            <AssignRecuritmentHR />
                        }
                    />

                </>
            )}

        </>


    )
}
export default CommanFieldTemplate;