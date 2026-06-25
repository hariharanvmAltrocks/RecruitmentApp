import React, { useState, useMemo } from "react";
import { Contract } from "../../Types";
import styles from "./Tables.module.scss";

interface UpcomingContractsTableProps {
  contracts: Contract[];
}

type SortKey = "contractName" | "endDate" | "remainingDays" | "requiredPositions" | "filledPositions" | "slaStatus";

export const UpcomingContractsTable: React.FC<UpcomingContractsTableProps> = ({ contracts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("remainingDays");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...contracts];

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.contractName.toLowerCase().includes(term) ||
          c.contractId.toLowerCase().includes(term) ||
          c.supplier.toLowerCase().includes(term) ||
          c.department.toLowerCase().includes(term) ||
          c.assignedHR.toLowerCase().includes(term)
      );
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
  }, [contracts, searchTerm, sortKey, sortAsc]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search upcoming/overdue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("contractName")} style={{ cursor: "pointer" }}>
                Contract Name {sortKey === "contractName" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>Department</th>
              <th>Supplier</th>
              <th>Assigned HR</th>
              <th onClick={() => handleSort("endDate")} style={{ cursor: "pointer" }}>
                End Date {sortKey === "endDate" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("remainingDays")} style={{ cursor: "pointer" }}>
                Days Left {sortKey === "remainingDays" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("requiredPositions")} style={{ cursor: "pointer" }}>
                Req. {sortKey === "requiredPositions" && (sortAsc ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("filledPositions")} style={{ cursor: "pointer" }}>
                Filled {sortKey === "filledPositions" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>Bal.</th>
              <th>Candidates</th>
              <th onClick={() => handleSort("slaStatus")} style={{ cursor: "pointer" }}>
                SLA Status {sortKey === "slaStatus" && (sortAsc ? "▲" : "▼")}
              </th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={12} className={styles.noData}>No contracts found</td>
              </tr>
            ) : (
              filteredAndSorted.map((c) => {
                let rowClass = styles.rowHover;
                if (c.slaStatus === "Overdue") {
                  rowClass = styles.rowOverdue;
                } else if (c.slaStatus === "At Risk") {
                  rowClass = styles.rowDueSoon;
                }

                let badgeClass = styles.badgeOnTrack;
                if (c.slaStatus === "Overdue") badgeClass = styles.badgeOverdue;
                else if (c.slaStatus === "At Risk") badgeClass = styles.badgeAtRisk;

                let priorityClass = styles.priorityLow;
                if (c.priority === "High") priorityClass = styles.priorityHigh;
                else if (c.priority === "Medium") priorityClass = styles.priorityMedium;

                return (
                  <tr key={c.id} className={rowClass}>
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
                          backgroundColor: "#e2e8f0", 
                          color: "#475569",
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
                    <td>{c.endDate}</td>
                    <td style={{ fontWeight: 700, color: c.remainingDays < 0 ? "#ef4444" : "#1e293b" }}>
                      {c.remainingDays < 0 ? `Overdue (${Math.abs(c.remainingDays)}d)` : `${c.remainingDays} days`}
                    </td>
                    <td style={{ textAlign: "center" }}>{c.requiredPositions}</td>
                    <td style={{ textAlign: "center" }}>{c.filledPositions}</td>
                    <td style={{ textAlign: "center", fontWeight: 600 }}>{c.balance}</td>
                    <td style={{ textAlign: "center" }}>{c.candidateCount}</td>
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UpcomingContractsTable;
