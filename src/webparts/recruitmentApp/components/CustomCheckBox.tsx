import { Checkbox, ICheckboxStyles } from "@fluentui/react";
import * as React from "react";

interface viewProps {
    value?: boolean;
    onChange?: (key: string, value?: boolean, index?: number) => void;
    error?: boolean;
    disabled?: boolean;
    placeHolder?: string;
    label: string;
    mandatory?: boolean;
    fieldKey?: string;
}
const checkBoxStyles: ICheckboxStyles = {
    root: {
        ".ms-Checkbox-checkbox": {
            height: "20px !important",
            width: "20px !important",
            border: "2px solid ",
            // background: "#ef3340",
        },
        ":hover .ms-Checkbox-checkbox": {
            border: "2px solid  !important",
        },
        ":hover .ms-Checkbox-checkmark": {
            // color: "#ef3340",
        },
    },
};

function CustomCheckBox({
    value = false,
    label,
    disabled,
    fieldKey = "",
    error = false,
    mandatory = false,
    onChange,
}: viewProps) {
    return (
        <div>
            <Checkbox
                disabled={disabled}
                checked={value}
                onChange={
                    onChange ? (e, value) => onChange(fieldKey, value) : undefined
                }
                label={label}
                styles={checkBoxStyles}
            />
            {error && (
                <span style={{ color: "red", marginTop: "" }}>field is required</span>
            )}
        </div>
    );
}

export default CustomCheckBox;
