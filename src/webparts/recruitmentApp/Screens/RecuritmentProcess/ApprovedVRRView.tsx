import * as React from "react";
import { Card } from "@mui/material";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { StatusId } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";



const ApprovedVRRView = () => {
    const [data, setData] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);


    const fetchData = async () => {
        setIsLoading(true);
        try {
            let filterConditions = [];
            let Conditions = "";
            filterConditions.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue: StatusId.InitiatedforRecruitmentProcess
            });
            const data = await getVRRDetails.GetVacancyDetails(filterConditions, Conditions);
            if (data.status === 200 && data.data !== null) {
                console.log(data, "GetVacancyDetails");
                setData(data.data);
            }
        } catch (error) {
            console.log("GetVacancyDetails doesn't fetch the data", error);
        }
        setIsLoading(false);
        console.log(data, "data");

    };
    React.useEffect(() => {
        void fetchData();
    }, []);


    const tabs = [
        {
            label: "My Submission",
            value: "tab1",
            content: (
                <div className="menu-card">

                </div>
            ),
        },
    ];


    return (
        <CustomLoader isLoading={isLoading}>
            <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3" }}>
                <React.Fragment>
                    <TabsComponent tabs={tabs} initialTab="tab1" />
                    {/* <div style={{ marginRight: "10px" }}>
                    <ReuseButton
                        label="Cancel"
                        // onClick={handleCancel}
                        spacing={4}
                    />
                </div> */}
                </React.Fragment>
            </Card>
        </CustomLoader>

    )
}
export default ApprovedVRRView;