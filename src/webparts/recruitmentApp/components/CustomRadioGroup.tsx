import { ILabelStyles, Label } from "@fluentui/react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import * as React from "react";

interface FormFields {
    label?: string;
    value: string;
    options: string[];
    error?: boolean;
    onChange?: (value: string) => void;
    mandatory?: boolean;
    disabled?: boolean;
}

const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomRadioGroup({
    label,
    value,
    options,
    error,
    onChange,
    mandatory = false,
    disabled = false
}: FormFields) {
    return (
        <>
            <Label styles={label !== "" ? labelStyles : undefined}>
                {label}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
            <RadioGroup
                row
                aria-label={label}
                name={label}
                value={value}
                onChange={onChange ? (event, value) => onChange(event.target.value) : undefined}
            >
                <Grid container spacing={2}>
                    {options.map((option, index) => (
                        <Grid item xs={4} key={index}>
                            <FormControlLabel
                                value={option}
                                control={
                                    <Radio
                                        sx={{ "&.Mui-checked": { color: "black" } }}
                                        size="small"
                                        disabled={disabled} // Disable each Radio based on the prop
                                    />
                                }
                                label={option}
                            />
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
            {error && (
                <p
                    style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
                >
                    Field Is Required
                </p>
            )}
        </>
    );
}

export default CustomRadioGroup;
