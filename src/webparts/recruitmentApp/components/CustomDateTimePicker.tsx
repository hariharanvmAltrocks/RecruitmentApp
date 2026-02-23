import * as React from "react";
import {
  DatePicker,
  Dropdown,
  IDropdownOption,
  mergeStyleSets,
  FontWeights,
  // IDatePickerStyles,
  // IDropdownStyles,
  DayOfWeek,
} from "@fluentui/react";

export const teamsStyles = mergeStyleSets({
  cardContainer: {
    backgroundColor: "rgb(242 242 242)",
    border: "1px solid #edebe9",
    borderRadius: "4px",
    padding: "16px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    borderBottom: "2px solid #6264a7",
    paddingBottom: "8px",
  },
  headerTitle: { fontSize: "16px", fontWeight: FontWeights.semibold },
  sectionRow: {
    display: "flex",
    padding: "12px 0",
    borderBottom: "1px solid #f3f2f1",
    selectors: { "&:last-child": { borderBottom: "none" } },
  },
  iconColumn: {
    width: "40px",
    color: "#605e5c",
    fontSize: "18px",
    textAlign: "center",
    paddingTop: "18px",
  },
  contentColumn: { flex: 1 },
  dateTimeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  fieldLabel: {
    fontSize: "12px",
    color: "#605e5c",
    fontWeight: FontWeights.semibold,
    marginBottom: "4px",
  },
});

const generateTimeOptions = (
  startHour: number,
  endHour: number,
): IDropdownOption[] => {
  const options: IDropdownOption[] = [];

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h % 12 || 12;
      const ampm = h >= 12 ? "PM" : "AM";

      options.push({
        key: `${h}:${m}`,
        text: `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`,
      });
    }
  }

  return options;
};

const timeOptions = generateTimeOptions(9, 18);

const CommonDateTimeRangePicker: React.FC<any> = ({
  start,
  end,
  disabled,
  minDate,
  maxDate,
  onChange,
  mandatory,
  error,
}) => {
  const safeStart = start ? new Date(start) : new Date();
  const safeEnd = end
    ? new Date(end)
    : new Date(new Date().getTime() + 60 * 60000);

  const startKey = `${safeStart.getHours()}:${safeStart.getMinutes()}`;
  const endKey = `${safeEnd.getHours()}:${safeEnd.getMinutes()}`;

  const handleDateChange = (date?: Date | null) => {
    if (!date) return;
    const newStart = new Date(date);
    newStart.setHours(safeStart.getHours(), safeStart.getMinutes());

    const newEnd = new Date(date);
    newEnd.setHours(safeEnd.getHours(), safeEnd.getMinutes());

    onChange(newStart, newEnd);
  };

  const handleTimeChange = (
    type: "start" | "end",
    option?: IDropdownOption,
  ) => {
    if (!option) return;
    const [h, m] = (option.key as string).split(":").map(Number);

    if (type === "start") {
      const newStart = new Date(safeStart);
      newStart.setHours(h, m, 0, 0);
      const newEnd = new Date(newStart.getTime() + 60 * 60000);
      onChange(newStart, newEnd);
    } else {
      const newEnd = new Date(safeEnd);
      newEnd.setHours(h, m, 0, 0);
      onChange(safeStart, newEnd);
    }
  };

  // const isMidnight = (date?: Date) =>
  //   !!date && date.getHours() === 0 && date.getMinutes() === 0;

  // const WORK_START = 9;
  // const WORK_END = 18;

  // const isOutsideWorkingHours = (date?: Date) =>
  //   !!date && (date.getHours() < WORK_START || date.getHours() >= WORK_END);

  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

  const startDate = new Date(start);
  const endDate = new Date(end);

  const isLessThan30Minutes =
    isValidDate(startDate) &&
    isValidDate(endDate) &&
    endDate.getTime() - startDate.getTime() < 30 * 60 * 1000;

  const isInvalidRange =
    isValidDate(startDate) &&
    isValidDate(endDate) &&
    endDate.getTime() <= startDate.getTime();

  return (
    <div className={teamsStyles.dateTimeContainer}>
      <div style={{ minWidth: "150px" }}>
        <div className={teamsStyles.fieldLabel}>
          Date {mandatory && <span style={{ color: "red" }}> *</span>}
        </div>
        <DatePicker
          value={start}
          onSelectDate={handleDateChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          firstDayOfWeek={DayOfWeek.Monday}
          placeholder="Select Date"
          formatDate={(d) =>
            d ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` : ""
          }
        />
        {error && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            Field is Required
          </p>
        )}
      </div>
      <div>
        <div className={teamsStyles.fieldLabel}>
          Time Range {mandatory && <span style={{ color: "red" }}> *</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Dropdown
            options={timeOptions}
            selectedKey={start ? startKey : undefined}
            placeholder="Start"
            onChange={(_, o) => handleTimeChange("start", o)}
            styles={{
              root: { width: 110 },
              dropdownItemsWrapper: {
                maxHeight: 185,
              },
            }}
            disabled={disabled}
          />
          <span style={{ color: "#605e5c" }}>-</span>
          <Dropdown
            options={timeOptions}
            selectedKey={end ? endKey : undefined}
            placeholder="End"
            onChange={(_, o) => handleTimeChange("end", o)}
            styles={{
              root: { width: 110 },
              dropdownItemsWrapper: {
                maxHeight: 185,
              },
            }}
            disabled={disabled}
          />
        </div>
        {/* {isMidnightError && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            Start and End time cannot be 12:00 AM.
          </p>
        )} */}

        {isInvalidRange && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            End time must be greater than Start time.
          </p>
        )}

        {isLessThan30Minutes && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            Time range must be at least 30 minutes.
          </p>
        )}

        {/* {isWorkingHoursError && (
          <p
            style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}
          >
            Please select time within working hours (9:00 AM – 6:00 PM).
          </p>
        )} */}
      </div>
    </div>
  );
};
export default CommonDateTimeRangePicker;
