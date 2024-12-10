import * as React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomLoader from "../Services/Loader/CustomLoader";
import { FilterMatchMode } from "primereact/api";


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
}

const ReviewProfileDatatable: React.FC<SearchableDataTableProps> = ({
    data,
    columns,
    rows,
    onPageChange,
}) => {
    const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [dashboardSearch, setDashboardSearch] = React.useState<any>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    // const [checkedValue, setCheckedValue] = React.useState<any[]>([]);


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


    const Shortlistbtnfn = (rowData: any, ActionStatus: string) => {
        // let DataValue = checkedValue.length > 0 ? filteredItems : data;

        const updatedRowData = filteredItems.map((item: any) => {
            if (item.ID === rowData.ID) {

                return {
                    ...item,
                    ShortlistValue: ActionStatus,
                };
            }
            return item;
        });
        console.log(updatedRowData, "updatedRowData");
        setFilteredItems(updatedRowData);
    }




    return (
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
                <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
                    <div className="ms-Grid-col ms-lg12">
                        <DataTable
                            value={filteredItems}
                            first={first}
                            rows={rows}
                            paginator
                            paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            stripedRows
                            scrollable
                            scrollHeight="300px"
                            filters={dashboardSearch}
                        >
                            {columns.map((col) => {
                                // Render Checkbox column separately
                                if (col.header === "Action" && col.field === "Shrotlistbtn") {
                                    return (
                                        <Column
                                            key={col.field}
                                            header={"Action"}
                                            sortable={false}
                                            style={{ width: "1%" }}
                                            body={(rowData: any) => {
                                                return (
                                                    <span style={{ display: "flex" }}>
                                                        <ReuseButton
                                                            label="Shortlist"
                                                            onClick={() => Shortlistbtnfn(rowData, "Shortlist")}
                                                            backgroundColor={rowData.ShortlistValue === "Shortlist" ? "rgb(205, 45, 45)" : "white"}
                                                            Style={{ color: rowData.ShortlistValue === "Shortlist" ? "white" : "rgb(205, 45, 45)" }}

                                                        />
                                                        <ReuseButton
                                                            label="Rejected"
                                                            onClick={() => Shortlistbtnfn(rowData, "Rejected")}
                                                            backgroundColor={rowData.ShortlistValue === "Rejected" ? "rgb(205, 45, 45)" : "white"}
                                                            Style={{ color: rowData.ShortlistValue === "Rejected" ? "white" : "rgb(205, 45, 45)" }}
                                                        />

                                                    </span>

                                                );
                                            }}
                                        />
                                    );
                                }
                                // Render other columns normally
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
    );
};

export default ReviewProfileDatatable;
