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
        // style={{
        //   color: "#808080",
        //   borderRadius: "5px",
        //   borderWidth: "1px",
        //   marginLeft: "0rem",
        //   width: "100%",
        //   border: "groove",
        // }}
        style={{
          //color: "#808080",
          // color: value ? "#000000" : "#D7D3D3",
          color: value ? "#000000" : "#C9C9C9",
          borderRadius: "4px",
          borderWidth: "1px",
          borderColor: "#5f5f5f",
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          border: "1px solid rgb(191, 182, 182)",
          marginLeft: "0rem",
          width: "100%",
          // border: "groove",
          //border: "1px solid #5f5f5f",

          fontSize: value ? "13px" : "11px",
          paddingTop: value ? "" : "7px",
          paddingLeft: value ? "" : "11px",
          fontFamily: "sans-serif",
          //height: "10px",
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
