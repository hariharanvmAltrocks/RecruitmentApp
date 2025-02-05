import { ILabelStyles, Label } from "@fluentui/react";
import { Rating } from "@mui/material";
import * as React from "react";
import "../App.css";

interface FormFields {
    label?: string;
    value: number;
    error?: boolean;
    onChange?: (value: number) => void;
    mandatory?: boolean;
    disabled?: boolean;
}

const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomRatingStar({
    label,
    value,
    error,
    onChange,
    mandatory = false,
    disabled = false
}: FormFields) {
    return (
        <>
            <Label styles={label ? labelStyles : undefined}>
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
            <Rating
                value={value}
                onChange={onChange ? (event, newValue) => onChange(newValue || 0) : undefined}
                disabled={disabled}
                precision={1}
                size="large"
                style={{
                    color: "#e65f2b",
                }}
                sx={{
                    "& .MuiRating-icon": {
                        marginRight: "32px", // Space between stars
                    },
                }}
            />
            {error && (
                <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
                    Field Is Required
                </p>
            )}
        </>
    );
}

export default CustomRatingStar;
