import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
interface DataRow {
  [key: string]: string | number | undefined;
}

interface ToolTipButtonProps {
  Title: string;
  headers: { key: string; label: string }[];
  data: DataRow[];
  onHover?: () => void;
}

const ToolTipTable: React.FC<ToolTipButtonProps> = ({
  Title,
  headers,
  data,
  onHover,
}) => {
  const tooltipId = useId("tooltip");
  const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
  };

  const renderApproverList = (lines: React.ReactNode[]) => (
    <div style={{ fontFamily: "monospace", padding: 10 }}>
      <div
        style={{
          textDecoration: "underline",
          fontWeight: "bold",
          fontFamily: '"Roboto", sans-serif',
          fontSize: "16px",
          marginBottom: "8px",
        }}
      >
        {Title} {/*  Children Details */}
      </div>
      {lines}
    </div>
  );

  //   const boldLabel = (label: string, value: string | undefined) => (
  //     <div style={{ display: "flex", marginBottom: 4 }}>
  //       <div
  //         style={{
  //           minWidth: 85,
  //           fontWeight: "bold",
  //           fontFamily: '"Roboto", sans-serif',
  //         }}
  //       >
  //         {label}
  //       </div>
  //       <div style={{ fontFamily: '"Roboto", sans-serif' }}>
  //         {" "}
  //         : {value ?? "—"}
  //       </div>
  //     </div>
  //   );

  const tooltipProps: ITooltipProps = {
    onRenderContent: () => {
      const normalizedData = Array.isArray(data) ? data : data ? [data] : [];
      if (!normalizedData) return <div>Loading...</div>;
      return renderApproverList([
        <div style={{ maxHeight: "40vh", overflowY: "auto" }} key="customTable">
          <table
            className="normalTable"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily:
                '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
              fontSize: "14px",
              fontWeight: 600,
              color: "rgb(50, 49, 48)",
              boxSizing: "border-box",
              overflowWrap: "inherit",
            }}
          >
            <thead>
              <tr>
                {headers.map((f) => (
                  <th
                    key={f.key}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalizedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No Record Found
                  </td>
                </tr>
              ) : (
                normalizedData.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                  >
                    {headers.map((f) => (
                      <td
                        key={f.key}
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                      >
                        {item[f.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>,
      ]);
    },
  };

  return (
    <div className="button-container" style={{ float: "inline-start" }}>
      <TooltipHost
        tooltipProps={tooltipProps}
        delay={TooltipDelay.zero}
        id={tooltipId}
        directionalHint={DirectionalHint.bottomCenter}
        styles={hostStyles}
      >
        <img
          src={require("../../assets/info.svg")}
          alt="tooltip-icon"
          //   onMouseEnter={() => {
          //     onHover(); // Notify parent to fetch based on status
          //   }}
          style={{
            width: "20px",
            marginRight: "5px",
            padding: "3px",
            cursor: "pointer",
            height: "20px",
          }}
        />
      </TooltipHost>
    </div>
  );
};

export default ToolTipTable;
