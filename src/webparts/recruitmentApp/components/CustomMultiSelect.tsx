import * as React from "react";
import { Autocomplete, TextField, Checkbox, Chip } from "@mui/material";
import { AutoCompleteItem } from "../Models/Screens";
import { ILabelStyles, Label } from "@fluentui/react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface AutoCompleteFields {
  value: AutoCompleteItem[];
  label: string;
  options: AutoCompleteItem[];
  onChange?: (value: AutoCompleteItem[]) => void;
  error?: boolean;
  disabled: boolean;
  mandatory?: boolean;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

// const removeDuplicates = (items: AutoCompleteItem[]) => {
//   const uniqueItems = new Map<string, AutoCompleteItem>();

//   items.forEach((item) => {
//     if (item && item.text) {
//       // Ensure item is not null or undefined
//       const key = item.text.trim().toLowerCase();
//       if (!uniqueItems.has(key)) {
//         uniqueItems.set(key, item);
//       }
//     }
//   });

//   return Array.from(uniqueItems.values());
// };
const removeDuplicates = (items: AutoCompleteItem[]) => {
  const uniqueItems = new Map<string, AutoCompleteItem>();

  items.forEach((item) => {
    if (item && item.text) {
      const normalizedText = item.text.trim().replace(/\s+/g, " ");

      if (!uniqueItems.has(normalizedText)) {
        uniqueItems.set(normalizedText, { ...item, text: normalizedText });
      }
    }
  });

  return Array.from(uniqueItems.values());
};

function CustomMultiSelect({
  label,
  value,
  options,
  error,
  onChange,
  mandatory = false,
  disabled = false,
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
        multiple
        id="checkboxes-tags-demo"
        options={uniqueOptions}
        disableCloseOnSelect
        value={value?.length ? value : []}
        getOptionLabel={(option) => option.text || ""}
        onChange={(event, newValue) =>
          onChange ? onChange(newValue) : undefined
        }
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
          "& .MuiOutlinedInput-root": {
            padding: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "flex-start",
          },
          "& .MuiChip-root": {
            height: "auto",
            "& .MuiChip-label": {
              whiteSpace: "normal",
              display: "block",
              wordBreak: "break-word",
              padding: "4px 8px",
            },
          },
        }}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.text}
          </li>
        )}
        disabled={disabled}
        renderTags={(tagValue, getTagProps) => {
          const containerStyle: React.CSSProperties = {
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            maxHeight: tagValue.length > 2 ? "80px" : "auto",
            overflowY: tagValue.length > 2 ? "auto" : "visible",
          };
          return (
            <div style={containerStyle}>
              {tagValue.map((option, index) => (
                <Chip label={option.text} {...getTagProps({ index })} />
              ))}
            </div>
          );
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field is Required
        </p>
      )}
    </>
  );
}

export default CustomMultiSelect;
