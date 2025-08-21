import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { employeeReferenceDetail } from "../../Models/ApIInterface";

interface ToolTipButtonProps {
  data: employeeReferenceDetail | undefined;
  onHover?: () => void;
}

const EmployeeDetailsTooltip: React.FC<ToolTipButtonProps> = ({
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
        Reference Employee Details
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
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Employee ID
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Employee Name
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Employee Email
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Employee Company
                </th>
              </tr>
            </thead>
            <tbody>
              {data.empId === "" ? (
                <tr>
                  <td
                    colSpan={2}
                    style={{ textAlign: "center", padding: "8px" }}
                  >
                    No Record Found
                  </td>
                </tr>
              ) : (
                <tr
                  style={{
                    backgroundColor: "#fff",
                  }}
                >
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {data.empId}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {data.empName}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {data.empEmail}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {data.company}
                  </td>
                </tr>
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

export default EmployeeDetailsTooltip;
