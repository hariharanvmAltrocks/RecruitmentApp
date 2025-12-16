import * as React from "react";
import { Label } from "@fluentui/react";

interface FieldItems {
  value: string | any;
  Style?: React.CSSProperties;
}

const LabelHeaderComponents: React.FC<FieldItems> = ({ value, Style }) => {
  return (
    <>
      <Label className="title" style={{ fontSize: 18, ...Style }}>
        {value}
      </Label>
    </>
  );
};

export default LabelHeaderComponents;
