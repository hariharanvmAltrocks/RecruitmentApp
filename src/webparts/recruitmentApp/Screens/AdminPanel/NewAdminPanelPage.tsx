import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  ButtonAction,
  ExternalUserType,
  labelNames,
} from "../../utilities/LabelName";
import {
  HRMSAlertOptions,
  ListNames,
  NationalityOption,
  RecuritmentHRMsg,
  ResponeStatus,
  TabName,
} from "../../utilities/Config";
import CustomInput from "../../components/CustomInput";
import {
  AdminCreateUser,
  UpsertExternalUser,
  validationUser,
} from "../../Models/AdminPanel";
import CustomDatePicker from "../../components/CustomDatePicker";
import { ILabelStyles, Label } from "@fluentui/react";
import IsValid from "../../components/Validation";
import {
  AdminPanelServices,
  CommonServices,
} from "../../Services/ServiceExport";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { toUTC } from "../../components/TabMerge";

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
    ExternalID: 0,
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
    Nationality: { key: 0, text: "" },
    AgentCode: "",
    AddUser: [],
  });
  const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [isInvalidConPassword, setIsInvalidConPassword] =
    useState<boolean>(false);

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
    AddUserValidation: false,
  });

  const getExternalUserCode = async () => {
    setIsLoading(true);
    try {
      await CommonServices.GetMasterData(ListNames.HRMSExternalAgents).then(
        (res) => {
          let prefix =
            props.stateValue.TabName === TabName.Agent ? "ANT" : "LHC";

          let externalUsers = res.data.filter(
            (item) =>
              item.UserType ===
              (props.stateValue.TabName === TabName.Agent
                ? ExternalUserType.Agent
                : ExternalUserType.LabourHire)
          );

          let lastCode = externalUsers.length
            ? externalUsers[externalUsers.length - 1].AgentCode
            : prefix + "001";
          let numPart = parseInt(lastCode.replace(prefix, ""));
          let newNum = numPart + 1;
          let newCode =
            prefix +
            newNum.toString().padStart(lastCode.length - prefix.length, "0");
          setdata((prevState) => ({
            ...prevState,
            AgentCode: newCode,
            UserType:
              props.stateValue.TabName === TabName.Agent
                ? ExternalUserType.Agent
                : ExternalUserType.LabourHire,
          }));
        }
      );
    } catch (error) {
      console.error("Error fetching External User Code:", error);
    }
    setIsLoading(false);
  };

  const fetchDataForEdit = async () => {
    setIsLoading(true);
    try {
      const editData = props.stateValue?.rowData;
      let ExternalUser = editData?.ExternalUsersAccounts.map((user: any) => ({
        FirstName: user.firstname,
        LastName: user.lastname,
        PhoneNumber: user.PhoneNumber,
        EmailID: user.email,
        IsActive: user.isActive === 1 ? true : false,
        IsAlreadythere: true,
      }));
      let ExternalData = await CommonServices.GetMasterData(
        ListNames.HRMSExternalAgents
      );
      let GetID = ExternalData.data.filter(
        (item) => item.AgentCode === editData?.exUserCode
      );
      setdata({
        ExternalID: GetID[0].ID,
        FirstName: editData?.firstName || "",
        LastName: editData?.lastName || "",
        CompanyName: editData?.name || "",
        Designation: editData?.designation || "",
        EmailID: editData?.email || "",
        UserType:
          props.stateValue.TabName === TabName.Agent
            ? ExternalUserType.Agent
            : ExternalUserType.LabourHire || "",
        Password: editData?.Password || "",
        ConfirmPassword: editData?.Password || "",
        IsActive: editData?.isActive,
        NoOfUsers: editData?.noOfUsers || "",
        StartDateOfContract: editData?.contractStartDate
          ? new Date(editData.contractStartDate)
          : undefined,
        EndDateOfContract: editData?.contractEndDate
          ? new Date(editData.contractEndDate)
          : undefined,
        Nationality: { key: 0, text: editData?.isExpat },
        AgentCode: editData?.exUserCode || "",
        AddUser: ExternalUser || [],
      });
    } catch (error) {
      console.error("Error fetching data for edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      let BreadcrumbsData = [
        { tabName: props.stateValue?.TabName },
        { tabName: TabName.CreateAdminPage },
      ];
      setTabNameData(BreadcrumbsData);
      setIsLoading(false);
      if (props.stateValue?.ButtonAction === ButtonAction.New) {
        void getExternalUserCode();
      } else {
        void fetchDataForEdit();
      }
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
    if (state === "NoOfUsers") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    if (state === "EmailID") {
      value = value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isInvalidEmail = value.length > 0 && !emailRegex.test(value);
      setIsInvalidEmail(isInvalidEmail);
    }
    if (state === "Password") {
      value = value.trim();

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
      const isInvalidPassword = value.length > 0 && !passwordRegex.test(value);
      setIsInvalidPassword(isInvalidPassword);
    }
    if (state === "ConfirmPassword") {
      value = data.Password !== value ? value : data.Password;
      setIsInvalidConPassword(data.Password !== value);
    }
    setdata((prevState) => ({
      ...prevState,
      [state]: value,
    }));
    setValidityState((prevState) => ({
      ...prevState,
      [state]: false,
    }));
  };

  const handleAutoComplete = async (
    key: keyof AdminCreateUser,
    value: AutoCompleteItem | null
  ) => {
    setdata((prevState) => ({
      ...prevState,
      [key]: value || { key: 0, text: "" },
    }));
    setValidityState((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleDateChange = (value: Date | null, stateKey: string) => {
    if (stateKey === "EndDateOfContract" && data.StartDateOfContract && value) {
      if (value < data.StartDateOfContract) {
        return;
      }
    }
    setdata((prevState) => ({
      ...prevState,
      [stateKey]: value,
    }));
    setValidityState((prevState) => ({
      ...prevState,
      [stateKey]: false,
    }));
  };

  // const handleAddUserChange = (index: number, field: string, value: string) => {
  //   const updatedAddUser = [...data.AddUser];
  //   if (field === "PhoneNumber") {
  //     if (!/^\d*$/.test(value)) {
  //       return;
  //     }
  //   }
  //   if (field === "EmailID") {
  //     value = value.trim();

  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     const isInvalidEmail = value.length > 0 && !emailRegex.test(value);
  //     updatedAddUser[index] = {
  //       ...updatedAddUser[index],
  //       EmailIDValidation: isInvalidEmail,
  //     };
  //   }
  //   if (field === "Password") {
  //     value = value.trim();

  //     const passwordRegex =
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  //     const isInvalidPassword = value.length > 0 && !passwordRegex.test(value);
  //     updatedAddUser[index] = {
  //       ...updatedAddUser[index],
  //       PasswordValidation: isInvalidPassword,
  //     };
  //   }
  //   if (field === "ConfirmPassword") {
  //     value = data.Password !== value ? value : data.Password;
  //     updatedAddUser[index] = {
  //       ...updatedAddUser[index],
  //       ConfirmPWValidation: data.AddUser[index].Password !== value,
  //     };
  //   }
  //   updatedAddUser[index] = {
  //     ...updatedAddUser[index],
  //     [field]: value,
  //   };
  //   setdata((prevState) => ({
  //     ...prevState,
  //     AddUser: updatedAddUser,
  //   }));
  //   setValidityState((prevState) => {
  //     const updatedAddUserValidity = [...prevState.AddUser];
  //     updatedAddUserValidity[index] = {
  //       ...updatedAddUserValidity[index],
  //       [field]: false,
  //     };
  //     return {
  //       ...prevState,
  //       AddUser: updatedAddUserValidity,
  //     };
  //   });
  // };

  // const toggleIsActive = (index: number, value: boolean) => {
  //   const updatedAddUser = [...data.AddUser];
  //   updatedAddUser[index] = {
  //     ...updatedAddUser[index],
  //     IsActive: value,
  //   };
  //   setdata((prevState) => ({
  //     ...prevState,
  //     AddUser: updatedAddUser,
  //   }));
  //   setValidityState((prevState) => {
  //     const updatedAddUserValidity = [...prevState.AddUser];
  //     updatedAddUserValidity[index] = {
  //       ...updatedAddUserValidity[index],
  //       IsActive: false,
  //     };
  //     return {
  //       ...prevState,
  //       AddUser: updatedAddUserValidity,
  //     };
  //   });
  // };

  // const AddUser_fn = () => {
  //   let lastUserErrors: any;
  //   if (data.AddUser.length > 0) {
  //     const lastIndex = data.AddUser.length - 1;
  //     const lastUser = data.AddUser[lastIndex];
  //     lastUserErrors = {
  //       FirstName: !IsValid(lastUser.FirstName),
  //       LastName: !IsValid(lastUser.LastName),
  //       PhoneNumber: !IsValid(lastUser.PhoneNumber),
  //       EmailID: !IsValid(lastUser.EmailID),
  //       Password: !IsValid(lastUser.Password),
  //       ConfirmPassword: !IsValid(lastUser.ConfirmPassword),
  //       // isActive: !IsValid(lastUser.IsActive),
  //     };

  //     const hasErrors = Object.values(lastUserErrors).some((e) => e);
  //     if (hasErrors) {
  //       setValidityState((prev) => {
  //         const updated = [...prev.AddUser];
  //         updated[lastIndex] = {
  //           ...updated[lastIndex],
  //           ...lastUserErrors,
  //         };
  //         return { ...prev, AddUser: updated };
  //       });

  //       return;
  //     }
  //   }
  //   const newUser = {
  //     UserName: "",
  //     FirstName: "",
  //     LastName: "",
  //     PhoneNumber: 0,
  //     EmailID: "",
  //     Password: "",
  //     ConfirmPassword: "",
  //     IsActive: false,
  //     EmailIDValidation: false,
  //     PasswordValidation: false,
  //     ConfirmPWValidation: false,
  //     IsAlreadythere: false,
  //   };

  //   if (parseInt(data.NoOfUsers) > data.AddUser.length) {
  //     setdata((prevState) => ({
  //       ...prevState,
  //       AddUser: [...prevState.AddUser, newUser],
  //     }));

  //     setValidityState((prev) => ({
  //       ...prev,
  //       AddUser: [lastUserErrors],
  //     }));
  //   } else {
  //     setIsLoading(true);
  //     setAlertPopupOpen(true);
  //     setalertProps({
  //       Message: RecuritmentHRMsg.NoOfUserLimitMsg,
  //       Type: HRMSAlertOptions.Warning,
  //       visible: true,
  //       ButtonAction: async () => setAlertPopupOpen(false),
  //     });
  //     setIsLoading(false);
  //   }
  // };

  // const RemoveUser_fn = (index: number) => {
  //   const updatedAddUser = [...data.AddUser];
  //   updatedAddUser.splice(index, 1);
  //   setdata((prevState) => ({
  //     ...prevState,
  //     AddUser: updatedAddUser,
  //   }));
  // };

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
    let errors = {
      FirstName: !IsValid(data.FirstName),
      LastName: !IsValid(data.LastName),
      CompanyName: !IsValid(data.CompanyName),
      Designation: !IsValid(data.Designation),
      EmailID: !IsValid(data.EmailID),
      UserType: false,
      Password:
        props.stateValue.ButtonAction === ButtonAction.New
          ? !IsValid(data.Password)
          : false,
      ConfirmPassword:
        props.stateValue.ButtonAction === ButtonAction.New
          ? !IsValid(data.ConfirmPassword)
          : false,
      IsActive: !IsValid(data.IsActive),
      NoOfUsers: !IsValid(data.NoOfUsers),
      StartDateOfContract: !IsValid(data.StartDateOfContract),
      EndDateOfContract: !IsValid(data.EndDateOfContract),
      Nationality: !IsValid(data.Nationality?.text),
      AddUserValidation: false,
    };
    let lastUserErrors: any;
    if (data.AddUser.length > 0) {
      const lastIndex = data.AddUser.length - 1;
      const lastUser = data.AddUser[lastIndex];
      lastUserErrors = {
        FirstName: !IsValid(lastUser.FirstName),
        LastName: !IsValid(lastUser.LastName),
        PhoneNumber: !IsValid(lastUser.PhoneNumber),
        EmailID: !IsValid(lastUser.EmailID),
        Password:
          props.stateValue.ButtonAction === ButtonAction.New
            ? !IsValid(lastUser.Password)
            : false,
        ConfirmPassword:
          props.stateValue.ButtonAction === ButtonAction.New
            ? !IsValid(lastUser.ConfirmPassword)
            : false,
        // isActive: !IsValid(lastUser.IsActive),
      };

      const hasErrors = Object.values(lastUserErrors).some((e) => e);
      errors.AddUserValidation = hasErrors;
      if (hasErrors) {
        setValidityState((prev) => {
          const updatedAddUser = [...prev.AddUser];

          updatedAddUser[lastIndex] = {
            ...updatedAddUser[lastIndex],
            ...lastUserErrors,
          };

          return {
            ...prev,
            AddUser: updatedAddUser,
          };
        });
      }
    }

    setValidityState((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const Submit_fn = async () => {
    const IsVaild = !ValidationAction();
    if (IsVaild) {
      setIsLoading(true);
      const SubmitData: UpsertExternalUser = {
        firstname: data.FirstName,
        lastname: data.LastName,
        contactNumber: "99999999",
        email: data.EmailID,
        password: data.Password,
        isActive: data.IsActive ? 1 : 0,
        isEdit:
          props.stateValue.ButtonAction === ButtonAction.New ? false : true,
        type: data.UserType,
        exUserCode: data.AgentCode,
        userId: data.AgentCode,
        name: data?.CompanyName,
        isExpat: data.Nationality?.text === "Expatriate" ? 1 : 0,
        noOfUsers: data.NoOfUsers ? parseInt(data.NoOfUsers) : 0,
        hrUserId: props.userDetails[0]?.ID.toString(),
        contractStartDate: toUTC(data?.StartDateOfContract),
        contractEndDate: toUTC(data?.EndDateOfContract),
        designation: data.Designation,
        externalUserAccounts: [],
        // data.AddUser.map((user) => ({
        //   firstname: user.FirstName.split(" ")[0] || "",
        //   lastname: user.LastName.split(" ")[1] || "",
        //   contactNumber: user.PhoneNumber.toString(),
        //   email: user.EmailID,
        //   password: user.Password,
        //   isActive: user.IsActive ? 1 : 0,
        //   type: data.UserType,
        //   exUserCode: data.AgentCode,
        //   userId: data.AgentCode,
        //   hrUserId: props.userDetails[0]?.ID.toString(),
        //   name: data.CompanyName,
        // })),
      };
      await AdminPanelServices.UpsertExternalUser(SubmitData)
        .then(async (res) => {
          if (res.status === ResponeStatus.SUCCESS) {
            let IsEdit =
              props.stateValue.ButtonAction === ButtonAction.New ? false : true;
            const InsertList = await AdminPanelServices.InsertExternalUser(
              data,
              IsEdit
            );
            if (InsertList.status === ResponeStatus.SUCCESS) {
              let SuccessAlert: alertPropsData = {
                Message:
                  props.stateValue.ButtonAction === ButtonAction.New
                    ? props.stateValue?.TabName == TabName.LabourHire
                      ? RecuritmentHRMsg.AddLabourHireSuccessMsg
                      : RecuritmentHRMsg.AddAgentSuccessMsg
                    : props.stateValue?.TabName == TabName.LabourHire
                    ? RecuritmentHRMsg.UpdateLabourHireMsg
                    : RecuritmentHRMsg.UpdateagentMsg,
                Type: HRMSAlertOptions.Success,
                visible: true,
                ButtonAction: (userClickedOK: boolean) => {
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
              setalertProps(SuccessAlert);
            }
          } else {
            let APIError: alertPropsData = {
              Message: RecuritmentHRMsg.APIErrorMsg,
              Type: HRMSAlertOptions.Error,
              visible: true,
              ButtonAction: (userClickedOK: boolean) => {
                if (userClickedOK) {
                  setAlertPopupOpen(false);
                }
              },
            };
            setAlertPopupOpen(true);
            setalertProps(APIError);
          }
        })
        .catch((error) => {
          console.log(error, "Error in submitting Admin User");
        });
      setIsLoading(false);
    }
  };

  // const ResetPassword_fn = () => {
  //   setIsLoading(true);
  //   try {
  //     let ResetPasswordAlert: alertPropsData = {
  //       Message: RecuritmentHRMsg.ResetPassword,
  //       Type: HRMSAlertOptions.Confirmation,
  //       visible: true,
  //       ButtonAction: (userClickedOK: boolean) => {
  //         if (userClickedOK) {
  //           AdminPanelServices.ResetPassword(data.EmailID).then((res) => {
  //             if (res.status === ResponeStatus.SUCCESS) {
  //               let SuccessAlert: alertPropsData = {
  //                 Message: RecuritmentHRMsg.ResetPasswordMsg,
  //                 Type: HRMSAlertOptions.Success,
  //                 visible: true,
  //                 ButtonAction: (userClickedOK: boolean) => {
  //                   if (userClickedOK) {
  //                     props.navigation("/AdminPanelDashboard", {
  //                       state: {
  //                         TabName: props.stateValue?.TabName,
  //                         tab: props.stateValue?.tab,
  //                       },
  //                     });
  //                     setAlertPopupOpen(false);
  //                   }
  //                 },
  //               };
  //               setAlertPopupOpen(true);
  //               setalertProps(SuccessAlert);
  //             } else {
  //               let APIError: alertPropsData = {
  //                 Message: RecuritmentHRMsg.APIErrorMsg,
  //                 Type: HRMSAlertOptions.Error,
  //                 visible: true,
  //                 ButtonAction: (userClickedOK: boolean) => {
  //                   if (userClickedOK) {
  //                     setAlertPopupOpen(false);
  //                   }
  //                 },
  //               };
  //               setAlertPopupOpen(true);
  //               setalertProps(APIError);
  //             }
  //           });
  //         } else {
  //           setAlertPopupOpen(false);
  //         }
  //       },
  //     };
  //     setAlertPopupOpen(true);
  //     setalertProps(ResetPasswordAlert);
  //   } catch (error) {
  //     console.log(error, "Error in ResetPassword");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
              <div
                className="ms-Grid-row"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "134px",
                  }}
                >
                  <Label styles={labelStyles}>
                    {data.IsActive ? "Active" : "In Active"}
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
              </div>
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
                    mandatory={true}
                    onChange={(value) => handleInputChange("LastName", value)}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.CompanyName}
                    value={data.CompanyName}
                    disabled={false}
                    error={ValidityState.CompanyName}
                    mandatory={true}
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
                    mandatory={true}
                    onChange={(value) =>
                      handleInputChange("Designation", value)
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomAutoComplete
                    label={labelNames.AdminPanel.Nationality}
                    value={data.Nationality}
                    options={NationalityOption}
                    mandatory={true}
                    onChange={(value) =>
                      handleAutoComplete("Nationality", value)
                    }
                    error={ValidityState.Nationality}
                    disabled={false}
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.NoOfUsers}
                    value={data.NoOfUsers}
                    disabled={false}
                    error={ValidityState.NoOfUsers}
                    mandatory={true}
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
                    minDate={data.StartDateOfContract || todaydate}
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
                    disabled={
                      props.stateValue.ButtonAction === ButtonAction.Edit
                    }
                    mandatory={true}
                    onChange={(value) => handleInputChange("EmailID", value)}
                  />

                  {isInvalidEmail && (
                    <p
                      style={{
                        marginTop: 5,
                        color: "red",
                        fontSize: 12,
                        marginLeft: 0,
                      }}
                    >
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                {props.stateValue.ButtonAction === ButtonAction.New ? (
                  <>
                    <div className="ms-Grid-col ms-lg3">
                      <CustomInput
                        label={labelNames.AdminPanel.Password}
                        value={data.Password}
                        disabled={false}
                        error={ValidityState.Password}
                        mandatory={true}
                        WarningMsg="Password must be at least 10 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
                        onChange={(value) =>
                          handleInputChange("Password", value)
                        }
                        canRevealPassword={true}
                      />
                      {isInvalidPassword && (
                        <p
                          style={{
                            marginTop: 5,
                            color: "red",
                            fontSize: 12,
                            marginLeft: 0,
                          }}
                        >
                          Password must be at least 10 characters long and
                          include an uppercase letter, a lowercase letter, a
                          number, and a special character.
                        </p>
                      )}
                    </div>
                    <div className="ms-Grid-col ms-lg3">
                      <CustomInput
                        label={labelNames.AdminPanel.ConfirmPassword}
                        value={data.ConfirmPassword}
                        disabled={false}
                        error={ValidityState.ConfirmPassword}
                        mandatory={true}
                        onChange={(value) =>
                          handleInputChange("ConfirmPassword", value)
                        }
                        canRevealPassword={true}
                      />
                      {isInvalidConPassword && (
                        <p
                          style={{
                            marginTop: 5,
                            color: "red",
                            fontSize: 12,
                            marginLeft: 0,
                          }}
                        >
                          Confirm Password does not match the Password.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label={labelNames.AdminPanel.ExternalUserCode}
                    value={data.AgentCode}
                    error={false}
                    disabled={true}
                    mandatory={true}
                    onChange={(value) =>
                      handleInputChange("ExternalUserCode", value)
                    }
                  />
                </div>
              </div>

              {/* <div
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
                          <div key={index} style={{ width: "132%" }}>
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.FirstName}
                                  value={item.FirstName}
                                  error={
                                    ValidityState.AddUser[index]?.FirstName
                                  }
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "FirstName",
                                      value
                                    );
                                  }}
                                />
                              </div>
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.LastName}
                                  value={item.LastName}
                                  error={ValidityState.AddUser[index]?.LastName}
                                  disabled={false}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "LastName",
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
                              <div
                                className="ms-Grid-col ms-lg2"
                                style={{ marginTop: "3%", width: "13%" }}
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
                                  {"Active"}
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
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col ms-lg2">
                                <CustomInput
                                  label={labelNames.AdminPanel.EmailID}
                                  value={item.EmailID}
                                  error={ValidityState.AddUser[index]?.EmailID}
                                  disabled={item.IsAlreadythere}
                                  mandatory={false}
                                  onChange={(value) => {
                                    handleAddUserChange(
                                      index,
                                      "EmailID",
                                      value
                                    );
                                  }}
                                />
                                {item.EmailIDValidation && (
                                  <p
                                    style={{
                                      marginTop: 5,
                                      color: "red",
                                      fontSize: 12,
                                      marginLeft: 0,
                                    }}
                                  >
                                    Please enter a valid email address.
                                  </p>
                                )}
                              </div>
                              {!item?.IsAlreadythere ? (
                                <>
                                  <div className="ms-Grid-col ms-lg2">
                                    <CustomInput
                                      label={labelNames.AdminPanel.Password}
                                      value={item.Password}
                                      error={
                                        ValidityState.AddUser[index]?.Password
                                      }
                                      disabled={false}
                                      mandatory={false}
                                      onChange={(value) => {
                                        handleAddUserChange(
                                          index,
                                          "Password",
                                          value
                                        );
                                      }}
                                      WarningMsg="Password must be at least 10 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
                                      canRevealPassword={true}
                                    />
                                    {item.PasswordValidation && (
                                      <p
                                        style={{
                                          marginTop: 5,
                                          color: "red",
                                          fontSize: 12,
                                          marginLeft: 0,
                                        }}
                                      >
                                        Password must be at least 10 characters
                                        long and include an uppercase letter, a
                                        lowercase letter, a number, and a
                                        special character.
                                      </p>
                                    )}
                                  </div>
                                  <div className="ms-Grid-col ms-lg2">
                                    <CustomInput
                                      label={
                                        labelNames.AdminPanel.ConfirmPassword
                                      }
                                      value={item.ConfirmPassword}
                                      error={
                                        ValidityState.AddUser[index]
                                          ?.ConfirmPassword
                                      }
                                      disabled={false}
                                      mandatory={false}
                                      onChange={(value) => {
                                        handleAddUserChange(
                                          index,
                                          "ConfirmPassword",
                                          value
                                        );
                                      }}
                                      canRevealPassword={true}
                                    />
                                    {item.ConfirmPWValidation && (
                                      <p
                                        style={{
                                          marginTop: 5,
                                          color: "red",
                                          fontSize: 12,
                                          marginLeft: 0,
                                        }}
                                      >
                                        Confirm Password does not match the
                                        Password.
                                      </p>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )} */}
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
                label:
                  props.stateValue.ButtonAction === ButtonAction.Edit
                    ? ButtonAction.Update
                    : ButtonAction.Submit,
                onClick: async () => {
                  void Submit_fn();
                },
              },
              // ...(props.stateValue.ButtonAction === ButtonAction.Edit
              //   ? [
              //       {
              //         label: ButtonAction.ResetPassword,
              //         onClick: async () => {
              //           ResetPassword_fn();
              //         },
              //       },
              //     ]
              //   : []),
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
