import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AssignmentPayload, RecruitmentItem } from "../RecruitmentTable.types";
import {
  CommonServices,
  masterService,
  RecruitmentServices,
} from "../../../../services/ServiceExport";
import {
  PostAgentData,
  PostRecuritmentData,
} from "../../../../services/RecruitmentTable/IRecruitmentService";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { RoleID, StatusId, WorkflowAction } from "../../../../utilities/Config";
import { useToast } from "../../../Hooks/useToast";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { RecuritmentHRMsg } from "../../../../utilities/ConditionConfig";
import { WorkflowConfig } from "../../../Hooks/WorkflowConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";

export const useConfirmAssignment = (
  handleClosePopup: () => void,
  handleRefresh: () => void,
) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { roleIDs, ADGroupData } = userInfo();
  const { MatricID } = useUIState();
  const { showError } = useToast();
  const { modalState, showModal, closeModal } = useModalPopup();
  const Submitted = useRef<boolean>(false);

  const handleConfirmAssignment = useCallback(
    async (payload: AssignmentPayload) => {
      Submitted.current = true;

      try {
        setLoading(true);
        const isHRLead = roleIDs.includes(RoleID.RecruitmentHRLead);

        const userIDResult = isHRLead
          ? await CommonServices.getUserIDByEmail(
              Number(payload.member?.id) ?? 0,
            )
          : null;

        if (isHRLead) {
          const vacancyDetailResults = await Promise.all(
            payload.vacancies.map((vacancy) => {
              const filter = [
                {
                  FilterKey: "ID",
                  Operator: "eq",
                  FilterValue: vacancy.ItemID,
                },
              ];

              return RecruitmentServices.GetNPAEPVRRDetails(
                filter,
                "and",
                vacancy.requestType,
              ).then((res) => ({
                vacancy,
                jobDetail: res.data?.[0] ?? null,
              }));
            }),
          );

          const unresolved = vacancyDetailResults.filter((r) => !r.jobDetail);
          if (unresolved.length) {
            console.warn("Unresolved job details:", unresolved);
            Submitted.current = false;
            return;
          }

          const batchPayloads: PostRecuritmentData[] = await Promise.all(
            vacancyDetailResults.map(async ({ vacancy, jobDetail }) => {
              const JDEData = await masterService.fetchJDEEmailIDs(
                jobDetail!.BusinessUnitCodeId,
              );
              // let StatusID = WorkflowConfig(MatricID)
              return {
                Data: {
                  BusinessUnitCodeId: jobDetail!.BusinessUnitCodeId,
                  Nationality: jobDetail!.Nationality,
                  EmploymentCategory: jobDetail!.EmploymentCategory,
                  DepartmentId: jobDetail!.DepartmentId,
                  SubDepartmentId: jobDetail!.SubDepartmentId,
                  SectionId: jobDetail!.SectionId,
                  DepartmentCodeId: jobDetail!.DepartmentCodeId,
                  NumberOfPersonNeeded: Number(jobDetail!.NumberOfPersonNeeded),
                  EnterNumberOfMonths: jobDetail!.EnterNumberOfMonths ?? "0",
                  TypeOfContract: jobDetail!.TypeOfContract,
                  DateRequried: jobDetail!.DateRequried ?? null,
                  StatusId: StatusId.PendingUploadAdvert,
                  JobCodeId: jobDetail!.JobCodeId,
                  AreaofWork: jobDetail!.AreaofWork,
                  AssignedHR: userIDResult!.data,
                  RecruitmentHRLead: Array.isArray(ADGroupData.EmailId)
                    ? (ADGroupData.EmailId[0] ?? "")
                    : (ADGroupData.EmailId ?? ""),
                  DataFrom: jobDetail!.Type ?? "",
                  Location: jobDetail!.Location ?? "",
                  LineManager: JDEData?.data?.LineManagerEmail ?? "",
                  HOD: JDEData?.data?.HODEmail ?? "",
                },

                PositionData: {
                  PatersonGradeId: jobDetail!.PatersonGradeId ?? 0,
                  DRCGradeId: jobDetail!.DRCGradeId ?? 0,
                  JobTitleEnglishId: jobDetail!.JobTitleEnglishId ?? 0,
                  JobTitleFrenchId: jobDetail!.JobTitleFrenchId ?? 0,
                },

                CommentsList: {
                  RoleId: roleIDs[0],
                  RecruitmentIDId: 0,
                  Comments: payload.comments ?? "",
                },

                updatePreList: {
                  ID: vacancy.ItemID ?? 0,
                  ActionId: WorkflowAction.Approved,
                  ItemCreated: "Yes",
                  IsDataSyncToRecruitment: "No",
                },
              };
            }),
          );

          const batchResponse =
            await RecruitmentServices.InsertRecruitmentDptBatch(batchPayloads);

          if (batchResponse.status === ResponeStatus.SUCCESS) {
            showModal({
              type: "success",
              title: "Assigned Successfully",
              message:
                payload.vacancies.length > 1
                  ? RecuritmentHRMsg.HRSuccess
                  : RecuritmentHRMsg.SingleHRSuccessMsg,
              confirmLabel: "OK",
              onConfirm: () => {
                closeModal();
                handleClosePopup();
                navigate("/RecruitmentTable");
                handleRefresh();
              },
            });

            Submitted.current = true;
          } else {
            Submitted.current = false;
            showModal({
              type: "error",
              title: "Assignment Failed",
              message: "Something went wrong. Please try again.",
              confirmLabel: "OK",
              onConfirm: () => {
                closeModal();
                handleClosePopup();
                navigate("/RecruitmentTable");
                handleRefresh();
              },
            });
          }
        } else {
          const batchPayloads: PostAgentData[] = payload.vacancies.map(
            (vacancy: RecruitmentItem) => ({
              Data: {
                AgentId: Number(payload.member?.id),
                JobCodeId: Number(vacancy.jobCodeID),
                RecrutimentId: Number(vacancy.ItemID),
              },
              AgentProfileData: {
                jobCode: String(vacancy.jobCodeID),
                jobsXAgents: [
                  {
                    agentId: String(payload.member?.id),
                  },
                ],
              },
              CommentsList: {
                RoleId: roleIDs[0],
                RecruitmentIDId: Number(vacancy.ItemID),
                Comments: payload.comments ?? "",
              },
            }),
          );

          const batchResponse =
            await RecruitmentServices.InsertExternalAgencyDetails(
              batchPayloads,
            );

          if (batchResponse.status === ResponeStatus.SUCCESS) {
            showModal({
              type: "success",
              title: "Agent Assignment Successfully",
              message:
                payload.vacancies.length > 1
                  ? RecuritmentHRMsg.AgencySucess
                  : RecuritmentHRMsg.SingleAgencyMsg,
              confirmLabel: "OK",
              onConfirm: () => {
                closeModal();
                handleClosePopup();
                navigate("/RecruitmentTable");
                handleRefresh();
              },
            });

            Submitted.current = true;
          } else {
            Submitted.current = false;
            showModal({
              type: "error",
              title: "Assignment Failed",
              message: "Something went wrong. Please try again.",
              confirmLabel: "OK",
              onConfirm: () => {
                closeModal();
                handleClosePopup();
                navigate("/RecruitmentTable");
                handleRefresh();
              },
            });
          }
        }
      } catch (error) {
        Submitted.current = false;
        console.error("Critical error during submission:", error);
        showError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [roleIDs, ADGroupData, navigate, showModal, closeModal, showError],
  );

  return {
    handleConfirmAssignment,
    Submitted,
    modalState,
    closeModal,
    loading,
  };
};
