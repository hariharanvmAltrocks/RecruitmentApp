import * as React from "react";
import { useState, } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CandidateData } from "../Models/RecuritmentVRR";
import { getVRRDetails } from "../Services/ServiceExport";
import TitleHeader from "./TitleHeader";
import Labelheader from "./LabelHeader";
import LabelValue from "./LabelValue";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";
import CustomLabel from "./CustomLabel";

type Props = {
    ID: number;
    Shortlists_fn: () => void;
    Rejected_fn: () => void;
    back_fn: () => void;
}


const ReiewProfilePopup: React.FC<Props> = ({ ID, Shortlists_fn, Rejected_fn, back_fn }) => {
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
        CandidateCVDoc: []
    });
    // const [validationErrors, setValidationError] = React.useState<formValidation>({
    //     AssignRecruitmentHR: false,
    //     AssignAgencies: false,
    //     Comments: false
    // })

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
            const response = await getVRRDetails.GetCandidateDetails(filterConditions, Conditions);
            if (response.status === 200 && response.data !== null) {
                const op = response.data[0]
                console.log(op, "opopopopop");

                setFormState((prevState) => ({
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
            console.error("Failed to fetch Vacancy Details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        void fetchData();
    }, []);


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
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="JobCode" />
                                    <LabelValue value={formState.JobCode} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Nationality" />
                                    <LabelValue value={formState.Nationality} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Name" />
                                    <LabelValue value={formState.FullName} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="PassportID" />
                                    <LabelValue value={formState.PassportID} />
                                </div>

                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="DOB" />
                                    <LabelValue value={formState.DOB} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Email" />
                                    <LabelValue value={formState.Email} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Gender" />
                                    <LabelValue value={formState.Gender} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="ContactNumber" />
                                    <LabelValue value={formState.ContactNumber} />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="LanguageKnown" />
                                    <LabelValue value={formState?.LanguageKnown} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Qualification" />
                                    <LabelValue value={formState?.Qualification} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="ReleventExperience" />
                                    <LabelValue value={formState?.ReleventExperience} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Skills" />
                                    <LabelValue value={formState.Skills} />
                                </div>
                            </div>

                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="TotalYearOfExperiance" />
                                    <LabelValue value={formState.TotalYearOfExperiance} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="Type of Contract" />
                                    <LabelValue value={formState.ResidentialAddress} />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                    <Labelheader value="TotalYearOfExperiance" />
                                    <LabelValue value={formState.TotalYearOfExperiance} />
                                </div>

                            </div>
                            <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                    {formState.CandidateCVDoc?.map((attachment: any) => (
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
                                label: "BACK",
                                onClick: async () => {
                                    back_fn();
                                }
                            },
                            {
                                label: "Shrotlist",
                                onClick: async () => {
                                    Shortlists_fn();
                                }
                            },
                            {
                                label: "Reject",
                                onClick: async () => {
                                    Rejected_fn();
                                }
                            }
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

