import * as React from "react";
import { Label } from "@fluentui/react";

interface FieldItems {
  value: string | any;
}

const LabelValue: React.FC<FieldItems> = ({ value }) => {
  return (
    <>
      {value || value === 0 ? (
        <Label style={{ backgroundColor: "#ebe9e9" }}>{value}</Label>
      ) : (
        <Label style={{ backgroundColor: "#ebe9e9", height: "32px" }}></Label>
      )}
    </>
  );
};

export default LabelValue;
