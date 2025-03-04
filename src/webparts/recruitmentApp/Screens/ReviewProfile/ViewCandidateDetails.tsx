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
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
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

type InterviewedLevelValue = {
  Levels: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
  InterviewedDate: Date | undefined;
};

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
  InterviewedDate: boolean;
  AssignInterviewLevel1: boolean;
};

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
};

const ViewCandidateDetails = (props: any) => {
  console.log(props, "ViewCandidateDetailsProps");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [CandidateProfile, setCandidateProfile] = useState<CandidateProfile>({
    CandidateID: "",
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
    Agencies: "",
    CandidateResume: [],
    RoleProfile: [],
    Advertisement: [],
    Comments: [],
    workflowStatusId: "",
  });
  const todaydate = new Date();
  const [InterviewedLevel, setInterviewedLevel] =
    useState<InterviewedLevelValue>({
      Levels: "",
      AssignInterviewedLevel1Option: [],
      AssignInterviewLevel1: [],
      AssignInterviewedLevel2: [],
      InterviewedDate: undefined,
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
      console.log(SignDate);
      await GetPortalJobsService.getCandidateProfile(props.stateValue?.ID)
        .then((res) => {
          console.log(res, "res");
          let response = res.data?.[0];
          setCandidateProfile((prevState: any) => ({
            ...prevState,
            CandidateID: response?.CandidateID,
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
          }));
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
              CandidateStatus: CandidateStatus.WaitingList,
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
      { tabName: TabName.PositionDetails },
      { tabName: "Edit" },
      { tabName: TabName.CandidateDetails },
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
        response.data[0]?.PayrollGrade
      );

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
      console.log(AssignInterviewPanel.data, "AssignInterviewPanel");

      const interviewpanelOption = await CommonServices.GetADgruopsEmailIDs(
        ADGroupID.HRMSInterviewPanel
      );
      console.log(interviewpanelOption);

      const Level1Value = interviewpanelOption.data.filter((item: any) =>
        [
          73, // AssignInterviewPanel.data[0]?.LineManagerId,
          89, // response.data[0]?.AssignedHRId,
        ].includes(item.key)
      );

      const Level2Value = interviewpanelOption.data.filter((item: any) =>
        [
          73, //AssignInterviewPanel.data[0]?.HODId,
          89, //AssignInterviewPanel.data[0]?.EXCOId,
        ].includes(item.key)
      );

      setInterviewedLevel((prevState) => ({
        ...prevState,
        Levels: Gradelevel.data[0]?.Level,
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
  console.log(InterviewedLevel.AssignInterviewLevel1, "AssignInterviewLevel1");

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
              <div className="agencies_card ">
                <LabelHeaderComponents
                  value={
                    CandidateProfile.Agencies === undefined
                      ? `Profile from Candidate `
                      : `Profile from ${CandidateProfile.Agencies} Agencies`
                  }
                />
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
                  <div className="ms-Grid-col ms-lg6">
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
                        <CustomMultiSelect
                          label="Assign Interview Panel - Level 1"
                          value={InterviewedLevel.AssignInterviewLevel1}
                          options={
                            InterviewedLevel.AssignInterviewedLevel1Option
                          }
                          onChange={(value) => handleMulitiSelect(value)}
                          disabled={false}
                          mandatory={true}
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
                      {InterviewedLevel.Levels === "Level 2" && (
                        <div className="ms-Grid-row">
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
                        </div>
                      )}
                      <div className="ms-Grid-row">
                        <div
                          className="ms-Grid-col ms-lg4"
                          style={{ marginLeft: "7px" }}
                        >
                          <CustomDatePicker
                            selectedDate={InterviewedLevel.InterviewedDate}
                            label="Interviewed Date"
                            error={validationErrors.InterviewedDate}
                            minDate={todaydate}
                            mandatory={true}
                            onChange={(date) =>
                              handleDateChange(date ?? undefined)
                            }
                          />
                        </div>
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
                  props.stateValue?.ActionBtn === "Edit" && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg5">
                          <CustomRadioGroup
                            label="Does the candidate fit for the vacant position ?"
                            value={actionValue.CandidateStatus}
                            options={["Yes", "No", "Waiting List"]}
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
                          backgroundColor: "#EF3340",
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
                          backgroundColor: "#EF3340",
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
                          label={"I hereby agree for submitted this request."}
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
    };
    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHR:
        if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
          errors.Comments = !IsValid(actionValue.Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.InterviewedDate = !IsValid(InterviewedLevel.InterviewedDate);
          errors.AssignInterviewLevel1 = !IsValid(
            InterviewedLevel.AssignInterviewLevel1?.[2]?.text ?? ""
          );
        } else {
          errors.Comments = !IsValid(actionValue.Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
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
        ButtonAction: TabName.ViewPositionDetails,
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
    const CandidateDetails: any = {
      RecruitmentIDId: props.stateValue.RecruitmentID,
      JobCodeId: RecruitmentDetails.data[0].JobCodeId,
      FristName: CandidateProfile.FristName,
      MiddleName: CandidateProfile.MiddleName,
      LastName: CandidateProfile.ApplicantSurName,
      ResidentialAddress: CandidateProfile.ResidentialAddress,
      DOB: CandidateProfile.DOB
        ? new Date(CandidateProfile.DOB).toISOString()
        : null,
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
      PositionTitle: RecruitmentDetails.data[0].JobTitleInEnglish,
      JobGrade: RecruitmentDetails.data[0].DRCGrade,
      // ExternalAgentDetailsId: CandidateProfile.Agencies,
      InterviewDate: InterviewedLevel.InterviewedDate
        ? new Date(InterviewedLevel.InterviewedDate).toISOString()
        : null,
      ActionId: WorkflowAction.Approved,
    };
    let selectedinterviewpanal: any[] = [];

    for (let i = 0; i < InterviewedLevel.AssignInterviewLevel1.length; i++) {
      debugger;
      const currentItem = InterviewedLevel.AssignInterviewLevel1[i];

      let selectedinterview = {
        RecruitmentIDId: RecruitmentDetails.data[0].ID,
        InterviewLevel: InterviewedLevel.Levels,
        InterviewPanel: currentItem.key,
        CandidateID: 0,
      };

      selectedinterviewpanal.push(selectedinterview);
    }
    console.log(selectedinterviewpanal, "selectedinterviewpanal");
    console.log(CandidateDetails, "CandidateDetails");
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
      });
      let CandidateData: WorkflowJson = {
        workflowStatus: "",
        jobRequestId: 0,
        comments: "",
        actionBy: "",
      };
      let PopupMessage: string = "";
      switch (actionValue.CandidateStatus) {
        case CandidateStatus.Yes:
          if (props.CurrentRoleID === RoleID.LineManager) {
            if (
              CandidateProfile.Status ===
              "Pending with Line Manager Level 2 Review"
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
          } else {
            CandidateData = createFilter(
              workflowStatusApi.LineManagerL1Pending
            );
            PopupMessage = RecuritmentHRMsg.ProfileReviewed;
          }
          break;

        case CandidateStatus.No:
          if (props.CurrentRoleID === RoleID.LineManager) {
            if (
              CandidateProfile.Status ===
              "Pending with Line Manager Level 2 Review"
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
          } else {
            CandidateData = createFilter(workflowStatusApi.HRRejected);
            PopupMessage = RecuritmentHRMsg.ProfileReviewedNo;
          }
          break;

        case CandidateStatus.WaitingList:
          if (props.CurrentRoleID === RoleID.LineManager) {
            if (
              CandidateProfile.Status ===
              "Pending with Line Manager Level 2 Review"
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
          } else {
            CandidateData = createFilter(workflowStatusApi.HROnHold);
            PopupMessage = RecuritmentHRMsg.ProfileReviewedWaitingList;
          }
          break;
      }

      if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
        CandidateData = createFilter(workflowStatusApi.InterviewScheduled);
        PopupMessage = RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
      }
      console.log(CandidateData, "CandidateData");

      const res = await GetPortalJobsService.UpdateCandidateStatus(
        CandidateData
      );
      console.log(res.data, "res");
      if (res.data) {
        await UploadCandidateDetails();
        const CancelAlert = {
          Message: PopupMessage,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              props.navigation("/ReviewProfileList/ReviewCandidateList", {
                state: {
                  ID: props.stateValue?.RecruitmentID,
                  TabName: props.stateValue?.initialTab,
                  ButtonAction: TabName.ViewPositionDetails,
                  JobCode: CandidateProfile?.JobCode,
                },
              });
              setAlertPopupOpen(false);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
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
