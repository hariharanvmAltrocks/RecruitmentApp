import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import ReuseButton from "../../components/ReuseButton";
import CustomInput from "../../components/CustomInput";
import BreadcrumbsComponent, { TabNameData } from "../../components/CustomBreadcrumps";
import { ADGroupID, DocumentLibraray, RoleProfileMaster, TabName } from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomViewDocument from "../../components/CustomViewDocument";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { AutoCompleteItem } from "../../Models/Screens";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import { getProfileData } from "../../Services/ReviewProfileService/ReviewCandidateService";


type InterviewedLevelValue = {
  Levels: string;
  AssignInterviewedLevel1Option: AutoCompleteItem[];
  AssignInterviewLevel1: AutoCompleteItem[];
  AssignInterviewedLevel2: AutoCompleteItem[];
}

const ViewCandidateDetails = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({
    JobCode: "",
    JobTitle: "",
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
    Status: "",
    Agencies: " ",
    LanguageKnown: "",
    ReleventExperience: "",
    Qualification: "",
    ShortlistedValue: "",
    CandidateCVDoc: [],
    RoleProfileDocument: [],
    AdvertisementDocument: [],
  });
  const todaydate = new Date();
  const [Comments, setComment] = useState<string>("");
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
  const [validationErrors, setValidationErrors] = React.useState<{
    Comments: boolean;
    Checkboxalidation: boolean
  }>({
    Comments: false,
    Checkboxalidation: false
  });

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log(SignDate);

      await getProfileData.getCandidateProfile(props.stateValue?.ID).then(async (res) => {
        if (res.status === 200 && res.data !== null) {
          console.log(res, "getCandidateProfile Response");

          const op = res.data.data;
          const [
            RoleProfileDocment,
            AdvertismentDocment,
            CandidateCVDoc
          ] = await Promise.all([
            CommonServices.GetAttachmentToLibrary(DocumentLibraray.RoleProfileMaster, op.JobCode, RoleProfileMaster.RoleProfile),
            CommonServices.GetAttachmentToLibrary(DocumentLibraray.RecruitmentAdvertisementDocument, op.JobCode),
            CommonServices.GetAttachmentToLibrary(DocumentLibraray.InterviewPanelCandidateCV, op.JobCode, op?.PassportID)
          ]);
          const RoleProfileDoc = RoleProfileDocment.data || [];
          const AdvertismentDocPromises = AdvertismentDocment.data || [];
          const CandidateCVDocPromises = CandidateCVDoc.data || [];
          setFormState((prevState: any) => ({
            ...prevState,
            JobCode: op?.jobCode,
            JobTitle: op?.jobDetail?.descriptions_en?.jobTitle,
            // PassportID: op?.PassportID,
            FullName: `${op?.profile?.firstName || ""} ${op?.profile?.middleName || ""} ${op?.profile?.lastName || ""}`,
            LastName: op?.profile?.middleName,
            // ResidentialAddress: op?.ResidentialAddress,
            // DOB: op?.DOB,
            // ContactNumber: op?.ContactNumber,
            // Email: op?.Email,
            Nationality: op?.profile?.nationality,
            Gender: op?.profile?.gender,
            TotalYearOfExperiance: op?.profile?.totalYearOfExperiance,
            // Skills: op?.Skills,
            // LanguageKnown: op?.LanguageKnown,
            ReleventExperience: op?.profile?.releventExperience,
            Qualification: op?.profile?.education?.displayText,
            CandidateCVDoc: CandidateCVDocPromises,
            RoleProfileDocment: RoleProfileDoc,
            AdvertismentDocment: AdvertismentDocPromises,
            Status: op?.workflowStatus?.displayText,
            Agencies: op?.profileXAgent?.agent?.name,
          }));
        }
      }).catch((error) => {
        console.log(error, "getCandidateProfile Error");

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
      // { tabName: TabNames.TabName },
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
          FilterValue: 0,
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
    // if( TabNames.TabName === TabName.AssignInterviewPanel){
    void getRecurtimentList()
    // }
  }, [])


  const handleRadioChange = async (item: string) => {
    setFormState((prevState: any) => ({
      ...prevState,
      ShortlistedValue: item,
    }));
  };

  const handleInputChangeTextArea = (
    value: string | any,
    StateValue: string
  ) => {
    setComment(value);
    setValidationErrors((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 7px 4px 3px #d3d3d3", border: "0px solid rgba(0, 0, 0, 0.12)", borderRadius: "30px", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents
                    value={`Job Title - ${formState.JobTitle} (${formState.JobCode})`}
                  >
                    {" "}
                  </LabelHeaderComponents>
                </div>
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents
                    value={`Status - ${formState.Status}`}
                  >
                    {" "}
                  </LabelHeaderComponents>
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Name"
                    value={formState.FullName}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Surname"
                    value={formState.LastName}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Nationality"
                    value={formState.Nationality}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Gender"
                    value={formState.Gender}
                    disabled={true}
                    mandatory={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Age"
                    value={"40"}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Highest Relevant Qualification"
                    value={formState?.Qualification}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experience in Mining Industry(Years)"
                    value={formState?.TotalYearOfExperiance}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experience in related field(Years)"
                    value={formState?.ReleventExperience}
                    disabled={true}
                    mandatory={false}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={formState.CandidateCVDoc}
                  // Label={"Candidate Resume"}
                  />
                </div>
              </div>
              {TabName.AssignInterviewPanel ? (
                <>
                  <div className="ms-Grid-row">
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
                      <div className="ms-Grid-col ms-lg4">
                        <CustomMultiSelect
                          label="Interview Panel - Level 2"
                          value={InterviewedLevel.AssignInterviewedLevel1Option}
                          options={InterviewedLevel.AssignInterviewedLevel1Option}
                          disabled={true}
                          mandatory={true}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (<></>)}

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg6">
                      <CustomViewDocument
                        Attachment={formState.RoleProfileDocument}
                      // Label={"Role Profile Document"}
                      />
                    </div>
                  </div>
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg6">
                      <CustomViewDocument
                        Attachment={formState.AdvertisementDocument}
                      // Label={"Advertisement Documents"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6">
                  <CustomRadioGroup
                    label="Is the Candidate suits for the vaccancy position: "
                    value={formState.ShortlistedValue}
                    options={["Yes", "No", "Waiting List"]}
                    error={false}
                    mandatory={false}
                    onChange={(item) => handleRadioChange(item)}
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomLabel value={"View Justification"} />

                  <ReuseButton
                    label="View"
                    //onClick={()}
                    spacing={4}
                  />
                </div>
                <div
                  className="ms-Grid-col ms-lg12"
                  style={{ marginBottom: "7px" }}
                >
                  <CustomTextArea
                    label="Justification"
                    value={Comments}
                    error={validationErrors.Comments}
                    onChange={(value) =>
                      handleInputChangeTextArea(value, "Comments")
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
                    onChange={(value: boolean) => setCheckbox(value)}
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12">
                  {/* <CustomSignature
                    Name={(MasterData.userDetails[0].FirstName ?? "") + " " + (MasterData.userDetails[0]?.MiddleName ?? "") + " " + (MasterData.userDetails[0]?.LastName ?? "")}
                    JobTitleInEnglish={MasterData.userDetails[0].JopTitleEnglish}
                    JobTitleInFrench={MasterData.userDetails[0].JopTitleFrench}
                    Department={MasterData.userDetails[0].DepartmentName}
                    Date={SignDate ? SignDate.toString() : ""}
                    TermsAndCondition={Checkbox}
                  /> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];
  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem)
  };

  function back_fn() {
    throw new Error("Function not implemented.");
  }

  function Submit_fn() {
    throw new Error("Function not implemented.");
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
                label: "Close",
                onClick: async () => {
                  back_fn();
                },
              },
              {
                label: "Submit ",
                onClick: async () => {
                  Submit_fn();
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

      {/* {AlertPopupOpen ? (
                <>
                    <CustomAlert
                        {...alertProps}
                        onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
                    />
                </>
            ) : <></>} */}
    </>
  );
};

export default ViewCandidateDetails;
