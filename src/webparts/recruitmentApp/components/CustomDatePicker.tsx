import { IDatePickerStyles, ILabelStyles, Label } from "@fluentui/react";
import * as moment from "moment";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import * as React from "react";

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

interface FormFields {
  selectedDate: Date | undefined;
  label: string;
  error: boolean;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  mandatory?: boolean;
}

const getDatePickerStyle = (
  disabled?: boolean
): Partial<IDatePickerStyles> => ({
  root: {
    borderRadius: "4px",
    boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
    color: "rgb(0, 0, 0)",

    ".ms-TextField-fieldGroup": {
      height: "42px",
      // border: "1px solid rgb(255 249 249)",
    },
    ".icon-153": {
      padding: "9px 9px 9px",
    },
    fieldGroup: {
      height: 42,
      borderRadius: "4px",
      boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
      border: "rgb(15, 15, 15)",
      ...(disabled && {
        border: "1px solid rgb(210 200 200)",
      }),
    },
    field: {
      ...(disabled && {
        color: "rgb(123 113 102)",
        "::placeholder": {
          color: "rgb(123 113 102)",
        },
      }),
    },
  },
  textField: {
    border: "rgb(4, 4, 4)",
    height: "42px",
  },
});

function CustomDatePicker({
  label,
  selectedDate,
  error,
  onChange,
  minDate,
  maxDate,
  disabled,
  mandatory = false,
}: FormFields) {
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <Label styles={labelStyles}>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </Label>
        <DatePicker
          value={selectedDate ? new Date(selectedDate) : undefined}
          // className="label-color ms-TextField-field"
          allowTextInput
          placeholder="Select a date"
          styles={getDatePickerStyle(disabled)}
          onSelectDate={(date) => onChange && onChange(date || null)}
          formatDate={(date) => moment(date).format("DD/MM/YYYY")}
          minDate={minDate}
          disabled={disabled}
          maxDate={maxDate}
          initialPickerDate={maxDate}
        />
        {error && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            Field is Required
          </p>
        )}
      </div>
    </>
  );
}

export default CustomDatePicker;
