import * as React from "react";
import Labelheader from "./LabelHeader";
import CustomDatePicker from "./CustomDatePicker";
import { ColorCode, HRMSAlertOptions, ListNames } from "../utilities/Config";
import ReuseButton from "./ReuseButton";
import { DataSyncToRecruitmentResponse } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomLabel from "./CustomLabel";
import { getVRRDetails } from "../Services/ServiceExport";
import SPServices from "../Services/SPService/SPServices";
import CustomLoader from "../Services/Loader/CustomLoader";

interface AssignPositionDialogProps {
  RecuritmentData: DataSyncToRecruitmentResponse;
  onClose: () => void;
  ModelDropDown: any;
  AlertpopupSuccess: (message: string) => void;
}
export type DateState = {
  StartDate: Date | undefined;
  EndDate: Date | undefined;
};
export const DateExtension = ({
  RecuritmentData,
  onClose,
  ModelDropDown,
  AlertpopupSuccess,
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
  const [AdvertDuration3, setAdvertDuration3] = React.useState<boolean>(false);

  const calculateValidTo = (
    startDate: Date | undefined,
    daysToAdd: number
  ): Date => {
    let validToDate = new Date(startDate ?? todaydate);
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

  React.useEffect(() => {
    const initialize = async () => {
      setLevel1Date((prevState) => ({
        ...prevState,
        StartDate: RecuritmentData?.JobPostingStartDate,
        EndDate: RecuritmentData?.JobPostingEndDate,
      }));
      let SecondEndDate: Date = calculateValidTo(
        RecuritmentData?.JobPostingEndDate,
        14
      );
      setLevel2Date((prevState) => ({
        ...prevState,
        StartDate: RecuritmentData?.JobPostingEndDate,
        EndDate: SecondEndDate,
      }));
      if (RecuritmentData?.JobPostingFirstExtensionEndDate) {
        setAdvertDuration3(true);
        let ThiredEndDate: Date = calculateValidTo(
          RecuritmentData?.JobPostingSecondExtensionEndDate,
          14
        );
        setLevel3Date((prevState) => ({
          ...prevState,
          StartDate: RecuritmentData?.JobPostingSecondExtensionEndDate,
          EndDate: ThiredEndDate,
        }));
      } else {
        setAdvertDuration3(false);
      }
    };

    void initialize();
  }, []);

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
  };

  async function DataExtension() {
    const filterConditions = [
      {
        FilterKey: "JobCode",
        Operator: "eq",
        FilterValue: RecuritmentData.JobCodeId,
      },
    ];
    const Conditions = "";
    let obj;
    if (AdvertDuration3) {
      obj = {
        ValidTo: Level3Date.EndDate ?? null,
        ValidFrom: Level3Date.StartDate ?? null,
      };
    } else {
      obj = {
        ValidTo: Level2Date.EndDate ?? null,
        ValidFrom: Level2Date.StartDate ?? null,
      };
    }
    const result = await getVRRDetails.UploadAdvertisementInPortal(
      filterConditions,
      Conditions,
      RecuritmentData,
      obj,
      ModelDropDown,
      1
    );

    if (result?.status === 200) {
      let DateObj;
      if (AdvertDuration3) {
        DateObj = {
          JobPostingSecondExtensionEndDate: Level3Date.EndDate,
        };
      } else {
        DateObj = {
          JobPostingFirstExtensionEndDate: Level2Date.EndDate,
        };
      }
      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        RequestJSON: DateObj,
        ID: RecuritmentData?.ID,
      });
      AlertpopupSuccess(HRMSAlertOptions.Success);
    } else {
      AlertpopupSuccess(HRMSAlertOptions.Error);
    }
  }

  return (
    <>
      <CustomLoader isLoading={false}>
        <React.Fragment>
          <div className="ms-Grid-col ms-lg12" style={{ marginLeft: "4%" }}>
            <div
              className="ms-Grid-row"
              style={{ display: "flex", marginTop: "8px" }}
            >
              <div
                className="ms-Grid-col ms-lg12"
                style={{ textAlign: "center" }}
              >
                <CustomLabel
                  value={`JobTitle - ${RecuritmentData?.JobTitleEnglish}`}
                  style={{ fontSize: "17px", fontWeight: "bold" }}
                />
              </div>
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
                  disabled={true}
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
              <div className="ms-Grid-col ms-lg4"></div>
            </div>
            <div className="ms-Grid-row">
              <Labelheader value={"Advert Duration -2"} />
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4">
                <CustomDatePicker
                  selectedDate={Level1Date.StartDate}
                  label="Start Date"
                  error={false}
                  minDate={todaydate}
                  disabled={true}
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
              <div className="ms-Grid-col ms-lg4"></div>
            </div>
            {AdvertDuration3 && (
              <>
                <div className="ms-Grid-row">
                  <Labelheader value={"Advert Duration -3"} />
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomDatePicker
                      selectedDate={Level1Date.StartDate}
                      label="Start Date"
                      error={false}
                      minDate={todaydate}
                      disabled={true}
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
                  <div className="ms-Grid-col ms-lg4"></div>
                </div>
              </>
            )}

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
                label="Close"
                onClick={() => onClose()}
                Style={{
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                  width: "50%",
                }}
              />

              <ReuseButton
                label="Submit"
                onClick={async () => {
                  await DataExtension();
                }}
                Style={{
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                  width: "50%",
                }}
              />
            </div>
          </div>
        </React.Fragment>
      </CustomLoader>
    </>
  );
};
