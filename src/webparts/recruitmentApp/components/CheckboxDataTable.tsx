import * as React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomLoader from "../Services/Loader/CustomLoader";
import CustomCheckBox from "./CustomCheckbox";

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
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [selectAll, setSelectAll] = React.useState<boolean>(false);
    const [checkedValue, setCheckedValue] = React.useState<any[]>([]);


    React.useEffect(() => {
        if (searchTerm === '') {
            setFilteredItems(data);
        } else {
            setFilteredItems(
                filteredItems.filter((item) =>
                    columns.some((col) =>
                        item[col.field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        }
    }, [searchTerm, data, columns]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setSearchTerm('');
        setFilteredItems(filteredItems);
        setFirst(0);
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
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
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                            selection={selection}
                            onSelectionChange={onSelectionChange}
                            selectionMode="checkbox"
                            dataKey="id"
                            paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            stripedRows
                            scrollable
                            scrollHeight="300px"
                        >
                            {columns.map((col) => {
                                // Render Checkbox column separately
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
                                                            value={rowData?.Checked === true}
                                                            onChange={(e, value: boolean) => handleCheckbox(value, rowData)}
                                                        />
                                                    </div>
                                                );
                                            }}
                                        />
                                    );
                                }

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

export default CheckboxDataTable;
