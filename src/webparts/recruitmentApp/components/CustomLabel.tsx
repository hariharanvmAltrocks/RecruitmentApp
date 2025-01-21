import { ILabelStyles, Label } from "@fluentui/react";
import * as React from "react";

interface fieldItems {
    value: string | any;
    mandatory?: boolean;
    style?: React.CSSProperties;
}
const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomLabel({
    value,
    mandatory = false,
    style
}: fieldItems) {
    return (
        <>
            <Label styles={labelStyles} style={style}>
                {value}
                {mandatory && <span style={{ color: "red" }}> *</span>}
            </Label>
        </>
    );
}

export default CustomLabel;
