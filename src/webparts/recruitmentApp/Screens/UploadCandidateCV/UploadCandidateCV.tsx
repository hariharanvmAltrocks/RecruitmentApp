import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import CustomLoader from "../../Services/Loader/CustomLoader";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import { Label } from "@fluentui/react";
import CustomInput from "../../components/CustomInput";
import {
  ButtonAction,
  CategoryID,
  ColorCode,
  HRMSAlertOptions,
  labelName,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  TabName,
} from "../../utilities/Config";
import {
  CandidatedCVDetails,
  CommanQuestion,
  stateOption,
  ValidationErrors,
} from "../../Models/RecuritmentVRR";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomLabel from "../../components/CustomLabel";
import AttachmentButton from "../../components/AttachmentButton";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import CustomViewAttachment from "../../components/CustomViewAttachment";
import {
  CommonServices,
  GetPortalJobsService,
} from "../../Services/ServiceExport";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import IsValid from "../../components/Validation";
import {
  CheckMyCandidate,
  ProfileAddress,
  profileDetailEmploymentHistory,
  ProfileDetailsExperience,
  profileXOptAnswers,
  UpsertProfile,
} from "../../Models/ApIInterface";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import PhoneNumberComponent from "../../components/PhoneNumberComponenet";
import * as moment from "moment";
import { getProfileData } from "../../Services/ReviewProfileService/ReviewCandidateService";
import CustomViewDocument from "../../components/CustomViewDocument";
import { UpsertDocument } from "../../Services/CareerPortalApi/IGetPortalJobs";

