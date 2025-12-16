import { ILabelStyles, Label } from "@fluentui/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { Fr_AutoComplete } from "../Models/Screens";

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
  options: AutoCompleteItem[] | Fr_AutoComplete[];
  onChange?: (value: AutoCompleteItem | null) => void;
  error?: boolean;
  disabled: boolean;
  mandatory?: boolean;
  placeholder?: string;
  MinHeight?: string;
}
const removeDuplicates = (items: AutoCompleteItem[]) => {
  const seen = new Map();
  return items.filter((item) => {
    const lowerText = (item.text || "").toLowerCase().trim();
    if (seen.has(lowerText)) {
      return false;
    }
    seen.set(lowerText, item.key);
    return true;
  });
};

function CustomAutoComplete({
  label,
  value,
  options,
  error,
  disabled,
  onChange,
  mandatory = false,
  placeholder,
  MinHeight,
}: AutoCompleteFields) {
  const uniqueOptions = React.useMemo(
    () => removeDuplicates(options),
    [options]
  );
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
        options={uniqueOptions}
        placeholder={placeholder}
        getOptionLabel={(option) => option.text || ""}
        sx={{
          width: "100%",
          borderRadius: "4px",
          borderColor: "#5f5f5f",
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          "& input": {
            height: MinHeight ? MinHeight : "10px",
          },
          "& .MuiOutlinedInput-root": {
            minWidth: "50px",
            ...(disabled && {
              background: "none rgb(243, 242, 241)",
            }),
          },
          field: {
            ...(disabled && {
              background: "none rgb(243, 242, 241);",
              "::placeholder": {
                background: "none rgb(243, 242, 241)",
              },
            }),
          },
        }}
        disabled={disabled}
        autoSelect={true}
        autoComplete={true}
        onChange={onChange ? (event, value) => onChange(value) : undefined}
        renderInput={(params) => (
          <TextField
            placeholder={placeholder}
            {...params}
            sx={{ minWidth: "50px" }}
          />
        )}
      />
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field is Required
        </p>
      )}
    </>
  );
}

export default CustomAutoComplete;
