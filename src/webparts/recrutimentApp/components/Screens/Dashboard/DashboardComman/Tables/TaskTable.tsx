import React, { useMemo, useState } from "react";
import styles from "./TaskTable.module.scss";
import Card from "../../Common/Card";
import Badge, { BadgeVariant } from "../../Common/Badge";
import { DataTable, DataTableColumn } from "../../../../Comman/DataTable/DataTable";
import { IHRTask } from "../../Types";

interface TaskTableProps {
  data: IHRTask[] | undefined;
  loading?: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

   const columns = useMemo<DataTableColumn<IHRTask>[]>(() => [
      {
        id: "jobTitle",
        header: "Job Title",
        render: (row: IHRTask) => (
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
          render: (item: IHRTask) => (
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
        id: "filledcount",
        header: "Filled",
        accessor: "filledcount",
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
        id: "daysLeft",
        header: "Days Left",
        render: (row: IHRTask) => <span>{row.dayaLeft} days</span>,
        sortable: true,
        cellClassName: styles.weight600
      },
      {
        id: "status",
        header: "Status",
        render: (row: IHRTask) => {
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
    ], []);

  const getRowId = (row: IHRTask) => String(row.id);

  const tasksList = data || [];

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Tasks Tracker</h3>
      </div>
      <div className={styles.tableWrapper}>
        <DataTable
          columns={columns}
          data={tasksList}
          getRowId={getRowId}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={tasksList.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </div>
      <div className={styles.footer}>
        <a href="#/Tasks" className={styles.viewLink}>View all tasks</a>
      </div>
    </Card>
  );
};

export default TaskTable;
