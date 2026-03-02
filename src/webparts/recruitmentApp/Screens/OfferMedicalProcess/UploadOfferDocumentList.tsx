import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import { TabName, tabType, Choices, RoleID } from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { TabDetails } from "../../Models/Master";
import { OfferLetterServices } from "../../Services/ServiceExport";
import { tabcountBGV } from "../../Services/InitiateOfferLetter/IOfferLetterService";
import { tabStyle } from "../../components/TabMerge";
import { IFilter } from "../../Services/SPService/ISPServicesProps";
import DocumentDashboard from "./DocumentDashboard";

const UploadOfferDocumentList = (props: any) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [pendingcount, setPendingCount] = React.useState<tabcountBGV>({
    BGVCount: 0,
    LabourHireCount: 0,
    KCSACount: 0,
  });
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

      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        FilterCondition.push({
          FilterKey: "RecruitmentHR",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      }

      const PendingCount = await OfferLetterServices.GetBVGCandidateCount(
        FilterCondition,
        "and",
        props.CurrentRoleID,
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
    TabDetails = props.TabDetails[0] ?? [];
    setTabNameData(TabDetails);
    void fetchData(TabDetails);
  }, [TabNameData, props.stateValue]);

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.BackgroundVerification:
        return tabStyle(tab.TabName, pendingcount.BGVCount);
      case TabName.OfferLetterKSCA:
        return tabStyle(tab.TabName, pendingcount.KCSACount);
      case TabName.OfferLetterLabourHire:
        return tabStyle(tab.TabName, pendingcount.LabourHireCount);
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
            {tab && <>{<DocumentDashboard {...props} TabDetails={tab} />}</>}
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
export default UploadOfferDocumentList;
