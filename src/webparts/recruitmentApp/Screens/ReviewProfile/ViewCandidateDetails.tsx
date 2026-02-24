import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import ReuseButton from "../../components/ReuseButton";
import CustomInput from "../../components/CustomInput";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  Choices,
  COIWarningMsg,
  ColorCode,
  DocumentFolderName,
  DocumentLibraray,
  HRMSAlertOptions,
  InterviewLevels,
  labelName,
  ListNames,
  ProfileReview,
  ProfileReviewl2,
  RecuritmentHRMsg,
  ResponeStatus,
  ReviewProfileScore,
  RoleID,
  RoleName,
  RoleProfileMaster,
  StatusId,
  TabName,
  TooltipHeader,
  TooltipType,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomViewDocument from "../../components/CustomViewDocument";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import {
  CandidateProfile,
  COIType,
  sendEmail,
  WorkflowJson,
} from "../../Models/ApIInterface";
import CustomSignature from "../../components/CustomSignature";
import IsValid from "../../components/Validation";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import {
  CandidateDetails,
  COIAttach,
} from "../../Services/CareerPortalApi/IGetPortalJobs";
import {
  addWeekdays,
  ConvertUtc,
  DetailRow,
  GetWorkflowStatusByID,
} from "../../components/TabMerge";
import { Label } from "@fluentui/react";
import AttachmentButton from "../../components/AttachmentButton";
import CustomViewAttachment from "../../components/CustomViewAttachment";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import EmployeeDetailsTooltip from "../ScreenComponent/EmployeeDetailsTooltip";
import CommanComments from "../../components/CommanComments";
import { DataSyncToRecruitmentResponse } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import {
  Attachment,
  ButtonAction,
  CheckboxContent,
  EmailTemplateCodes,
  IsCandidateFit,
  labelNames,
  ValidationAction,
} from "../../utilities/LabelName";
import ToolTipTable from "../ScreenComponent/ToolTipTable";
import { fetchRooms } from "../../Services/AxiosService/TeamsMeetingApi/fetchRooms";
import { InterviewScheduleCard } from "./InterviewScheduleCard";
import { navigateToList } from "./ReuseFn";
import {
  ICreateMeeting,
  IFetchMeeting,
} from "../../Services/AxiosService/axiosConfig";
import { createMeeting } from "../../Services/AxiosService/TeamsMeetingApi/scheduleMeeting";
import { fetchMeetings } from "../../Services/AxiosService/TeamsMeetingApi/fetchMeeting";

type InterviewedLevelValue = {
  Levels: string;
  Grade: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
  CandidateScoreValue: AutoCompleteItem;
  CandidateScoreOption: AutoCompleteItem[];
  COIProfileLabel: AutoCompleteItem;
  COIProfileLabelOption: AutoCompleteItem[];
  COIAttachment: IDocFiles[];
  COIComments: string;
  COIReason: string;
};

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
  AssignInterviewLevel1: boolean;
  InterviewTime: boolean;
  CandidateScoreValue: boolean;
  COIProfileLabel: boolean;
  COIAttachment: boolean;
  COIComments: boolean;
  RoomData: boolean;
  startDateL1: boolean;
  endDateL1: boolean;
  startDateL2: boolean;
  endDateL2: boolean;
  RoomDateL2: boolean;
};

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
};

type Level2Data = {
  startDateL1: Date | undefined;
  endDateL1: Date | undefined;
  startDateL2: Date | undefined;
  endDateL2: Date | undefined;
  RoomData: AutoCompleteItem;
  RoomDataOption: AutoCompleteItem[];
  RoomDateL2: AutoCompleteItem;
};

