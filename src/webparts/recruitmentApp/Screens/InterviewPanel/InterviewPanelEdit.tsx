import * as React from "react";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { EmploymentOption, HRMSAlertOptions, RecuritmentHRMsg, ScoreRanking } from "../../utilities/Config";
import { ScoreCardData } from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomTextArea from "../../components/CustomTextArea";

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
}

const InterviewPanelEdit = (props: any) => {
    console.log(props, "ReviewProfile");

    const [CandidateData, setCandidateData] = React.useState<ScoreCardData>({
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
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [alertProps, setalertProps] = React.useState<alertPropsData>({
        Message: "",
        Type: "",
        ButtonAction: null,
        visible: false,
    });
    const [ValidationError, setValidationError] = React.useState<ValidationError>({
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
    })


    const fetchCandidateData = async (ID: number) => {
        setIsLoading(true);
        try {

            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "ID",
                Operator: "eq",
                FilterValue: ID
            });
            const data = await getVRRDetails.GetInterviewPanelCandidateDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                console.log(data.data, "GetVacancyDetails");
                const op = data.data[0]
                setCandidateData((prevState) => ({
                    ...prevState,
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
                    CandidateCVDoc: op?.CandidateCVDoc
                }));

            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);

    };


    React.useEffect(() => {
        const fetchData = async () => {
            await fetchCandidateData(props.stateValue?.ID)
        };

        void fetchData();
    }, []);


    const handleRadioChange = async (
        key: keyof ScoreCardData,
        value: string
    ) => {
        if (value) {
            setCandidateData((prevState) => ({
                ...prevState,
                [key]: value,
            }));
            setValidationError((prevState) => ({
                ...prevState,
                [key]: false,
            }))
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
            }))
        }
    };

    const handletextArea = async (
        key: keyof ScoreCardData,
        value: string
    ) => {
        if (value) {
            setCandidateData((prevState) => ({
                ...prevState,
                [key]: value,
            }));
            setValidationError((prevState) => ({
                ...prevState,
                [key]: false,
            }))
        }
    };

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
            EvaluationFeedback
        } = CandidateData;

        ValidationError.Qualifications = !IsValid(Qualifications.text);
        ValidationError.Experience = !IsValid(Experience.text);
        ValidationError.Knowledge = !IsValid(Knowledge.text);
        ValidationError.Energylevel = !IsValid(Energylevel.text);
        ValidationError.Requirements = !IsValid(Requirements.text);
        ValidationError.contributeculture = !IsValid(contributeculture.text);
        ValidationError.ExpatExperienceCongolese = !IsValid(ExpatExperienceCongolese.text);
        ValidationError.CriteriaRecognised = !IsValid(CriteriaRecognised.text);
        ValidationError.Employment = !IsValid(Employment);
        ValidationError.EvaluationFeedback = !IsValid(EvaluationFeedback);




        setValidationError((prevState) => ({
            ...prevState,
            ...ValidationError,
        }));

        return Object.values(ValidationError).some((error) => error);
    };

    const Submit_fn = async () => {
        let Valid = !Validation();
        console.log(Valid, "Valid");
        const obj = {
            JobCode: CandidateData?.JobCode,
            JobCodeId: CandidateData?.JobCodeId,
            PassportID: CandidateData?.PassportID,
            FullName: CandidateData?.FullName,
            ResidentialAddress: CandidateData?.ResidentialAddress,
            DOB: CandidateData?.DOB,
            ContactNumber: CandidateData?.ContactNumber,
            Email: CandidateData?.Email,
            Nationality: CandidateData?.Nationality,
            Gender: CandidateData?.Gender,
            TotalYearOfExperiance: CandidateData?.TotalYearOfExperiance,
            Skills: CandidateData?.Skills,
            LanguageKnown: CandidateData?.LanguageKnown,
            ReleventExperience: CandidateData?.ReleventExperience,
            Qualification: CandidateData?.Qualification,
            Qualifications: CandidateData?.Qualifications,
            Experience: CandidateData?.Experience,
            Knowledge: CandidateData?.Knowledge,
            Energylevel: CandidateData?.Energylevel,
            Requirements: CandidateData?.Requirements,
            contributeculture: CandidateData?.contributeculture,
            ExpatExperienceCongolese: CandidateData?.ExpatExperienceCongolese,
            CriteriaRecognised: CandidateData?.CriteriaRecognised,
        }
        console.log("obj", obj);

    }

    const tabs = [
        {
            label: "Assign Interview Panel",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <div>
                        <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                            <LabelHeaderComponents value={"Position Details"} />
                        </div>
                        <div className="menu-card">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Position Title"
                                        value={CandidateData.TotalYearOfExperiance}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                        }
                                    />

                                </div>
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Job Grade"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                            <LabelHeaderComponents value={"Candidate Details"} />
                        </div>
                        <div className="menu-card">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Candidate ID"
                                        value={CandidateData.TotalYearOfExperiance}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                        }
                                    />

                                </div>
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Applicant Name"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />

                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Applicant Surname"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Nationality"
                                        value={CandidateData.TotalYearOfExperiance}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                        }
                                    />

                                </div>
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Gender and Age"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />

                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Highest Relevant Qualification"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Experiance in Mining Industry (Years)"
                                        value={CandidateData.TotalYearOfExperiance}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                        }
                                    />

                                </div>
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Experiance in related field (Years)"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />

                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomInput
                                        label="Date of interview"
                                        value={CandidateData.ContactNumber}
                                        disabled={true}
                                        mandatory={false}
                                        onChange={(value) =>
                                            setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                            <LabelHeaderComponents value={"Candidate Evaluation"} />
                        </div>
                        <div className="menu-card">
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Qualifications (Relevant)"
                                        value={CandidateData.Qualifications}
                                        options={ScoreRanking}
                                        onChange={(value) => handleAutoComplete(
                                            "Qualifications",
                                            value
                                        )}
                                        mandatory={true}
                                        error={ValidationError.Qualifications}
                                        disabled={false} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Experience (Relevant)"
                                        value={CandidateData.Experience}
                                        options={ScoreRanking}
                                        onChange={(value) => handleAutoComplete(
                                            "Experience",
                                            value
                                        )}
                                        error={ValidationError.Experience}
                                        mandatory={true} disabled={false} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Knowledge"
                                        value={CandidateData.Knowledge}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "Knowledge",
                                            value
                                        )}
                                        error={ValidationError.Knowledge} disabled={false} />
                                </div>

                            </div>
                            <div className="ms-Grid-row">

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Energy Level"
                                        value={CandidateData.Energylevel}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "Energylevel",
                                            value
                                        )}
                                        error={ValidationError.Energylevel} disabled={false} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Meets All Job Requirements"
                                        value={CandidateData.Requirements}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "Requirements",
                                            value
                                        )}
                                        error={ValidationError.Requirements} disabled={false} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Will Contribute to the Culture Required"
                                        value={CandidateData.contributeculture}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "contributeculture",
                                            value
                                        )}
                                        error={ValidationError.contributeculture} disabled={false} />
                                </div>

                            </div>

                            <div className="ms-Grid-row">

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Expat Experience/Congolese"
                                        value={CandidateData.ExpatExperienceCongolese}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "ExpatExperienceCongolese",
                                            value
                                        )}
                                        error={ValidationError.ExpatExperienceCongolese} disabled={false} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomAutoComplete
                                        label="Other Criteria Recognized by the Panel"
                                        value={CandidateData.CriteriaRecognised}
                                        options={ScoreRanking}
                                        mandatory={true}
                                        onChange={(value) => handleAutoComplete(
                                            "CriteriaRecognised",
                                            value
                                        )}
                                        error={ValidationError.CriteriaRecognised} disabled={false} />
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
                                        onChange={(value) => handleRadioChange(
                                            "Employment",
                                            value
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                                <div className="ms-grid-col ms-lg10">
                                    <CustomTextArea
                                        label="Evaluation Feedback"
                                        value={CandidateData?.EvaluationFeedback}
                                        error={ValidationError.EvaluationFeedback}
                                        mandatory={true}
                                        onChange={(value) => handletextArea(
                                            "EvaluationFeedback",
                                            value
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ),
        },
    ];

    const handleCancel = () => {
        setIsLoading(true);
        let CancelAlert = {
            Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
            Type: HRMSAlertOptions.Confirmation,
            Notes: "Once status changes, You cannot revert back",
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                    props.navigation("/InterviewPanelList");
                    setAlertPopupOpen(false);
                } else {
                    setAlertPopupOpen(false);
                }
            }
        }

        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
        setIsLoading(false);

    };



    return (
        <>
            <CustomLoader isLoading={isLoading}>
                <div className="menu-card">
                    <React.Fragment>
                        <TabsComponent
                            tabs={tabs}
                            initialTab="tab1"
                            tabClassName={"Tab"}
                            handleCancel={handleCancel}
                            additionalButtons={[
                                {
                                    label: "Submit",
                                    onClick: async () => {
                                        await Submit_fn();
                                    }
                                },
                            ]}
                        />
                        {console.log(props.masterData, "masterDataDetails")}
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
            ) : <></>}
        </>


    )
}
export default InterviewPanelEdit;