import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CandidateData } from "../Models/RecuritmentVRR";
import { getVRRDetails } from "../Services/ServiceExport";
import TitleHeader from "./TitleHeader";
//import Labelheader from "./LabelHeader";
//import LabelValue from "./LabelValue";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";
import CustomLabel from "./CustomLabel";
import CustomTextArea from "./CustomTextArea";
import CustomRadioGroup from "./CustomRadioGroup";
import ReuseButton from "./ReuseButton";
import { Checkbox } from "@fluentui/react";
import CustomInput from "./CustomInput";

type Props = {
  ID: number;
  Shortlists_fn: () => void;
  Rejected_fn: () => void;
  back_fn: () => void;
};

const ReiewProfilePopup: React.FC<Props> = ({
  ID,
  Shortlists_fn,
  Rejected_fn,
  back_fn,
}) => {
  // const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  // const [alertProps, setalertProps] = React.useState<alertPropsData>({
  //     Message: "",
  //     Type: "",
  //     ButtonAction: null,
  //     visible: false,
  // });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<CandidateData>({
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
    CandidateCVDoc: [],
    //RoleProfileDocument: [],
    //AdvertisementDocument: [],
  });
  const [Comments, setComment] = useState<string>("");
  const [validationErrors, setValidationErrors] = React.useState<{
    Comments: boolean;
  }>({
    Comments: false,
  });

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: ID,
        },
      ];
      const Conditions = "";
      const response = await getVRRDetails.GetCandidateDetails(
        filterConditions,
        Conditions
      );
      if (response.status === 200 && response.data !== null) {
        const op = response.data[0];
        console.log(op, "opopopopop");

        setFormState((prevState) => ({
          ...prevState,
          JobCode: op?.JobCode,
          JobCodeId: op?.JobCodeId,
          PassportID: op?.PassportID,
          FullName: op?.FullName,
          LastName: op?.LastName,
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
          RoleProfileDocment: op?.RoleProfileDocment,
          AdvertismentDocment: op?.AdvertismentDocment,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchData();
  }, []);

  const handleSelect = async () =>
    // tab: keyof TabData,
    // key: keyof Tab1details | keyof Tab2details,
    // item: any | null
    {
      // if (item) {
      //     setData((prevState) => ({
      //         ...prevState,
      //         [tab]: {
      //             ...prevState[tab],
      //             [key]: item,
      //         },
      //     }));
      //     setValidationError((prevState) => ({
      //         ...prevState,
      //         [tab]: {
      //             ...prevState,
      //             [key]: false,
      //         },
      //     }))
      // }
    };

  const handleRadioChange = async () =>
    // tab: keyof TabData,
    // key: keyof Tab1details | keyof Tab2details,
    // item: any | null
    {
      // if (item) {
      //     setData((prevState) => ({
      //         ...prevState,
      //         [tab]: {
      //             ...prevState[tab],
      //             [key]: item,
      //         },
      //     }));
      //     setValidationError((prevState) => ({
      //         ...prevState,
      //         [tab]: {
      //             ...prevState,
      //             [key]: false,
      //         },
      //     }))
      // }
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
      label: "Review Profile",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6">
                  <TitleHeader value="Candidate Details" />
                </div>
              </div>
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
              <div className="ms-Grid-row">
                {/* <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="JobCode" />
                  <LabelValue value={formState.JobCode} />
                </div> */}
                {/* <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Passport ID" />
                  <LabelValue v
                  alue={formState.PassportID} />
                </div> */}
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
                    value={formState.Gender}
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
              </div>
              {/* <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="DOB" />
                  <LabelValue value={formState.DOB} />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Email" />
                  <LabelValue value={formState.Email} />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Contact Number" />
                  <LabelValue value={formState.ContactNumber} />
                </div> */}
              <div className="ms-Grid-row">
                {" "}
                <div className="ms-Grid-col ms-lg6">
                  <TitleHeader value="Attachments" />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  {formState.CandidateCVDoc?.map((attachment: any) => (
                    <div key={attachment.content}>
                      <CustomLabel
                        value={"Candidate Resume"}
                        mandatory={true}
                      />
                      <p style={{ marginTop: "1%" }}>
                        <a
                          href={attachment.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.name}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="ms-Grid-col ms-lg4">
                  {formState.CandidateCVDoc?.map((attachment: any) => (
                    <div key={attachment.content}>
                      <CustomLabel
                        value={"Role Profile Document"}
                        mandatory={false}
                      />
                      <p style={{ marginTop: "1%" }}>
                        <a
                          href={attachment.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.name}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="ms-Grid-col ms-lg4">
                  {formState.CandidateCVDoc?.map((attachment: any) => (
                    <div key={attachment.content}>
                      <CustomLabel
                        value={"Advertisement Document"}
                        mandatory={false}
                      />
                      <p style={{ marginTop: "1%" }}>
                        <a
                          href={attachment.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.name}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6">
                  <CustomRadioGroup
                    label="Is the Candidate suits for the vaccancy position: "
                    value={"Yes"}
                    options={["Yes", "No", "Waiting List"]}
                    error={false}
                    mandatory={false}
                    onChange={(item) => handleRadioChange()}
                  />
                </div>
                <div className="ms-Grid-col ms-lg6"></div>
                {/* <div className="ms-Grid-col ms-lg"></div> */}
              </div>
              {/* <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Languages Known" />
                  <LabelValue value={formState?.LanguageKnown} />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Skills" />
                  <LabelValue value={formState.Skills} />
                </div> */}

              <div className="ms-Grid-row">
                {/* <div className="ms-Grid-col ms-lg3">
                  <Labelheader value="Residential Address" />
                  <LabelValue value={formState.ResidentialAddress} />
                </div> */}
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
                  className="ms-Grid-col ms-lg9"
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
              <div className="ms-Grid-row"></div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg9">
                  <Checkbox
                    key={"agree-checkbox"}
                    label={"I hereby agree for submitting this request"}
                    checked={true}
                    onChange={() => handleSelect()}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <TabsComponent
            tabs={tabs}
            initialTab="tab1"
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
                  Shortlists_fn();
                },
              },
              // {
              //   label: "Rejected",
              //   onClick: async () => {
              //     Rejected_fn();
              //   },
              // },
            ]}
          />
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

export default ReiewProfilePopup;
