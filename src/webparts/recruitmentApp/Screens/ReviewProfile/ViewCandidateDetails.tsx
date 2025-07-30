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
  ButtonAction,
  CandidateStatus,
  CheckboxContent,
  Choices,
  ColorCode,
  DocumentLibraray,
  HRMSAlertOptions,
  InterviewLevels,
  labelName,
  ListNames,
  RecuritmentHRMsg,
  ReviewProfileScore,
  RoleID,
  RoleName,
  RoleProfileMaster,
  StatusId,
  TabName,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomViewDocument from "../../components/CustomViewDocument";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import { CandidateProfile, WorkflowJson } from "../../Models/ApIInterface";
import CustomSignature from "../../components/CustomSignature";
import IsValid from "../../components/Validation";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { Dialog } from "primereact/dialog";
import CustomJsonComments from "../../components/CustomJsonComments";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomTimePicker from "../../components/CustomTimePicker";
import { CandidateDetails } from "../../Services/CareerPortalApi/IGetPortalJobs";
import { GetWorkflowStatusByID } from "../../components/TabMerge";
import { Label } from "@fluentui/react";

type InterviewedLevelValue = {
  Levels: string;
  Grade: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
  InterviewedDate: Date | undefined;
  InterviewMeetingInviteLink: string;
  InterviewTime: string;
  CandidateScoreValue: AutoCompleteItem;
  CandidateScoreOption: AutoCompleteItem[];
};

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
  InterviewedDate: boolean;
  AssignInterviewLevel1: boolean;
  InterviewMeetingInviteLink: boolean;
  InterviewTime: boolean;
  CandidateScoreValue: boolean;
  ReviewFeedback: boolean;
  InterviewMeetingInviteLinkLevel2: boolean;
  InterviewTimeLevel2: boolean;
  InterviewedDateLevel2: boolean;
};

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
};

type Level2Data = {
  InterviewedDate: Date | undefined;
  InterviewMeetingInviteLink: string;
  InterviewTime: string;
};

