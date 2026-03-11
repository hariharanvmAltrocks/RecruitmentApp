import React from "react";
import "./urgent-widget.scss";
import { AlertCircle } from "lucide-react";

interface UrgentTask {
    title: string;
    subtitle: string;
    overdue: string;
    type: "error" | "warning";
}

interface UrgentWidgetProps {
    tasks: UrgentTask[];
}

const UrgentWidget: React.FC<UrgentWidgetProps> = ({ tasks }) => {
    return (
        <div className="urgent-widget">
            <div className="urgent-widget__header">
                <div className="urgent-widget__title">
                    <AlertCircle size={16} className="urgent-widget__icon" />
                    <span>Urgent</span>
                </div>

                <span className="urgent-widget__count">
                    {tasks.length} TASK{tasks.length > 1 ? "S" : ""}
                </span>
            </div>

            <div className="urgent-widget__list">
                {tasks.map((task, index) => (
                    <div key={index} className="urgent-widget__task">
                        <div className="urgent-widget__task-header">
                            <div>
                                <div className="urgent-widget__task-title">{task.title}</div>
                                <div className="urgent-widget__task-subtitle">
                                    {task.subtitle}
                                </div>
                            </div>

                            <span
                                className={`urgent-widget__badge ${task.type === "error"
                                        ? "urgent-widget__badge--error"
                                        : "urgent-widget__badge--warning"
                                    }`}
                            >
                                {task.overdue}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrgentWidget;