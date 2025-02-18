import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CommonServices, GetPortalJobsService, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import ReuseButton from "../../components/ReuseButton";
import CustomInput from "../../components/CustomInput";
import BreadcrumbsComponent, { TabNameData } from "../../components/CustomBreadcrumps";
import { ADGroupID, CandidateStatus, HRMSAlertOptions, RecuritmentHRMsg, RoleID, TabName, workflowStatusApi } from "../../utilities/Config";
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


type InterviewedLevelValue = {
  Levels: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
}

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
}

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
}


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
    Gender: "",
    HighestQualification: "",
    ExperienceMining: 0,
    ExperRelatedfield: 0,
    Status: "",
    Agencies: "",
    CandidateResume: [],
    RoleProfile: [],
    Advertisement: [],
    Comments: []
  });
  const todaydate = new Date();
  const [InterviewedLevel, setInterviewedLevel] = useState<InterviewedLevelValue>({
    Levels: "",
    AssignInterviewedLevel1Option: [],
    AssignInterviewLevel1: [],
    AssignInterviewedLevel2: []
  });
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [Checkbox, setCheckbox] = useState<boolean>(false);
  const [SignDate, setSignDate] = useState<Date | any>();
  const [actionValue, setActionValue] = useState<ActionValue>({
    CandidateStatus: "",
    Comments: ""
  });
  const [validationErrors, setValidationErrors] = React.useState<ValidationError>({
    Comments: false,
    Checkboxalidation: false,
    CandidateStatus: false
  });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [OpenComments, setOpenComments] = useState<boolean>(false);

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log(SignDate);
      await GetPortalJobsService.getCandidateProfile(props.stateValue?.ID).then((res) => {
        console.log(res, "res");
        let response = res.data?.[0]
        setCandidateProfile((prevState: any) => ({
          ...prevState,
          CandidateID: response?.CandidateID,
          JobCode: response?.JobCode,
          JobTitle: response?.JobTitle,
          ApplicantName: response?.ApplicantName,
          ApplicantSurName: response?.ApplicantSurName,
          Nationality: response?.Nationality,
          Gender: response?.Gender,
          HighestQualification: response?.HighestQualification,
          ExperienceMining: response?.ExperienceMining,
          ExperRelatedfield: response?.ExperRelatedfield,
          CandidateResume: response?.CandidateResume,
          RoleProfile: response?.RoleProfile,
          Advertisement: response?.Advertisement,
          Status: response?.Status,
          Agencies: response?.Agencies,
          Comments: response?.Comments
        }));
      }).catch((error) => {
        console.log("Candidate details doesn't fetch the data", error);
      })
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchData();
    setSignDate(new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    ))
    const newTabNames = [
      { tabName: props.stateValue?.initialTab },
      { tabName: TabName.PositionDetails },
      { tabName: "Edit" },
      { tabName: TabName.CandidateDetails },
    ];
    setTabNameData(newTabNames)
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
      const interviewpanelOption = await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSInterviewPanel);

      setInterviewedLevel((prevState) => ({
        ...prevState,
        Levels: Gradelevel.data[0]?.Level,
        AssignInterviewedLevel1Option: interviewpanelOption.data,
        AssignInterviewedLevel2: interviewpanelOption.data
      }));

    }
    if (props.stateValue?.initialTab === TabName.AssignInterviewPanel) {
      void getRecurtimentList()
    }
  }, [])


  const handleRadioChange = async (item: string) => {
    setActionValue((prevState: any) => ({
      ...prevState,
      CandidateStatus: item,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      CandidateStatus: false
    }))
  };

  const handleInputChangeTextArea = (
    value: string | any,
  ) => {
    setActionValue((prevState: any) => ({
      ...prevState,
      Comments: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      Comments: false
    }))
  };

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <>
          {props.stateValue?.initialTab === TabName.AssignInterviewPanel ? (
            <></>
          ) : (<>
            <div className="agencies_card ">
              <LabelHeaderComponents
                value={`Profile form ${CandidateProfile.Agencies} Agencies`} />
            </div>
          </>)}

          <Card
            variant="outlined"
            sx={{ boxShadow: "0px 7px 4px 3px #d3d3d3", borderRadius: "10px", marginTop: "2%" }}
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
                  {props.stateValue?.initialTab === TabName.AssignInterviewPanel ? (
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
                          options={InterviewedLevel.AssignInterviewedLevel1Option}
                          disabled={false}
                          mandatory={true}
                        />
                      </div>
                      {InterviewedLevel.Levels === "Level 2" && (
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg4">
                            <CustomMultiSelect
                              label="Interview Panel - Level 2"
                              value={InterviewedLevel.AssignInterviewedLevel1Option}
                              options={InterviewedLevel.AssignInterviewedLevel1Option}
                              disabled={true}
                              mandatory={true}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (<></>)}
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
                {props.stateValue?.initialTab === TabName.ReviewProfile && (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label="Is the Candidate suits for the vaccancy position: "
                          value={actionValue.CandidateStatus}
                          options={["Yes", "No", "Waiting List"]}
                          error={false}
                          mandatory={false}
                          onChange={(item) => handleRadioChange(item)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {props.CurrentRoleID === RoleID.LineManager && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg4">
                      <CustomLabel value={"View Justification"} />

                      <ReuseButton
                        label="View"
                        onClick={() => setOpenComments(true)}
                        spacing={4}
                      />
                    </div>

                  </div>
                )}
                <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg12"
                    style={{ marginBottom: "7px" }}
                  >
                    <CustomTextArea
                      label="Justification"
                      value={actionValue.Comments}
                      error={validationErrors.Comments}
                      onChange={(value) =>
                        handleInputChangeTextArea(value)
                      }
                      mandatory={true}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row"
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
                      error={validationErrors.Checkboxalidation}
                      onChange={(value: boolean) => {
                        setCheckbox(value); setValidationErrors((prevState) => ({
                          ...prevState,
                          Checkboxalidation: false
                        }))
                      }
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg12">
                    <CustomSignature
                      Name={(props.userDetails[0].FirstName ?? "") + " " + (props.userDetails[0]?.MiddleName ?? "") + " " + (props.userDetails[0]?.LastName ?? "")}
                      JobTitleInEnglish={props.userDetails[0].JopTitleEnglish}
                      JobTitleInFrench={props.userDetails[0].JopTitleFrench}
                      Department={props.userDetails[0].DepartmentName}
                      Date={SignDate}
                      TermsAndCondition={Checkbox}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>

      ),
    },
  ];
  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem)
  };

  const Validation = (): boolean => {

    let errors = {
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false
    };

    errors.Comments = !IsValid(actionValue.Comments);
    errors.Checkboxalidation = !IsValid(Checkbox);
    errors.CandidateStatus = !IsValid(actionValue.CandidateStatus)

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
      },
    });
  }

  async function Submit_fn() {
    const isValid = !Validation();
    if (isValid) {
      let CandidateData: WorkflowJson;

      switch (actionValue.CandidateStatus) {
        case CandidateStatus.Yes: {
          if (props.CurrentRoleID === RoleID.LineManager) {
            if (CandidateProfile.Status === "Pending with Line Manager Level 2 Review") {
              CandidateData = {
                workflowStatus: workflowStatusApi.InterviewScheduled,
                jobRequestId: props.stateValue?.ID,
                comments: actionValue.Comments,
                actionBy: props.CurrentUserRole,
              };
            } else (
              CandidateData = {
                workflowStatus: workflowStatusApi.LineManagerL2Pending,
                jobRequestId: props.stateValue?.ID,
                comments: actionValue.Comments,
                actionBy: props.CurrentUserRole,
              }
            )

          } else {
            CandidateData = {
              workflowStatus: workflowStatusApi.LineManagerL1Pending,
              jobRequestId: props.stateValue?.ID,
              comments: actionValue.Comments,
              actionBy: props.CurrentUserRole,
            };
          }
          break;
        }

        case CandidateStatus.No: {
          CandidateData = {
            workflowStatus: workflowStatusApi.Rejected,
            jobRequestId: props.stateValue?.ID,
            comments: actionValue.Comments,
            actionBy: props.CurrentUserRole,
          };
          break;
        }

        case CandidateStatus.WaitingList: {
          CandidateData = {
            workflowStatus: workflowStatusApi.OnHold,
            jobRequestId: props.stateValue?.ID,
            comments: actionValue.Comments,
            actionBy: props.CurrentUserRole,
          };
          break;
        }

        default:
          throw new Error("Invalid CandidateStatus: " + actionValue.CandidateStatus);
      }

      console.log(CandidateData, "CandidateData");
      await GetPortalJobsService.UpdateCandidateStatus(CandidateData).then((res) => {
        console.log(res.data, "res");
        let CancelAlert = {
          Message: RecuritmentHRMsg.ProfileReviewed,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              props.navigation("/ReviewProfileList/ReviewCandidateList", {
                state: {
                  ID: props.stateValue?.RecruitmentID,
                  TabName: props.stateValue?.initialTab,
                  ButtonAction: TabName.ViewPositionDetails,
                },
              });
              setAlertPopupOpen(false);
            }
          }
        }

        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
        setIsLoading(false);
      }).catch((error) => {
        console.log("Candidate details doesn't fetch the data", error);
      })
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
            additionalButtons={[
              {
                label: "Back",
                onClick: async () => {
                  back_fn();
                },
              },
              {
                label: "Submit ",
                onClick: async () => {
                  await Submit_fn();
                },
              },
            ]}
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
      ) : <></>}

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
            Comments={CandidateProfile.Comments} />
        </Dialog>
      )}
    </>
  );
};

export default ViewCandidateDetails;
