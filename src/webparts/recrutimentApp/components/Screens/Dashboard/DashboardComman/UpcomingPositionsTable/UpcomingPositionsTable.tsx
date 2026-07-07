import React, { useState, useMemo, Suspense } from "react";
import * as Lucide from "lucide-react";
import styles from "./UpcomingPositionsTable.module.scss";
import { DataTable, DataTableColumn } from "../../../../Comman/DataTable/DataTable";
import { useAssignMembers } from "../../../RecruitmentTable/Hooks/useAssignMembers";
import { HrMember, RecruitmentItem } from "../../../RecruitmentTable/RecruitmentTable.types";
import { SearchableDropdown } from "../../../../Comman/SearchableDropdown/SearchableDropdown";
import { IPositionDetails } from "../../Types";
import SPServices from "../../../../../services/SPService/spservice";
import { ListNames } from "../../../../../utilities/Config";

const AssignHRPopup = React.lazy(() =>
  import("../../../RecruitmentTable/Components/AssignHRPopup/AssignHRPopup").then(
    (module) => ({
      default: module.AssignHRPopup,
    }),
  ),
);

// interface MockPosition {
//   id: string;
//   jobCode: string;
//   jobTitle: string;
//   department: string;
//   dateRequired: string;
//   headcount: number;
//   vacant: number;
//   assignedHR: string;
//   daysLeft: number;
//   status: "Overdue" | "At Risk" | "On Track";
// }

interface IUpcomingPositionsTableProps {
  data: IPositionDetails[] | null | undefined;
  onRefresh?: () => void;
  loading?: boolean;
  onSuccessChangeHR?: () => void;
}

