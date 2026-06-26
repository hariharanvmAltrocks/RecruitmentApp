import React, { useState, useMemo, Suspense } from "react";
import * as Lucide from "lucide-react";
import styles from "./UpcomingPositionsTable.module.scss";
import { DataTable, DataTableColumn } from "../../../../Comman/DataTable/DataTable";
import { useAssignMembers } from "../../../RecruitmentTable/Hooks/useAssignMembers";
import { HrMember } from "../../../RecruitmentTable/RecruitmentTable.types";
import { SearchableDropdown } from "../../../../Comman/SearchableDropdown/SearchableDropdown";

interface MockPosition {
  id: string;
  jobCode: string;
  jobTitle: string;
  department: string;
  dateRequired: string;
  headcount: number;
  vacant: number;
  assignedHR: string;
  daysLeft: number;
  status: "Overdue" | "At Risk" | "On Track";
}

const INITIAL_POSITIONS: MockPosition[] = [
  {
    id: "POS-001",
    jobCode: "1013-CT-14-010",
    jobTitle: "Cyber Security Analyst",
    department: "SENIOR MANAGEMENT",
    dateRequired: "25-05-2026",
    headcount: 5,
    vacant: 3,
    assignedHR: "Altkamoa01",
    daysLeft: 5,
    status: "Overdue"
  },
  {
    id: "POS-002",
    jobCode: "1013-CT-14-011",
    jobTitle: "ERP Functional Consultant",
    department: "MINING OPERATIONS",
    dateRequired: "25-06-2026",
    headcount: 4,
    vacant: 2,
    assignedHR: "Altkamoa01",
    daysLeft: 5,
    status: "Overdue"
  },
  {
    id: "POS-003",
    jobCode: "1013-CT-14-006",
    jobTitle: "Network Engineer",
    department: "TECH & INNOVATION",
    dateRequired: "02-06-2026",
    headcount: 6,
    vacant: 4,
    assignedHR: "Altkamoa02",
    daysLeft: 13,
    status: "At Risk"
  },
  {
    id: "POS-004",
    jobCode: "1013-CT-14-016",
    jobTitle: "Mobile Developer",
    department: "TECH & INNOVATION",
    dateRequired: "14-06-2026",
    headcount: 4,
    vacant: 1,
    assignedHR: "Altkamoa02",
    daysLeft: 25,
    status: "At Risk"
  },
  {
    id: "POS-005",
    jobCode: "1013-CT-14-017",
    jobTitle: "Data Analyst",
    department: "FINANCE",
    dateRequired: "30-07-2026",
    headcount: 3,
    vacant: 2,
    assignedHR: "Altkamoa03",
    daysLeft: 71,
    status: "On Track"
  },
  {
    id: "POS-006",
    jobCode: "1013-CT-14-018",
    jobTitle: "HR Business Partner",
    department: "HUMAN RESOURCES",
    dateRequired: "10-06-2026",
    headcount: 2,
    vacant: 1,
    assignedHR: "Altkamoa04",
    daysLeft: 16,
    status: "At Risk"
  }
];

