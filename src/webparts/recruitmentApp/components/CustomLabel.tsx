import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";

interface fieldItems {
    value: string | any;
    mandatory?: boolean;
}
const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomLabel({
    value,
    mandatory = false,
}: fieldItems) {
    return (
        <>
            <Label styles={labelStyles}>
                {value}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
        </>
    );
}

export default CustomLabel;