const UploadCandidateCV: React.FC = (props: any) => {
  const [tabVisibility, setTabVisibility] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });

  const [data, setData] = useState<CandidatedCVDetails>({
    Title: { key: 0, text: "" },
    FirstName: "",
    MiddleName: "",
    LastName: "",
    DOB: undefined,
    PhoneNumber: 0,
    AlternativePhoneNumber: 0,
    Nationality: { key: 0, text: "" },
    ProofOfIdentity: { key: 0, text: "" },
    IdentityNumber: "",
    Gender: "",
    Email: "",
    HighestEducation: { key: 0, text: "" },
    WorkExperience: { key: 0, text: "" },
    RelevantExperience: "",
    AddressLine: "",
    Country: { key: 0, text: "" },
    State: { key: 0, text: "" },
    City: { key: 0, text: "" },
    PostalCode: "",
    CandidateCV: [],
    CountryCode: "",

    NumberOftax: "",
    CurrentEmployer: "",
    CurrentPosition: "",
    WillingToRelocate: "",
    previouslyworkedMine: "",
    familylinks: "",
    businesslinks: "",
    familyDocuments: [],
    businessDocuments: [],

    whichOperation: "",
    YourRole: "",
    RegionProvince: "",
  });
  const [validationError, setValidationError] = useState<ValidationErrors>({
    Title: false,
    FirstName: false,
    MiddleName: false,
    LastName: false,
    DOB: false,
    PhoneNumber: false,
    AlternativePhoneNumber: false,
    Nationality: false,
    ProofOfIdentity: false,
    IdentityNumber: false,
    Gender: false,
    Email: false,
    HighestEducation: false,
    WorkExperience: false,
    RelevantExperience: false,
    AddressLine: false,
    Country: false,
    State: false,
    City: false,
    PostalCode: false,
    CandidateCV: false,

    NumberOftax: false,
    CurrentEmployer: false,
    CurrentPosition: false,
    WillingToRelocate: false,
    previouslyworkedMine: false,
    familylinks: false,
    businesslinks: false,

    familyDocuments: false,
    businessDocuments: false,

    whichOperation: false,
    YourRole: false,
    RegionProvince: false,
  });
  const [StateOption, setStateOption] = useState<stateOption>({
    TitleOption: [],
    NationalityOption: [],
    ProofOfIdentityOption: [],
    HighestEducationOption: [],
    WorkExperienceOption: [],
    CountryOption: [],
    StateOption: [],
    CityOption: [],
    CountryCodeOption: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [AlertPopupOpen, setAlertPopupOpen] = useState<boolean>(false);
  const [alertProps, setalertProps] = useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const [question, setQuestion] = useState<CommanQuestion[]>([]);
  const [questionErrors, setquestionErrors] = React.useState<
    Record<number, boolean>
  >({});

  const fetchData = async (Titles: AutoCompleteItem[]) => {
    setIsLoading(true);
    try {
      let response = await getProfileData.getCandidateProfile(
        props.stateValue?.ID
      );
      // console.log(response, "response");
      if (response.status === ResponeStatus.SUCCESS) {
        let item = response.data.data;
        let Title = Titles.filter(
          (items) => items.key === item?.profile?.title
        );
        let Nationality = {
          key: item?.profile?.nationality?.value,
          text: item?.profile?.nationality?.displayText,
        };
        // StateOption.NationalityOption.filter(
        //   (items) => items.key === item?.profile?.nationality?.value
        // );
        let HighestEducation = {
          key: item?.profile?.education?.value,
          text: item?.profile?.education?.displayText,
        };
        // StateOption.HighestEducationOption.filter(
        //   (items) => items.key === item?.profile?.educationId
        // );
        let ProofOfIdentity = {
          key: item?.profile?.identityType?.value,
          text: item?.profile?.identityType?.displayText,
        };
        // StateOption.ProofOfIdentityOption.filter(
        //   (items) => items.key === item?.profile?.identityType?.value
        // );
        let WorkExperience = {
          key: 0,
          text: item?.profile?.totalYearOfExperiance,
        };
        // StateOption.WorkExperienceOption.filter(
        //   (items) => items.text === item?.profile?.totalYearOfExperiance
        // );
        let Country = {
          key: item?.profile?.profileAddress?.country?.countryCode,
          text: item?.profile?.profileAddress?.country?.countryName,
        };
        // StateOption.CountryOption.filter(
        //   (items) => items.key === item?.profile?.profileAddress?.countryId
        // );
        let State = {
          key: item?.profile?.profileAddress?.state?.stateId,
          text: item?.profile?.profileAddress?.state?.state,
        };
        // StateOption.StateOption.filter(
        //   (items) => items.key === item?.profile?.profileAddress?.stateId
        // );
        let City = {
          key: item?.profile?.profileAddress?.city?.cityId,
          text: item?.profile?.profileAddress?.city?.city,
        };
        // StateOption.CityOption.filter(
        //   (items) => items.key === item?.profile?.profileAddress?.cityId
        // );

        let CandidateCV = await CommonServices.GetDocumentinUrl(
          item?.document?.filePath
        );
        let BusinessLinkPath = item?.profile?.profileDetailAttachments.filter(
          (item: any) => item.attachmentTypeCoe === "PA01"
        );
        let BusinessDocument = await CommonServices.GetDocumentinUrl(
          BusinessLinkPath[0]?.document?.filePath
        );
        let FamilyLinkPath = item?.profile?.profileDetailAttachments.filter(
          (item: any) => item.attachmentTypeCoe === "PA02"
        );
        let FamilyDocument = await CommonServices.GetDocumentinUrl(
          FamilyLinkPath[0]?.document?.filePath
        );

        const GetQuestionnaire: CommanQuestion[] =
          item?.profile?.profileXOptAnswers.map((item: any, index: number) => {
            const incrementedIndex = index + 1;
            let OptionContent = item.question?.questionXOptions.map(
              (items: any) => {
                return {
                  optContentId: items.optContentId,
                  optContent: items?.optContent?.contentEn,
                };
              }
            );
            const htmlString = item.question?.quesContent?.contentEn || "";
            const tempElement = document.createElement("div");
            tempElement.innerHTML = htmlString;
            const plainText = tempElement.innerText
              .replace(/\s*\*$/, "")
              .trim();
            return {
              id: incrementedIndex,
              question: plainText,
              questionId: item?.questionId,
              questionXOptions: OptionContent,
              answerContentId: item?.answerContentId,
            };
          });
        setQuestion(GetQuestionnaire ?? []);
        //  let PhoneNum = item?.profile?.contactNumber1?.substring(3) ?? "";
        setData((prev) => ({
          ...prev,
          Title: Title[0],
          FirstName: item?.profile?.firstName,
          MiddleName: item?.profile?.middleName,
          LastName: item?.profile?.lastName,
          DOB: item?.profile?.dob
            ? moment(item?.profile?.dob, "YYYY-MM-DD").toDate()
            : undefined,
          PhoneNumber: item?.profile?.contactNumber1?.substring(3) ?? "",
          CountryCode: item?.profile?.contactNumber1.substring(0, 3),
          // CountryCode: item?.profile?.contactNumber1.substring(0, 3),
          AlternativePhoneNumber:
            item?.profile?.contactNumber2?.substring(3) ?? "",
          Nationality: Nationality,
          ProofOfIdentity: ProofOfIdentity,
          IdentityNumber: item?.profile?.identityValue,
          Gender: item?.profile?.genderId,
          Email: item?.profile?.email,
          HighestEducation: HighestEducation,
          WorkExperience: WorkExperience,
          RelevantExperience: item?.profile?.releventExperience,
          AddressLine: item?.profile?.profileAddress?.address1,
          Country: Country,
          State: State,
          City: City,
          PostalCode: item?.profile?.profileAddress?.postalZipCode,
          CandidateCV: CandidateCV.data,
          CurrentEmployer: item?.profile?.profileDetailExperiences[0]?.company,
          CurrentPosition:
            item?.profile?.profileDetailExperiences[0]?.roleDescription,
          businesslinks: item?.profile?.hasBusinessLinks === "1" ? "Yes" : "No",
          familylinks:
            item?.profile?.hasEmployeeRelation === "1" ? "Yes" : "No",
          familyDocuments: FamilyDocument.data,
          businessDocuments: BusinessDocument.data,
          previouslyworkedMine:
            item?.profile?.profileDetailEmploymentHistory
              ?.hasIvanhoeZijinExperienceId === "3"
              ? "None of the above"
              : item?.profile?.profileDetailEmploymentHistory
                  ?.hasIvanhoeZijinExperienceId === "2"
              ? "Zijin"
              : "Ivanhoe",

          whichOperation:
            item?.profile?.profileDetailEmploymentHistory?.workedOperation,
          YourRole: item?.profile?.profileDetailEmploymentHistory?.workRole,
          RegionProvince:
            item?.profile?.profileDetailEmploymentHistory?.territory,
        }));
      } else {
        let APIError = {
          Message: RecuritmentHRMsg.APIErrorMsg,
          Type: HRMSAlertOptions.Confirmation,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              props.navigation("/RecurimentProcess/UploadCandidateList", {
                state: {
                  tab: props.stateValue?.tab,
                  JobCode: props.stateValue?.JobCode,
                  JobCodeId: props.stateValue?.JobCodeId,
                  JobTitle: props.stateValue?.JobTitle,
                },
              });
              setAlertPopupOpen(false);
            } else {
              setAlertPopupOpen(false);
            }
          },
        };

        setAlertPopupOpen(true);
        setalertProps(APIError);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchMaster() {
      setIsLoading(true);
      const NationalityOption = await GetPortalJobsService.GetAllMaster(
        CategoryID.Nationality
      );
      const ProofIdentity = await GetPortalJobsService.GetAllMaster(
        CategoryID.ProofofIdentity
      );
      const EducationLevels = await GetPortalJobsService.GetAllMaster(
        CategoryID.EducationLevels
      );
      const TitleForProfile = await GetPortalJobsService.GetAllMaster(
        CategoryID.TitleforProfile
      );
      const GetQuestionByJobCode =
        await GetPortalJobsService.GetQuestionByJobCode(
          props.stateValue?.JobCode
        );
      // console.log(GetQuestionByJobCode, "GetQuestionByJobCode");

      const CountryCode = await GetPortalJobsService.GetCountryMaster();
      if (
        NationalityOption.status === ResponeStatus.SUCCESS &&
        ProofIdentity.status === ResponeStatus.SUCCESS &&
        EducationLevels.status === ResponeStatus.SUCCESS &&
        CountryCode.status === ResponeStatus.SUCCESS &&
        TitleForProfile.status === ResponeStatus.SUCCESS &&
        GetQuestionByJobCode.status === ResponeStatus.SUCCESS
      ) {
        // Prepare Nationality options, always put "Congolese (DRC)" at the top
        let Nationality: AutoCompleteItem[] = (
          NationalityOption.data ?? []
        ).map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));

        const congoIndex = Nationality.findIndex(
          (item) =>
            typeof item.text === "string" &&
            item.text.trim().toLowerCase() === "congolese (drc)"
        );
        let congoItem: AutoCompleteItem[] = [];
        if (congoIndex !== -1) {
          congoItem = [Nationality[congoIndex]];
          Nationality.splice(congoIndex, 1);
        }

        Nationality = Nationality.sort((a, b) => {
          const textA = typeof a.text === "string" ? a.text : "";
          const textB = typeof b.text === "string" ? b.text : "";
          return textA.localeCompare(textB);
        });

        Nationality = [...congoItem, ...Nationality];

        const EducationLevles: AutoCompleteItem[] = (
          EducationLevels.data ?? []
        ).map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));

        const TitleForProfileOpt: AutoCompleteItem[] = (
          TitleForProfile.data ?? []
        ).map((item: any) => ({
          key: item?.value,
          text: item?.displayText,
        }));

        const ProofIdentityOption: AutoCompleteItem[] = (
          ProofIdentity.data ?? []
        ).map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));

        const CountryOpt: AutoCompleteItem[] = (CountryCode.data ?? []).map(
          (opt: any) => ({
            key: opt.code,
            text: opt.text,
          })
        );

        const Countrycode: AutoCompleteItem[] = (CountryCode.data ?? []).map(
          (opt: any) => ({
            key: opt.code,
            text: opt.id,
          })
        );

        const YearofExperiance = await CommonServices.GetMasterData(
          ListNames.HRMSExperienceMaster
        );
        const YearofExperianceOption: AutoCompleteItem[] =
          YearofExperiance.data.map((item: any) => ({
            key: item.Id,
            text: item.ExperienceInYearRange,
          }));

        setStateOption((prevState) => ({
          ...prevState,
          NationalityOption: Nationality,
          ProofOfIdentityOption: ProofIdentityOption,
          WorkExperienceOption: YearofExperianceOption,
          HighestEducationOption: EducationLevles,
          CountryOption: CountryOpt,
          TitleOption: TitleForProfileOpt,
          CountryCodeOption: Countrycode,
        }));
        setQuestion(GetQuestionByJobCode.data ?? []);
        setIsLoading(false);
        try {
          if (props.stateValue?.ButtonAction === ButtonAction.View) {
            await fetchData(TitleForProfileOpt);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        setIsLoading(false);
        const APIError = {
          Message: RecuritmentHRMsg.APIErrorMsg,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              props.navigation("/RecurimentProcess/UploadCandidateList", {
                state: {
                  tab: props.stateValue?.tab,
                  JobCode: props.stateValue?.JobCode,
                  JobCodeId: props.stateValue?.JobCodeId,
                  JobTitle: props.stateValue?.JobTitle,
                },
              });
              setAlertPopupOpen(false);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(APIError);
        setIsLoading(false);
      }
    }
    void fetchMaster();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setTabVisibility({
        tab1: true, // Activate the first tab initially
        tab2: false,
        tab3: false,
      });
      const newTabNames = [
        { tabName: TabName.UploadCV },
        { tabName: ButtonAction.View },
        { tabName: TabName.ViewCandidateList },
        { tabName: TabName.CandidateDetails },
      ];
      setTabNameData(newTabNames);
    };

    void initialize();
  }, []);

  const handleDateChange = (
    key: keyof CandidatedCVDetails,
    item: Date | null
  ) => {
    setData((prevState) => ({
      ...prevState,
      [key]: item,
    }));
    setValidationError((prevState: any) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleAutoComplete = async (
    key: keyof CandidatedCVDetails,
    item: AutoCompleteItem | null
  ) => {
    if (item) {
      setData((prevState) => ({
        ...prevState,
        [key]: item,
      }));
      setValidationError((prevState: any) => ({
        ...prevState,
        [key]: false,
      }));
    }
    if (key === "Country") {
      const StateOption = await GetPortalJobsService.GetStateByCountry(
        String(item?.key)
      );
      const StateOptionData: AutoCompleteItem[] = (StateOption.data ?? []).map(
        (opt: any) => ({
          key: opt.code,
          text: opt.text,
        })
      );

      setStateOption((prevState) => ({
        ...prevState,
        StateOption: StateOptionData,
      }));
    }
    if (key === "State") {
      const CitiesOption = await GetPortalJobsService.GetCitiesByState(
        String(item?.key)
      );
      const CitiesOptionData: AutoCompleteItem[] = (
        CitiesOption.data ?? []
      ).map((opt: any) => ({
        key: opt.code,
        text: opt.text,
      }));

      setStateOption((prevState) => ({
        ...prevState,
        CityOption: CitiesOptionData,
      }));
    }

    if (key === "Nationality") {
      if (item && String(item.key) != "N0") {
        const ProofOFIden = StateOption.ProofOfIdentityOption.filter(
          (Iden) => Iden && String(Iden.key) === "PI01"
        );
        setStateOption((prevState) => ({
          ...prevState,
          ProofOfIdentityOption: ProofOFIden,
        }));
        setData((prevState) => ({
          ...prevState,
          ProofOfIdentity: { key: 0, text: "" },
        }));
      } else {
        const ProofIdentity = await GetPortalJobsService.GetAllMaster(
          CategoryID.ProofofIdentity
        );
        const ProofIdentityOption: AutoCompleteItem[] = (
          ProofIdentity.data ?? []
        ).map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));
        setStateOption((prevState) => ({
          ...prevState,
          ProofOfIdentityOption: ProofIdentityOption,
        }));
        setData((prevState) => ({
          ...prevState,
          ProofOfIdentity: { key: 0, text: "" },
        }));
      }
    }
  };

  const handleInputChange = (
    key: keyof CandidatedCVDetails,
    item: string | any
  ) => {
    if (
      key === "PostalCode" ||
      key === "RelevantExperience" ||
      key === "NumberOftax"
    ) {
      let value: string;

      if (key === "RelevantExperience") {
        let maxExperience = null;

        if (data.WorkExperience && data.WorkExperience.text) {
          const text = data.WorkExperience.text.trim();
          if (text.includes("-")) {
            const experienceRange = text
              .split("-")
              .map((v) => parseInt(v.trim(), 10));
            maxExperience = experienceRange[1] || null;
          } else if (text.includes("+")) {
            maxExperience = 20;
          }
        }
        const inputValue = parseInt(item, 10);
        if (maxExperience === null || inputValue <= maxExperience) {
          value = String(inputValue);
        } else {
          value = "";
        }
      } else {
        value = String(item).replace(/[^0-9]/g, "");
      }
      setData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      setValidationError((prevState: any) => ({
        ...prevState,
        [key]: false,
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      [key]: item,
    }));
    setValidationError((prevState: any) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleDocument = (StateValue: string, value: IDocFiles[]) => {
    setData((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleDelete = (index: number, attachmentType: string) => {
    setData((prevState) => {
      const currentValue =
        prevState[attachmentType as keyof CandidatedCVDetails];
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

  const handleRadioChange = async (
    key: keyof CandidatedCVDetails,
    item: string | any
  ) => {
    setData((prevState: any) => ({
      ...prevState,
      [key]: item,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handlePhoneNumberChange = async (
    key: keyof CandidatedCVDetails,
    phoneNumber: string,
    countryKey: string | number
  ) => {
    let value = String(phoneNumber).replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 15);

    setData((prevState) => ({
      ...prevState,
      [key]: value,
      CountryCode: countryKey,
    }));

    setValidationError((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleQuestionChange = (id: number, value: AutoCompleteItem | null) => {
    setQuestion((prevState) =>
      prevState.map((q) =>
        q.id === id
          ? { ...q, answerContentId: value?.key ? String(value.key) : "" }
          : q
      )
    );
    setquestionErrors((prev) => ({
      ...prev,
      [id]: false,
    }));
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
                <div className="ms-Grid-row">
                  {/* <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      overflow: "visible",
                    }}
                  >
                    <Box sx={{ width: "100%", overflow: "visible" }}>
                      <Box sx={{ mb: 2 }}> */}
                  {/* <div
                          className="ms-Grid-row"
                          style={{ marginLeft: "1%" }}
                        >
                          <LabelHeaderComponents
                            value={`Job Title - ${props.stateValue?.JobTitle} (${props.stateValue?.JobCode})`}
                          >
                            {" "}
                          </LabelHeaderComponents>
                        </div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginLeft: "13px",
                    }}
                  >
                    <LabelHeaderComponents value={" Personal Information"} />
                    {/* <Label
                            style={{
                              fontSize: "18px",
                              color: "black",
                              fontFamily: "Roboto,sans-serif",
                              fontStyle: "normal",
                              fontWeight: "600",
                              marginTop: "1%",
                            }}
                          >
                           
                          </Label> */}
                  </div>
                  <div style={{ padding: "1%" }}>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomAutoComplete
                          label={labelName.Title}
                          options={StateOption.TitleOption}
                          value={data.Title}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) => handleAutoComplete("Title", item)}
                          error={validationError.Title}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.FirstName}
                          value={data.FirstName}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          error={validationError.FirstName}
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("FirstName", item)
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.MiddleName}
                          value={data.MiddleName}
                          error={false}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={false}
                          onChange={(item) =>
                            handleInputChange("MiddleName", item)
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.LastName}
                          value={data.LastName}
                          error={validationError.LastName}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("LastName", item)
                          }
                        />
                      </div>
                    </div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomDatePicker
                          selectedDate={data.DOB}
                          label={labelName.DOB}
                          mandatory={true}
                          onChange={(date) => handleDateChange("DOB", date)}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          maxDate={
                            new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() - 18
                              )
                            )
                          }
                          error={validationError.DOB}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <PhoneNumberComponent
                          label={labelName.PhoneNumber}
                          countries={StateOption.CountryCodeOption}
                          value={data.PhoneNumber}
                          countryKey={data.CountryCode}
                          onChange={(countryKey, phoneNumber) =>
                            handlePhoneNumberChange(
                              "PhoneNumber",
                              phoneNumber,
                              countryKey
                            )
                          }
                          mandatory={true}
                          error={validationError.PhoneNumber}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <PhoneNumberComponent
                          label={labelName.AlternativePhoneNumber}
                          countries={StateOption.CountryCodeOption}
                          value={data.AlternativePhoneNumber}
                          countryKey={data.CountryCode}
                          onChange={(countryKey, phoneNumber) =>
                            handlePhoneNumberChange(
                              "AlternativePhoneNumber",
                              phoneNumber,
                              countryKey
                            )
                          }
                          mandatory={false}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          // error={validationError.AlternativePhoneNumber}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomAutoComplete
                          label={labelName.Nationality}
                          options={StateOption.NationalityOption}
                          value={data.Nationality}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) =>
                            handleAutoComplete("Nationality", item)
                          }
                          error={validationError.Nationality}
                        />
                      </div>
                    </div>

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomAutoComplete
                          label={labelName.ProofofIdentity}
                          options={StateOption.ProofOfIdentityOption}
                          value={data.ProofOfIdentity}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) =>
                            handleAutoComplete("ProofOfIdentity", item)
                          }
                          error={validationError.ProofOfIdentity}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.IdentityNumber}
                          value={data.IdentityNumber}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          error={validationError.IdentityNumber}
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("IdentityNumber", item)
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.Email}
                          value={data.Email}
                          error={validationError.Email}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) => handleInputChange("Email", item)}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomAutoComplete
                          label={labelName.HighestEducation}
                          options={StateOption.HighestEducationOption}
                          value={data.HighestEducation}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) =>
                            handleAutoComplete("HighestEducation", item)
                          }
                          error={validationError.HighestEducation}
                        />
                      </div>
                    </div>

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomAutoComplete
                          label={labelName.WorkExperience}
                          options={StateOption.WorkExperienceOption}
                          value={data.WorkExperience}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          mandatory={true}
                          onChange={(item) =>
                            handleAutoComplete("WorkExperience", item)
                          }
                          error={validationError.WorkExperience}
                        />
                      </div>

                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.RelevantExperience}
                          value={data.RelevantExperience}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          error={validationError.RelevantExperience}
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("RelevantExperience", item)
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.CurrentEmployer}
                          value={data.CurrentEmployer}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          error={validationError.CurrentEmployer}
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("CurrentEmployer", item)
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelName.CurrentPosition}
                          value={data.CurrentPosition}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                          error={validationError.CurrentPosition}
                          mandatory={true}
                          onChange={(item) =>
                            handleInputChange("CurrentPosition", item)
                          }
                        />
                      </div>
                    </div>

                    <div className="ms-Grid-row">
                      {question.map((q) => (
                        <div key={q.id}>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomAutoComplete
                              label={q.question}
                              value={
                                q.questionXOptions.find(
                                  (option: any) =>
                                    option.optContentId === q.answerContentId
                                )
                                  ? {
                                      key: Number(q.answerContentId),
                                      text:
                                        q.questionXOptions.find(
                                          (option: any) =>
                                            option.optContentId ===
                                            q.answerContentId
                                        )?.optContent || "",
                                    }
                                  : null
                              }
                              options={q.questionXOptions.map((item: any) => ({
                                key: item.optContentId,
                                text: item.optContent,
                              }))}
                              onChange={(value) =>
                                handleQuestionChange(q.id, value)
                              }
                              error={questionErrors[q.id]}
                              mandatory={true}
                              disabled={
                                props.stateValue?.ButtonAction ===
                                ButtonAction.View
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomRadioGroup
                          label={labelName.Gender}
                          value={data?.Gender}
                          options={["Male", "Female"]}
                          error={validationError.Gender}
                          mandatory={true}
                          onChange={(item) => handleRadioChange("Gender", item)}
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                        />
                      </div>
                    </div>

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg6">
                        <CustomRadioGroup
                          label={labelName.previouslyworkedMine}
                          value={data?.previouslyworkedMine}
                          options={["Ivanhoe", "Zijin", "None of the above"]}
                          error={validationError.previouslyworkedMine}
                          mandatory={true}
                          onChange={(item) =>
                            handleRadioChange("previouslyworkedMine", item)
                          }
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                        />
                      </div>
                    </div>

                    {data.previouslyworkedMine != "None of the above" &&
                    data.previouslyworkedMine != "" ? (
                      <>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelName.whichOperation}
                              value={data.whichOperation}
                              disabled={
                                props.stateValue?.ButtonAction ===
                                ButtonAction.View
                              }
                              error={validationError.whichOperation}
                              mandatory={true}
                              onChange={(item) =>
                                handleInputChange("whichOperation", item)
                              }
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelName.YourRole}
                              value={data.YourRole}
                              disabled={
                                props.stateValue?.ButtonAction ===
                                ButtonAction.View
                              }
                              error={validationError.YourRole}
                              mandatory={true}
                              onChange={(item) =>
                                handleInputChange("YourRole", item)
                              }
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelName.RegionProvince}
                              value={data.RegionProvince}
                              disabled={
                                props.stateValue?.ButtonAction ===
                                ButtonAction.View
                              }
                              error={validationError.RegionProvince}
                              mandatory={true}
                              onChange={(item) =>
                                handleInputChange("RegionProvince", item)
                              }
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg7">
                        <CustomRadioGroup
                          label={labelName.familylinks}
                          value={data?.familylinks}
                          options={["Yes", "No"]}
                          error={validationError.familylinks}
                          mandatory={true}
                          onChange={(item) =>
                            handleRadioChange("familylinks", item)
                          }
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                        />
                      </div>
                    </div>

                    {data.familylinks === "Yes" ? (
                      <div>
                        {props.stateValue?.ButtonAction ===
                        ButtonAction.View ? (
                          <>
                            <div className="custom-document-column">
                              <CustomLabel value={labelName.Attachment} />
                              <div
                                className="document-wrapper"
                                title={
                                  Array.isArray(data.familyDocuments)
                                    ? data.familyDocuments.join(", ")
                                    : data.familyDocuments ?? undefined
                                }
                              >
                                <CustomViewDocument
                                  Attachment={data.familyDocuments ?? []}
                                  webUrl={props.webURL}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="ms-Grid-row"
                              style={{ marginLeft: "2px" }}
                            >
                              <CustomLabel
                                value={labelName.UploadAttachment}
                                mandatory={true}
                              />
                              <AttachmentButton
                                label="Upload"
                                iconName="CloudUpload"
                                iconNameHover="CloudUpload"
                                allowMultiple={false}
                                AttachState={(newAttachment: any) => {
                                  let attachment: IDocFiles[] =
                                    newAttachment.map((item: any) => ({
                                      name: item.name,
                                      content: item.file,
                                      type: "New",
                                      url: item.Url,
                                    }));
                                  handleDocument("familyDocuments", attachment);
                                }}
                                mandatory={true}
                                error={validationError.familyDocuments}
                                Style={{
                                  backgroundColor:
                                    ColorCode.ButtonColorCode.ButtonColor,
                                  color: "white",
                                }}
                                fileformat=".doc,.pdf,.docx"
                              />
                              <CustomViewAttachment
                                Attachment={data.familyDocuments ?? []}
                                StateValue={"familyDocuments"}
                                handleDelete={(index, fileState) =>
                                  handleDelete(index, fileState)
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}

                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg7">
                        <CustomRadioGroup
                          label={labelName.businesslinks}
                          value={data?.businesslinks}
                          options={["Yes", "No"]}
                          error={validationError.businesslinks}
                          mandatory={true}
                          onChange={(item) =>
                            handleRadioChange("businesslinks", item)
                          }
                          disabled={
                            props.stateValue?.ButtonAction === ButtonAction.View
                          }
                        />
                      </div>
                    </div>

                    {data.businesslinks === "Yes" ? (
                      <div>
                        {props.stateValue?.ButtonAction ===
                        ButtonAction.View ? (
                          <>
                            <div className="custom-document-column">
                              <CustomLabel value={labelName.Attachment} />
                              <div
                                className="document-wrapper"
                                title={
                                  Array.isArray(data.businessDocuments)
                                    ? data.businessDocuments.join(", ")
                                    : data.businessDocuments ?? undefined
                                }
                              >
                                <CustomViewDocument
                                  Attachment={data.businessDocuments ?? []}
                                  webUrl={props.webURL}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="ms-Grid-row"
                              style={{ marginLeft: "2px" }}
                            >
                              <CustomLabel
                                value={labelName.UploadAttachment}
                                mandatory={true}
                              />
                              <AttachmentButton
                                label="Upload"
                                iconName="CloudUpload"
                                iconNameHover="CloudUpload"
                                allowMultiple={false}
                                AttachState={(newAttachment: any) => {
                                  let attachment: IDocFiles[] =
                                    newAttachment.map((item: any) => ({
                                      name: item.name,
                                      content: item.file,
                                      type: "New",
                                      url: item.Url,
                                    }));
                                  handleDocument(
                                    "businessDocuments",
                                    attachment
                                  );
                                }}
                                mandatory={true}
                                error={validationError.businessDocuments}
                                Style={{
                                  backgroundColor:
                                    ColorCode.ButtonColorCode.ButtonColor,
                                  color: "white",
                                }}
                                fileformat=".doc,.pdf,.docx"
                              />
                              <CustomViewAttachment
                                Attachment={data.businessDocuments ?? []}
                                StateValue={"businessDocuments"}
                                handleDelete={(index, fileState) =>
                                  handleDelete(index, fileState)
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* </Box> */}
                  {/* <Box sx={{ mb: 2 }}> */}
                  <div style={{ padding: "1%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <LabelHeaderComponents value={"Address"} />
                      {/* <Label
                              style={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Roboto,sans-serif",
                                fontStyle: "normal",
                                fontWeight: "600",
                                marginTop: "1%",
                              }}
                            >
                             
                            </Label> */}
                    </div>
                    <div>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg3">
                          <CustomInput
                            label={labelName.AddressLine1}
                            value={data.AddressLine}
                            error={validationError.AddressLine}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleInputChange("AddressLine", item)
                            }
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                          <CustomAutoComplete
                            label={labelName.Country}
                            options={StateOption.CountryOption}
                            value={data.Country}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleAutoComplete("Country", item)
                            }
                            error={validationError.Country}
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                          <CustomAutoComplete
                            label={labelName.State}
                            options={StateOption.StateOption}
                            value={data.State}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleAutoComplete("State", item)
                            }
                            error={validationError.State}
                          />
                        </div>
                        <div className="ms-Grid-col ms-lg3">
                          <CustomAutoComplete
                            label={labelName.City}
                            options={StateOption.CityOption}
                            value={data.City}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleAutoComplete("City", item)
                            }
                            error={validationError.City}
                          />
                        </div>
                      </div>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg3">
                          <CustomInput
                            label={labelName.PostalCode}
                            value={data.PostalCode}
                            error={validationError.PostalCode}
                            disabled={
                              props.stateValue?.ButtonAction ===
                              ButtonAction.View
                            }
                            mandatory={true}
                            onChange={(item) =>
                              handleInputChange("PostalCode", item)
                            }
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Label
                          style={{
                            fontSize: "18px",
                            color: "black",
                            fontFamily: "Roboto,sans-serif",
                            fontStyle: "normal",
                            fontWeight: "600",
                            marginTop: "1%",
                          }}
                        >
                          Resume/CV and Cover Letter
                        </Label>
                      </div>
                      {props.stateValue?.ButtonAction === ButtonAction.View ? (
                        <>
                          <div className="custom-document-column">
                            <CustomLabel value={labelName.ResumeCV} />
                            <div
                              className="document-wrapper"
                              title={
                                Array.isArray(data.CandidateCV)
                                  ? data.CandidateCV.join(", ")
                                  : data.CandidateCV ?? undefined
                              }
                            >
                              <CustomViewDocument
                                Attachment={data.CandidateCV ?? []}
                                webUrl={props.webURL}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="ms-Grid-row"
                            style={{ marginLeft: "2px" }}
                          >
                            <CustomLabel
                              value={labelName.ResumeCV}
                              mandatory={true}
                            />
                            <AttachmentButton
                              label="Upload"
                              iconName="CloudUpload"
                              iconNameHover="CloudUpload"
                              allowMultiple={false}
                              AttachState={(newAttachment: any) => {
                                let attachment: IDocFiles[] = newAttachment.map(
                                  (item: any) => ({
                                    name: item.name,
                                    content: item.file,
                                    type: "New",
                                    url: item.Url,
                                  })
                                );
                                handleDocument("CandidateCV", attachment);
                              }}
                              mandatory={true}
                              error={validationError.CandidateCV}
                              Style={{
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                                color: "white",
                              }}
                              fileformat=".doc,.pdf,.docx"
                            />
                            <CustomViewAttachment
                              Attachment={data.CandidateCV ?? []}
                              StateValue={"CandidateCV"}
                              handleDelete={(index, fileState) =>
                                handleDelete(index, fileState)
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* </Box>
                    </Box>
                  </Box> */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };
  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/RecurimentProcess/UploadCandidateList", {
            state: {
              tab: props.stateValue?.tab,
              JobCode: props.stateValue?.JobCode,
              JobCodeId: props.stateValue?.JobCodeId,
              JobTitle: props.stateValue?.JobTitle,
            },
          });
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

  const back_fn = () => {
    setIsLoading(true);
    props.navigation("/RecurimentProcess/UploadCandidateList", {
      state: {
        tab: props.stateValue?.tab,
        JobCode: props.stateValue?.JobCode,
        JobCodeId: props.stateValue?.JobCodeId,
        JobTitle: props.stateValue?.JobTitle,
      },
    });
    setIsLoading(false);
  };

  const Validation = (): boolean => {
    let errors = {
      Title: false,
      FirstName: false,
      MiddleName: false,
      LastName: false,
      DOB: false,
      PhoneNumber: false,
      AlternativePhoneNumber: false,
      Nationality: false,
      ProofOfIdentity: false,
      IdentityNumber: false,
      Gender: false,
      Email: false,
      HighestEducation: false,
      WorkExperience: false,
      RelevantExperience: false,
      CandidateCV: false,
      AddressLine: false,
      Country: false,
      State: false,
      City: false,
      PostalCode: false,

      NumberOftax: false,
      CurrentEmployer: false,
      CurrentPosition: false,
      WillingToRelocate: false,
      previouslyworkedMine: false,
      familylinks: false,
      businesslinks: false,
      familyDocuments: false,
      businessDocuments: false,
      whichOperation: false,
      YourRole: false,
      RegionProvince: false,
    };

    errors.Title = !IsValid(data.Title.text);
    errors.FirstName = !IsValid(data.FirstName);
    // errors.MiddleName = !IsValid(data.MiddleName);
    errors.LastName = !IsValid(data.LastName);
    errors.DOB = !IsValid(data.DOB);
    errors.PhoneNumber = !IsValid(data.PhoneNumber);
    // errors.AlternativePhoneNumber = !IsValid(data.AlternativePhoneNumber);
    errors.Nationality = !IsValid(data.Nationality.text);
    errors.ProofOfIdentity = !IsValid(data.ProofOfIdentity.text);
    errors.IdentityNumber = !IsValid(data.IdentityNumber);
    errors.Gender = !IsValid(data.Gender);
    errors.Email = !IsValid(data.Email);
    errors.HighestEducation = !IsValid(data.HighestEducation.text);
    errors.WorkExperience = !IsValid(data.WorkExperience.text);
    errors.RelevantExperience = !IsValid(data.RelevantExperience);
    errors.CandidateCV = !IsValid(data.CandidateCV);

    errors.Country = !IsValid(data.Country.text);
    errors.AddressLine = !IsValid(data.AddressLine);
    errors.State = !IsValid(data.State.text);
    errors.City = !IsValid(data.City.text);
    errors.PostalCode = !IsValid(data.PostalCode);

    // errors.NumberOftax = !IsValid(data.NumberOftax);
    errors.CurrentEmployer = !IsValid(data.CurrentEmployer);
    errors.CurrentPosition = !IsValid(data.CurrentPosition);
    // errors.WillingToRelocate = !IsValid(data.WillingToRelocate);
    errors.previouslyworkedMine = !IsValid(data.previouslyworkedMine);
    if (data.previouslyworkedMine != "None of the above") {
      errors.whichOperation = !IsValid(data.whichOperation);
      errors.YourRole = !IsValid(data.YourRole);
      errors.RegionProvince = !IsValid(data.RegionProvince);
    }
    errors.familylinks = !IsValid(data.familylinks);
    errors.businesslinks = !IsValid(data.businesslinks);
    if (data.familylinks === "Yes") {
      errors.familyDocuments = !IsValid(data.familyDocuments);
    }
    if (data.businesslinks === "Yes") {
      errors.businessDocuments = !IsValid(data.businessDocuments);
    }
    const error: { [key: number]: boolean } = {};
    question.forEach((q) => {
      if (!q.answerContentId) {
        error[q.id] = !IsValid(q.answerContentId);
      }
    });
    setquestionErrors(error);

    setValidationError((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  async function submit_fn() {
    try {
      // console.log(data.CountryCode, "CountryCode");

      setIsLoading(true);
      const isValid = !Validation();
      if (isValid) {
        let profileAddress: ProfileAddress = {
          address1: data.AddressLine,
          address2: data.AddressLine,
          cityId: String(data.City.key),
          stateId: String(data.State.key),
          countryId: String(data.Country.key),
          postalZipCode: data.PostalCode,
        };
        let DOBformatted = moment(data.DOB).format("YYYY-MM-DD");
        const isoDate = DOBformatted;
        const workExperienceText = data.WorkExperience.text;
        const workExperienceRange = workExperienceText.split(" ")[0];
        const todaydate = new Date();
        let todatDateformatted = moment(todaydate).format("YYYY-MM-DD");
        const istoday = todatDateformatted;
        let ProfileDetailsExperience: ProfileDetailsExperience = {
          profileId: 0,
          title: data.CurrentPosition,
          roleDescription: data.CurrentPosition,
          company: data.CurrentEmployer,
          location: "",
          startFrom: String(istoday),
          endTo: String(istoday),
        };

        let profileXOptAnswers: profileXOptAnswers[] = question.map((item) => {
          return {
            profileId: "0",
            questionId: Number(item.questionId),
            answerContentId: item.answerContentId,
          };
        });
        let profileDetailEmploymentHistory: profileDetailEmploymentHistory = {
          referralSourceId: "RS24",
          previousExpatStatus: 0,
          previousEmployer: "",
          expatWorkDuration: "",
          hasIvanhoeZijinExperienceId:
            data.previouslyworkedMine === "None of the above"
              ? "3"
              : data.previouslyworkedMine === "Zijin"
              ? "2"
              : "1",
          workedOperation: data.whichOperation,
          workRole: data.YourRole,
          territory: data.RegionProvince,
        };

        let Obj: UpsertProfile = {
          contactNumber1: String(data.CountryCode) + String(data.PhoneNumber),
          contactNumber2:
            String(data.CountryCode) + String(data.AlternativePhoneNumber),
          dob: String(isoDate),
          documentId: null,
          educationId: String(data.HighestEducation.key),
          email: data.Email,
          firstName: data.FirstName,
          genderId: data.Gender,
          identityTypeId: String(data.ProofOfIdentity.key),
          identityValue: data.IdentityNumber,
          jobsApplied: [],
          lastName: data.LastName,
          middleName: data.MiddleName,
          nationalityId: String(data.Nationality.key),
          profileAddress: profileAddress,
          profileDetailDisciplines: [],
          profileDetailDisclosure: null,
          profileDetailEducations: [],
          profileDetailEmploymentHistory: profileDetailEmploymentHistory,
          profileDetailExperiences: [ProfileDetailsExperience],
          profileDetailLanguages: [],
          profileDetailSkills: [],
          profileId: 0,
          profileXAgent: null,
          profileXOptAnswers: profileXOptAnswers,
          profileXTxtAnswers: [],
          releventExperience: Number(data.RelevantExperience),
          title: String(data.Title.key),
          totalYearOfExperiance: workExperienceRange,
          profileDetailAttachments: [],
          hasBusinessLinks: data.businesslinks === "Yes" ? "1" : "0",
          hasEmployeeRelation: data.familylinks === "Yes" ? "1" : "0",
        };
        let CheckJobs: CheckMyCandidate = {
          Email: data.Email,
          JobCode: props.stateValue?.JobCode,
        };
        const CheckMyCandidateAppliedJobs =
          await GetPortalJobsService.CheckMyCandidateAppliedJobs(CheckJobs);
        if (CheckMyCandidateAppliedJobs.status === ResponeStatus.SUCCESS) {
          // console.log(
          //   CheckMyCandidateAppliedJobs,
          //   "CheckMyCandidateAppliedJobs"
          // );

          if (CheckMyCandidateAppliedJobs.data.pending) {
            const ValidationMsg = {
              Message: RecuritmentHRMsg.ValidationMsg,
              Type: HRMSAlertOptions.Warning,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  // props.navigation("/RecurimentProcess/UploadCandidateList", {
                  //   state: {
                  //     tab: props.stateValue?.tab,
                  //   },
                  // });
                  setAlertPopupOpen(false);
                }
              },
            };
            setAlertPopupOpen(true);
            setalertProps(ValidationMsg);
            setIsLoading(false);
          } else {
            let Documents: UpsertDocument = {
              CandidateCV: data.CandidateCV ?? [],
              familyLink: data.familyDocuments ?? [],
              businessLink: data.businessDocuments ?? [],
            };
            const response = await GetPortalJobsService.UpsertProfile(
              Obj,
              Documents,
              props.stateValue?.JobCode
            );
            if (response.status === ResponeStatus.SUCCESS) {
              const SuccessMsg = {
                Message: RecuritmentHRMsg.UploadMsg,
                Type: HRMSAlertOptions.Success,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    props.navigation("/RecurimentProcess/UploadCandidateList", {
                      state: {
                        tab: props.stateValue?.tab,
                        JobCode: props.stateValue?.JobCode,
                        JobCodeId: props.stateValue?.JobCodeId,
                        JobTitle: props.stateValue?.JobTitle,
                      },
                    });
                    setAlertPopupOpen(false);
                  }
                },
              };
              setAlertPopupOpen(true);
              setalertProps(SuccessMsg);
              setIsLoading(false);
            } else {
              const APIError = {
                Message: RecuritmentHRMsg.APIErrorMsg,
                Type: HRMSAlertOptions.Error,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    // props.navigation("/RecurimentProcess/UploadCandidateList", {
                    //   state: {
                    //     tab: props.stateValue?.tab,
                    //     JobCode: props.stateValue?.JobCode,
                    //     JobCodeId: props.stateValue?.JobCodeId,
                    //     JobTitle: props.stateValue?.JobTitle,
                    //   },
                    // });
                    setAlertPopupOpen(false);
                  }
                },
              };
              setAlertPopupOpen(true);
              setalertProps(APIError);
              setIsLoading(false);
            }
          }
        } else {
          const APIError = {
            Message: RecuritmentHRMsg.APIErrorMsg,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                // props.navigation("/RecurimentProcess/UploadCandidateList", {
                //   state: {
                //     tab: props.stateValue?.tab,
                //     JobCode: props.stateValue?.JobCode,
                //     JobCodeId: props.stateValue?.JobCodeId,
                //     JobTitle: props.stateValue?.JobTitle,
                //   },
                // });
                setAlertPopupOpen(false);
              }
            },
          };
          setAlertPopupOpen(true);
          setalertProps(APIError);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
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
            handleCancel={handleCancel}
            JobValue={{
              JobTitle: props.stateValue?.JobTitle ?? "",
              JobCode: props.stateValue?.JobCode,
              Status: "",
            }}
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
                      label: "Submit",
                      onClick: () => {
                        void submit_fn();
                      },
                    },
                  ]
            }
          />
        </div>
      </CustomLoader>
      {AlertPopupOpen && (
        <CustomAlert
          {...alertProps}
          onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
        />
      )}
    </>
  );
};

export default UploadCandidateCV;
