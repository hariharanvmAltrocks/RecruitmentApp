import React, { useMemo, useState } from "react";
import styles from "./TaskTable.module.scss";
import Card from "../Common/Card";
import Badge, { BadgeVariant } from "../Common/Badge";
import { DataTable, DataTableColumn } from "../../../Comman/DataTable/DataTable";
import { IHRTask } from "../Types";

interface TaskTableProps {
  data: IHRTask[] | undefined;
  loading?: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = useMemo<DataTableColumn<IHRTask>[]>(() => [
    {
      id: "task",
      header: "Task",
      render: (row) => <span className={styles.taskText}>{row.task}</span>,
      sortable: true,
    },
    {
      id: "priority",
      header: "Priority",
      render: (row) => {
        let badgeVar: BadgeVariant = "neutral";
        if (row.priority === "High") badgeVar = "danger";
        else if (row.priority === "Medium") badgeVar = "warning";
        else if (row.priority === "Low") badgeVar = "success";

        return <Badge variant={badgeVar}>{row.priority}</Badge>;
      },
      sortable: true,
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessor: "dueDate",
      cellClassName: styles.dueDateCell,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      render: (row) => {
        let badgeVar: BadgeVariant = "neutral";
        if (row.status === "Completed") badgeVar = "success";
        else if (row.status === "In Progress") badgeVar = "primary";
        else if (row.status === "Pending") badgeVar = "warning";

        return <Badge variant={badgeVar}>{row.status}</Badge>;
      },
      sortable: true,
    },
  ], []);

  const getRowId = (row: IHRTask) => row.id;

  const tasksList = data || [];

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Tasks</h3>
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
