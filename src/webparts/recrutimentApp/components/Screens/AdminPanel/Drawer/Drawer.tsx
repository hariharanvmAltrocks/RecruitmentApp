import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Eye, Pencil, X, ShieldCheck } from "lucide-react";
import { AdminPanelType } from "../hooks/Getadminpaneltable";
import styles from "./Drawer.module.scss";
import { AdminDashboard } from "../../../../services/AdminPanel/IAdminpanelService";
import { useSaveAdminPanel } from "../hooks/Saveadminpanel/Saveadminpanel";
import {
  ExternalUserType,
  Nationality,
} from "../../../../utilities/ConditionConfig";
import { ListNames } from "../../../../utilities/Config";
import {
  CommonServices,
  masterService,
} from "../../../../services/ServiceExport";
import ModalPopup from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { formatDate } from "../../../Hooks/dateConfigfn";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import Loading from "../../../Comman/Loading/loading";
import * as strings from 'RecrutimentAppWebPartStrings';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: AdminPanelType;
  isNew?: boolean;
  isEdit?: boolean;
  isView?: boolean;
  selectedItem?: AdminDashboard | null;
  onSuccess: () => void;
}

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({
  label,
  error,
  className = "",
  children,
}) => (
  <div className={`${styles.field} ${className}`}>
    <span className={styles.label}>{label}</span>
    {children}
    {error && <span className={styles.errorText}>{error}</span>}
  </div>
);

// ─── Group ────────────────────────────────────────────────────────────────────
interface GroupProps {
  badge: string;
  children: React.ReactNode;
}
const Group: React.FC<GroupProps> = ({ badge, children }) => (
  <div className={styles.group}>
    <span className={styles.groupBadge}>{badge}</span>
    <div className={styles.groupInner}>{children}</div>
  </div>
);

