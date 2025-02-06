// import * as React from "react";
// import { Card, CardContent } from "@mui/material";
// import { getVRRDetails } from "../../Services/ServiceExport";
// import CustomLoader from "../../Services/Loader/CustomLoader";

// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ReuseButton from "../../components/ReuseButton";
// import { TabName } from "../../utilities/Config";
// import SearchableDataTable from "../../components/CustomDataTable";
// import TabsComponent from "../../components/TabsComponent ";

// const CandidateList = (props: any) => {
//   console.log("Received Props:", props);

//   const [CandidateData, setCandidateData] = React.useState<any[]>([]);
//   const [rows, setRows] = React.useState<number>(5);
//   const [isLoading, setIsLoading] = React.useState<boolean>(false);

//   const jobCode = props?.stateValue?.JobCode?.toString().trim();
//   console.log("Received JobCode:", jobCode);

//   function handleRedirectView(
//     rowData: any,
//     tab: string,
//     TabName: string,
//     ButtonAction: string
//   ) {
//     console.log("Redirecting with rowData:", rowData);
//     if (tab === "tab2") {
//       props.navigation("/InterviewPanelList/InterviewPanelEdit", {
//         state: {
//           ID: rowData?.ID,
//           tab,
//           StatusId: rowData?.StatusId,
//           Status: rowData?.Status,
//           TabName,
//           ButtonAction,
//         },
//       });
//     }
//   }

//   const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
//     { field: "ID", header: "Candidate ID", sortable: true },
//     { field: "FullName", header: "Applicant Name", sortable: true },
//     { field: "JobCode", header: "Job Code", sortable: true },
//     { field: "PositionTitle", header: "Position Title", sortable: true },
//     { field: "JobGrade", header: "Job Grade", sortable: true },
//     { field: "Status", header: "Status", sortable: true },
//     {
//       field: "",
//       header: "Action",
//       sortable: false,
//       body: (rowData: any) => (
//         <ReuseButton
//           icon={<VisibilityIcon style={{ fontSize: "2rem" }} />}
//           onClick={() =>
//             handleRedirectView(rowData, tab, TabName, ButtonAction)
//           }
//         />
//       ),
//     },
//   ];

//   const fetchCandidateData = async () => {
//     if (!jobCode) {
//       console.error("JobCode is missing");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const filterConditions = [
//         { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCode },
//       ];
//       const response = await getVRRDetails.GetInterviewPanelCandidateDetails(
//         " ",
//         filterConditions
//       );
//       console.log("API Response:", response);

//       if (response?.status === 200 && response?.data?.length) {
//         setCandidateData(response.data);
//       } else {
//         setCandidateData([]);
//         console.warn("No candidates found.");
//       }
//     } catch (error) {
//       console.error("Error fetching candidate data:", error);
//       setCandidateData([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     if (jobCode) {
//       fetchCandidateData().catch((error) =>
//         console.error("Error in fetching candidate data:", error)
//       );
//     }
//   }, [jobCode]);

//   const onPageChange = (event: any) => {
//     setRows(event.rows);
//   };

//   const tabs = [
//     {
//       label: "Evaluation",
//       value: "tab1",
//       content: (
//         <Card
//           variant="outlined"
//           sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
//         >
//           <CardContent>
//             <SearchableDataTable
//               data={CandidateData}
//               columns={columnConfig("tab1", "Edit", TabName.Evaluation)}
//               rows={rows}
//               onPageChange={onPageChange}
//               handleRefresh={fetchCandidateData}
//             />
//           </CardContent>
//         </Card>
//       ),
//     },
//   ];

//   return (
//     <CustomLoader isLoading={isLoading}>
//       <div className="menu-card">
//         <TabsComponent tabs={tabs} initialTab="tab1" tabClassName="Tab" />
//       </div>
//     </CustomLoader>
//   );
// };

// export default CandidateList;
// =========================================================//
import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { TabName } from "../../utilities/Config";
import SearchableDataTable from "../../components/CustomDataTable";
import TabsComponent from "../../components/TabsComponent ";
import { Button } from "primereact/button";
// import { useNavigate } from "react-router-dom";

const CandidateList = (props: any) => {
  console.log("Received Props:", props);

  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const jobCode = props?.stateValue?.JobCode?.toString().trim();
  console.log("Received JobCode:", jobCode);

  const Status = props?.stateValue?.Status;
  console.log("Status", Status);

  //   const navigate = useNavigate();

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    console.log("Redirecting with rowData:", rowData);
    if (tab === "tab1") {
      props.navigation("/RecurimentProcess/HodScoreCard", {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          TabName,
          ButtonAction,
        },
      });
    }
  }

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    { field: "ID", header: "Candidate ID", sortable: true },
    { field: "FullName", header: "Applicant Name", sortable: true },
    { field: "JobCode", header: "Job Code", sortable: true },
    { field: "PositionTitle", header: "Position Title", sortable: true },
    { field: "JobGrade", header: "Job Grade", sortable: true },
    { field: "GPA", header: "GPA", sortable: true },
    { field: "Status", header: "Status", sortable: true },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {ButtonAction === "view" ? (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                icon="pi pi-eye"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              />
            ) : (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              >
                <img
                  src={require("../../assets/edit_icon.png")}
                  alt="Edit Icon"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  //   const fetchCandidateData = async () => {
  //     if (!jobCode) {
  //       console.error("JobCode is missing");
  //       return;
  //     }

  //     setIsLoading(true);
  //     try {
  //       const filterConditions = [
  //         { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCode },
  //       ];
  //       const response = await getVRRDetails.GetInterviewPanelCandidateDetails(
  //         " ",
  //         filterConditions
  //       );
  //       console.log("API Response:", response);

  //       if (response?.status === 200 && response?.data?.length) {
  //         const filteredCandidates = response.data.filter(
  //           (candidate: any) => candidate.JobCode?.toString().trim() === jobCode
  //         );
  //         setCandidateData(filteredCandidates);
  //       } else {
  //         setCandidateData([]);
  //         console.warn("No candidates found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching candidate data:", error);
  //       setCandidateData([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const fetchCandidateData = async () => {
    if (!jobCode) {
      console.error("JobCode is missing");
      return;
    }

    setIsLoading(true);
    try {
      const filterConditions = [
        { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCode },
      ];
      const response = await getVRRDetails.GetInterviewPanelCandidateDetails(
        " ",
        filterConditions
      );
      console.log("API Response:", response);

      if (response?.status === 200 && response?.data?.length) {
        const filteredCandidates = response.data
          .filter(
            (candidate: any) => candidate.JobCode?.toString().trim() === jobCode
          )
          .map((candidate: any) => ({
            ...candidate,
            Status: Status || candidate.Status, // Override Status if available from props
          }));

        setCandidateData(filteredCandidates);
      } else {
        setCandidateData([]);
        console.warn("No candidates found.");
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setCandidateData([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (jobCode) {
      fetchCandidateData().catch((error) =>
        console.error("Error in fetching candidate data:", error)
      );
    }
  }, [jobCode]);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const tabs = [
    {
      label: TabName.ScorecardDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <SearchableDataTable
              data={CandidateData}
              columns={columnConfig("tab1", "Edit", TabName.ScorecardDetails)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={fetchCandidateData}
              MasterData={props || {}}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <TabsComponent tabs={tabs} initialTab="tab1" tabClassName="Tab" />
      </div>
    </CustomLoader>
  );
};

export default CandidateList;
