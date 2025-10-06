import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";
import { Textarea } from "@fluentui/react-components";
import "../../recruitmentApp/App.css";

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
  const [textValidation, setTextValidation] = React.useState<boolean>(false);

  const handleChange = (event: any, data: any) => {
    const newValue = data?.value || "";

    if (newValue.length > 256) {
      setTextValidation(true);
      return;
    }

    setTextValidation(false);
    onChange?.(newValue);
  };

  return (
    <>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <Textarea
        className={disabled ? "DisableColor" : ""}
        value={value}
        placeholder={"Enter your text (maximum 256 characters)"}
        disabled={disabled}
        onChange={handleChange}
        style={{
          color: "#000000",
          borderRadius: "4px",
          borderWidth: "1px",
          borderColor: "#5f5f5f",
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          border: "1px solid rgb(191, 182, 182)",
          marginLeft: "0rem",
          width: "100%",
          fontSize: value ? "13px" : "11px",
          fontFamily: "sans-serif",
          paddingTop: value ? "5px" : "7px",
          paddingLeft: value ? "7px" : "11px",
          ...(disabled
            ? { background: "none rgb(243, 242, 241)", color: "" }
            : {}),
        }}
      />
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field is Required
        </p>
      )}
      {textValidation && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Your input is too long. Please reduce to 256 characters or fewer.
        </p>
      )}
    </>
  );
}

export default CustomTextArea;
