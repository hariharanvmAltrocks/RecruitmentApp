import * as React from "react";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { HRMSAlertOptions, RecuritmentHRMsg } from "../../utilities/Config";
import { ScoreCardData } from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import CustomInput from "../../components/CustomInput";
import CustomLabel from "../../components/CustomLabel";
import CustomRatingStar from "../../components/CustomRatingStar";

type ValidationError = {
    Qualifications: boolean;
    Experience: boolean;
    Knowledge: boolean;
    Energylevel: boolean;
    Requirements: boolean;
    contributeculture: boolean;
    ExpatExperienceCongolese: boolean;
    CriteriaRecognised: boolean;
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
        Qualifications: 0,
        Experience: 0,
        Knowledge: 0,
        Energylevel: 0,
        Requirements: 0,
        contributeculture: 0,
        ExpatExperienceCongolese: 0,
        CriteriaRecognised: 0,
        CandidateCVDoc: []
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
        value: any
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
        } = CandidateData;

        ValidationError.Qualifications = !IsValid(Qualifications);
        ValidationError.Experience = !IsValid(Experience);
        ValidationError.Knowledge = !IsValid(Knowledge);
        ValidationError.Energylevel = !IsValid(Energylevel);
        ValidationError.Requirements = !IsValid(Requirements);
        ValidationError.contributeculture = !IsValid(contributeculture);
        ValidationError.ExpatExperienceCongolese = !IsValid(ExpatExperienceCongolese);
        ValidationError.CriteriaRecognised = !IsValid(CriteriaRecognised);



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
                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Applicant name"
                                    value={CandidateData.FullName}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, FullName: value }))
                                    }
                                />

                            </div>

                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Applicant surname"
                                    value={CandidateData.LastName}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, LastName: value }))
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
                                        setCandidateData((prevState) => ({ ...prevState, Nationality: value }))
                                    }
                                />

                            </div>



                        </div>

                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Gender and age"
                                    value={CandidateData.Gender}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, PassportID: value }))
                                    }
                                />
                            </div>

                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Highest relevant qualification"
                                    value={CandidateData.Qualification}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, Qualification: value }))
                                    }
                                />
                            </div>
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="experiences in mining industry (years)"
                                    value={CandidateData.TotalYearOfExperiance}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                    }
                                />
                            </div>

                        </div>

                        <div className="ms-Grid-row">

                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="experiences in related field (years)"
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
                                    label="Date interviewed"
                                    value={CandidateData.ContactNumber}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, ContactNumber: value }))
                                    }
                                />

                            </div>

                        </div>

                        {/* <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Qualification"
                                    value={CandidateData.Qualification}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, Qualification: value }))
                                    }
                                />

                            </div>
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="ReleventExperience"
                                    value={CandidateData.Qualification}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, Qualification: value }))
                                    }
                                />
                            </div>
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="Skills"
                                    value={CandidateData.Skills}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, Skills: value }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="TotalYearOfExperiance"
                                    value={CandidateData.TotalYearOfExperiance}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                    }
                                />

                            </div>
                            <div className="ms-Grid-col ms-lg4">
                                <CustomTextArea
                                    label="Residential Address"
                                    value={CandidateData.ResidentialAddress}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) => setCandidateData((prevState) => ({ ...prevState, ResidentialAddress: value }))}
                                    error={false} />

                            </div>
                            <div className="ms-Grid-col ms-lg4">
                                <CustomInput
                                    label="TotalYearOfExperiance"
                                    value={CandidateData.ResidentialAddress}
                                    disabled={true}
                                    mandatory={false}
                                    onChange={(value) =>
                                        setCandidateData((prevState) => ({ ...prevState, TotalYearOfExperiance: value }))
                                    }
                                />

                            </div>

                        </div> */}
                        {/* <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3">
                                {CandidateData.CandidateCVDoc?.map((attachment: any) => (
                                    <div key={attachment.content}>
                                        <CustomLabel value={"Resume "} mandatory={true} />
                                        <p style={{ marginTop: "1%" }}>
                                            <a href={attachment.content} target="_blank" rel="noopener noreferrer">
                                                {attachment.name}
                                            </a>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        <div style={{ marginTop: "3%" }}>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Qualifications (relevant)"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">

                                    <CustomRatingStar
                                        value={CandidateData.Qualifications}
                                        onChange={(value) => handleRadioChange(
                                            "Qualifications",
                                            value
                                        )}
                                        error={ValidationError.Qualifications}
                                    />
                                </div>
                                <div className="ms-Grid-row">

                                </div>
                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Experience (relevant)"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.Experience}
                                        onChange={(value) => handleRadioChange(
                                            "Experience",
                                            value
                                        )}
                                        error={ValidationError.Experience}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Knowledge"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.Knowledge}
                                        onChange={(value) => handleRadioChange(
                                            "Knowledge",
                                            value
                                        )}
                                        error={ValidationError.Knowledge}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Energy level"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.Energylevel}
                                        onChange={(value) => handleRadioChange(
                                            "Energylevel",
                                            value
                                        )}
                                        error={ValidationError.Energylevel}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Meets all job requirements"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.Requirements}
                                        onChange={(value) => handleRadioChange(
                                            "Requirements",
                                            value
                                        )}
                                        error={ValidationError.Requirements}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Will contribute to the culture required"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.contributeculture}
                                        onChange={(value) => handleRadioChange(
                                            "contributeculture",
                                            value
                                        )}
                                        error={ValidationError.contributeculture}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Expat Experience / Congolese"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.ExpatExperienceCongolese}
                                        onChange={(value) => handleRadioChange(
                                            "ExpatExperienceCongolese",
                                            value
                                        )}
                                        error={ValidationError.ExpatExperienceCongolese}
                                    />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg4">
                                    <CustomLabel value={"Others Criteria Recognised by Panel"} mandatory={true} />
                                </div>

                                <div className="ms-Grid-col ms-lg4">
                                    <CustomRatingStar
                                        value={CandidateData.CriteriaRecognised}
                                        onChange={(value) => handleRadioChange(
                                            "CriteriaRecognised",
                                            value
                                        )}
                                        error={ValidationError.CriteriaRecognised}
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