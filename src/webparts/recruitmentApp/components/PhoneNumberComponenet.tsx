import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import { Label } from "@fluentui/react";
import { AutoCompleteItem } from "../Models/Screens";
import CustomAutoComplete from "./CustomAutoComplete";
// Ensure AutoCompleteItem has a 'code' property if you want to use it below

interface PhoneNumberComponentProps {
  label?: string;
  countries: AutoCompleteItem[];
  value: number;
  countryKey: string | number;
  onChange: (countryKey: string | number, phone: string) => void;
  error?: boolean;
  disabled?: boolean;
  mandatory?: boolean;
}

const labelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

const PhoneNumberComponent: React.FC<PhoneNumberComponentProps> = ({
  label,
  countries,
  value,
  countryKey,
  onChange,
  error,
  disabled,
  mandatory,
}) => {
  const selectedCountry = countries.find((c) => c.key === countryKey);

  return (
    <div>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <div style={{ display: "flex", gap: 8 }}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg5" style={{ marginTop: "-7%" }}>
            <CustomAutoComplete
              value={selectedCountry || null}
              options={countries}
              placeholder="Country"
              disabled={!!disabled}
              onChange={(option) => {
                if (option) {
                  onChange(option.key, value.toString()); // Update country
                }
              }}
              label={""}
            />
          </div>
          <div className="ms-Grid-col ms-lg7">
            <TextField
              value={value.toString()}
              placeholder={
                selectedCountry && "code" in selectedCountry
                  ? `e.g. ${(selectedCountry as any).code} 123456789`
                  : "Phone number"
              }
              onChange={(
                _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string
              ) => {
                onChange(countryKey, newValue || ""); // Update phone number
              }}
              disabled={disabled}
              styles={{
                fieldGroup: {
                  height: 42,
                  borderRadius: 4,
                  boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                  borderColor: "rgb(15, 15, 15)",
                },
              }}
            />
          </div>
        </div>
      </div>
      {error && (
        <p style={{ marginTop: 5, color: "red", fontSize: 12 }}>
          Field is Required
        </p>
      )}
    </div>
  );
};

export default PhoneNumberComponent;
