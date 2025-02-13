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

const datePickerStyle: Partial<IDatePickerStyles> = {
    root: {
        borderRadius: "4px",
        boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
        borderColor: "rgb(205, 45, 45)",
        color: "rgb(205, 45, 45)",

        ".ms-TextField-fieldGroup": {
            height: "42px",
        },
        ".icon-153": {
            padding: "9px 9px 9px",
        },
    },
    textField: {
        borderColor: "rgb(205, 45, 45)",
        height: "42px",
    },
};

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
                    className="label-color ms-TextField-field"
                    allowTextInput
                    placeholder="Select a date"
                    styles={datePickerStyle}
                    onSelectDate={onChange}
                    formatDate={(date) => moment(date).format("DD/MM/YYYY")}
                    minDate={minDate}
                    disabled={disabled}
                    maxDate={maxDate}
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
