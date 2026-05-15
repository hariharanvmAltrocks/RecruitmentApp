import React, { useState, useRef } from "react";
import "./StatusTooltip.css";
import { tooltipInterviewPanel } from "../../../services/Dashboard/IDashboard";

export interface TooltipEntry {
  Key: string;
  Value: string;
}

interface StatusTooltipProps {
  onHover?: () => Promise<void>;
  data: tooltipInterviewPanel | null | undefined;
  label?: string;
}

export const StatusTooltip: React.FC<StatusTooltipProps> = ({
  onHover,
  data,
  label = "Approver Names",
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const fetchedRef = useRef(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = async () => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }

    setVisible(true);

    if (!fetchedRef.current) {
      setLoading(true);
      await onHover?.();
      setLoading(false);
      fetchedRef.current = true;
    }
  };

  const handleMouseLeave = () => setVisible(false);

  const isNoData =
    !data ||
    (data.HR.Name === "" &&
      data.LineManager.Name === "" &&
      data.HOD.Name === "" &&
      data.Exco.Name === "" &&
      data.HRLead.Name === "");

  return (
    <div
      ref={anchorRef}
      className="status-tooltip__anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger icon */}
      <button
        className="status-tooltip__icon"
        type="button"
        aria-label="Pending approver info"
      >
        i
      </button>

      {/* Tooltip box */}
      {visible && (
        <div
          className="status-tooltip__box"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: "translateX(-50%)",
          }}
          role="tooltip"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {/* Title */}
          <div className="status-tooltip__title">{label}</div>

          {/* Loading state */}
          {loading ? (
            <div className="status-tooltip__loading">
              <span className="status-tooltip__spinner" />
              Loading…
            </div>
          ) : isNoData ? (
            /* Empty state */
            <div className="status-tooltip__loading">No data available</div>
          ) : (
            /* Rows */
            <div className="status-tooltip__list">
              {data!.LineManager.Name && (
                <div className="status-tooltip__row">
                  <span className="status-tooltip__key">
                    {data!.LineManager.Role}
                  </span>
                  <span className="status-tooltip__val">
                    : {data!.LineManager.Name}
                  </span>
                </div>
              )}
              {data!.HOD.Name && (
                <div className="status-tooltip__row">
                  <span className="status-tooltip__key">{data!.HOD.Role}</span>
                  <span className="status-tooltip__val">
                    : {data!.HOD.Name}
                  </span>
                </div>
              )}
              {data!.HR.Name && (
                <div className="status-tooltip__row">
                  <span className="status-tooltip__key">{data!.HR.Role}</span>
                  <span className="status-tooltip__val">: {data!.HR.Name}</span>
                </div>
              )}
              {data!.Exco.Name && (
                <div className="status-tooltip__row">
                  <span className="status-tooltip__key">{data!.Exco.Role}</span>
                  <span className="status-tooltip__val">
                    : {data!.Exco.Name}
                  </span>
                </div>
              )}
              {data!.HRLead.Name && (
                <div className="status-tooltip__row">
                  <span className="status-tooltip__key">
                    {data!.HRLead.Role}
                  </span>
                  <span className="status-tooltip__val">
                    : {data!.HRLead.Name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Arrow */}
          <div className="status-tooltip__arrow" />
        </div>
      )}
    </div>
  );
};
