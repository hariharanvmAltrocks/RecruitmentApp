import * as React from "react";
import {
    Dropdown,
    IDropdownOption,
    IDropdownStyles,
} from "@fluentui/react/lib/Dropdown";

type viewProps = {
    label: string;
    fieldKey: string;
    data: IDropdownOption<any>[];
    value?: IDropdownOption | IDropdownOption[];
    onChange?: (key: string, item?: any) => void;
    error?: boolean;
    disabled?: boolean;
    mandatory?: boolean;
    placeholder: string;
    multiSelect?: boolean;
};

const DropdownStyles: Partial<IDropdownStyles> = {
    root: {
        ".ms-Dropdown-container": {
            width: "100%",
        },
        ".ms-Dropdown-title": {
            color: "#323130 !important",
            border: "2px solid #E2E8F0 !important",
            height: "40px",
            paddingTop: "2px !important",
            fontSize: "16px !important",
        },
        ".ms-Dropdown-label": {
            color: "#212B36 !important",
        },
        ".ms-Dropdown-caretDownWrapper": {
            i: {
                color: " #E2E8F0 !important",
                fontSize: "25px",
                fontWeight: "900",
                marginTop: "4px",
            },
        },
    },
    dropdown: {
        ":focus::after": {
            border: "1px solid #ef3340",
            borderRadius: "5px",
        },
    },
    callout: {
        maxHeight: "300px !important",
    },
};

function CustomDropdown({
    value = [],
    label,
    error,
    disabled,
    mandatory,
    placeholder,
    fieldKey,
    data,
    onChange,
    multiSelect = false,
}: viewProps) {
    return (
        <>
            <Dropdown
                label={label}
                selectedKey={!multiSelect ? (value as IDropdownOption)?.key : undefined}
                selectedKeys={
                    multiSelect
                        ? ((value as IDropdownOption[]).map((item) => item.key) as
                            | string[]
                            | number[])
                        : undefined
                }
                onChange={
                    onChange
                        ? (e, item) => {
                            if (multiSelect) {
                                const currentValue = value as IDropdownOption[];
                                const newValues = item?.selected
                                    ? [...currentValue, item]
                                    : currentValue.filter((option) => option.key !== item?.key);
                                onChange(fieldKey, newValues);
                            } else {
                                onChange(fieldKey, item);
                            }
                        }
                        : undefined
                }
                placeholder={placeholder}
                options={data}
                disabled={disabled}
                styles={DropdownStyles}
                required={mandatory}
                multiSelect={multiSelect}
            />
            {error && <span style={{ color: "red" }}>field is required</span>}

        </>
    );
}

export default CustomDropdown;
