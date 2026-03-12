import * as React from "react";
import { Icon } from "@fluentui/react";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CommonDateTimeRangePicker, {
  teamsStyles,
} from "../../components/CustomDateTimePicker";
import { Notes } from "../../utilities/Config";

export const InterviewScheduleCard: React.FC<any> = (props) => {
  return (
    <div className={teamsStyles.cardContainer}>
      <div className={teamsStyles.headerRow}>
        <div className={teamsStyles.headerTitle}>{props.label}</div>
      </div>

      <div className={teamsStyles.sectionRow}>
        <div className={teamsStyles.iconColumn}>
          <Icon iconName="People" />
        </div>
        <div className={teamsStyles.contentColumn}>
          <CustomMultiSelect
            label="Interview Panel Members"
            value={props.panelValue}
            options={props.panelOptions}
            onChange={props.onPanelChange}
            disabled={props.PanelDisabled}
            error={props.panelError}
            mandatory={!props.PanelDisabled}
          />
            {props.panelValue.length < 3 && (
          <p style={{ marginTop: 5, color: "red", fontSize: 12, marginLeft: 0 }}>
            Please select at least 3 panel members
          </p>
        )}
        </div>
      </div>

      {props.CurrentNotes && (
        <div
          style={{
            margin: "0%",
            marginTop: "1%",
            marginBottom: "-1%",
          }}
        >
          <p>
            <span
              style={{
                color: "red",
                marginTop: 8,
                display: "block",
                fontFamily: "sans-serif",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Note:- {Notes.PanelConfirm}
            </span>
          </p>
        </div>
      )}

      <div className={teamsStyles.sectionRow}>
        <div className={teamsStyles.iconColumn}>
          <Icon iconName="Clock" />
        </div>
        <div className={teamsStyles.contentColumn}>
          <CommonDateTimeRangePicker
            start={props.start}
            end={props.end}
            onChange={props.onDateChange}
            disabled={props.DateDisable}
            minDate={props.minDate}
            maxDate={props.maxDate}
            error={props.DateValidationError}
            mandatory={!props.DateDisable}
          />
        </div>
      </div>
    </div>
  );
};
