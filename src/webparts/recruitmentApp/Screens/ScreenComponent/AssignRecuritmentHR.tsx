import * as React from "react";
import JobCodeSelector from "../../components/CustomMultiselectwithswipe";
import { ADGroupID, ColorCode, ListNames, RoleID } from "../../utilities/Config";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import { JobCodeTilte } from "../../Models/RecuritmentVRR";
import ReuseButton from "../../components/ReuseButton";
import CustomTextArea from "../../components/CustomTextArea";
import { AutoCompleteItem } from "../../Models/Screens";
import { CommonServices } from "../../Services/ServiceExport";
import { formValidation } from "../RecuritmentProcess/ApprovedVRRList";

export type AssignHRData = {
  AssignRecruitmentHR: AutoCompleteItem;
  AssignRecruitmentAgencies: AutoCompleteItem[];
  Comments: string;
};
interface AssignPositionDialogProps {
  jobCodes: JobCodeTilte[];
  selectedJobCodes: JobCodeTilte[];
  onSelectAllChange: (value: boolean) => void;
  onRowChange?: (value: boolean, rowIndex: number) => void;
  CurrentRole: number;
  onClose: () => void;
  AssignedHRId: number; //props.stateValue?.AssignedHRId
  validationErrors: formValidation;
  ValueData: AssignHRData;
  handleAutoComplete: (value: AutoCompleteItem | null) => void;
  handleAgencyChange: (value: AutoCompleteItem[] | null) => void;
  handleInputChangeTextArea: (value: string | null) => void;
  AssignHRSubmit: () => void;
}

export const AssignRecuritmentHR = ({
  jobCodes,
  selectedJobCodes,
  onSelectAllChange,
  onRowChange,
  CurrentRole,
  onClose,
  AssignedHRId,
  validationErrors,
  ValueData,
  handleAutoComplete,
  handleAgencyChange,
  handleInputChangeTextArea,
  AssignHRSubmit,
}: AssignPositionDialogProps) => {
  const [AssignRecruitmentHROption, setAssignRecruitmentHROption] =
    React.useState<AutoCompleteItem[]>([]);
  const [AssignRecruitmentAgenciesOption, setAssignRecruitmentAgenciesOption] =
    React.useState<AutoCompleteItem[]>([]);

  React.useEffect(() => {
    const initialize = async () => {
      try {
        const [HRMSExternalAgents, AssignRecurtimentHROption] =
          await Promise.all([
            CommonServices.GetMasterData(ListNames.HRMSExternalAgents),
            CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSRecruitmentHR),
          ]);

        const agentsOptions: AutoCompleteItem[] =
          HRMSExternalAgents.data?.map((item: any) => ({
            key: item.Id,
            text: item.AgentName,
          })) ?? [];
        setAssignRecruitmentAgenciesOption(agentsOptions);

        if (
          AssignRecurtimentHROption.status === 200 &&
          AssignRecurtimentHROption.data
        ) {
          setAssignRecruitmentHROption(AssignRecurtimentHROption.data);
        } else {
          console.error(
            AssignRecurtimentHROption.data?.message ??
              "Error fetching HR group emails"
          );
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    void initialize();
  }, []);

  return (
    <>
      <div style={{ marginLeft: "4%" }}>
        <div>
          <JobCodeSelector
            jobCodes={jobCodes}
            selectedJobCodes={selectedJobCodes}
            //onSelectionChange={onSelectionChange}
            onSelectAllChange={onSelectAllChange}
            onRowChange={onRowChange}
          />

          <span
            style={{
              color: "red",
              marginTop: "8px",
              display: "block",
              fontFamily: "sans-serif",
              //           fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI",
              // -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
              fontSize: "13px",
            }}
          >
            Note:- To remove a selected Job Title, click ' Cancel ' and return
            to the Dashboard.
          </span>
          <div className="ms-Grid-row" style={{ textAlign: "left" }}>
            <div className="ms-Grid-col ms-lg6">
              {CurrentRole === RoleID.RecruitmentHRLead ? (
                <CustomAutoComplete
                  label="Assign Recruitment HR"
                  options={AssignRecruitmentHROption}
                  value={ValueData.AssignRecruitmentHR}
                  disabled={false}
                  mandatory={true}
                  onChange={(item) => handleAutoComplete(item)}
                  error={validationErrors.AssignRecruitmentHR}
                />
              ) : (
                <>
                  <CustomMultiSelect
                    label="Assign Agencies"
                    disabled={false}
                    mandatory={true}
                    value={
                      ValueData.AssignRecruitmentAgencies?.filter(
                        (item) => item.key !== 0
                      ) ?? []
                    }
                    options={AssignRecruitmentAgenciesOption ?? []}
                    onChange={(item) => handleAgencyChange(item)}
                    error={validationErrors.AssignRecruitmentAgencies}
                  />
                  {CurrentRole === RoleID.RecruitmentHR && (
                    <span
                      style={{
                        color: "red",
                        marginTop: "8px",
                        display: "block",
                        fontFamily: "sans-serif",
                        // fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI",
                        // -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                        fontSize: "13px",
                      }}
                    >
                      Note:- You can assign multiple Agencies.
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="ms-Grid-row" style={{ paddingRight: "16px" }}>
            <div className="ms-Grid-col ms-lg11">
              <CustomTextArea
                label={
                  CurrentRole === RoleID.RecruitmentHR
                    ? "Notes for Agencies"
                    : "Notes for Recruitment HR"
                }
                value={ValueData.Comments}
                error={validationErrors.Comments}
                onChange={(value) => handleInputChangeTextArea(value)}
                mandatory={true}
                placeholder={
                  CurrentRole === RoleID.RecruitmentHRLead
                    ? "You may provide Hiring Line Manager and Hiring HOD name and number here to RecruitmentHR...."
                    : ""
                }
              />
            </div>
          </div>
          <div className="ms-Grid-row" style={{ marginTop: "20px" }}></div>
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
            onClick={onClose}
            Style={{
              backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
              color: "white",
              width: "50%",
            }}
          />

          <ReuseButton
            label="Assign"
            onClick={async () => {
              await AssignHRSubmit();
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