export const UpcomingPositionsTable: React.FC = () => {
  const [positions, setPositions] = useState<MockPosition[]>(INITIAL_POSITIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [isLoading, setIsLoading] = useState(false);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPositions(INITIAL_POSITIONS);
      setIsLoading(false);
    }, 600);
  };

  // Change HR Dialog State
  const [isChangeHrOpen, setIsChangeHrOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<MockPosition | null>(null);
  const [selectedHrId, setSelectedHrId] = useState<number>(0);
  const [comments, setComments] = useState("");

  // Fetch HR Members list
  const { members } = useAssignMembers("Congolese");

  const handleOpenChangeHR = (row: MockPosition) => {
    setSelectedPosition(row);
    // Find pre-selected HR member ID if any
    const existingHr = members.find((m: HrMember) => m.name.toLowerCase() === row.assignedHR.toLowerCase());
    setSelectedHrId(existingHr ? existingHr.id : 0);
    setComments("");
    setIsChangeHrOpen(true);
  };

  const handleConfirmChangeHR = () => {
    if (!selectedPosition || !selectedHrId) return;
    const selectedHr = members.find((m: HrMember) => m.id === selectedHrId);
    if (!selectedHr) return;

    setPositions(prev =>
      prev.map(p =>
        p.id === selectedPosition.id
          ? { ...p, assignedHR: selectedHr.name }
          : p
      )
    );
    setIsChangeHrOpen(false);
  };

  // Unique lists for filters
  const departments = useMemo(() => {
    const depts = new Set(INITIAL_POSITIONS.map(p => p.department));
    return ["All", ...Array.from(depts)];
  }, []);

  const statuses = ["All", "On Track", "At Risk", "Overdue"];

  // Filter items
  const filteredItems = useMemo(() => {
    return positions.filter((p) => {
      const matchesSearch =
        p.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.assignedHR.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jobCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === "All" || p.department === selectedDept;
      const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [positions, searchTerm, selectedDept, selectedStatus]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const departmentOptions = useMemo(() => {
    return departments.map(d => ({
      id: d,
      value: d,
      displayText: d === "All" ? "All Departments" : d
    }));
  }, [departments]);

  const statusOptions = useMemo(() => {
    return statuses.map(s => ({
      id: s,
      value: s,
      displayText: s === "All" ? "All Statuses" : s
    }));
  }, [statuses]);

  const selectedDeptValue = useMemo(() => {
    return {
      key: selectedDept,
      text: selectedDept === "All" ? "All Departments" : selectedDept
    };
  }, [selectedDept]);

  const selectedStatusValue = useMemo(() => {
    return {
      key: selectedStatus,
      text: selectedStatus === "All" ? "All Statuses" : selectedStatus
    };
  }, [selectedStatus]);

  // Define DataTable Columns
  const columns = useMemo<DataTableColumn<MockPosition>[]>(() => [
    {
      id: "jobTitle",
      header: "Job Title",
      render: (row: MockPosition) => (
        <div className={styles.jobTitleCell}>
          <span className={styles.jobTitleCell__name}>{row.jobTitle}</span>
          <span className={styles.jobTitleCell__id}>{row.jobCode}</span>
        </div>
      ),
      sortable: true
    },
    {
      id: "department",
      header: "Department",
      accessor: "department",
      sortable: true,
      cellClassName: styles.deptCell
    },
    {
      id: "dateRequired",
      header: "Date Required",
      accessor: "dateRequired",
      sortable: true
    },
    {
      id: "headcount",
      header: "Headcount (Req)",
      accessor: "headcount",
      sortable: true,
      align: "center"
    },
    {
      id: "vacant",
      header: "Vacant (Bal)",
      accessor: "vacant",
      sortable: true,
      align: "center",
      cellClassName: styles.weight600
    },
    {
      id: "assignedHR",
      header: "Assign HR",
      accessor: "assignedHR",
      sortable: true
    },
    {
      id: "daysLeft",
      header: "Days Left",
      render: (row: MockPosition) => <span>{row.daysLeft} days</span>,
      sortable: true,
      cellClassName: styles.weight600
    },
    {
      id: "status",
      header: "Status",
      render: (row: MockPosition) => {
        let statusClass = styles.statusOnTrack;
        if (row.status === "Overdue") statusClass = styles.statusOverdue;
        else if (row.status === "At Risk") statusClass = styles.statusAtRisk;
        return (
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {row.status}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "actions",
      header: "Action",
      render: (row: MockPosition) => (
        <button
          type="button"
          className={styles.changeHrBtn}
          onClick={() => handleOpenChangeHR(row)}
        >
          Change HR
        </button>
      )
    }
  ], [members]);

  const getRowId = (row: MockPosition) => row.id;

  return (
    <div className={styles.tableCard} aria-label="Positions Table">
      {/* Header & Filters Toolbar */}
      <div className={styles.tableCard__header}>
        <div className={styles.tableCard__titleRow}>
          <Lucide.AlertTriangle size={18} className={styles.warningIcon} />
          <h2 className={styles.tableCard__title}>POSITIONG &amp; OVERDUE POSITIONS</h2>
        </div>

        {/* Filters Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filtersGroup}>
            {/* Global Search */}
            <div className={styles.searchWrap}>
              <span className={styles.label}>Search</span>
              <div className={styles.inputInnerWrap}>
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={styles.searchInput}
                  aria-label="Search positions"
                />
                <Lucide.Search className={styles.searchIcon} size={14} />
              </div>
            </div>

            {/* Department Filter */}
            <div className={styles.selectWrap}>
              <span className={styles.label}>All Departments</span>
              <SearchableDropdown
                options={departmentOptions}
                value={selectedDeptValue}
                onChange={(val) => {
                  setSelectedDept(val ? String(val.key) : "All");
                  setCurrentPage(1);
                }}
                placeholder="Filter by department..."
              />
            </div>

            {/* Status Filter */}
            <div className={styles.selectWrap}>
              <span className={styles.label}>All Statuses</span>
              <SearchableDropdown
                options={statusOptions}
                value={selectedStatusValue}
                onChange={(val) => {
                  setSelectedStatus(val ? String(val.key) : "All");
                  setCurrentPage(1);
                }}
                placeholder="Filter by Status..."
              />
            </div>
          </div>

          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleResetFilters}
              title="Reset Filters"
            >
              <Lucide.RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className={styles.actionBtnPrimary}
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh Data"
            >
              <Lucide.RefreshCw size={14} className={isLoading ? styles.spin : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reusable DataTable Component */}
      <div className={styles.tableWrapper}>
        <DataTable
          columns={columns}
          data={paginatedItems}
          getRowId={getRowId}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={filteredItems.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size: number) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          loading={isLoading}
        />
      </div>

      {/* Change HR Dialog Modal Overlay */}
      {isChangeHrOpen && selectedPosition && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <span className={styles.modalHeaderTitle}>Change HR Assignee</span>
              <button
                type="button"
                onClick={() => setIsChangeHrOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="Close dialog"
              >
                <Lucide.X size={18} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <span className={styles.detailRowLabel}>Selected Position:</span>
                <span className={styles.detailRowValue}>{selectedPosition.jobTitle}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailRowLabel}>Current HR:</span>
                <span className={styles.detailRowValue}>{selectedPosition.assignedHR}</span>
              </div>

              <div className={styles.formField}>
                <label className={styles.formFieldLabel}>Select HR Member</label>
                <select
                  value={selectedHrId}
                  onChange={(e) => setSelectedHrId(Number(e.target.value))}
                  className={styles.formSelect}
                >
                  <option value={0}>Select HR Member</option>
                  {members.map((m: HrMember) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.formFieldLabel}>Instructions / Comments</label>
                <textarea
                  placeholder="Enter comments or instructions for the recruiter..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setIsChangeHrOpen(false)}
                className={styles.modalBtnCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmChangeHR}
                disabled={!selectedHrId}
                className={styles.modalBtnConfirm}
              >
                Confirm &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingPositionsTable;
