import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import { ButtonAction, labelNames } from "../../utilities/LabelName";
import {
  HRMSAlertOptions,
  RecuritmentHRMsg,
  TabName,
} from "../../utilities/Config";
import CustomInput from "../../components/CustomInput";
import { AdminCreateUser, validationUser } from "../../Models/AdminPanel";
import CustomDatePicker from "../../components/CustomDatePicker";
import ReuseButton from "../../components/ReuseButton";
import { ILabelStyles, Label } from "@fluentui/react";
import IsValid from "../../components/Validation";

const AdminPanelPage: React.FC = (props: any) => {
  const labelStyles: ILabelStyles = {
    root: { marginTop: 10, overflowWrap: "inherit" },
  };
  const todaydate = new Date();
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  // const [ButtonLabel, setButtonLabel] = useState<string>("Submit");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [data, setdata] = useState<AdminCreateUser>({
    FirstName: "",
    LastName: "",
    CompanyName: "",
    Designation: "",
    EmailID: "",
    UserType: "",
    Password: "",
    ConfirmPassword: "",
    IsActive: false,
    NoOfUsers: "",
    StartDateOfContract: undefined,
    EndDateOfContract: undefined,
    Nationality: "",
    AddUser: [],
  });
  const [ValidityState, setValidityState] = useState<validationUser>({
    FirstName: false,
    LastName: false,
    CompanyName: false,
    Designation: false,
    EmailID: false,
    UserType: false,
    Password: false,
    ConfirmPassword: false,
    IsActive: false,
    NoOfUsers: false,
    StartDateOfContract: false,
    EndDateOfContract: false,
    Nationality: false,
    AddUser: [],
  });

  useEffect(() => {
    try {
      setIsLoading(true);
      let BreadcrumbsData = [
        { tabName: props.stateValue?.TabNames },
        { tabName: TabName.CreateAdminPage },
      ];
      setTabNameData(BreadcrumbsData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [activeTab]);

  const toggleStatus = () => {
    setdata((prevState) => ({
      ...prevState,
      IsActive: !prevState.IsActive,
    }));
    setValidityState((prevState) => ({
      ...prevState,
      IsActive: false,
    }));
  };

  const handleInputChange = (state: any, value: string) => {
    setdata((prevState) => ({
      ...prevState,
      [state]: value,
    }));
    setValidityState((prevState) => ({
      ...prevState,
      [state]: false,
    }));
  };

  const handleDateChange = (value: Date | null, stateKey: string) => {
    setdata((prevState) => ({
      ...prevState,
      [stateKey]: value,
    }));
    setValidityState((prevState) => ({
      ...prevState,
      [stateKey]: false,
    }));
  };

  const handleAddUserChange = (index: number, field: string, value: string) => {
    const updatedAddUser = [...data.AddUser];
    updatedAddUser[index] = {
      ...updatedAddUser[index],
      [field]: value,
    };
    setdata((prevState) => ({
      ...prevState,
      AddUser: updatedAddUser,
    }));
    setValidityState((prevState) => {
      const updatedAddUserValidity = [...prevState.AddUser];
      updatedAddUserValidity[index] = {
        ...updatedAddUserValidity[index],
        [field]: false,
      };
      return {
        ...prevState,
        AddUser: updatedAddUserValidity,
      };
    });
  };

  const toggleIsActive = (index: number, value: boolean) => {
    const updatedAddUser = [...data.AddUser];
    updatedAddUser[index] = {
      ...updatedAddUser[index],
      IsActive: value,
    };
    setdata((prevState) => ({
      ...prevState,
      AddUser: updatedAddUser,
    }));
    setValidityState((prevState) => {
      const updatedAddUserValidity = [...prevState.AddUser];
      updatedAddUserValidity[index] = {
        ...updatedAddUserValidity[index],
        IsActive: false,
      };
      return {
        ...prevState,
        AddUser: updatedAddUserValidity,
      };
    });
  };

  const AddUser_fn = () => {
    const newUser = {
      UserName: "",
      PhoneNumber: 0,
      EmailID: "",
      Designation: "",
      IsActive: false,
    };
    setdata((prevState) => ({
      ...prevState,
      AddUser: [...prevState.AddUser, newUser],
    }));
    setValidityState((prevState) => {
      const updatedAddUserValidity = [...prevState.AddUser];
      updatedAddUserValidity[1] = {
        ...updatedAddUserValidity[1],
        IsActive: true,
      };
      return {
        ...prevState,
        AddUser: updatedAddUserValidity,
      };
    });
  };

  const RemoveUser_fn = (index: number) => {
    const updatedAddUser = [...data.AddUser];
    updatedAddUser.splice(index, 1);
    setdata((prevState) => ({
      ...prevState,
      AddUser: updatedAddUser,
    }));
  };

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/AdminPanelDashboard", {
            state: {
              TabName: props.stateValue?.TabName,
              tab: props.stateValue?.tab,
            },
          });
          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };

    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  };

  const ValidationAction = () => {
    let ValidityStateCopy: validationUser = { ...ValidityState };
    ValidityStateCopy.FirstName = !IsValid(data.FirstName);
    ValidityStateCopy.LastName = !IsValid(data.FirstName);
    ValidityStateCopy.CompanyName = !IsValid(data.FirstName);
    ValidityStateCopy.Designation = !IsValid(data.FirstName);
    ValidityStateCopy.EmailID = !IsValid(data.FirstName);
    ValidityStateCopy.Password = !IsValid(data.FirstName);
    ValidityStateCopy.ConfirmPassword = !IsValid(data.FirstName);
    ValidityStateCopy.IsActive = !IsValid(data.FirstName);
    ValidityStateCopy.NoOfUsers = !IsValid(data.FirstName);
    ValidityStateCopy.StartDateOfContract = !IsValid(data.FirstName);
    ValidityStateCopy.EndDateOfContract = !IsValid(data.FirstName);
    ValidityStateCopy.Nationality = !IsValid(data.FirstName);

    setValidityState(ValidityStateCopy);

    return Object.values(ValidityStateCopy).some((error) => error);
  };

  const Submit_fn = () => {
    const IsVaild = !ValidationAction();
    if (IsVaild) {
      //Submit API Call
      alert("Form Submitted Successfully");
    }
  };

  const tabs = [
    {
      label: TabName.PositionDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 7px 4px 3px #d3d3d3",
            borderRadius: "10px",
            marginTop: "2%",
          }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.FirstName}
                    value={data.FirstName}
                    error={ValidityState.FirstName}
                    disabled={false}
                    mandatory={true}
                    onChange={(value) => handleInputChange("FirstName", value)}
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.LastName}
                    value={data.LastName}
                    disabled={false}
                    error={ValidityState.LastName}
                    mandatory={false}
                    onChange={(value) => handleInputChange("LastName", value)}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.CompanyName}
                    value={data.CompanyName}
                    disabled={false}
                    error={ValidityState.CompanyName}
                    mandatory={false}
                    onChange={(value) =>
                      handleInputChange("CompanyName", value)
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.Designation}
                    value={data.Designation}
                    disabled={false}
                    error={ValidityState.Designation}
                    mandatory={false}
                    onChange={(value) =>
                      handleInputChange("Designation", value)
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.Nationality}
                    value={data.Nationality}
                    error={ValidityState.Nationality}
                    disabled={false}
                    mandatory={false}
                    onChange={(value) =>
                      handleInputChange("Nationality", value)
                    }
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.NoOfUsers}
                    value={data.NoOfUsers}
                    disabled={false}
                    error={ValidityState.NoOfUsers}
                    mandatory={false}
                    onChange={(value) => handleInputChange("NoOfUsers", value)}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomDatePicker
                    selectedDate={data.StartDateOfContract}
                    label={labelNames.AdminPanel.StartDateOfContract}
                    error={ValidityState.StartDateOfContract}
                    minDate={todaydate}
                    mandatory={true}
                    disabled={false}
                    onChange={(date) =>
                      handleDateChange(date, "StartDateOfContract")
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomDatePicker
                    selectedDate={data.EndDateOfContract}
                    label={labelNames.AdminPanel.EndDateOfContract}
                    error={ValidityState.EndDateOfContract}
                    minDate={todaydate}
                    mandatory={true}
                    disabled={false}
                    onChange={(date) =>
                      handleDateChange(date, "EndDateOfContract")
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.EmailID}
                    value={data.EmailID}
                    error={ValidityState.EmailID}
                    disabled={false}
                    mandatory={false}
                    onChange={(value) => handleInputChange("EmailID", value)}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.Password}
                    value={data.Password}
                    disabled={false}
                    error={ValidityState.Password}
                    mandatory={false}
                    onChange={(value) => handleInputChange("Password", value)}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.ConfirmPassword}
                    value={data.ConfirmPassword}
                    disabled={false}
                    error={ValidityState.ConfirmPassword}
                    mandatory={false}
                    onChange={(value) =>
                      handleInputChange("ConfirmPassword", value)
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "134px",
                }}
              >
                <Label styles={labelStyles}>
                  {"IsActive"}
                  {<span style={{ color: "red" }}> *</span>}
                </Label>
                <div
                  onClick={toggleStatus}
                  style={{
                    width: "60px",
                    height: "28px",
                    borderRadius: "20px",
                    backgroundColor: data.IsActive ? "#0ccf44" : "#ccc",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    cursor: "pointer",
                    transition: "0.3s",
                    marginTop: "10%",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transform: data.IsActive
                        ? "translateX(30px)"
                        : "translateX(0px)",
                      transition: "0.3s",
                    }}
                  ></div>
                </div>
              </div>

              <div
                className="ms-Grid-row"
                style={{ marginTop: "2%", width: "66%" }}
              >
                <div className="ms-Grid-col ms-lg3">
                  <ReuseButton
                    label="Add User"
                    onClick={() => AddUser_fn()}
                    spacing={4}
                    Style={{ minWidth: "100%", height: "31px" }}
                  />
                </div>
              </div>
              {data.AddUser.length > 0 && (
                <Card
                  variant="outlined"
                  sx={{
                    boxShadow: "0px 7px 4px 3px #d3d3d3",
                    borderRadius: "10px",
                    marginTop: "2%",
                  }}
                >
                  <CardContent>
                    <div>
                      <div>
                        {data.AddUser.map((item, index) => (
                          <div key={index} style={{ marginTop: "2%" }}>
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.FullName}
                                  value={item.UserName}
                                  error={ValidityState.AddUser[index]?.UserName}
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "UserName",
                                      value
                                    );
                                  }}
                                />
                              </div>
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.PhoneNumber}
                                  value={item.PhoneNumber}
                                  error={
                                    ValidityState.AddUser[index]?.PhoneNumber
                                  }
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "PhoneNumber",
                                      value
                                    );
                                  }}
                                />
                              </div>
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.EmailID}
                                  value={item.EmailID}
                                  error={ValidityState.AddUser[index]?.EmailID}
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "EmailID",
                                      value
                                    );
                                  }}
                                />
                              </div>
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.Designation}
                                  value={item.Designation}
                                  error={
                                    ValidityState.AddUser[index]?.Designation
                                  }
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "Designation",
                                      value
                                    );
                                  }}
                                />
                              </div>
                              <div
                                className="ms-Grid-col ms-lg2"
                                style={{ marginTop: "4%" }}
                              >
                                <ReuseButton
                                  label="Remove User"
                                  onClick={() => RemoveUser_fn(index)}
                                  spacing={4}
                                  Style={{ minWidth: "80%", height: "31px" }}
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "134px",
                                  marginTop: "2%",
                                }}
                              >
                                <Label styles={labelStyles}>
                                  {"IsActive"}
                                  {<span style={{ color: "red" }}> *</span>}
                                </Label>
                                <div
                                  onClick={() =>
                                    toggleIsActive(index, !item.IsActive)
                                  }
                                  style={{
                                    width: "60px",
                                    height: "28px",
                                    borderRadius: "20px",
                                    backgroundColor: item.IsActive
                                      ? "#0ccf44"
                                      : "#ccc",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "4px",
                                    cursor: "pointer",
                                    transition: "0.3s",
                                    marginTop: "10%",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor: "#fff",
                                      transform: item.IsActive
                                        ? "translateX(30px)"
                                        : "translateX(0px)",
                                      transition: "0.3s",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <BreadcrumbsComponent
            items={tabs}
            initialItem={activeTab}
            TabName={TabNameData}
            handleCancel={handleCancel}
            onBreadcrumbChange={handleBreadcrumbChange}
            additionalButtons={[
              {
                label: ButtonAction.Submit,
                onClick: async () => {
                  Submit_fn();
                },
              },
            ]}
          />
        </div>
      </CustomLoader>

      {AlertPopupOpen ? (
        <>
          <CustomAlert
            {...alertProps}
            onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminPanelPage;
