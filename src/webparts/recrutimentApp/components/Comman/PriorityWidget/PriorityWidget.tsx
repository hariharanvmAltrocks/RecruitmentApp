import React from "react";
import { ClipboardList, Zap } from "lucide-react";
import "./priority-widget.scss";

export interface PriorityData {
    name: string;
    value: number;
    percent: number;
    color: string;
    iconType: 'hr' | 'onem'; 
}

interface PriorityWidgetProps {
    data: PriorityData[];
    total: number;
}

const PriorityWidget: React.FC<PriorityWidgetProps> = ({ data, total }) => {
    return (
        <div className="priority-widget">
            <div className="header">
                <div className="title-group">
                    <span className="dot"></span>
                    <h3>PRIORITY TASKS</h3>
                </div>
                <button className="manage-btn">Manage</button>
            </div>

            <div className="widget-body">
                {/* Circular Chart Section */}
                <div className="chart-section">
                    <svg viewBox="0 0 100 100" className="circular-chart">
                        {/* Background Circle */}
                        <circle className="circle-bg" cx="50" cy="50" r="40" />
                        
                        {/* Segments */}
                        {data.map((item, i) => {
                            // Calculating offset for the donut segments
                            // 251.2 is the circumference for r=40 (2 * pi * 40)
                            const circumference = 251.2;
                            const dashArray = (item.percent / 100) * circumference;
                            
                            // We calculate offset. Note: SVG circles start at 3 o'clock. 
                            // We adjust to match the visual start point.
                            let offset = 0;
                            if (i > 0) {
                                const prevPercent = data.slice(0, i).reduce((acc, curr) => acc + curr.percent, 0);
                                offset = (prevPercent / 100) * circumference;
                            }

                            return (
                                <circle
                                    key={i}
                                    className="circle-segment"
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke={item.color}
                                    strokeDasharray={`${dashArray} ${circumference}`}
                                    strokeDashoffset={-offset}
                                    transform="rotate(-90 50 50)" // Start from top
                                />
                            );
                        })}
                    </svg>
                    <div className="chart-center-text">
                        <span className="total-number">{total}</span>
                        <span className="total-label">PENDINGS</span>
                    </div>
                </div>

                {/* List Section */}
                <div className="task-list">
                    {data.map((item, i) => (
                        <div key={i} className="task-item">
                            <div className="item-row">
                                <div className="icon-box" style={{ backgroundColor: `${item.color}15` }}>
                                    {item.iconType === 'hr' ? (
                                        <ClipboardList size={16} color={item.color} />
                                    ) : (
                                        // <CloudUpload size={16} color={item.color} />
                                        <></>
                                    )}
                                </div>
                                <div className="text-content">
                                    <div className="stats">
                                        <span className="count">{item.value} Tasks</span>
                                        <span className="percent">{item.percent}%</span>
                                    </div>
                                    <div className="name">{item.name}</div>
                                </div>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bg">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="process-all-btn">
                <Zap size={18} fill="white" />
                Process All Pendings
            </button>
        </div>
    );
};

export default PriorityWidget;