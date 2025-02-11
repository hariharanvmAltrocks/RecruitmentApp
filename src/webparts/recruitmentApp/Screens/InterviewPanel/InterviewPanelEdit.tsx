import * as React from "react";
import {
  CommonServices,
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
} from "../../utilities/Config";
import { QuestionItem, ScoreCardData } from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomTextArea from "../../components/CustomTextArea";
import { Card, CardContent } from "@mui/material";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomSignature from "../../components/CustomSignature";
import CustomViewDocument from "../../components/CustomViewDocument";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomLabel from "../../components/CustomLabel";

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
    },
  ]);
  const [questionnaire, setQuestionnaire] = React.useState<QuestionItem[]>([
    {
      id: 1,
      question: "What are some key regulations that govern mining operations?",
      answer:
        "Expected Answer:- By using sustainable mining practices, proper waste management, land reclamation, reducing water and air pollution, and implementing renewable energy sources.",
      rating: null,
    },
    {
      id: 2,
      question:
        "What strategies can be used to attract skilled professionals to remote mining locations?",
      answer:
        "Expected Answer:- Providing relocation assistance, offering rotational work schedules, housing facilities, competitive benefits, and care.",
      rating: null,
    },
  ]);

  const handleRatingChange = (id: number, rating: number) => {
    setQuestionnaire((prev) =>
      prev.map((q) => (q.id === id ? { ...q, rating } : q))
    );
  };
  const ScoreRating = [
    { key: 3, text: "3 - Excellent" },
    { key: 2, text: "2 - Acceptable" },
    { key: 1, text: "1 - Not Acceptable" },
  ];

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

      const data = await getVRRDetails.GetInterviewPanelCandidateDetails(
        filterConditions,
        Conditions
      );

      if (data.status === 200 && data.data !== null) {
        const op = data.data[0];

        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          String(op?.RecruitmentID),
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
        }));
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

  const handleAutoComplete = async (
    key: keyof ScoreCardData,
    value: AutoCompleteItem | null
  ) => {
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

  //   const Validation = (): boolean => {
  //     const {
  //       //   Qualifications,
  //       //   Experience,
  //       //   Knowledge,
  //       //   Energylevel,
  //       //   Requirements,
  //       //   contributeculture,
  //       //   ExpatExperienceCongolese,
  //       //   CriteriaRecognised,
  //       //   Employment,
  //       EvaluationFeedback,
  //       OverAllEvaluationFeedback,
  //     } = CandidateData;

  //     // ValidationError.Qualifications = !IsValid(Qualifications.text);
  //     // ValidationError.Experience = !IsValid(Experience.text);
  //     // ValidationError.Knowledge = !IsValid(Knowledge.text);
  //     // ValidationError.Energylevel = !IsValid(Energylevel.text);
  //     // ValidationError.Requirements = !IsValid(Requirements.text);
  //     // ValidationError.contributeculture = !IsValid(contributeculture.text);
  //     // ValidationError.ExpatExperienceCongolese = !IsValid(
  //     //   ExpatExperienceCongolese.text
  //     // );
  //     // ValidationError.CriteriaRecognised = !IsValid(CriteriaRecognised.text);
  //     // ValidationError.Employment = !IsValid(Employment);
  //     ValidationError.EvaluationFeedback = !IsValid(EvaluationFeedback);
  //     ValidationError.OverAllEvaluationFeedback = !IsValid(
  //       OverAllEvaluationFeedback
  //     );

  //     setValidationError((prevState) => ({
  //       ...prevState,
  //       ...ValidationError,
  //     }));

  //     return Object.values(ValidationError).some((error) => error);
  //   };

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
    const { EvaluationFeedback, OverAllEvaluationFeedback } = CandidateData;

    ValidationError.EvaluationFeedback = shouldShowTextArea
      ? !IsValid(EvaluationFeedback)
      : false;

    ValidationError.OverAllEvaluationFeedback = !IsValid(
      OverAllEvaluationFeedback
    );

    setValidationError((prevState) => ({
      ...prevState,
      ...ValidationError,
    }));

    return Object.values(ValidationError).some((error) => error);
  };

  //Correctly Worked
  const Submit_fn = async () => {
    try {
      let isValid = !Validation();

      if (!isValid) {
        return;
      }

      const CurrentUserResponse = await CommonServices.getUserGuidByEmail(
        props.CurrentUserEmailId
      );

      const currentUserKey = CurrentUserResponse.data?.key?.toString();

      const [CandidatePersonalDetails, InterviewPanelResponse] =
        await Promise.all([
          CommonServices.GetMasterData(
            ListNames.HRMSRecruitmentCandidatePersonalDetails
          ),
          CommonServices.GetMasterData(ListNames.HRMSInterviewPanelDetails),
        ]);

      if (!CandidatePersonalDetails.data || !InterviewPanelResponse.data) {
        console.error();
        return;
      }

      const matchingPanels = InterviewPanelResponse.data.filter((panel) => {
        const isCandidateMatch = props.stateValue?.ID === panel.CandidateIDId;
        const isRecruitmentIDMatch =
          CandidateData?.RecruitmentID === panel.RecruitmentIDId;
        return isCandidateMatch && isRecruitmentIDMatch;
      });

      if (matchingPanels.length === 0) {
        return;
      }

      const userPanels = matchingPanels.filter((panel) => {
        const isUserIncluded =
          panel.InterviewPanelStringId?.includes(currentUserKey);

        return isUserIncluded;
      });

      if (userPanels.length === 0) {
        return;
      }

      const groupedByLevel: Record<string, any[]> = {};
      userPanels.forEach((panel) => {
        const level = panel.InterviewLevel;
        if (!groupedByLevel[level]) {
          groupedByLevel[level] = [];
        }
        groupedByLevel[level].push(panel);
      });

      for (const level in groupedByLevel) {
        if (Object.prototype.hasOwnProperty.call(groupedByLevel, level)) {
          for (const panel of groupedByLevel[level]) {
            const InterviewPanelID = panel.Id;

            const existingScoreCardResponse =
              await CommonServices.GetMasterData(
                ListNames.HRMSCandidateScoreCard
              );

            const existingItem = existingScoreCardResponse.data.find(
              (item) => item.InterviewPanelIDId === InterviewPanelID
            );

            const scorecardObj = {
              RelevantQualification: String(CandidateData?.Qualifications.key),
              ReleventExperience: String(CandidateData?.Experience.key),
              Knowledge: String(CandidateData?.Knowledge.key),
              EnergyLevel: String(CandidateData?.Energylevel.key),
              MeetJobRequirement: String(CandidateData?.Requirements.key),
              ContributeTowardsCultureRequried: String(
                CandidateData?.contributeculture.key
              ),
              Experience: String(CandidateData?.ExpatExperienceCongolese.key),
              OtherCriteriaScore: String(CandidateData?.CriteriaRecognised.key),
              ConsiderForEmployment: CandidateData?.Employment,
              Feedback: CandidateData?.EvaluationFeedback,
              OverAllEvaluationFeedback:
                CandidateData?.OverAllEvaluationFeedback,
              RecruitmentIDId: CandidateData?.RecruitmentID,
              RoleId: props.CurrentRoleID,
              InterviewPersonNameId: currentUserKey,
              InterviewPanelIDId: InterviewPanelID,
            };

            if (existingItem) {
              const ItemID = existingItem.ID;

              const ScorecardUpdateResponse =
                await getVRRDetails.AssignCandidateRecuritmentHR(
                  ItemID,
                  scorecardObj,
                  ListNames.HRMSCandidateScoreCard
                );

              if (ScorecardUpdateResponse.status === 200) {
                //console.log("Scorecard Updated Successfully.");
              } else {
                //console.error("Failed to update Scorecard.");
              }
            } else {
              //   console.log(
              //     "No existing Scorecard found. Creating a new record..."
              //   );

              const newRecordResponse = await getVRRDetails.InsertList(
                scorecardObj,
                ListNames.HRMSCandidateScoreCard
              );

              // console.log("", newRecordResponse);

              if (newRecordResponse.status === 201) {
                //console.log("New Scorecard Created Successfully.");
              } else {
                //console.error("Failed to create Scorecard.");
              }
            }
          }
        }
      }

      let CancelAlert = {
        Message: RecuritmentHRMsg.ScoreCardSubmitMsg,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            props.navigation("/InterviewPanelList");
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(CancelAlert);
      setIsLoading(false);
    } catch (error) {
      //console.error("An error occurred during the submission process:", error);
      throw new Error("Failed to submit data. Please try again later.");
    }
  };

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${CandidateData.PositionTitle}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      //   value={`Status - ${props.stateValue?.Status}`}
                      value={`Status - ${""}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div>
                {/* <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Position Title"
                    value={CandidateData.JobCode}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div> */}

                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Job Grade"
                    value={CandidateData.JobCode}
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
                    label="Candidate ID"
                    value={CandidateData.CandidateID}
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
              </div>

              <div className="ms-Grid-row">
                {/* <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Candidate ID"
                      value={CandidateData.CandidateID}
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
                  </div> */}

                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Surname"
                    value={CandidateData.LastName}
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
                    label="Gender and Age"
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
                {/* <div className="ms-Grid-col ms-lg4">
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
                    label="Gender and Age"
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
                </div> */}

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
                    //value={CandidateData.DOB}
                    value={new Date(CandidateData.DOB)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
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
                    label="Interviewed by"
                    value={CandidateData.interviewPanelTitles?.join(", ") || ""}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                <LabelHeaderComponents value={"Attachments"} />
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.RoleProfileDocument}
                    Label={"Role Profile Documents"}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.AdvertisementDocument}
                    Label={"Advertisement Documents"}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.CandidateCVDoc}
                    Label={"Candidate Resume"}
                  />
                </div>
              </div>
              {/* <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                <LabelHeaderComponents
                  value={"Scorecard Details(1-Lower Score, 5 -Highest Score)"}
                />
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Qualifications (Relevant)"
                    value={CandidateData.Qualifications}
                    options={ScoreRanking}
                    onChange={(value) =>
                      handleAutoComplete("Qualifications", value)
                    }
                    mandatory={false}
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
                    mandatory={false}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomAutoComplete
                    label="Knowledge"
                    value={CandidateData.Knowledge}
                    options={ScoreRanking}
                    mandatory={false}
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
                    mandatory={false}
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
                    mandatory={false}
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
                    mandatory={false}
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
                    mandatory={false}
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
                    mandatory={false}
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
                    mandatory={false}
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
                    label={"I hereby agree for submitted this request"}
                    checked={Checkbox}
                    error={ValidationError.CheckboxValidation}
                    onChange={(value: boolean) => setCheckbox(value)}
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
              </div> */}
              {/* </div> */}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      label: TabName.CandidateDetails,
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
                {questionnaire.map((q) => (
                  <div key={q.id} style={{ marginBottom: "15px" }}>
                    <p style={{ fontWeight: "bold" }}>{q.question}</p>
                    <p>
                      <strong>Expected Answer:</strong> {q.answer}
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
                          onChange={(value) =>
                            handleRatingChange(q.id, value ? value.key : 0)
                          }
                          error={false}
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
      label: TabName.CandidateDetails,
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
                {/* <div className="sub-menu-card"> */}
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Qualifications (Relevant)"
                      value={CandidateData.Qualifications}
                      options={ScoreRanking}
                      onChange={(value) =>
                        handleAutoComplete("Qualifications", value)
                      }
                      mandatory={false}
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
                      mandatory={false}
                      disabled={false}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg4">
                    <CustomAutoComplete
                      label="Knowledge"
                      value={CandidateData.Knowledge}
                      options={ScoreRanking}
                      mandatory={false}
                      onChange={(value) =>
                        handleAutoComplete("Knowledge", value)
                      }
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
                      mandatory={false}
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
                      mandatory={false}
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
                      mandatory={false}
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
                      mandatory={false}
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
                      mandatory={false}
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
                      mandatory={false}
                      error={ValidationError.Employment}
                      onChange={(value) =>
                        handleRadioChange("Employment", value)
                      }
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
                      label={"I hereby agree for submitted this request"}
                      checked={Checkbox}
                      error={ValidationError.CheckboxValidation}
                      onChange={(value: boolean) => setCheckbox(value)}
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

    if (activeTab === "tab1") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    }

    const fetchData = () => {
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

              //console.log("", interviewPanelTitles);
              console.log("", InterviewPanelData);
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
        .catch((error) => {
          //console.error("Error fetching data:", error);
        });
    };

    fetchData();
  }, [props.stateValue?.ID, activeTab]);

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/InterviewPanelList");
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
    console.log("", newItem);
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <BreadcrumbsComponent
              items={tabs}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              handleCancel={handleCancel}
              additionalButtons={[
                {
                  label: "Submit",
                  onClick: async () => {
                    await Submit_fn();
                  },
                  disable: !Checkbox,
                },
              ]}
            />
          </React.Fragment>
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
