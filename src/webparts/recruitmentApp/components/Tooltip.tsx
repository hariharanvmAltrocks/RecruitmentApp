import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";

interface ToolTipButtonProps {
  Title: string;
  Rowdata: {
    Section?: string;
    DepartmentCode?: string;
  };
}

const ToolTipButton: React.FC<ToolTipButtonProps> = ({ Title, Rowdata }) => {
  const tooltipId = useId("tooltip");
  const hostStyles: Partial<ITooltipHostStyles> = { root: { display: "inline-block" } };

  const tooltipProps: ITooltipProps = {
    onRenderContent: () => (
      <ul style={{ margin: 10, padding: 0, listStyle: "none", textAlign: "left" }}>
        <li>{`Section Name: ${Rowdata?.Section || "N/A"}`}</li>
        <li>{`Department Code: ${Rowdata?.DepartmentCode || "N/A"}`}</li>
      </ul>
    ),
  };

  return (
    <div className="button-container" style={{ display: "inline-flex", alignItems: "center" }}>
      {Title}
      <TooltipHost
        tooltipProps={tooltipProps}
        delay={TooltipDelay.zero}
        id={tooltipId}
        directionalHint={DirectionalHint.bottomCenter}
        styles={hostStyles}
      >
        <img
          src={require("../../../assets/info.svg")}
          alt="tooltip-icon"
          style={{
            width: "20px",
            marginLeft: "5px",
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
