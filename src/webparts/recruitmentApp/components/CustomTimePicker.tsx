import * as React from "react";
import { Label } from "@fluentui/react";

const labelStyles = {
  root: { marginTop: 10, overflowWrap: "inherit" },
};

interface TimePickerProps {
  label: string;
  selectedTime: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  error?: boolean;
  mandatory?: boolean;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({
  label,
  selectedTime,
  onChange,
  disabled,
  error,
  mandatory = false,
}) => {
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const formattedTime = `${hour}:${min.toString().padStart(2, "0")} AM`;
        times.push(formattedTime);
      }
    }
    for (let hour = 1; hour <= 12; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const formattedTime = `${hour}:${min.toString().padStart(2, "0")} PM`;
        times.push(formattedTime);
      }
    }
    return times;
  };

  return (
    <div style={{ marginBottom: "10px", width: "100%", maxWidth: "300px" }}>
      <Label styles={labelStyles}>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </Label>
      <select
        value={selectedTime}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        // style={{
        //   width: "100%",
        //   padding: "8px",
        //   borderRadius: "4px",
        //   border: "1px solid #ccc",
        //   fontSize: "16px",
        //   height: "43px",
        //   borderColor: "black",
        // }}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
          height: "43px",
          borderColor: "black",
          boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
          ...(disabled && {
            border: "1px solid rgb(210, 200, 200)",
            color: "rgb(85, 82, 79)",
            backgroundColor: "#f4f4f4",
          }),
        }}
      >
        <option value="">Select Time</option>
        {generateTimeOptions().map((time, index) => (
          <option key={index} value={time}>
            {time}
          </option>
        ))}
      </select>

      {error && (
        <p style={{ color: "red", fontSize: 12, marginTop: 5 }}>
          Field is Required
        </p>
      )}
    </div>
  );
};

export default CustomTimePicker;
