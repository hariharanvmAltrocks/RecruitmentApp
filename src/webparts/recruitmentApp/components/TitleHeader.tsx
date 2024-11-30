import * as React from "react";
import { Label } from "@fluentui/react";

interface FieldItems {
  value: string | any;
}

const LabelHeaderComponents: React.FC<FieldItems> = ({ value }) => {
  return (
    <>
      <Label className="title" style={{ fontSize: 18 }}>
        {value}
      </Label>
    </>
  );
};

export default LabelHeaderComponents;
