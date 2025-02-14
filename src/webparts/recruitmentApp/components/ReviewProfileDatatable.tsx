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
    // const [isHovered, setIsHovered] = React.useState(false);
    const [dashboardSearch, setDashboardSearch] = React.useState<any>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    // const [checkedValue, setCheckedValue] = React.useState<any[]>([]);

    React.useEffect(() => {
        setFilteredItems(data);
    }, [data]);

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
                            rowsPerPageOptions={[5, 10, 20]}
                            paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            stripedRows
                            scrollable
                            scrollHeight="300px"
                            filters={dashboardSearch}
                            style={{ overflow: "hidden" }}
                        >
                            {columns.map((col) => {

                                // if (col.header === "Action" && col.field === "Shrotlistbtn") {
                                //     return (
                                //         <Column
                                //             key={col.field}
                                //             header={"Action"}
                                //             sortable={false}
                                //             style={{ width: "1%" }}
                                //             body={(rowData: any) => {
                                //                 return (
                                //                     <span style={{ display: "flex" }}
                                //                         onMouseEnter={() => setIsHovered(true)}
                                //                         onMouseLeave={() => setIsHovered(false)}    >
                                //                         <ReuseButton
                                //                             label="Shortlist"
                                //                             onClick={() => ActionBtnFn(rowData, ActionStatus.Shortlists)}
                                //                             backgroundColor={rowData.ShortlistValue === ActionStatus.Shortlists ? "rgb(205, 45, 45)" : "white"}
                                //                             Style={{ color: rowData.ShortlistValue === ActionStatus.Shortlists ? "white" : isHovered ? "rgb(205, 45, 45)" : "rgb(205, 45, 45)", }}

                                //                         />
                                //                         <ReuseButton
                                //                             label="Rejected"
                                //                             onClick={() => ActionBtnFn(rowData, ActionStatus.Rejected)}
                                //                             backgroundColor={rowData.ShortlistValue === ActionStatus.Rejected ? "rgb(205, 45, 45)" : "white"}
                                //                             Style={{ color: rowData.ShortlistValue === ActionStatus.Rejected ? "white" : isHovered ? "rgb(205, 45, 45)" : "rgb(205, 45, 45)", marginLeft: "13%" }}
                                //                         />

                                //                     </span>

                                //                 );
                                //             }}
                                //         />
                                //     );
                                // }

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
                {/* <div className="ms-Grid-row" style={{ marginBottom: "2%" }}>
                    <div className="ms-Grid-col ms-lg6"></div>
                    <div
                        className="ms-Grid-col ms-lg6"
                        style={{ display: "flex", justifyContent: "end", marginLeft: "48%" }}
                    >
                        <div style={{ marginRight: "10px" }}>
                            <ReuseButton label="Submit" onClick={handleSubmit} spacing={4} />
                        </div>
                    </div>
                </div> */}
            </div>
        </CustomLoader>
    );
};

export default ReviewProfileDatatable;
