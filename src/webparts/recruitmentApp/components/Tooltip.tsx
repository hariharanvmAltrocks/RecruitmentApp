import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";

interface ToolTipButtonProps {
  Title: string;
  CurrentMenuId: number;
  Rowdata: any;
  ApproverData: any;
  TooltipHeader?: string;
  onHover: () => void;
}

const ToolTipButton: React.FC<ToolTipButtonProps> = ({
  Title,
  Rowdata,
  ApproverData,
  onHover,
  TooltipHeader,
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
        {TooltipHeader ? TooltipHeader : "Next Approver Name"}
      </div>
      {lines}
    </div>
  );

  const boldLabel = (label: string, value: string | undefined) => (
    <div style={{ display: "flex", marginBottom: 4 }}>
      <div
        style={{
          minWidth: 85,
          fontWeight: "bold",
          fontFamily: '"Roboto", sans-serif',
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: '"Roboto", sans-serif' }}>
        {" "}
        : {value ?? "—"}
      </div>
    </div>
  );

  const tooltipProps: ITooltipProps = {
    onRenderContent: () => {
      const data = ApproverData;

      if (!data) return <div>Loading...</div>;
      // if(ApproverData)
      return renderApproverList(
        data.map((item: any) => boldLabel(item.Key, item.Value))
      );
    },
  };

  return (
    <div className="button-container" style={{ float: "inline-start" }}>
      {Title}
      <TooltipHost
        tooltipProps={tooltipProps}
        delay={TooltipDelay.zero}
        id={tooltipId}
        directionalHint={DirectionalHint.bottomCenter}
        styles={hostStyles}
      >
        <img
          src={require("../assets/info.svg")}
          alt="tooltip-icon"
          onMouseEnter={() => {
            onHover(); // Notify parent to fetch based on status
          }}
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

export default ToolTipButton;
