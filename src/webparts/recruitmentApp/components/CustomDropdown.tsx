import { ILabelStyles, Label } from "@fluentui/react";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import * as React from "react";

interface FormFields {
    keyIndex: number | any;
    label: string;
    options: IDropdownOption<any>[];
    keyValue: string;
    onChange: (
        keyIndex: number | any,
        item?: IDropdownOption<any> | undefined,
        keyValue?: string
    ) => void;
    error: boolean;
    disabled: boolean;
    mandatory?: boolean;
}

const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
};

function CustomDropdown({
    label,
    keyIndex,
    options,
    keyValue,
    error,
    disabled,
    onChange,
    mandatory = false,
}: FormFields) {
    return (
        <>
            <div key={keyIndex}>
                <Label styles={labelStyles}>
                    {label}
                    {mandatory && <span style={{ color: "red" }}> *</span>}
                </Label>
                <Dropdown
                    placeholder="Select"
                    selectedKey={keyIndex}
                    options={options}
                    styles={{
                        dropdown: {
                            borderRadius: "4px",
                            boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                        },
                        title: {
                            height: 42,
                        },
                    }}
                    onChange={(e, item) => onChange(keyIndex, item, keyValue)}
                    disabled={disabled}
                />
                {error && (
                    <p
                        style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
                    >
                        Field Is Required
                    </p>
                )}
            </div>
        </>
    );
}

export default CustomDropdown;
