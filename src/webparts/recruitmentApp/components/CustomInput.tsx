import * as React from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Label, ILabelStyles } from "@fluentui/react";

interface FieldItems {
  label?: string;
  value: string | any;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
  mandatory?: boolean;
  readOnly?: boolean;
}

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

const CustomInput: React.FC<FieldItems> = ({
  label,
  value,
  onChange,
  error,
  disabled,
  maxLength,
  readOnly = false,
  mandatory = false,
}) => {
  return (
    <>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <TextField
        value={value}
        placeholder={label ? label : ""}
        styles={{
          fieldGroup: {
            height: 42,
            borderRadius: "4px",
            boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
            borderColor: "rgb(205, 45, 45)",
          },
        }}
        readOnly={readOnly}
        required={false}
        disabled={disabled}
        onChange={onChange ? (event, newValue) => onChange(newValue || "") : undefined}
        maxLength={maxLength}
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
};

export default CustomInput;
