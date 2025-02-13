import { ILabelStyles, Label } from "@fluentui/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";

const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};


type AutoCompleteItem = {
    key: number;
    text: string;
};
interface AutoCompleteFields {
    value: AutoCompleteItem | null;
    label: string;
    options: AutoCompleteItem[];
    onChange?: (value: AutoCompleteItem | null) => void;
    error?: boolean;
    disabled: boolean;
    mandatory?: boolean;
    placeholder?: string;
}

function CustomAutoComplete({
    label,
    value,
    options,
    error,
    disabled,
    onChange,
    mandatory = false,
    placeholder,
}: AutoCompleteFields) {
    return (
        <>
            <Label styles={labelStyles}>
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={value}
                options={options}
                placeholder={placeholder}
                getOptionLabel={(option) => option.text || ""}
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
                disabled={disabled}
                autoSelect={true}
                autoComplete={true}
                onChange={onChange ? (event, value) => onChange(value) : undefined}
                renderInput={(params) => <TextField placeholder={placeholder} {...params} />}
            />
            {error && (
                <p
                    style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
                >
                    Field is Required
                </p>
            )}
        </>
    );
}

export default CustomAutoComplete;
