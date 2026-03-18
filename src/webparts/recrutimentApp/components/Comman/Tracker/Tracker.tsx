import React, { useMemo } from "react";
import "./tracker.scss";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  rows: any[];
  selectedMetric: any;
  activeMetric: number;
  onRowClick?: (row: any) => void;
}

const Tracker: React.FC<Props> = ({
  rows,
  selectedMetric,
  activeMetric,
  onRowClick,
}) => {

  // 🔹 Exclude unwanted columns (optional)
  const excludeColumns = ["ID"];

  // 🔹 Generate dynamic columns
  const columns = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    return Object.keys(rows[0]).filter(
      (key) => !excludeColumns.includes(key)
    );
  }, [rows]);

  // 🔹 Format header (camelCase → Proper Text)
  const formatHeader = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // 🔹 Render cell safely
  const renderCell = (value: any) => {
    if (value === null || value === undefined) return "-";

    // Date formatting (basic check)
    if (typeof value === "string" && value.includes("-")) {
      return value;
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <motion.div
      className="tracker"
      key="tracker"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* 🔹 Header */}
      <div className="tracker__header">
        <div>
          <h2>My Tracker</h2>
          <p>
            Showing <b>{selectedMetric?.value ?? 0}</b> results for{" "}
            <span className="highlight">
              {selectedMetric?.label ?? "-"}
            </span>
          </p>
        </div>

        <button className="view-btn">View All Tasks</button>
      </div>

      {/* 🔹 Table */}
      <div className="tracker__table-wrapper">
        <table className="tracker__table">
          
          {/* 🔹 Dynamic Header */}
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{formatHeader(col)}</th>
              ))}
              {selectedMetric?.showArrow && <th />}
            </tr>
          </thead>

          {/* 🔹 Dynamic Body */}
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((col) => (
                    <td  key={col}>
                      <span className= {col ==="Status" ? "status-badge" : ""}>
                      {renderCell(row[col])}
                      </span>
                    </td>
                  ))}

                  {selectedMetric?.showArrow && (
                    <td className="arrow">
                      <ChevronRight size={16} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Tracker;