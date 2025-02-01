import * as React from "react";
import { Card, CardContent } from "@mui/material";
//import {  Link } from "@mui/material";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { AutoCompleteItem } from "../../Models/Screens";
import { ADGroupID } from "../../utilities/Config";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import AssignRecuritmentHR, {
  HeaderValue,
} from "../../components/AssignRecuritmentHR";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReuseButton from "../../components/ReuseButton";

const InterviewPanelList = (props: any) => {
  console.log(props, "ReviewProfile");

  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [checkedValue, setCheckedValue] = React.useState<any[]>([]);
  const [AssignPopup, setAssignPopup] = React.useState<boolean>(false);
  const [AssignBtnValidation, setAssignBtnValidation] =
    React.useState<boolean>(false);
  const [HeaderValueData, setHeaderValueData] =
    React.useState<HeaderValue | null>(null);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [AssignRecuritmentHRValue, setAssignRecuritmentHRValue] =
    React.useState<AutoCompleteItem[]>([]);
  // const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  // const [alertProps, setalertProps] = React.useState<alertPropsData>({
  //     Message: "",
  //     Type: "",
  //     ButtonAction: null,
  //     visible: false,
  // });

  // const HRFileHandle = (serverUrl: string, fileName: string) => {
  //   console.log(serverUrl, "ServerUrl");
  //   try {
  //     if (serverUrl) {
  //       if (
  //         fileName
  //           .split(".")
  //           [fileName.split(".").length - 1].toLocaleLowerCase() == "pdf"
  //       ) {
  //         window.open(serverUrl);
  //       } else {
  //         window.open(serverUrl + "?web=1");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error setting up SharePoint:", error);
  //   }
  // };

  // const handleAttachmentState = (newAttachments: Item[], rowData: any) => {
  //     const updatedRowAttachment = CandidateData.map((item: any) => {
  //         if (item.ID === rowData.ID) {
  //             if (item.Checked === true) {
  //                 return item;
  //             }
  //             return {
  //                 ...item,
  //                 ScoreCardAttch: [...(item.ScoreCardAttch || []), ...newAttachments],
  //             };
  //         }
  //         return item;
  //     });
  //     setCandidateData(updatedRowAttachment);
  // };

  // const handleDelete = (index: number, rowData: any) => {
  //     console.log("Deleting attachment at index:", index);
  //     const updatedCandidateData = CandidateData.map((item: any) => {
  //         if (item.ID === rowData.ID) {
  //             const updatedAttachments = item.ScoreCardAttch.filter((_: any, i: number) => i !== index);
  //             return {
  //                 ...item,
  //                 ScoreCardAttch: updatedAttachments,
  //             };
  //         }
  //         return item;
  //     });

  //     setCandidateData(updatedCandidateData);
  // };

  const columnConfig = [
    {
      field: "",
      header: "Candidate ID",
      sortable: true,
    },
    {
      field: "",
      header: "ApplicantName",
      sortable: true,
    },
    {
      field: "",
      header: "Position Title",
      sortable: true,
    },
    {
      field: "",
      header: "JobGrade",
      sortable: true,
    },
    // {
    //   field: "JobCode",
    //   header: "JobCode",
    //   sortable: true,
    // },
    {
      field: "",
      header: "Status",
      sortable: true,
    },
    // {
    //   field: "Nationality",
    //   header: "Nationality",
    //   sortable: true,
    // },
    // {
    //   field: "PassportID",
    //   header: "PassportID",
    //   sortable: true,
    // },
    {
      field: "FullName",
      header: "Name",
      sortable: true,
    },
    // {
    //   field: "",
    //   header: "CV",
    //   sortable: false,
    //   body: (rowData: any) => {
    //     if (
    //       rowData?.CandidateCVDoc?.[0] &&
    //       rowData?.CandidateCVDoc?.[0]?.name
    //     ) {
    //       return (
    //         <div>
    //           <Link
    //             onClick={() =>
    //               HRFileHandle(
    //                 rowData?.CandidateCVDoc[0]?.content || "",
    //                 rowData?.CandidateCVDoc[0]?.name || ""
    //               )
    //             }
    //           >
    //             {rowData?.CandidateCVDoc?.[0]?.name}
    //           </Link>
    //         </div>
    //       );
    //     } else {
    //       return <span>No CV available</span>;
    //     }
    //   },
    // },
    // {
    //   field: "Interviewed",
    //   header: "Interviewed",
    //   sortable: false,
    // },
    {
      field: "",
      header: "Action",
      sortable: true,
      body: (rowData: any) => {
        function handleRedirectView(rowData: any): void {
          const ID = rowData?.ID;
          props.navigation("/InterviewPanelList/InterviewPanelEdit", {
            state: { ID },
          });
        }

        return (
          <div>
            <ReuseButton
              icon={
                <VisibilityIcon
                  style={{
                    fontSize: "2rem",
                    marginTop: "4%",
                    marginLeft: "18%",
                  }}
                />
              }
              onClick={() => handleRedirectView(rowData)}
              spacing={4}
              width="10%"
              // disabled={!rowData?.Checked}
            />
          </div>
        );
      },
    },
  ];

  const fetchCandidateData = async (CurrentUserID: any) => {
    setIsLoading(true);
    try {
      console.log(CurrentUserID, "CurrentUserID");

      let filterConditions = [];
      let Conditions = "";
      filterConditions.push({
        FilterKey: "AssignByInterviewPanel",
        Operator: "eq",
        FilterValue: CurrentUserID,
      });
      const data = await getVRRDetails.GetInterviewPanelCandidateDetails(
        filterConditions,
        Conditions
      );
      if (data.status === 200 && data.data !== null) {
        console.log(data.data, "GetVacancyDetails");
        setCandidateData(data.data);
      }
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const getCurrentUserID = await CommonServices.GetADgruopsEmailIDs(
        ADGroupID.HRMSInterviewPanel
      );
      if (getCurrentUserID.status === 200 && getCurrentUserID.data) {
        console.log(getCurrentUserID, "getCurrentUserID");

        await fetchCandidateData(getCurrentUserID.data[0].key);
      }

      const HeaderValue = {
        JobCode: "POS001",
        JobTitle: "Position English",
        Headcount: "01",
      };
      setHeaderValueData(HeaderValue);
      setAssignRecuritmentHRValue([]);
    };

    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // const Submit_fn = async () => {
  //     const allAssignByPresent = CandidateData.every((item) => item.AssignBy);
  //     console.log(allAssignByPresent, "allShortlistValuePresent");
  //     if (allAssignByPresent) {
  //         for (const Candidate of CandidateData) {
  //             if (Candidate?.AssignBy) {
  //                 const obj = {
  //                     ID: Candidate.ID,
  //                     AssignById: Candidate?.AssignBy
  //                 };
  //                 console.log(obj, "obj");

  //                 try {
  //                     const data = await getVRRDetails.AssignCandidateRecuritmentHR(obj.ID, obj, ListNames.HRMSRecruitmentCandidateDetails);
  //                     if (data.status === 200 && data.data !== null) {
  //                         setIsLoading(true);
  //                         let CancelAlert = {
  //                             Message: RecuritmentHRMsg.RecuritmentSubmitMsg,
  //                             Type: HRMSAlertOptions.Success,
  //                             visible: true,
  //                             ButtonAction: async (userClickedOK: boolean) => {
  //                                 if (userClickedOK) {
  //                                     props.navigation("/RecurimentProcess");
  //                                     setAlertPopupOpen(false);
  //                                 }
  //                             }
  //                         }

  //                         setAlertPopupOpen(true);
  //                         setalertProps(CancelAlert);
  //                         setIsLoading(false);
  //                     }
  //                 } catch (error) {
  //                     console.log("GetVacancyDetails doesn't fetch the data", error);
  //                 }

  //             }
  //         }
  //     } else {
  //         let CancelAlert = {
  //             Message: RecuritmentHRMsg.ValidationErrorMsg,
  //             Type: HRMSAlertOptions.Warning,
  //             visible: true,
  //             ButtonAction: async (userClickedOK: boolean) => {
  //                 if (userClickedOK) {
  //                     setAlertPopupOpen(false);
  //                 }
  //             }
  //         }

  //         setAlertPopupOpen(true);
  //         setalertProps(CancelAlert);
  //         setIsLoading(false);
  //     }

  // }

  const handleCheckbox = (value: boolean, rowData: any) => {
    const updatedRowData = CandidateData.map((item: any) => {
      if (item.ID === rowData.ID) {
        if (item.Checked === true && value === true) {
          return item;
        }

        return {
          ...item,
          Checked: value,
          Assigned: value,
        };
      }
      return item;
    });
    let CheckedValue = updatedRowData.filter((item) => item.Checked === true);
    const updatedCheckedValues = CheckedValue
      ? [...checkedValue, CheckedValue]
      : [];

    setCheckedValue(updatedCheckedValues);
    setCandidateData(updatedRowData);
  };

  function handleAssignBtn() {
    let CheckedDataValue = CandidateData.some((item) => item.Checked);
    if (CheckedDataValue) {
      setAssignPopup(!AssignPopup);
      setAssignBtnValidation(AssignBtnValidation);
    } else {
      setAssignBtnValidation(!AssignBtnValidation);
    }
  }

  const onSelectAllChange = (value: boolean) => {
    const updatedRowData: any[] = CandidateData.map((item: any) => {
      return {
        ...item,
        Checked: value,
        // AssignBy: value ? AssignRecuritmentHRValue?.key : null,
      };
    });

    setCandidateData(updatedRowData);
    setSelectAll(value);
  };

  const assignbtnfn = async () => {
    setIsLoading(true);
    const updatedRowData = await Promise.all(
      CandidateData.map(async (item: any) => {
        if (item.Assigned === true) {
          return {
            ...item,
            // AssignBy: AssignRecuritmentHRValue?.key,
          };
        }
        return item;
      })
    );

    setCandidateData(updatedRowData);
    setAssignPopup(false);

    setIsLoading(false);
  };

  const tabs = [
    {
      label: "Assign Interview Panel",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <CheckboxDataTable
              data={CandidateData}
              columns={columnConfig}
              rows={rows}
              onPageChange={onPageChange}
              handleAssignBtn={handleAssignBtn}
              AssignBtnValidation={AssignBtnValidation}
              handleCheckbox={handleCheckbox}
              selectAll={selectAll}
              onSelectAllChange={onSelectAllChange}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  // const handleCancel = () => {
  //     setIsLoading(true);
  //     let CancelAlert = {
  //         Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
  //         Type: HRMSAlertOptions.Confirmation,
  //         visible: true,
  //         ButtonAction: async (userClickedOK: boolean) => {
  //             if (userClickedOK) {
  //                 props.navigation("/InterviewPanelList");
  //                 setAlertPopupOpen(false);
  //             } else {
  //                 setAlertPopupOpen(false);
  //             }
  //         }
  //     }

  //     setAlertPopupOpen(true);
  //     setalertProps(CancelAlert);
  //     setIsLoading(false);

  // };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <TabsComponent tabs={tabs} initialTab="tab1" tabClassName={"Tab"} />
            {console.log(props.masterData, "masterDataDetails")}
            {console.log(first, "first")}
          </React.Fragment>
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

      {AssignPopup ? (
        <>
          <AssignRecuritmentHR
            // handleAutoComplete={handleAutoComplete}
            AssignRecuritmentHRValue={AssignRecuritmentHRValue}
            onClose={handleAssignBtn}
            HeaderValueData={HeaderValueData}
            assignbtnfn={assignbtnfn}
            visible={AssignPopup}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default InterviewPanelList;
