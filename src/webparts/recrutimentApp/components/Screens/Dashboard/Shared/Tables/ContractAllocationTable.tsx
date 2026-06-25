import React, { useState, useMemo } from "react";
import { Contract } from "../../Types";
import ProgressBar from "../Charts/ProgressBar";
import styles from "./Tables.module.scss";

interface ContractAllocationTableProps {
  contracts: Contract[];
  onViewContract?: (contract: Contract) => void;
}

type AllocationSortKey = "contractName" | "requiredPositions" | "filledPositions" | "balance" | "candidateCount" | "slaProgress" | "remainingDays";

export const ContractAllocationTable: React.FC<ContractAllocationTableProps> = ({ 
  contracts,
  onViewContract 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [selectedHR, setSelectedHR] = useState("All HR's");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [sortKey, setSortKey] = useState<AllocationSortKey>("contractName");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (key: AllocationSortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Get unique lists for filters
  const filterOptions = useMemo(() => {
    const depts = new Set<string>();
    const suppliers = new Set<string>();
    const hrs = new Set<string>();
    const statuses = new Set<string>();

    contracts.forEach((c) => {
      if (c.department) depts.add(c.department);
      if (c.supplier) suppliers.add(c.supplier);
      if (c.assignedHR) hrs.add(c.assignedHR);
      if (c.status) statuses.add(c.status);
    });

    return {
      departments: ["All Departments", ...Array.from(depts)],
      suppliers: ["All Suppliers", ...Array.from(suppliers)],
      hrs: ["All HR's", ...Array.from(hrs)],
      statuses: ["All Status", ...Array.from(statuses)]
    };
  }, [contracts]);

  // Filter and sort contracts
  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.contractName.toLowerCase().includes(term) ||
          c.contractId.toLowerCase().includes(term) ||
          c.supplier.toLowerCase().includes(term) ||
          c.department.toLowerCase().includes(term)
      );
    }

    // Dropdown filters
    if (selectedDept !== "All Departments") {
      result = result.filter((c) => c.department === selectedDept);
    }
    if (selectedSupplier !== "All Suppliers") {
      result = result.filter((c) => c.supplier === selectedSupplier);
    }
    if (selectedHR !== "All HR's") {
      result = result.filter((c) => c.assignedHR === selectedHR);
    }
    if (selectedStatus !== "All Status") {
      result = result.filter((c) => c.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [contracts, searchTerm, selectedDept, selectedSupplier, selectedHR, selectedStatus, sortKey, sortAsc]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredContracts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredContracts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.tableContainer}>
      {/* Filters Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search contracts, suppliers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.filtersGroup}>
          <select
            className={styles.filterSelect}
            value={selectedSupplier}
            onChange={(e) => {
              setSelectedSupplier(e.target.value);
              setCurrentPage(1);
            }}
          >
            {filterOptions.suppliers.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
          >
            {filterOptions.departments.map((d, idx) => (
              <option key={idx} value={d}>{d}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedHR}
            onChange={(e) => {
              setSelectedHR(e.target.value);
              setCurrentPage(1);
            }}
          >
            {filterOptions.hrs.map((h, idx) => (
              <option key={idx} value={h}>{h}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            {filterOptions.statuses.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", fontWeight: 600, color: "#1e3a8a", padding: "0 8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block", animation: "pulse 2s infinite" }} />
            LIVE STATUS
          </div>
        </div>
      </div>

      {/* Table Element */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("contractName")} style={{ cursor: "pointer" }}>
                Contract Name & ID {sortKey === "contractName" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>Department</th>
              <th>Supplier</th>
              <th>Assigned HR</th>
              <th onClick={() => handleSort("requiredPositions")} style={{ cursor: "pointer" }}>
                Req. {sortKey === "requiredPositions" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("filledPositions")} style={{ cursor: "pointer" }}>
                Filled {sortKey === "filledPositions" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("balance")} style={{ cursor: "pointer" }}>
                Bal. {sortKey === "balance" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("candidateCount")} style={{ cursor: "pointer" }}>
                Candidates {sortKey === "candidateCount" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>Progress</th>
              <th onClick={() => handleSort("slaProgress")} style={{ cursor: "pointer" }}>
                SLA {sortKey === "slaProgress" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>SLA Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.length === 0 ? (
              <tr>
                <td colSpan={13} className={styles.noData}>No contracts found matching filters</td>
              </tr>
            ) : (
              paginatedContracts.map((c) => {
                let badgeClass = styles.badgeOnTrack;
                if (c.slaStatus === "Overdue") badgeClass = styles.badgeOverdue;
                else if (c.slaStatus === "At Risk") badgeClass = styles.badgeAtRisk;

                let priorityClass = styles.priorityLow;
                if (c.priority === "High") priorityClass = styles.priorityHigh;
                else if (c.priority === "Medium") priorityClass = styles.priorityMedium;

                const completionPct = c.requiredPositions > 0 ? Math.round((c.filledPositions / c.requiredPositions) * 100) : 0;

                return (
                  <tr key={c.id} className={styles.rowHover}>
                    <td style={{ fontWeight: 600 }}>
                      <div>{c.contractName}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{c.contractId}</div>
                    </td>
                    <td>{c.department}</td>
                    <td>{c.supplier}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ 
                          width: "24px", 
                          height: "24px", 
                          borderRadius: "50%", 
                          backgroundColor: "#dbeafe", 
                          color: "#1e40af",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          fontWeight: 700
                        }}>
                          {c.assignedHR.substring(0, 2).toUpperCase()}
                        </span>
                        {c.assignedHR}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>{c.requiredPositions}</td>
                    <td style={{ textAlign: "center" }}>{c.filledPositions}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{c.balance}</td>
                    <td style={{ textAlign: "center" }}>{c.candidateCount}</td>
                    <td style={{ width: "120px" }}>
                      <ProgressBar value={completionPct} showLabel={false} />
                    </td>
                    <td style={{ fontWeight: 700 }}>{c.slaProgress}%</td>
                    <td>
                      <span className={`${styles.badge} ${badgeClass}`}>
                        {c.slaStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.priorityBadge} ${priorityClass}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.viewButton}
                        onClick={() => onViewContract && onViewContract(c)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredContracts.length)} of {filteredContracts.length} entries
          </div>
          <div className={styles.paginationButtons}>
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContractAllocationTable;
