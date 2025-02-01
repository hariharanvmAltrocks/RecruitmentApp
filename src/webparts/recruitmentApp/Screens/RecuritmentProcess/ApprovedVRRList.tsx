import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import {
  GridStatusBackgroundcolor,
  RoleID,
  StatusId,
  TabName,
  tabType,
  ADGroupID,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  WorkflowAction,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Button } from "primereact/button";
import { Card, CardContent } from "@mui/material";
import { Dialog } from "primereact/dialog";
import JobCodeSelector from "../../components/CustomMultiselectwithswipe";
import { AutoCompleteItem } from "../../Models/Screens";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomTextArea from "../../components/CustomTextArea";
import ReuseButton from "../../components/ReuseButton";
import {
  JobCodeTilte,
  RecruitementPositionDetails,
} from "../../Models/RecuritmentVRR";
import SPServices from "../../Services/SPService/SPServices";
import { InsertComments } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import CustomMultiSelect from "../../components/CustomMultiSelect";
// import 'primeicons/primeicons.css';
// interface ColumnConfig {
//     field: string;
//     header: string;
//     sortable: boolean;
//     body?: (item?: {}) => {};
// }

const RecruitmentProcess = (props: any) => {
  console.log(props, "ApprovedVRR");

  const [data, setData] = React.useState<any[]>([]);
  const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [AssignHR, setAssignHR] = React.useState<boolean>(false);
  const [AssignRecruitmentHR, setAssignRecruitmentHR] =
    React.useState<AutoCompleteItem>({ key: 0, text: "" });
  const [AssignRecruitmentHROption, setAssignRecruitmentHROption] =
    React.useState<AutoCompleteItem[]>([]);
  // const [AssignRecruitmentAgencies, setAssignRecruitmentAgencies] =
  //   React.useState<AutoCompleteItem>({
  //     key: 0,
  //     text: "",
  //   });
  const [AssignRecruitmentAgencies, setAssignRecruitmentAgencies] =
    React.useState<AutoCompleteItem[]>([]);
  const [AssignRecruitmentAgenciesOption, setAssignRecruitmentAgenciesOption] =
    React.useState<AutoCompleteItem[]>([]);
  //JobTitle
  const [allJobData, setJobCodeTitle] = React.useState<JobCodeTilte[]>([
    {
      id: "",
      VRRId: 0,
      JobTitle: "",
      JobCode: " ",
      ID: 0,
      RecruitmentID: 0,
    },
  ]);
  const [selectedJobCodes, setSelectedJobCodes] = React.useState<
    JobCodeTilte[]
  >([]);
  const [Comments, setComment] = React.useState<string>("");
  //const [checkedValue, setCheckedValue] = React.useState<any[]>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  type formValidation = {
    Comments: boolean;
    AssignRecruitmentHR: boolean;
    AssignRecruitmentAgencies: boolean;
  };

  const [validationErrors, setValidationErrors] =
    React.useState<formValidation>({
      Comments: false,
      AssignRecruitmentHR: false,
      AssignRecruitmentAgencies: false,
    });

  const [formState, setFormState] = React.useState<RecruitementPositionDetails>(
    {
      JobNameInEnglishID: 0,
      JobNameInFrenchID: 0,
      PatersonGradeID: 0,
      DRCGradeID: 0,
      PositionDetails: [],
      Comments: "",
    }
  );

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    {
      field: "Checkbox",
      header: "",
      sortable: false,
    },
    {
      field: "BusinessUnitCode",
      header: "BusinessUnit Code",
      sortable: true,
    },
    {
      field: "Department",
      header: "Department",
      sortable: true,
    },
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    // {
    //     field: 'JobTitleInEnglish',
    //     header: 'Job Title',
    //     sortable: true
    // },
    // {
    //     field: 'ReasonForVacancy',
    //     header: 'ReasonForVacancy',
    //     sortable: true
    // },
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
              <>
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
                >
                  {/* <img
                                                src={require("../../assets/edit_icon.png")}
                                                alt="Stamp Icon"
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                }}
                                              /> */}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabName, ButtonAction)
                  }
                  className="table_btn"
                  // icon="pi pi-eye"
                  style={{
                    width: "30px",
                    marginRight: "7px",
                    padding: "3px",
                  }}
                >
                  <img
                    src={require("../../assets/edit_icon.png")}
                    alt="Stamp Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    console.log(rowData, "rowData");
    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHRLead:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                type: "VRR",
                ID: rowData?.VRRID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab2") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                ID: rowData?.ID,
                AssignedHRId: rowData?.AssignedHRId,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else {
            props.navigation("/RecurimentProcess/ApprovedVRRView", {
              state: {
                ID: rowData?.ID,
                AssignedHR: rowData?.AssignedHR,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          }
        }
        break;

      case RoleID.RecruitmentHR:
        {
          if (tab === "tab1" || tab === "tab2") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab4") {
            props.navigation("/RecurimentProcess/ApprovedVRRView", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab3") {
            props.navigation("/RecurimentProcess/ReviewProfile", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab5") {
            props.navigation("/RecurimentProcess/AssignInterviewPanel", {
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
        }
        break;

      case RoleID.HOD:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
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
        }
        break;
      case RoleID.LineManager:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ReviewProfile", {
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
        }
        break;
    }
  }
  // async function handleDeletedView(rowData: any, tab: string) {
  //     const ID = rowData?.ID
  //     const deleteResult = await SPServices.SPDeleteItem({
  //         Listname: ListNames.HRMSRecruitmentDptDetails,
  //         ID: ID
  //     });
  //     console.log(deleteResult, "deleteResult");

  // }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log(activeTab, "activeTabactiveTab");

      let filterConditions = [];
      let Conditions = "";
      filterConditions.push({
        FilterKey: "StatusId",
        Operator: "eq",
        FilterValue: StatusId.PendingwithHRLeadtoAssignRecruitmentHR,
      });

      try {
        const HRMSExternalAgents = await CommonServices.GetMasterData(
          ListNames.HRMSExternalAgents
        );
        if (HRMSExternalAgents.data && HRMSExternalAgents.data.length > 0) {
          const HRMSExternalAgentsOption: AutoCompleteItem[] =
            HRMSExternalAgents.data.map((item: any) => ({
              key: item.Id,
              text: item.AgentName,
            }));

          setAssignRecruitmentAgenciesOption(HRMSExternalAgentsOption);

          setAssignRecruitmentAgencies([{ key: 0, text: "" }]);
        } else {
          setAssignRecruitmentAgenciesOption([]);

          setAssignRecruitmentAgencies([{ key: 0, text: "" }]);
        }
      } catch (error) {}

      const dataPromise = getVRRDetails.GetVacancyDetails(
        filterConditions,
        Conditions
      );

      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "";
      if (activeTab === "tab3") {
        filterConditionsRecuritment = [];
        RecuritmentConditions = "";
      } else {
        switch (props.CurrentRoleID) {
          case RoleID.RecruitmentHRLead: {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
            });
            break;
          }
          case RoleID.RecruitmentHR: {
            if (activeTab === "tab1") {
              filterConditionsRecuritment.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv,
              });
            } else if (activeTab === "tab2") {
              filterConditionsRecuritment.push({
                FilterKey: "StatusId",
                Operator: "eq",
                FilterValue:
                  StatusId.PendingwithRecruitmentHRtoAssignExternalAgency,
              });
            }
            break;
          }
          case RoleID.HOD: {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithHODtoreviewAdv,
            });
            break;
          }
        }
      }

      const recruitmentDetailsPromise = getVRRDetails.GetRecruitmentDetails(
        filterConditionsRecuritment,
        RecuritmentConditions
      );

      const [data, RecruitmentDetails] = await Promise.all([
        dataPromise,
        recruitmentDetailsPromise,
      ]);

      if (data.status === 200 && data.data !== null) {
        console.log(data, "GetVacancyDetails");
        setData(data.data[0]);
        const JobCode = data.data[0].map(
          (item: { JobCode: any; VRRID: number }) => ({
            JobCode: item.JobCode,
            VRRId: item.VRRID,
          })
        );

        const allJobData: JobCodeTilte[] = [];

        for (const { JobCode: jobCode, VRRId } of JobCode) {
          const JobTitles = props.JobInEnglishList.find(
            (item: { JobCode: any }) => item.JobCode === jobCode
          );

          if (JobTitles) {
            const JobData: JobCodeTilte = {
              id: JobTitles.JobCode,
              // name: JobTitles.text,
              VRRId: VRRId,
              JobTitle: JobTitles.text,
              JobCode: JobTitles.JobCode,
            };

            allJobData.push(JobData);
          }
        }

        const uniqueJobData = allJobData.filter(
          (job, index, self) =>
            index === self.findIndex((item) => item.id === job.id)
        );

        setJobCodeTitle(uniqueJobData);
      }

      if (
        RecruitmentDetails.status === 200 &&
        RecruitmentDetails.data !== null
      ) {
        console.log(RecruitmentDetails, "GetVacancyDetails");
        setRecruitmentDetails(RecruitmentDetails.data);
      }
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData();

        const AssignRecurtimentHROption =
          await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSRecruitmentHR);
        const AssignAgenciesOption = await CommonServices.GetADgruopsEmailIDs(
          ADGroupID.HRMSHOD
        );

        if (
          (AssignRecurtimentHROption.status === 200 &&
            AssignRecurtimentHROption.data) ||
          (AssignAgenciesOption.status === 200 && AssignAgenciesOption.data)
        ) {
          const AssignRecrutiment = AssignRecurtimentHROption.data.filter(
            (item: { key: any }) => item.key === props.stateValue?.AssignedHRId
          );

          const AssignRecrutimentObject = AssignRecrutiment.reduce(
            (acc: { [key: string]: any }, item: { key: any }) => {
              return item;
            },
            {}
          );

          setAssignRecruitmentHR(AssignRecrutimentObject);
          setAssignRecruitmentHROption(AssignRecurtimentHROption.data);
        } else {
          console.error(AssignRecurtimentHROption.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, [activeTab]);

  const onPageChange = (event: any, Type: string) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    void fetchData();
    // setActiveTab(tab);
  };
  // Popupfunction

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    if (value) {
      if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        setAssignRecruitmentAgencies([value]);
        setValidationErrors((prevState) => ({
          ...prevState,
          AssignRecruitmentAgencies: false,
        }));
      } else {
        setAssignRecruitmentHR(value);
        setValidationErrors((prevState) => ({
          ...prevState,
          AssignRecruitmentHR: false,
        }));
      }
    }
  };

  const handleAgencyChange = (value: AutoCompleteItem[]) => {
    if (value.length > 0) {
      setAssignRecruitmentAgencies(value);
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: false,
      }));
    } else {
      setAssignRecruitmentAgencies([]);
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: true,
      }));
    }
  };

  const handleCheckbox = (value: boolean, item: any) => {
    const isHR = props.CurrentRoleID === RoleID.RecruitmentHR;

    const dataset = isHR ? RecruitmentDetails : data;

    const itemIdentifier = isHR ? item.ID : item.VRRID;

    const updatedDataset = dataset.map((currentItem) => {
      const currentItemIdentifier = isHR ? currentItem.ID : currentItem.VRRID;

      if (currentItemIdentifier === itemIdentifier) {
        return {
          ...currentItem,
          Checked: value,
        };
      }
      return currentItem;
    });

    const selectedJobCodes = updatedDataset
      .filter((currentItem) => currentItem.Checked)
      .map((currentItem) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === currentItem.JobCode
        );

        return {
          JobCode: currentItem.JobCode,
          VRRId: currentItem.VRRID,
          id: currentItem.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
          RecruitmentID: isHR ? currentItem.ID : currentItem.VRRID,
        };
      });

    if (isHR) {
      setRecruitmentDetails(updatedDataset);
    } else {
      setData(updatedDataset);
    }

    setSelectedJobCodes(selectedJobCodes);
  };

  const onSelectAllChange = (value: boolean) => {
    const isHR = props.CurrentRoleID === RoleID.RecruitmentHR;

    const dataset = isHR ? RecruitmentDetails : data;

    const updatedDataset = dataset.map((item) => ({
      ...item,
      Checked: value,
    }));

    const selectedJobCodes = updatedDataset
      .filter((item) => item.Checked)
      .map((item) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === item.JobCode
        );

        const JobCodeData = isHR ? item.ID : item.VRRID;

        return {
          JobCode: item.JobCode,
          VRRId: item.VRRID,
          id: item.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
          RecruitmentID: JobCodeData,
        };
      });

    if (isHR) {
      setRecruitmentDetails(updatedDataset);
    } else {
      setData(updatedDataset);
    }

    setSelectedJobCodes(selectedJobCodes);

    setSelectAll(value);
  };

  const handleInputChangeTextArea = (
    value: string | any,
    StateValue: string
  ) => {
    setComment(value);
    setValidationErrors((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  //AssignButton function for AssignHR
  const AssignBtn_fn = () => {
    const isItemSelected = selectedJobCodes.length > 0;

    if (isItemSelected) {
      setAssignHR(true);
    } else {
      let CancelAlert = {
        Message: RecuritmentHRMsg.RecruitmentErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(CancelAlert);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (selectedJobCodes.length > 0) {
        for (const selectedJob of selectedJobCodes) {
          const correspondingJob = data.find(
            (item: any) => item.VRRID === selectedJob.VRRId
          );

          if (correspondingJob) {
            const Table1: any = {
              BusinessUnitCodeId: correspondingJob.BusinessUnitCodeId,
              Nationality: correspondingJob.Nationality,
              EmploymentCategory: correspondingJob.EmploymentCategory,
              DepartmentId: correspondingJob.DepartmentId,
              SubDepartmentId: correspondingJob.SubDepartmentId,
              SectionId: correspondingJob.SectionId,
              DepartmentCodeId: correspondingJob.DepartmentCodeId,
              NumberOfPersonNeeded: correspondingJob.NumberOfPersonNeeded,
              EnterNumberOfMonths: correspondingJob.EnterNumberOfMonths,
              TypeOfContract: correspondingJob.TypeOfContract,
              DateRequried: correspondingJob.DateRequired,
              StatusId: correspondingJob.StatusId,
              ActionId: correspondingJob.ActionId,
              JobCodeId: correspondingJob.JobCodeId,
              ReasonForVacancy: correspondingJob.ReasonForVacancy,
              AreaofWork: correspondingJob.AreaOfWork,
              VacancyConfirmed: correspondingJob.VacancyConfirmed,
              RecruitmentAuthorised: correspondingJob.RecruitmentAuthorised,
              IsPayrollEmailed: correspondingJob.IsPayrollEmailed,
              AssignedHRId: AssignRecruitmentHR.key,
            };

            const positionDetails = await getVRRDetails.GetPositionDetails(
              [
                {
                  FilterKey: "VRRID",
                  Operator: "eq",
                  FilterValue: correspondingJob.VRRID,
                },
              ],
              ""
            );

            const positionIds: number[] =
              positionDetails.data?.map(
                (item: { PositionID: number }) => item.PositionID
              ) || [];

            if (correspondingJob.NumberOfPersonNeeded > 0) {
              const updatedPositions: any[] = [];
              let positionIndex = 0;

              for (let i = 0; i < correspondingJob.NumberOfPersonNeeded; i++) {
                const positionId =
                  positionIds[positionIndex % positionIds.length];
                updatedPositions.push({
                  VRRID: correspondingJob.VRRID,
                  PatersonGradeID: correspondingJob.PayrollGradeId ?? 0,
                  DRCGradeID: correspondingJob.DRCGradeId ?? 0,
                  JobNameInEnglishID: correspondingJob.JobTitleInEnglishId ?? 0,
                  JobNameInFrenchID: correspondingJob.JobTitleInFrenchId ?? 0,
                  PositionID: positionId,
                });

                positionIndex++;
              }

              setFormState((prevState) => ({
                ...prevState,
                PositionDetails: updatedPositions,
              }));

              console.log(formState.PositionDetails);

              const response = await getVRRDetails.InsertRecruitmentDpt(
                Table1,
                updatedPositions
              );

              const recruitmentID = response?.data?.[0]?.data?.RecruitmentIDId;

              if (recruitmentID) {
                const commentsData: InsertComments = {
                  RoleId: props.CurrentRoleID,
                  RecruitmentIDId: recruitmentID,
                  Comments: Comments,
                };

                const InsertCommentsData =
                  await getVRRDetails.InsertCommentsList(commentsData);
                console.log(InsertCommentsData);

                const UpdateVRRDetails = await SPServices.SPUpdateItem({
                  Listname: ListNames.HRMSVacancyReplacementRequest,
                  RequestJSON: { ActionId: WorkflowAction.Approved },
                  ID: selectedJob.VRRId,
                });

                console.log(UpdateVRRDetails);
              } else {
              }
            }
          }
        }

        let CancelAlert = {
          Message: RecuritmentHRMsg.HRSuccess,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
            }
          },
        };

        // Show the success alert
        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      setAssignHR(false);
      setAssignRecruitmentHR({ key: 0, text: "" });
      setComment("");
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          Checked: false,
        }))
      );
      setSelectedJobCodes([]);
      setSelectAll(false);
    }
  };

  const handleAgencySubmit = async () => {
    try {
      setIsLoading(true);

      if (selectedJobCodes.length > 0) {
        for (const selectedJob of selectedJobCodes) {
          const isHR = props.CurrentRoleID === RoleID.RecruitmentHR;
          const dataset = isHR ? RecruitmentDetails : data;

          const correspondingJob = dataset.find((item) =>
            isHR
              ? item.ID === selectedJob.RecruitmentID
              : item.VRRID === selectedJob.VRRId
          );

          if (correspondingJob) {
            const recruitmentID = isHR
              ? correspondingJob.ID
              : correspondingJob.VRRID;

            const agencyIDs = AssignRecruitmentAgencies.map(
              (agency) => agency.key
            );

            if (agencyIDs.length === 0) {
              continue;
            }

            const agencyData = agencyIDs.map((agencyID) => ({
              key: agencyID,
              text:
                AssignRecruitmentAgencies.find(
                  (agency) => agency.key === agencyID
                )?.text || AssignRecruitmentHR.text,
              RecruitmentID: recruitmentID,
            }));

            const response = await getVRRDetails.InsertExternalAgencyDetails(
              agencyData,
              recruitmentID
            );

            if (response.status === 200) {
            } else {
            }

            try {
              const UpdateVRRDetails = await SPServices.SPUpdateItem({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                RequestJSON: { ActionId: WorkflowAction.Approved },
                ID: recruitmentID,
              });

              console.log(UpdateVRRDetails);
            } catch (updateError) {
              console.error(updateError);
            }

            if (Array.isArray(Comments) && Comments.length > 0) {
              for (const comment of Comments) {
                const commentsData: InsertComments = {
                  RoleId: props.CurrentRoleID,
                  RecruitmentIDId: recruitmentID,
                  Comments: comment,
                };

                const InsertCommentsData =
                  await getVRRDetails.InsertCommentsList(commentsData);
                console.log(InsertCommentsData);
              }
            } else {
              const commentsData: InsertComments = {
                RoleId: props.CurrentRoleID,
                RecruitmentIDId: recruitmentID,
                Comments: Comments,
              };

              const InsertCommentsData = await getVRRDetails.InsertCommentsList(
                commentsData
              );
              console.log(InsertCommentsData);
            }
          } else {
            console.log(
              `No corresponding job found for RecruitmentID/VRRId: ${selectedJob.RecruitmentID}`
            );
          }
        }

        let CancelAlert = {
          Message: RecuritmentHRMsg.AgencySucess,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
            }
          },
        };

        setAlertPopupOpen(true);
        setalertProps(CancelAlert);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      setAssignHR(false);
      setAssignRecruitmentAgencies([{ key: 0, text: "" }]);
      setComment("");

      if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        setRecruitmentDetails((prevData) =>
          prevData.map((item) => ({
            ...item,
            Checked: false,
          }))
        );
      } else {
        setData((prevData) =>
          prevData.map((item) => ({
            ...item,
            Checked: false,
          }))
        );
      }

      setSelectedJobCodes([]);
      setSelectAll(false);
    }
  };

  async function AssignHRSubmit() {
    try {
      setValidationErrors({
        AssignRecruitmentHR: false,
        Comments: false,
        AssignRecruitmentAgencies: false,
      });

      let errors: any = {};

      if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        if (!AssignRecruitmentAgencies[0]?.key) {
          errors.AssignRecruitmentAgencies = "Please select an agency.";
        }
      } else {
        if (!AssignRecruitmentHR.key) {
          errors.AssignRecruitmentHR = "Please select an HR.";
        }
      }

      if (!Comments.trim()) {
        errors.Comments = "Please enter a reason.";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      const datasetToUpdate =
        props.CurrentRoleID === RoleID.RecruitmentHR
          ? RecruitmentDetails
          : data;

      const updatedRowData = datasetToUpdate.map((item: any) => {
        const selectedJob = allJobData.find((job) => job.VRRId === item.ID);

        if (selectedJob) {
          return {
            ...item,
            AssignHR: AssignRecruitmentHR.key,
            AssignAgencies: AssignRecruitmentAgencies[0]?.key,
          };
        }
        return item;
      });

      if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        setRecruitmentDetails(updatedRowData);
      } else {
        setData(updatedRowData);
      }

      for (const job of allJobData) {
        const itemToUpdate = datasetToUpdate.find(
          (item: any) => item.ID === job.VRRId
        );

        if (!itemToUpdate) {
          continue;
        }

        const obj = {
          ID: itemToUpdate.ID,
          AssignHR: AssignRecruitmentHR.key,

          AssignAgencies: AssignRecruitmentAgencies[0]?.key,
        };

        try {
          const updateResponse = await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSVacancyReplacementRequest,
            RequestJSON: obj,
            ID: job.VRRId,
          });

          console.log(updateResponse);
        } catch (error) {
          console.error(error);
        }
      }

      if (props.CurrentRoleID === RoleID.RecruitmentHRLead) {
        await handleSubmit();
      } else if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        await handleAgencySubmit();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const tabs = [
    ...(props.CurrentRoleID === RoleID.RecruitmentHRLead
      ? [
          {
            label: TabName.AssignRecuritmentHR, //"Assign Recuritment HR",
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  {console.log(props, "propsDept")}
                  {/* <SearchableDataTable
                                data={data}
                                columns={columnConfig("tab1", "view", TabName.AssignRecuritmentHR,)}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "Recruitment")}
                                handleRefresh={() => handleRefresh("tab1")}
                            /> */}
                  <CheckboxDataTable //AssignHR
                    data={data}
                    columns={columnConfig(
                      "tab1",
                      "view",
                      TabName.AssignRecuritmentHR
                    )}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "Recruitment")}
                    handleRefresh={() => handleRefresh("tab1")}
                    handleAssignBtn={AssignBtn_fn}
                    AssignBtnValidation={false}
                    handleCheckbox={handleCheckbox}
                    selectAll={selectAll}
                    onSelectAllChange={onSelectAllChange}
                    assignLabel={
                      props.CurrentRoleID === RoleID.RecruitmentHR
                        ? "Assign Agencies"
                        : "Assign HR"
                    }
                    //checkedValue={}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.UploadONEMDoc, //"upload Signed Doc",
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecruitmentDetails}
                    columns={columnConfig(
                      "tab2",
                      "upload",
                      TabName.UploadONEMDoc
                    )}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "VRR")}
                    handleRefresh={() => handleRefresh("tab2")}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.MySubmission, //"My Submission",
            value: "tab3",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecruitmentDetails}
                    columns={columnConfig("tab3", "view", TabName.MySubmission)}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "VRR")}
                    handleRefresh={() => handleRefresh("tab3")}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]
      : [
          ...(props.CurrentRoleID === RoleID.RecruitmentHR
            ? [
                {
                  label: TabName.UploadAdvertisement, //"Upload Advertisement",
                  value: "tab1",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <SearchableDataTable
                          data={RecruitmentDetails}
                          columns={columnConfig(
                            "tab1",
                            "upload",
                            TabName.UploadAdvertisement
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab1")}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: TabName.AssignAgencies, //"Assigne Agencies",
                  value: "tab2",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        {/* <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab2", "view", TabName.AssignAgencies)}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab2")}
                                /> */}
                        <CheckboxDataTable //AssignAgency
                          data={RecruitmentDetails}
                          columns={columnConfig(
                            "tab2",
                            "view",
                            TabName.AssignAgencies
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab2")}
                          handleAssignBtn={AssignBtn_fn}
                          AssignBtnValidation={false}
                          handleCheckbox={handleCheckbox}
                          selectAll={selectAll}
                          onSelectAllChange={onSelectAllChange}
                          assignLabel={
                            props.CurrentRoleID === RoleID.RecruitmentHR
                              ? "Assign Agencies"
                              : "Assign HR"
                          }
                          //checkedValue={}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: TabName.ReviewProfile, //"Review Profiles",
                  value: "tab3",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <SearchableDataTable
                          data={RecruitmentDetails}
                          columns={columnConfig(
                            "tab3",
                            "edit",
                            TabName.ReviewProfile
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab3")}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: TabName.MySubmission, //"My submission",
                  value: "tab4",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <SearchableDataTable
                          data={RecruitmentDetails}
                          columns={columnConfig(
                            "tab4",
                            "view",
                            TabName.MySubmission
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab4")}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: TabName.AssignInterviewPanel, //"Assigne InterviewPanel",
                  value: "tab5",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <SearchableDataTable
                          data={RecruitmentDetails}
                          columns={columnConfig(
                            "tab5",
                            "edit",
                            TabName.AssignInterviewPanel
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab5")}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
              ]
            : [
                ...(props.CurrentRoleID === RoleID.HOD
                  ? [
                      {
                        label: TabName.ReviewONEMAdvertisement, // "Pending Approval",
                        value: "tab1",
                        content: (
                          <Card
                            variant="outlined"
                            sx={{
                              boxShadow: "0px 2px 4px 3px #d3d3d3",
                              marginTop: "2%",
                            }}
                          >
                            <CardContent>
                              <SearchableDataTable
                                data={RecruitmentDetails}
                                columns={columnConfig(
                                  "tab1",
                                  "edit",
                                  TabName.ReviewONEMAdvertisement
                                )}
                                rows={rows}
                                onPageChange={(event) =>
                                  onPageChange(event, "VRR")
                                }
                                handleRefresh={() => handleRefresh("tab1")}
                              />
                            </CardContent>
                          </Card>
                        ),
                      },
                    ]
                  : [
                      ...(props.CurrentRoleID === RoleID.LineManager
                        ? [
                            {
                              label: TabName.ReviewProfile, //"Review Profiles",
                              value: "tab1",
                              content: (
                                <Card
                                  variant="outlined"
                                  sx={{
                                    boxShadow: "0px 2px 4px 3px #d3d3d3",
                                    marginTop: "2%",
                                  }}
                                >
                                  <CardContent>
                                    <SearchableDataTable
                                      data={RecruitmentDetails}
                                      columns={columnConfig(
                                        "tab1",
                                        "edit",
                                        TabName.ReviewProfile
                                      )}
                                      rows={rows}
                                      onPageChange={(event) =>
                                        onPageChange(event, "VRR")
                                      }
                                      handleRefresh={() =>
                                        handleRefresh("tab1")
                                      }
                                    />
                                  </CardContent>
                                </Card>
                              ),
                            },
                          ]
                        : []),
                    ]),
              ]),
        ]),
  ];

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    console.log("Active Tab:", newTab);
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
            {console.log(first, "first")}
          </div>
        </React.Fragment>
      </CustomLoader>
      {AlertPopupOpen ? (
        <CustomAlert
          {...alertProps}
          onClose={() => setAlertPopupOpen(false)} // Close alert on button click
        />
      ) : null}
      {AssignHR ? (
        <Dialog
          visible={AssignHR}
          style={{
            width: "60vw",
            backgroundColor: "white",
            borderRadius: "26px",
            padding: "20px",
            maxHeight: "85vh",
            overflow: "hidden",
          }}
          onHide={() => setAssignHR(false)}
        >
          <div
            style={{
              maxHeight: "calc(80vh - 40px)",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <JobCodeSelector
              jobCodes={data}
              selectedJobCodes={selectedJobCodes}
              //onSelectionChange={onSelectionChange}
              onSelectAllChange={onSelectAllChange}
              onRowChange={handleCheckbox}
              label={
                props.CurrentRoleID === RoleID.RecruitmentHR
                  ? "Assign Agencies"
                  : "Assign Recruitment HR"
              }
            />
            <span style={{ color: "red", marginTop: "8px", display: "block" }}>
              Note:- To remove a selected Job Title ,click 'Cancel' and return
              to the Dashboard.
            </span>

            <div className="ms-Grid-row" style={{ textAlign: "left" }}>
              <div className="ms-Grid-col ms-lg4">
                {props.CurrentRoleID === RoleID.RecruitmentHRLead ? (
                  <CustomAutoComplete
                    label="Assign Recruitment HR"
                    options={AssignRecruitmentHROption}
                    value={AssignRecruitmentHR}
                    disabled={false}
                    mandatory={true}
                    onChange={(item) => handleAutoComplete(item)}
                    error={validationErrors.AssignRecruitmentHR}
                  />
                ) : (
                  <>
                    <CustomMultiSelect
                      label="Assign Agencies"
                      disabled={false}
                      mandatory={true}
                      value={
                        AssignRecruitmentAgencies?.filter(
                          (item) => item.key !== 0
                        ) ?? []
                      }
                      options={AssignRecruitmentAgenciesOption ?? []}
                      onChange={handleAgencyChange}
                      error={validationErrors.AssignRecruitmentAgencies}
                    />
                    {props.CurrentRoleID === RoleID.RecruitmentHR && (
                      <span
                        style={{
                          color: "red",
                          marginTop: "8px",
                          display: "block",
                        }}
                      >
                        Note:- You can assign multiple Agencies.
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12">
                <CustomTextArea
                  label={
                    props.CurrentRoleID === RoleID.RecruitmentHR
                      ? "Notes for Agencies"
                      : "Notes for RecruitmentHR"
                  }
                  value={Comments}
                  error={validationErrors.Comments}
                  onChange={(value) =>
                    handleInputChangeTextArea(value, "Comments")
                  }
                  mandatory={true}
                  placeholder={
                    props.CurrentRoleID === RoleID.RecruitmentHRLead
                      ? "You may provide Hiring Lining Manager and Hiring HOD name and number here to RecruitmentHR...."
                      : ""
                  }
                />
              </div>
            </div>
            <div className="ms-Grid-row" style={{ marginTop: "20px" }}></div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4"></div>
              <div className="ms-Grid-col ms-lg2">
                <ReuseButton
                  label="Cancel"
                  onClick={() => setAssignHR(false)}
                  Style={{
                    border: "0",
                    borderRadius: ".25em",
                    background: "#dc3741",
                    color: "#fff",
                    fontSize: "1em",
                    display: "inline-block",
                  }}
                />
              </div>
              <div className="ms-Grid-col ms-lg2">
                <ReuseButton
                  label="Assign"
                  onClick={async () => {
                    await AssignHRSubmit();
                  }}
                  Style={{
                    border: "0",
                    borderRadius: ".25em",
                    background: "#dc3741",
                    color: "#fff",
                    fontSize: "1em",
                    display: "inline-block",
                  }}
                />
              </div>
              <div className="ms-Grid-col ms-lg4"></div>
            </div>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};
export default RecruitmentProcess;
