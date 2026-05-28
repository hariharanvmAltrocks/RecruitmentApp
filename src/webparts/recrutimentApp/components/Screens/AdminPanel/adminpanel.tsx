import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, RefreshCw, RotateCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./adminpanel.module.scss";
import { AdminPanelType, useAdminPanelTable } from "./hooks/Getadminpaneltable";
import { Drawer } from "./Drawer/Drawer";
import { DataTable, DataTableColumn } from "../../Comman/DataTable/DataTable";
import { menuID } from "../../../utilities/ConditionConfig";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { AdminDashboard } from "../../../services/AdminPanel/IAdminpanelService";
import * as strings from 'RecrutimentAppWebPartStrings';

type DrawerMode = "new" | "edit" | "view";

interface DrawerState {
  open: boolean;
  mode: DrawerMode;
  selectedItem: AdminDashboard | null;
}

const CLOSED_DRAWER: DrawerState = {
  open: false,
  mode: "new",
  selectedItem: null,
};

// ─── AdminManagement ──────────────────────────────────────────────────────────
interface AdminManagementProps {
  title: string;
  type: AdminPanelType;
  onNewUser: () => void;
  onEditUser: (item: AdminDashboard) => void;
  onViewUser: (item: AdminDashboard) => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({
  title,
  type,
  onNewUser,
  onEditUser,
  onViewUser,
}) => {
  const navigate = useNavigate();
  const { setActiveMenuID } = useUIState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Data hook ─────────────────────────────────────────────────────────────
  const { data, loading, pagination, fetchPage, setPageSize, refresh } =
    useAdminPanelTable({ type, initialPageSize: 10 });

  const listLabel = type === "labour-hire" ? strings.LabourHire : "Agencies";

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refresh]);

  const handlePageChange = useCallback(
    (page: number) => fetchPage(page),
    [fetchPage],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => setPageSize(size),
    [setPageSize],
  );

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: DataTableColumn<AdminDashboard>[] = useMemo(
    () => [
      {
        id: "exUserCode",
        header: strings.UserCode,
        render: (item) => (
          <span className="data-table__job-code">{item.exUserCode}</span>
        ),
      },
      {
        id: "name",
        header: "Name",
        render: (item) => (
          <div className="data-table__job-title">
            <span>
              {`${item.firstName ?? ""} ${item.lastName ?? ""}`.trim()}
            </span>
          </div>
        ),
      },
      {
        id: "email",
        header: strings.EmailId,
        accessor: "email" as keyof AdminDashboard,
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "actions",
        header: "Actions",
        align: "left" as const,
        cellClassName: "data-table__cell--actions",
        render: (item) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* ── View ──────────────────────────────────────────────────── */}
            <motion.button
              type="button"
              className="data-table__action-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onViewUser(item)}
              title={strings.View}
              aria-label={strings.ViewUser}
            >
              <Eye size={14} />
              View
            </motion.button>

            {/* ── Edit ──────────────────────────────────────────────────── */}
            <motion.button
              type="button"
              className="data-table__action-btn data-table__action-btn--secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onEditUser(item)}
              title={strings.Edit}
              aria-label={strings.EditUser}
            >
              <Pencil size={14} />
              Edit
            </motion.button>
          </div>
        ),
      },
    ],
    // onViewUser / onEditUser are stable callbacks — safe to exclude from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={styles.page}>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2>{title}</h2>
          <p>{strings.ManagementDashboard}</p>
        </div>

        <button className={styles.newUserBtn} onClick={onNewUser}>
          <Plus size={15} />
          {strings.NewUser}</button>
      </header>

      {/* ── Table card ───────────────────────────────────────────────────── */}
      <div className="recruitment-table__table-card">
        {/* Toolbar */}
        <div className="submission-header">
          <h2 className="submission-header__title">{listLabel}</h2>

          <div className="submission-header__actions">
            <button
              className="submission-header__refresh-btn"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              title={strings.RefreshTable}
              aria-label="Refresh table"
            >
              <RefreshCw
                size={14}
                className={loading || isRefreshing ? "spin" : undefined}
              />
              {strings.Refresh}</button>

            <button
              className="submission-header__button"
              onClick={() => {
                navigate("/Dashboard");
                setActiveMenuID(menuID.Dashboard);
              }}
            >
              <RotateCcw size={14} />
              {strings.BackToDashboard}</button>
          </div>
        </div>

        {/* DataTable */}
        <DataTable<AdminDashboard>
          columns={columns}
          data={data}
          loading={loading}
          pageSize={pagination.pageSize}
          currentPage={pagination.currentPage}
          totalCount={pagination.totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50]}
          emptyMessage="No users found."
        />
      </div>
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const { activeMenuID } = useUIState();

  const activeType: AdminPanelType =
    activeMenuID === menuID.LabourHire ? "labour-hire" : "agency";

  const [drawer, setDrawer] = useState<DrawerState>(CLOSED_DRAWER);

  const openNew = useCallback(() => {
    setDrawer({ open: true, mode: "new", selectedItem: null });
  }, []);

  const openEdit = useCallback((item: AdminDashboard) => {
    setDrawer({ open: true, mode: "edit", selectedItem: item });
  }, []);

  const openView = useCallback((item: AdminDashboard) => {
    setDrawer({ open: true, mode: "view", selectedItem: item });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer(CLOSED_DRAWER);
  }, []);

  return (
    <>
      <AdminManagement
        title={
          activeType === "labour-hire"
            ? strings.LabourHireManagement
            : strings.AgencyManagement
        }
        type={activeType}
        onNewUser={openNew}
        onEditUser={openEdit}
        onViewUser={openView}
      />

      <AnimatePresence>
        {drawer.open && (
          <Drawer
            isOpen={drawer.open}
            onClose={closeDrawer}
            type={activeType}
            isNew={drawer.mode === "new"}
            isEdit={drawer.mode === "edit"}
            isView={drawer.mode === "view"}
            selectedItem={drawer.selectedItem}
            onSuccess={closeDrawer}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
