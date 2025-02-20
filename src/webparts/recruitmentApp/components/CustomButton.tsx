import * as React from "react";
import { PrimaryButton } from "@fluentui/react";

interface CustomButtonProps {
  text?: string;
  iconName?: string;
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  iconName,
  onClick,
  disabled = false,
  style = {},
}) => {
  return (
    <div
      style={{
        lineHeight: "100%",
        display: "block",
        fontWeight: 600,
      }}
    >
      <PrimaryButton
        style={{
          borderColor: "rgb(205, 45, 45)",
          backgroundColor: "#EF3340",
          color: "white",
          borderRadius: "5px",
          minWidth: "60px",
          height: "39px",
          ...style,
        }}
        onClick={onClick}
        disabled={disabled}
        iconProps={
          iconName ? { iconName, style: { color: "white" } } : undefined
        }
      >
        {text}
      </PrimaryButton>
    </div>
  );
};

export default CustomButton;