const ViewCandidateDetails = (props: any) => {
  // console.log(props, "ViewCandidateDetails");
  const [RecrutimentData, setRecrutimentData] = useState<
    DataSyncToRecruitmentResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [CandidateProfile, setCandidateProfile] = useState<CandidateProfile>({
    CandidateID: "",
    profileID: 0,
    JobCode: "",
    JobTitle: "",
    ApplicantName: "",
    ApplicantSurName: "",
    Nationality: "",
    FristName: "",
    MiddleName: "",
    ResidentialAddress: "",
    DOB: "",
    ContactNumber: "",
    Email: "",
    Gender: "",
    HighestQualification: "",
    ExperienceMining: "",
    ExperRelatedfield: 0,
    Status: "",
    StatusId: "",
    Agencies: "",
    CandidateResume: [],
    RoleProfile: [],
    Advertisement: [],
    Comments: [],
    workflowStatusId: "",
    hrComments: "",
    JobVaildFromDate: "",
    JobVaildToDate: "",
    CandidateResumeLink: "",
    ConflictsOfInterest: "",
    disability: "",
    disabilityReason: "",
    identityValue: "",
    identityType: "",
    Age: "",
    NumberOftax: "",
    CurrentEmployer: "",
    CurrentPosition: "",
    WillingToRelocate: "",
    previouslyworkedMine: "",
    familylinks: "",
    businesslinks: "",
    familyDocuments: [],
    businessDocuments: [],
    CountryofOrgin: "",
    Citizenship: "",

    FamilyLink: "",
    BusinessLink: "",
    GPA: 0,

    COIAppreve: "",
    COIComments: "",
    COIReason: "",

    countryOfResidency: "",
    residentStatus: "",
    maritalStatus: "",
    childrenDetails: [],
    employeeReferenceDetails: undefined,
    maritalStatusId: "",

    joiningDate: "",
    noticePeriod: "",
    hasIvanhoeZijinExperience: "",
    companyDetails: undefined,
    businesslinkscompany: "",
    NatioCode: "",
    PreviousEmployerDetails: undefined,
    LanguageKnown: [],
    PPEDetails: [],
  });
  const todaydate = new Date();
  // todaydate = addWeekdays(todaydate, 5);
  const MinDateInterview = addWeekdays(todaydate, 5);
  const MaxDateInterview = addWeekdays(todaydate, 130);

  const [InterviewedLevel, setInterviewedLevel] =
    useState<InterviewedLevelValue>({
      Levels: "",
      Grade: "",
      AssignInterviewedLevel1Option: [],
      AssignInterviewLevel1: [],
      AssignInterviewedLevel2: [],
      CandidateScoreValue: { key: 0, text: "" },
      CandidateScoreOption: ReviewProfileScore,
      COIProfileLabel: { key: 0, text: "" },
      COIProfileLabelOption: [],
      COIAttachment: [],
      COIComments: "",
      COIReason: "",
    });
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [Checkbox, setCheckbox] = useState<boolean>(false);
  const [SignDate, setSignDate] = useState<Date | any>();
  const [actionValue, setActionValue] = useState<ActionValue>({
    CandidateStatus: "",
    Comments: "",
  });
  const [validationErrors, setValidationErrors] =
    React.useState<ValidationError>({
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false,
      AssignInterviewLevel1: false,
      InterviewTime: false,
      CandidateScoreValue: false,
      COIProfileLabel: false,
      COIAttachment: false,
      COIComments: false,
      RoomData: false,
      startDateL1: false,
      endDateL1: false,
      startDateL2: false,
      endDateL2: false,
      RoomDateL2: false,
    });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [submitBtn, setSubmitBtn] = React.useState<string>("");
  const [level2Date, setLevel2Date] = useState<boolean>(false);
  const [DateState, setDateState] = useState<Level2Data>({
    startDateL1: undefined,
    endDateL1: undefined,
    startDateL2: undefined,
    endDateL2: undefined,
    RoomData: { key: 0, text: "" },
    RoomDateL2: { key: 0, text: "" },
    RoomDataOption: [],
  });
  const [rescheduleValidation, setRescheduleValidation] =
    useState<boolean>(false);
  console.log("rescheduleValidation", rescheduleValidation);

  const storedNoOfInterviewpanel = React.useRef<boolean>(false);
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [InterviewPanel, setInterviewPanel] = useState<any[]>([]);

  const GetInterviewPanelDetails = async () => {
    // setIsLoading(true);
    const filterConditions = [
      {
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: props.stateValue?.RecruitmentID,
      },
    ];
    const Conditions = "";
    const response = await getVRRDetails.GetRecruitmentDetails(
      filterConditions,
      Conditions,
    );
    const Gradelevel = await CommonServices.GetGradeLevel(
      response.data[0]?.PatersonGrade,
    );
    // console.log(Gradelevel);

    const filterJDEMapping = [
      {
        FilterKey: "BUCId",
        Operator: "eq",
        FilterValue: response.data[0]?.BusinessUnitCodeId,
      },
    ];
    const AssignHRID = await CommonServices.getUserGuidByEmail(
      response.data[0]?.AssignEMail,
    );
    let AssignHR = {
      key: Number(AssignHRID.data?.key),
      text: response.data[0]?.AssignEMail,
    };
    let Levels: string[] =
      Gradelevel.data[0]?.Level === InterviewLevels.Level1
        ? [InterviewLevels.Level1]
        : [InterviewLevels.Level1, InterviewLevels.Level2];
    // let InterviewPanel =
    //   props.stateValue?.StatusId ===
    //   StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
    //     ? false
    //     : true;
    const AssignInterviewPanel = await getVRRDetails.GetInterviewPanelDetails(
      filterJDEMapping,
      Conditions,
      AssignHR,
      props.stateValue?.ID,
      Levels,
      props.stateValue?.StatusId,
    );

    let panel: any[] = [];

    if (
      props.stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
    ) {
      storedNoOfInterviewpanel.current =
        AssignInterviewPanel.data &&
        AssignInterviewPanel.data?.Level2Panel.length < 3
          ? false
          : true;
      panel =
        AssignInterviewPanel.data?.Level2Panel &&
        AssignInterviewPanel?.data?.Level2Panel?.length > 0
          ? AssignInterviewPanel?.data?.Level2Panel
          : [];
    } else {
      storedNoOfInterviewpanel.current =
        AssignInterviewPanel.data &&
        AssignInterviewPanel.data?.Level1Panel.length < 3
          ? false
          : true;
      panel =
        AssignInterviewPanel.data?.Level1Panel &&
        AssignInterviewPanel?.data?.Level1Panel?.length > 0
          ? AssignInterviewPanel?.data?.Level1Panel
          : [];
    }

    setInterviewPanel(panel);

    setInterviewedLevel((prevState) => ({
      ...prevState,
      Grade: response.data[0]?.PatersonGrade,
      Levels: Gradelevel.data[0]?.Level,
      AssignInterviewedLevel1Option:
        AssignInterviewPanel.data && AssignInterviewPanel.data?.InterviewPanel
          ? AssignInterviewPanel.data?.InterviewPanel
          : [],
      AssignInterviewLevel1:
        AssignInterviewPanel.data && AssignInterviewPanel.data?.Level1Panel
          ? AssignInterviewPanel.data?.Level1Panel
          : [],
      AssignInterviewedLevel2:
        AssignInterviewPanel.data && AssignInterviewPanel.data?.Level2Panel
          ? AssignInterviewPanel.data?.Level2Panel
          : [],
    }));
  };
  console.log(InterviewedLevel.AssignInterviewLevel1, "AssignInterviewLevel1");

  const fetchCandidateData = async (ID: number) => {
    setIsLoading(true);
    try {
      let filterConditions = [];
      let Conditions = "";
      filterConditions.push({
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: ID,
      });

      const data = await InterviewServices.GetCombinedCandidatePositionDetails(
        filterConditions,
        Conditions,
        props.EmployeeList,
      );

      if (data.status === 200 && data.data !== null) {
        const op = data.data[0];
        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          op?.JobCode,
        );

        let advertisementDocuments: any[] = [];
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          advertisementDocuments = response.data.map((doc: any) => ({
            name: doc.name,
            content: doc.content,
          }));
        }

        const RoleProfileresponse = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RoleProfileMaster,
          op?.JobCode,
          RoleProfileMaster.RoleProfile,
        );

        let roleProfileDocuments: any[] = [];
        if (
          RoleProfileresponse.status === 200 &&
          RoleProfileresponse.data &&
          RoleProfileresponse.data.length > 0
        ) {
          roleProfileDocuments = RoleProfileresponse.data.map((doc: any) => ({
            name: doc.name,
            content: doc.content,
          }));
        }
        setCandidateProfile((prevState: any) => ({
          ...prevState,
          CandidateID: op?.ID,
          profileID: op?.ProfileID,
          JobCode: op?.JobCode,
          JobTitle: op?.PositionTitle,
          ApplicantName: op?.FullName,
          ApplicantSurName: op?.LastName,
          Nationality: op?.Nationality,
          FristName: op?.FristName,
          MiddleName: op?.MiddleName,
          ResidentialAddress: op?.ResidentialAddress,
          DOB: op?.DOB,
          ContactNumber: op?.ContactNumber,
          Email: op?.Email,
          Gender: op?.Gender,
          HighestQualification: op?.Qualification,
          ExperienceMining: op?.TotalYearOfExperiance,
          ExperRelatedfield: op?.ReleventExperience,
          CandidateResume: op?.CandidateCVDoc,
          RoleProfile: roleProfileDocuments,
          Advertisement: advertisementDocuments,
          Status: op?.Status,
          Agencies: op?.ExternalAgentDetails?.AgentName,
          Comments: "",
          workflowStatusId: 0,
          hrComments: "",
          JobVaildFromDate: "",
          JobVaildToDate: "",
          ConflictsOfInterest: op?.ConflictsOfInterest,
          disability: op?.disability,
          disabilityReason: op?.disabilityReason,

          FamilyLink: op?.FamilyLink,
          BusinessLink: op?.BusinessLink,
          GPA: op?.GPA,
        }));
        void (await GetInterviewPanelDetails());
        // let getProfileLabel = InterviewedLevel.COIProfileLabelOption.map((item:any) => item.text === op?.COIAppreve);
        setInterviewedLevel((prev) => ({
          ...prev,
          COIComments: op?.COIComments,
          COIProfileLabel: { key: 1, text: op?.COIAppreve },
        }));

        let StartDate = new Date(op?.InterviewDate); // moment(op?.InterviewDate).format("DD-MMM-YYYY - hh:mm A",);
        let EndDate = new Date(op?.InterviewTime); //moment(op?.InterviewTime).format("DD-MMM-YYYY - hh:mm A");

        setDateState((prevState: any) => ({
          ...prevState,
          startDateL1: StartDate,
          endDateL1: EndDate,
        }));

        if (
          props.stateValue?.initialTab === TabName.AssignInterviewPanel &&
          props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2
        ) {
          let InterviewDateLevel2 = new Date(op?.InterviewDateLevel2);
          setDateState((prevState: any) => ({
            ...prevState,
            startDateL2: InterviewDateLevel2,
            RoomDateL2: { key: 0, text: op?.InterviewLinkLevel2 },
            // InterviewTime: op?.InterviewTimeLevel2,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.RecruitmentID,
        },
      ];
      const Conditions = "";
      let RecrutimentData = await getVRRDetails.GetRecruitmentDetails(
        filterConditions,
        Conditions,
      );
      setRecrutimentData(RecrutimentData.data);
      await GetPortalJobsService.getCandidateProfile(
        props.stateValue?.ID,
        props.EmployeeList,
        RecrutimentData.data[0],
      )
        .then(async (res) => {
          let response = res.data?.[0];
          if (
            (props.stateValue.tab === "tab2" ||
              props.stateValue.tab === "tab3") &&
            props.stateValue?.initialTab === TabName.AssignInterviewPanel
          ) {
            await fetchCandidateData(props.stateValue?.ID);
          } else {
            if ((res.data?.length ?? 0) > 0) {
              if (props.stateValue?.StatusId != workflowStatusApi.HRPending) {
                let COIAttchObj: COIAttach = {
                  RequestID: String(response?.profileID),
                  DocumentName: DocumentFolderName.COIAttach,
                };
                let COIAttach =
                  await GetPortalJobsService.fetchCOIAttachment(COIAttchObj);
                setInterviewedLevel((prev) => ({
                  ...prev,
                  COIAttachment: COIAttach.data,
                }));
              }

              setCandidateProfile((prevState: any) => ({
                ...prevState,
                CandidateID: response?.CandidateID,
                profileID: response?.profileID,
                JobCode: response?.JobCode,
                JobTitle: response?.JobTitle,
                ApplicantName: response?.ApplicantName,
                ApplicantSurName: response?.ApplicantSurName,
                Nationality: response?.Nationality,
                FristName: response?.FristName,
                MiddleName: response?.MiddleName,
                ResidentialAddress: response?.ResidentialAddress,
                DOB: response?.DOB,
                ContactNumber: response?.ContactNumber,
                Email: response?.Email,
                Gender: response?.Gender,
                HighestQualification: response?.HighestQualification,
                ExperienceMining: response?.ExperienceMining,
                ExperRelatedfield: response?.ExperRelatedfield,
                CandidateResume: response?.CandidateResume,
                RoleProfile: response?.RoleProfile,
                Advertisement: response?.Advertisement,
                Status: response?.Status,
                Agencies: response?.Agencies
                  ? response?.Agencies
                  : labelName.Candidate,
                Comments: response?.Comments,
                workflowStatusId: response?.workflowStatusId,
                hrComments: response?.hrComments,
                JobVaildFromDate: response?.JobVaildFromDate,
                JobVaildToDate: response?.JobVaildToDate,
                CandidateResumeLink: response?.CandidateResumeLink,
                ConflictsOfInterest: response?.ConflictsOfInterest,
                disability: response?.disability,
                disabilityReason: response?.disabilityReason,
                identityType: response?.identityType,
                identityValue: response?.identityValue,
                NumberOftax: response?.NumberOftax,
                CurrentEmployer: response?.CurrentEmployer,
                CurrentPosition: response?.CurrentPosition,
                WillingToRelocate: response?.WillingToRelocate,
                previouslyworkedMine: response?.previouslyworkedMine,
                familylinks: response?.familylinks,
                businesslinks: response?.businesslinks,
                familyDocuments: response?.familyDocuments,
                businessDocuments: response?.businessDocuments,

                Age: response?.Age,
                CountryofOrgin: response?.CountryofOrgin,
                Citizenship: response?.Citizenship,

                FamilyLink: response?.FamilyLink,
                BusinessLink: response?.BusinessLink,
                GPA: response?.GPA,

                countryOfResidency: response?.countryOfResidency,
                residentStatus: response?.residentStatus,
                maritalStatus: response?.maritalStatus,
                childrenDetails: response?.childrenDetails || [],
                employeeReferenceDetails: response?.employeeReferenceDetails,
                maritalStatusId: response?.maritalStatusId,
                hasIvanhoeZijinExperience: response?.hasIvanhoeZijinExperience,
                companyDetails: response?.companyDetails,
                businesslinkscompany: response?.businesslinkscompany,
                NatioCode: response?.NatioCode || "",
                LanguageKnown: response?.LanguageKnown || [],
                PPEDetails: response?.PPEDetails || [],
              }));
              // console.log(response?.PPEDetails, "response?.PPEDetails");

              setInterviewedLevel((prev) => ({
                ...prev,
                COIReason: response?.COIReason || "",
              }));
              if (props.stateValue?.StatusId != workflowStatusApi.HRPending) {
                setInterviewedLevel((prev) => ({
                  ...prev,
                  COIComments: response?.COIComments || "",
                  COIProfileLabel: { key: 1, text: response?.COIAppreve || "" },
                }));
              }
            } else {
              const APIErrorMsg = {
                Message: RecuritmentHRMsg.APIErrorMsg,
                Type: HRMSAlertOptions.Error,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                      props.navigation(
                        "/ReviewProfileList/ReviewCandidateList",
                        {
                          state: {
                            ID: props.stateValue?.RecruitmentID,
                            TabNames: props.stateValue?.initialTab,
                            ButtonAction: ButtonAction.View,
                            JobCode: props.stateValue?.JobCode,
                            tab: props.stateValue?.tabs,
                            tabs: props.stateValue.tab,
                            JobCodeID: props.stateValue?.JobCodeID,
                            CandidateTabName: props.stateValue?.TabNamed,
                          },
                        },
                      );
                    } else {
                      props.navigation(
                        "/RecurimentProcess/ReviewCandidateList",
                        {
                          state: {
                            ID: props.stateValue?.RecruitmentID,
                            TabNames: props.stateValue?.initialTab,
                            ButtonAction: ButtonAction.View,
                            JobCode: props.stateValue?.JobCode,
                            tab: props.stateValue?.tabs,
                            tabs: props.stateValue.tab,
                            JobCodeID: props.stateValue?.JobCodeID,
                          },
                        },
                      );
                    }

                    setAlertPopupOpen(false);
                  } else {
                    setAlertPopupOpen(false);
                  }
                },
              };

              setAlertPopupOpen(true);
              setalertProps(APIErrorMsg);
              setIsLoading(false);
            }
          }
          if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
            void (await GetInterviewPanelDetails());
            let AvailableRooms = await fetchRooms();
            console.log(AvailableRooms, "AvailableRooms");
            let RoomOption: AutoCompleteItem[] = AvailableRooms.data.map(
              (item) => {
                return {
                  key: Number(item.RoomEmailId),
                  text: item.RoomName,
                };
              },
            );
            setInterviewedLevel((prev) => ({
              ...prev,
              RoomDataOption: RoomOption,
            }));
            // setIsLoading(false);
          } else {
            // let COIProfile = props.EmployeeList.map((item: any) => ({
            //   key: item.Email,
            //   text: `${item?.FirstName || ""} ${item?.MiddleName || ""} ${
            //     item?.LastName || ""
            //   }`,
            // }));
            let COIOptions = await GetPortalJobsService.GetCOIProfileOption(
              RecrutimentData.data[0],
            );
            setInterviewedLevel((prev) => ({
              ...prev,
              COIProfileLabelOption: COIOptions.data ?? [],
            }));
            // setIsLoading(false);
          }
          if (
            response?.workflowStatusId === workflowStatusApi.HROnHold ||
            response?.workflowStatusId === workflowStatusApi.HROnHold ||
            response?.workflowStatusId ===
              workflowStatusApi.LineManagerLevel1OnHold ||
            response?.workflowStatusId ===
              workflowStatusApi.LineManagerLevel2OnHold
          ) {
            setActionValue((prevState: any) => ({
              ...prevState,
              CandidateStatus: IsCandidateFit.OnHold,
            }));
          }

          if (
            (props.stateValue?.ButtonAction === ButtonAction.View &&
              response?.workflowStatusId === workflowStatusApi.HRRejected) ||
            response?.workflowStatusId ===
              workflowStatusApi.LineManagerLevel1Rejected ||
            response?.workflowStatusId ===
              workflowStatusApi.LineManagerLevel2Rejected
          ) {
            setActionValue((prevState: any) => ({
              ...prevState,
              CandidateStatus: IsCandidateFit.No,
            }));
          }
          let CandidateScore = ReviewProfileScore.filter(
            (item) => item.text === CandidateProfile.hrComments,
          );
          setInterviewedLevel((prevState) => ({
            ...prevState,
            CandidateScoreValue: CandidateScore[0],
          }));
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchData();
    setSignDate(
      new Date(
        todaydate.getFullYear(),
        todaydate.getMonth(),
        todaydate.getDate(),
        todaydate.getHours(),
        todaydate.getMinutes(),
        todaydate.getSeconds(),
      ),
    );

    setSubmitBtn(
      props.stateValue?.initialTab === TabName.AssignInterviewPanel
        ? props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2 ||
          props.stateValue?.StatusId === StatusId.InterviewScheduled
          ? ButtonAction.Reschedule //"Reschedule"
          : ButtonAction.ScheduleforInterview //"Schedule for Interview "
        : actionValue.CandidateStatus === IsCandidateFit.No
          ? ButtonAction.Reject //"Reject"
          : ButtonAction.Submit, //"Submit"
    );
    const newTabNames = [
      { tabName: props.stateValue?.initialTab },
      // { tabName: props.stateValue?.PreActionBtn },
      { tabName: TabName.ViewCandidateList },
      // { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateDetails },
    ];
    setTabNameData(newTabNames);
    setLevel2Date(
      props.stateValue?.initialTab === TabName.AssignInterviewPanel &&
        (props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
          props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2)
        ? true
        : false,
    );
  }, []);

  // const Get_InterviewPanelName = (Email: string, Id: number) => {
  //   const employee = props.EmployeeList.find((emp: any) => {
  //     return emp.Email?.toLowerCase() === Email?.toLowerCase();
  //   });

  //   if (employee) {
  //     return {
  //       key: Id,
  //       text: `${employee.FirstName || ""} ${employee.MiddleName || ""} ${
  //         employee.LastName || ""
  //       }`,
  //     };
  //   }

  //   return null;
  // };

  const handleRadioChange = async (item: string) => {
    setActionValue((prevState: any) => ({
      ...prevState,
      CandidateStatus: item,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      CandidateStatus: false,
    }));
    setSubmitBtn(
      item === IsCandidateFit.No ? ButtonAction.Reject : ButtonAction.Submit,
    );
  };

  const handleInputChangeTextArea = (value: string | any) => {
    setActionValue((prevState: any) => ({
      ...prevState,
      Comments: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      Comments: false,
    }));
  };

  const handleDateChange = (start: Date, end: Date, Level: string) => {
    if (!start || !end) return;
    if (Level === InterviewLevels.Level1) {
      setDateState((prev) => ({
        ...prev,
        startDateL1: start,
        endDateL1: end,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        startDateL1: false,
        endDateL1: false,
      }));
    }

    if (Level === InterviewLevels.Level2) {
      setDateState((prev) => ({
        ...prev,
        startDateL2: start,
        endDateL2: end,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        startDateL2: false,
        endDateL2: false,
      }));
    }

    let EMail = InterviewPanel.map((item) => String(item.Email));
    let obj: IFetchMeeting = {
      Email: EMail,
      startDate: DateState.startDateL1 ? ConvertUtc(DateState.startDateL1) : "",
      endDate: DateState.endDateL1 ? ConvertUtc(DateState.endDateL1) : "",
    };
    let getMeeting = fetchMeetings(obj);
    console.log(getMeeting);
  };

  const handleMulitiSelect = (value: AutoCompleteItem[]) => {
    setInterviewedLevel((prevState: any) => ({
      ...prevState,
      AssignInterviewLevel1: value,
    }));

    setValidationErrors((prevState) => ({
      ...prevState,
      AssignInterviewLevel1: false,
    }));
  };

  // const handleInterviewTimeChange = (value: string | undefined) => {
  //   if (level2Date) {
  //     setLevel2Data((prevState: any) => ({
  //       ...prevState,
  //       InterviewTime: value,
  //     }));
  //     setValidationErrors((prevState) => ({
  //       ...prevState,
  //       InterviewTimeLevel2: false,
  //     }));
  //   } else {
  //     setInterviewedLevel((prevState: any) => ({
  //       ...prevState,
  //       InterviewTime: value,
  //     }));
  //     setValidationErrors((prevState) => ({
  //       ...prevState,
  //       InterviewTime: false,
  //     }));
  //   }
  // };

  // const handleInputChange = (value: string) => {
  //   if (level2Date) {
  //     setLevel2Data((prevState: any) => ({
  //       ...prevState,
  //       InterviewMeetingInviteLink: value,
  //     }));
  //     setValidationErrors((prevState) => ({
  //       ...prevState,
  //       InterviewMeetingInviteLinkLevel2: false,
  //     }));
  //   } else {
  //     setInterviewedLevel((prevState: any) => ({
  //       ...prevState,
  //       InterviewMeetingInviteLink: value,
  //     }));
  //     setValidationErrors((prevState) => ({
  //       ...prevState,
  //       InterviewMeetingInviteLink: false,
  //     }));
  //   }
  // };

  const handleAutoComplete = async (
    value: AutoCompleteItem | null,
    item: string,
  ) => {
    setInterviewedLevel((prevState) => ({
      ...prevState,
      [item]: value || { key: 0, text: "" },
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      [item]: false, // ReviewFeedback: false,
    }));
  };

  const handleDocument = (StateValue: string, value: IDocFiles[]) => {
    setInterviewedLevel((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationErrors((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleDelete = (index: number, attachmentType: string) => {
    setInterviewedLevel((prevState) => {
      const currentValue =
        prevState[attachmentType as keyof InterviewedLevelValue];
      const updatedAttachments = Array.isArray(currentValue)
        ? [...currentValue]
        : [];

      updatedAttachments.splice(index, 1);

      return {
        ...prevState,
        [attachmentType]: updatedAttachments,
      };
    });
  };

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <>
          <Card
            variant="outlined"
            sx={{
              boxShadow: "0px 7px 4px 3px #d3d3d3",
              borderRadius: "10px",
              marginTop: "2%",
            }}
          >
            <CardContent>
              <div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={labelNames.CandidateDetails.ApplicantName}
                      value={CandidateProfile.ApplicantName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={labelNames.CandidateDetails.ApplicantSurname}
                      value={CandidateProfile.ApplicantSurName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={labelNames.CandidateDetails.Nationality}
                      value={CandidateProfile.Nationality}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={labelNames.CandidateDetails.Gender}
                      value={CandidateProfile.Gender}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={
                        labelNames.CandidateDetails.HighestRelevantQualification
                      }
                      value={CandidateProfile?.HighestQualification}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={
                        labelNames.CandidateDetails.ExperienceInMiningIndustry
                      }
                      value={CandidateProfile?.ExperienceMining}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                {props.stateValue?.initialTab === TabName.ReviewProfile && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label={
                          labelNames.CandidateDetails.Numberoftaxdependents
                        }
                        value={CandidateProfile.NumberOftax}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>

                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label={labelNames.CandidateDetails.LastCurrentposition}
                        value={CandidateProfile?.CurrentPosition}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>

                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label={labelNames.CandidateDetails.Currentemployer}
                        value={CandidateProfile?.CurrentEmployer}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>
                  </div>
                )}

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label={
                        labelNames.CandidateDetails.ExperienceInRelatedField
                      }
                      value={CandidateProfile?.ExperRelatedfield}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  {CandidateProfile?.Agencies === labelName.Candidate && (
                    <>
                      {CandidateProfile?.ConflictsOfInterest ===
                        ValidationAction.No && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={
                              labelNames.CandidateDetails.ConflictsOfInterest
                            }
                            value={CandidateProfile?.ConflictsOfInterest}
                            disabled={true}
                            mandatory={false}
                          />
                        </div>
                      )}
                      {CandidateProfile?.disability && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={labelNames.CandidateDetails.Disability}
                            value={CandidateProfile?.disability}
                            disabled={true}
                            mandatory={false}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {props.stateValue?.initialTab ===
                    TabName.AssignInterviewPanel && (
                    <>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomInput
                          label={
                            labelNames.CandidateDetails.NoOfInterviewLevels
                          }
                          value={InterviewedLevel.Levels}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomInput
                          label={labelNames.CandidateDetails.Grade}
                          value={InterviewedLevel.Grade}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                    </>
                  )}
                </div>
                {props.stateValue?.initialTab === TabName.ReviewProfile && (
                  <>
                    <div className="ms-Grid-row">
                      {CandidateProfile?.countryOfResidency && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={
                              labelNames.CandidateDetails.CountryOfResidency
                            }
                            value={CandidateProfile?.countryOfResidency}
                            disabled={true}
                            mandatory={false}
                          />
                        </div>
                      )}
                      {CandidateProfile?.residentStatus && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={labelNames.CandidateDetails.ResidencyCountry}
                            value={CandidateProfile?.residentStatus}
                            disabled={true}
                            mandatory={false}
                          />
                        </div>

                        // <div className="ms-Grid-row">
                        //   <div className="ms-Grid-col ms-lg6">
                        //     <CustomRadioGroup
                        //       label="Are you residency in that country?"
                        //       value={CandidateProfile?.residentStatus}
                        //       options={["Yes", "No"]}
                        //       mandatory={false}
                        //       error={false}
                        //       disabled={true}
                        //     />
                        //   </div>
                        // </div>
                      )}

                      {CandidateProfile?.maritalStatus && (
                        <>
                          <div className="ms-Grid-col ms-lg4">
                            <CustomInput
                              label={labelNames.CandidateDetails.MaritalStatus}
                              value={CandidateProfile?.maritalStatus}
                              disabled={true}
                              mandatory={false}
                              TooltipTitle={
                                CandidateProfile?.maritalStatusId != "MS01"
                                  ? TooltipType.ChildData
                                  : ""
                              }
                              TooltipData={CandidateProfile.childrenDetails}
                              Tooltipheader={TooltipHeader?.ChildData}
                            />
                          </div>
                          {/* {CandidateProfile?.maritalStatusId != "MS01" && (
                            <div
                              className="ms-Grid-col ms-lg1"
                              style={{ marginTop: "4%" }}
                            >
                              <MaritalChildrenTooltip
                                data={CandidateProfile.childrenDetails}
                                // onHover={() => handleHover(rowData.StatusId, rowData)}
                              />
                            </div>
                          )} */}
                        </>
                      )}
                      {CandidateProfile?.hasIvanhoeZijinExperience && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={
                              labelNames.CandidateDetails
                                .WorkedGroupPartnerCompanies
                            }
                            value={CandidateProfile?.hasIvanhoeZijinExperience}
                            disabled={true}
                            mandatory={false}
                            TooltipTitle={
                              CandidateProfile?.hasIvanhoeZijinExperience !=
                              ValidationAction.No
                                ? TooltipType.CompanyData
                                : ""
                            }
                            TooltipData={CandidateProfile.companyDetails}
                            Tooltipheader={TooltipHeader?.CompanyData}
                          />
                        </div>
                      )}

                      {/* {CandidateProfile?.hasIvanhoeZijinExperience != "No" && (
                        <div
                          className="ms-Grid-col ms-lg1"
                          style={{ marginTop: "4%" }}
                        >
                          <CompanyDetails
                            data={CandidateProfile?.companyDetails}
                            // onHover={() => handleHover(rowData.StatusId, rowData)}
                          />
                        </div>
                      )} */}
                    </div>
                  </>
                )}

                {props.stateValue?.initialTab === TabName.ReviewProfile && (
                  <>
                    <div style={{ padding: "1%" }}>
                      <div className="ms-Grid-row">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Label
                            style={{ marginTop: 10, overflowWrap: "inherit" }}
                          >
                            {labelNames.CandidateDetails.Willingrelocate}
                          </Label>
                          <span
                            style={{
                              fontFamily: '"Roboto", sans-serif',
                              // color: "red",
                              marginTop: "1%",
                              fontWeight: "bold",
                              fontSize: "17px",
                            }}
                          >
                            {" "}
                            - {CandidateProfile?.WillingToRelocate}
                          </span>
                        </div>
                      </div>

                      {CandidateProfile?.previouslyworkedMine && (
                        <div className="ms-Grid-row">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <Label
                              style={{ marginTop: 10, overflowWrap: "inherit" }}
                            >
                              {labelNames.CandidateDetails.previouslyworked}
                            </Label>
                            <span
                              style={{
                                fontFamily: '"Roboto", sans-serif',
                                // color: "red",
                                marginTop: "1%",
                                fontWeight: "bold",
                                fontSize: "17px",
                              }}
                            >
                              {" "}
                              - {CandidateProfile?.previouslyworkedMine}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="ms-Grid-row">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Label
                            style={{ marginTop: 10, overflowWrap: "inherit" }}
                          >
                            {labelNames.CandidateDetails.existingemployees}
                          </Label>
                          <span
                            style={{
                              fontFamily: '"Roboto", sans-serif',
                              // color: "red",
                              marginTop: "1%",
                              fontWeight: "bold",
                              fontSize: "17px",
                            }}
                          >
                            {" "}
                            - {CandidateProfile?.familylinks}
                          </span>
                          <span>
                            <div
                              style={{ marginTop: "4%", marginLeft: "124px" }}
                            >
                              {CandidateProfile?.familylinks ===
                              ValidationAction.Yes ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      cursor: "default",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {Attachment.Attachments}
                                    <EmployeeDetailsTooltip
                                      data={
                                        CandidateProfile.employeeReferenceDetails
                                      }
                                    />
                                    :
                                  </label>
                                  <span>
                                    <CustomViewDocument
                                      Attachment={
                                        CandidateProfile.familyDocuments
                                      }
                                      webUrl={props.webURL}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </span>
                        </div>
                      </div>

                      <div className="ms-Grid-row">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Label
                            style={{ marginTop: 10, overflowWrap: "inherit" }}
                          >
                            {labelNames.CandidateDetails.businesslinks}
                          </Label>
                          <span
                            style={{
                              fontFamily: '"Roboto", sans-serif',
                              // color: "red",
                              marginTop: "1%",
                              fontWeight: "bold",
                              fontSize: "17px",
                            }}
                          >
                            {" "}
                            - {CandidateProfile?.businesslinks}
                          </span>
                          <span style={{ marginLeft: "322px" }}>
                            <div style={{ marginTop: "12%" }}>
                              {CandidateProfile?.businesslinks ===
                              ValidationAction.Yes ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      cursor: "default",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {Attachment.Attachments}
                                    <ToolTipTable
                                      Title={
                                        labelNames.CandidateDetails.CompanyName
                                      }
                                      dataValue={
                                        CandidateProfile.businesslinkscompany
                                      }
                                      headers={[]}
                                      data={[]}
                                    />
                                  </label>
                                  <span>
                                    <CustomViewDocument
                                      Attachment={
                                        CandidateProfile.businessDocuments
                                      }
                                      webUrl={props.webURL}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Willing to relocate if not currently living close to the relevant project site/office?"
                          value={CandidateProfile?.WillingToRelocate}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div> */}
                    {/* <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Has the person previously worked within the Ivanhoe Mines Group?"
                          value={CandidateProfile?.previouslyworkedMine}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div> */}

                    {/* <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label=""
                          value={CandidateProfile?.familylinks}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Any business links to declare? (If so, who? Attach detail)"
                          value={CandidateProfile?.businesslinks}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div>
                    </div> */}
                  </>
                )}

                {props.stateValue?.initialTab ===
                TabName.AssignInterviewPanel ? (
                  <>
                    <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
                      <div className="ms-Grid-col ms-lg12">
                        <InterviewScheduleCard
                          label="Interview Level 1"
                          start={DateState.startDateL1}
                          end={DateState.endDateL1}
                          minDate={MinDateInterview}
                          maxDate={MaxDateInterview}
                          onDateChange={(start: any, end: any) =>
                            handleDateChange(start, end, InterviewLevels.Level1)
                          }
                          DateValidationError={validationErrors.startDateL1}
                          panelValue={InterviewedLevel.AssignInterviewLevel1}
                          panelOptions={
                            InterviewedLevel.AssignInterviewedLevel1Option
                          }
                          onPanelChange={(value: any) =>
                            handleMulitiSelect(value)
                          }
                          panelError={validationErrors.AssignInterviewLevel1}
                          PanelDisabled={storedNoOfInterviewpanel.current} // !(InterviewedLevel.AssignInterviewLevel1.length < 4)
                          DateDisable={level2Date}
                          CurrentNotes={!level2Date}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {level2Date && (
                  <>
                    <div
                      className="ms-Grid-row"
                      style={{ marginTop: "2%", marginBottom: "2%" }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <InterviewScheduleCard
                          label="Interview Level 2"
                          start={DateState.startDateL2}
                          end={DateState.endDateL2}
                          minDate={MinDateInterview}
                          maxDate={MaxDateInterview}
                          onDateChange={(start: any, end: any) =>
                            handleDateChange(start, end, InterviewLevels.Level2)
                          }
                          DateValidationError={validationErrors.startDateL2}
                          panelValue={InterviewedLevel.AssignInterviewedLevel2}
                          panelOptions={
                            InterviewedLevel.AssignInterviewedLevel1Option
                          }
                          onPanelChange={(value: any) =>
                            handleMulitiSelect(value)
                          }
                          panelError={validationErrors.AssignInterviewLevel1}
                          PanelDisabled={storedNoOfInterviewpanel.current} // !(InterviewedLevel.AssignInterviewLevel1.length < 4)
                          DateDisable={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          CurrentNotes={
                            !(
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {CandidateProfile?.disabilityReason &&
                  CandidateProfile?.disability === Choices.Yes && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <CustomTextArea
                          label={labelNames.CandidateDetails.DisabilityDetails}
                          value={CandidateProfile?.disabilityReason}
                          disabled={true}
                          mandatory={false}
                          error={false}
                        />
                      </div>
                    </div>
                  )}
                <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                  <LabelHeaderComponents value={Attachment.Attachments} />
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel
                      value={Attachment.PositionDocument.CandidateResume}
                    />
                    <CustomViewDocument
                      Attachment={CandidateProfile.CandidateResume}
                      webUrl={props.webURL}
                      // Label={"Candidate Resume"}
                    />
                  </div>
                </div>

                {CandidateProfile?.ConflictsOfInterest ===
                  ValidationAction.Yes &&
                  props.stateValue?.initialTab === TabName.ReviewProfile && (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 7px 4px 3px #d3d3d3",
                        borderRadius: "10px",
                        marginTop: "2%",
                        overflow: "visible",
                      }}
                    >
                      <CardContent>
                        <>
                          <div className="ms-Grid-row">
                            <div
                              style={{
                                display: "flex",
                                marginTop: "1% ",
                                marginLeft: "1%",
                              }}
                            >
                              <div
                                style={{
                                  minWidth: 85,
                                  fontWeight: "bold",
                                  fontFamily: '"Roboto", sans-serif',
                                  fontSize: "17px",
                                }}
                              >
                                {
                                  labelNames.CandidateDetails
                                    .ConflictsOfInterest
                                }
                              </div>
                              <div
                                style={{
                                  fontFamily: '"Roboto", sans-serif',
                                  color: "red",
                                  marginLeft: "1%",
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                }}
                              >
                                {" "}
                                : {CandidateProfile?.ConflictsOfInterest ?? "—"}
                              </div>
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <DetailRow
                              label={labelNames.CandidateDetails.Reason}
                              value={InterviewedLevel?.COIReason}
                            />
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                              <CustomAutoComplete
                                label={
                                  labelNames.CandidateDetails.ConsultedWith
                                }
                                options={InterviewedLevel.COIProfileLabelOption}
                                value={InterviewedLevel.COIProfileLabel}
                                disabled={
                                  props.stateValue?.StatusId ===
                                  workflowStatusApi.HRPending
                                    ? false
                                    : true
                                }
                                mandatory={
                                  props.stateValue?.StatusId ===
                                  workflowStatusApi.HRPending
                                    ? true
                                    : false
                                }
                                onChange={(item) =>
                                  handleAutoComplete(item, "COIProfileLabel")
                                }
                                error={validationErrors.COIProfileLabel}
                              />
                            </div>
                            {props.stateValue?.StatusId ===
                            workflowStatusApi.HRPending ? (
                              <>
                                <div className="ms-Grid-col ms-lg2">
                                  <div
                                    className="ms-Grid-row"
                                    style={{ marginLeft: "2px" }}
                                  >
                                    <CustomLabel
                                      value={
                                        labelNames.CandidateDetails
                                          .ProofDiscussion
                                      }
                                      mandatory={true}
                                    />
                                    <AttachmentButton
                                      label="Upload"
                                      iconName="CloudUpload"
                                      iconNameHover="CloudUpload"
                                      allowMultiple={false}
                                      AttachState={(newAttachment: any) => {
                                        let attachment: IDocFiles[] =
                                          newAttachment.map((item: any) => {
                                            return {
                                              name: item.name,
                                              content: item.file,
                                              type: "New",
                                              url: item.Url,
                                            };
                                          });
                                        // const attachments = [
                                        //   ...(InterviewedLevel.COIAttachment ||
                                        //     []),
                                        //   ...attachment,
                                        // ];
                                        handleDocument(
                                          "COIAttachment",
                                          attachment,
                                        );
                                      }}
                                      mandatory={true}
                                      error={validationErrors.COIAttachment}
                                      Style={{
                                        backgroundColor:
                                          ColorCode.ButtonColorCode.ButtonColor,
                                        color: "white",
                                      }}
                                      fileformat=".doc,.pdf,.docx,.png"
                                    />
                                  </div>
                                </div>
                                <div
                                  className="ms-Grid-col ms-lg4"
                                  style={{ marginTop: "2%" }}
                                >
                                  <CustomViewAttachment
                                    Attachment={
                                      InterviewedLevel.COIAttachment ?? []
                                    }
                                    StateValue={"COIAttachment"}
                                    handleDelete={(index, fileState) =>
                                      handleDelete(index, fileState)
                                    }
                                    webUrl={props.webURL}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                {InterviewedLevel.COIAttachment.length > 0 && (
                                  <div className="ms-Grid-col ms-lg3 custom-document-column ">
                                    <CustomLabel
                                      value={
                                        labelNames.CandidateDetails
                                          .ProofDiscussion
                                      }
                                    />
                                    <CustomViewDocument
                                      Attachment={
                                        InterviewedLevel.COIAttachment
                                      }
                                      webUrl={props.webURL}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <CustomTextArea
                                label={labelNames.CommanLabel.Comments}
                                value={InterviewedLevel.COIComments}
                                error={validationErrors.COIComments}
                                onChange={(value) => {
                                  setInterviewedLevel((prev) => ({
                                    ...prev,
                                    COIComments: value,
                                  }));
                                  setValidationErrors((prevState) => ({
                                    ...prevState,
                                    COIComments: false,
                                  }));
                                }}
                                disabled={
                                  props.stateValue?.StatusId ===
                                  workflowStatusApi.HRPending
                                    ? false
                                    : true
                                }
                                mandatory={
                                  props.stateValue?.StatusId ===
                                  workflowStatusApi.HRPending
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </div>
                        </>
                      </CardContent>
                    </Card>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.stateValue?.ButtonAction === ButtonAction.Edit &&
                  props.CurrentRoleID.includes(RoleID.LineManager) && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg5">
                          <CustomRadioGroup
                            label={
                              props.stateValue?.StatusId ===
                              workflowStatusApi.LineManagerL1Pending
                                ? labelNames.CandidateDetails
                                    .Level1CandidateLabel
                                : labelNames.CandidateDetails
                                    .Level2CandidateLabel
                            }
                            value={actionValue.CandidateStatus}
                            options={
                              props.stateValue?.StatusId ===
                              workflowStatusApi.LineManagerL2Pending
                                ? ProfileReviewl2
                                : ProfileReview
                            }
                            error={validationErrors.CandidateStatus}
                            mandatory={true}
                            onChange={(item) => handleRadioChange(item)}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                                ? true
                                : false
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
                  props.stateValue?.ButtonAction != ButtonAction.View && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomAutoComplete
                            label={
                              labelNames.CandidateDetails.ReviewProfileFeedback
                            }
                            options={InterviewedLevel.CandidateScoreOption}
                            value={InterviewedLevel.CandidateScoreValue}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleAutoComplete(item, "CandidateScoreValue")
                            }
                            error={validationErrors.CandidateScoreValue}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
                  props.stateValue?.ButtonAction === ButtonAction.View && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={
                              labelNames.CandidateDetails.ReviewProfileFeedback
                            }
                            value={CandidateProfile.hrComments}
                            disabled={true}
                            // mandatory={true}
                            // onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.CurrentRoleID.includes(RoleID.LineManager) &&
                  CandidateProfile.Agencies != RoleName.RecruitmentHR && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label={
                              labelNames.CandidateDetails.ReviewProfileFeedback
                            }
                            value={CandidateProfile.hrComments}
                            disabled={true}
                            // mandatory={true}
                            // onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {/* ((props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
                  props.stateValue?.ButtonAction === ButtonAction.View) ||
                  props.CurrentRoleID.includes(RoleID.LineManager)) && */}
                {CandidateProfile.Comments.length > 0 && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg4">
                      <CustomLabel
                        value={Attachment.PositionDocument.ViewComments}
                      />
                      <ReuseButton
                        Style={{
                          minWidth: "117px",
                          fontSize: "13px",
                          paddingBottom: "24px",
                          display: "flex",
                          flexDirection: "column",
                          height: "41px",
                          paddingTop: "23px",
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          color: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        label="VIEW"
                        imgSrc={require("../../assets/viewSubmision-white.svg")}
                        imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                        imgAlt="View"
                        imgAltHover="Hovered View"
                        onClick={() => setMainComponent(false)}
                        spacing={4}
                      />
                    </div>
                  </div>
                )}

                {props.stateValue?.ButtonAction === ButtonAction.View ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        style={{ marginBottom: "7px" }}
                      >
                        <CustomTextArea
                          label={labelNames.CommanLabel.Comments}
                          value={actionValue.Comments}
                          error={validationErrors.Comments}
                          onChange={(value) => handleInputChangeTextArea(value)}
                          mandatory={true}
                        />
                      </div>
                    </div>

                    <div
                      className="ms-Grid-row"
                      style={{
                        padding: "3px",
                        marginTop: "20px",
                        marginBottom: "-33px",
                      }}
                    >
                      <div className="ms-Grid-col ms-lg12">
                        <SignatureCheckbox
                          label={
                            props.stateValue?.initialTab ===
                            TabName.ReviewProfile
                              ? CheckboxContent.ReviewedCandidate
                              : props.StateValue?.StatusId ===
                                    StatusId.InterviewScheduledforLevel2 ||
                                  props.StateValue?.StatusId ===
                                    StatusId.InterviewScheduledforLevel2
                                ? CheckboxContent.RescheduleInterview
                                : CheckboxContent.InterviewPanel
                          }
                          checked={Checkbox}
                          error={validationErrors.Checkboxalidation}
                          onChange={(value: boolean) => {
                            setCheckbox(value);
                            setValidationErrors((prevState) => ({
                              ...prevState,
                              Checkboxalidation: false,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <CustomSignature
                          Name={
                            (props.userDetails[0].FirstName ?? "") +
                            " " +
                            (props.userDetails[0]?.MiddleName ?? "") +
                            " " +
                            (props.userDetails[0]?.LastName ?? "")
                          }
                          JobTitleInEnglish={
                            props.userDetails[0].JopTitleEnglish
                          }
                          JobTitleInFrench={props.userDetails[0].JopTitleFrench}
                          Department={props.userDetails[0].DepartmentName}
                          Date={SignDate}
                          TermsAndCondition={Checkbox}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
  ];
  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const Validation = (): boolean => {
    let errors = {
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false,
      AssignInterviewLevel1: false,
      CandidateScoreValue: false,
      COIProfileLabel: false,
      COIAttachment: false,
      COIComments: false,
      RoomData: false,
      RoomDateL2: false,
      startDateL1: false,
      endDateL1: false,
      startDateL2: false,
      endDateL2: false,
    };

    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(Checkbox);
        errors.startDateL1 = !IsValid(DateState.startDateL1);
        errors.endDateL1 = !IsValid(DateState.endDateL1);

        errors.AssignInterviewLevel1 = !IsValid(
          InterviewedLevel.AssignInterviewLevel1?.[2]?.text ?? "",
        );
        // errors.RoomData = !IsValid(DateState.RoomData.text);
        if (
          props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
        ) {
          errors.startDateL2 = !IsValid(DateState.startDateL2);
          errors.endDateL2 = !IsValid(DateState.endDateL2);
          // errors.RoomDateL2 = !IsValid(DateState.RoomDateL2.text);
        }
      } else {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(Checkbox);
        errors.CandidateScoreValue = !IsValid(
          InterviewedLevel?.CandidateScoreValue?.text,
        );
      }
    } else if (props.CurrentRoleID.includes(RoleID.LineManager)) {
      errors.Comments = !IsValid(actionValue.Comments);
      errors.Checkboxalidation = !IsValid(Checkbox);
      errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
    }

    if (props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2) {
      const interviewDate = DateState?.startDateL2
        ? new Date(DateState.startDateL2)
        : null;

      const RescheduleValue = !!interviewDate && interviewDate <= todaydate;
      setRescheduleValidation(RescheduleValue);
    }

    if (props.stateValue?.StatusId === StatusId.InterviewScheduled) {
      const interviewDate = DateState?.startDateL1
        ? new Date(DateState.startDateL1)
        : null;

      const RescheduleValue = !!interviewDate && interviewDate <= todaydate;
      setRescheduleValidation(RescheduleValue);
    }

    if (
      CandidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
      props.stateValue?.StatusId === workflowStatusApi.HRPending
    ) {
      errors.COIComments = !IsValid(InterviewedLevel?.COIComments);
      errors.COIProfileLabel = !IsValid(InterviewedLevel?.COIProfileLabel.text);
      errors.COIAttachment = !IsValid(InterviewedLevel?.COIAttachment);
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  function back_fn() {
    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      props.navigation("/ReviewProfileList/ReviewCandidateList", {
        state: {
          ID: props.stateValue?.RecruitmentID,
          TabNames: props.stateValue?.initialTab,
          ButtonAction: ButtonAction.View,
          JobCode: props.stateValue?.JobCode,
          tab: props.stateValue?.tabs,
          tabs: props.stateValue.tab,
          JobCodeID: props.stateValue?.JobCodeID,
        },
      });
    } else {
      props.navigation("/RecurimentProcess/ReviewCandidateList", {
        state: {
          ID: props.stateValue?.RecruitmentID,
          TabNames: props.stateValue?.initialTab,
          ButtonAction: ButtonAction.View,
          JobCode: props.stateValue?.JobCode,
          tab: props.stateValue?.tabs,
          tabs: props.stateValue.tab,
          JobCodeID: props.stateValue?.JobCodeID,
        },
      });
    }
  }

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

  const UploadCandidateDetails = async () => {
    let DOBValue = CandidateProfile.DOB
      ? new Date(CandidateProfile.DOB)
      : undefined;
    // let StartDate = DateState?.startDateL1.toISOString();
    const StartDate = DateState?.startDateL1
      ? DateState.startDateL1.toISOString()
      : "";
    const EndDate = DateState?.endDateL1
      ? DateState.endDateL1.toISOString()
      : "";
    // let EndDateValue = SpiltDateOnly(DateState?.endDateL1 ?? new Date());
    let DOBData = SpiltDateOnly(DOBValue ?? new Date());
    const CandidateDetails: CandidateDetails = {
      RecruitmentIDId: props.stateValue.RecruitmentID,
      JobCodeId: RecrutimentData[0].JobCodeId,
      FristName: CandidateProfile.FristName,
      MiddleName: CandidateProfile.MiddleName,
      LastName: CandidateProfile.ApplicantSurName,
      ResidentialAddress: CandidateProfile.ResidentialAddress,
      DOB: DOBData,
      ContactNumber: CandidateProfile.ContactNumber,
      Email: CandidateProfile.Email,
      Nationality: CandidateProfile.Nationality,
      Gender: CandidateProfile.Gender,
      TotalYearOfExperiance: String(CandidateProfile.ExperienceMining),
      ReleventExperience: String(CandidateProfile.ExperRelatedfield),
      Qualification: CandidateProfile.HighestQualification,
      JobRequestID: String(CandidateProfile.CandidateID),
      ProfileID: String(CandidateProfile.profileID),
      PositionTitle: RecrutimentData[0]?.JobTitleEnglish,
      JobGrade: RecrutimentData[0]?.DRCGrade,
      ExternalAgentDetails: CandidateProfile.Agencies,
      InterviewDate: StartDate,
      InterviewTime: EndDate,
      // InterviewLink: String(DateState.RoomData?.key) ?? "",
      CandidateResumeLink:
        CandidateProfile?.CandidateResumeLink === undefined
          ? ""
          : CandidateProfile?.CandidateResumeLink,
      ActionId: WorkflowAction.Approved,
      ConflictsOfInterest: CandidateProfile.ConflictsOfInterest,
      Disability: CandidateProfile.disability,
      DisabilityDetails: CandidateProfile.disabilityReason,
      IdentityNumber: CandidateProfile.identityValue,
      ProofOfIdentity: CandidateProfile.identityType,

      LastOrCurrentPosition: CandidateProfile.CurrentPosition,
      LastOrCurrentEmployer: CandidateProfile.CurrentEmployer,
      PreviouslyWorkedInIvanhoeMines:
        CandidateProfile.previouslyworkedMine === undefined
          ? ""
          : CandidateProfile.previouslyworkedMine,
      NumberOfTaxDependents: Number(CandidateProfile.NumberOftax),
      Age: Number(CandidateProfile.Age),
      AnyFamilyorOtherLinks: CandidateProfile.familylinks,
      AnyBusinessLinksToDeclare: CandidateProfile.businesslinks,
      WillingToRelocate: CandidateProfile.WillingToRelocate,
      CountryofOrgin: CandidateProfile.CountryofOrgin,
      Citizenship: CandidateProfile.Citizenship,

      FamilyLink: CandidateProfile.FamilyLink,
      BusinessLink: CandidateProfile.BusinessLink,
      GPA: CandidateProfile.GPA,

      OthersInterviewed: "",
      COIEmail: String(InterviewedLevel.COIProfileLabel.text),
      COIComments: InterviewedLevel.COIComments,
      COIReason: InterviewedLevel.COIReason,

      countryOfResidency: CandidateProfile.countryOfResidency,
      ResidencyStatus: CandidateProfile.residentStatus,
      MaritalStatus: CandidateProfile.maritalStatus,
      ChildrenDetails: JSON.stringify(CandidateProfile.childrenDetails),
      ReferenceEmployeeDetails: JSON.stringify([
        CandidateProfile?.employeeReferenceDetails || {},
      ]),
      hasIvanhoeZijinExperience: CandidateProfile?.hasIvanhoeZijinExperience,
      OperationRoleRegion: JSON.stringify([
        CandidateProfile?.companyDetails || {},
      ]),
      NationalityCode: CandidateProfile?.NatioCode || "",
      LanguageKnown: JSON.stringify(CandidateProfile?.LanguageKnown),
      InterviewLink: "",
    };
    let selectedinterviewpanal: any[] = [];

    for (let i = 0; i < InterviewedLevel.AssignInterviewLevel1.length; i++) {
      const currentItem = InterviewedLevel.AssignInterviewLevel1[i];
      let selectedinterview = {
        RecruitmentIDId: RecrutimentData[0]?.ID,
        InterviewLevel: InterviewLevels.Level1, //InterviewedLevel.Levels,
        InterviewPanel: currentItem.key,
        CandidateID: 0,
      };

      selectedinterviewpanal.push(selectedinterview);
    }
    const response = await GetPortalJobsService.InsertCandidateDetailsInList(
      CandidateDetails,
      selectedinterviewpanal,
    );

    return response;
  };

  const ScheduleMeeting = async () => {
    let getOrganizerEmail = InterviewPanel.filter(
      (item: any) => item.Role === RoleName.RecruitmentHR,
    );
    const getRequiredAttendees = InterviewPanel.map(
      (item: any) => item.Email,
    ) as string[];
    const obj: ICreateMeeting = {
      organizerEmail: getOrganizerEmail[0]?.Email ?? "",
      subject: `Interview for ${CandidateProfile?.FristName} ${CandidateProfile?.MiddleName} - ${RecrutimentData[0]?.JobTitleEnglish}`,
      startUtc: ConvertUtc(DateState.startDateL1 ?? new Date()),
      endUtc: ConvertUtc(DateState.endDateL1 ?? new Date()),
      location: DateState.RoomData?.text ?? "",
      requiredAttendees: getRequiredAttendees,
      optionalAttendees: [],
      rooms: [String(DateState.RoomData?.key)],
      categories: ["Internal", "Planning"],
      isOnlineMeeting: true,
    };
    let response = await createMeeting(obj);
    return response;
  };

  const showAlert = (message: string, type: string) => {
    setalertProps({
      Message: message,
      Type: type,
      visible: true,
      ButtonAction: async (ok: boolean) => {
        if (ok) {
          navigateToList(props);
          setAlertPopupOpen(false);
        }
      },
    });

    setAlertPopupOpen(true);
  };

  const buildInterviewObject = () => {
    const isLevel2Pending =
      props.stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    const isScheduledL1 =
      props.stateValue?.StatusId === StatusId.InterviewScheduled;

    const startDateRaw =
      isLevel2Pending || !isScheduledL1
        ? DateState?.startDateL2
        : DateState?.startDateL1;
    const endDateRaw =
      isLevel2Pending || !isScheduledL1
        ? DateState?.endDateL2
        : DateState?.endDateL1;
    const roomKey =
      isLevel2Pending || !isScheduledL1
        ? DateState.RoomDateL2?.key
        : DateState.RoomData?.key;

    let obj: any = {
      ID: Number(CandidateProfile.CandidateID),
      InterviewDate: SpiltDateOnly(startDateRaw ?? new Date()),
      InterviewTime: SpiltDateOnly(endDateRaw ?? new Date()),
      InterviewLink: String(roomKey ?? ""),
    };

    if (isLevel2Pending || !isScheduledL1) {
      obj.InterviewDateLevel2 = obj.InterviewDate;
      obj.InterviewTimeLevel2 = obj.InterviewTime;
      obj.InterviewLinkLevel2 = obj.InterviewLink;
    }

    if (
      isLevel2Pending &&
      props.stateValue?.initialTab === TabName.AssignInterviewPanel
    ) {
      obj.ActionId = WorkflowAction.Approved;
      obj.ItemCreated = Choices.Yes;
    }

    return obj;
  };

  const buildWorkflowData = async (
    COIButtonAction: string,
  ): Promise<{
    CandidateData: WorkflowJson;
    EmailNot: sendEmail;
    PopupMessage: string;
  }> => {
    let CurrentUserRole = GetWorkflowStatusByID(props.stateValue?.StatusId);
    const createFilter = (workflowStatus: string): WorkflowJson => ({
      workflowStatus,
      jobRequestId: props.stateValue?.ID,
      comments: actionValue.Comments,
      actionBy: CurrentUserRole,
      hrComments:
        props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
        props.stateValue?.initialTab === TabName.ReviewProfile
          ? (InterviewedLevel.CandidateScoreValue.text ?? "")
          : CandidateProfile?.hrComments,
    });

    let CandidateData: WorkflowJson = {
      workflowStatus: "",
      jobRequestId: 0,
      comments: "",
      actionBy: "",
      hrComments: "",
    };

    let EmailNot: sendEmail = {
      jobRequestId: props.stateValue?.ID,
      templateCode: "",
    };

    let PopupMessage = "";

    const isLineManager = props.CurrentRoleID.includes(RoleID.LineManager);
    const isAssignInterview =
      props.stateValue?.initialTab === TabName.AssignInterviewPanel;

    if (isLineManager) {
      const CandidateValue =
        COIButtonAction === ButtonAction.Reject
          ? IsCandidateFit.No
          : actionValue.CandidateStatus;

      const isLevel2 =
        CandidateProfile.workflowStatusId ===
          workflowStatusApi.LineManagerL2Pending ||
        CandidateProfile.workflowStatusId ===
          workflowStatusApi.LineManagerLevel2OnHold;

      switch (CandidateValue) {
        case IsCandidateFit.Yes:
          CandidateData = createFilter(
            isLevel2
              ? workflowStatusApi.PendingRecruitmentHRscheduleInterview
              : workflowStatusApi.LineManagerL2Pending,
          );

          if (isLevel2)
            EmailNot.templateCode = EmailTemplateCodes.LineManagerEmail;

          PopupMessage = RecuritmentHRMsg.ProfileReviewed;
          break;

        case IsCandidateFit.No:
          CandidateData = createFilter(
            isLevel2
              ? workflowStatusApi.LineManagerLevel2Rejected
              : workflowStatusApi.LineManagerLevel1Rejected,
          );

          EmailNot.templateCode = EmailTemplateCodes.CandidateRejected;
          PopupMessage = RecuritmentHRMsg.ProfileReviewedNo;
          break;

        case IsCandidateFit.OnHold:
          CandidateData = createFilter(
            isLevel2
              ? workflowStatusApi.LineManagerLevel2OnHold
              : workflowStatusApi.LineManagerLevel1OnHold,
          );

          PopupMessage = RecuritmentHRMsg.ProfileReviewedWaitingList;
          break;
      }
    } else {
      if (isAssignInterview) {
        CandidateData = createFilter(workflowStatusApi.InterviewScheduled);
        EmailNot.templateCode = EmailTemplateCodes.InterviewSchedule;

        PopupMessage =
          InterviewedLevel.Levels === InterviewLevels.Level2
            ? RecuritmentHRMsg.InterviewPanalLevel1
            : RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
      } else {
        if (COIButtonAction === ButtonAction.Reject) {
          CandidateData = createFilter(workflowStatusApi.HRRejected);
          EmailNot.templateCode = EmailTemplateCodes.CandidateRejected;
          PopupMessage = RecuritmentHRMsg.CandidateRejected;
        } else {
          CandidateData = createFilter(workflowStatusApi.LineManagerL1Pending);
          PopupMessage = RecuritmentHRMsg.HRReviewCandidate;
        }
      }
    }

    if (
      CandidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
      props.stateValue?.StatusId === workflowStatusApi.HRPending
    ) {
      let attachmentPath = "";

      if (InterviewedLevel.COIAttachment.length > 0) {
        const DocumentResponse = await GetPortalJobsService.UploadCOIAttachment(
          {
            RequestID: String(CandidateProfile.profileID),
            DocumentName: DocumentFolderName.COIAttach,
          },
          InterviewedLevel.COIAttachment,
        );

        attachmentPath = String(DocumentResponse.data[0]?.content ?? "");
      }

      const COIObj: COIType = {
        profileId: CandidateProfile.profileID,
        approver: InterviewedLevel.COIProfileLabel.text,
        comments: InterviewedLevel.COIComments,
        attachmentPath,
      };

      await GetPortalJobsService.GetUpsertCOI(COIObj);
    }

    return { CandidateData, EmailNot, PopupMessage };
  };

  const handleInterviewReschedule = async () => {
    const obj = buildInterviewObject();
    const res = await GetPortalJobsService.RescheduledInterview(
      obj,
      ListNames.HRMSRecruitmentCandidatePersonalDetails,
    );

    if (res.status !== 200) {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      return;
    }

    if (
      props.stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
    ) {
      const selectedPanel = InterviewedLevel.AssignInterviewedLevel2.map(
        (item: any) => ({
          RecruitmentIDId: props.stateValue?.RecruitmentID,
          InterviewLevel: InterviewLevels.Level2,
          InterviewPanel: item.key,
          CandidateID: Number(CandidateProfile.CandidateID),
        }),
      );

      await GetPortalJobsService.InsertInterviewPanel(
        selectedPanel,
        Number(CandidateProfile.CandidateID),
      );
    }

    const msg =
      props.stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
        ? RecuritmentHRMsg.InterviewPanalLevel2
        : RecuritmentHRMsg.RescheduleSuccessMsg;

    showAlert(msg, HRMSAlertOptions.Success);
  };

  const handleWorkflowProcess = async (COIButtonAction: string) => {
    const { CandidateData, EmailNot, PopupMessage } =
      await buildWorkflowData(COIButtonAction);

    if (
      props.stateValue?.StatusId ===
      workflowStatusApi.PendingRecruitmentHRscheduleInterview
    ) {
      EmailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
      EmailNot.dynamicFields = {
        InterviewDate: SpiltDateOnly(DateState?.startDateL1 ?? new Date()),
        InterviewTime: SpiltDateOnly(DateState?.endDateL1 ?? new Date()),
        MeetingLink: String(DateState.RoomData?.key) ?? "",
        InterviewLevel: InterviewedLevel?.Levels,
      };
    }

    let canProceed = true;
    if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
      const uploadRes = await UploadCandidateDetails();
      if (uploadRes.status !== ResponeStatus.SUCCESS) canProceed = false;
    }

    if (!canProceed) {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      return;
    }

    const res = await GetPortalJobsService.UpdateCandidateStatus(CandidateData);
    if (res.status === 200) {
      if (
        props.stateValue?.StatusId === workflowStatusApi.LineManagerL2Pending ||
        props.stateValue?.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        if (EmailNot.templateCode)
          await GetPortalJobsService.SendEmailNotification(EmailNot);
      }
      showAlert(PopupMessage, HRMSAlertOptions.Success);
    } else {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
    }
  };

  async function Submit_fn(COIButtonAction: string) {
    setIsLoading(true);

    try {
      if (Validation()) {
        showAlert(RecuritmentHRMsg.FormValidationMsg, HRMSAlertOptions.Error);
        return;
      }
      await ScheduleMeeting();

      let scheduleResponse;
      if (
        props.stateValue?.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
        props.stateValue?.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        // scheduleResponse = await ScheduleMeeting();
        // if (scheduleResponse.status !== 200) {
        //   showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
        //   return;
        // }
        scheduleResponse = { status: 200 };
      } else {
        scheduleResponse = { status: 200 };
      }
      if (scheduleResponse?.status === 200) {
        const isAssignInterview =
          (props.stateValue.tab === "tab2" ||
            props.stateValue.tab === "tab3") &&
          props.stateValue?.initialTab === TabName.AssignInterviewPanel;

        if (isAssignInterview) {
          await handleInterviewReschedule();
          return;
        }

        await handleWorkflowProcess(COIButtonAction);
      }
    } catch (error) {
      console.error("Error submitting candidate details", error);
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
    } finally {
      setIsLoading(false);
    }
  }

  async function COIValidation() {
    const isValid = !Validation();
    if (isValid) {
      if (
        CandidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
        props.stateValue?.initialTab === TabName.ReviewProfile
      ) {
        const WarningMsg = {
          Message: COIWarningMsg,
          Type: HRMSAlertOptions.Confirmation,
          visible: true,
          ButtonLebel: ValidationAction.Yes,
          IsCloseIcon: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
              await Submit_fn(ButtonAction.Approve);
            } else {
              setActionValue((prevState: any) => ({
                ...prevState,
                CandidateStatus: IsCandidateFit.No,
              }));
              setAlertPopupOpen(false);
              await Submit_fn(ButtonAction.Reject);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(WarningMsg);
      } else {
        await Submit_fn(ButtonAction.Remove);
      }
    } else {
      let FormFieldFailed = {
        Message: RecuritmentHRMsg.FormValidationMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };
      setAlertPopupOpen(true);
      setalertProps(FormFieldFailed);
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setIsLoading(true);

    const CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
            props.navigation("/ReviewProfileList/ReviewCandidateList", {
              state: {
                ID: props.stateValue?.RecruitmentID,
                TabNames: props.stateValue?.initialTab,
                ButtonAction: ButtonAction.View,
                JobCode: props.stateValue?.JobCode,
                tab: props.stateValue?.tabs,
                tabs: props.stateValue.tab,
                JobCodeID: props.stateValue?.JobCodeID,
                CandidateTabName: props.stateValue?.TabNamed,
              },
            });
          } else {
            props.navigation("/RecurimentProcess/ReviewCandidateList", {
              state: {
                ID: props.stateValue?.RecruitmentID,
                TabNames: props.stateValue?.initialTab,
                ButtonAction: ButtonAction.View,
                JobCode: props.stateValue?.JobCode,
                tab: props.stateValue?.tabs,
                tabs: props.stateValue.tab,
                JobCodeID: props.stateValue?.JobCodeID,
                CandidateTabName: props.stateValue?.TabNamed,
              },
            });
          }

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

  const getAdditionalButtons = () => {
    const isViewMode = props.stateValue?.ButtonAction === ButtonAction.View;
    const candidateStatus = actionValue.CandidateStatus;

    if (isViewMode) {
      return [
        {
          label: ButtonAction.Back,
          onClick: async () => {
            await back_fn();
          },
        },
      ];
    }

    if (candidateStatus === IsCandidateFit.No) {
      return [
        {
          label: ButtonAction.Reject,
          onClick: async () => {
            await Submit_fn(ButtonAction.Remove);
          },
        },
      ];
    }

    if (candidateStatus === IsCandidateFit.OnHold) {
      return [
        {
          label: ButtonAction.OnHold,
          onClick: async () => {
            await Submit_fn(ButtonAction.OnHold);
          },
        },
      ];
    }

    return [
      {
        label: submitBtn,
        onClick: async () => {
          await COIValidation();
        },
      },
    ];
  };

  return (
    <>
      {MainComponent ? (
        <>
          <CustomLoader isLoading={isLoading}>
            <div className="menu-card">
              <BreadcrumbsComponent
                items={tabs}
                initialItem={activeTab}
                TabName={TabNameData}
                onBreadcrumbChange={handleBreadcrumbChange}
                handleCancel={handleCancel}
                JobValue={{
                  JobTitle: CandidateProfile.JobTitle ?? "",
                  JobCode: CandidateProfile.JobCode,
                  Status: CandidateProfile.Status,
                }}
                Agencies={CandidateProfile.Agencies}
                additionalButtons={getAdditionalButtons()}
              />
              {/* <TabsComponent
            tabs={tabs}
            initialTab="tab1"
            
          /> */}
            </div>
          </CustomLoader>
        </>
      ) : (
        <>
          <CommanComments
            onClose={() => {
              setMainComponent(true);
              setactiveTab(activeTab);
            }}
            Comments={CandidateProfile.Comments}
          />
        </>
      )}

      {AlertPopupOpen ? (
        <>
          <CustomAlert
            {...alertProps}
            onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ViewCandidateDetails;
