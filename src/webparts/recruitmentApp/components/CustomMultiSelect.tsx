import * as React from "react";
import { Autocomplete, TextField, Chip } from '@mui/material';
import { AutoCompleteItem } from "../Models/Screens";
import { ILabelStyles, Label } from "@fluentui/react";

interface FormFields {
    label?: string;
    value: AutoCompleteItem[]; // Value should be an array of AutoCompleteItems
    options: AutoCompleteItem[];
    error?: boolean;
    onChange?: (value: AutoCompleteItem[]) => void;
    mandatory?: boolean;
    disabled?: boolean;
}

const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomMultiSelect({
    label,
    value,
    options,
    error,
    onChange,
    mandatory = false,
    disabled = false,
}: FormFields) {
    // Local state for the selected items
    const [newArry, setNewArry] = React.useState<AutoCompleteItem[]>(value);

    // Handle delete action
    const handleLocationDelete = (index: number) => {
        const updatedArray = newArry.filter((_, idx) => idx !== index);
        setNewArry(updatedArray);
        if (onChange) onChange(updatedArray); // Notify the parent component of the update
    };

    return (
        <>
            <Label styles={labelStyles}>
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
            <Autocomplete
                multiple
                limitTags={10}
                id="multiple-limit-tags"
                options={options}
                getOptionLabel={(option) => option.text} // Assuming 'text' is the display field in AutoCompleteItem
                value={newArry} // Use newArry as the value
                disabled={disabled}
                onChange={(event, newValue) => {
                    setNewArry(newValue);
                    if (onChange) onChange(newValue); // Notify the parent component of the update
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                    // label={label}
                    // error={error}
                    // disabled={disabled}
                    />
                )}
                sx={{
                    width: "100%",
                    borderRadius: "4px",
                    borderColor: "#5f5f5f",
                    boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                    "& input": {
                        height: "10px",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                        borderColor: "#5f5f5f",
                    },
                    // "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator":
                    //   {
                    //     color: "black",
                    //   },
                }}
                disableCloseOnSelect
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={option.text} // Display the text from AutoCompleteItem
                            {...getTagProps({ index })} // Pass the correct index to getTagProps, which handles the 'key'
                            onDelete={() => handleLocationDelete(index)} // Trigger delete on chip removal
                        />
                    ))
                }
            />
            {error && (
                <p
                    style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
                >
                    Field Is Required
                </p>
            )}
        </>


    );
}

export default CustomMultiSelect;
