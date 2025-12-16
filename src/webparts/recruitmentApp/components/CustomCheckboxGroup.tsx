import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { ILabelStyles, Label } from "@fluentui/react";

export type CheckboxGroupOption = {
  id: string | number;
  key: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
};

const labelStyles: ILabelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

export interface CheckboxGroupProps {
  label: string;
  name?: string;
  options: CheckboxGroupOption[];
  value?: CheckboxGroupOption[];
  defaultValue?: Array<string | number>;
  onChange?: (selected: CheckboxGroupOption[] | null) => void;

  multiple?: boolean;
  className?: string;
  mandatory?: boolean;
  error?: boolean;
}

export default function CheckboxGroup({
  label,
  name = "checkbox-group",
  options,
  value,
  defaultValue = [],
  onChange,
  multiple = true,
  className = "",
  mandatory = false,
  error = false,
}: CheckboxGroupProps) {
  const isControlled = value !== undefined;

  const [selected, setSelected] = React.useState<Array<string | number>>(
    isControlled ? normalizeValueToIds(value) : defaultValue
  );

  React.useEffect(() => {
    if (isControlled) {
      setSelected(normalizeValueToIds(value));
    }
  }, [value, isControlled]);

  function normalizeValueToIds(
    val?: CheckboxGroupOption | CheckboxGroupOption[]
  ): Array<string | number> {
    if (!val) return [];
    return Array.isArray(val) ? val.map((v) => v.id) : [val.id];
  }

  function toggleOption(id: string | number) {
    if (!multiple) {
      const newSel = selected[0] === id ? [] : [id];
      doUpdate(newSel);
      return;
    }

    const exists = selected.includes(id);
    const newSel = exists
      ? selected.filter((s) => s !== id)
      : [...selected, id];

    doUpdate(newSel);
  }

  function doUpdate(newSel: Array<string | number>) {
    if (!isControlled) setSelected(newSel);

    const selectedOptions = options.map((opt) => ({
      ...opt,
      checked: newSel.includes(opt.id), // ✅ assign checked
    }));

    onChange?.(selectedOptions.filter((opt) => opt.checked));
  }

  return (
    <>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>

      <FormGroup className={className} aria-label={name}>
        {options.map((opt) => {
          const checked = selected.includes(opt.id);

          return (
            <FormControlLabel
              key={opt.id}
              control={
                <Checkbox
                  checked={checked}
                  disabled={opt.disabled}
                  onChange={() => toggleOption(opt.id)}
                />
              }
              label={opt.description}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                },
              }}
            />
          );
        })}
      </FormGroup>

      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12 }}>
          Field is Required
        </p>
      )}
    </>
  );
}
