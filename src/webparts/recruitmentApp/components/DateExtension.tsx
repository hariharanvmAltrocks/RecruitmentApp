import * as React from "react";
import Labelheader from "./LabelHeader";
import CustomDatePicker from "./CustomDatePicker";
import {
  ColorCode,
  HRMSAlertOptions,
  labelName,
  ListNames,
  ResponeStatus,
} from "../utilities/Config";
import ReuseButton from "./ReuseButton";
import { DataSyncToRecruitmentResponse } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomLabel from "./CustomLabel";
import { getVRRDetails } from "../Services/ServiceExport";
import SPServices from "../Services/SPService/SPServices";
import CustomLoader from "../Services/Loader/CustomLoader";
import LabelHeaderComponents from "./TitleHeader";
import { ButtonAction } from "../utilities/LabelName";

interface AssignPositionDialogProps {
  RecuritmentData: DataSyncToRecruitmentResponse;
  onClose: () => void;
  ModelDropDown: any;
  AlertpopupSuccess: (message: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsLoading,
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
        StartDate: RecuritmentData?.JobPostingStartDate,
        EndDate: SecondEndDate,
      }));
      if (RecuritmentData?.JobPostingFirstExtensionEndDate) {
        setAdvertDuration3(true);
        let ThiredEndDate: Date = calculateValidTo(
          RecuritmentData?.JobPostingFirstExtensionEndDate,
          14
        );
        setLevel3Date((prevState) => ({
          ...prevState,
          StartDate: RecuritmentData?.JobPostingStartDate,
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

  const SpiltDateOnly = (date: Date) => {
    const updatedDate = date;
    const year = updatedDate?.getFullYear();
    const month = String(updatedDate?.getMonth() + 1).padStart(2, "0");
    const day = String(updatedDate?.getDate()).padStart(2, "0");

    const dateOnly = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day))
    ); //`${year}-${month}-${day}`;
    return dateOnly.toISOString();
  };

  async function DataExtension() {
    onClose();
    setIsLoading(true);
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
      1,
      1
    );

    if (result?.status === ResponeStatus.SUCCESS) {
      let DateObj;
      if (AdvertDuration3) {
        DateObj = {
          JobPostingSecondExtensionEndDate: Level3Date?.EndDate
            ? SpiltDateOnly(Level3Date.EndDate)
            : undefined,
        };
      } else {
        DateObj = {
          JobPostingFirstExtensionEndDate: Level2Date.EndDate
            ? SpiltDateOnly(Level2Date.EndDate)
            : undefined,
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
    setIsLoading(false);
  }

  return (
    <>
      <CustomLoader isLoading={false}>
        <React.Fragment>
          <div>
            <div className="ms-Grid-row" style={{ textAlign: "center" }}>
              <LabelHeaderComponents value={"Advertisement Extension"} />
            </div>
            <div className="ms-Grid-col ms-lg12">
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
              <div>
                <div className="ms-Grid-row" style={{ marginLeft: "9%" }}>
                  <Labelheader value={labelName.Firstextensiondate} />
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
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ marginLeft: "9%" }}>
                  <Labelheader value={labelName.Secondextensiondate} />
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
                  </div>
                </div>

                {AdvertDuration3 && (
                  <>
                    <div className="ms-Grid-row" style={{ marginLeft: "9%" }}>
                      <Labelheader value={labelName.Thirdextensiondate} />
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomDatePicker
                            selectedDate={Level1Date.StartDate}
                            label="Start Date"
                            error={false}
                            minDate={todaydate}
                            disabled={true}
                            onChange={(date) =>
                              handleDateChange(date, "ValidFrom")
                            }
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                          <CustomDatePicker
                            selectedDate={Level3Date.EndDate}
                            label="End Date"
                            error={false}
                            disabled={true}
                            mandatory={false}
                            onChange={(date) =>
                              handleDateChange(date, "ValidTo")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                  label={ButtonAction.close}
                  onClick={() => onClose()}
                  Style={{
                    backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                    color: "white",
                    width: "50%",
                  }}
                />
                {RecuritmentData?.JobPostingSecondExtensionEndDate ? (
                  <></>
                ) : (
                  <ReuseButton
                    label={ButtonAction.Submit}
                    onClick={async () => {
                      await DataExtension();
                    }}
                    Style={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      color: "white",
                      width: "50%",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      </CustomLoader>
    </>
  );
};
