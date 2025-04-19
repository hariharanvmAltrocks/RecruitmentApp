import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
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
  ADGroupID,
  CandidateStatus,
  ColorCode,
  HRMSAlertOptions,
  InterviewLevels,
  labelName,
  ListNames,
  RecuritmentHRMsg,
  ReviewProfileScore,
  RoleID,
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
import { useMediaQuery } from "@mui/material";
import { CandidateDetails } from "../../Services/CareerPortalApi/IGetPortalJobs";

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
};

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
};

const ViewCandidateDetails = (props: any) => {
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

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await GetPortalJobsService.getCandidateProfile(props.stateValue?.ID)
        .then((res) => {
          let response = res.data?.[0];
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
            Agencies: response?.Agencies,
            Comments: response?.Comments,
            workflowStatusId: response?.workflowStatusId,
            hrComments: response?.hrComments,
            JobVaildFromDate: response?.JobVaildFromDate,
            JobVaildToDate: response?.JobVaildToDate,
          }));

          //  JobVaildDate.setDate(jobValidDate)

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
            (props.stateValue?.ActionBtn === "View" &&
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
        ? "Schedule for Interview "
        : "Submit"
    );
    const newTabNames = [
      { tabName: props.stateValue?.initialTab },
      { tabName: "View" },
      { tabName: TabName.ViewCandidateList },
      { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateDetails },
    ];
    setTabNameData(newTabNames);
  }, []);

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
      console.log(Gradelevel);

      const filterJDEMapping = [
        {
          FilterKey: "BUCId",
          Operator: "eq",
          FilterValue: response.data[0]?.BusinessUnitCodeId,
        },
      ];
      const AssignInterviewPanel = await getVRRDetails.GetDataInList(
        ListNames.JDEDataMapping,
        filterJDEMapping,
        Conditions,
        "*,BUC/BusineesUnitCode,LineManager/EMail,HOD/EMail,HR/EMail,EXCO/EMail",
        "BUC,LineManager,HOD,HR,EXCO"
      );
      const interviewpanelOption = await CommonServices.GetADgruopsEmailIDs(
        ADGroupID.HRMSInterviewPanel
      );
      const Level1Value = interviewpanelOption.data.filter((item: any) =>
        [
          AssignInterviewPanel.data[0]?.LineManagerId,
          response.data[0]?.AssignedHRId,
          AssignInterviewPanel.data[0]?.HODId,
        ].includes(item.key)
      );

      const Level2Value = interviewpanelOption.data.filter((item: any) =>
        [
          response.data[0]?.AssignedHRId,
          AssignInterviewPanel.data[0]?.HODId,
          AssignInterviewPanel.data[0]?.EXCOId,
        ].includes(item.key)
      );

      setInterviewedLevel((prevState) => ({
        ...prevState,
        Grade: response.data[0]?.PatersonGrade,
        Levels:
          Gradelevel.data[0]?.Level === InterviewLevels.Level1
            ? InterviewLevels.Level1
            : InterviewLevels.Level2,
        AssignInterviewedLevel1Option: interviewpanelOption.data,
        AssignInterviewLevel1: Level1Value,
        AssignInterviewedLevel2: Level2Value,
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
    const newDate = value ?? undefined;

    setInterviewedLevel((prevState: any) => ({
      ...prevState,
      InterviewedDate: newDate,
    }));

    setValidationErrors((prevState) => ({
      ...prevState,
      InterviewedDate: false,
    }));
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
    setInterviewedLevel((prevState: any) => ({
      ...prevState,
      InterviewTime: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      InterviewTime: false,
    }));
  };

  const handleInputChange = (value: string) => {
    setInterviewedLevel((prevState: any) => ({
      ...prevState,
      InterviewMeetingInviteLink: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      InterviewMeetingInviteLink: false,
    }));
  };

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    setInterviewedLevel((prevState) => ({
      ...prevState,
      CandidateScoreValue: value || { key: 0, text: "" },
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      CandidateScoreValue: false,
    }));
  };
  const isMobile = useMediaQuery("(max-width:600px)");

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <>
          {props.stateValue?.initialTab === TabName.AssignInterviewPanel ? (
            <></>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "-4%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    // width: isMobile ? "90%" : "47%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: isMobile ? "flex-start" : "center",
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: isMobile ? "10px" : "5px 10px",
                    boxShadow: "0px 5px 10px 0px #0F4B8426",
                    margin: isMobile ? "10px auto" : "0",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#EF3340",
                        fontWeight: "400",
                        fontSize: isMobile ? "12px" : "14px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        <LabelHeaderComponents
                          value={
                            CandidateProfile.Agencies === undefined
                              ? `Profile from Candidate `
                              : `Profile from ${CandidateProfile.Agencies} Agencies`
                          }
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

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
                </div>
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
                      label="Experience in Mining Industry(Years)"
                      value={CandidateProfile?.ExperienceMining}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Experience in related field(Years)"
                      value={CandidateProfile?.ExperRelatedfield}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  {props.stateValue?.initialTab ===
                  TabName.AssignInterviewPanel ? (
                    <>
                      <div className="ms-Grid-col ms-lg4">
                        <CustomInput
                          label="Level of Interview"
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
                      <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                        <div className="ms-Grid-col ms-lg4">
                          <CustomDatePicker
                            selectedDate={InterviewedLevel.InterviewedDate}
                            label="Interviewed Date"
                            error={validationErrors.InterviewedDate}
                            minDate={
                              CandidateProfile.JobVaildToDate
                                ? new Date(
                                    new Date(
                                      CandidateProfile.JobVaildToDate
                                    ).setDate(
                                      new Date(
                                        CandidateProfile.JobVaildToDate
                                      ).getDate()
                                    )
                                  )
                                : undefined
                            }
                            mandatory={true}
                            onChange={(date) =>
                              handleDateChange(date ?? undefined)
                            }
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                          <CustomTimePicker
                            selectedTime={InterviewedLevel.InterviewTime}
                            label="Interview Time"
                            error={validationErrors.InterviewTime}
                            mandatory={true}
                            onChange={handleInterviewTimeChange}
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                          <CustomInput
                            label="Interview Meeting Invite Link"
                            value={InterviewedLevel.InterviewMeetingInviteLink}
                            disabled={false}
                            mandatory={true}
                            onChange={handleInputChange}
                            error={validationErrors.InterviewMeetingInviteLink}
                          />
                        </div>
                      </div>
                      <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                        <div className="ms-Grid-col ms-lg4">
                          <CustomMultiSelect
                            label="Assign Interview Panel - Level 1"
                            value={InterviewedLevel.AssignInterviewLevel1}
                            options={
                              InterviewedLevel.AssignInterviewedLevel1Option
                            }
                            onChange={(value) => handleMulitiSelect(value)}
                            disabled={true}
                            mandatory={true}
                            error={validationErrors.AssignInterviewLevel1}
                          />
                          {InterviewedLevel.AssignInterviewLevel1.length > 0 &&
                            InterviewedLevel.AssignInterviewLevel1.length <
                              3 && (
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
                        {InterviewedLevel.Levels === "Level 2" && (
                          <>
                            <div
                              className="ms-Grid-col ms-lg4"
                              style={{ marginLeft: "7px" }}
                            >
                              <CustomMultiSelect
                                label="Interview Panel - Level 2"
                                value={InterviewedLevel.AssignInterviewedLevel2}
                                options={
                                  InterviewedLevel.AssignInterviewedLevel1Option
                                }
                                disabled={true}
                                mandatory={true}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

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
                  <div className="ms-Grid-col ms-lg4">
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
                  </div>
                </div>
                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.stateValue?.ActionBtn === "Edit" &&
                  props.CurrentRoleID === RoleID.LineManager && (
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
                            error={false}
                            mandatory={false}
                            onChange={(item) => handleRadioChange(item)}
                            disabled={
                              props.stateValue?.ActionBtn === "View"
                                ? true
                                : false
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.CurrentRoleID === RoleID.RecruitmentHR &&
                  props.stateValue?.ActionBtn != "View" && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                          <CustomAutoComplete
                            label="Review Profile Feedback - HR"
                            options={InterviewedLevel.CandidateScoreOption}
                            value={InterviewedLevel.CandidateScoreValue}
                            disabled={props.stateValue?.ActionBtn === "View"}
                            mandatory={true}
                            onChange={(item) => handleAutoComplete(item)}
                            error={validationErrors.CandidateScoreValue}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.initialTab === TabName.ReviewProfile &&
                  props.CurrentRoleID === RoleID.RecruitmentHR &&
                  props.stateValue?.ActionBtn === "View" && (
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
                  props.CurrentRoleID === RoleID.LineManager && (
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

                {props.CurrentRoleID === RoleID.LineManager && (
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
                {props.stateValue?.initialTab ===
                  TabName.AssignInterviewPanel && (
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
                {props.stateValue?.ActionBtn === "View" ? (
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
                          label={TabName.CheckboxContent}
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
    };
    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHR:
        if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
          errors.Comments = !IsValid(actionValue.Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.InterviewedDate = !IsValid(InterviewedLevel.InterviewedDate);
          errors.AssignInterviewLevel1 = !IsValid(
            InterviewedLevel.AssignInterviewLevel1?.[0]?.text ?? ""
          );
          errors.InterviewTime = !IsValid(InterviewedLevel.InterviewTime);
          errors.InterviewMeetingInviteLink = !IsValid(
            InterviewedLevel.InterviewMeetingInviteLink
          );
        } else {
          errors.Comments = !IsValid(actionValue.Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.CandidateScoreValue = !IsValid(
            InterviewedLevel.CandidateScoreValue.text
          );
        }
        break;
      case RoleID.LineManager:
        {
          errors.Comments = !IsValid(actionValue.Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
        }
        break;
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  function back_fn() {
    props.navigation("/ReviewProfileList/ReviewCandidateList", {
      state: {
        ID: props.stateValue?.RecruitmentID,
        TabName: props.stateValue?.initialTab,
        ButtonAction: "View",
        JobCode: CandidateProfile?.JobCode,
      },
    });
  }

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
    const HRMSExternalAgents = await CommonServices.GetMasterData(
      ListNames.HRMSExternalAgents
    );
    let matchedAgents = HRMSExternalAgents.data.filter(
      (item) => item.AgentName === CandidateProfile.Agencies
    );
    let DOBValue = CandidateProfile.DOB
      ? new Date(CandidateProfile.DOB)
      : undefined;
    const CandidateDetails: CandidateDetails = {
      RecruitmentIDId: props.stateValue.RecruitmentID,
      JobCodeId: RecruitmentDetails.data[0].JobCodeId,
      FristName: CandidateProfile.FristName,
      MiddleName: CandidateProfile.MiddleName,
      LastName: CandidateProfile.ApplicantSurName,
      ResidentialAddress: CandidateProfile.ResidentialAddress,
      DOB: DOBValue,
      ContactNumber: CandidateProfile.ContactNumber,
      Email: CandidateProfile.Email,
      // Nationality: CandidateProfile.Nationality,
      Gender: CandidateProfile.Gender,
      TotalYearOfExperiance: String(CandidateProfile.ExperRelatedfield),
      // Skills: ,
      // LanguageKnown: ,
      ReleventExperience: CandidateProfile.ExperienceMining,
      Qualification: CandidateProfile.HighestQualification,
      JobRequestID: String(CandidateProfile.CandidateID),
      ProfileID: String(CandidateProfile.profileID),
      PositionTitle: RecruitmentDetails?.data[0]?.JobTitleEnglish,
      JobGrade: RecruitmentDetails?.data[0]?.DRCGrade,
      ExternalAgentDetailsId: matchedAgents[0]?.ID,
      InterviewDate: InterviewedLevel?.InterviewedDate,
      InterviewTime: InterviewedLevel?.InterviewTime,
      InterviewLink: InterviewedLevel?.InterviewMeetingInviteLink,
      ActionId: WorkflowAction.Approved,
    };
    let selectedinterviewpanal: any[] = [];

    for (let i = 0; i < InterviewedLevel.AssignInterviewLevel1.length; i++) {
      const currentItem = InterviewedLevel.AssignInterviewLevel1[i];

      let selectedinterview = {
        RecruitmentIDId: RecruitmentDetails.data[0].ID,
        InterviewLevel: InterviewedLevel.Levels,
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
        console.log(res, "res");
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
      const createFilter = (workflowStatus: string): WorkflowJson => ({
        workflowStatus: workflowStatus,
        jobRequestId: props.stateValue?.ID,
        comments: actionValue.Comments,
        actionBy: props.CurrentUserRole,
        hrComments:
          props.CurrentRoleID === RoleID.RecruitmentHR &&
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
      if (props.CurrentRoleID === RoleID.LineManager) {
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
          PopupMessage = RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
        } else {
          CandidateData = createFilter(workflowStatusApi.LineManagerL1Pending);
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
              props.navigation("/ReviewProfileList/ReviewCandidateList", {
                state: {
                  ID: props.stateValue?.RecruitmentID,
                  TabName: props.stateValue?.initialTab,
                  ButtonAction: "View",
                  JobCode: CandidateProfile?.JobCode,
                },
              });
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
              props.navigation("/ReviewProfileList/ReviewCandidateList", {
                state: {
                  ID: props.stateValue?.RecruitmentID,
                  TabName: props.stateValue?.initialTab,
                  ButtonAction: props.stateValue?.ButtonAction,
                  JobCode: CandidateProfile?.JobCode,
                },
              });
              setAlertPopupOpen(false);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(APIErrorAlert);
      }
    } catch (error) {
      console.error("Error submitting candidate details", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <BreadcrumbsComponent
            items={tabs}
            initialItem={activeTab}
            TabName={TabNameData}
            onBreadcrumbChange={handleBreadcrumbChange}
            additionalButtons={
              props.stateValue?.ActionBtn === "View"
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
                      label: "Back",
                      onClick: async () => {
                        back_fn();
                      },
                    },
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
