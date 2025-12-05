import { ILabelStyles, Label } from "@fluentui/react";
import { TextField } from "office-ui-fabric-react";
import * as React from "react";
import ToolTipTable from "../Screens/ScreenComponent/ToolTipTable";
import ToolTipButton from "./Tooltip";

interface fieldItems {
  label?: string;
  value: string | any;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
  mandatory?: boolean;
  readOnly?: boolean;
  placeHolder?: string;
  TooltipTitle?: string;
  Tooltipheader?: any;
  TooltipData?: any;
  WarningMsg?: string;
  canRevealPassword?: boolean;
}
const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomInput({
  label,
  value,
  onChange,
  error,
  disabled,
  maxLength,
  readOnly = false,
  mandatory = false,
  placeHolder,
  TooltipTitle,
  Tooltipheader,
  TooltipData,
  WarningMsg,
  canRevealPassword,
}: fieldItems) {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Label styles={labelStyles}>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </Label>
        {TooltipTitle && (
          <span style={{ marginTop: "3%" }}>
            <ToolTipTable
              Title={TooltipTitle ?? ""}
              headers={Tooltipheader}
              data={TooltipData}
            />
          </span>
        )}
        {WarningMsg && (
          <span style={{ marginTop: "3%" }}>
            <ToolTipButton ApproverData={WarningMsg} />
          </span>
        )}
      </div>

      <TextField
        type={canRevealPassword ? "password" : ""}
        value={value}
        placeholder={placeHolder ? placeHolder : label}
        styles={{
          fieldGroup: {
            height: 42,
            borderRadius: "4px",
            boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
            borderColor: "rgb(15, 15, 15)",
            ...(disabled && {
              border: "1px soild rgb(210 200 200)",
            }),
          },
          field: {
            ...(disabled && {
              color: "rgb(85, 82, 79)",
              "::placeholder": {
                color: "rgba(85, 82, 79, 0.7)",
              },
            }),
          },
        }}
        readOnly={readOnly}
        required={false}
        disabled={disabled}
        onChange={
          onChange ? (event, value) => onChange(value || "") : undefined
        }
        maxLength={maxLength}
        canRevealPassword={canRevealPassword}
      />
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
          Field is Required
        </p>
      )}
    </>
  );
}

export default CustomInput;
