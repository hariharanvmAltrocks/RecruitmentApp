import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Eye, Pencil, X, ShieldCheck } from "lucide-react";
import { AdminPanelType } from "../hooks/Getadminpaneltable";
import styles from "./drawer.module.scss";
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

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: AdminPanelType;
  isNew?: boolean; // blank create form
  isEdit?: boolean; // pre-filled, all fields editable
  isView?: boolean; // pre-filled, all fields read-only
  selectedItem?: AdminDashboard | null;
  onSuccess?: () => void;
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
    modalState,
    closeModal,
  } = useSaveAdminPanel(type);

  const {
    modalState: modelstate,
    showModal,
    closeModal: closemodel,
  } = useModalPopup();

  const { ADGroupData } = userInfo();
  const emailId = ADGroupData?.EmailId?.[0];

  // Derive a human-readable mode label and the read-only flag
  const modeLabel = isView ? "View" : isEdit ? "Edit" : "New";
  const typeLabel = type === "labour-hire" ? "Labour Hire" : "Agency";
  const readOnly = isView; // all inputs disabled in view mode

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      if (isNew || !selectedItem) {
        reset(type);

        const res = await CommonServices.GetMasterData(
          ListNames.HRMSExternalAgents,
        );

        let prefix = type === "agency" ? "ANT" : "LHC";

        let externalUsers = res.data.filter(
          (item) =>
            item.UserType ===
            (type === "agency"
              ? ExternalUserType.Agent
              : ExternalUserType.LabourHire),
        );

        let lastCode = externalUsers.length
          ? externalUsers[externalUsers.length - 1].AgentCode
          : prefix + "001";

        let numPart = parseInt(lastCode.replace(prefix, ""));
        let newNum = numPart + 1;

        let newCode =
          prefix +
          newNum.toString().padStart(lastCode.length - prefix.length, "0");

        const Filter = [
          { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId },
        ];
        const response = await masterService.GetUserDetails(Filter, "and");

        setField("userCode", newCode ?? "");
        setField("hrUserId", response?.data.ID);
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
    const ok = await save();
    if (ok) {
      onSuccess?.();
    }
  };

  const HeaderIcon = isView ? Eye : isEdit ? Pencil : UserPlus;

  const handleCancel = useCallback(() => {
    showModal({
      type: "confirmation",
      title: "Cancel Assignment",
      message: "Are you sure you want to cancel the assignment?",
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
                    {modeLabel} {typeLabel} User
                  </h3>
                  <p>
                    {isView
                      ? "Viewing user details — read only"
                      : isEdit
                        ? "Update user access and contract details"
                        : "Configure user access and contract details"}
                  </p>
                </div>
              </div>

              <div className={styles.headerRight}>
                {/* Active toggle — hidden in view mode */}
                {!isView && (
                  <>
                    <div className={styles.toggleGroup}>
                      <span className={styles.toggleGroupLabel}>
                        Account Status
                      </span>
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
                <Field label="User Code">
                  <input
                    readOnly
                    value={payload.userCode}
                    className={styles.inputReadonly}
                  />
                </Field>

                <Field label="Nationality">
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

                <Field label="First Name" error={errors.firstName}>
                  <input
                    className={`${styles.input} ${errors.firstName ? styles.hasError : ""}`}
                    placeholder="Enter first name"
                    value={payload.firstName}
                    readOnly={readOnly}
                    onChange={(e) => setField("firstName", e.target.value)}
                  />
                </Field>

                <Field label="Last Name" error={errors.lastName}>
                  <input
                    className={`${styles.input} ${errors.lastName ? styles.hasError : ""}`}
                    placeholder="Enter last name"
                    value={payload.lastName}
                    readOnly={readOnly}
                    onChange={(e) => setField("lastName", e.target.value)}
                  />
                </Field>

                <Field label="Company Name" error={errors.companyName}>
                  <input
                    className={`${styles.input} ${errors.companyName ? styles.hasError : ""}`}
                    placeholder="Enter legal company name"
                    value={payload.companyName}
                    readOnly={readOnly}
                    onChange={(e) => setField("companyName", e.target.value)}
                  />
                </Field>

                <Field label="Designation">
                  <input
                    className={styles.input}
                    placeholder="Enter role / title"
                    value={payload.designation}
                    readOnly={readOnly}
                    onChange={(e) => setField("designation", e.target.value)}
                  />
                </Field>
              </Group>

              {/* Contract Details */}
              <Group badge="Contract Details">
                <Field label="No. of Users">
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="Total allocated seats"
                    value={payload.numberOfUsers}
                    readOnly={readOnly}
                    onChange={(e) => setField("numberOfUsers", e.target.value)}
                  />
                </Field>
                <div /> {/* grid spacer */}
                <Field
                  label="Start Date of Contract"
                  error={errors.contractStart}
                >
                  <input
                    type="date"
                    className={`${styles.input} ${errors.contractStart ? styles.hasError : ""}`}
                    value={payload.contractStart}
                    readOnly={readOnly}
                    onChange={(e) => setField("contractStart", e.target.value)}
                  />
                </Field>
                <Field label="End Date of Contract" error={errors.contractEnd}>
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
                  label="Email ID"
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

                {/* Password fields hidden in view mode */}
                {!isView && (
                  <>
                    <Field
                      label={isEdit ? "New Password (optional)" : "Password"}
                      error={errors.password}
                    >
                      <input
                        type="password"
                        className={`${styles.input} ${errors.password ? styles.hasError : ""}`}
                        placeholder="••••••••"
                        value={payload.password}
                        onChange={(e) => setField("password", e.target.value)}
                      />
                    </Field>

                    <Field
                      label="Confirm Password"
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

              {/* Submit only shown for new / edit */}
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
                      ? "Update User"
                      : "Create Enterprise User"}
                </button>
              )}
            </footer>
          </motion.div>
          <ModalPopup {...modalState} onClose={closeModal} />
          <ModalPopup {...modelstate} onClose={closemodel} />
        </div>
      )}
    </AnimatePresence>
  );
};
