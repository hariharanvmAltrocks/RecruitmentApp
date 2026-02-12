import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { getVRRDetails } from "../../Services/ServiceExport";
import { RoleID, TabName, tabType, Choices } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { tabCount } from "../../Models/RecuritmentVRR";
import { TabDetails } from "../../Models/Master";
import { tabStyle } from "../../components/TabMerge";
import { IFilter } from "../../Services/SPService/ISPServicesProps";
import RecruitmentList from "./RecruitmentList";

export type formValidation = {
  Comments: boolean;
  AssignRecruitmentHR: boolean;
  AssignRecruitmentAgencies: boolean;
};

const RecruitmentProcess = (props: any) => {
  // const [data, setData] = React.useState<DataSyncToRecruitmentResponse[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [pendingcount, setPendingCount] = React.useState<tabCount>({
    AssignHRCount: 0,
    UploadONEMCount: 0,
    UploadAdvertisementCount: 0,
    AssignAgencyCount: 0,
    ReviewLineManagerCount: 0,
    ReviewHODCount: 0,
    lineManagerInterviewCount: 0,
    HODReviewScoreCount: 0,
    EvaluationCount: 0,
    advertExtensionCount: 0,
  });
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
      let AssignHR = TabDetails.some(
        (item) => item.TabName === TabName.AssignRecuritmentHR,
      );
      let Evalution = TabDetails.some(
        (item) => item.TabName === TabName.Evaluation,
      );

      let PendingCount = await getVRRDetails.GetCountApprovedList(
        FilterCondition,
        props.userDetails[0]?.EmailId,
        AssignHR,
        Evalution,
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
    debugger;
    if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
      TabDetails = (props.TabDetails[0] ?? []).filter(
        (tab: any) => tab.TabName !== TabName.Evaluation,
      );
    } else {
      TabDetails = props.TabDetails[0] ?? [];
    }
    setTabNameData(TabDetails);
    void fetchData(TabDetails);
  }, []);

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.AssignRecuritmentHR:
        return tabStyle(tab.TabName, pendingcount.AssignHRCount ?? 0);
      case TabName.UploadONEMDoc:
        return tabStyle(tab.TabName, pendingcount.UploadONEMCount);
      case TabName.UploadAdvertisement:
        return tabStyle(tab.TabName, pendingcount.UploadAdvertisementCount);

      case TabName.ReviewJobAdvertisement:
        if (props.CurrentRoleID.includes(RoleID.LineManager)) {
          return tabStyle(tab.TabName, pendingcount.ReviewLineManagerCount);
        } else {
          return tabStyle(tab.TabName, pendingcount.ReviewHODCount);
        }
      case TabName.InterviewQuestion:
        return tabStyle(tab.TabName, pendingcount.lineManagerInterviewCount);
      case TabName.Evaluation:
        return tabStyle(tab.TabName, pendingcount.EvaluationCount ?? 0);
      default:
        return tab.TabName;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: getTabLabel(tab), //  `${tab.TabName} (${data.length})`,
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
                <RecruitmentList {...props} TabDetails={tab} />
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
