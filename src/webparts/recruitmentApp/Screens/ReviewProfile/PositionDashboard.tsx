import * as React from "react";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { HRMSAlertOptions, StatusId, TabName } from "../../utilities/Config";

import SearchableDataTable from "../../components/CustomDataTable";
import { InterviewDate } from "../../utilities/LabelName";
import InterviewPanelDataTable from "../../components/InterviewPanelDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as moment from "moment";
import { useRecruitmentData } from "../RecuritmentProcess/Hooks/useRecruitmentData";
import { useRecruitmentColumns } from "../RecuritmentProcess/Hooks/useRecruitmentColumns";
import { useCallback, useState } from "react";

const PositionDashboard = (props: any) => {
  const { data, isLoading, refreshData } = useRecruitmentData(props);

  const [rows, setRows] = useState<number>(5);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    type: "",
    buttonAction: undefined as (() => void) | undefined,
  });

  const closeAlert = () => setAlertInfo({ ...alertInfo, open: false });

  const evaluationRouteMap: Record<number, string> = {
    [StatusId.InterviewScheduled]:
      "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
    [StatusId.InterviewScheduledforLevel2]:
      "/ReviewProfileList/HodViewScorecard",
  };

  const tabRouteMap: Record<string, string> = {
    [TabName.ReviewProfile]: "/ReviewProfileList/ReviewCandidateList",
    [TabName.AssignInterviewPanel]: "/ReviewProfileList/ReviewCandidateList",
    [TabName.InterviewQuestion]: "/ReviewProfileList/InterviewQuesEdit",
  };

  const handleRedirect = useCallback(
    (rowData: any, ButtonAction: string) => {
      const { TabName: tabName, tab } = props.TabDetails;

      const navigationPath =
        tabName === TabName.Evaluation
          ? evaluationRouteMap[rowData?.StatusId] || ""
          : tabRouteMap[tabName] || "";

      if (!navigationPath) return;

      const interviewDate = moment
        .utc(rowData?.InterviewDateTime)
        .startOf("day");
      const today = moment.utc().startOf("day");
      if (
        tabName === TabName.Evaluation &&
        !today.isSameOrAfter(interviewDate, "day")
      ) {
        const formattedDate = interviewDate.format("DD-MMM-YYYY");
        const ValidationMsg = InterviewDate(formattedDate);

        setAlertInfo({
          ...alertInfo,
          open: true,
          message: ValidationMsg,
          type: HRMSAlertOptions.Error,
          buttonAction: async () => {
            closeAlert();
          },
        });

        return;
      }

      // ✅ Single Navigation Call (no duplication)
      props.navigation(navigationPath, {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          tabName,
          ButtonAction,
          RecruitmentID: rowData?.RecruitmentID,
          InterviewLevel: rowData?.InterviewLevel,
          JobCodeID: rowData?.JobCodeID,
        },
      });
    },
    [props.navigation, props.TabDetails],
  );

  const columns = useRecruitmentColumns(props.TabDetails, handleRedirect);

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
      case TabName.ReviewProfile:
      case TabName.AssignInterviewPanel:
      case TabName.InterviewQuestion:
        return <SearchableDataTable {...commonProps} />;
      case TabName.Evaluation:
        return <InterviewPanelDataTable {...commonProps} />;
      default:
        return <SearchableDataTable {...commonProps} />;
    }
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>{renderTable()}</CustomLoader>
      {alertInfo.open && (
        <CustomAlert
          Message={alertInfo.message}
          Type={alertInfo.type}
          ButtonAction={alertInfo.buttonAction || closeAlert}
          onClose={closeAlert}
          visible={false}
        />
      )}
    </>
  );
};
export default PositionDashboard;
