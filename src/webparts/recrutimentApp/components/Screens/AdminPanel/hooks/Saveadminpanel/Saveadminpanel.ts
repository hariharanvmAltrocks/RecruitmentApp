import { useState } from "react";
import { AdminPanelType } from "../Getadminpaneltable";
import { UpsertExternalUser } from "../../../../../models/Icareerportal";
import {
  Nationality,
  RecuritmentHRMsg,
} from "../../../../../utilities/ConditionConfig";
import { ExternalUserType } from "../../../../../utilities/Config";
import { toUTC } from "../../../../Hooks/dateConfigfn";
import { AdminPanelServices } from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { AdminCreateUser } from "../../../../../models/adminpanel";
import { useModalPopup } from "../../../../Comman/ModalPopup/useModalPopup";
import { useNavigate } from "react-router-dom";
import { PASSWORD_RULES } from "../../Drawer/reuse";

export interface NewAdminUserPayload {
  ID: number;
  type: AdminPanelType;
  userCode: string;
  nationality: string;
  firstName: string;
  lastName: string;
  companyName: string;
  designation: string;
  numberOfUsers: string;
  contractStart: string;
  contractEnd: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  isEdit: boolean;
  hrUserId: number;
}

export const EMPTY_PAYLOAD = (type: AdminPanelType): NewAdminUserPayload => ({
  ID: 0,
  type,
  userCode:
    type === "labour-hire"
      ? `LH-${Date.now().toString().slice(-4)}`
      : `AG-${Date.now().toString().slice(-4)}`,
  nationality: "Local",
  firstName: "",
  lastName: "",
  companyName: "",
  designation: "",
  numberOfUsers: "",
  contractStart: "",
  contractEnd: "",
  email: "",
  password: "",
  confirmPassword: "",
  isActive: true,
  isEdit: false,
  hrUserId: 0,
});

export interface UseSaveAdminPanelReturn {
  payload: NewAdminUserPayload;
  setField: <K extends keyof NewAdminUserPayload>(
    key: K,
    value: NewAdminUserPayload[K],
  ) => void;
  toggleActive: () => void;
  isSaving: boolean;
  errors: Partial<Record<keyof NewAdminUserPayload, string>>;
  save: () => Promise<boolean>;
  reset: (type: AdminPanelType) => void;
  modalState: any;
  closeModal: () => void;
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(
  payload: NewAdminUserPayload,
  isEdit = false,
): Partial<Record<keyof NewAdminUserPayload, string>> {
  const e: Partial<Record<keyof NewAdminUserPayload, string>> = {};

  if (!payload.firstName.trim()) e.firstName = "First name is required";
  if (!payload.lastName.trim()) e.lastName = "Last name is required";
  if (!payload.companyName.trim()) e.companyName = "Company name is required";

  if (!payload.email.trim()) {
    e.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    e.email = "Invalid email address";
  }

  // In edit mode password is optional — only validate if the user typed something
  const pwEntered = payload.password.length > 0;
  if (!isEdit || pwEntered) {
    if (!payload.password) {
      e.password = "Password is required";
    } else {
      const failedRule = PASSWORD_RULES.find((r) => !r.test(payload.password));
      if (failedRule) {
        e.password =
          "Password must be at least 10 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";
      }
    }

    if (payload.password && payload.password !== payload.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }
  }

  if (!payload.contractStart) e.contractStart = "Start date is required";
  if (!payload.contractEnd) e.contractEnd = "End date is required";
  if (
    payload.contractStart &&
    payload.contractEnd &&
    payload.contractEnd <= payload.contractStart
  ) {
    e.contractEnd = "End date must be after start date";
  }

  return e;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useSaveAdminPanel = (
  initialType: AdminPanelType,
): UseSaveAdminPanelReturn => {
  const [payload, setPayload] = useState<NewAdminUserPayload>(
    EMPTY_PAYLOAD(initialType),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewAdminUserPayload, string>>
  >({});

  const { modalState, showModal, closeModal } = useModalPopup();
  const navigate = useNavigate();

  const setField = <K extends keyof NewAdminUserPayload>(
    key: K,
    value: NewAdminUserPayload[K],
  ) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
    // Clear that field's error on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleActive = () =>
    setPayload((prev) => ({ ...prev, isActive: !prev.isActive }));

  const reset = (type: AdminPanelType) => {
    setPayload(EMPTY_PAYLOAD(type));
    setErrors({});
  };

  const save = async (): Promise<boolean> => {
    const validationErrors = validate(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsSaving(true);
    try {
      const SubmitData: UpsertExternalUser = {
        firstname: payload.firstName,
        lastname: payload.lastName,
        contactNumber: "99999999",
        email: payload.email,
        password: payload.password,
        isActive: payload.isActive ? 1 : 0,
        isEdit: payload.isEdit, // props.stateValue.ButtonAction === ButtonAction.New ? false : true,
        type:
          payload.type === "agency"
            ? ExternalUserType.Agent
            : ExternalUserType.LabourHire,
        exUserCode: payload.userCode,
        userId: payload.userCode,
        name: payload?.companyName,
        isExpat: payload.nationality === Nationality.Expatriate ? 1 : 0,
        noOfUsers: payload.numberOfUsers ? Number(payload.numberOfUsers) : 0,
        hrUserId: payload.hrUserId.toString(),
        contractStartDate: toUTC(payload?.contractStart),
        contractEndDate: toUTC(payload?.contractEnd),
        designation: payload.designation,
        externalUserAccounts: [],
      };

      let Admindata: AdminCreateUser = {
        ExternalID: payload.ID,
        FirstName: payload.firstName,
        LastName: payload.lastName,
        CompanyName: payload.companyName,
        Designation: payload.designation,
        EmailID: payload.email,
        UserType:
          payload.type === "agency"
            ? ExternalUserType.Agent
            : ExternalUserType.LabourHire,
        Password: payload.password,
        ConfirmPassword: payload.confirmPassword,
        IsActive: payload.isActive,
        NoOfUsers: payload.numberOfUsers,
        StartDateOfContract: new Date(payload.contractStart),
        EndDateOfContract: new Date(payload.contractEnd),
        Nationality: { key: 0, text: payload.nationality },
        AgentCode: payload.userCode,
        AddUser: [],
      };
      await AdminPanelServices.UpsertExternalUser(SubmitData).then(
        async (res) => {
          if (res.status === ResponeStatus.SUCCESS) {
            let IsEdit = payload.isEdit ? true : false;
            const InsertList = await AdminPanelServices.InsertExternalUser(
              Admindata,
              IsEdit,
            );
            if (InsertList.status === ResponeStatus.SUCCESS) {
              showModal({
                type: "success",
                title: "Submitted Successfully",
                message: IsEdit
                  ? payload.type === "agency"
                    ? RecuritmentHRMsg.UpdateagentMsg
                    : RecuritmentHRMsg.UpdateLabourHireMsg
                  : payload.type === "agency"
                    ? RecuritmentHRMsg.AddAgentSuccessMsg
                    : RecuritmentHRMsg.AddLabourHireSuccessMsg,
                confirmLabel: "Ok",
                onConfirm: () => {
                  closeModal();
                  navigate("/AdminPanelDashboard");
                },
              });
            }
          }
        },
      );
      await new Promise((r) => setTimeout(r, 800));
      return true;
    } catch (err) {
      console.error("Save admin user failed:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    payload,
    setField,
    toggleActive,
    isSaving,
    errors,
    save,
    reset,
    modalState,
    closeModal,
  };
};