const ViewCandidateDetails = (props: any) => {
  // console.log(props, "ViewCandidateDetails");

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
    ContactNumber: 0,
    Email: "",
    Gender: "",
    HighestQualification: "",
    ExperienceMining: 0,
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
  });
  const todaydate = new Date();

  const [InterviewedLevel, setInterviewedLevel] =
    useState<InterviewedLevelValue>({
      Levels: "",
      Grade: "",
      AssignInterviewedLevel1Option: [],
      AssignInterviewLevel1: [],
      AssignInterviewedLevel2: [],
      InterviewedDate: undefined,
      InterviewMeetingInviteLink: "",
      InterviewTime: "",
      CandidateScoreValue: { key: 0, text: "" },
      CandidateScoreOption: ReviewProfileScore,
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
      InterviewedDate: false,
      AssignInterviewLevel1: false,
      InterviewMeetingInviteLink: false,
      InterviewTime: false,
      CandidateScoreValue: false,
      ReviewFeedback: false,
      InterviewMeetingInviteLinkLevel2: false,
      InterviewTimeLevel2: false,
      InterviewedDateLevel2: false,
    });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [OpenComments, setOpenComments] = useState<boolean>(false);
  const [submitBtn, setSubmitBtn] = React.useState<string>("");
  const [level2Date, setLevel2Date] = useState<boolean>(false);
  const [level2Data, setLevel2Data] = useState<Level2Data>({
    InterviewedDate: undefined,
    InterviewMeetingInviteLink: "",
    InterviewTime: "",
  });
  const [rescheduleValidation, setRescheduleValidation] =
    useState<boolean>(false);

  const storedNoOfInterviewpanel = React.useRef<boolean>(false);

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
        props.EmployeeList
      );

      if (data.status === 200 && data.data !== null) {
        const op = data.data[0];
        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          op?.JobCode
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
          RoleProfileMaster.RoleProfile
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
        let InterviewDate = new Date(op?.InterviewDate);
        setInterviewedLevel((prevState: any) => ({
          ...prevState,
          InterviewedDate: InterviewDate,
          InterviewMeetingInviteLink: op?.InterviewLink,
          InterviewTime: op?.InterviewTime,
        }));
        if (
          props.stateValue?.initialTab === TabName.AssignInterviewPanel &&
          props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2
        ) {
          let InterviewDateLevel2 = new Date(op?.InterviewDateLevel2);
          setLevel2Data((prevState: any) => ({
            ...prevState,
            InterviewedDate: InterviewDateLevel2,
            InterviewMeetingInviteLink: op?.InterviewLinkLevel2,
            InterviewTime: op?.InterviewTimeLevel2,
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
      await GetPortalJobsService.getCandidateProfile(props.stateValue?.ID)
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
              }));
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
                            JobCode: CandidateProfile?.JobCode,
                            tab: props.stateValue?.tab,
                            JobCodeID: props.stateValue?.JobCodeID,
                          },
                        }
                      );
                    } else {
                      props.navigation(
                        "/RecurimentProcess/ReviewCandidateList",
                        {
                          state: {
                            ID: props.stateValue?.RecruitmentID,
                            TabNames: props.stateValue?.initialTab,
                            ButtonAction: ButtonAction.View,
                            JobCode: CandidateProfile?.JobCode,
                            tab: props.stateValue?.tab,
                            JobCodeID: props.stateValue?.JobCodeID,
                          },
                        }
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
              CandidateStatus: CandidateStatus.OnHold,
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
              CandidateStatus: CandidateStatus.No,
            }));
          }
          let CandidateScore = ReviewProfileScore.filter(
            (item) => item.text === CandidateProfile.hrComments
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
        todaydate.getSeconds()
      )
    );

    setSubmitBtn(
      props.stateValue?.initialTab === TabName.AssignInterviewPanel
        ? props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2 ||
          props.stateValue?.StatusId === StatusId.InterviewScheduled
          ? "Reschedule"
          : "Schedule for Interview "
        : "Submit"
    );
    const newTabNames = [
      { tabName: props.stateValue?.initialTab },
      { tabName: props.stateValue?.PreActionBtn },
      { tabName: TabName.ViewCandidateList },
      { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateDetails },
    ];
    setTabNameData(newTabNames);
    setLevel2Date(
      props.stateValue?.initialTab === TabName.AssignInterviewPanel &&
        (props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
          props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2)
        ? true
        : false
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

  React.useEffect(() => {
    const getRecurtimentList = async () => {
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
        Conditions
      );
      const Gradelevel = await CommonServices.GetGradeLevel(
        response.data[0]?.PatersonGrade
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
        response.data[0]?.AssignEMail
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
        props.stateValue?.StatusId
      );

      if (
        props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
      ) {
        storedNoOfInterviewpanel.current =
          AssignInterviewPanel.data &&
          AssignInterviewPanel.data?.Level2Panel.length < 3
            ? false
            : true;
      } else {
        storedNoOfInterviewpanel.current =
          AssignInterviewPanel.data &&
          AssignInterviewPanel.data?.Level1Panel.length < 3
            ? false
            : true;
      }
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
    if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
      void getRecurtimentList();
    }
  }, []);

  const handleRadioChange = async (item: string) => {
    setActionValue((prevState: any) => ({
      ...prevState,
      CandidateStatus: item,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      CandidateStatus: false,
    }));
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

  const handleDateChange = (value: Date | null | undefined) => {
    if (!value) {
      if (level2Date) {
        setLevel2Data((prevState: any) => ({
          ...prevState,
          InterviewedDate: undefined,
        }));

        setRescheduleValidation(false);
      } else {
        setInterviewedLevel((prevState: any) => ({
          ...prevState,
          InterviewedDate: undefined,
        }));
      }

      return;
    }

    const updatedDate = new Date(value); // selected date

    // Set time to current time
    // updatedDate.setHours(now.getHours());
    // updatedDate.setMinutes(now.getMinutes());
    // updatedDate.setSeconds(now.getSeconds());
    // updatedDate.setMilliseconds(now.getMilliseconds());
    if (level2Date) {
      setLevel2Data((prevState: any) => ({
        ...prevState,
        InterviewedDate: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewedDateLevel2: false,
      }));
    } else {
      setInterviewedLevel((prevState: any) => ({
        ...prevState,
        InterviewedDate: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewedDate: false,
      }));
    }
    if (!!updatedDate && updatedDate <= todaydate) {
      setRescheduleValidation(true);
    } else {
      setRescheduleValidation(false);
    }
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

  const handleInterviewTimeChange = (value: string | undefined) => {
    if (level2Date) {
      setLevel2Data((prevState: any) => ({
        ...prevState,
        InterviewTime: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewTimeLevel2: false,
      }));
    } else {
      setInterviewedLevel((prevState: any) => ({
        ...prevState,
        InterviewTime: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewTime: false,
      }));
    }
  };

  const handleInputChange = (value: string) => {
    if (level2Date) {
      setLevel2Data((prevState: any) => ({
        ...prevState,
        InterviewMeetingInviteLink: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewMeetingInviteLinkLevel2: false,
      }));
    } else {
      setInterviewedLevel((prevState: any) => ({
        ...prevState,
        InterviewMeetingInviteLink: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        InterviewMeetingInviteLink: false,
      }));
    }
  };

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    setInterviewedLevel((prevState) => ({
      ...prevState,
      CandidateScoreValue: value || { key: 0, text: "" },
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      ReviewFeedback: false,
    }));
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
                {/* <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${CandidateProfile.JobTitle} (${CandidateProfile.JobCode})`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div
                    className="ms-Grid-col ms-lg6"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <LabelHeaderComponents
                      value={`Status - ${CandidateProfile.Status}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div> */}
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Applicant Name"
                      value={CandidateProfile.ApplicantName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Applicant Surname"
                      value={CandidateProfile.ApplicantSurName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Nationality"
                      value={CandidateProfile.Nationality}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Gender"
                      value={CandidateProfile.Gender}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Highest Relevant Qualification"
                      value={CandidateProfile?.HighestQualification}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Experience In Mining Industry(Years)"
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
                        label="Number of tax dependents "
                        value={CandidateProfile.NumberOftax}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>

                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label="Last/Current position"
                        value={CandidateProfile?.CurrentPosition}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>

                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label="Last/Current employer"
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
                      label="Experience In Related Field(Years)"
                      value={CandidateProfile?.ExperRelatedfield}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  {CandidateProfile?.Agencies === labelName.Candidate && (
                    <>
                      {CandidateProfile?.ConflictsOfInterest && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label="Conflicts Of Interest"
                            value={CandidateProfile?.ConflictsOfInterest}
                            disabled={true}
                            mandatory={false}
                          />
                        </div>
                      )}
                      {CandidateProfile?.disability && (
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label="Disability"
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
                          label="No Of Interview Level's"
                          value={InterviewedLevel.Levels}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomInput
                          label="Grade"
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
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Willing to relocate if not currently living close to the relevant project site/office?"
                          value={CandidateProfile?.WillingToRelocate}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Has the person previously worked within the Ivanhoe Mines Group?"
                          value={CandidateProfile?.previouslyworkedMine}
                          options={["Yes", "No"]}
                          mandatory={false}
                          error={false}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Any family or other links with existing employees to declare? (If so, who? Attach detail)"
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
                    </div>

                    <div className="ms-Grid-row">
                      {CandidateProfile?.familylinks === "Yes" ? (
                        <div className="ms-Grid-col ms-lg6">
                          <Label>Attachment</Label>
                          <CustomViewDocument
                            Attachment={CandidateProfile.familyDocuments}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      {CandidateProfile?.businesslinks === "Yes" ? (
                        <div className="ms-Grid-col ms-lg6">
                          <Label>Attachment</Label>
                          <CustomViewDocument
                            Attachment={CandidateProfile.businessDocuments}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )}

                {props.stateValue?.initialTab ===
                TabName.AssignInterviewPanel ? (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg4">
                        <CustomDatePicker
                          selectedDate={InterviewedLevel.InterviewedDate}
                          label="Interview Date -  level 1"
                          error={validationErrors.InterviewedDate}
                          minDate={todaydate}
                          mandatory={!level2Date}
                          onChange={(date) =>
                            handleDateChange(date ?? undefined)
                          }
                          disabled={level2Date}
                        />
                        {/* {rescheduleValidation && (
                          <p
                            style={{
                              marginTop: 5,
                              color: "red",
                              fontSize: 12,
                              marginLeft: 0,
                            }}
                          >
                            Invaild Date
                          </p>
                        )} */}
                      </div>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomTimePicker
                          selectedTime={InterviewedLevel.InterviewTime}
                          label="Interview Time - Level 1"
                          error={validationErrors.InterviewTime}
                          mandatory={!level2Date}
                          disabled={level2Date}
                          onChange={handleInterviewTimeChange}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomInput
                          label="Meeting Link for Interview  - Level  1"
                          value={InterviewedLevel.InterviewMeetingInviteLink}
                          disabled={level2Date}
                          mandatory={!level2Date}
                          onChange={handleInputChange}
                          error={validationErrors.InterviewMeetingInviteLink}
                        />
                      </div>
                    </div>

                    {level2Date && (
                      <>
                        {/* <div
                            className="ms-Grid-row"
                            style={{ marginLeft: "0%" }}
                          > */}
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg4">
                            <CustomDatePicker
                              selectedDate={level2Data.InterviewedDate}
                              label="Interviewed Date-Level 2"
                              error={validationErrors.InterviewedDateLevel2}
                              minDate={todaydate}
                              mandatory={true}
                              onChange={(date) =>
                                handleDateChange(date ?? undefined)
                              }
                            />
                            {rescheduleValidation && (
                              <p
                                style={{
                                  marginTop: 5,
                                  color: "red",
                                  fontSize: 12,
                                  marginLeft: 0,
                                }}
                              >
                                Invaild Date
                              </p>
                            )}
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            <CustomTimePicker
                              selectedTime={level2Data.InterviewTime}
                              label="Interview Time-Level 2"
                              error={validationErrors.InterviewTimeLevel2}
                              mandatory={true}
                              onChange={handleInterviewTimeChange}
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg4">
                            <CustomInput
                              label="Meeting Link for Interview - Level  2"
                              value={level2Data.InterviewMeetingInviteLink}
                              mandatory={true}
                              onChange={handleInputChange}
                              error={
                                validationErrors.InterviewMeetingInviteLinkLevel2
                              }
                            />
                          </div>
                        </div>
                        {/* </div> */}
                      </>
                    )}

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <CustomMultiSelect
                          label="Interview Panel Members - Level 1"
                          value={InterviewedLevel.AssignInterviewLevel1}
                          options={
                            InterviewedLevel.AssignInterviewedLevel1Option
                          }
                          onChange={(value) => handleMulitiSelect(value)}
                          disabled={storedNoOfInterviewpanel.current} // !(InterviewedLevel.AssignInterviewLevel1.length < 4)
                          // mandatory={true}
                          error={validationErrors.AssignInterviewLevel1}
                        />
                        {InterviewedLevel.AssignInterviewLevel1.length > 0 &&
                          InterviewedLevel.AssignInterviewLevel1.length < 3 && (
                            <p
                              style={{
                                marginTop: 5,
                                color: "red",
                                fontSize: 12,
                                marginLeft: 0,
                              }}
                            >
                              Minimum of three is required
                            </p>
                          )}
                      </div>
                      {InterviewedLevel.Levels === InterviewLevels.Level2 &&
                        (props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
                          props.stateValue?.StatusId ===
                            StatusId.InterviewScheduledforLevel2) && (
                          <>
                            <div
                              className="ms-Grid-col ms-lg12"
                              style={{ marginTop: "2%" }}
                            >
                              <CustomMultiSelect
                                label="Interview Panel Members - Level 2"
                                value={InterviewedLevel.AssignInterviewedLevel2}
                                options={
                                  InterviewedLevel.AssignInterviewedLevel1Option
                                }
                                disabled={storedNoOfInterviewpanel.current}
                                // mandatory={true}
                              />
                            </div>
                          </>
                        )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {CandidateProfile?.disabilityReason &&
                  CandidateProfile?.disability === Choices.Yes && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <CustomTextArea
                          label="Disability Details"
                          value={CandidateProfile?.disabilityReason}
                          disabled={true}
                          mandatory={false}
                          error={false}
                        />
                      </div>
                    </div>
                  )}
                <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                  <LabelHeaderComponents value={"Attachments"} />
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Candidate Resume"} />
                    <CustomViewDocument
                      Attachment={CandidateProfile.CandidateResume}
                      // Label={"Candidate Resume"}
                    />
                  </div>
                  {/* <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Role Profile Document"} />
                    <CustomViewDocument
                      Attachment={CandidateProfile.RoleProfile}
                      // Label={"Role Profile Document"}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Advertisement Documents"} />
                    <CustomViewDocument
                      Attachment={CandidateProfile.Advertisement}
                      // Label={"Advertisement Documents"}
                    />
                  </div> */}
                </div>
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
                                ? labelName.Level1CandidateLabel
                                : labelName.Level2CandidateLabel
                            }
                            value={actionValue.CandidateStatus}
                            options={["Yes", "No", "On Hold"]}
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
                            label="Review Profile Feedback - HR"
                            options={InterviewedLevel.CandidateScoreOption}
                            value={InterviewedLevel.CandidateScoreValue}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) => handleAutoComplete(item)}
                            error={validationErrors.ReviewFeedback}
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
                            label="Review profile Feedback - HR"
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
                            label="Review profile Feedback"
                            value={CandidateProfile.hrComments}
                            disabled={true}
                            // mandatory={true}
                            // onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.CurrentRoleID.includes(RoleID.LineManager) &&
                  CandidateProfile.Comments.length > 0 && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg4">
                        <CustomLabel value={"View Justifications"} />
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
                          onClick={() => setOpenComments(true)}
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
                          label="Justification"
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
      InterviewedDate: false,
      AssignInterviewLevel1: false,
      CandidateScoreValue: false,
      InterviewMeetingInviteLink: false,
      InterviewTime: false,
      ReviewFeedback: false,
      InterviewMeetingInviteLinkLevel2: false,
      InterviewTimeLevel2: false,
      InterviewedDateLevel2: false,
    };

    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(Checkbox);
        errors.InterviewedDate = !IsValid(InterviewedLevel.InterviewedDate);
        errors.AssignInterviewLevel1 = !IsValid(
          InterviewedLevel.AssignInterviewLevel1?.[2]?.text ?? ""
        );
        errors.InterviewTime = !IsValid(InterviewedLevel.InterviewTime);
        errors.InterviewMeetingInviteLink = !IsValid(
          InterviewedLevel.InterviewMeetingInviteLink
        );
        if (
          props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
        ) {
          errors.InterviewTimeLevel2 = !IsValid(level2Data.InterviewTime);
          errors.InterviewMeetingInviteLinkLevel2 = !IsValid(
            level2Data.InterviewMeetingInviteLink
          );
          errors.InterviewedDateLevel2 = !IsValid(level2Data.InterviewedDate);
        }
      } else {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(Checkbox);
        errors.ReviewFeedback = !IsValid(
          InterviewedLevel?.CandidateScoreValue?.text
        );
      }
    } else if (props.CurrentRoleID.includes(RoleID.LineManager)) {
      errors.Comments = !IsValid(actionValue.Comments);
      errors.Checkboxalidation = !IsValid(Checkbox);
      errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
    }

    if (props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2) {
      const interviewDate = level2Data?.InterviewedDate
        ? new Date(level2Data.InterviewedDate)
        : null;

      const RescheduleValue = !!interviewDate && interviewDate <= todaydate;
      setRescheduleValidation(RescheduleValue);
    }

    if (props.stateValue?.StatusId === StatusId.InterviewScheduled) {
      const interviewDate = InterviewedLevel?.InterviewedDate
        ? new Date(InterviewedLevel.InterviewedDate)
        : null;

      const RescheduleValue = !!interviewDate && interviewDate <= todaydate;
      setRescheduleValidation(RescheduleValue);
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
          JobCode: CandidateProfile?.JobCode,
        },
      });
    } else {
      props.navigation("/RecurimentProcess/ReviewCandidateList", {
        state: {
          ID: props.stateValue?.RecruitmentID,
          TabNames: props.stateValue?.initialTab,
          ButtonAction: ButtonAction.View,
          JobCode: CandidateProfile?.JobCode,
        },
      });
    }
  }

  const SpiltDateOnly = (Date: Date) => {
    const updatedDate = Date;
    const year = updatedDate?.getFullYear();
    const month = String(updatedDate?.getMonth() + 1).padStart(2, "0");
    const day = String(updatedDate?.getDate()).padStart(2, "0");

    const dateOnly = `${year}-${month}-${day}`;
    return dateOnly;
  };

  const UploadCandidateDetails = async () => {
    const filterConditions = [];
    const Conditions = "";
    filterConditions.push({
      FilterKey: "ID",
      Operator: "eq",
      FilterValue: props.stateValue.RecruitmentID,
    });
    const RecruitmentDetails = await getVRRDetails.GetRecruitmentDetails(
      filterConditions,
      Conditions
    );
    // const HRMSExternalAgents = await CommonServices.GetMasterData(
    //   ListNames.HRMSExternalAgents
    // );
    // let matchedAgents = HRMSExternalAgents.data.filter(
    //   (item) => item.AgentName === CandidateProfile.Agencies
    // );
    let DOBValue = CandidateProfile.DOB
      ? new Date(CandidateProfile.DOB)
      : undefined;
    let InterviewDate = SpiltDateOnly(
      InterviewedLevel?.InterviewedDate ?? new Date()
    );
    let DOBData = SpiltDateOnly(DOBValue ?? new Date());
    const CandidateDetails: CandidateDetails = {
      RecruitmentIDId: props.stateValue.RecruitmentID,
      JobCodeId: RecruitmentDetails.data[0].JobCodeId,
      FristName: CandidateProfile.FristName,
      MiddleName: CandidateProfile.MiddleName,
      LastName: CandidateProfile.ApplicantSurName,
      ResidentialAddress: CandidateProfile.ResidentialAddress,
      DOB: DOBData,
      ContactNumber: CandidateProfile.ContactNumber,
      Email: CandidateProfile.Email,
      Nationality: CandidateProfile.Nationality,
      Gender: CandidateProfile.Gender,
      TotalYearOfExperiance: String(CandidateProfile.ExperRelatedfield),
      ReleventExperience: CandidateProfile.ExperienceMining,
      Qualification: CandidateProfile.HighestQualification,
      JobRequestID: String(CandidateProfile.CandidateID),
      ProfileID: String(CandidateProfile.profileID),
      PositionTitle: RecruitmentDetails?.data[0]?.JobTitleEnglish,
      JobGrade: RecruitmentDetails?.data[0]?.DRCGrade,
      ExternalAgentDetails: CandidateProfile.Agencies,
      InterviewDate: InterviewDate,
      InterviewTime: InterviewedLevel?.InterviewTime,
      InterviewLink: InterviewedLevel?.InterviewMeetingInviteLink,
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
      PreviouslyWorkedInIvanhoeMines: CandidateProfile.previouslyworkedMine,
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

      OthersInterviewed: "Yes",
    };
    let selectedinterviewpanal: any[] = [];

    for (let i = 0; i < InterviewedLevel.AssignInterviewLevel1.length; i++) {
      const currentItem = InterviewedLevel.AssignInterviewLevel1[i];
      let selectedinterview = {
        RecruitmentIDId: RecruitmentDetails.data[0]?.ID,
        InterviewLevel: InterviewLevels.Level1, //InterviewedLevel.Levels,
        InterviewPanel: currentItem.key,
        CandidateID: 0,
      };

      selectedinterviewpanal.push(selectedinterview);
    }
    await GetPortalJobsService.InsertCandidateDetailsInList(
      CandidateDetails,
      selectedinterviewpanal
    )
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((error) => {
        console.log(error, "Candidate upload failed");
      });
  };

  async function Submit_fn() {
    setIsLoading(true);
    try {
      const isValid = !Validation();
      if (!isValid) {
        return;
      }
      if (
        (props.stateValue.tab === "tab2" || props.stateValue.tab === "tab3") &&
        props.stateValue?.initialTab === TabName.AssignInterviewPanel
      ) {
        let obj: any = {};
        if (
          props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
        ) {
          let InterviewDate2 = SpiltDateOnly(
            level2Data?.InterviewedDate ?? new Date()
          );

          obj = {
            ID: Number(CandidateProfile.CandidateID),
            InterviewDateLevel2: InterviewDate2,
            InterviewTimeLevel2: level2Data?.InterviewTime,
            InterviewLinkLevel2: level2Data?.InterviewMeetingInviteLink,
          };

          if (
            props.stateValue?.initialTab === TabName.AssignInterviewPanel &&
            props.stateValue?.StatusId ===
              StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
          ) {
            obj.ActionId = WorkflowAction.Approved;
            obj.ItemCreated = Choices.Yes;
          }
        } else {
          if (props.stateValue?.StatusId === StatusId.InterviewScheduled) {
            let InterviewDate = SpiltDateOnly(
              InterviewedLevel?.InterviewedDate ?? new Date()
            );
            obj = {
              ID: Number(CandidateProfile.CandidateID),
              InterviewDate: InterviewDate,
              InterviewTime: InterviewedLevel?.InterviewTime,
              InterviewLink: InterviewedLevel?.InterviewMeetingInviteLink,
            };
          } else {
            let InterviewDate2 = SpiltDateOnly(
              level2Data?.InterviewedDate ?? new Date()
            );
            obj = {
              ID: Number(CandidateProfile.CandidateID),
              InterviewDateLevel2: InterviewDate2,
              InterviewTimeLevel2: level2Data?.InterviewTime,
              InterviewLinkLevel2: level2Data?.InterviewMeetingInviteLink,
            };
          }
        }
        const UpdateInterviewData =
          await GetPortalJobsService.RescheduledInterview(
            obj,
            ListNames.HRMSRecruitmentCandidatePersonalDetails
          );
        if (UpdateInterviewData.status === 200) {
          if (
            props.stateValue?.StatusId ===
            StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
          ) {
            let selectedinterviewpanal: any[] = [];

            for (
              let i = 0;
              i < InterviewedLevel.AssignInterviewedLevel2.length;
              i++
            ) {
              const currentItem = InterviewedLevel.AssignInterviewedLevel2[i];

              let selectedinterview = {
                RecruitmentIDId: props.stateValue?.RecruitmentID,
                InterviewLevel: InterviewLevels.Level2, //InterviewedLevel.Levels,
                InterviewPanel: currentItem.key,
                CandidateID: Number(CandidateProfile.CandidateID),
              };

              selectedinterviewpanal.push(selectedinterview);
            }

            await GetPortalJobsService.InsertInterviewPanel(
              selectedinterviewpanal,
              Number(CandidateProfile.CandidateID)
            );
          }

          const SuccessAlert = {
            Message:
              props.stateValue?.StatusId ===
              StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
                ? RecuritmentHRMsg.InterviewPanalLevel2
                : RecuritmentHRMsg.RescheduleSuccessMsg,
            Type: HRMSAlertOptions.Success,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                  props.navigation("/ReviewProfileList/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                } else {
                  props.navigation("/RecurimentProcess/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                }

                setAlertPopupOpen(false);
              }
            },
          };
          setAlertPopupOpen(true);
          setalertProps(SuccessAlert);
        }
      } else {
        let CurrentUserRole = GetWorkflowStatusByID(props.stateValue?.StatusId);
        const createFilter = (workflowStatus: string): WorkflowJson => ({
          workflowStatus: workflowStatus,
          jobRequestId: props.stateValue?.ID,
          comments: actionValue.Comments,
          actionBy: CurrentUserRole,
          hrComments:
            props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
            props.stateValue?.initialTab === TabName.ReviewProfile
              ? InterviewedLevel.CandidateScoreValue.text ?? ""
              : CandidateProfile?.hrComments,
        });
        let CandidateData: WorkflowJson = {
          workflowStatus: "",
          jobRequestId: 0,
          comments: "",
          actionBy: "",
          hrComments: "",
        };
        let PopupMessage: string = "";
        if (props.CurrentRoleID.includes(RoleID.LineManager)) {
          switch (actionValue.CandidateStatus) {
            case CandidateStatus.Yes:
              if (
                CandidateProfile.workflowStatusId ===
                  workflowStatusApi.LineManagerL2Pending ||
                CandidateProfile.workflowStatusId ===
                  workflowStatusApi.LineManagerLevel2OnHold
              ) {
                CandidateData = createFilter(
                  workflowStatusApi.PendingRecruitmentHRscheduleInterview
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewed;
              } else {
                CandidateData = createFilter(
                  workflowStatusApi.LineManagerL2Pending
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewed;
              }
              break;

            case CandidateStatus.No:
              if (
                CandidateProfile.workflowStatusId ===
                workflowStatusApi.LineManagerL2Pending
              ) {
                CandidateData = createFilter(
                  workflowStatusApi.LineManagerLevel2Rejected
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewedNo;
              } else {
                CandidateData = createFilter(
                  workflowStatusApi.LineManagerLevel1Rejected
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewedNo;
              }
              break;

            case CandidateStatus.OnHold:
              if (
                CandidateProfile.workflowStatusId ===
                workflowStatusApi.LineManagerL2Pending
              ) {
                CandidateData = createFilter(
                  workflowStatusApi.LineManagerLevel2OnHold
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewedWaitingList;
              } else {
                CandidateData = createFilter(
                  workflowStatusApi.LineManagerLevel1OnHold
                );
                PopupMessage = RecuritmentHRMsg.ProfileReviewedWaitingList;
              }
              break;
          }
        } else {
          if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
            CandidateData = createFilter(workflowStatusApi.InterviewScheduled);
            PopupMessage =
              InterviewedLevel.Levels === InterviewLevels.Level2
                ? RecuritmentHRMsg.InterviewPanalLevel1
                : RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
          } else {
            CandidateData = createFilter(
              workflowStatusApi.LineManagerL1Pending
            );
            PopupMessage = RecuritmentHRMsg.HRReviewCandidate;
          }
        }

        const res = await GetPortalJobsService.UpdateCandidateStatus(
          CandidateData
        );
        if (res.status === 200) {
          if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
            await UploadCandidateDetails();
          }
          const SuccessAlert = {
            Message: PopupMessage,
            Type: HRMSAlertOptions.Success,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                  props.navigation("/ReviewProfileList/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                } else {
                  props.navigation("/RecurimentProcess/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                }

                setAlertPopupOpen(false);
              }
            },
          };
          setAlertPopupOpen(true);
          setalertProps(SuccessAlert);
        } else {
          const APIErrorAlert = {
            Message: RecuritmentHRMsg.APIErrorMsg,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                  props.navigation("/ReviewProfileList/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                } else {
                  props.navigation("/RecurimentProcess/ReviewCandidateList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: CandidateProfile?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
                    },
                  });
                }

                setAlertPopupOpen(false);
              }
            },
          };
          setAlertPopupOpen(true);
          setalertProps(APIErrorAlert);
        }
      }
    } catch (error) {
      console.error("Error submitting candidate details", error);
    } finally {
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
                JobCode: CandidateProfile?.JobCode,
                tab: props.stateValue?.tab,
                JobCodeID: props.stateValue?.JobCodeID,
              },
            });
          } else {
            props.navigation("/RecurimentProcess/ReviewCandidateList", {
              state: {
                ID: props.stateValue?.RecruitmentID,
                TabNames: props.stateValue?.initialTab,
                ButtonAction: ButtonAction.View,
                JobCode: CandidateProfile?.JobCode,
                tab: props.stateValue?.tab,
                JobCodeID: props.stateValue?.JobCodeID,
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

  return (
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
            additionalButtons={
              props.stateValue?.ButtonAction === ButtonAction.View
                ? [
                    {
                      label: "Back",
                      onClick: async () => {
                        back_fn();
                      },
                    },
                  ]
                : [
                    {
                      label: submitBtn,
                      onClick: async () => {
                        await Submit_fn();
                      },
                    },
                  ]
            }
          />
          {/* <TabsComponent
            tabs={tabs}
            initialTab="tab1"
            
          /> */}
        </div>
      </CustomLoader>

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

      {OpenComments && (
        <Dialog
          header={
            <>
              <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                <LabelHeaderComponents value="Justifications" />
              </div>
            </>
          }
          visible={OpenComments}
          style={{
            width: "26vw",
            backgroundColor: "white",
            borderRadius: "26px",
            padding: "20px",
          }}
          onHide={() => setOpenComments(false)}
        >
          <CustomJsonComments
            onClose={() => setOpenComments(false)}
            Comments={CandidateProfile.Comments}
          />
        </Dialog>
      )}
    </>
  );
};

export default ViewCandidateDetails;
