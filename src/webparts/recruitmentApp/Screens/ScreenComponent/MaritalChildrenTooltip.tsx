import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { childrenDetails } from "../../Models/ApIInterface";

interface ToolTipButtonProps {
  data: childrenDetails[];
  onHover?: () => void;
}

const MaritalChildrenTooltip: React.FC<ToolTipButtonProps> = ({
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
        Children Details
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
      if (!data) return <div>Loading...</div>;
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
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Age
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Gender
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No Record Found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                  >
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.name}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.age}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {item.genderId}
                    </td>
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

export default MaritalChildrenTooltip;
