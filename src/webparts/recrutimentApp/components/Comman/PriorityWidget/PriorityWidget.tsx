import React, { useState } from "react";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import "./priority-widget.scss";

export interface PriorityData {
  name: string;
  value: number;
  percent: number;
  color: string;
  iconType: "hr" | "onem";
}

interface PriorityWidgetProps {
  data: PriorityData[];
  total: number;
}

const PriorityWidget: React.FC<PriorityWidgetProps> = ({ data, total }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // const filteredData = data.filter(item => item.value > 0);
  const displayData = isExpanded ? data : data.slice(0, 3);
  const safeTotal = total || data.reduce((acc, curr) => acc + curr.value, 0);
  const hasMore = data.length > 3;

  return (
    <div className="priority-widget-dark">
      <div className="priority-widget-dark__header">
        <div>
          <h3 className="title">Analytics</h3>
          <p className="subtitle">SUMMARY</p>
        </div>
        <div className="icon-wrapper">
          <Activity size={20} className="activity-icon" />
        </div>
      </div>

      <div className="priority-widget-dark__body">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={2}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#131622",
                  borderColor: "#202538",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-center">
            <span className="total">{safeTotal}</span>
          </div>
        </div>

        <div className="list-container">
          {displayData.map((item, idx) => {
            const percentage =
              item.percent ||
              (safeTotal > 0 ? Math.round((item.value / safeTotal) * 100) : 0);
            return (
              <div key={idx} className="list-item">
                <div className="item-header">
                  <span className="item-name">{item.name}</span>
                  <span className="item-percent">{percentage}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {hasMore && (
            <button
              className="view-more-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "VIEW LESS" : "VIEW MORE"}
              {isExpanded ? (
                <ChevronUp size={12} strokeWidth={3} />
              ) : (
                <ChevronDown size={12} strokeWidth={3} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriorityWidget;
