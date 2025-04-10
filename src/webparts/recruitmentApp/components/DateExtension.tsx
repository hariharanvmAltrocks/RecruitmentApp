import * as React from "react";
import Labelheader from "./LabelHeader";
import CustomDatePicker from "./CustomDatePicker";
import { getVRRDetails } from "../Services/ServiceExport";
import { ColorCode, ListNames } from "../utilities/Config";
import ReuseButton from "./ReuseButton";

interface AssignPositionDialogProps {
  JobTitle: string;
  RecuritmentID: number;
  onClose: () => void;
}
export type DateState = {
  StartDate: Date | undefined;
  EndDate: Date | undefined;
};
export const DateExtension = ({
  JobTitle,
  RecuritmentID,
  onClose,
}: AssignPositionDialogProps) => {
  const todaydate = new Date();
  const [Level1Date, setLevel1Date] = React.useState<DateState>({
    StartDate: undefined,
    EndDate: undefined,
  });
  const [Level2Date, setLevel2Date] = React.useState<DateState>({
    StartDate: undefined,
    EndDate: undefined,
  });
  const [Level3Date, setLevel3Date] = React.useState<DateState>({
    StartDate: undefined,
    EndDate: undefined,
  });

  React.useEffect(() => {
    const initialize = async () => {
      let filterConditions = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: RecuritmentID,
        },
      ];
      await getVRRDetails
        .GetDataInList(
          ListNames.HRMSRecruitmentRoleProfileDetails,
          filterConditions,
          "",
          "*,RecruitmentID/ID,JobDescription,RoleProfile,TotalPreferredExperience/ExperienceInYearRange,PreferredExperience/ExperienceInYearRange,FunctionType/Code",
          "RecruitmentID,PreferredExperience,TotalPreferredExperience,FunctionType"
        )
        .then(async (res) => {
          const data = res.data[0];
          setLevel1Date((prevState) => ({
            ...prevState,
            StartDate: data.ValidFrom,
            EndDate: data.ValidTo,
          }));
          setLevel3Date((prevState) => ({
            ...prevState,
            StartDate: data.ValidFrom,
            EndDate: data.ValidTo,
          }));
        });
    };

    void initialize();
  }, []);

  const calculateValidTo = (startDate: Date, daysToAdd: number): Date => {
    let validToDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      validToDate.setDate(validToDate.getDate() + 1);

      if (validToDate.getDay() === 0) {
        continue;
      }

      addedDays++;
    }

    if (validToDate.getDay() === 0) {
      validToDate.setDate(validToDate.getDate() + 1);
    }

    return validToDate;
  };
  const handleDateChange = (value: Date | null, stateKey: string) => {
    setLevel2Date((prevState) => {
      const updatedState = { ...prevState, [stateKey]: value };

      if (stateKey === "ValidFrom" && value) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const newValidTo = calculateValidTo(value, 13);
        updatedState.EndDate = newValidTo;
      }

      return updatedState;
    });

    // setValidationError((prevState) => ({
    //   ...prevState,
    //   [stateKey]: false,
    // }));
  };

  return (
    <>
      <div style={{ marginLeft: "4%" }}>
        <div
          className="ms-Grid-row"
          style={{ display: "flex", marginTop: "8px" }}
        >
          <div className="ms-Grid-col ms-lg4">
            <Labelheader value={"Job Title"} />
          </div>
          <div className="ms-Grid-col ms-lg1" style={{ textAlign: "center" }}>
            <span>-</span>
          </div>
          <div className="ms-Grid-col ms-lg4">{JobTitle}</div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <Labelheader value={"Advert Duration -1"} />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level1Date.StartDate}
              label="Start Date"
              error={false}
              minDate={todaydate}
              mandatory={true}
              disabled={false}
              onChange={(date) => handleDateChange(date, "ValidFrom")}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level1Date.EndDate}
              label="End Date"
              error={false}
              disabled={true}
              mandatory={false}
              onChange={(date) => handleDateChange(date, "ValidTo")}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <Labelheader value={"Advert Duration -2"} />
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level2Date.StartDate}
              label="Start Date"
              error={false}
              minDate={todaydate}
              mandatory={true}
              onChange={(date) => handleDateChange(date, "ValidFrom")}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level2Date.EndDate}
              label="End Date"
              error={false}
              disabled={true}
              mandatory={false}
              onChange={(date) => handleDateChange(date, "ValidTo")}
            />
          </div>
        </div>
        <div className="ms-Grid-row">
          <Labelheader value={"Advert Duration -3"} />
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level3Date.StartDate}
              label="Start Date"
              error={false}
              minDate={todaydate}
              mandatory={true}
              onChange={(date) => handleDateChange(date, "ValidFrom")}
            />
          </div>
          <div className="ms-Grid-col ms-lg4">
            <CustomDatePicker
              selectedDate={Level3Date.EndDate}
              label="End Date"
              error={false}
              disabled={true}
              mandatory={false}
              onChange={(date) => handleDateChange(date, "ValidTo")}
            />
          </div>
        </div>
        <div
          className="ms-Grid-row"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px 0",
            gap: "33px",
          }}
        >
          <ReuseButton
            label="Cancel"
            onClick={() => onClose()}
            Style={{
              backgroundColor:ColorCode.ButtonColorCode.ButtonColor,
              color: "white",
              width: "50%",
            }}
          />

          <ReuseButton
            label="Assign"
            onClick={async () => {
              //   await AssignHRSubmit();
            }}
            Style={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              color: "white",
              width: "50%",
            }}
          />
        </div>
      </div>
    </>
  );
};