// ─── Drawer ───────────────────────────────────────────────────────────────────
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  type,
  isNew = false,
  isEdit = false,
  isView = false,
  selectedItem = null,
  onSuccess,
}) => {
  const {
    payload,
    setField,
    toggleActive,
    isSaving,
    errors,
    save,
    reset,
    resetPassword,
    modalState,
    closeModal,
  } = useSaveAdminPanel(type, onSuccess);

  const {
    modalState: modelstate,
    showModal,
    closeModal: closemodel,
  } = useModalPopup();

  const [pageloading, setpageLoading] = useState(false);

  const { ADGroupData } = userInfo();
  const emailId = ADGroupData?.EmailId?.[0];

  // Derive a human-readable mode label and the read-only flag
  const modeLabel = isView ? "View" : isEdit ? "Edit" : "New";
  const typeLabel = type === "labour-hire" ? strings.LabourHire : "Agency";
  const readOnly = isView; // all inputs disabled in view mode

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      if (isNew || !selectedItem) {
        reset(type);

        const res = await CommonServices.GetMasterData(
          ListNames.HRMSExternalAgents,
        );

        let prefix = type === "agency" ? "ANT" : "LCH";

        let externalUsers = (res?.data || []).filter(
          (item: any) =>
            item.UserType ===
            (type === "agency"
              ? ExternalUserType.Agent
              : ExternalUserType.LabourHire),
        );

        let maxNum = 0;
        externalUsers.forEach((item: any) => {
          const code = item?.AgentCode || item?.exUserCode || "";
          if (code && typeof code === "string") {
            const digits = code.replace(/^\D+/g, "");
            const num = parseInt(digits, 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        });

        let newNum = maxNum + 1;
        let newCode = `${prefix}${newNum.toString().padStart(3, "0")}`;

        const Filter = [
          { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId },
        ];
        const response = await masterService.GetUserDetails(Filter, "and");

        setField("userCode", newCode ?? "");
        setField("hrUserId", response?.data.ID);
        setField("isEdit", isEdit);
      } else {
        reset(type);
        setField("ID", selectedItem.ID ?? 0);
        setField("hrUserId", Number(selectedItem?.hrUserId));
        setField("userCode", selectedItem.exUserCode ?? "");
        setField("firstName", selectedItem.firstName ?? "");
        setField("lastName", selectedItem.lastName ?? "");
        setField("email", selectedItem.email ?? "");
        setField("companyName", selectedItem.designation ?? "");
        setField("designation", selectedItem.designation ?? "");
        setField(
          "nationality",
          selectedItem.isExpat ? Nationality.Expatriate : Nationality.Nationals,
        );
        setField("contractStart", formatDate(selectedItem.contractStartDate));
        setField("contractEnd", formatDate(selectedItem.contractStartDate));
        setField("numberOfUsers", selectedItem.noOfUsers);
        setField("isActive", selectedItem.isActive ?? true);
        setField("isEdit", isEdit);
      }
    };

    loadData();
  }, [isOpen, type]); // eslint-disable-line

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (isView) return;
    setpageLoading(true);
    const ok = await save();
    setpageLoading(false);
  };

  const handleReset = async () => {
    showModal({
      type: "confirmation",
      title: strings.PasswordReset,
      message:
        strings.APasswordResetLinkHasBeenSentToYourEmail,
      confirmLabel: "Ok",
      onConfirm: () => {
        resetPassword();
        closeModal;
      },
      onCancel: closemodel,
    });
  };

  const HeaderIcon = isView ? Eye : isEdit ? Pencil : UserPlus;

  const handleCancel = useCallback(() => {
    showModal({
      type: "confirmation",
      title: strings.CancelAssignment,
      message: strings.AreYouSureYouWantToCancelTheAssignment,
      confirmLabel: "Yes",
      cancelLabel: "No",
      onConfirm: () => {
        onClose();
        closemodel();
      },
      onCancel: closemodel,
    });
  }, []);

  return (
    <>
      {pageloading && <Loading />}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "stretch",
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
          >
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <header className={styles.header}>
                <div className={styles.headerLeft}>
                  <div className={styles.headerIcon}>
                    <HeaderIcon size={22} />
                  </div>
                  <div className={styles.headerText}>
                    <h3>
                      {modeLabel} {typeLabel} {strings.User}</h3>
                    <p>
                      {isView
                        ? strings.ViewingUserDetailsReadOnly
                        : isEdit
                          ? strings.UpdateUserAccessAndContractDetails
                          : strings.ConfigureUserAccessAndContractDetails}
                    </p>
                  </div>
                </div>

                <div className={styles.headerRight}>
                  {/* Active toggle — hidden in view mode */}
                  {!isView && (
                    <>
                      <div className={styles.toggleGroup}>
                        <span className={styles.toggleGroupLabel}>
                          {strings.AccountStatus}</span>
                        <button
                          type="button"
                          className={styles.toggleBtn}
                          onClick={toggleActive}
                        >
                          <span
                            className={`${styles.toggleLabel} ${payload.isActive ? styles["toggleLabel--active"] : styles["toggleLabel--inactive"]}`}
                          >
                            {payload.isActive ? "Active" : "Inactive"}
                          </span>
                          <div
                            className={`${styles.toggleTrack} ${payload.isActive ? styles["toggleTrack--on"] : styles["toggleTrack--off"]}`}
                          >
                            <div
                              className={`${styles.toggleThumb} ${payload.isActive ? styles["toggleThumb--on"] : styles["toggleThumb--off"]}`}
                            />
                          </div>
                        </button>
                      </div>
                      <div className={styles.headerDivider} />
                    </>
                  )}

                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                  >
                    <X size={18} />
                  </button>
                </div>
              </header>

              {/* ── Body ───────────────────────────────────────────────────── */}
              <div className={styles.body}>
                {/* Identity & Profile */}
                <Group badge="Identity & Profile">
                  <Field label={strings.UserCode}>
                    <input
                      readOnly
                      value={payload.userCode}
                      className={styles.inputReadonly}
                    />
                  </Field>

                  <Field label={strings.Nationality}>
                    <select
                      className={`${isView ? styles.disabledWhite : styles.select}`}
                      value={payload.nationality}
                      disabled={isView}
                      onChange={(e) => setField("nationality", e.target.value)}
                    >
                      <option>{Nationality.Expatriate}</option>
                      <option>{Nationality.Nationals}</option>
                    </select>
                  </Field>

                  <Field label={strings.FirstName} error={errors.firstName}>
                    <input
                      className={`${styles.input} ${errors.firstName ? styles.hasError : ""}`}
                      placeholder={strings.EnterFirstName}
                      value={payload.firstName}
                      readOnly={readOnly}
                      onChange={(e) => setField("firstName", e.target.value)}
                    />
                  </Field>

                  <Field label={strings.LastName} error={errors.lastName}>
                    <input
                      className={`${styles.input} ${errors.lastName ? styles.hasError : ""}`}
                      placeholder={strings.EnterLastName}
                      value={payload.lastName}
                      readOnly={readOnly}
                      onChange={(e) => setField("lastName", e.target.value)}
                    />
                  </Field>

                  <Field label={strings.CompanyName} error={errors.companyName}>
                    <input
                      className={`${styles.input} ${errors.companyName ? styles.hasError : ""}`}
                      placeholder={strings.EnterLegalCompanyName}
                      value={payload.companyName}
                      readOnly={readOnly}
                      onChange={(e) => setField("companyName", e.target.value)}
                    />
                  </Field>

                  <Field label={strings.Designation}>
                    <input
                      className={styles.input}
                      placeholder={strings.EnterRoleTitle}
                      value={payload.designation}
                      readOnly={readOnly}
                      onChange={(e) => setField("designation", e.target.value)}
                    />
                  </Field>
                </Group>

                {/* Contract Details */}
                <Group badge="Contract Details">
                  <Field label={strings.NoOfUsers}>
                    <input
                      type="number"
                      className={styles.input}
                      placeholder={strings.TotalAllocatedSeats}
                      value={payload.numberOfUsers}
                      readOnly={readOnly}
                      onChange={(e) =>
                        setField("numberOfUsers", e.target.value)
                      }
                    />
                  </Field>
                  <div /> {/* grid spacer */}
                  <Field
                    label={strings.StartDateOfContract}
                    error={errors.contractStart}
                  >
                    <input
                      type="date"
                      className={`${styles.input} ${errors.contractStart ? styles.hasError : ""}`}
                      value={payload.contractStart}
                      readOnly={readOnly}
                      onChange={(e) =>
                        setField("contractStart", e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    label={strings.EndDateOfContract}
                    error={errors.contractEnd}
                  >
                    <input
                      type="date"
                      className={`${styles.input} ${errors.contractEnd ? styles.hasError : ""}`}
                      value={payload.contractEnd}
                      min={payload.contractStart || undefined}
                      readOnly={readOnly}
                      onChange={(e) => setField("contractEnd", e.target.value)}
                    />
                  </Field>
                </Group>

                {/* Access & Security */}
                <Group badge="Access & Security">
                  <Field
                    label={strings.EmailId}
                    error={errors.email}
                    className={styles.colSpan2}
                  >
                    <input
                      type="email"
                      className={`${styles.input} ${errors.email ? styles.hasError : ""}`}
                      placeholder="official.email@domain.com"
                      value={payload.email}
                      readOnly={readOnly}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Field>

                  {isNew && (
                    <>
                      <Field
                        label={isEdit ? strings.NewPasswordOptional : strings.Password}
                        error={errors.password}
                      >
                        <input
                          type="password"
                          className={`${styles.input} ${errors.password ? styles.hasError : ""}`}
                          placeholder={strings.StringKey}
                          value={payload.password}
                          onChange={(e) => setField("password", e.target.value)}
                        />
                      </Field>

                      <Field
                        label={strings.ConfirmPassword}
                        error={errors.confirmPassword}
                      >
                        <input
                          type="password"
                          className={`${styles.input} ${errors.confirmPassword ? styles.hasError : ""}`}
                          placeholder="••••••••"
                          value={payload.confirmPassword}
                          onChange={(e) =>
                            setField("confirmPassword", e.target.value)
                          }
                        />
                      </Field>
                    </>
                  )}
                </Group>
              </div>

              {/* ── Footer ─────────────────────────────────────────────────── */}
              <footer className={styles.footer}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={isView ? onClose : handleCancel}
                >
                  {isView ? "Close" : "Cancel"}
                </button>

                {isEdit && (
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    {strings.ResetPassword}</button>
                )}

                {!isView && (
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className={styles.spinner} />
                    ) : (
                      <ShieldCheck size={15} />
                    )}
                    {isSaving
                      ? "Saving…"
                      : isEdit
                        ? strings.UpdateUser
                        : strings.CreateEnterpriseUser}
                  </button>
                )}
              </footer>
            </motion.div>
            <ModalPopup {...modalState} onClose={closeModal} />
            <ModalPopup {...modelstate} onClose={closemodel} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
