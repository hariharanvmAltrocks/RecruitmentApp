import * as React from "react";
import { alertPropsData, AutoCompleteItem } from "../Models/Screens";
import CustomLoader from "../Services/Loader/CustomLoader";
import TabsComponent from "./TabsComponent ";
import Card from "@mui/material/Card";
import IsValid from "./Validation";
import CustomAutoComplete from "./CustomAutoComplete";
import CustomDatePicker from "./CustomDatePicker";
import CustomTextArea from "./CustomTextArea";
import CustomRadioGroup from "./CustomRadioGroup";
import CustomInput from "./CustomInput";
import { getVRRDetails } from "../Services/ServiceExport";
import CustomAlert from "./CustomAlert/CustomAlert";
import { HRMSAlertOptions, RecuritmentHRMsg } from "../utilities/Config";


type TabData = {
    tab1: Tab1details;
    tab2: Tab2details;
};

type Tab1details = {
    Jobcode: AutoCompleteItem;
    PositionID: number;
    Nationality: string;
    EmploymentCatagory: string;
    Department: AutoCompleteItem;
};

type Tab2details = {
    Section: AutoCompleteItem,
    ReasonForVancancy: string,
    BusinessUnitCode: AutoCompleteItem,
    DepartmentCode: AutoCompleteItem,
    DateRequried: Date | null,
};

type TabValidation = {
    tab1: Tab1Validation;
    tab2: Tab2Validation;
}

type Tab1Validation = {
    Jobcode: boolean;
    PositionID: boolean;
    Nationality: boolean;
    EmploymentCatagory: boolean;
    Department: boolean;
};

type Tab2Validation = {
    Section: boolean,
    ReasonForVancancy: boolean,
    BusinessUnitCode: boolean,
    DepartmentCode: boolean,
    DateRequried: boolean,
};


