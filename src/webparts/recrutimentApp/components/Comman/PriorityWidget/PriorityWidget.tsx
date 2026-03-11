import React from "react";
import "./priority-widget.scss";

export interface PriorityData {
    name: string;
    value: number;
    percent: number;
    color: string;
}

interface PriorityWidgetProps {
    data: PriorityData[];
    total: number;
}

const PriorityWidget: React.FC<PriorityWidgetProps> = ({ data, total }) => {
    return (
        <div className="priority-widget">
            <div className="header">
                <h3>Priority Tasks</h3>
                <button className="manage-btn">Manage</button>
            </div>

            <div className="priority-circle-wrapper">
                <div className="circular-chart-container">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {data.map((item, i) => {
                            const offset = i === 0 ? 0 : data.slice(0, i).reduce((acc, curr) => acc + curr.percent, 0);
                            return (
                                <path key={i} className="circle"
                                    strokeDasharray={`${item.percent}, 100`}
                                    strokeDashoffset={-(offset)}
                                    style={{ stroke: item.color }}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            );
                        })}
                    </svg>
                    <div className="total-count">
                        <span className="count">{total.toString().padStart(2, "0")}</span>
                        <span className="label">PENDINGS</span>
                    </div>
                </div>

                <div className="list">
                    {data.map((item, i) => (
                        <div key={i} className="item">
                            <div className="top">
                                <span className="item-name"><span className="icon-bolt" style={{ color: item.color }}>⚡</span> {item.value} Tasks</span>
                                <span className="item-percent">{item.percent}%</span>
                            </div>
                            <div className="label">{item.name.toUpperCase()}</div>
                            <div className="bar">
                                <div
                                    className="fill"
                                    style={{ width: `${item.percent}%`, background: item.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="process-btn">Process All Pendings</button>
        </div>
    );
};

export default PriorityWidget;