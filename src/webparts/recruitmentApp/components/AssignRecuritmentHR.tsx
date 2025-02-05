import * as React from "react";
import { AutoCompleteItem } from "../Models/Screens";
import CustomPopup from "./CustomPopup/CustomPopup";
import LabelHeaderComponents from "./TitleHeader";
import CustomMultiSelect from "./CustomMultiSelect";
import ReuseButton from "./ReuseButton";
import { CommonServices } from "../Services/ServiceExport";
import { ADGroupID } from "../utilities/Config";
import { Label } from "@fluentui/react";

export type HeaderValue = {
    JobCode: string;
    JobTitle: string;
    Headcount: string;
}

interface AssignRecuritmentHRProps {
    // handleAutoComplete: (item: AutoCompleteItem | null) => void;
    AssignRecuritmentHRValue: AutoCompleteItem[];
    onClose: () => void;
    HeaderValueData: HeaderValue | null;
    assignbtnfn: () => void;
    visible: boolean;
}

function AssignRecuritmentHR({
    // handleAutoComplete,
    AssignRecuritmentHRValue,
    onClose,
    HeaderValueData,
    assignbtnfn,
    visible
}: AssignRecuritmentHRProps): JSX.Element {
    const [RecuritmentOption, setRecuritmentOption] = React.useState<AutoCompleteItem[]>([]);


    React.useEffect(() => {
        const getADGroupsOption = async () => {
            try {
                const InterViewPanelOption = await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSInterviewPanel);

                if (
                    (InterViewPanelOption.status === 200 && InterViewPanelOption.data)
                ) {
                    setRecuritmentOption(InterViewPanelOption.data)
                } else {
                    console.error("Error retrieving attachments:", InterViewPanelOption.data.message);
                }
            } catch (error) {
                console.error("Error in fetching data:", error);
            }
        };

        void getADGroupsOption();
    }, []);

    return (
        <>
            <div className="ms-Grid-row" style={{ display: "flex", justifyContent: "center" }}>
                <CustomPopup
                    visible={visible}
                    onClose={onClose}
                    // width="41%"
                    // height="35%"
                    children={
                        <>
                            <div className="ms-Grid-row" style={{ marginLeft: "5%" }}>
                                <div className="ms-Grid-col ms-lg6">
                                    <LabelHeaderComponents value={`Job Tilte - ${HeaderValueData?.JobTitle}`} />
                                </div>

                                <div className="ms-Grid-col ms-lg6">
                                    <LabelHeaderComponents value={`Head Count - ${HeaderValueData?.Headcount}`} />
                                </div>


                            </div>
                            <div className="ms-Grid-row">
                                <div
                                    className="ms-Grid-col ms-lg4"
                                    style={{
                                        marginLeft: "6%"
                                    }}
                                >
                                    <CustomMultiSelect
                                        label="Assign Recuritment HR"
                                        options={RecuritmentOption}
                                        value={AssignRecuritmentHRValue}
                                        disabled={false}
                                        mandatory={true}
                                    // onChange={(item) => handleAutoComplete(item)}
                                    />
                                </div>
                            </div>
                            <div
                                className="ms-Grid-row"
                                style={{ display: "flex", justifyContent: "center", marginTop: "3%" }}
                            >
                                <div className="ms-Grid-col ms-lg3">
                                    <ReuseButton
                                        spacing={4}
                                        onClick={assignbtnfn}
                                        width="100%"
                                        label="Assign"
                                    />
                                </div>
                            </div>
                        </>
                    }
                    header={
                        <>
                            <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                                    <Label className="title" style={{ fontSize: 18, color: "black" }}>
                                        {`Job Code - ${HeaderValueData?.JobCode}`}
                                    </Label>
                                </div>
                            </div>
                        </>
                    }

                />
            </div>
        </>
    );
}

export default AssignRecuritmentHR;

