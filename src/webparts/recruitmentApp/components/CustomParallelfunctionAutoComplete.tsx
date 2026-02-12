import { ILabelStyles, Label } from "@fluentui/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { Fr_AutoComplete } from "../Models/Screens";
import { Box } from "@mui/material";

const labelStyles: ILabelStyles = {
  root: { marginTop: 2, overflowWrap: "inherit" },
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

function CustomParallelfunctionAutoComplete({
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
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Label styles={labelStyles} style={{ position:"relative", marginBottom:"1%",minWidth: "75px" }} >
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
        width: "250px", // control dropdown width
        borderRadius: "4px",
        borderColor: "#5f5f5f",
        boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
        "& .MuiOutlinedInput-root": {
          ...(disabled && {
            background: "none rgb(243, 242, 241)",
          }),
        },
      }}
      disabled={disabled}
      autoSelect
      autoComplete
      onChange={onChange ? (event, value) => onChange(value) : undefined}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} />
      )}
    />
  </Box>
);

}

export default CustomParallelfunctionAutoComplete;