export const UpcomingPositionsTable: React.FC<IUpcomingPositionsTableProps> = ({
  data,
  onRefresh,
  loading,
  onSuccessChangeHR,
}) => {
  const [positions, setPositions] = useState<IPositionDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (data && data.length > 0) {
      const mapped: IPositionDetails[] = data.map((pos) => ({
        id: pos.id || 0,
        ItemID: pos.ItemID || 0,
        JobCode: pos.JobCode || "",
        Jobtitle: pos.Jobtitle || "",
        department: pos.department || "",
        dateRequired: pos.dateRequired || "",
        headcount: pos.headcount || "",
        vacant: pos.vacant || "",
        assignHR: pos.assignHR || " ",
        dayaLeft: pos.dayaLeft || "",
        Positionstatus: pos.Positionstatus || "On Track",
        nationality: pos.nationality || "N/A",
        status: pos.status || "N/A",
        statusId: pos.statusId || 0,
      }));
      setPositions(mapped);
    } else {
      setPositions([]);
    }
  }, [data]);


  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Change HR Dialog State
  const [isChangeHrOpen, setIsChangeHrOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<IPositionDetails | null>(null);

  const { members } = useAssignMembers(data?.[0]?.nationality ?? "");

  const selectedItems = useMemo<RecruitmentItem[]>(() => {
    if (!selectedPosition) return [];
    return [
      {
        id: String(selectedPosition.id),
        ItemID: selectedPosition.ItemID,
        jobCode: selectedPosition.JobCode,
        title: selectedPosition.Jobtitle,
        department: selectedPosition.department,
        count: Number(selectedPosition.headcount),
        requestType: "Position",
        nationality: selectedPosition.nationality || "N/A",
        status: selectedPosition.Positionstatus,
        statusId: selectedPosition.statusId || 0,
        jobCodeID: 0,
      },
    ];
  }, [selectedPosition]);

  const selectedMember = useMemo<HrMember | null>(() => {
    if (!selectedPosition) return null;
    return members.find((m) => m.name.toLowerCase() === selectedPosition.assignHR.toLowerCase()) ?? null;
  }, [selectedPosition, members]);

  const handleOpenChangeHR = (row: IPositionDetails) => {
    setSelectedPosition(row);
    setIsChangeHrOpen(true);
  };

  const handleConfirmChangeHR = async (payload: { member: HrMember | null; comments: string }) => {
    if (!selectedPosition || !payload.member) return;

    try {
      setIsUpdating(true);
      const itemId = selectedPosition.ItemID;
      if (itemId > 0) {
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentDptDetails,
          ID: itemId,
          RequestJSON: {
            AssignedHR: payload.member.emailid,
          }
        });
      }

      setPositions(prev =>
        prev.map(p =>
          p.id === selectedPosition.id
            ? { ...p, assignHR: payload.member!.name }
            : p
        )
      );
      if (onRefresh) {
        onRefresh();
      }
      if (onSuccessChangeHR) {
        onSuccessChangeHR();
      }
    } catch (err) {
      console.error("Error reassigning HR:", err);
    } finally {
      setIsUpdating(false);
      setIsChangeHrOpen(false);
    }
  };

  // Unique lists for filters
  const departments = useMemo(() => {
    const depts = new Set(positions.map(p => p.department).filter(Boolean));
    return ["All", ...Array.from(depts)];
  }, [positions]);

  const statuses = ["All", "On Track", "At Risk", "Overdue"];

  // Filter items
  const filteredItems = useMemo(() => {
    return positions.filter((p) => {
      const matchesSearch =
        p.Jobtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.assignHR.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.JobCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === "All" || p.department === selectedDept;
      const matchesStatus = selectedStatus === "All" || p.Positionstatus === selectedStatus;

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
  const columns = useMemo<DataTableColumn<IPositionDetails>[]>(() => [
    {
      id: "jobTitle",
      header: "Job Title",
      render: (row: IPositionDetails) => (
        <div className="data-table__job-title">
            <span>{row.Jobtitle}</span>
            <span className="data-table__job-dept">{row.JobCode}</span>
          </div>
      ),
      sortable: true
    },
    {
        id: "department",
        header: "Department",
        render: (item) => (
          <div className="data-table__job-title">
            <span>{item.department}</span>
            {/* <span className="data-table__job-dept">{item.department}</span> */}
          </div>
        ),
        sortable: true
      },
     {
        id: "dateRequired",
        header: "Date Required",
        accessor: "dateRequired",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
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
      accessor: "assignHR",
      sortable: true
    },
    {
      id: "daysLeft",
      header: "Days Left",
      render: (row: IPositionDetails) => <span>{row.dayaLeft} days</span>,
      sortable: true,
      cellClassName: styles.weight600
    },
    {
      id: "status",
      header: "Status",
      render: (row: IPositionDetails) => {
        let statusClass = styles.statusOnTrack;
        if (row.Positionstatus === "Overdue") statusClass = styles.statusOverdue;
        else if (row.Positionstatus === "At Risk") statusClass = styles.statusAtRisk;
        return (
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {row.Positionstatus}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "actions",
      header: "Action",
      //  align: "left",
      // cellClassName: "data-table__cell--actions",
      render: (row: IPositionDetails) => (
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

  const getRowId = (row: IPositionDetails) => String(row.id);

  if (loading) {
    return (
      <div className={styles.tableCard} aria-label="Positions Table Loading">
        {/* Header & Filters Toolbar */}
        <div className={styles.tableCard__header}>
          <div className={styles.tableCard__titleRow}>
            <Lucide.AlertTriangle size={18} className={styles.warningIcon} style={{ opacity: 0.5 }} />
            <div className="dashboard-skeleton__bar" style={{ width: "220px", height: "16px" }} />
          </div>

          {/* Filters Toolbar */}
          <div className={styles.toolbar} style={{ opacity: 0.6 }}>
            <div className={styles.filtersGroup}>
              <div className="dashboard-skeleton__bar" style={{ width: "180px", height: "35px", borderRadius: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "150px", height: "35px", borderRadius: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "150px", height: "35px", borderRadius: "8px" }} />
            </div>
            <div className={styles.actionsGroup}>
              <div className="dashboard-skeleton__bar" style={{ width: "80px", height: "35px", borderRadius: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "80px", height: "35px", borderRadius: "8px" }} />
            </div>
          </div>
        </div>

        {/* Reusable DataTable Component Placeholder */}
        <div className={styles.tableWrapper}>
          <div className="dashboard-skeleton__table" style={{ padding: "10px 0" }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={`row-skel-${idx}`} className="dashboard-skeleton__row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: "20px", padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
                <div className="dashboard-skeleton__line" style={{ height: "12px", borderRadius: "4px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard} aria-label="Positions Table">
      {/* Header & Filters Toolbar */}
      <div className={styles.tableCard__header}>
        <div className={styles.tableCard__titleRow}>
          <Lucide.Briefcase size={16} className={styles.iconBlue} />
          <h3 className={styles.tableCard__title}> Positions Details</h3>
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
              disabled={isLoading || loading}
              title="Refresh Data"
            >
              <Lucide.RefreshCw size={14} className={(isLoading || loading) ? styles.spin : ""} />
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
          loading={isLoading || loading}
        />
      </div>

      {/* Change HR Dialog Modal Overlay */}
      {isChangeHrOpen && selectedPosition && (
        <Suspense fallback={null}>
          <AssignHRPopup
            isOpen={isChangeHrOpen}
            selectedItems={selectedItems}
            assignedMember={selectedMember}
            onClose={() => setIsChangeHrOpen(false)}
            oncancel={() => setIsChangeHrOpen(false)}
            onConfirm={handleConfirmChangeHR}
            changeHR={true}
            members={members}
          />
        </Suspense>
      )}
    </div>
  );
};

export default UpcomingPositionsTable;
