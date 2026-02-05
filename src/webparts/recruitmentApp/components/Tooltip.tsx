import * as React from "react";
import {
  TooltipHost,
  TooltipDelay,
  DirectionalHint,
  ITooltipProps,
  ITooltipHostStyles,
} from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import {
  ActionName,
  DotTooltipStatus,
  PositionStatus,
} from "../utilities/LabelName";

interface ToolTipButtonProps {
  Title?: string;
  CurrentMenuId?: number;
  Rowdata?: any;
  ApproverData?: any;
  TooltipHeader?: string;
  onHover?: () => void;
  TooltipLabel?: string;
  BGDocs?: boolean;
}

const ToolTipButton: React.FC<ToolTipButtonProps> = ({
  Title,
  Rowdata,
  ApproverData,
  onHover,
  TooltipHeader,
  TooltipLabel,
  BGDocs,
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
        {TooltipHeader
          ? TooltipHeader
          : TooltipLabel
          ? TooltipLabel
          : BGDocs
          ? "Dot's Africa Verification"
          : "Next Approver Name"}
      </div>
      <div style={{ maxHeight: "20vh", overflowY: "auto" }}>{lines}</div>
    </div>
  );

  const boldLabel = (label: string, value: string | undefined) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        columnGap: 8,
        marginBottom: 4,
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      <div style={{ fontWeight: "bold" }}>{label}</div>

      <div
        style={{
          color:
            value === ActionName.Completed ||
            value === PositionStatus.RecruitmentInProgress ||
            value === DotTooltipStatus.Passed
              ? "green"
              : value === DotTooltipStatus.Pending
              ? "gray"
              : "red",
          fontWeight: "600",
        }}
      >
        : {value ?? "—"}
      </div>
    </div>
  );

  const tooltipProps: ITooltipProps = {
    onRenderContent: () => {
      const data = ApproverData;

      if (!data) return <div>Loading...</div>;
      if (ApproverData.length > 0 && typeof ApproverData != "string") {
        return renderApproverList(
          data.map((item: any) => boldLabel(item.Key, item.Value))
        );
      } else if (typeof ApproverData === "string") {
        return (
          <div>
            <p>{data}</p>
          </div>
        );
      } else {
        return (
          <div>
            <p>No Record Found</p>
          </div>
        );
      }
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
            if (onHover) onHover();
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
