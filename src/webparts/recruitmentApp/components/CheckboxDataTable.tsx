import * as React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomLoader from "../Services/Loader/CustomLoader";

import { FilterMatchMode } from "primereact/api";
import AssignRecuritmentHR, { HeaderValue } from "./AssignRecuritmentHR";
import { AutoCompleteItem } from "../Models/Screens";
import { getVRRDetails } from "../Services/ServiceExport";
import CustomCheckBox from "./CustomCheckBox";


interface ColumnConfig {
    field: string;
    header: string | ((item?: any) => React.ReactNode);
    sortable: boolean;
    body?: (item?: any, index?: number, column?: ColumnConfig) => React.ReactNode;
}

interface SearchableDataTableProps {
    data: any[];
    columns: ColumnConfig[];
    rows: number;
    onPageChange: (event: any) => void;
    selection: any[]
}

const CheckboxDataTable: React.FC<SearchableDataTableProps> = ({
    data,
    columns,
    rows,
    onPageChange,
    selection
}) => {
    const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectAll, setSelectAll] = React.useState<boolean>(false);
    const [checkedValue, setCheckedValue] = React.useState<any[]>([]);
    const [AssignPopup, setAssignPopup] = React.useState<boolean>(false);
    const [AssignBtnValidation, setAssignBtnValidation] = React.useState<boolean>(false);
    const [HeaderValueData, setHeaderValueData] = React.useState<HeaderValue | null>(null);
    const [AssignRecuritmentHRValue, setAssignRecuritmentHRValue] = React.useState<AutoCompleteItem | null>(null);
    const [dashboardSearch, setDashboardSearch] = React.useState<any>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });



    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchTerm(event.target.value);
    // };
    React.useEffect(() => {
        const HeaderValue = {
            JobCode: "POS001",
            JobTitle: "Position English",
            Headcount: "01"
        }
        setHeaderValueData(HeaderValue)
    }, []);


    const handleRefresh = () => {
        setIsLoading(true);
        setFilteredItems(filteredItems);
        setFirst(0);
        setDashboardSearch({
            global: {
                value: "",
                matchMode: FilterMatchMode.CONTAINS,
            },
        })
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
    };

    const handleSearch = (event: any) => {
        setDashboardSearch({
            global: {
                value: event.target.value,
                matchMode: FilterMatchMode.CONTAINS,
            },
        })
    };

    const onSelectAllChange = (value: boolean) => {
        const updatedRowData: any[] = data.map((item: any) => {
            if (data) {
                return {
                    ...item,
                    Checked: value,
                };
            }
            return item;
        });
        setFilteredItems(updatedRowData)
        setSelectAll(value)
    };

    const onSelectionChange = (event: any) => {
        const value = event.value;
        // setFilteredItems(value);
        setSelectAll(value.length === data.length);
    };

    const handleCheckbox = (value: boolean, rowData: any) => {
        debugger;

        let DataValue = checkedValue.length > 0 ? filteredItems : data;

        const updatedRowData = DataValue.map((item: any) => {
            if (item.ID === rowData.ID) {
                if (item.Checked === true && value === true) {
                    return item;
                }

                return {
                    ...item,
                    Checked: value,
                    Assigned: value,
                };
            }
            return item;
        });
        let CheckedValue = updatedRowData.filter((item) => item.Checked === true)
        console.log(CheckedValue, "CheckedValue");
        const updatedCheckedValues = CheckedValue
            ? [...checkedValue, CheckedValue]
            : []

        setCheckedValue(updatedCheckedValues)
        console.log(updatedRowData, "updatedRowData");
        setFilteredItems(updatedRowData);
    };



    function handleAssignBtn() {
        let CheckedDataValue = filteredItems.some((item) => item.Checked)
        if (CheckedDataValue) {
            setAssignPopup(!AssignPopup)
            setAssignBtnValidation(AssignBtnValidation)
        } else {
            setAssignBtnValidation(!AssignBtnValidation)
        }
    }

    const handleAutoComplete = async (
        item: AutoCompleteItem
    ) => {
        if (item) {
            setAssignRecuritmentHRValue(item);
        }
    };

    const UpdateAssignCandidateRecuritmentHR = async (UpdateID: number, addJson: any) => {
        setIsLoading(true);
        try {
            debugger;
            const data = await getVRRDetails.AssignCandidateRecuritmentHR(UpdateID, addJson);
            if (data.status === 200 && data.data !== null) {
                debugger;
                console.log(data.data, "GetVacancyDetails");
                setAssignPopup(!AssignPopup)
            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);

    };

    const assignbtnfn = async () => {
        setIsLoading(true);
        const updatedRowData = await Promise.all(filteredItems.map(async (item: any) => {
            if (item.Assigned === true) {
                let addJson = {
                    AssignedById: AssignRecuritmentHRValue?.key,
                };

                await UpdateAssignCandidateRecuritmentHR(item.ID, addJson);

                return {
                    ...item,
                    AssignBy: AssignRecuritmentHRValue?.text,
                };
            }
            return item;
        }));

        setFilteredItems(updatedRowData);
        setAssignPopup(false);

        setIsLoading(false);
    };

    return (
        <>

            {AssignPopup ? (
                <>
                    <AssignRecuritmentHR
                        handleAutoComplete={handleAutoComplete}
                        AssignRecuritmentHRValue={AssignRecuritmentHRValue}
                        onClose={handleAssignBtn}
                        HeaderValueData={HeaderValueData}
                        assignbtnfn={assignbtnfn}
                        visible={AssignPopup}
                    />
                </>
            ) : (
                <></>
            )}



            <CustomLoader isLoading={isLoading}>
                <div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg10 search_div" style={{ paddingLeft: '2%', position: 'relative', display: 'inline-block' }}>
                            <TextField
                                type="text"
                                placeholder="Search..."
                                styles={{
                                    fieldGroup: {
                                        borderRadius: "4px",
                                        boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                                        borderColor: "red",
                                    },
                                }}
                                value={dashboardSearch.global.value}
                                onChange={handleSearch}
                            />
                            <Icon
                                iconName="Search"
                                style={{
                                    fontSize: '20px',
                                    position: 'absolute',
                                    top: '5%',
                                    right: '11px',
                                    color: 'black',
                                }}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg1">
                            <ReuseButton
                                icon={
                                    <RefreshIcon
                                        style={{
                                            fontSize: "2rem",
                                            marginTop: "4%",
                                            marginLeft: "18%",
                                        }}
                                    />
                                }
                                onClick={handleRefresh}
                                spacing={4}
                                height="33px"
                                width="32%"
                                Style={{ marginRight: "11px" }}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row" style={{ display: "flex", justifyContent: "end", marginTop: "2%" }}>
                        <div className="ms-Grid-col ms-lg2">
                            <ReuseButton
                                label="Assign"
                                onClick={handleAssignBtn}
                                spacing={4}
                                error={AssignBtnValidation}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
                        <div className="ms-Grid-col ms-lg12">
                            <DataTable
                                value={filteredItems}
                                first={first}
                                rows={rows}
                                paginator
                                selection={selection}
                                onSelectionChange={onSelectionChange}
                                selectionMode="checkbox"
                                dataKey="id"
                                paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                stripedRows
                                scrollable
                                scrollHeight="300px"
                                filters={dashboardSearch}
                            >
                                {columns.map((col) => {
                                    if (col.field === "Checkbox") {
                                        return (
                                            <Column
                                                key={col.field}
                                                header={() => (
                                                    <CustomCheckBox label="" value={selectAll} onChange={(e, value: boolean) => onSelectAllChange(value)} />
                                                )}
                                                sortable={false}
                                                body={(rowData: any) => {
                                                    return (
                                                        <div>
                                                            <CustomCheckBox
                                                                label=""
                                                                value={rowData?.Checked === true || rowData?.AssignedById}
                                                                onChange={(e, value: boolean) => handleCheckbox(value, rowData)}
                                                            />
                                                        </div>
                                                    );
                                                }}
                                            />
                                        );
                                    }
                                    return (
                                        <Column
                                            key={col.field}
                                            field={col.field}
                                            header={col.header}
                                            sortable={col.sortable}
                                            body={col.body}
                                        />
                                    );


                                })}
                            </DataTable>

                        </div>
                    </div>
                </div>
            </CustomLoader>
        </>



    );
};

export default CheckboxDataTable;