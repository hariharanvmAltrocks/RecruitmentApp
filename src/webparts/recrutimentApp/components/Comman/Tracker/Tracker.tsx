import React from "react";
import "./tracker.scss";
import { ChevronRight } from "lucide-react";
import { DataSyncToRecruitmentResponse } from "../../../services/Dashboard/IDashboard";

interface Props {
    rows: DataSyncToRecruitmentResponse[];
    selectedMetric: any;
    activeMetric: number;
    onRowClick?: (row: DataSyncToRecruitmentResponse) => void;
}

const Tracker: React.FC<Props> = ({
    rows,
    selectedMetric,
    activeMetric,
    onRowClick
}) => {
    return (
        <div className="tracker">
            <div className="tracker__header">
                <div>
                    <h2>My Tracker</h2>
                    <p>
                        Showing <b>{selectedMetric?.value}</b> results for{" "}
                        <span className="highlight">{selectedMetric?.label}</span>
                    </p>
                </div>

                <button className="view-btn">View All Tasks</button>
            </div>

            <div className="tracker__table-wrapper">
                <table className="tracker__table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Vacancies</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.ID} onClick={() => onRowClick && onRowClick(row)}>
                                <td>
                                    <div className="title">{row.JobTitleEnglish}</div>
                                    <div className="jobcode">Job Code: {row.JobCode}</div>
                                </td>

                                <td className="center">{row.NumberOfPersonNeeded}</td>

                                <td>{row.Type}</td>

                                <td>
                                    <span className="status">{row.Status}</span>
                                </td>

                                <td className="arrow">
                                    {selectedMetric?.showArrow && <ChevronRight size={16} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tracker;