import * as React from "react";
import { useMemo } from "react";
import { ActionIcon, TabName } from "../../../utilities/Config";
import ToolTipButton from "../../../components/Tooltip";
import { ButtonAction } from "../../../utilities/LabelName";

export const useRecruitmentColumns = (
  tabDetails: any,
  handleRedirectView: (
    rowData: any,
    buttonAction: string,
    tabValue?: string,
  ) => void,
  openDateExtensionDialog?: (rowData: any) => void,
) => {
  const TabNames = tabDetails?.TabName;
  const TabValue = tabDetails?.Value;
  const ButtonActions =
    tabDetails?.StatusDetails?.[0]?.Action?.[0] ?? ActionIcon.View;

  return useMemo(() => {
    const columns = [
      { field: "JobCode", header: "Job Code", sortable: true },
      ...(TabNames === TabName.ReviewProfile ||
      TabNames === TabName.ReviewScorecard
        ? [
            {
              field: "JobAppliedCount",
              header: "Job Applied Count",
              sortable: true,
            },
          ]
        : []),
      { field: "JobTitleEnglish", header: "Job Title", sortable: true },
      {
        field: "NumberOfPersonNeeded",
        header: "No. of Vacant Positions",
        sortable: true,
      },
      { field: "Type", header: "Position Request", sortable: true },
      { field: "Nationality", header: "Nationality", sortable: true },
      {
        field: "Status",
        header: "Status",
        sortable: true,
        body: (rowData: any) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ToolTipButton Title="" Rowdata={rowData} />
            <span>{rowData.Status}</span>
          </div>
        ),
      },
      {
        field: "Action",
        header: "Action",
        sortable: false,
        body: (rowData: any) => (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            {ButtonActions === ActionIcon.Edit && (
              <img
                src={require("../../../assets/Editbutton.svg")}
                alt="Edit"
                onClick={() =>
                  handleRedirectView(rowData, ButtonAction.Edit, TabValue)
                }
              />
            )}
            {ButtonActions === ActionIcon.Upload && (
              <img
                src={require("../../../assets/UploadIcon.svg")}
                alt="Upload"
                onClick={() =>
                  handleRedirectView(rowData, ButtonAction.Upload, TabValue)
                }
              />
            )}
            {ButtonActions !== ActionIcon.Edit &&
              ButtonActions !== ActionIcon.Upload && (
                <img
                  src={require("../../../assets/Viewicon.svg")}
                  alt="View"
                  onClick={() =>
                    handleRedirectView(rowData, ButtonAction.View, TabValue)
                  }
                />
              )}
            {openDateExtensionDialog &&
              TabNames === TabName.AdvertExtension && (
                <img
                  src={require("../../../assets/AddDate.svg")}
                  alt="Extend Date"
                  onClick={() => openDateExtensionDialog(rowData)}
                />
              )}
          </div>
        ),
      },
    ];

    if (
      TabNames === TabName.AssignRecuritmentHR ||
      TabNames === TabName.AssignAgencies
    ) {
      columns.unshift({ field: "Checkbox", header: "", sortable: false });
    }

    if (TabNames === TabName.Evaluation) {
      return [
        { field: "SNO", header: "S.No", sortable: true },
        { field: "ApplicantName", header: "Applicant Name", sortable: true },
        { field: "PositionTitle", header: "Position Title", sortable: true },
        {
          field: "InterviewDateTime",
          header: "Interview Date",
          sortable: true,
        },
        { field: "InterviewLevel", header: "Interview Level", sortable: true },
        { field: "Grade", header: "Grade", sortable: true },
        { field: "Status", header: "Status", sortable: true },
        {
          field: "Action",
          header: "Action",
          sortable: false,
          body: (rowData: any) => (
            <img
              src={require("../../../assets/Viewicon.svg")}
              alt="View Scorecard"
              onClick={() => handleRedirectView(rowData, ButtonAction.View)}
            />
          ),
        },
      ];
    }

    return columns;
  }, [TabNames, ButtonActions, handleRedirectView, openDateExtensionDialog]);
};
