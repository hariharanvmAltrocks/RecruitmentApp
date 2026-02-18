import * as React from "react";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { AdminPItem } from "../../Models/AdminPanel";
import TabsComponent from "../../components/TabsComponent ";
import { TabName, tabType } from "../../utilities/Config";
import { Card, CardContent } from "@mui/material";
import { StatusDetails, TabDetails } from "../../Models/Master";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import { AdminPanelServices } from "../../Services/ServiceExport";
import { ButtonAction, ExternalUserType } from "../../utilities/LabelName";

const AdminPanelDashboard = (props: any) => {
  const [data, setdata] = React.useState<AdminPItem[] | null>([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  //   const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  //   const [alertProps, setalertProps] = React.useState<alertPropsData>({
  //     Message: "",
  //     Type: "",
  //     ButtonAction: null,
  //     visible: false,
  //   });
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>([]);

  const storedStringRef = React.useRef("");

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
  ) {
    props.navigation("/AdminPanelDashboard/AdminPanelPage", {
      state: {
        TabName: TabName,
        tab: tab,
        ButtonAction: ButtonAction,
        rowData: rowData,
      },
    });
  }

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabNames: string,
  ) => [
    // {
    //   field: "userId",
    //   header: "User ID",
    //   sortable: true,
    // },
    {
      field: "exUserCode",
      header: "User Code",
      sortable: true,
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      style: { width: "8%" },
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <>
              <img
                src={require("../../assets/Editbutton.svg")}
                alt="Stamp Icon"
                onClick={() =>
                  handleRedirectView(rowData, tab, TabNames, ButtonAction.Edit)
                }
                style={{
                  width: "50%",
                  height: "auto",
                  maxWidth: "40px",
                  cursor: "pointer",
                }}
              />
            </>
          </div>
        );
      },
    },
  ];

  const fetchData = async (tab: string, row: number, CurrentPage?: number) => {
    setIsLoading(true);
    try {
      let FilterType =
        tab === "tab1" ? ExternalUserType.LabourHire : ExternalUserType.Agent;
      let FilterValue: AdminPItem = {
        hrUserId: String(props.userDetails[0]?.ID),
        type: FilterType,
        pagination: {
          filterValue: "",
          sortBy: "",
          sortOrder: 0,
          pageSize: row ? row : rows,
          currentPage: 1,
          totalItems: 0,
        },
      };

      await AdminPanelServices.getAdminPanelDashboard(FilterValue)
        .then(async (res) => {
          setdata(res.data);
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    void fetchData(activeTab, rows);
  }, [activeTab]);

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        let TabDetails: any;
        if (props.stateValue) {
          storedStringRef.current = props.stateValue?.TabName;
          setactiveTab(props.stateValue?.tab);
          TabDetails = props.TabDetails[0] ?? [];
          setTabNameData(TabDetails);
        } else {
          TabDetails = props.TabDetails[0] ?? [];
          setTabNameData(TabDetails);
        }
        // void fetchData(activeTab, rows);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, []);

  const handleTabChange = (newTab: string) => {
    setactiveTab(newTab);
  };

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setPagination({
      first: event.first,
      rows: event.rows,
      totalPages: event.totalPages,
    });
    setRows(event.rows);
    let PageItem = event.rows * event.totalPages;
    void fetchData(activeTab, PageItem, event.totalPages);
  };

  const handleRefresh = (tab: string) => {
    void fetchData(tab, rows);
  };

  const handleNewBtAction = () => {
    props.navigation("/AdminPanelDashboard/AdminPanelPage", {
      state: {
        TabName: activeTab === "tab1" ? TabName.LabourHire : TabName.Agent,
        tab: activeTab,
        ButtonAction: ButtonAction.New,
      },
    });
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[],
  ) => {
    // storedStringRef.current = "";
    if (TabValue === activeTab) {
      if (storedStringRef.current !== TabNames) {
        storedStringRef.current = TabNames;
      } else {
        storedStringRef.current = "";
      }
    }
    let Action: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
    }

    switch (TabNames) {
      case TabName.LabourHire:
      case TabName.Agent:
        return (
          <ReviewProfileDatatable
            data={data ?? []}
            columns={columnConfig(
              TabValue,
              Number(Action[0]?.Action?.[0]),
              TabNames,
            )}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
            pagination={pagination}
            AdminLoginUser={true}
            handleUploadCV={() => handleNewBtAction()}
          />
        );
      default:
        return null;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: tab.TabName,
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>{renderTable(tab.TabName, tab.Value, tab.StatusDetails)}</div>
        </CardContent>
      </Card>
    ),
  }));

  return (
    <>
      <>
        <CustomLoader isLoading={isLoading}>
          <div className="menu-card">
            <React.Fragment>
              <TabsComponent
                tabs={tabs}
                initialTab={activeTab}
                tabtype={tabType.Dashboard}
                onTabChange={handleTabChange}
                // tabClassName={"Tab"}
              />
            </React.Fragment>
          </div>
        </CustomLoader>
      </>

      {/* {AlertPopupOpen ? (
        <>
          <CustomAlert
            {...alertProps}
            onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
          />
        </>
      ) : (
        <></>
      )} */}
    </>
  );
};
export default AdminPanelDashboard;
