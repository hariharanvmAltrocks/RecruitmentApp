import * as React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomLoader from "../Services/Loader/CustomLoader";

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
    onSelectionChange: (event: any) => void;
    selection: any[]
}

const CheckboxDataTable: React.FC<SearchableDataTableProps> = ({
    data,
    columns,
    rows,
    onPageChange,
    onSelectionChange,
    selection
}) => {
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
    const [first, setFirst] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (searchTerm === '') {
            setFilteredItems(data);
        } else {
            setFilteredItems(
                data.filter((item) =>
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
        setFilteredItems(data);
        setFirst(0);
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
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
                            // onPage={onPageChange}
                            paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            stripedRows
                            scrollable
                            scrollHeight="300px"
                        >


                            {columns.map((col) => (
                                <Column
                                    key={col.field}
                                    field={col.field}
                                    header={col.header}
                                    sortable={col.sortable}
                                    body={col.body}
                                />
                            ))}
                        </DataTable>
                    </div>
                </div>
            </div>
        </CustomLoader>
    );
};

export default CheckboxDataTable;
