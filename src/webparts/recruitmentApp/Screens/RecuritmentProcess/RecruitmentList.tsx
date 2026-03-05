
import * as React from "react";
import { useCallback, useState } from "react";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import InterviewPanelDataTable from "../../components/InterviewPanelDataTable";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomDialogbox from "../../components/CustomDialogbox";
import { DateExtension } from "../../components/DateExtension";
import {
  AssignRecuritmentHR,
  FormDataType,
} from "../ScreenComponent/AssignRecuritmentHR";
import * as moment from "moment";
import { useRecruitmentData } from "./Hooks/useRecruitmentData";
import { JobAdvertAlertMsg } from "../../utilities/LabelName";
import {
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  StatusId,
  TabName,
  WorkflowAction,
} from "../../utilities/Config";
import { useRecruitmentColumns } from "./Hooks/useRecruitmentColumns";
import SearchableDataTable from "../../components/CustomDataTable";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import {
  InsertComments,
  PostRecuritmentData,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import { jobsXAgents } from "../../Models/ApIInterface";
import { AutoCompleteItem } from "../../Models/Screens";
import { useAssignOptions } from "./Hooks/useAssignOptions";
import { NavigationPath } from "../NavigationPath/navigationPath";

const RecruitmentList = (props: any) => {
  const [rows, setRows] = useState<number>(5);

  const { data, isLoading, jobCodeTitles, refreshData } =
    useRecruitmentData(props, NavigationPath.PreSelection);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isAssignDialogOpen, setAssignDialogOpen] = useState<boolean>(false);
  const [isDateDialogOpen, setDateDialogOpen] = useState<boolean>(false);
  const [dialogRowData, setDialogRowData] = useState<any>(null);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    type: "",
    buttonAction: undefined as (() => void) | undefined,
  });
  const [isLoadings, setIsLoading] = useState<boolean>(false)

  console.log(jobCodeTitles, "JobCodeTitle");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const showAlert = (message: string, type: string, onAction?: () => void) => {
    setAlertInfo({ open: true, message, type, buttonAction: onAction });
  };
  const closeAlert = () => setAlertInfo({ ...alertInfo, open: false });


  const {
    hrOptions,
    agencyOptions,
    fetchAgencyOptions,
    isLoading: areOptionsLoading,
  } = useAssignOptions();

  const constructAgentDetails = async (
    selectedJob: any,
    agencies: AutoCompleteItem[],
  ) => {
    const { data: allAgents } = await CommonServices.GetMasterData(
      ListNames.HRMSExternalAgents,
    );

    const matchedAgents = allAgents.filter((agent: { Id: number }) =>
      agencies.some((item) => item.key === agent.Id),
    );

    const agentDetails: jobsXAgents[] = matchedAgents.map((item: any) => ({
      agentId: item.AgentCode,
    }));

    const jobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
      [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: selectedJob?.JobCodeId,
        },
        { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
      ],
      "and",
    );

    const jobUniqueData = jobUniqueValue.data[0]?.JobUniqueKey || "";

    return {
      jobCode: jobUniqueData,
      jobsXAgents: agentDetails,
    };
  };

  const handleAssignSubmit = useCallback(
    async (formData: FormDataType) => {
      setIsLoading(true);
      setIsSubmitting(true);
      let allOperationsSucceeded = true;

      try {
        const isHRLead = props.CurrentRoleID.includes(RoleID.RecruitmentHRLead);
        for (const selectedJob of selectedRows) {
          const correspondingJob = data.find(
            (item: any) => item.ID === selectedJob.ID,
          );
          if (!correspondingJob) continue;
          if (isHRLead) {
            if (!formData.assignRecruitmentHR?.key) {
              showAlert(
                "Recruitment HR is not selected.",
                HRMSAlertOptions.Error,
              );
              allOperationsSucceeded = false;
              break;
            }

            const UserIDbyEmail = await CommonServices.getUserIDByEmail(
              formData.assignRecruitmentHR.key,
            );

            const recruitmentValue: PostRecuritmentData = {
              Data: {
                BusinessUnitCodeId: correspondingJob.BusinessUnitCodeId,
                Nationality: correspondingJob.Nationality,
                EmploymentCategory: correspondingJob.EmploymentCategory,
                DepartmentId: correspondingJob.DepartmentId,
                SubDepartmentId: correspondingJob.SubDepartmentId,
                SectionId: correspondingJob.SectionId,
                DepartmentCodeId: correspondingJob.DepartmentCodeId,
                NumberOfPersonNeeded: Number(
                  correspondingJob.NumberOfPersonNeeded,
                ),
                EnterNumberOfMonths:
                  correspondingJob.EnterNumberOfMonths ?? "0",
                TypeOfContract: correspondingJob.TypeOfContract,
                DateRequried: correspondingJob?.DateRequried ?? null,
                StatusId: StatusId.PendingwithHRLeadtoAssignRecruitmentHR,
                ActionId: WorkflowAction.Approved,
                JobCodeId: correspondingJob.JobCodeId,
                AreaofWork: correspondingJob.AreaofWork,
                AssignedHR: UserIDbyEmail.data,
                RecruitmentHRLead: props.CurrentUserEmailId,
                DataFrom: correspondingJob.Type ?? "",
                Location: correspondingJob.Location ?? "",
              },
              PositionData: {
                PatersonGradeId: correspondingJob.PatersonGradeId ?? 0,
                DRCGradeId: correspondingJob.DRCGradeId ?? 0,
                JobTitleEnglishId: correspondingJob.JobTitleEnglishId ?? 0,
                JobTitleFrenchId: correspondingJob.JobTitleFrenchId ?? 0,
              },
              CommentsList: {
                RoleId:
                  props.TabDetails?.TabName === TabName.AssignRecuritmentHR
                    ? RoleID.RecruitmentHRLead
                    : RoleID.RecruitmentHR,
                RecruitmentIDId: 0,
                Comments: formData.comments ?? "",
              },
              updatePreList: {
                ID: selectedJob.ID ?? 0,
                ActionId: WorkflowAction.Approved,
                ItemCreated: "Yes",
                IsDataSyncToRecruitment: "No",
              },
            };

            const response =
              await getVRRDetails.InsertRecruitmentDpt(recruitmentValue);
            if (response.status !== ResponeStatus.SUCCESS) {
              allOperationsSucceeded = false;
              break;
            }
          } else {
            if (formData.assignRecruitmentAgencies.length === 0) {
              showAlert("No agencies selected.", HRMSAlertOptions.Error);
              allOperationsSucceeded = false;
              break;
            }
            const agentDetailsPayload = await constructAgentDetails(
              selectedJob,
              formData.assignRecruitmentAgencies,
            );
            const upsertResponse =
              await GetPortalJobsService.UpsertAgenciesJobs(
                agentDetailsPayload,
              );

            if (upsertResponse.status !== ResponeStatus.SUCCESS) {
              allOperationsSucceeded = false;
              break;
            }

            const recruitmentID: number = correspondingJob.ID;
            const agencyData = formData.assignRecruitmentAgencies.map(
              (agency) => ({
                key: agency.key,
                text: agency.text,
                RecruitmentID: recruitmentID,
              }),
            );

            const insertAgencyResponse =
              await getVRRDetails.InsertExternalAgencyDetails(
                agencyData,
                recruitmentID,
              );
            if (insertAgencyResponse.status !== ResponeStatus.SUCCESS) {
              allOperationsSucceeded = false;
              break;
            }

            const commentsData: InsertComments = {
              RoleId: RoleID.RecruitmentHR,
              RecruitmentIDId: recruitmentID,
              Comments: formData.comments,
            };

            const insertCommentsResponse =
              await getVRRDetails.InsertCommentsList(commentsData);
            if (insertCommentsResponse.status !== ResponeStatus.SUCCESS) {
              allOperationsSucceeded = false;
              break;
            }
          }
        }

        if (allOperationsSucceeded) {
          showAlert(selectedRows.length === 1
            ? RecuritmentHRMsg.SingleHRSuccessMsg
            : RecuritmentHRMsg.HRSuccess, HRMSAlertOptions.Success, () => {
              setAssignDialogOpen(false);
              clearSelection();
              refreshData();
              closeAlert();
            });
        } else {
          showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, () => {
            closeAlert();
          });
        }
      } catch (error) {
        console.error("A critical error occurred during submission:", error);
        showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    },
    [props.CurrentRoleID, selectedRows, data, refreshData, clearSelection],
  );


  const handleRedirectView = useCallback(
    (rowData: any, buttonAction: string, tab: string) => {
      console.log("Redirecting for:", rowData.ID, "with action:", buttonAction);
      const basePath = props.TabDetails?.TabName === TabName.MySubmission
        ? "/RecurimentProcess/ApprovedVRRView"
        : props.TabDetails?.TabName === TabName.InterviewQuestion ? "/RecurimentProcess/InterviewQuesEdit" : "/RecurimentProcess/ApprovedVRREdit";
      props.navigation(basePath, {
        state: {
          ID: rowData?.ID,
          TabName: props.TabDetails.TabName,
          buttonAction,
          type: rowData?.Type,
          AssignedHRId: rowData?.AssignedHRId,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          JobTitleInEnglish: rowData.JobTitleEnglish,
          Department: rowData.Department,
          JobCode: rowData.JobCode,
          JobCodeID: rowData?.JobCodeId,
        },
      });
    },
    [props.navigate, props.TabDetails.TabName],
  );

  const openDateExtensionDialog = useCallback((rowData: any) => {
    const comparisonDate =
      rowData.JobPostingSecondExtensionEndDate ||
      rowData.JobPostingFirstExtensionEndDate ||
      rowData.JobPostingEndDate;
    if (comparisonDate && moment().isBefore(moment(comparisonDate))) {
      showAlert(
        JobAdvertAlertMsg(moment(comparisonDate).format("DD/MM/YYYY")),
        HRMSAlertOptions.Error,
      );
    } else {
      setDialogRowData(rowData);
      setDateDialogOpen(true);
    }
  }, []);

  const handleSelectionChange = useCallback(
    (selectedItems: any[]) => {
      const checkedItems = selectedItems.filter((item) => item.Checked);
      const selectedJobCodes = checkedItems.map((item) => ({
        ID: item.ID,
        JobTitle: item.JobTitleEnglish,
        JobCode: item.JobCode,
        JobCodeId: item.JobCodeId,
        Nationality: item.Nationality,
      }));
      setSelectedRows(selectedJobCodes);
      const firstNationality = checkedItems[0]?.Nationality ?? null;
      void fetchAgencyOptions(firstNationality);
    },
    [fetchAgencyOptions, setSelectedRows],
  );

  const handleAssignClick = useCallback(() => {
    if (selectedRows.length === 0) {
      return showAlert(
        RecuritmentHRMsg.RecruitmentErrorMsg,
        HRMSAlertOptions.Error,
      );
    }
    const firstNationality = selectedRows[0].Nationality;
    if (!selectedRows.every((row) => row.Nationality === firstNationality)) {
      return showAlert(
        RecuritmentHRMsg.NationalityMsgError,
        HRMSAlertOptions.Error,
      );
    }
    setAssignDialogOpen(true);
  }, [selectedRows]);

  const columns = useRecruitmentColumns(
    props.TabDetails,
    handleRedirectView,
    openDateExtensionDialog,
  );

  const renderTable = () => {
    const { TabName: tabName } = props.TabDetails;
    const commonProps = {
      data,
      columns,
      rows,
      onPageChange: (e: any) => setRows(e.rows),
      handleRefresh: refreshData,
      MasterData: props,
    };

    switch (tabName) {
      case TabName.AssignRecuritmentHR:
      case TabName.AssignAgencies:
        return (
          <CheckboxDataTable
            {...commonProps}
            handleSelectedRow={handleSelectionChange}
            onSelectAllRow={handleSelectionChange}
            handleAssignBtn={handleAssignClick}
            assignLabel={
              props.CurrentRoleID.includes(RoleID.RecruitmentHR)
                ? "Assign Agencies"
                : "Assign HR"
            }
            AssignBtnValidation={false}
          />
        );
      case TabName.Evaluation:
        return <InterviewPanelDataTable {...commonProps} />;
      default:
        return <SearchableDataTable {...commonProps} />;
    }
  };

  return (
    <>
      <CustomLoader isLoading={isLoading ?? isLoadings}>{renderTable()}</CustomLoader>

      {alertInfo.open && (
        <CustomAlert
          Message={alertInfo.message}
          Type={alertInfo.type}
          ButtonAction={alertInfo.buttonAction || closeAlert}
          onClose={closeAlert}
          visible={alertInfo.open}
        />
      )}

      {isDateDialogOpen && (
        <CustomDialogbox
          visible={isDateDialogOpen}
          onClose={() => setDateDialogOpen(false)}
          header="Advertisement Extension"
        >
          <DateExtension
            RecuritmentData={dialogRowData}
            onClose={() => setDateDialogOpen(false)}
            ModelDropDown={props}
            AlertpopupSuccess={(msgType: string) =>
              showAlert(
                msgType === "Success"
                  ? RecuritmentHRMsg.AdvertExtendsionSuccessMsg
                  : RecuritmentHRMsg.APIErrorMsg,
                msgType === "Success"
                  ? HRMSAlertOptions.Success
                  : HRMSAlertOptions.Error,
              )
            }
            setIsLoading={() => { }}
          />
        </CustomDialogbox>
      )}

      {isAssignDialogOpen && (
        <CustomDialogbox
          visible={isAssignDialogOpen}
          onClose={() => !isSubmitting && setAssignDialogOpen(false)}
          Style={{
            width: "45vw",
            height: "38vw",
            padding: "0px",
            overflowX: "hidden",
          }}
          header={
            <div
              style={{
                textAlign: "center",
                width: "100%",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                  // textDecoration: "underline",
                  // textUnderlineOffset: "6px",
                }}
              >
                {props.CurrentRoleID.includes(RoleID.RecruitmentHR)
                  ? "Assign Agencies"
                  : "Assign Recruitment HR"}
              </h2>
            </div>
          }
        >
          <AssignRecuritmentHR
            selectedJobCodes={selectedRows}
            currentRole={props.CurrentRoleID}
            assignRecruitmentHROption={hrOptions}
            assignRecruitmentAgenciesOption={agencyOptions}
            onClose={() => setAssignDialogOpen(false)}
            onSubmit={handleAssignSubmit}
            isLoading={isSubmitting || areOptionsLoading}
          // onSelectAllChange={(value) =>handleSelectionChange(value)}
          />
        </CustomDialogbox>
      )}
    </>
  );
};

export default RecruitmentList;
