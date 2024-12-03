import * as React from "react";
import { Card } from "@mui/material";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { GridStatusBackgroundcolor, StatusId } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import CustomCheckBox from "../../components/CustomCheckbox";
import ReuseButton from "../../components/ReuseButton";
import CustomPopup from "../../components/CustomPopup";

// interface ColumnConfig {
//     field: string;
//     header: string | ((item?: any) => React.ReactNode);
//     sortable: boolean;
//     body?: (item?: {}) => React.ReactNode;
// }


const RecruitmentProcess = (props: any) => {
    console.log(props, "ApprovedVRR");

    const [data, setData] = React.useState<any[]>([]);
    const [rows, setRows] = React.useState<number>(5);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectAll, setSelectAll] = React.useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = React.useState<any[]>([]);
    // const [checkboxValue, setCheckboxValue] = React.useState<boolean>(false);
    const [AssignPopup, setAssignPopup] = React.useState<boolean>(false);

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
                setData(data.data);
            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);
    };

    const onSelectAllChange = (value: boolean) => {
        debugger;
        const updatedRowData: any[] = data.map((item: any) => {
            if (data) {
                return {
                    ...item,
                    Checked: value,
                };
            }
            return item;
        });
        setData(updatedRowData)
        setSelectAll(value)
    };

    const onSelectionChange = (event: any) => {
        const value = event.value;
        setSelectedRowData(value);
        setSelectAll(value.length === data.length);
    };

    const handleCheckbox = (value: boolean, rowData: any) => {
        debugger;
        const updatedRowData: any[] = data.map((item: any) => {
            if (item.VRRID === rowData.VRRID) {
                return {
                    ...item,
                    Checked: value,
                };
            }
            return item;
        });

        setData(updatedRowData);
    };

    const handleRedirectView = (rowData: any) => {
        console.log(`rowData`, rowData);
        const VRRID = rowData?.VRRID
        props.navigation("/RecurimentProcess/ApprovedVRRView", { state: { VRRID } });
    };

    const AssignPopups = () => {
        setAssignPopup(!AssignPopup)
    }
    const CloseAssignPopups = () => {
        setAssignPopup(false)
    }

    const columnConfig = [
        {
            field: '',
            header: () => (
                <CustomCheckBox label="" value={selectAll} onChange={(e, value: boolean) => onSelectAllChange(value)} />
            ),
            sortable: false,
            body: (rowData: any) => {
                return (
                    <div>
                        <CustomCheckBox
                            label=""
                            value={rowData?.Checked == true}
                            onChange={(e, value: boolean) => handleCheckbox(value, rowData)}
                        />
                    </div>
                );
            },
        },
        {
            field: 'JobCode',
            header: 'Job Id',
            sortable: true
        },
        {
            field: 'JobTitleInEnglish',
            header: 'Job Title',
            sortable: true
        },
        {
            field: 'Department',
            header: 'Department',
            sortable: true
        },
        {
            field: 'ReasonForVacancy',
            header: 'ReasonForVacancy',
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
                                    : rowData.Status.includes("Completed") === true
                                        ? GridStatusBackgroundcolor.CompletedOrApproved
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
                            onClick={AssignPopups}
                        />
                    </span>
                );
            },
        },
    ];



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
                    {/* <SearchableDataTable
                        data={data}
                        columns={columns}
                        rows={rows}
                        onPageChange={onPageChange}
                    /> */}
                    <CheckboxDataTable
                        data={data}
                        columns={columnConfig}
                        rows={rows}
                        onPageChange={onPageChange}
                        selection={selectedRowData}
                        onSelectionChange={onSelectionChange}
                    />
                </div>

            ),
        },
    ];


    return (
        <>
            {AssignPopup ? (
                <>
                    {/* <Dialog
                        header={"Approved VRR"}
                        visible={AssignPopup}
                        onHide={CloseAssignPopups}
                        footer={"ApprovedVRR"}
                        closable={false}
                    /> */}
                    <CustomPopup
                        visible={AssignPopup}
                        onClose={CloseAssignPopups} // Pass handleCloseDialog as a prop to CustomPopup
                        header="Dialog Header"
                        width="500px"
                    >
                        <p>This is the content inside the dialog.</p>
                    </CustomPopup>
                </>
            ) : (
                <></>
            )}


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
export default RecruitmentProcess;