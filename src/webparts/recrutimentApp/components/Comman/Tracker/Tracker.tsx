import React, { useMemo, useState } from "react";
import "./tracker.scss";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { DataTable, DataTableColumn } from "../DataTable/DataTable";

export interface TrackerItem {
  [key: string]: any;
}

interface Props {
  rows: TrackerItem[];
  selectedMetric: any;
  activeMetric: number;
  onRowClick?: (row: TrackerItem) => void;
}

const Tracker: React.FC<Props> = ({
  rows,
  selectedMetric,
  activeMetric,
  onRowClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 🔹 Exclude unwanted columns (optional)
  const excludeColumns = useMemo(() => ["ID"], []);

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

    return String(value);
  };

  // 🔹 Generate dynamic columns
  const columns: DataTableColumn<TrackerItem>[] = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const dynamicKeys = Object.keys(rows[0]).filter(
      (key) => !excludeColumns.includes(key)
    );

    const generatedCols: DataTableColumn<TrackerItem>[] = dynamicKeys.map(
      (key) => ({
        id: key,
        header: formatHeader(key),
        accessor: key as keyof TrackerItem,
        render: (item) => {
          const value = item[key];
          const formattedValue = renderCell(value);

          if (key === "JobCode" && item.JobCode) {
            return <span className="candidate-table__code">{formattedValue}</span>
          }

          if (key === "JobTitle" && item.JobTitle) {
            return <span className="data-table__job-title">{formattedValue}</span>
          }

          if (key === "ApplicantName" && item.ApplicantName) {
            return <span className="candidate-table__code">{formattedValue}</span>
          }

          if (key === "PositionTitle" && item.PositionTitle) {
            return <span className="data-table__job-title">{formattedValue}</span>
          }

          if (key === "InterviewDate" && item.InterviewDate) {
            return <span className="candidate-table__code">{formattedValue}</span>
          }

          if (key === "PositionID" && item.PositionID) {
            return <span className="candidate-table__code">{formattedValue}</span>
          }

          if (key === "Status" || key === "status") {
            return <span className="status-badge">{formattedValue}</span>;
          }

          return <>{formattedValue}</>;
        },
      })
    );


    if (selectedMetric?.showArrow) {
      generatedCols.push({
        id: "actionArrow",
        header: "",
        align: "right",
        width: 50,
        render: () => (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
            }}
          >
            <motion.div
              whileHover={{ x: 5, color: "#3F62ED" }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ChevronRight size={16} />
            </motion.div>
          </div>
        ),
      });
    }

    return generatedCols;
  }, [rows, excludeColumns, selectedMetric?.showArrow]);

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
        <DataTable<TrackerItem>
          columns={columns}
          data={rows}
          loading={false}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={rows.length}
          emptyMessage="No data available"
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onRowClick={onRowClick}
        />
      </div>
    </motion.div>
  );
};

export default Tracker;