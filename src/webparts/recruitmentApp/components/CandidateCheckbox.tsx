import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface CheckboxProps {
  label?: string;
  onChange?: (checked: boolean) => void;
  error?: boolean;
  checked: boolean;
  disabled?: boolean;
  indeterminate?: boolean; // <-- Add indeterminate property
}

export default class CandidateCheckbox extends React.Component<CheckboxProps> {
  private checkboxRef = React.createRef<HTMLInputElement>();

  componentDidUpdate() {
    if (this.checkboxRef.current) {
      this.checkboxRef.current.indeterminate = !!this.props.indeterminate;
    }
  }

  render() {
    const { label, onChange, error, checked, disabled } = this.props;

    return (
      <>
        <FormControlLabel
          control={
            <Checkbox
              inputRef={this.checkboxRef} // <-- Attach ref for indeterminate state
              checked={checked}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
        {error && (
          <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
            Field is Required
          </p>
        )}
      </>
    );
  }
}