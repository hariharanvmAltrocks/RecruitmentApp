import * as React from "react";
import LabelHeaderComponents from "./TitleHeader";
import ReuseButton from "./ReuseButton";
import CustomAutoComplete from "./CustomAutoComplete";
import { AutoCompleteItem } from "../Models/Screens";
import { Label } from "@fluentui/react";
import { ListNames } from "../utilities/Config";
import SPServices from "../Services/SPService/SPServices";

export type HeaderValue = {
    JobCode: string;
    JobTitle: string;
    Headcount: string;
}

interface AssignRecuritmentHRProps {
    handleAutoComplete: (item: AutoCompleteItem | null) => void;
    AssignRecuritmentHRValue: AutoCompleteItem | null;
    onClose: () => void;
    HeaderValueData: HeaderValue | null;
    assignbtnfn: () => void;
}

function AssignRecuritmentHR({
    handleAutoComplete,
    AssignRecuritmentHRValue,
    onClose,
    HeaderValueData,
    assignbtnfn
}: AssignRecuritmentHRProps): JSX.Element {
    console.log(HeaderValueData, "optionProps");

    const [RecuritmentOption, setRecuritmentOption] = React.useState<AutoCompleteItem | null>(null);


    const fetchRecuritmentHR = async () => {

        await SPServices.SPReadItems({
            Listname: ListNames.JDEDataMapping,
            Select: "*,LineManager/Title,BudgetHolder/Title,HOD/Title",
            Expand: "LineManager,BudgetHolder,HOD",
        }).then((res: any) => {
            if (res.length > 0) {
                res.map((item: any) => {
                    console.log(item, "JDEDataMappingItem");

                    let obj: AutoCompleteItem = {
                        key: item.BudgetHolderId,
                        text: item?.BudgetHolder?.Title ? item?.BudgetHolder?.Title : "",
                    };
                    setRecuritmentOption(obj)
                })
            }
        })

    }

    React.useEffect(() => {
        void fetchRecuritmentHR();
    }, []);

    return (
        <>
            <div
                className="ms-Grid"
                style={{
                    // height: "40vh",
                    marginRight: "20px",
                    marginLeft: "20px",
                    marginTop: "15px",
                }}
            >
                <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                    <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                        <Label className="title" style={{ fontSize: 18, color: "black" }}>
                            {`Job Code - ${HeaderValueData?.JobCode}`}
                        </Label>
                    </div>
                </div>

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
                        <CustomAutoComplete
                            label="Assign Recuritment HR"
                            options={RecuritmentOption ? [RecuritmentOption] : []}
                            value={AssignRecuritmentHRValue}
                            disabled={false}
                            mandatory={true}
                            onChange={(item) => handleAutoComplete(item)}
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
            </div>
        </>
    );
}

export default AssignRecuritmentHR;

