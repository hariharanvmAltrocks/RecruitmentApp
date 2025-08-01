import * as React from "react";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  alertPropsData,
  AutoCompleteItem,
  InterviewPanaldata,
} from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import {
  DocumentLibraray,
  EmploymentOption,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleProfileMaster,
  ScoreRanking,
  TabName,
  InterviewLevels,
  WorkflowAction,
  workflowStatusApi,
  RoleID,
  ResponeStatus,
  CheckboxContent,
  Choices,
  RoleName,
} from "../../utilities/Config";
import { QuestionItem, ScoreCardData } from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomTextArea from "../../components/CustomTextArea";
import { Card, CardContent, Chip } from "@mui/material";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomSignature from "../../components/CustomSignature";
import CustomViewDocument from "../../components/CustomViewDocument";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomLabel from "../../components/CustomLabel";
import SPServices from "../../Services/SPService/SPServices";
import { WorkflowJson } from "../../Models/ApIInterface";

type ValidationError = {
  Qualifications: boolean;
  Experience: boolean;
  Knowledge: boolean;
  Energylevel: boolean;
  Requirements: boolean;
  contributeculture: boolean;
  ExpatExperienceCongolese: boolean;
  CriteriaRecognised: boolean;
  Employment: boolean;
  EvaluationFeedback: boolean;
  CheckboxValidation: boolean;
  OverAllEvaluationFeedback: boolean;
  AdvertisementDocument: boolean;
};
type InterviewedLevelValue = {
  Levels: string;
  Grade: string;
};
const InterviewPanelEdit = (props: any) => {
  const todaydate = new Date();
  const [CandidateData, setCandidateData] = React.useState<ScoreCardData>({
    CandidateID: 0,
    RecruitmentID: 0,
    JobCode: "",
    JobCodeId: 0,
    PassportID: "",
    FristName: "",
    MiddleName: "",
    LastName: "",
    FullName: "",
    ResidentialAddress: "",
    DOB: "",
    ContactNumber: "",
    Email: "",
    Nationality: "",
    Gender: "",
    TotalYearOfExperiance: "",
    Skills: "",
    LanguageKnown: "",
    ReleventExperience: "",
    Qualification: "",
    Qualifications: { key: 0, text: "" },
    Experience: { key: 0, text: "" },
    Knowledge: { key: 0, text: "" },
    Energylevel: { key: 0, text: "" },
    Requirements: { key: 0, text: "" },
    contributeculture: { key: 0, text: "" },
    ExpatExperienceCongolese: { key: 0, text: "" },
    CriteriaRecognised: { key: 0, text: "" },
    CandidateCVDoc: [],
    Employment: "",
    EvaluationFeedback: "",
    OverAllEvaluationFeedback: "",
    SignDate: new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    ),
    AdvertisementDocument: [],
    RoleProfileDocument: [],
    PositionTitle: "",
    interviewPanelTitles: [] as string[],
    InterviewDate: "",
    JobRequestID: "",
    Comments: "",
    JobGrade: "",
    PanelFullNames: [],
    InterviewLevels: [],
    GPA: "",
    ConflictsOfInterest: "",
    disability: "",
    disabilityReason: "",
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [ValidationError, setValidationError] = React.useState<ValidationError>(
    {
      Qualifications: false,
      Experience: false,
      Knowledge: false,
      Energylevel: false,
      Requirements: false,
      contributeculture: false,
      ExpatExperienceCongolese: false,
      CriteriaRecognised: false,
      Employment: false,
      EvaluationFeedback: false,
      OverAllEvaluationFeedback: false,
      CheckboxValidation: false,
      AdvertisementDocument: false,
    }
  );
  const [Checkbox, setCheckbox] = React.useState<boolean>(false);
  const [InterviewPanelData, setInterviewPanelData] = React.useState<
    InterviewPanaldata[]
  >([
    {
      ID: 0,
      CandidateID: 0,
      RecruitmentID: 0,
      InterviewLevel: "",
      InterviewPanel: 0,
      InterviewPanalNames: [],
      InterviewPanelTitle: "",
      IsScoreSheetUploaded: "",
    },
  ]);
  const [InterviewedLevel, setInterviewedLevel] =
    React.useState<InterviewedLevelValue>({
      Levels: "",
      Grade: "",
    });
  //Questionaires
  const [questionnaire, setQuestionnaire] = React.useState<QuestionItem[]>([]);
  const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
  const [ratingErrors, setRatingErrors] = React.useState<
    Record<number, boolean>
  >({});
  const [interviewPanelTitlesLevel1, setInterviewPanelTitlesLevel1] =
    React.useState<string[]>([]);
  const [interviewPanelTitlesLevel2, setInterviewPanelTitlesLevel2] =
    React.useState<string[]>([]);
  const [currentRoleID, setCurrentRoleID] = React.useState<number>(0);

  React.useEffect(() => {
    // let userRole = props.CurrentRoleID.filter(
    //   (role: number) =>
    //     role === RoleID.RecruitmentHR ||
    //     role === RoleID.LineManager ||
    //     role === RoleID.HOD ||
    //     role === RoleID.InterviewPanel
    // );
    setCurrentRoleID(
      props.stateValue?.TabName !== TabName.Evaluation
        ? RoleID.HOD
        : props.CurrentRoleID.includes(RoleID.LineManager)
        ? RoleID.LineManager
        : props.CurrentRoleID[0]
    );
  }, []);

  const handleRatingChange = (id: number, value: AutoCompleteItem | null) => {
    setQuestionnaire((prevState) =>
      questionnaire.map((q) =>
        q.id === id ? { ...q, rating: value?.key ?? 0 } : q
      )
    );
    setRatingErrors((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const ScoreRating = [
    { key: 3, text: "3 - Excellent" },
    { key: 2, text: "2 - Acceptable" },
    { key: 1, text: "1 - Not Acceptable" },
  ];

  const fetchInterviewPanelDetails = () => {
    const candidateID: number = props.stateValue?.ID;
    setIsLoading(true);

    const filterConditions = [
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: candidateID,
      },
    ];

    InterviewServices.GetPanelLeveldata(filterConditions, props.EmployeeList)
      .then((scoreResponse) => {
        if (scoreResponse?.status === 200) {
          const groupedPanelData = scoreResponse.data as Record<
            string,
            string[]
          >;

          // Set titles by level
          setInterviewPanelTitlesLevel1(groupedPanelData["Level 1"] || []);
          setInterviewPanelTitlesLevel2(groupedPanelData["Level 2"] || []);
        } else {
          setInterviewPanelTitlesLevel1([]);
          setInterviewPanelTitlesLevel2([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching panel data:", error);
        setInterviewPanelTitlesLevel1([]);
        setInterviewPanelTitlesLevel2([]);
      });
  };

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

        setCandidateData((prevState) => ({
          ...prevState,
          CandidateID: op?.ID,
          RecruitmentID: op?.RecruitmentID,
          JobCode: op?.JobCode,
          JobCodeId: op?.JobCodeId,
          PassportID: op?.PassportID,
          FullName: op?.FullName,
          ResidentialAddress: op?.ResidentialAddress,
          DOB: op?.DOB,
          ContactNumber: op?.ContactNumber,
          Email: op?.Email,
          Nationality: op?.Nationality,
          Gender: op?.Gender,
          TotalYearOfExperiance: op?.TotalYearOfExperiance,
          Skills: op?.Skills,
          LanguageKnown: op?.LanguageKnown,
          ReleventExperience: op?.ReleventExperience,
          Qualification: op?.Qualification,
          CandidateCVDoc: op?.CandidateCVDoc,
          AdvertisementDocument: advertisementDocuments,
          RoleProfileDocument: roleProfileDocuments,
          PositionTitle: op?.PositionTitle,
          InterviewDate: op?.InterviewDate,
          JobRequestID: op?.JobRequestID,
          JobGrade: op?.JobGrade,
          ConflictsOfInterest: op?.ConflictsOfInterest,
          disability: op?.disability,
          disabilityReason: op?.disabilityReason,
        }));
        // await fetchRoleProfileData(op.JobCodeId);
        if (questionnaire.length === 0) {
          const getQuestion = await GetPortalJobsService.getQuestionnaire(
            op?.JobCode
          );
          if (getQuestion.status === ResponeStatus.SUCCESS) {
            if (getQuestion?.data?.length === 0) {
              let QuestionAlertMsg = {
                Message: RecuritmentHRMsg.QuestionAlertMsg,
                Type: HRMSAlertOptions.Error,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                      props.navigation("/ReviewProfileList", {
                        state: {
                          tab: "tab4", //props.stateValue?.tab,
                          TabName: TabName.Evaluation,
                        },
                      });
                    } else if (
                      props.CurrentRoleID.includes(RoleID.HOD) ||
                      props.CurrentRoleID.includes(RoleID.LineManager)
                    ) {
                      props.navigation("/RecurimentProcess", {
                        state: {
                          tab: props.CurrentRoleID.includes(RoleID.HOD)
                            ? "tab3"
                            : "tab4", //props.stateValue?.tab,
                          TabName: TabName.Evaluation,
                        },
                      });
                    } else {
                      props.navigation("/InterviewPanelList");
                    }
                    setAlertPopupOpen(false);
                  } else {
                    setAlertPopupOpen(false);
                  }
                },
              };

              setAlertPopupOpen(true);
              setalertProps(QuestionAlertMsg);
              setIsLoading(false);
            } else {
              setQuestionnaire(getQuestion?.data ?? []);
            }
          } else {
            let APIErrorMsg = {
              Message: RecuritmentHRMsg.APIErrorMsg,
              Type: HRMSAlertOptions.Error,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                    props.navigation("/ReviewProfileList", {
                      state: {
                        tab: "tab4", //props.stateValue?.tab,
                        TabName: TabName.Evaluation,
                      },
                    });
                  } else if (
                    props.CurrentRoleID.includes(RoleID.HOD) ||
                    props.CurrentRoleID.includes(RoleID.LineManager)
                  ) {
                    props.navigation("/RecurimentProcess", {
                      state: {
                        tab: props.CurrentRoleID.includes(RoleID.HOD)
                          ? "tab3"
                          : "tab4", //props.stateValue?.tab,
                        TabName: TabName.Evaluation,
                      },
                    });
                  } else {
                    props.navigation("/InterviewPanelList");
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
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleRadioChange = async (key: keyof ScoreCardData, value: string) => {
    if (value) {
      setCandidateData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      setValidationError((prevState) => ({
        ...prevState,
        [key]: false,
      }));
    }
  };

  // const handleCheckbox = (value: boolean) => {
  //   setCheckbox(value);
  //   setValidationError((prevState) => ({
  //     ...prevState,
  //     Checkboxalidation: false,
  //   }));
  // };

  const handleCheckbox = (value: boolean) => {
    setCheckbox(value);
    setValidationError((prevState) => ({
      ...prevState,
      CheckboxValidation: false,
    }));
  };

  const handleAutoComplete = async (
    key: keyof ScoreCardData,
    value: AutoCompleteItem | null
  ) => {
    setCandidateData((prevState) => ({
      ...prevState,
      [key]: value || { key: 0, text: "" },
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handletextArea = async (key: keyof ScoreCardData, value: string) => {
    setCandidateData((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    setValidationError((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const shouldShowTextArea = [
    CandidateData.Qualifications,
    CandidateData.Experience,
    CandidateData.Knowledge,
    CandidateData.Energylevel,
    CandidateData.Requirements,
    CandidateData.contributeculture,
    CandidateData.ExpatExperienceCongolese,
    CandidateData.CriteriaRecognised,
  ].some((item) => item?.key !== 0 && Number(item.key) <= 2);

  const Validation = (): boolean => {
    const {
      Qualifications,
      Experience,
      Knowledge,
      Energylevel,
      Requirements,
      contributeculture,
      ExpatExperienceCongolese,
      CriteriaRecognised,
      Employment,
      EvaluationFeedback,
      OverAllEvaluationFeedback,
    } = CandidateData;

    ValidationError.Qualifications = !IsValid(Qualifications.text);
    ValidationError.Experience = !IsValid(Experience.text);
    ValidationError.Knowledge = !IsValid(Knowledge.text);
    ValidationError.Energylevel = !IsValid(Energylevel.text);
    ValidationError.Requirements = !IsValid(Requirements.text);
    ValidationError.contributeculture = !IsValid(contributeculture.text);
    ValidationError.ExpatExperienceCongolese = !IsValid(
      ExpatExperienceCongolese.text
    );
    ValidationError.CriteriaRecognised = !IsValid(CriteriaRecognised.text);
    ValidationError.Employment = !IsValid(Employment);

    ValidationError.EvaluationFeedback = shouldShowTextArea
      ? !IsValid(EvaluationFeedback)
      : false;

    ValidationError.OverAllEvaluationFeedback = !IsValid(
      OverAllEvaluationFeedback
    );
    ValidationError.CheckboxValidation = !IsValid(Checkbox);

    setValidationError((prevState) => ({
      ...prevState,
      ...ValidationError,
    }));

    return Object.values(ValidationError).some((error) => error);
  };

  const Submit_fn = async () => {
    try {
      let isValid = !Validation();
      if (!isValid) return;
      setIsLoading(true);
      const CurrentUserResponse = await CommonServices.getUserGuidByEmail(
        props.CurrentUserEmailId
      );
      const currentUserKey = CurrentUserResponse.data?.key?.toString();

      const CandidatePersonalDetailsResponse =
        await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
          undefined,
          [
            {
              FilterKey: "ID",
              Operator: "eq",
              FilterValue: props.stateValue?.ID,
            },
          ]
        );
      const InterviewPanelResponse =
        await InterviewServices.GetInterviewPanelDetails([
          {
            FilterKey: "CandidateIDId",
            Operator: "eq",
            FilterValue: props.stateValue?.ID,
          },
        ]);

      if (
        !CandidatePersonalDetailsResponse.data ||
        !InterviewPanelResponse.data
      ) {
        return;
      }

      const CandidateDatares = CandidatePersonalDetailsResponse.data.find(
        (item: any) => item.ID === props.stateValue?.ID
      );

      const matchingPanels = InterviewPanelResponse.data.filter(
        (panel: any) =>
          props.stateValue?.ID === panel.CandidateID &&
          CandidateDatares?.RecruitmentID === panel.RecruitmentID
      );

      if (matchingPanels.length === 0) {
        return;
      }

      const userPanels = matchingPanels.filter(
        (panel: any) => panel.InterviewPanel === Number(currentUserKey)
      );

      if (userPanels.length === 0) {
        return;
      }

      for (const panel of userPanels) {
        const InterviewPanelID = panel.ID;
        let QuestionScore: { [key: string]: number }[] = [];

        questionnaire.forEach((item) => {
          let QuestionScoreData = {
            [item.header as string]: item.rating ?? 0,
          };
          QuestionScore.push(QuestionScoreData);
        });

        const scorecardObj = {
          RelevantQualification: String(CandidateData?.Qualifications?.key),
          ReleventExperience: String(CandidateData?.Experience?.key),
          Knowledge: String(CandidateData?.Knowledge?.key),
          EnergyLevel: String(CandidateData?.Energylevel?.key),
          MeetJobRequirement: String(CandidateData?.Requirements?.key),
          ContributeTowardsCultureRequried: String(
            CandidateData?.contributeculture?.key
          ),
          Experience: String(CandidateData?.ExpatExperienceCongolese?.key),
          OtherCriteriaScore: String(CandidateData?.CriteriaRecognised?.key),
          ConsiderForEmployment: CandidateData?.Employment,
          ...(shouldShowTextArea && {
            Feedback: CandidateData?.EvaluationFeedback,
          }),
          OverAllEvaluationFeedback: CandidateData?.OverAllEvaluationFeedback,
          RecruitmentIDId: CandidateData?.RecruitmentID,
          RoleId: currentRoleID,
          InterviewPersonNameId: currentUserKey,
          InterviewPanelIDId: InterviewPanelID,
          QuestionJson: JSON.stringify(QuestionScore),
        };

        await getVRRDetails.InsertList(
          scorecardObj,
          ListNames.HRMSCandidateScoreCard
        );

        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSInterviewPanelDetails,
          RequestJSON: { IsScoreSheetUploaded: "Yes" },
          ID: InterviewPanelID,
        });
      }
      const updatedInterviewPanelResponse =
        await InterviewServices.GetInterviewPanelDetails([
          {
            FilterKey: "CandidateID",
            Operator: "eq",
            FilterValue: props.stateValue?.ID,
          },
        ]);

      if (
        !updatedInterviewPanelResponse.data ||
        updatedInterviewPanelResponse.data.length === 0
      ) {
        return;
      }

      const level1Panels = updatedInterviewPanelResponse.data.filter(
        (p) => p.InterviewLevel === InterviewLevels.Level1
      );

      const uploadedCount = level1Panels.filter(
        (p) => p.IsScoreSheetUploaded === "Yes"
      ).length;

      if (uploadedCount === level1Panels.length) {
        try {
          let CandidateDatas: WorkflowJson = {
            workflowStatus: workflowStatusApi.pendingHODSelection,
            jobRequestId: Number(CandidateData.JobRequestID),
            comments: "",
            actionBy: RoleName.HOD,
          };

          await GetPortalJobsService.UpdateCandidateStatus(CandidateDatas);

          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
            RequestJSON: {
              IsScoreSheetUploaded: "Yes",
              ActionId: WorkflowAction.Approved,
              ItemCreated: "Yes",
            },
            ID: props.stateValue?.ID,
          });
        } catch (finalUpdateError) {
          console.error("", finalUpdateError);
        }
      } else {
      }

      setAlertPopupOpen(true);
      setalertProps({
        Message: RecuritmentHRMsg.ScoreCardSubmitMsg,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: (userClickedOK: any) => {
          if (userClickedOK) {
            if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
              props.navigation("/ReviewProfileList", {
                state: {
                  tab: "tab4", //props.stateValue?.tab,
                  TabName: TabName.Evaluation,
                },
              });
            } else if (
              props.CurrentRoleID.includes(RoleID.HOD) ||
              props.CurrentRoleID.includes(RoleID.LineManager)
            ) {
              props.navigation("/RecurimentProcess", {
                state: {
                  tab: props.CurrentRoleID.includes(RoleID.HOD)
                    ? "tab3"
                    : "tab4", //props.stateValue?.tab,
                  TabName: TabName.Evaluation,
                },
              });
            } else {
              props.navigation("/InterviewPanelList");
            }
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      throw new Error("Failed to submit data. Please try again later.");
    }
  };
  React.useEffect(() => {
    const getRecruitmentGradeLevel = async () => {
      const filterConditions = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.RecruitmentID,
        },
      ];

      const response = await getVRRDetails.GetRecruitmentDetails(
        filterConditions,
        ""
      );

      const grade = response.data[0]?.PatersonGrade;
      const gradeLevelResponse = await CommonServices.GetGradeLevel(grade);

      setInterviewedLevel((prevState: any) => ({
        ...prevState,
        Grade: grade,
        Levels: gradeLevelResponse.data[0]?.Level,
      }));
    };

    void getRecruitmentGradeLevel();
  }, []);
  const tabs = [
    {
      label: TabName.ViewCandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div className="ms-Grid-row">
              {/* <div className="ms-Grid-col ms-lg6">
                <LabelHeaderComponents
                  value={`Job Title - ${CandidateData.PositionTitle} (${CandidateData.JobCode})`}
                >
                  {" "}
                </LabelHeaderComponents>
              </div>
              <div
                className="ms-Grid-col ms-lg6"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <LabelHeaderComponents
                  value={`Status - ${props.stateValue?.Status}`}
                >
                  {" "}
                </LabelHeaderComponents>
              </div> */}

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Name"
                    value={CandidateData.FullName}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Nationality"
                    value={CandidateData.Nationality}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Gender"
                    value={CandidateData.Gender}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Highest Relevant Qualification"
                    value={CandidateData.Qualification}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experiance in Mining Industry (Years)"
                    value={CandidateData.TotalYearOfExperiance}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experiance in Related Field (Years)"
                    value={CandidateData.ReleventExperience}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Date of Interview"
                    value={
                      CandidateData.InterviewDate
                        ? new Date(CandidateData.InterviewDate)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")
                        : ""
                    }
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        InterviewDate: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="No of Interview Level's"
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
              </div>
              <div className="ms-Grid-row">
                {CandidateData?.ConflictsOfInterest && (
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Conflicts Of Interest"
                      value={CandidateData?.ConflictsOfInterest}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                )}
                {CandidateData?.ConflictsOfInterest && (
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Disability"
                      value={CandidateData?.disability}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                )}
              </div>
              {CandidateData?.disabilityReason &&
                CandidateData?.disability === Choices.Yes && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12">
                      <CustomTextArea
                        label="Disability Details"
                        value={CandidateData?.disabilityReason}
                        disabled={true}
                        mandatory={false}
                        error={false}
                      />
                    </div>
                  </div>
                )}
              <div className="ms-Grid-row">
                <div
                  className="ms-Grid-col ms-lg12"
                  style={{ position: "relative", top: "14px" }}
                >
                  <label
                    style={{
                      fontWeight: 600,
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    Interview Panel Level 1
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      minHeight: "38px",
                      background: "none",
                      backgroundColor: "rgb(243, 242, 241)",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "rgb(243, 242, 241)",
                      boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px 4px",
                    }}
                  >
                    {interviewPanelTitlesLevel1 &&
                    interviewPanelTitlesLevel1.length > 0
                      ? interviewPanelTitlesLevel1.map((title, index) => (
                          <Chip
                            key={index}
                            label={`${index + 1}. ${title}`}
                            size="small"
                            sx={{
                              backgroundColor: "rgb(243, 242, 241)",
                              fontWeight: 500,
                              color: "rgb(85, 82, 79)",
                              cursor: "not-allowed",
                              // opacity: 0.6,
                            }}
                          />
                        ))
                      : null}
                  </div>
                </div>
                {props.stateValue?.InterviewLevel === InterviewLevels.Levels2 &&
                interviewPanelTitlesLevel2.length > 0 ? (
                  <div
                    className="ms-Grid-col ms-lg12"
                    style={{
                      position: "relative",
                      top: "14px",
                      marginTop: "2%",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Interview Panel Level 2
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        minHeight: "38px",
                        background: "none",
                        backgroundColor: "rgb(243, 242, 241)",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "rgb(243, 242, 241)",
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px 4px",
                      }}
                    >
                      {interviewPanelTitlesLevel2 &&
                      interviewPanelTitlesLevel2.length > 0
                        ? interviewPanelTitlesLevel2.map((title, index) => (
                            <Chip
                              key={index}
                              label={`${index + 1}. ${title}`}
                              size="small"
                              sx={{
                                backgroundColor: "rgb(243, 242, 241)",
                                fontWeight: 500,
                                color: "rgb(85, 82, 79)",
                                cursor: "not-allowed",
                                // opacity: 0.6,
                              }}
                            />
                          ))
                        : null}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="ms-Grid-row" style={{ marginTop: "22px" }}>
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents value={"Attachments"} />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomLabel value={"Candidate Resume"} />
                  <CustomViewDocument
                    Attachment={CandidateData.CandidateCVDoc}
                  />
                </div>

                {/* <div className="ms-Grid-col ms-lg4">
                  <CustomLabel value={"RoleProfile Documents"} />
                  <CustomViewDocument
                    Attachment={CandidateData.RoleProfileDocument}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomLabel value={"Advertisement Documents (French)"} />
                  <CustomViewDocument
                    Attachment={CandidateData.AdvertisementDocument}
                  />
                </div> */}
              </div>

              {/* <div
                className="ms-Grid-row"
                style={{ marginTop: "21px", marginBottom: "21px" }}
              >
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents
                    value={
                      "Scorecard Details  (1 - Lower Score, 5 - Highest Score)"
                    }
                  />
                </div>
              </div> */}
              {/* 
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Qualifications (Relevant)"
                    value={CandidateData.Qualifications}
                    options={ScoreRanking}
                    onChange={(value) =>
                      handleAutoComplete("Qualifications", value)
                    }
                    mandatory={true}
                    error={ValidationError.Qualifications}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Experience (Relevant)"
                    value={CandidateData.Experience}
                    options={ScoreRanking}
                    onChange={(value) =>
                      handleAutoComplete("Experience", value)
                    }
                    error={ValidationError.Experience}
                    mandatory={true}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Knowledge"
                    value={CandidateData.Knowledge}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) => handleAutoComplete("Knowledge", value)}
                    error={ValidationError.Knowledge}
                    disabled={false}
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Energy Level"
                    value={CandidateData.Energylevel}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("Energylevel", value)
                    }
                    error={ValidationError.Energylevel}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Meets All Job Requirements"
                    value={CandidateData.Requirements}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("Requirements", value)
                    }
                    error={ValidationError.Requirements}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Will Contribute to the Culture Required"
                    value={CandidateData.contributeculture}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("contributeculture", value)
                    }
                    error={ValidationError.contributeculture}
                    disabled={false}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Expat Experience/Congolese"
                    value={CandidateData.ExpatExperienceCongolese}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("ExpatExperienceCongolese", value)
                    }
                    error={ValidationError.ExpatExperienceCongolese}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Other Criteria Recognized by the Panel"
                    value={CandidateData.CriteriaRecognised}
                    options={ScoreRanking}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("CriteriaRecognised", value)
                    }
                    error={ValidationError.CriteriaRecognised}
                    disabled={false}
                  />
                </div>
              </div>

              <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                <div className="ms-grid-col ms-lg6">
                  <CustomRadioGroup
                    label="To Consider for Employment"
                    value={CandidateData?.Employment}
                    options={EmploymentOption}
                    mandatory={true}
                    error={ValidationError.Employment}
                    onChange={(value) => handleRadioChange("Employment", value)}
                  />
                </div>
              </div>
              {shouldShowTextArea && (
                <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                  <div className="ms-grid-col ms-lg10">
                    <CustomTextArea
                      label="Feedback(Required for Ratings Below 2)"
                      value={CandidateData?.EvaluationFeedback}
                      error={ValidationError.EvaluationFeedback}
                      mandatory={true}
                      onChange={(value) =>
                        handletextArea("EvaluationFeedback", value)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                <div className="ms-grid-col ms-lg10">
                  <CustomTextArea
                    label="Overall Evaluation Feedback"
                    value={CandidateData?.OverAllEvaluationFeedback}
                    error={ValidationError.OverAllEvaluationFeedback}
                    mandatory={true}
                    onChange={(value) =>
                      handletextArea("OverAllEvaluationFeedback", value)
                    }
                  />
                </div>
              </div> */}
              {/* <div
                className="ms-Grid-row"
                style={{
                  padding: "3px",
                  marginTop: "20px",
                  marginBottom: "-33px",
                }}
              >
                <div className="ms-Grid-col ms-lg12">
                  <SignatureCheckbox
                    label={TabName.CheckboxContent}
                    checked={Checkbox}
                    error={ValidationError.CheckboxValidation}
                    onChange={handleCheckbox}
                  />
                </div>
              </div> */}
              {/* <div
                className="ms-Grid-row"
                style={{
                  marginLeft: "-13px",
                }}
              >
                <div className="ms-Grid-col ms-lg12">
                  <CustomSignature
                    Name={
                      (props.userDetails[0]?.FirstName ?? "") +
                      " " +
                      (props.userDetails[0]?.MiddleName ?? "") +
                      " " +
                      (props.userDetails[0]?.LastName ?? "")
                    }
                    JobTitleInEnglish={props.userDetails[0]?.JopTitleEnglish}
                    JobTitleInFrench={props.userDetails[0]?.JopTitleFrench}
                    Department={props.userDetails[0]?.DepartmentName}
                    Date={CandidateData.SignDate.toString()}
                    TermsAndCondition={Checkbox}
                  />
                </div>
              </div> */}
              {/* 
              <div className="ms-Grid-row">
                <div
                  className="ms-Grid-col ms-lg2"
                  style={{ position: "relative", right: "1px" }}
                >
                  <div>
                    <CustomLabel
                      value={labelName.ViewJobAdvetisement}
                      // mandatory={true}
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
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      label="VIEW"
                      imgSrc={require("../../assets/viewSubmision-white.svg")}
                      imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                      imgAlt="View"
                      imgAltHover="Hovered View"
                      onClick={async () => {
                        setPreview(true);
                        setMainComponent(false);
                      }}
                      spacing={4}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      label: TabName.Scorecard,
      value: "tab2",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <LabelHeaderComponents value={"Questionnaires"} />
                    <CustomLabel
                      value={
                        "(Rating Guide: 3 - Excellent, 2 - Acceptable, 1 - Not Acceptable)"
                      }
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "20px" }}>
                {questionnaire.map((q, index) => (
                  <div key={q.id} style={{ marginBottom: "15px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      <div>
                        <span>Q{index + 1}:</span>

                        <span
                          style={{
                            display: "inline-block",
                            marginLeft: "1%",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `${q.question
                              .replace(/<p>/gi, "")
                              .replace(/<\/p>/gi, "")
                              .replace(/<br\s*\/?>/gi, "")
                              .trim()}`,
                          }}
                        />
                      </div>
                    </p>
                    <p>
                      <strong>Expected Answer:</strong>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${q.answer
                            .replace(/<p>/gi, "")
                            .replace(/<\/p>/gi, "")
                            .replace(/<br\s*\/?>/gi, "")
                            .trim()}`,
                        }}
                      />
                      {/* {q.answer} */}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div className="ms-Grid-col ms-lg4">
                        <CustomAutoComplete
                          label="Rating "
                          value={
                            ScoreRating.find(
                              (option) => option.key === q.rating
                            ) || null
                          }
                          options={ScoreRating}
                          onChange={(value) => handleRatingChange(q.id, value)}
                          error={ratingErrors[q.id]}
                          mandatory={true}
                          disabled={false}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      label: TabName.Scorecard,
      value: "tab3",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                  <LabelHeaderComponents
                    value={"Scorecard Details(1-Lower Score, 5 -Highest Score)"}
                  />
                </div>

                <div className="ms-Grid-row" style={{ marginLeft: "1px" }}>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Qualifications (Relevant)"
                      value={CandidateData.Qualifications}
                      options={ScoreRanking}
                      onChange={(value) =>
                        handleAutoComplete("Qualifications", value)
                      }
                      mandatory={true}
                      error={ValidationError.Qualifications}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Experience (Relevant)"
                      value={CandidateData.Experience}
                      options={ScoreRanking}
                      onChange={(value) =>
                        handleAutoComplete("Experience", value)
                      }
                      error={ValidationError.Experience}
                      mandatory={true}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Knowledge"
                      value={CandidateData.Knowledge}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("Knowledge", value)
                      }
                      error={ValidationError.Knowledge}
                      disabled={false}
                    />
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ marginLeft: "1px" }}>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Energy Level"
                      value={CandidateData.Energylevel}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("Energylevel", value)
                      }
                      error={ValidationError.Energylevel}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Meets All Job Requirements"
                      value={CandidateData.Requirements}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("Requirements", value)
                      }
                      error={ValidationError.Requirements}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Will Contribute to the Culture Required"
                      value={CandidateData.contributeculture}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("contributeculture", value)
                      }
                      error={ValidationError.contributeculture}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row" style={{ marginLeft: "1px" }}>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Expat Experience/Congolese"
                      value={CandidateData.ExpatExperienceCongolese}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("ExpatExperienceCongolese", value)
                      }
                      error={ValidationError.ExpatExperienceCongolese}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Other Criteria Recognized by the Panel"
                      value={CandidateData.CriteriaRecognised}
                      options={ScoreRanking}
                      mandatory={true}
                      onChange={(value) =>
                        handleAutoComplete("CriteriaRecognised", value)
                      }
                      error={ValidationError.CriteriaRecognised}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row" style={{ marginLeft: "1px" }}>
                  <div
                    className="ms-grid-col ms-lg6"
                    style={{ marginLeft: "11px" }}
                  >
                    <CustomRadioGroup
                      label="To Consider for Employment"
                      value={CandidateData?.Employment}
                      options={EmploymentOption}
                      mandatory={true}
                      error={ValidationError.Employment}
                      onChange={(value) =>
                        handleRadioChange("Employment", value)
                      }
                    />
                  </div>
                </div>
                {shouldShowTextArea && (
                  <div className="ms-Grid-row" style={{ marginLeft: "6px" }}>
                    <div
                      className="ms-grid-col ms-lg10"
                      style={{ marginLeft: "2px" }}
                    >
                      <CustomTextArea
                        label="Feedback(Required for Ratings Below 2)"
                        value={CandidateData?.EvaluationFeedback}
                        error={ValidationError.EvaluationFeedback}
                        mandatory={true}
                        onChange={(value) =>
                          handletextArea("EvaluationFeedback", value)
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="ms-Grid-row" style={{ marginLeft: "1px" }}>
                  <div
                    className="ms-grid-col ms-lg10"
                    style={{ marginLeft: "6px" }}
                  >
                    <CustomTextArea
                      label="Overall Evaluation Feedback"
                      value={CandidateData?.OverAllEvaluationFeedback}
                      error={ValidationError.OverAllEvaluationFeedback}
                      mandatory={true}
                      onChange={(value) =>
                        handletextArea("OverAllEvaluationFeedback", value)
                      }
                    />
                  </div>
                </div>
                <div
                  className="ms-Grid-row"
                  style={{
                    padding: "3px",
                    marginTop: "20px",
                    marginBottom: "-33px",
                    marginLeft: "0px",
                  }}
                >
                  <div className="ms-Grid-col ms-lg12">
                    <SignatureCheckbox
                      label={CheckboxContent.ScorecardEntry}
                      checked={Checkbox}
                      error={ValidationError.CheckboxValidation}
                      onChange={handleCheckbox}
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg12">
                    <CustomSignature
                      Name={
                        (props.userDetails[0]?.FirstName ?? "") +
                        " " +
                        (props.userDetails[0]?.MiddleName ?? "") +
                        " " +
                        (props.userDetails[0]?.LastName ?? "")
                      }
                      JobTitleInEnglish={props.userDetails[0]?.JopTitleEnglish}
                      JobTitleInFrench={props.userDetails[0]?.JopTitleFrench}
                      Department={props.userDetails[0]?.DepartmentName}
                      Date={CandidateData.SignDate.toString()}
                      TermsAndCondition={Checkbox}
                    />
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    // const prevTabObj = tabs.find((item) => item.value === prevActiveTab);
    if (activeTab === "tab1") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    } else if (activeTab === "tab2") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: TabName.ViewCandidateDetails },
          { tabName: activeTabObj?.label },
        ];

        const uniqueTabNames = newTabNames.filter(
          (item, index, self) =>
            item.tabName &&
            self.findIndex((t) => t.tabName === item.tabName) === index
        );

        return uniqueTabNames;
      });
    } else {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: TabName.ViewCandidateDetails },
          { tabName: activeTabObj?.label },
        ];

        const uniqueTabNames = newTabNames.filter(
          (item, index, self) =>
            item.tabName &&
            self.findIndex((t) => t.tabName === item.tabName) === index
        );

        return uniqueTabNames;
      });
    }
    if (activeTab !== prevActiveTab) {
      setPrevActiveTab(activeTab);
    }

    const fetchData = async () => {
      setIsLoading(true);
      fetchCandidateData(props.stateValue?.ID)
        .then(() => {
          const filterConditions = [
            {
              FilterKey: "CandidateIDId",
              Operator: "eq",
              FilterValue: props.stateValue?.ID,
            },
          ];

          return InterviewServices.GetInterviewPanelDetails(filterConditions);
        })
        .then((response) => {
          if (
            response?.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const filteredPanels = response.data.filter(
              (item) => item.CandidateID === props.stateValue?.ID
            );

            if (filteredPanels.length > 0) {
              const interviewPanelTitles = filteredPanels.map(
                (panel) => panel.InterviewPanelTitle
              );

              console.log(InterviewPanelData);
              setInterviewPanelData((prevState) => ({
                ...prevState,
                interviewPanelTitles: interviewPanelTitles || [],
              }));

              setCandidateData((prevState) => ({
                ...prevState,
                interviewPanelTitles: interviewPanelTitles || [],
              }));
            }
          }
        })
        .catch((error) => {});
    };

    void fetchData();
    void fetchInterviewPanelDetails();
  }, [props.stateValue?.ID, activeTab]);

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
            props.navigation("/ReviewProfileList", {
              state: {
                tab: "tab4", //props.stateValue?.tab,
                TabName: TabName.Evaluation,
              },
            });
          } else if (
            props.CurrentRoleID.includes(RoleID.HOD) ||
            props.CurrentRoleID.includes(RoleID.LineManager)
          ) {
            props.navigation("/RecurimentProcess", {
              state: {
                tab: props.CurrentRoleID.includes(RoleID.HOD) ? "tab3" : "tab4", //props.stateValue?.tab,
                TabName: TabName.Evaluation,
              },
            });
          } else {
            props.navigation("/InterviewPanelList");
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

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const validateRatings = (tab: string) => {
    if (tab === "tab2") {
      const errors: { [key: number]: boolean } = {};
      questionnaire.forEach((q) => {
        if (!q.rating) {
          errors[q.id] = !IsValid(q.rating);
        }
      });
      setRatingErrors(errors);
      return Object.values(errors).some((error) => error);
    } else {
      return false;
    }
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
            ValidationError={() => validateRatings(activeTab)}
            JobValue={{
              JobTitle: CandidateData.PositionTitle ?? "",
              JobCode: CandidateData.JobCode,
              Status: props.stateValue?.Status,
            }}
            additionalButtons={[
              {
                label: "Submit",
                onClick: async () => {
                  await Submit_fn();
                },
              },
            ]}
          />
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
    </>
  );
};
export default InterviewPanelEdit;
