import * as React from "react";
import Labelheader from "./LabelHeader";
import CustomDatePicker from "./CustomDatePicker";
import {
  ColorCode,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
} from "../utilities/Config";
import ReuseButton from "./ReuseButton";
import { DataSyncToRecruitmentResponse } from "../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomLabel from "./CustomLabel";
import { getVRRDetails } from "../Services/ServiceExport";
import SPServices from "../Services/SPService/SPServices";
import CustomLoader from "../Services/Loader/CustomLoader";
import { ButtonAction, labelNames } from "../utilities/LabelName";
import { toDate } from "./TabMerge";
import CustomAlert from "./CustomAlert/CustomAlert";
import { alertPropsData } from "../Models/Screens";

interface DateExtensionProps {
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
}: DateExtensionProps) => {
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

  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const calculateValidTo = (
    startDate: Date | undefined,
    daysToAdd: number,
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
        StartDate: toDate(RecuritmentData?.JobPostingStartDate),
        EndDate: toDate(RecuritmentData?.JobPostingEndDate),
      }));

      const SecondEndDate = RecuritmentData?.JobPostingEndDate
        ? calculateValidTo(toDate(RecuritmentData?.JobPostingEndDate), 14)
        : undefined;

      setLevel2Date((prevState) => ({
        ...prevState,
        StartDate: toDate(RecuritmentData?.JobPostingStartDate),
        EndDate: SecondEndDate,
      }));

      if (RecuritmentData?.JobPostingFirstExtensionEndDate) {
        setAdvertDuration3(true);

        const ThirdEndDate = calculateValidTo(
          toDate(RecuritmentData.JobPostingFirstExtensionEndDate),
          14,
        );

        setLevel3Date((prevState) => ({
          ...prevState,
          StartDate: toDate(RecuritmentData?.JobPostingStartDate),
          EndDate: ThirdEndDate,
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
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    ); //`${year}-${month}-${day}`;
    return dateOnly.toISOString();
  };

  async function DataExtension() {
    let ConfirmMsg = {
      Message: RecuritmentHRMsg.ConfirmMsg,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
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
            1,
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
            let UpdateList = await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSRecruitmentDptDetails,
              RequestJSON: DateObj,
              ID: RecuritmentData?.ID,
            });
            if (UpdateList) {
              onClose();
              AlertpopupSuccess(HRMSAlertOptions.Success);
            }
          } else {
            onClose();
            AlertpopupSuccess(HRMSAlertOptions.Error);
          }
          setIsLoading(false);
        } else {
          // onClose();
          setAlertPopupOpen(false);
        }
      },
    };

    setAlertPopupOpen(true);
    setalertProps(ConfirmMsg);
    setIsLoading(false);
  }

  return (
    <>
      <CustomLoader isLoading={false}>
        <React.Fragment>
          <div>
            {/* <div className="ms-Grid-row" style={{ textAlign: "center" }}>
              <LabelHeaderComponents value={"Advertisement Extension"} />
            </div> */}
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
              <div
                style={{
                  height: "30vh",
                  overflowX: "hidden",
                  overflowY: "scroll",
                }}
              >
                <div className="ms-Grid-row" style={{ marginLeft: "9%" }}>
                  <Labelheader
                    value={labelNames.AdvertExten.Firstextensiondate}
                  />
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg4">
                      <CustomDatePicker
                        selectedDate={Level1Date.StartDate}
                        label={labelNames.AdvertExten.StartDate}
                        error={false}
                        minDate={todaydate}
                        disabled={true}
                        onChange={(date) => handleDateChange(date, "ValidFrom")}
                      />
                    </div>
                    <div className="ms-Grid-col ms-lg4">
                      <CustomDatePicker
                        selectedDate={Level1Date.EndDate}
                        label={labelNames.AdvertExten.EndDate}
                        error={false}
                        disabled={true}
                        mandatory={false}
                        onChange={(date) => handleDateChange(date, "ValidTo")}
                      />
                    </div>
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ marginLeft: "9%" }}>
                  <Labelheader
                    value={labelNames.AdvertExten.Secondextensiondate}
                  />
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg4">
                      <CustomDatePicker
                        selectedDate={Level1Date.StartDate}
                        label={labelNames.AdvertExten.StartDate}
                        error={false}
                        minDate={todaydate}
                        disabled={true}
                        onChange={(date) => handleDateChange(date, "ValidFrom")}
                      />
                    </div>
                    <div className="ms-Grid-col ms-lg4">
                      <CustomDatePicker
                        selectedDate={Level2Date.EndDate}
                        label={labelNames.AdvertExten.EndDate}
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
                      <Labelheader
                        value={labelNames.AdvertExten.Thirdextensiondate}
                      />
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomDatePicker
                            selectedDate={Level1Date.StartDate}
                            label={labelNames.AdvertExten.StartDate}
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
                            label={labelNames.AdvertExten.EndDate}
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

      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
    </>
  );
};
