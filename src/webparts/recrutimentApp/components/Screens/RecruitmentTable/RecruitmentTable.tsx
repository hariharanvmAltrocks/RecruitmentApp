import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Users } from "lucide-react";
import { CheckboxDataTable } from "./Components/DataTable/CheckboxDataTable";
import { NormalDataTable } from "./Components/DataTable/NormalDataTable";
import { useAssignMembers } from "./Hooks/useAssignMembers";
import { useRecruitmentDetails } from "./Hooks/useRecruitmentDetails";
import { useTabDetails } from "./Hooks/useTabDetails";
import {
  AssignmentPayload,
  HrMember,
  RecruitmentItem,
  RecruitmentTabKey,
  TabItem,
} from "./RecruitmentTable.types";
import "./RecruitmentTable.scss";

const AssignHRPopup = React.lazy(() => import("./Components/AssignHRPopup/AssignHRPopup").then((module) => ({
  default: module.AssignHRPopup,
})));

export const RecruitmentTable: React.FC = () => {
  const { tabs, loading: tabsLoading } = useTabDetails();
  const [activeTabKey, setActiveTabKey] = useState<RecruitmentTabKey>("mySubmission");
  const { items, loading: tableLoading } = useRecruitmentDetails(activeTabKey);
  const { members, loading: membersLoading } = useAssignMembers();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!tabs.length) {
      return;
    }

    const exists = tabs.some((tab) => tab.key === activeTabKey);
    if (!exists) {
      setActiveTabKey(tabs[0].key);
    }
  }, [activeTabKey, tabs]);

  const activeTab: TabItem | undefined = useMemo(
    () => tabs.find((tab) => tab.key === activeTabKey),
    [activeTabKey, tabs]
  );

  const selectedItems: RecruitmentItem[] = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );

  const selectedMember: HrMember | null = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const handleTabChange = useCallback((key: RecruitmentTabKey) => {
    setActiveTabKey(key);
    setSelectedIds([]);
    setSelectedMemberId("");
  }, []);

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedIds((prev) => (prev.length === items.length ? [] : items.map((item) => item.id)));
  }, [items]);

  const handleAction = useCallback((item: RecruitmentItem) => {
    const actionLabel = activeTab?.actionMode === "upload" ? "Upload" : "View";
    const message = `${actionLabel} action clicked for ${item.jobCode}`;
    // eslint-disable-next-line no-console
    console.info(message);
  }, [activeTab?.actionMode]);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleConfirmAssignment = useCallback((payload: AssignmentPayload) => {
    // eslint-disable-next-line no-console
    console.info("Assignment submitted", payload);
    setIsPopupOpen(false);
    setSelectedIds([]);
    setSelectedMemberId("");
  }, []);

  const showAssignmentBar = activeTab?.tableMode === "checkbox" && selectedIds.length > 0;

  return (
    <section className="recruitment-table">
      {/* <header className="recruitment-table__header">
        <div className="recruitment-table__header-text">
          <h2>Recruitment Menu</h2>
          <p>Manage and review all recruitment requests and documentation.</p>
        </div>
      </header> */}

      <div className="recruitment-table__tabs">
        {(tabsLoading ? [] : tabs).map((tab) => (
          <button
            key={tab.key}
            className={`recruitment-table__tab ${tab.key === activeTabKey ? "recruitment-table__tab--active" : ""}`.trim()}
            type="button"
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        {tabsLoading && (
          <div className="recruitment-table__tabs-loading">
            Loading tabs...
          </div>
        )}
      </div>

      <div className="recruitment-table__table-card">
        {activeTab?.tableMode === "checkbox" ? (
          <CheckboxDataTable
            items={items}
            loading={tableLoading}
            selectedIds={selectedIds}
            actionMode={activeTab.actionMode}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            onAction={handleAction}
          />
        ) : (
          <NormalDataTable
            items={items}
            loading={tableLoading}
            actionMode={activeTab?.actionMode ?? "view"}
            onAction={handleAction}
          />
        )}
      </div>

      {showAssignmentBar && (
        <div className="assignment-bar">
          <div className="assignment-bar__left">
            <div className="assignment-bar__icon">
              <Users size={18} />
            </div>
            <div className="assignment-bar__count">
              <strong>{selectedIds.length}</strong>
              <span>Vacancies Selected</span>
            </div>
          </div>

          <div className="assignment-bar__controls">
            <select
              className="assignment-bar__select"
              value={selectedMemberId}
              onChange={(event) => setSelectedMemberId(event.target.value)}
              disabled={membersLoading}
            >
              <option value="">Select HR member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </option>
              ))}
            </select>

            <button
              className="assignment-bar__button"
              type="button"
              onClick={handleOpenPopup}
              disabled={!selectedMemberId}
            >
              Execute Assignment
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <Suspense fallback={null}>
          <AssignHRPopup
            isOpen={isPopupOpen}
            selectedItems={selectedItems}
            assignedMember={selectedMember}
            onClose={handleClosePopup}
            onConfirm={handleConfirmAssignment}
          />
        </Suspense>
      )}
    </section>
  );
};
