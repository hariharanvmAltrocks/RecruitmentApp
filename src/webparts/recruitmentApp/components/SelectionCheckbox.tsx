// SelectionCheckbox.tsx
import * as React from "react";

interface SelectionCheckboxProps {
    selectedRows: any[]; // Selected rows in the parent component
    totalRows: any[];    // Total data (used to determine "select all" status)
    onSelectionChange: (selected: any[]) => void; // Callback to update selected rows
    onSelectAllChange: (checked: boolean) => void; // Callback to handle "select all" checkbox
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
    selectedRows,
    totalRows,
    onSelectionChange,
    onSelectAllChange,
}) => {
    // Check if all rows are selected
    const isAllSelected = selectedRows.length === totalRows.length;

    return (
        <div style={{ marginBottom: '10px' }}>
            {/* Select All Checkbox */}
            <label>
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAllChange(e.target.checked)}
                />
                Select All
            </label>
        </div>
    );
};

export default SelectionCheckbox;
