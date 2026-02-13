import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import {
  RoleID,
  StatusId,
  TabName,
  tabType,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  WorkflowAction,
  Choices,
  ResponeStatus,
  ColorCode,
  ActionIcon,
  InterviewLevels,
  RoleName,
  workflowStatusApi,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { AutoCompleteItem } from "../../Models/Screens";
import { JobCodeTilte, tabCount } from "../../Models/RecuritmentVRR";
import {
  DataSyncToRecruitmentResponse,
  InsertComments,
  PostRecuritmentData,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import { jobsXAgents, profileXagent } from "../../Models/ApIInterface";
import CustomDialogbox from "../../components/CustomDialogbox";
import { DateExtension } from "../../components/DateExtension";
import {
  AssignHRData,
  AssignRecuritmentHR,
} from "../ScreenComponent/AssignRecuritmentHR";
import IsValid from "../../components/Validation";
import { StatusDetails, TabDetails } from "../../Models/Master";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import * as moment from "moment";
import ReuseButton from "../../components/ReuseButton";
import ToolTipButton from "../../components/Tooltip";
import {
  getScoreCardCount,
  getTotalAppliedCount,
  tabStyle,
} from "../../components/TabMerge";
import {
  ActionName,
  ButtonAction,
  ExternalUserType,
  InterviewDate,
  JobAdvertAlertMsg,
  PositionStatus,
} from "../../utilities/LabelName";
import InterviewPanelDataTable from "../../components/InterviewPanelDataTable";

export type formValidation = {
  Comments: boolean;
  AssignRecruitmentHR: boolean;
  AssignRecruitmentAgencies: boolean;
};

const RecruitmentProcess = (props: any) => {
  const [data, setData] = React.useState<DataSyncToRecruitmentResponse[]>([]);
  const [selectedrowdata, setSelectedrowdata] = React.useState<
    DataSyncToRecruitmentResponse[]
  >([]);
  // const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>();
  const [AssignHR, setAssignHR] = React.useState<boolean>(false);
  const [AssignHRData, setAssignHRData] = React.useState<AssignHRData>({
    AssignRecruitmentHR: { key: 0, text: "" },
    AssignRecruitmentAgencies: [],
    Comments: "",
  });
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>([]);
  // const [isCurrectTab, setIsCurrectTab] = React.useState<string>("");
  const [allJobData, setJobCodeTitle] = React.useState<JobCodeTilte[]>([
    {
      JobTitle: "",
      JobCode: " ",
      ID: 0,
      JobCodeId: 0,
    },
  ]);
  const [selectedJobCodes, setSelectedJobCodes] = React.useState<
    JobCodeTilte[]
  >([]);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [DatePopup, setDatePopup] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] =
    React.useState<formValidation>({
      Comments: false,
      AssignRecruitmentHR: false,
      AssignRecruitmentAgencies: false,
    });

  const [pendingcount, setPendingCount] = React.useState<tabCount>({
    AssignHRCount: 0,
    UploadONEMCount: 0,
    UploadAdvertisementCount: 0,
    AssignAgencyCount: 0,
    ReviewLineManagerCount: 0,
    ReviewHODCount: 0,
    lineManagerInterviewCount: 0,
    HODReviewScoreCount: 0,
    EvaluationCount: 0,
    advertExtensionCount: 0,
    ReviewProfileCount: 0,
    ReviewScoreCardCount: 0,
  });

  const [pendingInfo, setPendingInfo] = React.useState<any>(null);
  const [positionIDs, setPositionIDs] = React.useState<any>(null);
  const [AssignRecruitmentHROption, setAssignRecruitmentHROption] =
    React.useState<AutoCompleteItem[]>([]);
  const [AssignRecruitmentAgenciesOption, setAssignRecruitmentAgenciesOption] =
    React.useState<AutoCompleteItem[]>([]);
  const storedStringRef = React.useRef("");

  const fetchHRAgencyDetails = async (Nationality: string) => {
    try {
      const GetADGruopUserID = await CommonServices.GetMasterData(
        ListNames.HRMSRecruitmentUserRole,
      );
      let ADGroupIDs = GetADGruopUserID.data?.filter(
        (item: any) => item.ID === RoleID.RecruitmentHR,
      );
      const [HRMSExternalAgents, AssignRecurtimentHROption] = await Promise.all(
        [
          CommonServices.GetMasterData(ListNames.HRMSExternalAgents),
          CommonServices.GetADgruopsEmailIDs(ADGroupIDs[0]?.ADGroupID),
        ],
      );
      let ExternalAgent = HRMSExternalAgents.data?.filter(
        (nat) =>
          nat.Nationality === Nationality &&
          nat.UserType === ExternalUserType.Agent,
      );
      const agentsOptions: AutoCompleteItem[] =
        ExternalAgent?.map((item: any) => ({
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
            "Error fetching HR group emails",
        );
      }
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  const handleHover = async (statusId: number, rowData: any) => {
    let pendingName: any[] = [];
    switch (statusId) {
      case StatusId.ReadyforRecruitmentProcess:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              rowData.AssignHRLead,
              "RecruitmentHRLead",
            )
          ).data,
        ];
        break;
      case StatusId.PendingwithHRLeadtoAssignRecruitmentHR:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              rowData.AssignEMail,
              "RecruitmentHR",
            )
          ).data,
        ];
        break;
      case StatusId.PendingwithRecruitmentHRtouploadAdv:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              rowData.AssignEMail,
              "RecruitmentHR",
            )
          ).data,
        ];
        break;
      case StatusId.PendingwithLineManagereviewAdv:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              rowData.AssignLineManager,
              "LineManager",
            )
          ).data,
        ];
        break;
      case StatusId.PendingwithLMcreateDisqualificationQuestion:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              rowData.AssignLineManager,
              "LineManager",
            )
          ).data,
        ];
        break;
      case StatusId.PendingwithHODtoreviewAdv:
        pendingName = [
          (await getVRRDetails.GetADGroupUsers(rowData.AssignHOD, "HOD")).data,
        ];
        break;
      case StatusId.PendingwithHRLeadtouploadONEMsigneddoc:
        pendingName = [
          (await getVRRDetails.GetADGroupUsers(rowData.AssignHRLead, "HRLead"))
            .data,
        ];
        break;

      case StatusId.PendingwithHRandLMtocreateinterviewQuestion:
        pendingName = [
          {
            Key: RoleName?.RecruitmentHR,
            Value:
              rowData?.QuestionByHR === "Yes"
                ? ActionName.Completed
                : ActionName.Pending,
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

  const handlePositionHover = async (rowData: any) => {
    const filterConditions = [
      {
        FilterKey: "JobCode",
        Operator: "eq",
        FilterValue: rowData.JobCodeId,
      },
      {
        FilterKey: "Department",
        Operator: "eq",
        FilterValue: rowData.DepartmentId,
      },
      {
        FilterKey: "PositionIDStatus",
        Operator: "in",
        FilterValue: [
          PositionStatus.RecruitmentInitiator,
          PositionStatus.RecruitmentInProgress,
        ],
      },
    ];
    const response = await getVRRDetails.GetPositionIDData(
      filterConditions,
      "and",
    );
    setPositionIDs(response.data);
  };

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

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabNames: string,
  ) => [
    {
      field: "Checkbox",
      header: "",
      sortable: false,
    },
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
    ...(TabNames === TabName.ReviewProfile
      ? [
          {
            field: "JobAppliedCount",
            header: "Job Applied Count",
            sortable: true,
          },
        ]
      : []),
    ...(TabNames === TabName.ReviewScorecard
      ? [
          {
            field: "ReviewScoreCount",
            header: "Job Applied Count",
            sortable: true,
          },
        ]
      : []),

    // {
    //   field: "BusinessUnitCode",
    //   header: "BusinessUnit Code",
    //   sortable: true,
    // },
    {
      field: "NumberOfPersonNeeded",
      header: "No. of Vacant Positions",
      sortable: true,
      body: (rowData: any) => {
        return (
          <div>
            <ToolTipButton
              Title=""
              CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
              Rowdata={rowData}
              ApproverData={positionIDs}
              onHover={() => handlePositionHover(rowData)}
              TooltipHeader={"Position IDs"}
            />
            <span>{rowData.NumberOfPersonNeeded}</span>
          </div>
        );
      },
    },
    {
      field: "Type",
      header: "Position Request",
      sortable: true,
    },
    {
      field: "Nationality",
      header: "Nationality",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      style: { width: "18%" },
      sortable: true,
      body: (rowData: any) => {
        let isTooltipStatus: any;
        if (props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)) {
          isTooltipStatus = [
            StatusId.ReadyforRecruitmentProcess,
            // StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
            // StatusId.RecruitmentInProgress,
          ].includes(rowData.StatusId);
        } else if (props.CurrentRoleID.includes(RoleID.LineManager)) {
          isTooltipStatus = [
            StatusId.ReadyforRecruitmentProcess,
            StatusId.PendingwithLMcreateDisqualificationQuestion,
            StatusId.PendingwithLineManagereviewAdv,
          ].includes(rowData.StatusId);
        } else {
          isTooltipStatus = [
            StatusId.ReadyforRecruitmentProcess,
            StatusId.PendingwithRecruitmentHRtouploadAdv,
            StatusId.PendingwithLineManagereviewAdv,
            StatusId.PendingwithHRandLMtocreateinterviewQuestion,
            StatusId.PendingwithLMcreateDisqualificationQuestion,
            StatusId.PendingwithHODtoreviewAdv,
            StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
            // StatusId.RecruitmentInProgress,
          ].includes(rowData.StatusId);
        }
        if (
          !isTooltipStatus &&
          storedStringRef.current != TabName.UploadONEMDoc
        ) {
          return (
            <div>
              <ToolTipButton
                Title=""
                CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
                Rowdata={rowData}
                ApproverData={pendingInfo}
                onHover={() => handleHover(rowData.StatusId, rowData)}
              />
              <span>{rowData.Status}</span>
            </div>
          );
        }
        return <span>{rowData.Status}</span>;
      },
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      style:
        TabNames === TabName.AdvertExtension
          ? { width: "13%" }
          : { width: "8%" },
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems:
                TabNames === TabName.AdvertExtension ? "left" : "center",
              justifyContent:
                TabNames === TabName.AdvertExtension ? "left" : "center",
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
            ) : ButtonActions === ActionIcon.Upload ? (
              <>
                <img
                  src={require("../../assets/UploadIcon.svg")}
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
                      ButtonAction.Upload,
                    )
                  }
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
                    maxWidth:
                      TabNames === TabName.AdvertExtension ? "29px" : "40px", // limit maximum size
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
            {TabNames === TabName.AdvertExtension && (
              <>
                <img
                  src={require("../../assets/AddDate.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "50%",
                    height: "auto",
                    maxWidth: "29px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const today = new Date();
                    // today.setDate(today.getDate() + 1); // Add 1 day
                    today.setHours(0, 0, 0, 0); // Normalize to midnight

                    const {
                      JobPostingEndDate,
                      JobPostingFirstExtensionEndDate,
                      JobPostingSecondExtensionEndDate,
                    } = rowData || {};

                    let JobValidation = false;

                    let comparisonDate = null;

                    if (JobPostingSecondExtensionEndDate) {
                      comparisonDate = new Date(
                        JobPostingSecondExtensionEndDate,
                      );
                    } else if (JobPostingFirstExtensionEndDate) {
                      comparisonDate = new Date(
                        JobPostingFirstExtensionEndDate,
                      );
                    } else if (JobPostingEndDate) {
                      comparisonDate = new Date(JobPostingEndDate);
                    }

                    if (comparisonDate) {
                      comparisonDate.setHours(0, 0, 0, 0); // Normalize time
                      JobValidation = today >= comparisonDate; // <-- reversed comparison
                    }

                    if (!JobValidation) {
                      const Dateformat = JobPostingSecondExtensionEndDate
                        ? moment(JobPostingSecondExtensionEndDate).format(
                            "DD/MM/YYYY",
                          )
                        : JobPostingFirstExtensionEndDate
                          ? moment(JobPostingFirstExtensionEndDate).format(
                              "DD/MM/YYYY",
                            )
                          : moment(JobPostingEndDate).format("DD/MM/YYYY");
                      const JobExpiredMsg = JobAdvertAlertMsg(Dateformat);
                      const SuccessAlert = {
                        Message: JobExpiredMsg,
                        Type: HRMSAlertOptions.Error,
                        visible: true,
                        ButtonAction: async (userClickedOK: boolean) => {
                          if (userClickedOK) {
                            setAlertPopupOpen(false);
                          }
                        },
                      };

                      setAlertPopupOpen(true);
                      setalertProps(SuccessAlert);
                    } else {
                      let selectedData = [rowData];
                      setSelectedrowdata(selectedData);
                      setDatePopup(true);
                    }
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  function handleRedirect(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
  ) {
    let navigationPath =
      rowData?.StatusId === StatusId.InterviewScheduled
        ? "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit"
        : rowData.StatusId === StatusId.InterviewScheduledforLevel2
          ? "/RecurimentProcess/HodViewScorecard"
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
      style: { width: "20%" },
      sortable: false,
      body: (rowData: any) => {
        return (
          <div>
            <ToolTipButton
              Title=""
              CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
              Rowdata={rowData}
              ApproverData={pendingInfo}
              onHover={() =>
                handleHoverInterviewPanel(rowData.StatusId, rowData)
              }
            />
            <span>{rowData.Status}</span>
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
                ButtonAction.Edit,
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
                ButtonAction.Edit,
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

  async function handleRedirectView(
    rowData: any,
    tab: string,
    TabNames: string,
    ButtonAction: string,
  ) {
    switch (TabNames) {
      case TabName.AssignRecuritmentHR:
      case TabName.UploadONEMDoc:
      case TabName.UploadAdvertisement:
      case TabName.AssignAgencies:
      case TabName.ReviewJobAdvertisement:
        props.navigation("/RecurimentProcess/ApprovedVRREdit", {
          state: {
            type: rowData?.Type,
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
          },
        });
        break;

      case TabName.MySubmission:
      case TabName.AdvertExtension:
        props.navigation("/RecurimentProcess/ApprovedVRRView", {
          state: {
            ID: rowData?.ID,
            AssignedHR: rowData?.AssignedHR,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
          },
        });
        break;

      case TabName.ReviewScorecard:
        props.navigation("/RecurimentProcess/HodScoreCard/CandidateList", {
          state: {
            ID: rowData?.ID.toString().trim(),
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
            JobCode: rowData?.JobCode?.toString().trim(),
            JobCodeID: rowData?.JobCodeId,
            Department: rowData?.DepartmentId,
            NoOfPosition: rowData?.NumberOfPersonNeeded,
          },
        });
        break;

      case TabName.InterviewQuestion:
        props.navigation("/RecurimentProcess/InterviewQuesEdit", {
          state: {
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab: "tab2",
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

      case TabName.ReviewProfile:
        props.navigation("/RecurimentProcess/ReviewCandidateList", {
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
      case TabName.UploadCV:
        props.navigation("/RecurimentProcess/UploadCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            JobCodeId: rowData?.JobCodeId,
            JobTitle: rowData?.JobTitleEnglish,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
          },
        });
        break;

      default:
        // optional: handle unknown TabName
        console.warn("Unknown TabName:", TabNames);
        break;
    }
  }

  const fetchData = async (tabName: any[]) => {
    setIsLoading(true);
    try {
      let filterConditions = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "StatusId",
        Operator: "eq",
        FilterValue: StatusId.ReadyforRecruitmentProcess,
      });
      filterConditions.push({
        FilterKey: "IsDataSyncToRecruitment",
        Operator: "eq",
        FilterValue: Choices.Yes,
      });
      filterConditions.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No,
      });

      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "and";
      let JobAppliedCountFilter: string[] = [];
      let CurrentTab;
      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        CurrentTab = TabName.UploadAdvertisement;
      } else if (
        props.CurrentRoleID.includes(RoleID.HOD) ||
        props.CurrentRoleID.includes(RoleID.LineManager)
      ) {
        CurrentTab = TabName.ReviewJobAdvertisement;
      } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)) {
        CurrentTab = TabName.AssignRecuritmentHR;
      } else {
        CurrentTab = props.stateValue?.TabName;
      }
      let TabValue = storedStringRef.current
        ? storedStringRef.current
        : CurrentTab;
      //tabName[0]?.TabName;
      switch (TabValue) {
        case TabName.UploadONEMDoc:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.UploadAdvertisement:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          filterConditionsRecuritment.push({
            FilterKey: "AssignedHR",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
        case TabName.AssignAgencies:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          filterConditionsRecuritment.push({
            FilterKey: "AssignedHR",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
        case TabName.ReviewProfile:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          filterConditionsRecuritment.push({
            FilterKey: "LineManager",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          JobAppliedCountFilter = [
            workflowStatusApi.LineManagerL1Pending,
            workflowStatusApi.LineManagerL2Pending,
            workflowStatusApi.LineManagerLevel1OnHold,
            workflowStatusApi.LineManagerLevel2OnHold,
          ];
          break;
        case TabName.UploadCV:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.ReviewScorecard:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          filterConditionsRecuritment.push({
            FilterKey: "HOD",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
        case TabName.AdvertExtension:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          filterConditionsRecuritment.push({
            FilterKey: "HOD",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
        case TabName.ReviewJobAdvertisement:
          if (props.CurrentRoleID.includes(RoleID.LineManager)) {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithLineManagereviewAdv,
            });
            filterConditionsRecuritment.push({
              FilterKey: "LineManager",
              Operator: "eq",
              FilterValue: props.userDetails[0]?.EmailId,
            });
          } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithHODtoreviewAdv,
            });
            filterConditionsRecuritment.push({
              FilterKey: "HOD",
              Operator: "eq",
              FilterValue: props.userDetails[0]?.EmailId,
            });
          }

          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.InterviewQuestion:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingwithHRandLMtocreateinterviewQuestion,
              StatusId.PendingwithLMcreateDisqualificationQuestion,
            ],
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          filterConditionsRecuritment.push({
            FilterKey: "LineManager",
            Operator: "eq",
            FilterValue: props.userDetails[0]?.EmailId,
          });
          break;
        default:
          filterConditionsRecuritment = [];
          RecuritmentConditions = "and";
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
      if (TabValue === TabName.Evaluation) {
        const response = await getVRRDetails.GetcountInEvalution(
          props.CurrentUserEmailId,
          props.EmployeeList,
        );
        if (response.status === ResponeStatus.SUCCESS) {
          setData(response.data);
        }
      } else {
        const response =
          props.CurrentRoleID.includes(RoleID.RecruitmentHRLead) &&
          TabValue === TabName.AssignRecuritmentHR
            ? await getVRRDetails.GetJobTitleInNPEP(
                filterConditions,
                Conditions,
                props,
              )
            : await getVRRDetails.GetRecruitmentDetails(
                filterConditionsRecuritment,
                RecuritmentConditions,
                JobAppliedCountFilter,
              );
        if (response.status === 200) {
          let responseData;
          if (TabValue === TabName.UploadCV) {
            const todayl = new Date();
            const today = moment(todayl).format("YYYY-MM-DD");
            responseData = response.data.filter((item) => {
              let endDateStr =
                item.JobPostingSecondExtensionEndDate ||
                item.JobPostingFirstExtensionEndDate ||
                item.JobPostingEndDate;
              if (!endDateStr) return false;
              const endDate = moment(endDateStr).format("YYYY-MM-DD");
              return endDate >= today;
            });
          } else {
            responseData = response.data;
          }
          setData(responseData);
          const JobCode = response.data.map((item) => ({
            ID: item.ID,
            JobCode: item.JobCode,
            JobTitle: item.JobTitleEnglish,
            Nationality: item.Nationality,
            JobCodeId: item.JobCodeId,
          }));
          const uniqueJobData = JobCode.filter(
            (job, index, self) =>
              index === self.findIndex((item) => item.ID === job.ID),
          );
          setJobCodeTitle(uniqueJobData);
        }
      }
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
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
        const AssignHRCount = await getVRRDetails.GetJobTitleInNPEP(
          [
            {
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.ReadyforRecruitmentProcess,
            },
            {
              FilterKey: "IsDataSyncToRecruitment",
              Operator: "eq",
              FilterValue: Choices.Yes,
            },
            {
              FilterKey: "ItemCreated",
              Operator: "eq",
              FilterValue: Choices.No,
            },
          ],
          "and",
          props,
        );

        const UploadONEMCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
        );

        const UploadAdvertismentCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv &&
            item.AssignEMail === props.userDetails[0]?.EmailId,
        );
        const InterviewQuestionCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId ===
              StatusId.PendingwithHRandLMtocreateinterviewQuestion ||
            (item.StatusId ===
              StatusId.PendingwithLMcreateDisqualificationQuestion &&
              item.AssignLineManager === props.userDetails[0]?.EmailId),
          // (item.AssignEMail === props.userDetails[0]?.EmailId ||
        );

        const ReviewLinemanagerCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.PendingwithLineManagereviewAdv &&
            item.AssignLineManager === props.userDetails[0]?.EmailId,
        );

        const ReviewHODCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.PendingwithHODtoreviewAdv &&
            item.AssignHOD === props.userDetails[0]?.EmailId,
        );
        const AssignAgenciesCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            item.AssignEMail === props.userDetails[0]?.EmailId,
        );
        const EvalutionData = await getVRRDetails.GetcountInEvalution(
          props.CurrentUserEmailId,
          props.EmployeeList,
        );

        const getReviewProfileCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            item.AssignLineManager === props.userDetails[0]?.EmailId,
        );

        const ReviewProfileCount = await getTotalAppliedCount(
          getReviewProfileCount,
          [workflowStatusApi.HRPending],
        );

        const userEmail = props.userDetails[0]?.EmailId;

        const getScoreCount = recrutimentData.data.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            (item.AssignLineManager === userEmail ||
              item.AssignHOD === userEmail),
        );

        const ScoreCardCount = await getScoreCardCount(getScoreCount);

        setPendingCount((prevState) => ({
          ...prevState,
          ReviewProfileCount: ReviewProfileCount,
          ReviewScoreCardCount: ScoreCardCount,
          AssignHRCount: AssignHRCount.data.length,
          UploadONEMCount: UploadONEMCount.length,
          UploadAdvertisementCount: UploadAdvertismentCount.length,
          lineManagerInterviewCount: InterviewQuestionCount.length,
          ReviewLineManagerCount: ReviewLinemanagerCount.length,
          ReviewHODCount: ReviewHODCount.length,
          AssignAgencyCount: AssignAgenciesCount.length,
          EvaluationCount: EvalutionData.data.length,
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
          // storedStringRef.current = props.TabDetails[0]?.[0]?.Value ?? "";
        }
      }
      setActiveTab("tab1");
    }
    // handleRefresh(props.TabDetails[0]?.[0]?.Value);
  }, []);

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData(props.TabDetails[0]);
        await pendingcountTabs();
        // if (props.stateValue?.activeTab) {
        //   setActiveTab(props.stateValue.activeTab);
        // }
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
    };

    void fetchDataAndGetADGroupsOption();
  }, [activeTab]);

  const handleRefresh = (tab: string) => {
    void fetchData(props.TabDetails[0]?.[0]?.Value);
    void pendingcountTabs();
  };

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setRows(event.rows);
  };

  const handleCancel = () => {
    setIsLoading(false);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          setAssignHR(false);
          setAssignHRData((prevState) => ({
            ...prevState,
            AssignRecruitmentHR: { key: 0, text: "" },
            AssignRecruitmentAgencies: [],
            Comments: "",
          }));
          setData((prevData) =>
            prevData.map((item) => ({
              ...item,
              Checked: false,
            })),
          );

          setSelectedJobCodes([]);

          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            AssignRecruitmentHR: false,
            AssignRecruitmentAgencies: false,
            Comments: false,
          }));
          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };

    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  };

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    const defaultValue = { key: 0, text: "" };

    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: value ? [value] : [defaultValue],
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: false,
      }));
    } else {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentHR: value || defaultValue,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentHR: false,
      }));
    }
  };

  const handleAgencyChange = (value: AutoCompleteItem[]) => {
    if (value.length > 0) {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: false,
      }));
    } else {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: [],
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: true,
      }));
    }
  };

  const handleCheckbox = async (item: any[]) => {
    const selectedJobCodes = item
      .filter((currentItem) => currentItem.Checked)
      .map((currentItem) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === currentItem.JobCode,
        );

        return {
          ID: currentItem.ID,
          JobCode: currentItem.JobCode,
          JobCodeId: currentItem.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
          Nationality: currentItem.Nationality,
        };
      });
    setSelectedJobCodes(selectedJobCodes);
    await fetchHRAgencyDetails(selectedJobCodes[0]?.Nationality);
  };

  const onSelectAllChange = async (item: any[]) => {
    const selectedJobCodes = item
      .filter((item) => item.Checked)
      .map((item) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === item.JobCode,
        );

        return {
          ID: item.ID,
          JobCode: item.JobCode,
          JobCodeId: item.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
          Nationality: item.Nationality,
        };
      });
    setSelectedJobCodes(selectedJobCodes);
    await fetchHRAgencyDetails(selectedJobCodes[0]?.Nationality);
  };

  const handleInputChangeTextArea = (value: string) => {
    setAssignHRData((prevState) => ({
      ...prevState,
      Comments: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      Comments: false,
    }));
  };

  //AssignButton function for AssignHR
  const AssignBtn_fn = async () => {
    const isItemSelected = selectedJobCodes.length > 0;
    const allSameNationality = selectedJobCodes.every(
      (item: any) => item.Nationality === selectedJobCodes[0]?.Nationality,
    );
    // console.log(allSameNationality, "allSameNationality");
    if (allSameNationality) {
    }
    if (isItemSelected && allSameNationality) {
      let IDs = selectedJobCodes.map((item) => item.ID);
      let filterConditions = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "RecruitmentID",
        Operator: "in",
        FilterValue: IDs,
      });
      await getVRRDetails.GetAssignAgentDetail(filterConditions, Conditions);
      // console.log(AssignAgencies, "Agencies.");

      setAssignHR(true);
    } else {
      let CancelAlert = {
        // Message: RecuritmentHRMsg.RecruitmentErrorMsg,
        Message: props.CurrentRoleID.includes(RoleID.RecruitmentHR)
          ? RecuritmentHRMsg.AgenciesErrorMsg
          : !allSameNationality
            ? RecuritmentHRMsg.NationalityMsgError
            : RecuritmentHRMsg.RecruitmentErrorMsg,
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
  };

  const Validation = (): boolean => {
    let errors = {
      AssignRecruitmentHR: false,
      Comments: false,
      AssignRecruitmentAgencies: false,
    };
    if (props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)) {
      errors.AssignRecruitmentHR = !IsValid(
        AssignHRData.AssignRecruitmentHR.text,
      );
      errors.Comments = !IsValid(AssignHRData.Comments);
    } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      errors.AssignRecruitmentAgencies = !IsValid(
        AssignHRData.AssignRecruitmentAgencies[0]?.text,
      );
      errors.Comments = !IsValid(AssignHRData.Comments);
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const handleSubmit = async () => {
    try {
      const IsVaild = !Validation();
      if (IsVaild) {
        setAssignHR(false);
        setIsLoading(true);
        if (selectedJobCodes.length > 0) {
          let ResponseStatusCode;
          for (const selectedJob of selectedJobCodes) {
            const correspondingJob = data.find(
              (item: any) => item.ID === selectedJob.ID,
            );
            if (correspondingJob) {
              let UserIDbyEmail = await CommonServices.getUserIDByEmail(
                AssignHRData.AssignRecruitmentHR.key,
              );

              const RecruitmentValue: PostRecuritmentData = {
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
                    storedStringRef.current === TabName.AssignRecuritmentHR
                      ? RoleID.RecruitmentHRLead
                      : RoleID.RecruitmentHR,
                  RecruitmentIDId: 0,
                  Comments: AssignHRData.Comments,
                },
                updatePreList: {
                  ID: selectedJob.ID ?? 0,
                  ActionId: WorkflowAction.Approved,
                  ItemCreated: "Yes",
                  IsDataSyncToRecruitment: "No",
                },
              };

              const response =
                await getVRRDetails.InsertRecruitmentDpt(RecruitmentValue);
              ResponseStatusCode = response.status;
              if (response.status === ResponeStatus.SUCCESS) {
                setAssignHRData((prevState) => ({
                  ...prevState,
                  AssignRecruitmentHR: { key: 0, text: "" },
                  Comments: "",
                }));
                setData((prevData) =>
                  prevData.map((item) => ({
                    ...item,
                    Checked: false,
                  })),
                );
                setSelectedJobCodes([]);

                setAssignHRData((prevState) => ({
                  ...prevState,
                  AssignRecruitmentAgencies: [],
                  Comments: "",
                }));
                setData((prevData) =>
                  prevData.map((item) => ({
                    ...item,
                    Checked: false,
                  })),
                );
                setSelectedJobCodes([]);
              } else {
                let APIErrorAlert = {
                  Message: RecuritmentHRMsg.APIErrorMsg,
                  Type: HRMSAlertOptions.Error,
                  visible: true,
                  ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                      setAlertPopupOpen(false);
                      setIsLoading(false);
                      setAssignHRData((prevState) => ({
                        ...prevState,
                        AssignRecruitmentAgencies: [],
                        Comments: "",
                      }));
                      setData((prevData) =>
                        prevData.map((item) => ({
                          ...item,
                          Checked: false,
                        })),
                      );
                      setSelectedJobCodes([]);
                    }
                  },
                };
                setAlertPopupOpen(true);
                setIsLoading(true);
                setalertProps(APIErrorAlert);
              }
            }
          }
          if (ResponseStatusCode === ResponeStatus.SUCCESS) {
            let SuccessAlert = {
              Message:
                selectedJobCodes.length === 1
                  ? RecuritmentHRMsg.SingleHRSuccessMsg
                  : RecuritmentHRMsg.HRSuccess,
              Type: HRMSAlertOptions.Success,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  setAlertPopupOpen(false);
                  setIsLoading(false);
                  await fetchData(props.TabDetails[0]?.[0]?.Value);
                  await pendingcountTabs();
                }
              },
            };
            setAlertPopupOpen(true);
            setIsLoading(true);
            setalertProps(SuccessAlert);
          }
        }
      }
    } catch (error) {
      console.log("failed Insert Recruitment Data ", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleAgencySubmit = async () => {
    try {
      const IsVaild = !Validation();
      if (IsVaild) {
        setAssignHR(false);
        setIsLoading(true);
        if (selectedJobCodes.length > 0) {
          let ResponseStatusCode;
          for (const selectedJob of selectedJobCodes) {
            const correspondingJob = data.find(
              (item) => item.ID === selectedJob.ID,
            );
            const HRMSExternalAgents = await CommonServices.GetMasterData(
              ListNames.HRMSExternalAgents,
            );
            let matchedAgents = HRMSExternalAgents.data.filter(
              (data: { Id: number }) =>
                AssignHRData.AssignRecruitmentAgencies.some(
                  (item) => item.key === data.Id,
                ),
            );

            let agentDetails: jobsXAgents[] = matchedAgents.map((item: any) => {
              AssignHRData.AssignRecruitmentAgencies.filter(
                (data) => data.key === item.Id,
              );
              return {
                agentId: item.AgentCode,
                // isSuspended: 1,
              };
            });
            let JobCodeFilter = [
              {
                FilterKey: "JobCodeId",
                Operator: "eq",
                FilterValue: selectedJob?.JobCodeId,
              },
              { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
            ];
            let JobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
              JobCodeFilter,
              "and",
            );
            let JobUniquedata = JobUniqueValue.data[0]?.JobUniqueKey || "";
            const AgentDetails: profileXagent = {
              jobCode: JobUniquedata,
              jobsXAgents: agentDetails,
            };
            await GetPortalJobsService.UpsertAgenciesJobs(AgentDetails)
              .then(async (res) => {
                if (res.status === ResponeStatus.SUCCESS) {
                  ResponseStatusCode = res.status;
                  if (correspondingJob) {
                    const recruitmentID: number = correspondingJob.ID;

                    const agencyIDs =
                      AssignHRData.AssignRecruitmentAgencies.map(
                        (agency) => agency.key,
                      );

                    if (agencyIDs.length === 0) {
                      return;
                    }
                    const agencyData = agencyIDs.map((agencyID) => ({
                      key: agencyID,
                      text:
                        AssignHRData.AssignRecruitmentAgencies.find(
                          (agency) => agency.key === agencyID,
                        )?.text || AssignHRData.AssignRecruitmentHR.text,
                      RecruitmentID: recruitmentID,
                    }));

                    const response =
                      await getVRRDetails.InsertExternalAgencyDetails(
                        agencyData,
                        recruitmentID,
                      );

                    if (response.status === ResponeStatus.SUCCESS) {
                      const commentsData: InsertComments = {
                        RoleId:
                          storedStringRef.current ===
                          TabName.AssignRecuritmentHR
                            ? RoleID.RecruitmentHRLead
                            : RoleID.RecruitmentHR,
                        RecruitmentIDId: recruitmentID,
                        Comments: AssignHRData.Comments,
                      };

                      await getVRRDetails.InsertCommentsList(commentsData);
                      ResponseStatusCode = response.status;
                      try {
                        // await SPServices.SPUpdateItem({
                        //   Listname: ListNames.HRMSRecruitmentDptDetails,
                        //   RequestJSON: { Action: WorkflowAction.Approved },
                        //   ID: recruitmentID,
                        // });
                      } catch (updateError) {
                        console.error(updateError);
                      }

                      setAssignHRData((prevState) => ({
                        ...prevState,
                        AssignRecruitmentAgencies: [],
                        Comments: "",
                      }));
                      setData((prevData) =>
                        prevData.map((item) => ({
                          ...item,
                          Checked: false,
                        })),
                      );
                      setSelectedJobCodes([]);
                    }
                  } else {
                    console.log(
                      `No corresponding job found for RecruitmentID/VRRId: ${selectedJob.ID}`,
                    );
                  }
                } else {
                  let ApiErrorMsg = {
                    Message: RecuritmentHRMsg.APIErrorMsg,
                    Type: HRMSAlertOptions.Error,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                        setIsLoading(false);
                        setAssignHRData((prevState) => ({
                          ...prevState,
                          AssignRecruitmentAgencies: [],
                          Comments: "",
                        }));
                        setData((prevData) =>
                          prevData.map((item) => ({
                            ...item,
                            Checked: false,
                          })),
                        );
                        setSelectedJobCodes([]);
                      }
                    },
                  };
                  setIsLoading(true);
                  setAlertPopupOpen(true);
                  setalertProps(ApiErrorMsg);
                }
              })
              .catch((error) => {
                console.log("Candidate details doesn't fetch the data", error);
              });
          }
          if (ResponseStatusCode === ResponeStatus.SUCCESS) {
            let CancelAlert = {
              Message:
                selectedJobCodes.length === 1
                  ? RecuritmentHRMsg.SingleAgencyMsg
                  : RecuritmentHRMsg.AgencySucess,
              Type: HRMSAlertOptions.Success,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  setAlertPopupOpen(false);
                  setIsLoading(false);
                  await fetchData(props.TabDetails[0]?.[0]?.Value);
                  await pendingcountTabs();
                }
              },
            };
            setIsLoading(true);
            setAlertPopupOpen(true);
            setalertProps(CancelAlert);
          } else {
          }
        }
      }
    } catch (error) {
      console.log("failed Insert Agency Data ", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[],
  ) => {
    if (TabValue === activeTab) {
      storedStringRef.current = TabNames;
    }
    let Action: any;
    // let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      // StatusID = StatusData.filter((item) => item.StatusId);
    }

    switch (TabNames) {
      case TabName.AssignRecuritmentHR:
      case TabName.AssignAgencies:
        return (
          <CheckboxDataTable
            data={data}
            columns={columnConfig(
              TabValue,
              Number(Action[0]?.Action?.[0]),
              TabNames,
            )}
            rows={rows}
            onPageChange={(event) => onPageChange(event)}
            handleRefresh={() => handleRefresh(TabValue)}
            handleSelectedRow={handleCheckbox}
            onSelectAllRow={onSelectAllChange}
            handleAssignBtn={AssignBtn_fn}
            AssignBtnValidation={false}
            MasterData={props || {}}
            assignLabel={
              props.CurrentRoleID.includes(RoleID.RecruitmentHR)
                ? "Assign Agencies"
                : "Assign HR"
            }
          />
        );

      case TabName.UploadONEMDoc:
      case TabName.MySubmission:
      case TabName.UploadAdvertisement:
      case TabName.ReviewJobAdvertisement:
      case TabName.ReviewScorecard:
      case TabName.InterviewQuestion:
      case TabName.ReviewProfile:
      case TabName.AdvertExtension:
      case TabName.UploadCV:
        return (
          <SearchableDataTable
            data={data}
            columns={columnConfig(TabValue, Action[0]?.ActionId?.[0], TabNames)}
            rows={rows}
            onPageChange={(event) => onPageChange(event)}
            handleRefresh={() => handleRefresh(TabValue)}
            MasterData={props}
          />
        );
      case TabName.Evaluation:
        return (
          <InterviewPanelDataTable
            data={data}
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

      // case TabName.Evaluation:
      // return <InterviewPanelList {...props} TabValue={activeTab} />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.AssignRecuritmentHR:
        return tabStyle(tab.TabName, pendingcount.AssignHRCount);
      // return pendingcount?.ReviewPrfileCount > 0
      //   ? `${tab.TabName} (${pendingcount.ReviewPrfileCount})`
      //   : tab.TabName;
      case TabName.UploadONEMDoc:
        return tabStyle(tab.TabName, pendingcount.UploadONEMCount);
      case TabName.UploadAdvertisement:
        return tabStyle(tab.TabName, pendingcount.UploadAdvertisementCount);

      case TabName.ReviewJobAdvertisement:
        if (props.CurrentRoleID.includes(RoleID.LineManager)) {
          return tabStyle(tab.TabName, pendingcount.ReviewLineManagerCount);
        } else {
          return tabStyle(tab.TabName, pendingcount.ReviewHODCount);
        }
      // case TabName.AssignAgencies:
      //   return tabStyle(tab.TabName, pendingcount.AssignAgencyCount);
      case TabName.InterviewQuestion:
        return tabStyle(tab.TabName, pendingcount.lineManagerInterviewCount);
      case TabName.Evaluation:
        return tabStyle(tab.TabName, pendingcount.EvaluationCount);
      case TabName.ReviewProfile:
        return tabStyle(tab.TabName, pendingcount.ReviewProfileCount);
      case TabName.ReviewScorecard:
        return tabStyle(tab.TabName, pendingcount.ReviewScoreCardCount);
      default:
        return tab.TabName;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: getTabLabel(tab), //  `${tab.TabName} (${data.length})`,
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

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const AlertpopupSuccess = (msg: string) => {
    setDatePopup(false);
    setIsLoading(true);
    if (msg === HRMSAlertOptions.Success) {
      let SuccessAlert = {
        Message: RecuritmentHRMsg.AdvertExtendsionSuccessMsg,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(SuccessAlert);
      setIsLoading(false);
    } else {
      let APIError = {
        Message: RecuritmentHRMsg.APIErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            // props.navigation("/RecurimentProcess");
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(APIError);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <React.Fragment>
          <div className="menu-card">
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
            />
          </div>
        </React.Fragment>
      </CustomLoader>
      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
      {DatePopup && (
        <>
          <CustomDialogbox
            Style={{
              width: "40vw",
              height: "28vw",
              padding: "0px",
              overflowX: "hidden",
            }}
            visible={DatePopup}
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
                  {"Advertisement Extension"}
                </h2>
              </div>
            }
            children={
              <DateExtension
                RecuritmentData={selectedrowdata[0]}
                onClose={() => setDatePopup(false)}
                ModelDropDown={props}
                AlertpopupSuccess={(msg) => AlertpopupSuccess(msg)}
                setIsLoading={setIsLoading}
              />
            }
            onClose={() => setDatePopup(false)}
          />
        </>
      )}
      {AssignHR ? (
        <>
          <div>
            <CustomDialogbox
              Style={{
                width: "45vw",
                height: "35vw",
                padding: "0px",
                overflowX: "hidden",
              }}
              visible={AssignHR}
              children={
                <AssignRecuritmentHR
                  jobCodes={allJobData}
                  selectedJobCodes={selectedJobCodes}
                  onSelectAllChange={() => onSelectAllChange}
                  onRowChange={() => handleCheckbox}
                  CurrentRole={props.CurrentRoleID}
                  onClose={handleCancel}
                  AssignedHRId={props.stateValue?.AssignedHRId}
                  validationErrors={validationErrors}
                  ValueData={AssignHRData}
                  AssignRecruitmentHROption={AssignRecruitmentHROption}
                  AssignRecruitmentAgenciesOption={
                    AssignRecruitmentAgenciesOption
                  }
                  handleAutoComplete={(item) => handleAutoComplete(item)}
                  handleAgencyChange={(item: AutoCompleteItem[]) =>
                    handleAgencyChange(item)
                  }
                  handleInputChangeTextArea={(item: string) =>
                    handleInputChangeTextArea(item)
                  }
                  AssignHRSubmit={
                    props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)
                      ? () => handleSubmit()
                      : () => handleAgencySubmit()
                  }
                />
              }
              onClose={() => setAssignHR(false)}
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
              footer={
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
                    onClick={() => handleCancel()}
                    Style={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      color: "white",
                      width: "50%",
                    }}
                  />

                  <ReuseButton
                    label="Assign"
                    onClick={async () => {
                      if (
                        props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)
                      ) {
                        await handleSubmit();
                      } else {
                        await handleAgencySubmit();
                      }
                    }}
                    Style={{
                      backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                      color: "white",
                      width: "50%",
                    }}
                  />
                </div>
              }
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default RecruitmentProcess;
