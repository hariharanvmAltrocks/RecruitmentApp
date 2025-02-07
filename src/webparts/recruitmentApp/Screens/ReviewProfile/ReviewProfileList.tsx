import * as React from "react";
import { Card, CardContent } from "@mui/material";
//import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  GridStatusBackgroundcolor,
  StatusId,
  TabName,
} from "../../utilities/Config";
import { Button } from "primereact/button";
import SearchableDataTable from "../../components/CustomDataTable";

const ReviewProfileList = (props: any) => {

  const [RecuritmentData, setRecuritmentData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    {
      field: "JobTitleInEnglish",
      header: "Job Title",
      sortable: true,
    },
    {
      field: "BusinessUnitCode",
      header: "Business Unit Code",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        return (
          <span
            style={{
              backgroundColor:
                rowData.Status.includes("Pending") === true // "Pending"
                  ? GridStatusBackgroundcolor.Pending
                  : rowData.Status.includes("Completed") === true
                    ? GridStatusBackgroundcolor.CompletedOrApproved
                    : rowData.Status.includes("Rejected") === true
                      ? GridStatusBackgroundcolor.Rejected
                      : rowData.Status.includes("Reverted") === true
                        ? GridStatusBackgroundcolor.Reverted
                        : rowData.Status.includes("Resubmitted") === true
                          ? GridStatusBackgroundcolor.ReSubmitted
                          : rowData.Status.includes("Draft") === true
                            ? GridStatusBackgroundcolor.Draft
                            : "",
              borderRadius: "5px",
            }}
          >
            {rowData.Status}
          </span>
        );
      },
    },
    {
      field: "",
      header: "Action",
      sortable: false,
      body: (rowData: any) => {
        function handleRedirectView(
          rowData: any,
          tab: string,
          TabName: string,
          ButtonAction: string
        ): void {
          props.navigation("/ReviewProfileList/ReviewCandidateList", {
            state: {
              ID: rowData?.ID,
              tab,
              StatusId: rowData?.StatusId,
              Status: rowData?.Status,
              TabName: TabName,
              ButtonAction,
            },
          });
        }

        return (
          <div>
            <span>
              <Button
                onClick={() => handleRedirectView(rowData, tab, TabName, ButtonAction)}
                className="table_btn"
                icon="pi pi-eye"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              />


            </span>
          </div>
        );
      },
    },
  ];

  const fetchRecuritmentData = async () => {
    setIsLoading(true);
    try {

      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "";
      filterConditionsRecuritment.push({
        FilterKey: "StatusId",
        Operator: "eq",
        FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv,
      });
      const data = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsRecuritment,
        RecuritmentConditions
      );
      if (data.status === 200 && data.data !== null) {
        setRecuritmentData(data.data);
      }

    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };


  React.useEffect(() => {
    const fetchData = async () => {
      await fetchRecuritmentData();
    };

    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    void fetchRecuritmentData();
    // setActiveTab(tab);
  };

  const tabs = [
    {
      label: TabName.ReviewProfile,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <SearchableDataTable
              data={RecuritmentData}
              columns={columnConfig(
                "tab1",
                TabName.ViewPositionDetails,
                TabName.ReviewProfile
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab1")}
              MasterData={props}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      label: TabName.AssignInterviewPanel,
      value: "tab2",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <SearchableDataTable
              data={RecuritmentData}
              columns={columnConfig(
                "tab1",
                "view",
                TabName.AssignInterviewPanel
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab2")}
              MasterData={props}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <TabsComponent
              tabs={tabs}
              initialTab="tab1"
              tabClassName={"Tab"}
            />
          </React.Fragment>
        </div>
      </CustomLoader>
    </>
  );
};
export default ReviewProfileList;
