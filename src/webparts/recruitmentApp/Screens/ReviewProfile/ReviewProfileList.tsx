import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { RoleID, TabName, tabType, Choices } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { tabStyle } from "../../components/TabMerge";
import { IFilter } from "../../Services/SPService/ISPServicesProps";
import PositionDashboard from "./PositionDashboard";
import { ReviewProfiletabCount } from "../../Models/RecuritmentVRR";
import { TabDetails } from "../../Models/Master";

const RecruitmentProcess = (props: any) => {
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [pendingcount, setPendingCount] = React.useState<ReviewProfiletabCount>(
    {
      Interviewquestion: 0,
      ReviewProfileCount: 0,
      EvaluationCount: 0,
      InterviewPanelCount: 0,
    },
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>([]);

  const fetchData = async (TabDetails: TabDetails[]) => {
    setIsLoading(true);
    try {
      let FilterCondition: IFilter[] = [];
      FilterCondition.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No,
      });

      let PendingCount = await getVRRDetails.GetReviewProfileCount(
        FilterCondition,
        props.userDetails[0]?.EmailId,
      );
      setPendingCount(PendingCount.data);
    } catch (error) {
      console.log("Error in pendingcountTabs", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (props.stateValue) {
      setActiveTab(props.stateValue?.tab);
    } else {
      setActiveTab("tab1");
    }
    let TabDetails: any;
    if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
      TabDetails = (props.TabDetails[0] ?? []).filter(
        (tab: any) => tab.TabName !== TabName.Evaluation,
      );
    } else {
      TabDetails = props.TabDetails[0] ?? [];
    }
    setTabNameData(TabDetails);
    void fetchData(TabDetails);
  }, [TabNameData, props.stateValue]);

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.ReviewProfile:
        return tabStyle(tab.TabName, pendingcount.ReviewProfileCount);
      case TabName.AssignInterviewPanel:
        return tabStyle(tab.TabName, pendingcount.InterviewPanelCount);
      case TabName.InterviewQuestion:
        return tabStyle(tab.TabName, pendingcount.Interviewquestion);
      case TabName.Evaluation:
        return tabStyle(tab.TabName, pendingcount.EvaluationCount);
      default:
        return tab.TabName;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: getTabLabel(tab),
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>
            {tab && (
              <>
                <PositionDashboard {...props} TabDetails={tab} />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    ),
  }));

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <React.Fragment>
          <div className="menu-card">
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
            />
          </div>
        </React.Fragment>
      </CustomLoader>
    </>
  );
};
export default RecruitmentProcess;
