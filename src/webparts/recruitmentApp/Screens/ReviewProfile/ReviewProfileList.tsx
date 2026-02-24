import * as React from "react";
import { Card, CardContent } from "@mui/material";
//import { Link } from "@mui/material";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  ActionIcon,
  Choices,
  HRMSAlertOptions,
  InterviewLevels,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  tabType,
  workflowStatusApi,
} from "../../utilities/Config";

import SearchableDataTable from "../../components/CustomDataTable";
import { StatusDetails, TabDetails } from "../../Models/Master";
import {
  getInterviewPanelCount,
  getTotalAppliedCount,
  tabStyle,
} from "../../components/TabMerge";
import ToolTipButton from "../../components/Tooltip";
import {
  ActionName,
  ButtonAction,
  InterviewDate,
} from "../../utilities/LabelName";
import InterviewPanelDataTable from "../../components/InterviewPanelDataTable";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as moment from "moment";

type tabPendingCount = {
  ReviewPrfileCount: number;
  AssignInterviewPanelCount: number;
  InterviewQuestionCount: number;
  EvaluationCount: number;
};
const ReviewProfileList = (props: any) => {
  // console.log(props, "props in ReviewProfileList");

  const [RecuritmentData, setRecuritmentData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>(
    props?.TabDetails[0] === undefined ? [] : props?.TabDetails[0],
  );
  const [pendingcount, setPendingCount] = React.useState<tabPendingCount>({
    ReviewPrfileCount: 0,
    AssignInterviewPanelCount: 0,
    InterviewQuestionCount: 0,
    EvaluationCount: 0,
  });
  const [pendingInfo, setPendingInfo] = React.useState<any>(null);
  const storedStringRef = React.useRef("");
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const handleRedirectView = (
    rowData: any,
    tab: string,
    TabNames: string,
    ButtonAction: string,
  ): void => {
    switch (TabNames) {
      case TabName.ReviewProfile:
      case TabName.AssignInterviewPanel:
        props.navigation("/ReviewProfileList/ReviewCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            JobCodeID: rowData?.JobCodeId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabNames,
            ButtonAction,
          },
        });
        break;
      case TabName.InterviewQuestion:
        props.navigation("/ReviewProfileList/InterviewQuesEdit", {
          state: {
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            JobTitleInEnglish: rowData.JobTitleEnglish,
            Department: rowData.Department,
            JobCode: rowData.JobCode,
            JobCodeID: rowData?.JobCodeId,
            TabNames,
            ButtonAction,
          },
        });
        break;
      default:
        props.navigation("/ReviewProfileList/ReviewCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            JobCodeID: rowData?.JobCodeId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabNames,
            ButtonAction,
          },
        });
        break;
    }
  };

  const handleHover = async (statusId: number, rowData: any) => {
    let pendingName: any[] = [];
    switch (statusId) {
      // case StatusId.RecruitmentInProgress: {
      //   let Tooltipdata = await getVRRDetails.GetInterviewPanelTooltiData(
      //     rowData
      //   );
      //   let GradeLevel = await CommonServices.GetGradeLevel(
      //     rowData?.PatersonGrade
      //   );
      //   if (Tooltipdata?.data && Tooltipdata.data[0]?.LineManager) {
      //     pendingName = [
      //       {
      //         Key: Tooltipdata.data[0].LineManager.Role,
      //         Value: Tooltipdata.data[0].LineManager.Name,
      //       },
      //       {
      //         Key: Tooltipdata.data[0].HOD.Role,
      //         Value: Tooltipdata.data[0].HOD.Name,
      //       },
      //       {
      //         Key: Tooltipdata.data[0].HR.Role,
      //         Value: Tooltipdata.data[0].HR.Name,
      //       },
      //       GradeLevel.data[0]?.Level === InterviewLevels.Level2
      //         ? [
      //             {
      //               Key: Tooltipdata.data[0].Exco.Role,
      //               Value: Tooltipdata.data[0].Exco.Name,
      //             },
      //           ]
      //         : [],
      //     ];
      //   } else {
      //     pendingName = [{ Key: "N/A", Value: "No matching group" }];
      //   }
      //   break;
      // }
      case StatusId.PendingwithHRandLMtocreateinterviewQuestion:
        pendingName = [
          {
            Key: RoleName?.RecruitmentHR,
            Value:
              rowData?.QuestionByHR === "Yes"
                ? ActionName.Completed
                : ActionName.Pending, //"Completed" : "Pending",
          },
          {
            Key: RoleName?.LineManager,
            Value:
              rowData?.QuestionByLM === "Yes"
                ? ActionName.Completed
                : ActionName.Pending,
          },
        ];
        break;
      case StatusId.RecruitmentInProgress: {
        let Tooltipdata =
          await getVRRDetails.GetInterviewPanelTooltiData(rowData);
        let GradeLevel = await CommonServices.GetGradeLevel(
          rowData?.PatersonGrade,
        );
        // console.log(GradeLevel);

        if (Tooltipdata?.data && Tooltipdata.data[0]?.LineManager) {
          pendingName = [
            {
              Key: Tooltipdata.data[0].LineManager.Role,
              Value: Tooltipdata.data[0].LineManager.Name,
            },
            {
              Key: Tooltipdata.data[0].HOD.Role,
              Value: Tooltipdata.data[0].HOD.Name,
            },
            {
              Key: Tooltipdata.data[0].HR.Role,
              Value: Tooltipdata.data[0].HR.Name,
            },
          ];

          if (GradeLevel.data[0]?.Level === InterviewLevels.Level2) {
            pendingName.push({
              Key: Tooltipdata.data[0].Exco.Role,
              Value: Tooltipdata.data[0].Exco.Name,
            });
          }
        } else {
          pendingName = [{ Key: "N/A", Value: "No matching group" }];
        }
        break;
      }
      case StatusId.InterviewScheduled:
      case StatusId.InterviewScheduledforLevel2:
        {
          let pendingName: any[] = [];
          let Levels =
            statusId === StatusId.InterviewScheduled
              ? InterviewLevels.Level1
              : InterviewLevels.Level2;
          let data = await getVRRDetails.GetEvalutionActionData([
            {
              FilterKey: "CandidateID/Id",
              Operator: "eq",
              FilterValue: rowData.ID,
            },
            {
              FilterKey: "InterviewLevel",
              Operator: "eq",
              FilterValue: Levels,
            },
          ]);
          pendingName = data.data;
          setPendingInfo(pendingName);
        }
        break;
      default:
        pendingName = [{ Key: "N/A", Value: "No matching group" }];
        break;
    }
    setPendingInfo(pendingName);
  };

  const handleHoverInterviewPanel = async (statusId: number, rowData: any) => {
    let pendingName: any[] = [];
    let Levels =
      statusId === StatusId.InterviewScheduled
        ? InterviewLevels.Level1
        : InterviewLevels.Level2;
    let data = await getVRRDetails.GetEvalutionActionData([
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: rowData.ID,
      },
      {
        FilterKey: "InterviewLevel",
        Operator: "eq",
        FilterValue: Levels,
      },
    ]);
    pendingName = data.data;
    setPendingInfo(pendingName);
  };

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabNames: string,
  ) => [
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    {
      field: "JobTitleEnglish",
      header: "Job Title",
      sortable: true,
    },
    ...(TabNames === TabName.ReviewProfile ||
    TabNames === TabName.AssignInterviewPanel
      ? [
          {
            field: "JobAppliedCount",
            header: "Job Applied Count",
            sortable: true,
          },
        ]
      : []),
    {
      field: "BusinessUnitCode",
      header: "Business Unit Code",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        const isTooltipStatus = [
          StatusId.Completed,
          // StatusId.RecruitmentInProgress,
          // StatusId.PendingwithHRandLMtocreateinterviewQuestion,
        ].includes(rowData.StatusId);

        if (!isTooltipStatus) {
          return (
           <div style={{ display: "flex", alignItems: "center" }}>
             <div style={{ width: "24px", marginLeft: "-14%" }}>
              <ToolTipButton
                Title=""
                CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
                Rowdata={rowData}
                ApproverData={pendingInfo}
                onHover={() => handleHover(rowData.StatusId, rowData)}
              />
              </div>
              <div style={{ flex: 1 }}>
              <span>{rowData.Status}</span>
            </div>
               </div>
          );
        }
        // return <span>{rowData.Status}</span>;
                return (
  <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ width: "24px", marginLeft: "-14%" }}></div>
    <div style={{ flex: 1 }}>
      <span>{rowData.Status}</span>
    </div>
  </div>
);
      },
    },
    {
      field: "",
      header: "Action",
      style: { width: "8%" },
      sortable: false,
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px", // slightly more space for small screens
              flexWrap: "wrap", // allow wrapping on smaller screens
            }}
          >
            {ButtonActions === ActionIcon.Edit ? (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.Edit,
                    )
                  }
                  style={{
                    width: "50%", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={require("../../assets/Viewicon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "50%", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.View,
                    )
                  }
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  function handleAlert(Level: string) {
    let CancelAlert = {
      Message:
        Level === InterviewLevels.Level1
          ? RecuritmentHRMsg.InterviewScoredAlready
          : RecuritmentHRMsg.InterviewScoreCommentsAlready,
      Type: HRMSAlertOptions.Error,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          setAlertPopupOpen(false);
        }
      },
    };
    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  }

  function handleRedirect(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
  ) {
    let navigationPath =
      rowData?.StatusId === StatusId.InterviewScheduled
        ? "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit"
        : rowData.StatusId === StatusId.InterviewScheduledforLevel2
          ? "/ReviewProfileList/HodViewScorecard"
          : "";
    const today = new Date();
    // const todayDateStr = today.toISOString().split("T")[0];
    const interviewDateStr = moment(
      rowData.InterviewDateTime,
      "DD-MMM-YYYY hh:mm A",
    ).format("YYYY-MM-DD");
    const todayDateStr = moment(today).format("YYYY-MM-DD");
    // const InterviewDate = new Date(rowData.InterviewDateTime)
    //   .toISOString()
    //   .split("T")[0];
    if (todayDateStr >= interviewDateStr) {
      props.navigation(navigationPath, {
        state: {
          ID: rowData?.ID,
          tab: tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          TabName: TabName,
          ButtonAction,
          RecruitmentID: rowData?.RecruitmentID,
          InterviewLevel: rowData?.InterviewLevel,
          JobCodeID: rowData?.JobCodeID,
        },
      });
    } else {
      const formattedDate = moment(
        `${interviewDateStr}`,
        "YYYY-MM-DD HH:mm",
      ).format("DD-MMM-YYYY hh:mm A");

      const ValidationMsg = InterviewDate(formattedDate);
      let ValidationError = {
        Message: ValidationMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };
      setAlertPopupOpen(true);
      setalertProps(ValidationError);
      setIsLoading(false);
    }
  }

  const CandidateConfig = (
    tab: string,
    ButtonActions: number,
    TabName: string,
  ) => [
    {
      field: "SNO",
      header: "S.No",
      sortable: true,
    },
    {
      field: "ApplicantName",
      header: "ApplicantName",
      sortable: true,
    },
    {
      field: "PositionTitle",
      header: "Position Title",
      sortable: true,
    },
    {
      field: "InterviewDateTime",
      header: "Interview Date & Time",
      sortable: true,
    },
    // {
    //   field: "JobGrade",
    //   header: "JobGrade",
    //   sortable: true,
    // },
    { field: "InterviewLevel", header: "Interview Levels", sortable: true },
    { field: "Grade", header: "Grade", sortable: true },
    {
      field: "Status",
      header: "Status",
      sortable: false,
      body: (rowData: any) => {
        return (
           <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "24px" }}>
            <ToolTipButton
              Title=""
              CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
              Rowdata={rowData}
              ApproverData={pendingInfo}
              onHover={() =>
                handleHoverInterviewPanel(rowData.StatusId, rowData)
              }
            />
            </div>
            <div style={{ flex: 1 }}>
            <span>{rowData.Status}</span>
          </div>
           </div>
        );
        // return <span>{rowData.Status}</span>;
      },
    },

    {
      field: "Action",
      header: "Action",
      sortable: false,
      style: { width: "8%" },
      body: (rowData: any) => {
        const checkIsScoreSheetUploaded = async () => {
          try {
            const [interviewPanelResponse, currentUserResponse] =
              await Promise.all([
                CommonServices.GetMasterData(
                  ListNames.HRMSInterviewPanelDetails,
                ),
                CommonServices.getUserGuidByEmail(props.CurrentUserEmailId),
              ]);

            const currentUserKey = currentUserResponse.data?.key?.toString();
            if (!currentUserKey) {
              return;
            }
            if (
              !interviewPanelResponse?.data ||
              interviewPanelResponse.data.length === 0
            ) {
              return;
            }

            const candidatePanels = interviewPanelResponse.data.filter(
              (panel) =>
                panel.CandidateIDId?.toString() === rowData.ID?.toString(),
            );

            if (candidatePanels.length === 0) {
              return;
            }

            const userPanels = candidatePanels.filter((panel) =>
              panel.InterviewPanelStringId?.includes(currentUserKey),
            );

            if (userPanels.length === 0) {
              return;
            }
            if (rowData.StatusId === StatusId.InterviewScheduled) {
              const isLevelbasedFiltered = userPanels.filter(
                (item) => item.InterviewLevel === InterviewLevels.Level1,
              );

              const isScoreSheetUploaded = isLevelbasedFiltered.some(
                (panel) => panel.IsScoreSheetUploaded === "Yes",
              );
              if (isScoreSheetUploaded) {
                handleAlert(InterviewLevels.Level1);
                return;
              }
              handleRedirect(
                {
                  ...rowData,
                  InterviewLevel: rowData?.InterviewLevel,
                  RecruitmentID: rowData?.RecruitmentID,
                },
                tab,
                TabName,
                ButtonAction.View,
              );
              return;
            } else if (
              rowData.StatusId === StatusId.InterviewScheduledforLevel2
            ) {
              const isLevelbasedFiltered = userPanels.filter(
                (item) => item.InterviewLevel === InterviewLevels.Level2,
              );

              const isScoreSheetUploaded = isLevelbasedFiltered.some(
                (panel) => panel.IsScoreSheetUploaded === "Yes",
              );
              if (isScoreSheetUploaded) {
                handleAlert(InterviewLevels.Level2);
                return;
              }
              handleRedirect(
                {
                  ...rowData,
                  InterviewLevel: rowData?.InterviewLevel,
                  RecruitmentID: rowData?.RecruitmentID,
                },
                tab,
                TabName,
                ButtonAction.View,
              );
              return;
            }
          } catch (error) {}
        };
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px", // slightly more space for small screens
              flexWrap: "wrap", // allow wrapping on smaller screens
            }}
          >
            <img
              src={require("../../assets/Viewicon.svg")}
              alt="Stamp Icon"
              style={{
                width: "50%", // scales with font size
                height: "auto",
                maxWidth: "40px", // limit maximum size
                cursor: "pointer",
              }}
              onClick={checkIsScoreSheetUploaded}
            />
          </div>
        );
      },
    },
  ];

  const fetchRecuritmentData = async (tabName: any[]) => {
    setIsLoading(true);
    try {
      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "and";
      let JobAppliedCountFilter: string[] = [];
      let TabValue = storedStringRef.current
        ? storedStringRef.current
        : props.stateValue?.TabName;
      switch (TabValue) {
        case TabName.ReviewProfile:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          filterConditionsRecuritment.push({
            FilterKey: "AssignedHR",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          JobAppliedCountFilter = [workflowStatusApi.HRPending];
          break;
        case TabName.AssignInterviewPanel:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          filterConditionsRecuritment.push({
            FilterKey: "AssignedHR",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          JobAppliedCountFilter = [
            workflowStatusApi.PendingRecruitmentHRscheduleInterview,
          ];
          break;

        case TabName.InterviewQuestion:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithHRandLMtocreateinterviewQuestion,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          filterConditionsRecuritment.push({
            FilterKey: "AssignedHR",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
      }
      // if (props.CurrentRoleID.includes(RoleID.LineManager)) {
      //   filterConditionsRecuritment.push({
      //     FilterKey: "LineManager",
      //     Operator: "eq",
      //     FilterValue: props.userDetails[0]?.EmailId,
      //   });
      // } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
      //   filterConditionsRecuritment.push({
      //     FilterKey: "HOD",
      //     Operator: "eq",
      //     FilterValue: props.userDetails[0]?.EmailId,
      //   });
      // } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      //   filterConditionsRecuritment.push({
      //     FilterKey: "AssignedHR",
      //     Operator: "eq",
      //     FilterValue: props.userDetails[0]?.EmailId,
      //   });
      // }

      let data: any;
      if (TabValue === TabName.Evaluation) {
        data = await getVRRDetails.GetcountInEvalution(
          props.CurrentUserEmailId,
          props.EmployeeList,
        );
      } else {
        data = await getVRRDetails.GetRecruitmentDetails(
          filterConditionsRecuritment,
          RecuritmentConditions,
          JobAppliedCountFilter,
        );
      }

      if (data.status === 200 && data.data !== null) {
        setRecuritmentData(data.data);
      }
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingcountTabs = async () => {
    setIsLoading(true);
    try {
      const recrutimentData = await getVRRDetails.GetRecruitmentDetails(
        [
          {
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          },
        ],
        "",
      );
      if (recrutimentData.status === ResponeStatus.SUCCESS) {
        const InterviewQuestionCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId ===
              StatusId.PendingwithHRandLMtocreateinterviewQuestion ||
            (item.StatusId ===
              StatusId.PendingwithLMcreateDisqualificationQuestion &&
              item.AssignLineManager === props.userDetails[0]?.EmailId),
          // (item.AssignEMail === props.userDetails[0]?.EmailId ||
        );

        const getJobAppiledCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            item.AssignEMail === props.userDetails[0]?.EmailId,
        );
        const ReviewProfileCount = await getTotalAppliedCount(
          getJobAppiledCount,
          [workflowStatusApi.HRPending],
        );

        const InterviewPanel1Count = await getTotalAppliedCount(
          getJobAppiledCount,
          [workflowStatusApi.PendingRecruitmentHRscheduleInterview],
        );
        const InterviewPanel2Count =
          await getInterviewPanelCount(getJobAppiledCount);
        const Evalution = await getVRRDetails.GetcountInEvalution(
          props.CurrentUserEmailId,
          props.EmployeeList,
        );

        let InterviewPanelCount = InterviewPanel1Count + InterviewPanel2Count;

        setPendingCount((prevState) => ({
          ...prevState,
          ReviewPrfileCount: ReviewProfileCount,
          AssignInterviewPanelCount: InterviewPanelCount,
          InterviewQuestionCount: InterviewQuestionCount.length,
          EvaluationCount: Evalution.data.length,
          // EvaluationCount: Evalution.data[0].length,
        }));
      }
    } catch (error) {
      console.log("Error in pendingcountTabs", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (props.stateValue) {
      storedStringRef.current = props.stateValue?.TabName;
      setActiveTab(props.stateValue?.tab);
    } else {
      if (!storedStringRef.current) {
        if (props.TabDetails[0]) {
          storedStringRef.current = props.TabDetails[0]?.[0]?.Value ?? "";
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchRecuritmentData(props.TabDetails[0]);
        await pendingcountTabs();
        let TabDetails: any;
        if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
          TabDetails = (props.TabDetails[0] ?? []).filter(
            (tab: any) => tab.TabName !== TabName.Evaluation,
          );
        } else {
          TabDetails = props.TabDetails[0] ?? [];
        }
        setTabNameData(TabDetails);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    void fetchData();
  }, [activeTab]);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    void fetchRecuritmentData(props.TabDetails[0]);
    void pendingcountTabs();
    setActiveTab(tab);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[],
  ) => {
    // storedStringRef.current = "";
    if (TabValue === activeTab) {
      if (
        TabNames !== TabName.UploadAdvertisement &&
        TabNames !== TabName.AssignAgencies
      ) {
        storedStringRef.current = TabNames;
      } else {
        storedStringRef.current = "";
      }
    }
    let Action: any;
    // let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      // StatusID = StatusData.filter((item) => item.StatusId);
    }

    switch (TabNames) {
      case TabName.ReviewProfile:
      case TabName.AssignInterviewPanel:
      case TabName.InterviewQuestion:
        return (
          <SearchableDataTable
            data={RecuritmentData}
            columns={columnConfig(TabValue, Action[0]?.ActionId?.[0], TabNames)}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
            MasterData={props}
          />
        );
      case TabName.Evaluation:
        return (
          <InterviewPanelDataTable
            data={RecuritmentData}
            columns={CandidateConfig(
              TabValue,
              Number(Action[0]?.Action?.[0]),
              TabNames,
            )}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.ReviewProfile:
        return tabStyle(tab.TabName, pendingcount.ReviewPrfileCount);
      case TabName.AssignInterviewPanel:
        return tabStyle(tab.TabName, pendingcount.AssignInterviewPanelCount);
      case TabName.InterviewQuestion:
        return tabStyle(tab.TabName, pendingcount.InterviewQuestionCount);
      case TabName.Evaluation:
        return tabStyle(tab.TabName, pendingcount.EvaluationCount);
      default:
        return tab.TabName;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: getTabLabel(tab), //tab.TabName,
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>{renderTable(tab.TabName, tab.Value, tab.StatusDetails)}</div>
        </CardContent>
      </Card>
    ),
  }));

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
              // tabClassName={"Tab"}
            />
          </React.Fragment>
        </div>
      </CustomLoader>
      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
    </>
  );
};
export default ReviewProfileList;