const CommanTemplate = (props: any) => {
    const [data, setData] = React.useState<TabData>({
        tab1: {
            Jobcode: { key: 0, text: "" },
            PositionID: 0,
            Nationality: "",
            EmploymentCatagory: "",
            Department: { key: 0, text: "" },
        },
        tab2: {
            Section: { key: 0, text: "" },
            ReasonForVancancy: "",
            BusinessUnitCode: { key: 0, text: "" },
            DepartmentCode: { key: 0, text: "" },
            DateRequried: null,
        }
    });
    const [validationErrors, setValidationError] = React.useState<TabValidation>({
        tab1: {
            Jobcode: false,
            PositionID: false,
            Nationality: false,
            EmploymentCatagory: false,
            Department: false,
        },
        tab2: {
            Section: false,
            ReasonForVancancy: false,
            BusinessUnitCode: false,
            DepartmentCode: false,
            DateRequried: false,
        }
    })
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [fetchDatas, setFetchData] = React.useState<any[]>([]);
    const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
    const [alertProps, setalertProps] = React.useState<alertPropsData>({
        Message: "",
        Type: "",
        ButtonAction: null,
        visible: false,
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "VRRID",
                Operator: "eq",
                FilterValue: props.stateValue?.VRRID
            });
            const data = await getVRRDetails.GetVacancyDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                setFetchData(data.data);
                console.log(fetchDatas, "fetchDatas");
            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);
    };


    React.useEffect(() => {
        void fetchData();
    }, []);

    const handleAutoComplete = async (
        tab: keyof TabData,
        key: keyof Tab1details | keyof Tab2details,
        item: AutoCompleteItem | null
    ) => {
        if (item) {
            setData((prevState) => ({
                ...prevState,
                [tab]: {
                    ...prevState[tab],
                    [key]: item,
                },
            }));
            setValidationError((prevState) => ({
                ...prevState,
                [tab]: {
                    ...prevState,
                    [key]: false,
                },
            }))
        }
    };

    const handleRadioChange = async (
        tab: keyof TabData,
        key: keyof Tab1details | keyof Tab2details,
        item: any | null
    ) => {
        if (item) {
            setData((prevState) => ({
                ...prevState,
                [tab]: {
                    ...prevState[tab],
                    [key]: item,
                },
            }));
            setValidationError((prevState) => ({
                ...prevState,
                [tab]: {
                    ...prevState,
                    [key]: false,
                },
            }))
        }
    };

    const handleInputChange = (
        tab: keyof TabData,
        key: keyof Tab1details | keyof Tab2details,
        item: string | any
    ) => {
        setData((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState[tab],
                [key]: item,
            },
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState,
                [key]: false,
            },
        }))

    };

    const handleInputChangeTextArea = (
        tab: keyof TabData,
        key: keyof Tab1details | keyof Tab2details,
        item: string | any
    ) => {
        setData((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState[tab],
                [key]: item,
            },
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState,
                [key]: false,
            },
        }))

    };

    const handleDateChange = (
        tab: keyof TabData,
        key: keyof Tab1details | keyof Tab2details,
        item: Date | any
    ) => {
        setData((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState[tab],
                [key]: item,
            },
        }));
        setValidationError((prevState) => ({
            ...prevState,
            [tab]: {
                ...prevState,
                [key]: false,
            },
        }))

    };

    const tabs = [
        {
            label: "My Submission",
            value: "tab1",
            content: (
                <div className="menu-card">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                            <CustomAutoComplete
                                label="Jobcode"
                                options={props.PatersonGradeList}
                                value={data.tab1.Jobcode}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) => handleAutoComplete("tab1", "Jobcode", item)}
                                error={validationErrors.tab1.Jobcode}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                            <CustomInput
                                value={data.tab1.PositionID}
                                label="PositionID"
                                error={validationErrors.tab1.Jobcode}
                                onChange={(item) => handleInputChange("tab1", "PositionID", item)}
                            // disabled={true}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                            <CustomInput
                                value={data.tab1.Nationality}
                                label="Nationality"
                                error={validationErrors.tab1.Nationality}
                                onChange={(item) => handleInputChange("tab1", "Nationality", item)}
                            // disabled={true}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                            <CustomAutoComplete
                                label="Department"
                                options={props.Department}
                                value={data.tab1.Department}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) => handleAutoComplete("tab1", "Department", item)}
                                error={validationErrors.tab1.Department}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg8">
                            <CustomRadioGroup
                                label="Employment Category: "
                                value={data.tab1.EmploymentCatagory}
                                options={["Kamoa Copper", "Labour Hire"]}
                                error={validationErrors.tab1.EmploymentCatagory}
                                mandatory={true}
                                onChange={(item) => handleRadioChange("tab1", "EmploymentCatagory", item)}
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: "Approved VRR",
            value: "tab2",
            content: (
                <div className="menu-card">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg8">
                            <CustomTextArea
                                label="ReasonForVancancy"
                                value={data.tab2.ReasonForVancancy}
                                error={validationErrors.tab2.ReasonForVancancy}
                                mandatory={true}
                                onChange={(item) => handleInputChangeTextArea("tab2", "ReasonForVancancy", item)}
                            />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                            <CustomDatePicker
                                selectedDate={data.tab2.DateRequried}
                                label="DateRequried"
                                error={validationErrors.tab2.DateRequried}
                                onChange={(date) =>
                                    handleDateChange(
                                        "tab2",
                                        "DateRequried",
                                        date
                                    )
                                }
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                            <CustomAutoComplete
                                label="BusinessUnitCode"
                                options={props.BusinessUnitCode}
                                value={data.tab2.BusinessUnitCode}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) => handleAutoComplete("tab2", "BusinessUnitCode", item)}
                                error={validationErrors.tab2.BusinessUnitCode}
                            />
                        </div>
                        <div className="ms-Grid-col ms-lg4">
                            <CustomAutoComplete
                                label="DepartmentCode"
                                options={props.DepartmentCodeList}
                                value={data.tab2.DepartmentCode}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) => handleAutoComplete("tab2", "DepartmentCode", item)}
                                error={validationErrors.tab2.DepartmentCode}
                            />
                        </div>

                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg4">
                            <CustomAutoComplete
                                label="Section"
                                options={props.SectionList}
                                value={data.tab2.Section}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) => handleAutoComplete("tab2", "Section", item)}
                                error={validationErrors.tab2.Section}
                            />
                        </div>
                    </div>
                </div>
            )
        }

    ];

    const handleCancel = () => {
        setIsLoading(true);
        let CancelAlert = {
            Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
            Type: HRMSAlertOptions.Confirmation,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                    props.navigation("/CommanFieldTemplate");
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

    const validateTab1 = (tab: string): boolean => {
        if (tab === "tab1") {
            const {
                Jobcode,
                PositionID,
                Nationality,
                EmploymentCatagory,
                Department
            } = data.tab1;

            const errors = {
                Jobcode: !IsValid(Jobcode.text),
                PositionID: !IsValid(PositionID),
                Nationality: !IsValid(Nationality),
                EmploymentCatagory: !IsValid(EmploymentCatagory),
                Department: !IsValid(Department.text),
            };

            setValidationError((prevState) => ({
                ...prevState,
                tab1: errors,
            }));

            return Object.values(errors).some((error) => error); // Return a boolean here
        }

        if (tab === "tab2") {
            const {
                Section,
                ReasonForVancancy,
                BusinessUnitCode,
                DepartmentCode,
                DateRequried,
            } = data.tab2;

            const errors = {
                Section: !IsValid(Section.text),
                ReasonForVancancy: !IsValid(ReasonForVancancy),
                BusinessUnitCode: !IsValid(BusinessUnitCode.text),
                DepartmentCode: !IsValid(DepartmentCode.text),
                DateRequried: !IsValid(DateRequried),
            };

            setValidationError((prevState) => ({
                ...prevState,
                tab2: errors,
            }));

            return Object.values(errors).some((error) => error); // Return a boolean here
        }

        return false;  // Default case if tab is not "tab1" or "tab2"
    };


    return (
        <>
            <CustomLoader isLoading={isLoading}>
                <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
                    <React.Fragment>
                        <TabsComponent
                            tabs={tabs}
                            initialTab="tab1"
                            handleCancel={handleCancel}
                            tabClassName={"Tab"}
                            validateTab={validateTab1}
                            additionalButtons={[
                                { label: "Submit" },
                            ]}
                        />
                    </React.Fragment>
                </Card>
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
    );
}
export default CommanTemplate;