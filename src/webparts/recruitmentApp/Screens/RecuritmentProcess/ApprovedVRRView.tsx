import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import {
  ColorCode,
  DocumentLibraray,
  RoleProfileMaster,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { AdvDetails, RecuritmentData } from "../../Models/RecuritmentVRR";
import CustomLabel from "../../components/CustomLabel";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CommanComments from "../../components/CommanComments";
import ReuseButton from "../../components/ReuseButton";
import CustomViewDocument from "../../components/CustomViewDocument";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";

import CustomPreviewScreen from "./CustomPreviewScreen";
import * as moment from "moment";
import {
  Attachment,
  ButtonAction,
  labelNames,
} from "../../utilities/LabelName";

const ApprovedVRRView: React.FC = (props: any) => {
  const [tabVisibility, setTabVisibility] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });

  const [data, setData] = useState<RecuritmentData>({
    VRRID: 0,
    BusinessUnitCodeID: 0,
    DepartmentID: 0,
    SubDepartmentID: 0,
    SectionID: 0,
    DepartmentCodeID: 0,
    JobNameInEnglishID: 0,
    JobNameInFrenchID: 0,
    PatersonGradeID: 0,
    DRCGradeID: 0,
    JobCodeId: 0,
    BusinessUnitCode: "",
    BusinessUnitName: "",
    BusinessUnitDescription: "",
    Department: "",
    SubDepartment: "",
    Section: "",
    DepartmentCode: "",
    Nationality: "",
    JobNameInEnglish: "",
    JobNameInFrench: "",
    NoofPositionAssigned: "",
    PatersonGrade: "",
    DRCGrade: "",
    EmployementCategory: "",
    ContractType: "",
    JobCode: "",
    AreaOfWork: "",
    ReasonForVacancy: "",
    RecruitmentAuthorised: "",
    IsPayrollEmailed: "",
    EnterNumberOfMonths: 0,
    DateRequried: "",
    IsRevert: "",
    VacancyConfirmed: "",
    // AdvertisementAttachement: [],
    RoleProfileDocument: [],
    GradingDocument: [],
    AdvertisementDocument: [],
    AssignRecruitmentHR: { key: 0, text: "" },
    AssignRecruitmentHROption: [],
    OnamSignedStampsAttchment: [],
    OnamSignedStampsDocument: [],
    AssignAgencies: { key: 0, text: "" },
    AssignAgenciesOption: [],
    CandidateCVAttachment: [],
    Comments: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [Preview, setPreview] = useState<boolean>(false);
  //const [isViewed, setIsViewed] = useState(false);
  // const [RoleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<
  //     RoleSpecKnowledge[]
  //   >([
  //     {
  //       RoleSpeKnowledge: { key: 0, text: "" },
  //       RequiredLevel: { key: 0, text: "" },
  //     },
  //   ]);
  //    const [qualificationValue, setQualificationValue] =
  //       useState<QualificationValue>({
  //         MinQualification: [],
  //         PrefeQualification: [],
  //       });
  //     const [TechnicalSkillValue, setTechnicalSkillValue] = useState<
  //       TechnicalSkills[]
  //     >([
  //       {
  //         TechnicalSkills: { key: 0, text: "" },
  //         LevelProficiency: { key: 0, text: "" },
  //       },
  //     ]);
  const [advDetails, setAdvDetails] = useState<AdvDetails>({
    MinQualificationOption: [],
    PrefeQualificationOption: [],
    RoleSpeKnowledgeoption: [],
    RequiredLeveloption: [],
    TechnicalSkillsOption: [],
    LevelProficiencyOption: [],
    RolePurpose: "",
    JobDescription: "",
    addMasterQualification: "",
    TotalExperience: { key: 0, text: "" },
    ExperienceinMiningIndustry: { key: 0, text: "" },
    TotalExperienceOption: [],
    ExperienceinMiningIndustryOption: [],
    YearofExperience: " ",
    PreferredExperience: "",
    ValidFrom: undefined,
    ValidTo: undefined,
    FunctionType: "",
    JobFunctionalType: { key: 0, text: "" },
    JobFunctionalTypeOption: [],
    addMasterMinimumQualification: "",
    AdvertisementAttachement: [],
    JobcodeChecked: false,
    JobTitleofFunctionalManager: { key: 0, text: "" },
    FunctionalManagerName: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor: { key: 0, text: "" },
    LineManagerSupervisorName: { key: 0, text: "" },
    JobFunctionalType_fr: { key: 0, text: "" },
    JobDescription_fr: "",
    RolePurpose_fr: "",
    IsMasterData: false,
    JobTilteFunctionalManager_fr: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor_fr: { key: 0, text: "" },
    JobTitleofFunctionalManagerOption: [],
    JobTitleofLineManagerSupervisorOption: [],
  });

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const filterConditionsVRR = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ];
      const Conditions = "";

      const response = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsVRR,
        Conditions
      );

      if (response.data.length > 0) {
        const op = response.data[0];

        const BUName =
          props?.BusinessUnitCodeAllColumn.find(
            (item: any) => item.key === op.BusinessUnitCodeId
          ) || {};
        // const JobtitleFrench =
        //   props?.JobInFrenchList.find(
        //     (item: any) => item.key === op.JobTitleFrenchId
        //   ) || {};

        const [
          RoleProfileDocment,
          GradingDocument,
          AdvertismentDocment,
          OnamSignedStampsDocment,
        ] = await Promise.all([
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.RoleProfile
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.Grading
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RecruitmentAdvertisementDocument,
            op.JobCode
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.ONAMSignedStampDocuments,
            op.JobCode
          ),
        ]);

        if (
          RoleProfileDocment.status === 200 ||
          AdvertismentDocment.status === 200
        ) {
          setData((prevState) => ({
            ...prevState,
            ID: op.ID,
            BusinessUnitCodeID: op.BusinessUnitCodeId,
            DepartmentID: op.DepartmentId,
            SubDepartmentID: op.SubDepartmentId,
            SectionID: op.SectionId,
            DepartmentCodeID: op.DepartmentCodeId,
            JobNameInEnglishID: op.JobTitleEnglishId,
            JobNameInFrenchID: op.JobTitleFrenchId,
            PatersonGradeID: op.PatersonGradeId,
            DRCGradeID: op.DRCGradeId,
            JobCodeID: op.JobCodeId,
            BusinessUnitCode: op.BusinessUnitCode || "",
            BusinessUnitName: BUName.Name || "",
            BusinessUnitDescription: BUName.Description || "",
            Department: op.Department || "",
            SubDepartment: op.SubDepartment || "",
            Section: op.Section || "",
            DepartmentCode: op.DepartmentCode || "",
            Nationality: op.Nationality || "",
            JobNameInEnglish: op.JobTitleEnglish || "",
            JobNameInFrench: op.JobTitleFrench || "",
            PatersonGrade: op.PatersonGrade || "",
            DRCGrade: op.DRCGrade || "",
            EmployementCategory: op.EmploymentCategory || "",
            ContractType: op.TypeOfContract || "",
            JobCode: op.JobCode || "",
            AreaOfWork: op.AreaofWork || "",
            NoofPositionAssigned: op.NumberOfPersonNeeded
              ? op.NumberOfPersonNeeded.toString()
              : "0",
            ReasonForVacancy: op.ReasonForVacancy || "",
            RecruitmentAuthorised: op.RecruitmentAuthorised || "",
            IsPayrollEmailed: op.IsPayrollEmailed || "",
            EnterNumberOfMonths: Number(op.EnterNumberOfMonths) ?? 0,
            DateRequried: moment.utc(op.DateRequried).format("DD/MM/YYYY"),
            VacancyConfirmed: op.VacancyConfirmed || "",
            RoleProfileDocument: RoleProfileDocment.data || [],
            GradingDocument: GradingDocument.data || [],
            AdvertisementDocument: AdvertismentDocment.data || [],
            OnamSignedStampsDocument: OnamSignedStampsDocment.data || [],
          }));
        }
        const filterConditions = [
          {
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: op.JobCodeId,
          },
        ];

        const Advresponse =
          await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
            filterConditions,
            ""
          );

        if (Advresponse.status === 200) {
          const data = Advresponse.data;

          if (data && data.length > 0) {
            const rawData = data[0];

            const RoleSpeKnowledgeValues =
              rawData.RoleSpecificKnowledge?.map(
                (item: any) => item.RoleSpecificKnowledge
              ) || [];
            const RequiredLevelValues =
              rawData.RoleSpecificKnowledge?.map(
                (item: any) => item.RequiredLevel
              ) || [];

            const TechnicalSkillsOption =
              rawData.TechnicalSkillsKnowledge?.map(
                (item: any, index: number) => ({
                  key: index,
                  text: item.TechnicalSkills,
                })
              ) || [];

            const LevelProficiencyOption =
              rawData.TechnicalSkillsKnowledge?.map(
                (item: any, index: number) => ({
                  key: index,
                  text: item.LevelProficiency,
                })
              ) || [];

            // const MinQualificationOption = rawData.Qualification
            //   ? [{ key: 0, text: rawData.Qualification }]
            //   : [];
            // const PrefeQualificationOption = rawData.PreferredQualification
            //   ? [{ key: 0, text: rawData.PreferredQualification }]
            //   : [];

            setAdvDetails((prevState) => ({
              ...prevState,
              RolePurpose: rawData.RoleProfile || "",
              JobDescription: rawData.JobDescription || "",
              // MinQualificationOption: MinQualificationOption,
              // PrefeQualificationOption: PrefeQualificationOption,
              TechnicalSkillsOption: TechnicalSkillsOption,
              LevelProficiencyOption: LevelProficiencyOption,
              RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
              RequiredLeveloption: RequiredLevelValues,
              TotalExperience: rawData.YearofExperience || "",
              ExperienceinMiningIndustry: rawData.PreferredExperience || "",
              YearofExperience: rawData.YearofExperience || "",
              PreferredExperience: rawData.PreferredExperience || "",
              FunctionType: rawData.FunctionType,
              JobcodeChecked: true,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setTabVisibility({
        tab1: true, // Activate the first tab initially
        tab2: false,
        tab3: false,
      });
      setTabNameData((prevTabNames) => {
        const newTabNames = [{ tabName: props.stateValue?.TabName }];
        return newTabNames;
      });
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void initialize();
  }, []);

  const OpenComments = async () => {
    setMainComponent(false);
    let filterConditions = [];
    let Conditions = "";

    filterConditions.push({
      FilterKey: "RecruitmentID",
      Operator: "eq",
      FilterValue: props.stateValue.ID,
    });
    const CommentsList = await getVRRDetails.GetCommentsData(
      props.EmployeeList,
      Conditions,
      filterConditions
    );
    if (CommentsList.status === 200) {
      setCommentsData(CommentsList.data);
    }
  };

  const tabs = [
    {
      label: "My Submission",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            {tabVisibility.tab1 && (
              <div>
                {/* <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${data.JobNameInEnglish} (${data.JobCode})`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Status - ${props.stateValue?.Status}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div> */}
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitCode}
                      value={data.BusinessUnitCode}
                      error={false}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitCode: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitName}
                      value={data.BusinessUnitName}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitName: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitDescription}
                      value={data.BusinessUnitDescription}
                      error={false}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitDescription: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Department}
                      value={data.Department}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Department: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.SubDepartment}
                      value={data.SubDepartment}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          SubDepartment: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Section}
                      value={data.Section}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Section: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DepartmentCode}
                      value={data.DepartmentCode}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DepartmentCode: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Nationality}
                      value={data.Nationality}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Nationality: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  {/*                                    
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (English)"
                                            value={formState.JobNameInEnglish}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInEnglish: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (French)"
                                            value={formState.JobNameInFrench}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInFrench: value }))
                                            }
                                        />
                                    </div> */}
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.PatersonGrade}
                      value={data.PatersonGrade}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          PatersonGrade: value,
                        }))
                      }
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DRCGrade}
                      value={data.DRCGrade}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DRCGrade: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.EmploymentCategory}
                      value={data.EmployementCategory}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          EmployementCategory: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.TypeofContract}
                      value={data.ContractType}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          ContractType: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.AreaofWork}
                      value={data.AreaOfWork}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          AreaOfWork: value,
                        }))
                      }
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.NoofPerson}
                      value={data.NoofPositionAssigned}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          NoofPositionAssigned: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DatePositionRequired}
                      value={
                        data.DateRequried
                          ? new Date(data.DateRequried)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : ""
                      }
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DateRequried: value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                  <LabelHeaderComponents value={Attachment.Attachments} />
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={Attachment.PositionDocument.RoleProfileDocuments}
                    />
                    <CustomViewDocument
                      Attachment={data.RoleProfileDocument}
                      webUrl={props.webURL}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={Attachment.PositionDocument.GradingDocuments}
                    />
                    <CustomViewDocument
                      Attachment={data.GradingDocument}
                      webUrl={props.webURL}
                    />
                  </div>

                  {data.AdvertisementDocument.length > 0 && (
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel
                        value={
                          Attachment.PositionDocument.DraftONEMAdvertDocFrench
                        }
                      />
                      <CustomViewDocument
                        Attachment={data.AdvertisementDocument}
                        webUrl={props.webURL}
                      />
                    </div>
                  )}

                  {data.OnamSignedStampsDocument.length > 0 && (
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel
                        value={
                          Attachment.PositionDocument.ONEMSignedStampedDocuments
                        }
                      />
                      <CustomViewDocument
                        Attachment={data.OnamSignedStampsDocument}
                        webUrl={props.webURL}
                      />
                    </div>
                  )}
                </div>
                <div className="ms-Grid-row">
                  {advDetails.RolePurpose != "" ? (
                    <div
                      className="ms-Grid-col ms-lg3"
                      style={{ position: "relative", right: "1px" }}
                    >
                      <div>
                        <CustomLabel
                          value={
                            Attachment.PositionDocument.ViewJobAdvertisement
                          }
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
                          onClick={async () => {
                            setPreview(true);
                            setMainComponent(false);
                          }}
                          spacing={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    className="ms-Grid-col ms-lg3"
                    style={{ position: "relative", right: "1px" }}
                  >
                    {/* <div className="ms-Grid-col ms-lg4"> */}
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
                      onClick={OpenComments}
                      spacing={4}
                    />
                  </div>
                </div>
              </div>
              // </div>
            )}
          </CardContent>
        </Card>
      ),
    },
  ];
  const back_fn = () => {
    props.navigation("/RecurimentProcess", {
      state: {
        TabName: props.stateValue?.TabName,
        tab: props.stateValue?.tab,
      },
    });
  };

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  return (
    <>
      {Preview ? (
        <CustomPreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          Ok_btnfn={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          JobTitle={data.JobNameInEnglish}
        />
      ) : MainComponent ? (
        <>
          <CustomLoader isLoading={isLoading}>
            <div className="menu-card">
              <BreadcrumbsComponent
                items={tabs}
                initialItem={activeTab}
                TabName={TabNameData}
                onBreadcrumbChange={handleBreadcrumbChange}
                JobValue={{
                  JobTitle: data.JobNameInEnglish,
                  JobCode: data.JobCode,
                  Status: props.stateValue?.Status,
                }}
                additionalButtons={[
                  {
                    label: ButtonAction.Back,
                    onClick: () => {
                      back_fn();
                    },
                  },
                ]}
              />
            </div>
          </CustomLoader>
        </>
      ) : (
        <>
          <CommanComments
            onClose={() => setMainComponent(true)}
            Comments={CommentData}
          />
        </>
      )}
    </>
  );
};

export default ApprovedVRRView;
