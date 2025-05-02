import * as React from "react";
import {
  Label,
  IDropdownOption,
  Dropdown,
  IDropdownStyles,
} from "@fluentui/react";

const labelStyles = { root: { marginTop: 10, overflowWrap: "inherit" } };

interface CustomTimePickerProps {
  label: string;
  selectedTime: string; // Format: "HH:MM AM/PM"
  onChange: (time: string) => void;
  disabled?: boolean;
  error?: boolean;
  mandatory?: boolean;
}

const hourOptions: IDropdownOption[] = Array.from({ length: 12 }, (_, i) => ({
  key: (i + 1).toString().padStart(2, "0"),
  text: (i + 1).toString().padStart(2, "0"),
}));

const minuteValues = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

const minuteOptions: IDropdownOption[] = minuteValues.map((m) => ({
  key: m,
  text: m,
}));

const amPmOptions: IDropdownOption[] = ["AM", "PM"].map((p) => ({
  key: p,
  text: p,
}));

const dropdownStyles: Partial<IDropdownStyles> = {
  root: {
    borderRadius: "4px",
    boxShadow: "0px 0px 4px 4px rgba(0,0,0,.05)",
    marginRight: "8px",
    width: "80px",
  },
  dropdown: { borderColor: "rgb(205, 45, 45)" },
  title: { height: "42px", lineHeight: "42px" },
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  selectedTime,
  onChange,
  disabled,
  error,
  mandatory = false,
}) => {
  const [hour, setHour] = React.useState<string>("");
  const [minute, setMinute] = React.useState<string>("");
  const [period, setPeriod] = React.useState<string>("AM");

  React.useEffect(() => {
    if (selectedTime) {
      const [time, amPm] = selectedTime.split(" ");
      const [h, m] = time.split(":");
      setHour(h);
      setMinute(m);
      setPeriod(amPm);
    }
  }, [selectedTime]);

  const updateTime = (h: string, m: string, p: string) => {
    if (h && m && p) {
      onChange(`${h}:${m} ${p}`);
    }
  };

  return (
    <div style={{ marginBottom: "10px", width: "100%", maxWidth: "300px" }}>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <div style={{ display: "flex" }}>
        <Dropdown
          placeholder="HH"
          options={hourOptions}
          selectedKey={hour}
          styles={dropdownStyles}
          onChange={(_, option) => {
            setHour(option?.key as string);
            updateTime(option?.key as string, minute, period);
          }}
          disabled={disabled}
        />
        <Dropdown
          placeholder="MM"
          options={minuteOptions}
          selectedKey={minute}
          styles={dropdownStyles}
          onChange={(_, option) => {
            setMinute(option?.key as string);
            updateTime(hour, option?.key as string, period);
          }}
          disabled={disabled}
        />
        <Dropdown
          placeholder="AM/PM"
          options={amPmOptions}
          selectedKey={period}
          styles={dropdownStyles}
          onChange={(_, option) => {
            setPeriod(option?.key as string);
            updateTime(hour, minute, option?.key as string);
          }}
          disabled={disabled}
        />
      </div>
      {error && (
        <p style={{ color: "red", fontSize: 12, marginTop: 5 }}>
          Field is Required
        </p>
      )}
    </div>
  );
};

export default CustomTimePicker;
