import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";
import { Textarea } from "@fluentui/react-components";

interface fieldItems {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error: boolean;
  placeholder?: string;
  disabled?: boolean;
  mandatory?: boolean;
}

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomTextArea({
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  mandatory = false,
}: fieldItems) {
  return (
    <>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <Textarea
        value={value}
        placeholder={placeholder}
        style={{
          //color: "#808080",
          color: value ? "#000000" : "#808080",
          borderRadius: "5px",
          borderWidth: "1px",
          marginLeft: "0rem",
          width: "100%",
          border: "groove",
          fontSize: value ? "13px" : "11px",
          // paddingTop: value ? "" : "7px",
          // paddingLeft: value ? "" : "11px",
          fontFamily: "sans-serif",
        }}
        onChange={
          onChange ? (event, value) => onChange(value?.value || "") : undefined
        }
        disabled={disabled}
      />
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field is Required
        </p>
      )}
    </>
  );
}

export default CustomTextArea;
